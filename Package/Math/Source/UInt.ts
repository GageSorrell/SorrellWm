/**
 *
 *
 * @module @sorrell/math/UInt
 *
 * @file      UInt.ts
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
import type { Int } from "./Int.ts";

const TypeIdKey = "~sorrell/math/UInt" as const;
export/** The runtime type identifier for branded unsigned integers. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the unsigned-integer runtime identifier. */
export type TypeId = typeof TypeId;

/* eslint-disable @typescript-eslint/naming-convention */
/** A nonnegative JavaScript safe integer carrying the `UInt` brand. */
export type UInt = Int & Brand.Branded<number, typeof TypeIdKey>;
/* eslint-enable @typescript-eslint/naming-convention */

const UIntError = (Self: number): RangeError => new RangeError(
    `Cannot construct a UInt from number ${ Self }.`
);

export/** Construct a `UInt`, throwing unless the input is a nonnegative safe integer. */
const UInt = (Self: number): UInt =>
{
    if (Number.isSafeInteger(Self) && Self >= 0)
    {
        return Self as UInt;
    }
    else
    {
        throw UIntError(Self);
    }
};

export/** Convert an integer to a `UInt`, returning `None` when it is negative. */
const FromInt = (Self: Int): EffectOption.Option<UInt> =>
{
    if (Self >= 0)
    {
        return EffectOption.some(Self as UInt);
    }
    else
    {
        return EffectOption.none();
    }
};

export/** Remove the unsigned brand while retaining the integer brand. */
const ToInt = (Self: UInt): Int => Self as Int;

export/** Determine whether a value is a nonnegative JavaScript safe integer. */
const IsUInt = (Value: unknown): Value is UInt =>
{
    return typeof Value === "number" && Number.isSafeInteger(Value) && Value >= 0;
};

export namespace As
{
    export/** Convert a number to a `UInt`, returning `None` for an invalid input. */
    const Option = (Self: number): EffectOption.Option<UInt> =>
    {
        if (Number.isSafeInteger(Self) && Self >= 0)
        {
            return EffectOption.some(Self as UInt);
        }
        else
        {
            return EffectOption.none();
        }
    };

    export/** Convert a number to a `Result` containing a `UInt` or a range error. */
    const Result = (Self: number): EffectResult.Result<UInt, RangeError> =>
    {
        if (Number.isSafeInteger(Self) && Self >= 0)
        {
            return EffectResult.succeed(Self as UInt);
        }
        else
        {
            return EffectResult.fail(UIntError(Self));
        }
    };

    export/** Convert a number to an Effect that may fail with a range error. */
    const Effect = (Self: number): EffectEffect.Effect<UInt, RangeError> =>
    {
        if (Number.isSafeInteger(Self) && Self >= 0)
        {
            return EffectEffect.succeed(Self as UInt);
        }
        else
        {
            return EffectEffect.fail(UIntError(Self));
        }
    };
}

export/** Round a number down and treat the result as a `UInt`. */
const Floor: {
    (Self: UInt): UInt;
    (Self: number): UInt;
} = Math.floor as any;

export/** Apply the `UInt` brand without validating the input. */
const UIntUnsafe = (Self: number): UInt => Self as UInt;

export/** The additive identity. */
const Zero: UInt = UIntUnsafe(0);
export/** The unsigned integer one. */
const One: UInt = UIntUnsafe(1);
export/** The unsigned unit integer. */
const Unit: UInt = One;
export/** The unsigned integer two. */
const Two: UInt = UIntUnsafe(2);

export/** Determine whether one unsigned integer divides another without a remainder. */
const Divides: {
    (Divisor: UInt): (Self: UInt) => boolean;
    (Self: UInt, Divisor: UInt): boolean;
} = Function.dual(2, (Self: UInt, Divisor: UInt): boolean =>
{
    if (Divisor === 0)
    {
        return false;
    }

    const Quotient: number = Self / Divisor;
    return Number.isSafeInteger(Quotient);
});

export/** Add two unsigned integers. */
const Sum: {
    (That: UInt): (Self: UInt) => UInt;
    (Self: UInt, That: UInt): UInt;
} = Function.dual(2, (Self: UInt, That: UInt): UInt =>
{
    return Self + That as UInt;
});

export/** Add every unsigned integer in an iterable. */
const SumAll: { (Summand: Iterable<UInt>): UInt; } = Iterable.reduce(Zero, Sum);

export/** Subtract unsigned integers, returning `None` for a negative result. */
const Subtract: {
    (That: UInt): (Self: UInt) => EffectOption.Option<UInt>;
    (Self: UInt, That: UInt): EffectOption.Option<UInt>;
} = Function.dual(2, (Self: UInt, That: UInt): EffectOption.Option<UInt> =>
{
    const Out: UInt = Self - That as UInt;
    return Out >= 0
        ? EffectOption.some(Out)
        : EffectOption.none();
});

export/** Subtract unsigned integers without checking for a negative result. */
const SubtractUnsafe: {
    (That: UInt): (Self: UInt) => UInt;
    (Self: UInt, That: UInt): UInt;
} = Function.dual(2, (Self: UInt, That: UInt): UInt =>
{
    return Self - That as UInt;
});

export/** Multiply two unsigned integers. */
const Multiply: {
    (That: UInt): (Self: UInt) => UInt;
    (Self: UInt, That: UInt): UInt;
} = Function.dual(2, (Self: UInt, That: UInt): UInt =>
{
    return Self * That as UInt;
});

export/** Multiply every unsigned integer in an iterable. */
const MultiplyAll: { (Summand: Iterable<UInt>): UInt; } = Iterable.reduce(Zero, Multiply);

export/** Raise an unsigned integer to a power, returning `None` for `NaN`. */
const Pow: {
    (Exponent: number): (Self: UInt) => EffectOption.Option<number>;
    (Self: UInt, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, (Self: UInt, Exponent: number): EffectOption.Option<number> =>
{
    const Out: number = Math.pow(Self, Exponent);

    return Number.isNaN(Out)
        ? EffectOption.none()
        : EffectOption.some(Out);
});

export/** Raise an unsigned integer to a power without validating the result. */
const PowUnsafe: {
    (Exponent: number): (Self: UInt) => EffectOption.Option<number>;
    (Self: UInt, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, Math.pow);

export/** Return the absolute value of an unsigned integer. */
const Abs: { (Self: UInt): UInt; } = Math.abs as any;

export/** Return the greatest unsigned integer in an iterable. */
const Max: { (Values: Iterable<UInt>): UInt; } = Function.tupled(Math.max) as any;
export/** Return the least unsigned integer in an iterable. */
const Min: { (Values: Iterable<UInt>): UInt; } = Function.tupled(Math.min) as any;

export/** Remove the fractional portion of a number and treat the result as a `UInt`. */
const Trunc: {
    (Self: UInt): UInt;
    (Self: number): UInt;
} = Math.trunc as any;
