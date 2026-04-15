/* File:      Print.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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
