/**
 *
 *
 * @module @sorrell/ink-ui/Timeline/FormatTimestamp
 *
 * @file      FormatTimestamp.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export/**
       * Format a timestamp to display in a `Timeline`.
       *
       * @category Timeline
       * @since 1.0.0
       */
const FormatTimestamp = (Value: Date | number | string): string =>
{
    const DateValue = Value instanceof Date ? Value : new Date(Value);
    return Number.isNaN(DateValue.getTime())
        ? String(Value)
        : DateValue.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
};
