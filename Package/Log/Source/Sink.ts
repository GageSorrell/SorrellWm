/**
 *
 *
 * @module @sorrell/log/Sink
 *
 * @file      Sink.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data, type Effect } from "effect";
import type { LogRecord } from "./LogRecord.js";

/** A typed failure returned by a sink lifecycle or write operation. */
export class LogSinkError extends Data.TaggedError("LogSinkError")<{
    readonly Cause: unknown;
    readonly Operation: "Write" | "Flush" | "Shutdown";
    readonly Sink: string;
}> { }

/** A destination that consumes already-normalized records in order. */
export interface LogSink
{
    readonly Name: string;
    readonly Write: (Record: LogRecord) => Effect.Effect<void, LogSinkError>;
    readonly Flush: Effect.Effect<void, LogSinkError>;
    readonly Shutdown: Effect.Effect<void, LogSinkError>;
    readonly Accepts?: (Record: LogRecord) => boolean;
}
