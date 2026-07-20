/**
 * A data structure for modeling the unsigned integers (for the positive integers,
 * use the {@link \@sorrell/effect-number/Natural | Natural} type).
 *
 * @module @sorrell/effect-number/UnsignedInt
 */

/**
 * @file      UnsignedInt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Integral } from "./Integral.ts";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/BigUnsignedInt");
export type TypeId = typeof TypeId;

export interface UnsignedInt extends Integral<bigint>
{
    readonly [ TypeId ]: TypeId;
}
