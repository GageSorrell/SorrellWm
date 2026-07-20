/**
 * A structure that models an algebraic group.
 *
 * @module @sorrell/effect-number/Group
 */

/**
 * @file      Group.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Algebra from "./Algebra.ts";
import type { Predicate } from "effect";

export interface Group<ElementType>
{
    readonly Identity: ElementType;

    readonly Add: Algebra.Operation.Binary<ElementType>;

    readonly Multiply: Algebra.Operation.Binary<ElementType>;

    readonly Inverse: Algebra.Operation.Unary<ElementType>;

    readonly IsElement: Predicate.Refinement<unknown, ElementType>;
}
