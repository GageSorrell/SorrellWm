/**
 *
 *
 * @module @sorrell/log/Normalize
 *
 * @file      Normalize.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Loggable from "./Loggable.js";
import type {
    LogArray,
    LogError,
    LogObject,
    LogRedacted,
    LogTruncated,
    LogUnavailable,
    LogValue
} from "./LogValue.js";
import * as Redaction from "./Redacted.js";

/** Limits and safety controls used while converting arbitrary values. */
export interface NormalizeOptions
{
    readonly MaximumDepth: number;
    readonly MaximumCollectionLength: number;
    readonly MaximumObjectProperties: number;
    readonly MaximumStringLength: number;
    readonly IncludeErrorStack: boolean;
    readonly InvokeGetters: boolean;
}

/** Conservative defaults suitable for interactive and persistent logs. */
export const DefaultOptions: NormalizeOptions = Object.freeze({
    IncludeErrorStack: true,
    InvokeGetters: false,
    MaximumCollectionLength: 100,
    MaximumDepth: 8,
    MaximumObjectProperties: 100,
    MaximumStringLength: 16_384
});

/**
 *
 */
function MergeOptions(Options?: Partial<NormalizeOptions>): NormalizeOptions
{
    return {
        ...DefaultOptions,
        ...Options
    };
}

/**
 *
 */
function Truncated(Reason: string, Omitted?: number): LogTruncated
{
    return Omitted === undefined
        ? { _tag: "Truncated", Reason }
        : { _tag: "Truncated", Omitted, Reason };
}

/**
 *
 */
function Unavailable(Reason: string, Type?: string): LogUnavailable
{
    return Type === undefined
        ? { _tag: "Unavailable", Reason }
        : { _tag: "Unavailable", Reason, Type };
}

/**
 *
 */
function RedactedValue(Label?: string): LogRedacted
{
    return Label === undefined
        ? { _tag: "Redacted" }
        : { _tag: "Redacted", Label };
}

/**
 *
 */
function SafeType(Value: object): string | undefined
{
    try
    {
        const Constructor = Object.getPrototypeOf(Value)?.constructor as
            | { readonly name?: unknown; }
            | undefined;

        return typeof Constructor?.name === "string" && Constructor.name.length > 0
            ? Constructor.name
            : undefined;
    }
    catch
    {
        return undefined;
    }
}

/**
 *
 */
function Shorten(Value: string, Options: NormalizeOptions): string | LogTruncated
{
    if (Value.length <= Options.MaximumStringLength)
    {
        return Value;
    }

    return {
        _tag: "Truncated",
        Omitted: Value.length - Options.MaximumStringLength,
        Reason: `${ Value.slice(0, Options.MaximumStringLength) }`
    };
}

interface NormalizerState
{
    readonly ActivePaths: WeakMap<object, string>;
    readonly Normalized: WeakSet<object>;
    readonly Options: NormalizeOptions;
}

/**
 *
 */
function MarkNormalized(Value: LogValue, State: NormalizerState): LogValue
{
    if (typeof Value === "object" && Value !== null)
    {
        State.Normalized.add(Value);
    }

    return Value;
}

/**
 *
 */
function NormalizeObject(
    Value: object,
    Depth: number,
    Path: string,
    State: NormalizerState
): LogValue
{
    if (Depth > State.Options.MaximumDepth)
    {
        return Truncated("Maximum depth exceeded");
    }

    const ExistingPath = State.ActivePaths.get(Value);
    if (ExistingPath !== undefined)
    {
        return { _tag: "CircularReference", Path: ExistingPath };
    }

    State.ActivePaths.set(Value, Path);

    try
    {
        if (State.Normalized.has(Value))
        {
            return Value as LogValue;
        }

        if (Redaction.IsRedacted(Value))
        {
            return RedactedValue(Value.Label);
        }

        let Protocol: unknown;
        try
        {
            Protocol = (Value as Partial<Loggable.Loggable>)[Loggable.TypeId];
        }
        catch
        {
            return Unavailable("Unable to inspect Loggable protocol", SafeType(Value));
        }

        if (typeof Protocol === "function")
        {
            try
            {
                const Result = Protocol.call(Value, {
                    Depth,
                    Normalize: (Nested: unknown): LogValue =>
                        MarkNormalized(
                            NormalizeValue(
                                Nested,
                                Depth + 1,
                                `${ Path }.<Loggable>`,
                                State
                            ),
                            State
                        ),
                    Options: State.Options,
                    Redacted: (Label?: string): LogRedacted =>
                        MarkNormalized(RedactedValue(Label), State) as LogRedacted
                } satisfies Loggable.LoggableContext);

                return NormalizeValue(Result, Depth + 1, `${ Path }.<Loggable>`, State);
            }
            catch
            {
                return Unavailable("Loggable protocol threw", SafeType(Value));
            }
        }

        if (Value instanceof Date)
        {
            try
            {
                return Number.isNaN(Value.getTime())
                    ? Unavailable("Invalid Date", "Date")
                    : { _tag: "Date", Value: Value.toISOString() };
            }
            catch
            {
                return Unavailable("Unable to inspect Date", "Date");
            }
        }

        if (Value instanceof Error)
        {
            return NormalizeError(Value, Depth, Path, State);
        }

        if (Array.isArray(Value))
        {
            const Length = Math.min(Value.length, State.Options.MaximumCollectionLength);
            const Items: Array<LogValue> = [];

            for (let Index = 0; Index < Length; Index += 1)
            {
                let Item: unknown;
                try
                {
                    Item = Value[Index];
                }
                catch
                {
                    Item = Unavailable("Array element access threw");
                }
                Items.push(NormalizeValue(Item, Depth + 1, `${ Path }[${ Index }]`, State));
            }

            if (Value.length > Length)
            {
                Items.push(Truncated("Maximum collection length exceeded", Value.length - Length));
            }

            return { _tag: "Array", Value: Items };
        }

        if (Value instanceof Map)
        {
            const Entries: Array<readonly [LogValue, LogValue]> = [];
            let Index = 0;

            for (const [ Key, MapValue ] of Value)
            {
                if (Index >= State.Options.MaximumCollectionLength)
                {
                    Entries.push([
                        Truncated("Maximum collection length exceeded", Value.size - Index),
                        null
                    ]);
                    break;
                }

                Entries.push([
                    NormalizeValue(Key, Depth + 1, `${ Path }.<key:${ Index }>`, State),
                    NormalizeValue(MapValue, Depth + 1, `${ Path }.<value:${ Index }>`, State)
                ]);
                Index += 1;
            }

            return { _tag: "Map", Value: Entries };
        }

        if (Value instanceof Set)
        {
            const Items: Array<LogValue> = [];
            let Index = 0;

            for (const SetValue of Value)
            {
                if (Index >= State.Options.MaximumCollectionLength)
                {
                    Items.push(Truncated("Maximum collection length exceeded", Value.size - Index));
                    break;
                }

                Items.push(NormalizeValue(SetValue, Depth + 1, `${ Path }[${ Index }]`, State));
                Index += 1;
            }

            return { _tag: "Set", Value: Items };
        }

        if (ArrayBuffer.isView(Value))
        {
            let Values: ReadonlyArray<unknown>;
            try
            {
                Values = Array.from(
                    Value as unknown as { readonly length: number; readonly [Index: number]: unknown; }
                );
            }
            catch
            {
                return Unavailable("Unable to inspect typed array", SafeType(Value));
            }

            const Length = Math.min(Values.length, State.Options.MaximumCollectionLength);
            const Items = Values.slice(0, Length).map(
                (Item: unknown, Index: number) =>
                    NormalizeValue(Item, Depth + 1, `${ Path }[${ Index }]`, State)
            );

            if (Values.length > Length)
            {
                Items.push(Truncated("Maximum collection length exceeded", Values.length - Length));
            }

            const Type = SafeType(Value);
            const Output: LogArray = {
                _tag: "Array",
                ...(Type === undefined ? { } : { Type }),
                Value: Items
            };
            return Output;
        }

        return NormalizePlainObject(Value, Depth, Path, State);
    }
    catch
    {
        return Unavailable("Object inspection threw", SafeType(Value));
    }
    finally
    {
        State.ActivePaths.delete(Value);
    }
}

/**
 *
 */
function NormalizeError(
    Value: Error,
    Depth: number,
    Path: string,
    State: NormalizerState
): LogError
{
    const Properties: Record<string, LogValue> = { };
    let Keys: ReadonlyArray<string> = [];

    try
    {
        Keys = Object.keys(Value).filter((Key: string) => Key !== "cause");
    }
    catch
    {
        Properties.Inspection = Unavailable("Error property enumeration threw");
    }

    for (const Key of Keys.slice(0, State.Options.MaximumObjectProperties))
    {
        const Descriptor = Object.getOwnPropertyDescriptor(Value, Key);
        if (Descriptor === undefined)
        {
            continue;
        }

        if ("value" in Descriptor)
        {
            Properties[Key] = NormalizeValue(
                Descriptor.value,
                Depth + 1,
                `${ Path }.${ Key }`,
                State
            );
        }
        else if (State.Options.InvokeGetters && Descriptor.get !== undefined)
        {
            try
            {
                Properties[Key] = NormalizeValue(
                    Descriptor.get.call(Value),
                    Depth + 1,
                    `${ Path }.${ Key }`,
                    State
                );
            }
            catch
            {
                Properties[Key] = Unavailable("Getter threw");
            }
        }
        else
        {
            Properties[Key] = Unavailable("Getter not invoked");
        }
    }

    let Cause: LogValue | undefined;
    try
    {
        if (Value.cause !== undefined)
        {
            Cause = NormalizeValue(Value.cause, Depth + 1, `${ Path }.cause`, State);
        }
    }
    catch
    {
        Cause = Unavailable("Error cause access threw");
    }

    let Stack: string | undefined;
    if (State.Options.IncludeErrorStack)
    {
        try
        {
            Stack = typeof Value.stack === "string"
                ? Value.stack.slice(0, State.Options.MaximumStringLength)
                : undefined;
        }
        catch
        {
            Stack = undefined;
        }
    }

    return {
        _tag: "Error",
        ...(Cause === undefined ? { } : { Cause }),
        Message: typeof Value.message === "string" ? Value.message : String(Value.message),
        Name: typeof Value.name === "string" ? Value.name : "Error",
        ...(Object.keys(Properties).length === 0 ? { } : { Properties }),
        ...(Stack === undefined ? { } : { Stack })
    };
}

/**
 *
 */
function NormalizePlainObject(
    Value: object,
    Depth: number,
    Path: string,
    State: NormalizerState
): LogObject | LogUnavailable
{
    let Keys: ReadonlyArray<string>;
    try
    {
        Keys = Object.keys(Value);
    }
    catch
    {
        return Unavailable("Object property enumeration threw", SafeType(Value));
    }

    const Output: Record<string, LogValue> = { };
    const Length = Math.min(Keys.length, State.Options.MaximumObjectProperties);

    for (let Index = 0; Index < Length; Index += 1)
    {
        const Key = Keys[Index];
        if (Key === undefined)
        {
            continue;
        }

        let Descriptor: PropertyDescriptor | undefined;
        try
        {
            Descriptor = Object.getOwnPropertyDescriptor(Value, Key);
        }
        catch
        {
            Output[Key] = Unavailable("Property descriptor access threw");
            continue;
        }

        if (Descriptor === undefined)
        {
            continue;
        }

        if ("value" in Descriptor)
        {
            Output[Key] = NormalizeValue(
                Descriptor.value,
                Depth + 1,
                `${ Path }.${ Key }`,
                State
            );
        }
        else if (State.Options.InvokeGetters && Descriptor.get !== undefined)
        {
            try
            {
                Output[Key] = NormalizeValue(
                    Descriptor.get.call(Value),
                    Depth + 1,
                    `${ Path }.${ Key }`,
                    State
                );
            }
            catch
            {
                Output[Key] = Unavailable("Getter threw");
            }
        }
        else
        {
            Output[Key] = Unavailable("Getter not invoked");
        }
    }

    if (Keys.length > Length)
    {
        Output["<truncated>"] = Truncated(
            "Maximum object properties exceeded",
            Keys.length - Length
        );
    }

    const Type = SafeType(Value);
    return Type === undefined || Type === "Object"
        ? { _tag: "Object", Value: Output }
        : { _tag: "Object", Type, Value: Output };
}

/**
 *
 */
function NormalizeValue(
    Value: unknown,
    Depth: number,
    Path: string,
    State: NormalizerState
): LogValue
{
    switch (typeof Value)
    {
        case "undefined":
            return Unavailable("undefined");
        case "boolean":
            return Value;
        case "string":
            return Shorten(Value, State.Options);
        case "number":
            return Number.isFinite(Value)
                ? Value
                : Unavailable(`Non-finite number: ${ String(Value) }`, "Number");
        case "bigint":
            return { _tag: "BigInt", Value: Value.toString() };
        case "symbol":
        {
            const GlobalKey = Symbol.keyFor(Value);
            return {
                _tag: "Symbol",
                ...(Value.description === undefined ? { } : { Description: Value.description }),
                ...(GlobalKey === undefined ? { } : { GlobalKey })
            };
        }
        case "function":
            return Value.name.length === 0
                ? { _tag: "Function" }
                : { _tag: "Function", Name: Value.name };
        case "object":
            return Value === null
                ? null
                : NormalizeObject(Value, Depth, Path, State);
        default:
            return Unavailable(`Unsupported value type: ${ typeof Value }`);
    }
}

/** Convert an arbitrary JavaScript value into the stable JSON-safe log-value tree. */
export function Normalize(
    Value: unknown,
    Options?: Partial<NormalizeOptions>
): LogValue
{
    return NormalizeValue(Value, 0, "$", {
        ActivePaths: new WeakMap<object, string>(),
        Normalized: new WeakSet<object>(),
        Options: MergeOptions(Options)
    });
}
