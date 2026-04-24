/**
 * @file      Array.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Options, TArrayType } from "./Array.Types.ts";
import type { NoOptions } from "../Miscellaneous/Utility.Types.ts";

/**
 * @module Array.Internal
 * Internal types for the {@link Array} module.
 *
 * @internal
 */

type TBuildStaticTArrayReadonly<
    ElementType,
    ArraySize extends number,
    Accumulator extends ReadonlyArray<ElementType> = readonly [ ]
> =
    Accumulator["length"] extends ArraySize
        ? Accumulator
        : TBuildStaticTArrayReadonly<
            ElementType,
            ArraySize,
            readonly [ ...Accumulator, ElementType ]
        >;

export type TBuildStaticTArrayMutable<
    ElementType,
    ArraySize extends number,
    Accumulator extends Array<ElementType> = [ ]
> =
    Accumulator["length"] extends ArraySize
        ? Accumulator
        : TBuildStaticTArrayMutable<
            ElementType,
            ArraySize,
            [ ...Accumulator, ElementType ]
        >;

/**
 * Used to define {@link Array.TStaticArray}.
 * @template ElementType - The type of this, or the type of this `Array`.
 * @template ArraySize - The number of {@link ElementType | ElementTypes} in this `Array`.  The
 * @template ReadonlyType - Whether the built {@link Array} type will be `readonly`.
 * this type.
 * @internal
 */
export type TBuildStaticTArrayBase<
    ElementType,
    ArraySize extends number,
    ReadonlyType extends boolean
> =
    ReadonlyType extends true
        ? TBuildStaticTArrayReadonly<ElementType, ArraySize>
        : ReadonlyType extends false
            ? TBuildStaticTArrayMutable<ElementType, ArraySize>
            : never;

export type TBuildStaticTArray<
    ElementType,
    ArraySize extends number,
    OptionsType extends Options = NoOptions
> =
    Options.DefinedOnly extends OptionsType
        ? Options.MaybeDefined extends OptionsType
            ? never
            : Options.Readonly extends OptionsType
                ? TBuildStaticTArrayReadonly<Exclude<ElementType, undefined>, ArraySize>
                : TBuildStaticTArrayMutable<Exclude<ElementType, undefined>, ArraySize>
        : Options.MaybeDefined extends OptionsType
            ? Options.Readonly extends OptionsType
                ? TBuildStaticTArrayReadonly<ElementType | undefined, ArraySize>
                : TBuildStaticTArrayMutable<ElementType | undefined, ArraySize>
            : Options.Readonly extends OptionsType
                ? TBuildStaticTArrayReadonly<ElementType, ArraySize>
                : TBuildStaticTArrayMutable<ElementType, ArraySize>;

/**
 * Wrap a `TArrayType` type with this to change the {@link ElementType} to `ElementType | undefined`.
 *
 * @template ArrayType - The type of `TArrayType` to transform.
 */
export type TWithUndefined<ArrayType> =
    ArrayType extends TArrayType<infer ElementType, infer OptionsType, infer ArraySize>
        ? TArrayType<ElementType | undefined, OptionsType, ArraySize>
        : never;

/**
 * The opposite of {@link TWithUndefined}.
 *
 * @template ArrayType - The type of `TArrayType` to transform.
 */
export type TWithDefined<ArrayType> =
    ArrayType extends TArrayType<infer ElementType, infer OptionsType, infer ArraySize>
        ? TArrayType<Exclude<ElementType, undefined>, OptionsType, ArraySize>
        : never;
