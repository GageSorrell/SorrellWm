/**
 * @file      Functional.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

/**
 * The identity mapping, for some {@link Array} of {@link ArgumentVector | given arguments}.
 *
 * @param ArgumentVector - The {@link Array} of given arguments.
 * @returns {typeof ArgumentVector} The {@link Array} of given arguments.
 */
export function Identity<ArgumentType>(
    ...ArgumentVector: Array<ArgumentType>
): typeof ArgumentVector
{
    return ArgumentVector;
}

/* eslint-enable jsdoc/require-example */
