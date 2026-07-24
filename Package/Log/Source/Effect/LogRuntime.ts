/**
 *
 *
 * @module @sorrell/log/Effect/LogRuntime
 *
 * @file      LogRuntime.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Context,
    Data,
    Effect,
    Layer as EffectLayer,
    type LogLevel
} from "effect";
import * as Category from "../Category.js";
import type { CategoryInput } from "../Category.js";
import * as Filter from "../Filter.js";
import type {
    ApplicationMetadata,
    LogInput,
    LogRecord,
    ProcessMetadata
} from "../LogRecord.js";
import type { LogValue } from "../LogValue.js";
import {
    DefaultOptions as DefaultNormalizeOptions,
    Normalize,
    type NormalizeOptions
} from "../Normalize.js";
import { Redacted } from "../Redacted.js";
import type { LogSink } from "../Sink.js";

/** Behavior used when the runtime input queue reaches capacity. */
export type OverflowStrategy = "DropNewest" | "DropOldest" | "Backpressure";

/** Bounded input queue configuration. */
export interface QueueOptions
{
    readonly Capacity: number;
    readonly OverflowStrategy: OverflowStrategy;
}

/** Complete configuration for a logging runtime. */
export interface LogRuntimeOptions extends Filter.FilterOptions
{
    readonly Application?: ApplicationMetadata;
    readonly Process?: ProcessMetadata;
    readonly DefaultCategory?: CategoryInput;
    readonly Normalize?: Partial<NormalizeOptions>;
    readonly Queue?: Partial<QueueOptions>;
    readonly RedactedKeys?: ReadonlyArray<string>;
    readonly Sinks: ReadonlyArray<LogSink>;
    readonly Now?: () => Date;
}

/** A flush or shutdown failure exposed through the Effect lifecycle API. */
export class LogRuntimeError extends Data.TaggedError("LogRuntimeError")<{
    readonly Cause: unknown;
    readonly Operation: "Flush" | "Shutdown";
}> { }

/** Runtime operations shared by Effect, JavaScript, React, and native adapters. */
export interface Service
{
    readonly DefaultCategory: Category.Category;
    readonly Publish: (Input: LogInput) => Effect.Effect<void>;
    readonly PublishUnsafe: (Input: LogInput) => void;
    readonly Flush: Effect.Effect<void, LogRuntimeError>;
    readonly Shutdown: Effect.Effect<void, LogRuntimeError>;
    readonly IsShutdown: () => boolean;
    readonly DroppedCount: () => number;
}

/** Effect context service containing the active logging runtime. */
export class LogRuntime extends Context.Service<LogRuntime, Service>()(
    "@sorrell/log/LogRuntime"
) { }

interface RuntimeState
{
    Active: boolean;
    Draining: boolean;
    Dropped: number;
    Queue: Array<LogInput>;
    Sequence: number;
    Shutdown: boolean;
    Waiters: Array<() => void>;
}

const DefaultQueue: QueueOptions = {
    Capacity: 1_024,
    OverflowStrategy: "DropNewest"
};

/**
 *
 */
function InfrastructureFallback(
    Sink: string,
    ErrorValue: unknown,
    LastReports: Map<string, number>
): void
{
    const Detail = ErrorValue instanceof Error ? ErrorValue.message : String(ErrorValue);
    const Key = `${ Sink }:${ Detail }`;
    const Current = Date.now();
    const Last = LastReports.get(Key) ?? 0;

    if (Current - Last < 5_000)
    {
        return;
    }

    LastReports.set(Key, Current);

    try
    {
        globalThis.console?.error(`@sorrell/log: ${ Sink } failed: ${ Detail }`);
    }
    catch
    {
        // A fallback failure has no safe downstream reporting path.
    }
}

/**
 *
 */
function AwaitIdle(State: RuntimeState): Promise<void>
{
    if (!State.Draining && State.Queue.length === 0)
    {
        return Promise.resolve();
    }

    return new Promise<void>((Resolve: () => void) =>
    {
        State.Waiters.push(Resolve);
    });
}

/**
 *
 */
function NotifyIdle(State: RuntimeState): void
{
    if (State.Draining || State.Queue.length > 0)
    {
        return;
    }

    const Waiters = State.Waiters.splice(0);
    for (const Resolve of Waiters)
    {
        Resolve();
    }
}

/**
 *
 */
function AsTimestamp(Input: Date | string | undefined, Now: () => Date): string
{
    try
    {
        const Value = Input === undefined
            ? Now()
            : typeof Input === "string"
                ? new Date(Input)
                : Input;

        return Number.isNaN(Value.getTime()) ? Now().toISOString() : Value.toISOString();
    }
    catch
    {
        return new Date(0).toISOString();
    }
}

/**
 *
 */
function NormalizeAnnotations(
    Input: Readonly<Record<string, unknown>> | undefined,
    Options: NormalizeOptions,
    RedactedKeys: ReadonlySet<string>
): Readonly<Record<string, ReturnType<typeof Normalize>>>
{
    const Output: Record<string, ReturnType<typeof Normalize>> = { };

    for (const [ Key, Value ] of Object.entries(Input ?? { }))
    {
        Output[Key] = RedactedKeys.has(Key.toLocaleLowerCase())
            ? Normalize(Redacted(Value, Key), Options)
            : Normalize(Value, Options);
    }

    return Output;
}

/**
 *
 */
function PreNormalizedAnnotations(
    Input: Readonly<Record<string, unknown>> | undefined
): Readonly<Record<string, LogValue>>
{
    return (Input ?? { }) as Readonly<Record<string, LogValue>>;
}

/**
 *
 */
function NormalizeRecord(
    Input: LogInput,
    Sequence: number,
    Options: {
        readonly Application?: ApplicationMetadata;
        readonly DefaultCategory: Category.Category;
        readonly Normalize: NormalizeOptions;
        readonly Now: () => Date;
        readonly Process?: ProcessMetadata;
        readonly RedactedKeys: ReadonlySet<string>;
    }
): LogRecord
{
    const CategoryValue = Input.Category === undefined
        ? Options.DefaultCategory
        : Category.Make(Input.Category);
    const Application = Input.Application ?? Options.Application;
    const ProcessValue = Input.Process ?? Options.Process;
    const Timestamp = AsTimestamp(Input.Timestamp, Options.Now);

    return {
        Annotations: Input.Normalized === true
            ? PreNormalizedAnnotations(Input.Annotations)
            : NormalizeAnnotations(
                Input.Annotations,
                Options.Normalize,
                Options.RedactedKeys
            ),
        ...(Application === undefined ? { } : { Application }),
        Category: CategoryValue,
        ...(Input.Cause === undefined
            ? { }
            : {
                Cause: Input.Normalized === true
                    ? Input.Cause as LogValue
                    : Normalize(Input.Cause, Options.Normalize)
            }),
        ...(Input.Fiber === undefined ? { } : { Fiber: Input.Fiber }),
        ...(Input.Global === undefined
            ? { }
            : {
                Global: Input.Normalized === true
                    ? Input.Global as LogRecord["Global"] & { }
                    : {
                        Definition: Input.Global.Definition,
                        UpdatedAt: Timestamp,
                        Value: Normalize(Input.Global.Value, Options.Normalize)
                    }
            }),
        Level: Input.Level,
        Message: Input.Normalized === true
            ? Input.Message as ReadonlyArray<LogValue>
            : Input.Message.map(
                (Value: unknown) => Normalize(Value, Options.Normalize)
            ),
        ...(ProcessValue === undefined ? { } : { Process: ProcessValue }),
        SchemaVersion: 1,
        Sequence,
        Source: Input.Source,
        Spans: Input.Spans ?? [],
        Timestamp
    };
}

/** Construct a standalone runtime. Use `RuntimeLayer` for scoped Effect ownership. */
export function Make(Options: LogRuntimeOptions): Service
{
    const DefaultCategory = Category.Make(Options.DefaultCategory ?? "Application");
    const QueueOptions: QueueOptions = {
        ...DefaultQueue,
        ...Options.Queue
    };

    if (!Number.isSafeInteger(QueueOptions.Capacity) || QueueOptions.Capacity <= 0)
    {
        throw new RangeError("The logging queue capacity must be a positive safe integer.");
    }

    const NormalizeOptions: NormalizeOptions = {
        ...DefaultNormalizeOptions,
        ...Options.Normalize
    };
    const RedactedKeys = new Set(
        (Options.RedactedKeys ?? [ "password", "token", "authorization", "cookie" ])
            .map((Key: string) => Key.toLocaleLowerCase())
    );
    const State: RuntimeState = {
        Active: false,
        Draining: false,
        Dropped: 0,
        Queue: [],
        Sequence: 0,
        Shutdown: false,
        Waiters: []
    };
    const LastReports = new Map<string, number>();

    const Dispatch = async (Record: LogRecord): Promise<void> =>
    {
        await Promise.all(Options.Sinks.map(async (Sink: LogSink): Promise<void> =>
        {
            try
            {
                if (Sink.Accepts?.(Record) === false)
                {
                    return;
                }

                await Effect.runPromise(Sink.Write(Record));
            }
            catch (ErrorValue)
            {
                InfrastructureFallback(Sink.Name, ErrorValue, LastReports);
            }
        }));
    };

    const Drain = async (): Promise<void> =>
    {
        if (State.Draining)
        {
            return;
        }

        State.Draining = true;

        try
        {
            while (State.Queue.length > 0)
            {
                const Input = State.Queue.shift();
                if (Input === undefined)
                {
                    continue;
                }

                try
                {
                    State.Sequence += 1;
                    await Dispatch(NormalizeRecord(Input, State.Sequence, {
                        ...(Options.Application === undefined
                            ? { }
                            : { Application: Options.Application }),
                        DefaultCategory,
                        Normalize: NormalizeOptions,
                        Now: Options.Now ?? (() => new Date()),
                        ...(Options.Process === undefined ? { } : { Process: Options.Process }),
                        RedactedKeys
                    }));
                }
                catch (ErrorValue)
                {
                    InfrastructureFallback("Runtime", ErrorValue, LastReports);
                }

                if (State.Dropped > 0 && State.Queue.length < QueueOptions.Capacity)
                {
                    const Dropped = State.Dropped;
                    State.Dropped = 0;
                    State.Queue.unshift({
                        Annotations: { Dropped },
                        Category: DefaultCategory,
                        Level: "Warn",
                        Message: [
                            `Dropped ${ Dropped } log records because the logging queue was full.`
                        ],
                        Source: "JavaScript"
                    });
                }
            }
        }
        finally
        {
            State.Draining = false;
            NotifyIdle(State);
        }
    };

    const ScheduleDrain = (): void =>
    {
        if (State.Active)
        {
            return;
        }

        State.Active = true;
        queueMicrotask(() =>
        {
            State.Active = false;
            void Drain();
        });
    };

    const PublishUnsafe = (Input: LogInput): void =>
    {
        try
        {
            if (State.Shutdown)
            {
                return;
            }

            const CategoryValue = Input.Category ?? DefaultCategory;
            if (!Filter.Accepts(Input.Level, CategoryValue, Options))
            {
                return;
            }

            if (State.Queue.length >= QueueOptions.Capacity)
            {
                State.Dropped += 1;

                if (QueueOptions.OverflowStrategy === "DropOldest")
                {
                    State.Queue.shift();
                    State.Queue.push(Input);
                    ScheduleDrain();
                }

                return;
            }

            State.Queue.push(Input);
            ScheduleDrain();
        }
        catch (ErrorValue)
        {
            InfrastructureFallback("Runtime", ErrorValue, LastReports);
        }
    };

    const FlushPromise = async (): Promise<void> =>
    {
        ScheduleDrain();
        await AwaitIdle(State);

        const Results = await Promise.allSettled(Options.Sinks.map(async (Sink: LogSink) =>
        {
            await Effect.runPromise(Sink.Flush);
        }));
        const Failure = Results.find(
            (Result: PromiseSettledResult<void>) => Result.status === "rejected"
        );

        if (Failure?.status === "rejected")
        {
            throw Failure.reason;
        }
    };

    const ShutdownPromise = async (): Promise<void> =>
    {
        if (State.Shutdown)
        {
            return;
        }

        State.Shutdown = true;
        await FlushPromise();

        const Results = await Promise.allSettled(Options.Sinks.map(async (Sink: LogSink) =>
        {
            await Effect.runPromise(Sink.Shutdown);
        }));
        const Failure = Results.find(
            (Result: PromiseSettledResult<void>) => Result.status === "rejected"
        );

        if (Failure?.status === "rejected")
        {
            throw Failure.reason;
        }
    };

    return {
        DefaultCategory,
        DroppedCount: (): number => State.Dropped,
        Flush: Effect.tryPromise({
            catch: (Cause: unknown) => new LogRuntimeError({
                Cause,
                Operation: "Flush"
            }),
            try: FlushPromise
        }),
        IsShutdown: (): boolean => State.Shutdown,
        Publish: (Input: LogInput): Effect.Effect<void> =>
            Effect.sync(() => PublishUnsafe(Input)),
        PublishUnsafe,
        Shutdown: Effect.tryPromise({
            catch: (Cause: unknown) => new LogRuntimeError({
                Cause,
                Operation: "Shutdown"
            }),
            try: ShutdownPromise
        })
    };
}

/** Construct the scoped runtime service without installing an Effect logger. */
export function RuntimeLayer(
    Options: LogRuntimeOptions
): EffectLayer.Layer<LogRuntime>
{
    return EffectLayer.effect(
        LogRuntime,
        Effect.acquireRelease(
            Effect.sync(() => Make(Options)),
            (Runtime: Service) => Runtime.Shutdown.pipe(Effect.ignore)
        )
    );
}

/** Narrow an arbitrary string to an emitted Effect severity. */
export function IsSeverity(Value: unknown): Value is LogLevel.Severity
{
    return Value === "Fatal"
        || Value === "Error"
        || Value === "Warn"
        || Value === "Info"
        || Value === "Debug"
        || Value === "Trace";
}
