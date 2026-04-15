/* File:      Reactive.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Brand } from "./Reactive.Types";

/**
 * Factory function for {@link Brand}.
 *
 * @typeParam BrandedType - The branded type that this function returns.
 * @typeParam IdType - The ID string of the given {@link BrandedType}.
 * @typeParam InnerType - The type wrapped by the given {@link BrandedType}.
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
