/**
 * @file      Array.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { DefinedOnlyOption, MaybeDefinedOption, ReadonlyOption } from "./Array.Internal.ts";
import type { NoOptions, TOptions } from "../Option/Option.Types.ts";
import type { TBuildStaticTArray } from "./Array.Internal.Types.ts";
import type { TIsNonNegativeInteger } from "../Math/Math.Types.ts";

/**
 * An `Array` type, which is optionally customizable via an {@link OptionsType}.
 *
 * @template ElementType - The type of the elements in the array.
 * @template OptionsType - *(Optional)* The {@link Options:type | options type} for this type.
 */
export type TArray<
    ElementType,
    OptionsType extends Options = NoOptions
> =
    Options.DefinedOnly extends OptionsType
        ? Options.MaybeDefined extends OptionsType
            ? never
            : Options.Readonly extends OptionsType
                ? ReadonlyArray<Exclude<ElementType, undefined>>
                : Array<Exclude<ElementType, undefined>>
        : Options.MaybeDefined extends OptionsType
            ? Options.Readonly extends OptionsType
                ? ReadonlyArray<ElementType | undefined>
                : Array<ElementType | undefined>
            : Options.Readonly extends OptionsType
                ? ReadonlyArray<ElementType>
                : Array<ElementType>;

/**
 * The union of all `Array` types exported by the `@sorrell/utilities` {@link Array}
 * module, as well as the built-in `Array` type.
 *
 * @note This union does *not* include {@link TMaybeArray}.
 * If you wish to include {@link TMaybeArray}, use {@link TArrayTypeUnsafe}.
 *
 * @template ElementType - The type of the elements in the array.
 * @template OptionsType - *(Optional)* The {@link Options:type | options type} for this type.
 * @template ArraySize - The number of {@link ElementType | ElementTypes} in this `Array`.  The
 * only type in this union that uses this type parameter is {@link TStaticArray}.
 */
export type TArrayType<
    ElementType = unknown,
    OptionsType extends Options = NoOptions,
    ArraySize extends number = number
> =
    | TArray<ElementType, OptionsType>
    | TNonemptyArray<ElementType, OptionsType>
    | TStaticArray<ElementType, ArraySize, OptionsType>
    | Array<ElementType>;

/**
 * The union of all `Array` types exported by the `@sorrell/utilities` {@link Array}
 * module, as well as the built-in `Array` type.
 *
 * @note This union includes {@link TMaybeArray}.  If you do not wish to include
 * {@link TMaybeArray} in the union, use {@link TArrayType} instead.
 *
 * @template ElementType - The type of the elements in the array.
 * @template OptionsType - *(Optional)* The {@link Options:type | options type} for this type.
 * @template ArraySize - The number of {@link ElementType | ElementTypes} in this `Array`.  The
 * only type in this union that uses this type parameter is {@link TStaticArray}.
 */
export type TArrayTypeUnsafe<
    ElementType,
    OptionsType extends Options = NoOptions,
    ArraySize extends number = number
> =
    | TArrayType<ElementType, OptionsType, ArraySize>
    | TMaybeArray<ElementType>;

/**
 * The union of a given {@link ElementType}, and `Array<ElementType>`.
 *
 * @template ElementType - The type of this, or the type of this `Array`.
 * @template OptionsType - *(Optional)* The {@link Options:type | options type} for this type.
 */
export type TMaybeArray<
    ElementType,
    OptionsType extends Options = NoOptions
> =
    | ElementType
    | TArray<ElementType, OptionsType>;

/**
 * The union of a given {@link ElementType}, and `Array<ElementType>`.
 *
 * @template ElementType - The type of this, or the type of this `Array`.
 * @template ArraySize - The number of {@link ElementType | ElementTypes} in this `Array`.
 * This must be an integer.
 * @template OptionsType - *(Optional)* The {@link Options:type | options type} for this type.
 */
export type TStaticArray<
    ElementType,
    ArraySize extends number,
    OptionsType extends Options = NoOptions
> =
    ArraySize extends ArraySize
        ? number extends ArraySize
            ? TArray<ElementType, OptionsType>
            : TIsNonNegativeInteger<ArraySize> extends true
                ? TBuildStaticTArray<ElementType, ArraySize, OptionsType>
                : never
        : never;

/**
 * An `Array<ElementType>` that is nonempty.
 *
 * @template ElementType - The type of the elements in the array.
 * @template OptionsType - *(Optional)* The {@link Options:type | options type} for this type.
 */
export type TNonemptyArray<
    ElementType,
    OptionsType extends Options = NoOptions
> =
    Options.DefinedOnly extends OptionsType
        ? Options.MaybeDefined extends OptionsType
            ? never
            : Options.Readonly extends OptionsType
                ? readonly [ Exclude<ElementType, undefined>, ...Array<Exclude<ElementType, undefined>> ]
                : [ Exclude<ElementType, undefined>, ...Array<Exclude<ElementType, undefined>> ]
        : Options.MaybeDefined extends OptionsType
            ? Options.Readonly extends OptionsType
                ? readonly [ ElementType | undefined, ...Array<ElementType | undefined> ]
                : [ ElementType | undefined, ...Array<ElementType | undefined> ]
            : Options.Readonly extends OptionsType
                ? readonly [ ElementType, ...Array<ElementType> ]
                : [ ElementType, ...Array<ElementType> ];

/**
 * Options for the types defined in the {@link Array} module.
 *
 * The only invalid combinations are those that contain both
 * {@link Options!DefinedOnly} *and* {@link Options!MaybeDefined}.
 */
export type Options =
    TOptions<
        | Options.Readonly
        | Options.DefinedOnly
        | Options.MaybeDefined
    >;

export namespace Options
{
    /**
     * Specifies that the given array type in the `@sorrell/utilities` `Array` module
     * should use `ReadonlyArray` internally.
     */
    export type Readonly = typeof ReadonlyOption;

    /** Specifies that `undefined` must extend the given `ElementType`. */
    export type MaybeDefined = typeof MaybeDefinedOption;

    /** Specifies that the given `ElementType` must *not* include `undefined`. */
    export type DefinedOnly = typeof DefinedOnlyOption;

    /** @see {@link NoOptions} */
    export type None = NoOptions;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The type returned by {@link FilterDefined}.
 *
 * @template ElementType - The type of the elements in the array.
 */
export type FilteredArray<ElementType> = TArray<Exclude<ElementType, undefined>>;

/* eslint-enable @typescript-eslint/no-explicit-any */
