/**
 * A data structure for modeling the irrational numbers, using the {@link BigDecimal} structure
 * in the API surface.
 *
 * @module @sorrell/effect-number/BigIrrational
 */

import type { BigDecimal } from "effect";
import type { IrrationalBase } from "./IrrationalBase.ts";

/**
 * @file      BigIrrational.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type { Getters } from "./IrrationalBase.ts";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/BigIrrational");
export type TypeId = typeof TypeId;

export interface BigIrrational extends IrrationalBase<BigDecimal.BigDecimal>
{
    readonly [ TypeId ]: TypeId;
}

export const GetNumFractionalDigits = (Value: BigDecimal.BigDecimal): number =>
{
    return Value.scale;
};
