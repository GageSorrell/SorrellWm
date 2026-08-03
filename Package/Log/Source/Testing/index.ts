/**
 * Public exports for the testing module in `@sorrell/log`.
 *
 * @module @sorrell/log/Testing/index
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LogRecord } from "../LogRecord.js";

export * as InMemorySink from "./InMemorySink.js";

/** Remove intentionally nondeterministic fields before snapshot comparison. */
export function NormalizeSnapshot(Record: LogRecord): Omit<LogRecord, "Sequence" | "Timestamp">
{
    return Object.fromEntries(
        Object.entries(Record).filter(([ Key ]: [string, unknown]) =>
            Key !== "Sequence" && Key !== "Timestamp")
    ) as unknown as Omit<LogRecord, "Sequence" | "Timestamp">;
}

/** Assert a partial record shape without coupling tests to timing metadata. */
export function AssertRecord(
    Record: LogRecord,
    Expected: Partial<LogRecord>
): void
{
    for (const [ Key, Value ] of Object.entries(Expected))
    {
        if (!Object.is(Record[Key as keyof LogRecord], Value))
        {
            throw new Error(`Expected log record field ${ Key } to match.`);
        }
    }
}
