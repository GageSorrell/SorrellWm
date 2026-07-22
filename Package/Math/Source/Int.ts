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
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export type Int = Brand.Branded<number, typeof TypeIdKey>;

const IntError = (Self: number): RangeError => new RangeError(`Cannot construct an Int from number ${ Self }.`);

export const Int = (Self: number): Int =>
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

export const IsInt: { (Value: unknown): Value is Int; } = Number.isSafeInteger as any;

export namespace As
{
    export const Option = (Self: number): EffectOption.Option<Int> =>
    {
        if (Number.isSafeInteger(Self))
        {
            return EffectOption.some(Self as Int);
        }
        else
        {
            return EffectOption.none();
        }
    }

    export const Result = (Self: number): EffectResult.Result<Int, RangeError> =>
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

    export const Effect = (Self: number): EffectEffect.Effect<Int, RangeError> =>
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

export const Floor: {
    (Self: Int): Int;
    (Self: number): Int;
} = Math.floor as any;

export const IntUnsafe = (Self: number): Int => Self as Int;

export const Zero: Int = IntUnsafe(0);
export const One: Int = IntUnsafe(1);
export const Unit: Int = One;
export const MinusOne: Int = IntUnsafe(-1);
export const MinusUnit: Int = MinusOne;

export const Divides: {
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

export const Sum: {
    (That: Int): (Self: Int) => Int;
    (Self: Int, That: Int): Int;
} = Function.dual(2, (Self: Int, That: Int): Int =>
{
    return Self + That as Int;
});

export const SumAll: { (Summand: Iterable<Int>): Int; } = Iterable.reduce(Zero, Sum);

export const Multiply: {
    (That: Int): (Self: Int) => Int;
    (Self: Int, That: Int): Int;
} = Function.dual(2, (Self: Int, That: Int): Int =>
{
    return Self * That as Int;
});

export const MultiplyAll: { (Summand: Iterable<Int>): Int; } =
    Iterable.reduce(Zero, Multiply);

export const Pow: {
    (Exponent: number): (Self: Int) => EffectOption.Option<number>;
    (Self: Int, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, (Self: Int, Exponent: number): EffectOption.Option<number> =>
{
    const Out: number = Math.pow(Self, Exponent);

    return Number.isNaN(Out)
        ? EffectOption.none()
        : EffectOption.some(Out);
});

export const PowUnsafe: {
    (Exponent: number): (Self: Int) => EffectOption.Option<number>;
    (Self: Int, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, Math.pow);

export const Abs: { (Self: Int): Int; } = Math.abs as any;

export const Max: { (Values: Iterable<Int>): Int; } = Function.tupled(Math.max) as any;
export const Min: { (Values: Iterable<Int>): Int; } = Function.tupled(Math.min) as any;

export const Trunc: {
    (Self: Int): Int;
    (Self: number): Int;
} = Math.trunc as any;
