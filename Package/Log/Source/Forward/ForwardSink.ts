/**
 *
 *
 * @module @sorrell/log/Forward/ForwardSink
 *
 * @file      ForwardSink.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Duration, type Duration as DurationType, Effect } from "effect";
import type { LogRecord } from "../LogRecord.js";
import { type LogSink, LogSinkError } from "../Sink.js";

/** Callback-based batching sink suitable for context-isolated Electron IPC. */
export interface ForwardSinkOptions
{
    readonly Send: (Records: ReadonlyArray<LogRecord>) => void | Promise<void>;
    readonly MaximumBatchSize?: number;
    readonly FlushInterval?: DurationType.FilePath;
    readonly MaximumRecordBytes?: number;
}

/** Construct a bounded-batch forwarding sink with no Electron dependency. */
export function Make(Options: ForwardSinkOptions): LogSink
{
    const MaximumBatchSize = Math.max(1, Options.MaximumBatchSize ?? 100);
    const FlushMilliseconds = Math.max(1, Duration.toMillis(
        Options.FlushInterval ?? "50 millis"
    ));
    const Batch: Array<LogRecord> = [];
    let Closed = false;
    let Timer: ReturnType<typeof setTimeout> | undefined;
    let Tail: Promise<void> = Promise.resolve();

    const ErrorFor = (
        Cause: unknown,
        Operation: "Write" | "Flush" | "Shutdown"
    ): LogSinkError => new LogSinkError({
        Cause,
        Operation,
        Sink: "ForwardSink"
    });

    const Flush = async (): Promise<void> =>
    {
        if (Timer !== undefined)
        {
            clearTimeout(Timer);
            Timer = undefined;
        }

        if (Batch.length === 0)
        {
            return;
        }

        const Sending = Batch.splice(0);
        await Options.Send(Sending);
    };

    const Enqueue = (Operation: () => Promise<void>): Promise<void> =>
    {
        const Task = Tail.catch(() => undefined).then(Operation);
        Tail = Task;
        return Task;
    };

    const Schedule = (): void =>
    {
        if (Timer !== undefined)
        {
            return;
        }

        Timer = setTimeout(() =>
        {
            Timer = undefined;
            void Enqueue(Flush).catch((Cause: unknown) =>
            {
                try
                {
                    globalThis.console?.error("@sorrell/log: ForwardSink timed flush failed", Cause);
                }
                catch
                {
                    // No safe recursive reporting path is available.
                }
            });
        }, FlushMilliseconds);
    };

    return {
        Flush: Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Flush"),
            try: () => Enqueue(Flush)
        }),
        Name: "ForwardSink",
        Shutdown: Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Shutdown"),
            try: () => Enqueue(async () =>
            {
                if (Closed)
                {
                    return;
                }
                Closed = true;
                await Flush();
            })
        }),
        Write: (Record: LogRecord) => Effect.tryPromise({
            catch: (Cause: unknown) => ErrorFor(Cause, "Write"),
            try: () => Enqueue(async () =>
            {
                if (Closed)
                {
                    return;
                }

                if (Options.MaximumRecordBytes !== undefined
                    && JSON.stringify(Record).length > Options.MaximumRecordBytes)
                {
                    throw new RangeError("The forwarded log record exceeds MaximumRecordBytes.");
                }

                Batch.push(Record);

                if (Batch.length >= MaximumBatchSize || Record.Level === "Fatal")
                {
                    await Flush();
                }
                else
                {
                    Schedule();
                }
            })
        })
    };
}
