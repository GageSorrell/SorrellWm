/**
 * The base interface for the {@link \@sorrell/effect-number/Irrational | Irrational} and
 * {@link \@sorrell/effect-number/BigIrrational | BigIrrational} structures.
 *
 * @module @sorrell/effect-number/IrrationalBase
 * @internal
 */

/**
 * @file      IrrationalBase.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { BigDecimal } from "effect";
import type { Number } from "./Number.ts";

// /**
//  * The options that a non-recursive {@link IrrationalBase!Getter} must accept.
//  *
//  * @remarks
//  * All properties are *optional*, however *not* all
//  *
//  */
// export interface Options
// {
//     readonly NumIterations?: number;
//     readonly NumFractionalDigits?: number;
// }

export type Truncation =
    | number
    | BigDecimal.BigDecimal;

/**
 * The getters with which an irrational number may be defined.
 *
 * @remarks
 * In the case that a simple implementation is desired, it is recommended to only provide a
 * {@link Recurrence} which neglects its argument (and is therefore idempotent).
 *
 * @property {(NumFractionalDigits: number) => TruncationType} NumFractionalDigits - The getter
 * that is bounded by the desired number of fractional digits in the truncation.
 *
 * @property {(Previous?: TruncationType) => TruncationType} Recurrence - The recursive function
 * that approximates this irrational number.
 *
 * @property {(NumIterations: number) => TruncationType} NumIterations - The getter that is bounded
 * in *wrt* the number of iterations of the {@link Recurrence}.
 */
export interface Getters<TruncationType extends Truncation>
{
    readonly Recurrence: (Previous?: TruncationType) => TruncationType;

    readonly NumFractionalDigits?: (NumFractionalDigits: number) => TruncationType;
    readonly NumIterations?: (NumIterations: number) => TruncationType;
}

export interface IrrationalBase<TruncationType extends Truncation> extends Number
{
    /**
     *
     * @param Previous - The value produced by the previous call to this function.
     * @returns {TruncationType} An approximation of this irrational number.
     */
    readonly Getters?: Getters<TruncationType>;
}
