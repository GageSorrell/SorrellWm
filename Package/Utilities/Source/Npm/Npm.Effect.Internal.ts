/**
 * @file      Npm.Effect.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

/**
 * Returns whether a given {@link Value} contains a `readonly` `string` `"code"`.
 *
 * @param Value - The value to test.
 * @returns {Value is { readonly code: string }} Whether {@link Value} is a
 * `{ readonly code: string }`.
 */
export function HasErrorCode(Value: unknown): Value is { readonly code: string }
{
    return typeof Value === "object"
        && Value !== null
        && "code" in Value
        && typeof (Value as { readonly code: unknown }).code === "string";
}

/* eslint-enable jsdoc/require-example */
