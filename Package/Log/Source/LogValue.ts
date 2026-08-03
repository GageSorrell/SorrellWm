/**
 * Log value types and operations for structured logging.
 *
 * @module @sorrell/log/LogValue
 *
 * @file      LogValue.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A BigInt encoded without precision loss. */
export interface LogBigInt
{
    readonly _tag: "BigInt";
    readonly Value: string;
}

/** A date encoded as an ISO-8601 string. */
export interface LogDate
{
    readonly _tag: "Date";
    readonly Value: string;
}

/** An array or typed-array value. */
export interface LogArray
{
    readonly _tag: "Array";
    readonly Type?: string;
    readonly Value: ReadonlyArray<LogValue>;
}

/** A normalized object or class instance. */
export interface LogObject
{
    readonly _tag: "Object";
    readonly Type?: string;
    readonly Value: Readonly<Record<string, LogValue>>;
}

/** A map represented as normalized key/value entries. */
export interface LogMap
{
    readonly _tag: "Map";
    readonly Value: ReadonlyArray<readonly [LogValue, LogValue]>;
}

/** A set represented as normalized values. */
export interface LogSet
{
    readonly _tag: "Set";
    readonly Value: ReadonlyArray<LogValue>;
}

/** A JavaScript symbol. */
export interface LogSymbol
{
    readonly _tag: "Symbol";
    readonly Description?: string;
    readonly GlobalKey?: string;
}

/** A JavaScript function, retained by name only. */
export interface LogFunction
{
    readonly _tag: "Function";
    readonly Name?: string;
}

/** A normalized Error value. */
export interface LogError
{
    readonly _tag: "Error";
    readonly Name: string;
    readonly Message: string;
    readonly Stack?: string;
    readonly Cause?: LogValue;
    readonly Properties?: Readonly<Record<string, LogValue>>;
}

/** An explicit redaction marker. The underlying value is never retained. */
export interface LogRedacted
{
    readonly _tag: "Redacted";
    readonly Label?: string;
}

/** A reference that would recursively revisit an ancestor. */
export interface LogCircularReference
{
    readonly _tag: "CircularReference";
    readonly Path: string;
}

/** A value shortened to satisfy configured normalization limits. */
export interface LogTruncated
{
    readonly _tag: "Truncated";
    readonly Reason: string;
    readonly Omitted?: number;
}

/** A value that could not be inspected safely. */
export interface LogUnavailable
{
    readonly _tag: "Unavailable";
    readonly Reason: string;
    readonly Type?: string;
}

/** The stable JSON-safe value tree used by every sink and transport. */
export type LogValue =
    | null
    | boolean
    | number
    | string
    | LogBigInt
    | LogDate
    | LogArray
    | LogObject
    | LogMap
    | LogSet
    | LogSymbol
    | LogFunction
    | LogError
    | LogRedacted
    | LogCircularReference
    | LogTruncated
    | LogUnavailable;

/** Input that a custom Loggable protocol implementation may return. */
export type LogValueInput = unknown;
