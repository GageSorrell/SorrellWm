/**
 *
 *
 * @module @sorrell/log/Formatter
 *
 * @file      Formatter.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LogRecord } from "./LogRecord.js";

/** A pure destination formatter over normalized records. */
export interface Formatter
{
    readonly Format: (Record: LogRecord) => string;
}

/** Construct a formatter from a pure formatting function. */
export function Make(Format: (Record: LogRecord) => string): Formatter
{
    return { Format };
}
