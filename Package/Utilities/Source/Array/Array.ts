/**
 * @file      Array.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FilteredArray, Options, TArrayType } from "./Array.Types.js";
import type { NoOptions } from "../Miscellaneous/Utility.Types.js";

/**
 * Filter out all instances of `undefined` from a given {@link Array:param}.
 * @param Array - The array to filter.
 *
 * @template ElementType - The type of the elements in the array.
 *
 * @returns {TArrayType<Exclude<ElementType, undefined>, Exclude<OptionsType, Options.MaybeDefined>>}
 * A new `Array` of type `Exclude<ElementType, undefined>` and `OptionsType` that is the given
 * {@link OptionsType}, with the {@link Options.MaybeDefined} option removed.
 *
 * @example With the given {@link ElementType} including `undefined`.
 * ```typescript
 * const MaybeOddNumbers: TArray<number | undefined> = [ 1, 3, undefined, 5 ];
 * const OddNumbers: TArray<number> = FilterDefined(MaybeOddNumbers);
 * ```
 * @example With the given {@link OptionsType} including `Options.MaybeDefined`.
 * ```typescript
 * const MaybeOddNumbers: TArray<number, Options.MaybeDefined> = [ 1, 3, undefined, 5 ];
 * const OddNumbers: TArray<number> = FilterDefined(MaybeOddNumbers);
 * ```
 */
export function FilterDefined<
    ElementType,
    OptionsType extends Options = NoOptions,
    ArraySize extends number = number
>(
    Array: TArrayType<
        ElementType,
        OptionsType | Options.MaybeDefined,
        ArraySize
    >
): FilteredArray<ElementType>;
export function FilterDefined<
    ElementType,
    OptionsType extends Options = NoOptions,
    ArraySize extends number = number
>(
    Array: TArrayType<
        ElementType | undefined,
        OptionsType,
        ArraySize
    >
): FilteredArray<ElementType>;
export function FilterDefined<
    ElementType,
    OptionsType extends Options = NoOptions,
    ArraySize extends number = number
>(
    Array: TArrayType<
        ElementType | undefined,
        OptionsType | Options.MaybeDefined,
        ArraySize
    >
): FilteredArray<ElementType>;
export function FilterDefined<
    ElementType,
    OptionsType extends Options = NoOptions,
    ArraySize extends number = number
>(
    Array: TArrayType<
        ElementType | undefined,
        OptionsType | Options.MaybeDefined,
        ArraySize
    >
): FilteredArray<ElementType>
{
    return Array.filter((Element: ElementType | undefined): boolean =>
    {
        return Element !== undefined;
    }) as FilteredArray<ElementType>;
}
