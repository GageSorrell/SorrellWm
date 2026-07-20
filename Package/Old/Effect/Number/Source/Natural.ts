/**
 * A data structure for modeling the natural numbers (for the nonnegative integers, use
 * the {@link \@sorrell/effect-number/UnsignedInt | UnsignedInt} structure).
 *
 * @module @sorrell/effect-number/Natural
 */

import type { Number } from "./Number.ts";

/**
 * @file      Natural.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/Natural");
export type TypeId = typeof TypeId;

export interface Natural extends Number
{
    readonly [ TypeId ]: TypeId;
}
