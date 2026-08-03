/**
 * Redacted types and operations for structured logging.
 *
 * @module @sorrell/log/Redacted
 *
 * @file      Redacted.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** Internal marker for an explicit redacted input. */
export const TypeId: unique symbol =
    Symbol.for("@sorrell/log/Redacted") as typeof TypeId;

/** An input wrapper whose value is intentionally never exposed to normalization. */
export interface RedactedInput
{
    readonly [TypeId]: true;
    readonly Label?: string;
}

/** Wrap a sensitive value without retaining it in the returned marker. */
export function Redacted(_Value: unknown, Label?: string): RedactedInput
{
    return Label === undefined
        ? { [TypeId]: true }
        : { [TypeId]: true, Label };
}

/** Safely test for the explicit redaction protocol. */
export function IsRedacted(Value: unknown): Value is RedactedInput
{
    try
    {
        return typeof Value === "object"
            && Value !== null
            && (Value as Partial<RedactedInput>)[TypeId] === true;
    }
    catch
    {
        return false;
    }
}
