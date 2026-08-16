/**
 * In-memory structured log sink for tests.
 *
 * @module @sorrell/log/Testing/InMemorySink
 *
 * @file      InMemorySink.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import type { LogRecord } from "../LogRecord.js";
import type { LogSink } from "../Sink.js";
import type { Thunk } from "@sorrell/effect/Function";

/** In-memory sink and observation helpers for deterministic tests. */
export interface InMemorySink extends LogSink
{
    readonly Records: ReadonlyArray<LogRecord>;
    readonly Clear: Thunk;
    readonly AwaitNext: Effect.Effect<LogRecord>;
}

/** Construct an ordered in-memory sink. */
export function Make(): InMemorySink
{
    const Records: Array<LogRecord> = [ ];
    const Waiters: Array<(Record: LogRecord) => void> = [ ];

    return {
        AwaitNext: Effect.promise(() => new Promise<LogRecord>(
            (Resolve: (Record: LogRecord) => void) =>
            {
                Waiters.push(Resolve);
            }
        )),
        Clear: (): void =>
        {
            Records.length = 0;
        },
        Flush: Effect.void,
        Name: "InMemorySink",
        Records,
        Shutdown: Effect.void,
        Write: (Record: LogRecord) => Effect.sync(() =>
        {
            Records.push(Record);
            Waiters.shift()?.(Record);
        })
    };
}
