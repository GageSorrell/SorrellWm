/**
 * A module for modeling fields.
 *
 * @module @sorrell/effect-number/Field
 */

import type { CommutativeRing } from "./CommutativeRing.ts";
import type { Group } from "./Group.ts";
import type { Ratio } from "./Ratio.ts";

/**
 * @file      Field.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @remarks
 * Currently this implementation is equivalent to {@link CommutativeRing}, since it includes functions
 * for division, and the safety of division is the same in fields (since both contain zero).
 */
export interface Field<ElementType, NonzeroGroupType extends Group<ElementType> = never> extends
    CommutativeRing<ElementType, NonzeroGroupType> { }

export type OfFractions<CommutativeRingType extends CommutativeRing<any, any>> =
    CommutativeRingType extends CommutativeRing<
        infer ElementType,
        infer _NonzeroGroupType extends Group<infer NonzeroElementType>
    >
        ? Field<CommutativeRing<Ratio<ElementType>, Group<Ratio<NonzeroElementType>>>>
        : never;

/* eslint-enable @typescript-eslint/no-explicit-any */
