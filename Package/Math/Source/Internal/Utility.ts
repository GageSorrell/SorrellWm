/**
 *
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

export const SubTypeIdFactory = (...TypeIds: Array.NonEmptyReadonlyArray<string>): (Label: string) => string =>
{
    return (...Labels: ReadonlyArray<string>) => [ ...TypeIds, ...Labels ].join("!");
};
