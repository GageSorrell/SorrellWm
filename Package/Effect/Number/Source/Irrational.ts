/**
 * A data structure for modeling the irrational numbers.
 *
 * @module @sorrell/effect-number/Irrational
 */

import { dual } from "effect/Function";
import type * as Base from "./IrrationalBase.ts";
import type { Number } from "./Number.ts";

/**
 * @file      Irrational.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/Irrational");
export type TypeId = typeof TypeId;

export interface Irrational extends Base.IrrationalBase<number>
{
    readonly [ TypeId ]: TypeId;
}

export interface Getters extends Base.Getters<number> { }

    /**
     *
     * @remarks
     * The {@link NumFractionalDigits} is the *only* bound imposed on the number of times that the
     * {@link Getter} is called.  If the {@link Getter} does not eventually produce a value with
     * the desired {@link NumFractionalDigits}, then this function will never return.  Use
     * {@link GetTruncationLazy} to impose an upper-bound on the number of times that the {@link Getter}
     * is called.
     *
     * Whether this is truly a truncation, and not an *approximation*, is not guaranteed, and
     * depends upon the implementation in the {@link }.  The irrational numbers provided in the
     * {@link \@sorrell/effect-number/Irrational | Irrational} and
     * {@link \@sorrell/effect-number/BigIrrational | BigIrrational} modules *do* produce truncations.
     *
     * @see {@link GetTruncationLazy} {@link GetTruncationByIterations} The other constructor functions
     * that wrap the {@link Getter}.
     *
     * @param NumFractionalDigits - The desired number of fractional digits.
     * @returns {TruncationType} A truncation of the irrational number given by the {@link Getter}.
     */
export const GetTruncation: {
    (NumFractionalDigits: number): (Self: Irrational) => number;
    (NumFractionalDigits: number, Self: Irrational): number;
} = dual(2, (NumFractionalDigits: number, Self: Irrational): number =>
{

});

export const GetTruncationLazy: {
    (NumFractionalDigits: number, Self: Irrational) => number;
} = dual(2, (, Self: Irrational): number =>
{

});
    (NumFractionalDigits: number): (Self: Irrational) => number;

export const GetTruncationByIterations: {
    (NumIterations: number): (Self: Irrational) => number;
    (NumFractionalDigits: number, Self: Irrational): number;
} = dual(2, (, Self: Irrational): number =>
{

});

export const GetNumFractionalDigits = (Value: number): number =>
{

};

    /**
     * A convenience function corresponding to {@link GetTruncation}, which is called
     * for ten iterations.
     *
     * @returns {TruncationType} An approximation of this irrational number, computed
     * with ten iterations.
     */
    readonly Get: () => TruncationType;
