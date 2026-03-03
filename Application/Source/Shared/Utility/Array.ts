/* File:      Array.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIsNonNegativeInteger } from "./Utility.Types";

export type TMaybeArray<Type> = Type | Array<Type>;

type TBuildStaticArray<
    ElementType,
    ArraySize extends number,
    Accumulator extends Array<ElementType> = [ ]
> =
    Accumulator["length"] extends ArraySize
        ? Accumulator
        : TBuildStaticArray<ElementType, ArraySize, [ ...Accumulator, ElementType ]>;

export type TStaticArray<ElementType, ArraySize extends number> =
    ArraySize extends ArraySize
        ? number extends ArraySize
            ? Array<ElementType>
            : TIsNonNegativeInteger<ArraySize> extends true
                ? TBuildStaticArray<ElementType, ArraySize>
                : never
        : never;
