/**
 * A module for modeling commutative rings.
 *
 * @module @sorrell/effect-number/CommutativeRing
 */

/**
 * @file      CommutativeRing.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Algebra from "./Algebra.ts";
import type { Group } from "./Group.ts";
import type { Predicate } from "effect";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A commutative ring of a given {@link ElementType}.
 *
 * @template ElementType - The type of the elements that belong to this.
 *
 * @template NonzeroGroupType - If specified, this is the {@link Group}
 * embedded in this which does *not* contain the zero of this.
 */
export interface CommutativeRing<
    ElementType,
    NonzeroGroupType extends Group<ElementType> = never
>
{
    /* eslint-enable @typescript-eslint/no-explicit-any */

    readonly Identity: ElementType;

    readonly Unit: ElementType;

    readonly Add: Algebra.Operation.Binary<ElementType>;

    readonly Multiply: Algebra.Operation.Binary<ElementType>;

    readonly Divide: Algebra.Operation.Safe<Algebra.Operation.Binary<ElementType>>;

    readonly DivideUnsafe: Algebra.Operation.Safe<Algebra.Operation.Binary<ElementType>>;

    readonly DivideNonzero: Algebra.Operation.Safe<
        Algebra.Operation.BinaryNonzero<ElementType, NonzeroGroupType>
    >;

    readonly Inverse: Algebra.Operation.Unary<ElementType>;

    readonly IsElement: Predicate.Refinement<unknown, ElementType>;

    readonly Round: (Method: RoundingMethod): ElementType;
}
