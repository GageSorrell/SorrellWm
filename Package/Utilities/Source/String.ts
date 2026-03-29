/* File:      String.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * @param In - The string that you wish to test.
 * @returns Whether the given string contains *only* (Latin alphabet) letters.
 */
export function IsLetters(In: string): boolean
{
    return /^[a-zA-Z]*$/.test(In);
}

/**
 * @remarks *(This is an alias for `IsOnlyLetters`).*
 *
 * @param In - The string that you wish to test.
 * @returns Whether the given string contains *only* (Latin alphabet) letters.
 */
export function IsAlpha(In: string): boolean
{
    return IsLetters(In);
}

/**
 * @param In - The string that you wish to test.
 * @returns Whether the given string contains *only* numeric digits.
 */
export function IsNumeric(In: string): boolean
{
    return /^\d+$/.test(In);
}
