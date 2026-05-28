/**
 * @file      String.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * @module String
 * Functions for manipulating strings.
 */

// @TODO TEMPORARY.
/* eslint-disable jsdoc/require-example */

/**
 * Does the given {@link TestString} contain only letters?
 * This is equivalent to Python's
 * {@link https://docs.python.org/3/library/stdtypes.html#str.isalpha | isalpha} function.
 *
 * @remarks This is an alias for {@link IsAlpha}.
 *
 * @param TestString - The string that you wish to test.
 *
 * @returns {boolean} Whether the given string contains *only* (Latin alphabet) letters.
 */
export function IsLetters(TestString: string): boolean
{
    return /^[a-zA-Z]*$/.test(TestString);
}

/**
 * Does the given {@link TestString} contain only letters?
 * This is equivalent to Python's
 * {@link https://docs.python.org/3/library/stdtypes.html#str.isalpha | isalpha} function.
 *
 * @param TestString - The string that you wish to test.
 *
 * @returns {boolean} Whether the given string contains *only* (Latin alphabet) letters.
 */
export function IsAlpha(TestString: string): boolean
{
    return IsLetters(TestString);
}

/**
 * Does the given {@link TestString} contain only digits?
 *
 * This is equivalent to Python's
 * {@link https://docs.python.org/3/library/stdtypes.html#str.isnumeric | isnumeric} function.
 *
 * @param TestString - The string that you wish to test.
 *
 * @returns {boolean} Whether the given string contains *only* numeric digits.
 */
export function IsNumeric(TestString: string): boolean
{
    return /^\d+$/.test(TestString);
}

/**
 * This function provides a convenient way to define long strings across multiple lines.
 * The linebreaks and leading indentation are removed from the final string.
 * Please see the example below for how this is to be done.
 *
 * @param Content - The given string to dedent.
 * @param IndentLength - The number of spaces for which this function will check.  This
 * is necessary only if the number of spaces used in the {@link Content} is not a multiple
 * of two.
 *
 * @returns {string} The given {@link Content}, but with the spaces at the beginning
 * of each line (excluding the first line if no spaces exist in the first line) removed.
 *
 * @example
 * ```typescript
 * import { Dedent } from "@sorrell/utilities/string";
 *
 * const MyLongString: string = Dedent(`Lorem ipsum dolor sit amet, consectetur adipiscing elit,
 *             sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
 *                 minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
 *             commodo consequat.`);
 *
 * // `MyLongString` <- `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
 * sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad \
 *     minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea \
 * commodo consequat."`
 * ```
 */
export function Dedent(Content: string, IndentLength?: number): string
{
    const WhitespaceSubstring: string = ((): string =>
    {
        if (IndentLength !== undefined)
        {
            return "\n" + " ".repeat(IndentLength);
        }

        let WhitespaceSubstring: string = "\n";

        while (true)
        {
            const TestString: string = WhitespaceSubstring + "  ";
            if (Content.includes(TestString))
            {
                WhitespaceSubstring = TestString;
            }
            else
            {
                break;
            }
        }

        return WhitespaceSubstring;
    })();

    return Content.replaceAll(WhitespaceSubstring, "");
}

export function GetUtf8ByteLength(Text: string): number
{
    return new TextEncoder().encode(Text).length;
}
