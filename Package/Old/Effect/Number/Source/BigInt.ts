/**
 * A module isomorphic to the {@link \@sorrell/effect-number/Int} module, where the underlying
 * value of this module's {@link BigInt:type | structure} is a `bigint` (rather than a `number`).
 *
 * @module @sorrell/effect-number/BigInt
 */

import type { Integral } from "./Integral.ts";

/**
 * @file      BigInt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/BigInt");
export type TypeId = typeof TypeId;

export interface BigInt extends Integral<bigint>
{
    readonly [ TypeId ]: TypeId;
}
