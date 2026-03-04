/* File:      Array.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIsNonNegativeInteger } from "./Utility.Types";

export type TMaybeArray<Type> = Type | TArray<Type>;

type TBuildStaticTArray<
    ElementType,
    ArraySize extends number,
    Accumulator extends TArray<ElementType> = [ ]
> =
    Accumulator["length"] extends ArraySize
        ? Accumulator
        : TBuildStaticTArray<ElementType, ArraySize, [ ...Accumulator, ElementType ]>;

export type TStaticArray<ElementType, ArraySize extends number> =
    ArraySize extends ArraySize
        ? number extends ArraySize
            ? TArray<ElementType>
            : TIsNonNegativeInteger<ArraySize> extends true
                ? TBuildStaticTArray<ElementType, ArraySize>
                : never
        : never;
