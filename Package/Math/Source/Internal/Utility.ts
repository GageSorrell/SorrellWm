/**
 * Internal utility operations for discrete geometry and arithmetic.
 *
 * @module @sorrell/math/Internal/Utility
 * @internal
 *
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Array } from "effect";

export/** Create a factory that appends labels to a nonempty type-identifier path. */
const SubTypeIdFactory = (
    ...TypeIds: Array.NonEmptyReadonlyArray<string>
): (Label: string) => string =>
{
    return (...Labels: ReadonlyArray<string>) => [ ...TypeIds, ...Labels ].join("!");
};
