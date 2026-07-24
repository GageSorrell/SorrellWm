/**
 *
 *
 * @module @sorrell/log/Formatting/JsonLinesFormatter
 *
 * @file      JsonLinesFormatter.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Formatter } from "../Formatter.js";
import type { LogRecord } from "../LogRecord.js";

/** Serialize one complete, ANSI-free record as NDJSON. */
export function Format(Record: LogRecord): string
{
    return `${ JSON.stringify(Record) }\n`;
}

/** Construct the default structured file/transport formatter. */
export function JsonLines(): Formatter
{
    return { Format };
}
