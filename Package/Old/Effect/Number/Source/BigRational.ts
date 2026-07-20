/**
 * A structure that models rational numbers with `BigInt`, with support for
 * interacting with the {@link BigDecimal} type provided by
 * {@link https://www.npmjs.com/package/effect | effect}.
 *
 * @module @sorrell/effect-number/BigRational
 */

import type { Ratio } from "./Ratio.ts";

/**
 * @file      BigRational.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/BigRational");
export type TypeId = typeof TypeId;

export interface BigRational extends Ratio<bigint>
{
    readonly Numerator: bigint;
    readonly Denominator: bigint;

    // readonly CanonicalForm: BigRational | undefined;
}
