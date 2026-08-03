/**
 * Log forwarding types and operations for receiver.
 *
 * @module @sorrell/log/Forward/Receiver
 *
 * @file      Receiver.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ValidateRecord, type ValidationOptions } from "./Validation.js";
import { Normalize } from "../Normalize.js";
import type { ProcessMetadata } from "../LogRecord.js";
import type { UnsafePublisher } from "../Logger.js";

/** Validate and republish one untrusted record with authoritative metadata. */
export function Receive(
    Runtime: UnsafePublisher,
    Input: unknown,
    Process: ProcessMetadata,
    Options: ValidationOptions = { }
): boolean
{
    const Record = ValidateRecord(Input, Options);
    if (Record === undefined)
    {
        return false;
    }

    Runtime.PublishUnsafe({
        Annotations: {
            ...Record.Annotations,
            "@sorrell/log/original-process": Normalize(Record.Process),
            "@sorrell/log/original-source": Record.Source
        },
        Category: Record.Category,
        ...(Record.Cause === undefined ? { } : { Cause: Record.Cause }),
        ...(Record.Fiber === undefined ? { } : { Fiber: Record.Fiber }),
        ...(Record.Global === undefined ? { } : { Global: Record.Global }),
        Level: Record.Level,
        Message: Record.Message,
        Normalized: true,
        Process,
        Source: "Forwarded",
        Spans: Record.Spans,
        Timestamp: Record.Timestamp
    });

    return true;
}
