/**
 * @file      Reactive.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Brand } from "./Reactive.Types";

/**
 * Factory function for {@link Brand}.
 *
 * @template BrandedType - The branded type that this function returns.
 * @template IdType - The ID string of the given {@link BrandedType}.
 * @template InnerType - The type wrapped by the given {@link BrandedType}.
 *
 * @param Value - The value to "brand" as {@link BrandedType}.
 *
 * @returns The given {@link Value} as the given {@link BrandedType}.
 */
export function MakeBranded<
    BrandedType extends Brand<IdType, InnerType>,
    IdType extends string,
    InnerType = unknown
>(Value: InnerType): BrandedType
{
    return Value as unknown as BrandedType;
}
