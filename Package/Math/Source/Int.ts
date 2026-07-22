/**
 *
 *
 * @module @sorrell/math/Int
 *
 * @file      Int.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    type Brand,
    Effect as EffectEffect,
    Option as EffectOption,
    Result as EffectResult,
    Function,
    Iterable
} from "effect";

const TypeIdKey = "~sorrell/math/Int" as const;
export/** The runtime type identifier for branded integers. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the integer runtime identifier. */
export type TypeId = typeof TypeId;

/** A JavaScript safe integer carrying the `Int` brand. */
export type Int = Brand.Branded<number, typeof TypeIdKey>;

const IntError = (Self: number): RangeError => new RangeError(
    `Cannot construct an Int from number ${ Self }.`
);

export/** Construct an `Int`, throwing when the input is not a safe integer. */
const Int = (Self: number): Int =>
{
    if (Number.isSafeInteger(Self))
    {
        return Self as Int;
    }
    else
    {
        throw IntError(Self);
    }
};

export/** Determine whether a value is a JavaScript safe integer. */
const IsInt: { (Value: unknown): Value is Int; } = Number.isSafeInteger as any;

export namespace As
{
    export/** Convert a number to an `Int`, returning `None` for an invalid input. */
    const Option = (Self: number): EffectOption.Option<Int> =>
    {
        if (Number.isSafeInteger(Self))
        {
            return EffectOption.some(Self as Int);
        }
        else
        {
            return EffectOption.none();
        }
    };

    export/** Convert a number to a `Result` containing an `Int` or a range error. */
    const Result = (Self: number): EffectResult.Result<Int, RangeError> =>
    {
        if (Number.isSafeInteger(Self))
        {
            return EffectResult.succeed(Self as Int);
        }
        else
        {
            return EffectResult.fail(IntError(Self));
        }
    };

    export/** Convert a number to an Effect that may fail with a range error. */
    const Effect = (Self: number): EffectEffect.Effect<Int, RangeError> =>
    {
        if (Number.isSafeInteger(Self))
        {
            return EffectEffect.succeed(Self as Int);
        }
        else
        {
            return EffectEffect.fail(IntError(Self));
        }
    };
}

export/** Round a number down and treat the result as an `Int`. */
const Floor: {
    (Self: Int): Int;
    (Self: number): Int;
} = Math.floor as any;

export/** Apply the `Int` brand without validating the input. */
const IntUnsafe = (Self: number): Int => Self as Int;

export/** The additive identity. */
const Zero: Int = IntUnsafe(0);
export/** The positive integer one. */
const One: Int = IntUnsafe(1);
export/** The positive unit integer. */
const Unit: Int = One;
export/** The negative integer one. */
const MinusOne: Int = IntUnsafe(-1);
export/** The negative unit integer. */
const MinusUnit: Int = MinusOne;

export/** Determine whether one integer divides another without a remainder. */
const Divides: {
    (Divisor: Int): (Self: Int) => boolean;
    (Self: Int, Divisor: Int): boolean;
} = Function.dual(2, (Self: Int, Divisor: Int): boolean =>
{
    if (Divisor === 0)
    {
        return false;
    }

    const Quotient: number = Self / Divisor;
    return Number.isSafeInteger(Quotient);
});

export/** Add two integers. */
const Sum: {
    (That: Int): (Self: Int) => Int;
    (Self: Int, That: Int): Int;
} = Function.dual(2, (Self: Int, That: Int): Int =>
{
    return Self + That as Int;
});

export/** Subtract one integer from another. */
const Subtract: {
    (That: Int): (Self: Int) => Int;
    (Self: Int, That: Int): Int;
} = Function.dual(2, (Self: Int, That: Int): Int =>
{
    return Self - That as Int;
});

export/** Add every integer in an iterable. */
const SumAll: { (Summand: Iterable<Int>): Int; } = Iterable.reduce(Zero, Sum);

export/** Multiply two integers. */
const Multiply: {
    (That: Int): (Self: Int) => Int;
    (Self: Int, That: Int): Int;
} = Function.dual(2, (Self: Int, That: Int): Int =>
{
    return Self * That as Int;
});

export/** Multiply every integer in an iterable. */
const MultiplyAll: { (Summand: Iterable<Int>): Int; } =
    Iterable.reduce(Zero, Multiply);

export/** Raise an integer to a power, returning `None` when the result is `NaN`. */
const Pow: {
    (Exponent: number): (Self: Int) => EffectOption.Option<number>;
    (Self: Int, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, (Self: Int, Exponent: number): EffectOption.Option<number> =>
{
    const Out: number = Math.pow(Self, Exponent);

    return Number.isNaN(Out)
        ? EffectOption.none()
        : EffectOption.some(Out);
});

export/** Raise an integer to a power without validating the numeric result. */
const PowUnsafe: {
    (Exponent: number): (Self: Int) => EffectOption.Option<number>;
    (Self: Int, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, Math.pow);

export/** Return the absolute value of an integer. */
const Abs: { (Self: Int): Int; } = Math.abs as any;

export/** Return the greatest integer in an iterable. */
const Max: { (Values: Iterable<Int>): Int; } = Function.tupled(Math.max) as any;
export/** Return the least integer in an iterable. */
const Min: { (Values: Iterable<Int>): Int; } = Function.tupled(Math.min) as any;

export/** Remove the fractional portion of a number and treat the result as an `Int`. */
const Trunc: {
    (Self: Int): Int;
    (Self: number): Int;
} = Math.trunc as any;
