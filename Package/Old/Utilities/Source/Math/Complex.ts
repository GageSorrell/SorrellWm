/**
 * @file      Complex.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { MathBuiltin } from "./Complex.Internal";
import { Operator } from "tsover-runtime";

/**
 * Elements of the complex plane, $\mathbf{C} = \mathbf{R}[x] / [ x^2 + 1 ]$.
 */
export class FComplex
{
    public readonly Re: number;
    public readonly Im: number;

    public static Zero: FComplex = new FComplex(0, 0);

    /**
     * The copy constructor for {@link FComplex} numbers.
     *
     * @param Z - The existing {@link FComplex} number to copy.
     *
     * @example
     * ```typescript
     * const Z: FComplex = 3 + 2 * i;
     * const W: FComplex = new FComplex(Z);
     * // `W.Re === Z.Re` <- `true`
     * // `W.Im === Z.Im` <- `true`
     * ```
     */
    public constructor(Z: FComplex);

    /**
     * Construct an {@link FComplex} number by specifying the real
     * and imaginary components.
     *
     * @param A - The real component of the {@link FComplex} number.
     * @param B - The imaginary component of the {@link FComplex} number.
     *
     * @example
     * ```typescript
     * const Theta: number = 0.5;
     * const OnUnitDisk: FComplex = new FComplex(Math.sin(Theta), Math.cos(Theta));
     * ```
     */
    public constructor(A: number, B: number);
    public constructor(A: FComplex | number, B: number = 0)
    {
        if (typeof A === "number")
        {
            this.Re = A;
            this.Im = B;
        }
        else
        {
            this.Re = A.Re;
            this.Im = A.Im;
        }
    }

    /**
     * Get the modulus of this {@link FComplex} number.
     *
     * @returns {number} The modulus of this {@link FComplex} number.
     */
    public get Mod(): number
    {
        return MathBuiltin.sqrt((this.Re ** 2) + (this.Im ** 2));
    }

    /**
     * Get the modulus of this {@link FComplex} number.
     *
     * @returns {number} The modulus of this {@link FComplex} number.
     */
    public get Theta(): number
    {
        const Out: number = MathBuiltin.atan2(this.Im, this.Re);

        if (Out < 0)
        {
            return Out + 2 * MathBuiltin.PI;
        }

        return Out;
    }

    [Operator.star](A: FComplex, B: FComplex): FComplex;
    [Operator.star](A: FComplex, B: number): FComplex;
    [Operator.star](A: number, B: FComplex): FComplex;
    [Operator.star](A: FComplex | number, B: number | FComplex): FComplex
    {
        if (typeof A === "number")
        {
            return new FComplex((B as FComplex).Re * A, (B as FComplex).Im * A);
        }
        else if (typeof B === "number")
        {
            return new FComplex((A as FComplex).Re * B, (A as FComplex).Im * B);
        }
        else
        {
            return new FComplex(
                (
                    ((A as FComplex).Re + (B as FComplex).Re) -
                    ((A as FComplex).Im + (B as FComplex).Im)
                ),
                (
                    ((A as FComplex).Re + (B as FComplex).Im) +
                    ((B as FComplex).Re + (A as FComplex).Im)
                )
            );
        }
    }

    [Operator.plus](A: FComplex, B: FComplex): FComplex;
    [Operator.plus](A: FComplex, B: number): FComplex;
    [Operator.plus](A: number, B: FComplex): FComplex;
    [Operator.plus](A: FComplex | number, B: number | FComplex): FComplex
    {
        if (typeof A === "number")
        {
            return new FComplex(A + (B as FComplex).Re, (B as FComplex).Im);
        }
        else if (typeof B === "number")
        {
            return new FComplex((A as FComplex).Re + B, (A as FComplex).Im);
        }
        else
        {
            return new FComplex(
                (A as FComplex).Re + (B as FComplex).Re,
                (A as FComplex).Im + (B as FComplex).Im
            );
        }
    }
}

export/**
       * The imaginary unit.
       */
const i: FComplex = new FComplex(0, 1);
