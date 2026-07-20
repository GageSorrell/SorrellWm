/**
 * @file      Format.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * A function that formats a given {@link Message | Message string}.
 *
 * @param Message - The given message to format.
 *
 * @returns The formatted message.
 */
export type Formatter =
    {
        (Message: string): string;
    };

/** A mapping of substrings or regular expressions to {@link Formatter | Formatters}. */
export type FormatRules = Record<string, Formatter>;
