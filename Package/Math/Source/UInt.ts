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
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export type UInt = Int & Brand.Branded<number, typeof TypeIdKey>;

const UIntError = (Self: number): RangeError => new RangeError(`Cannot construct a UInt from number ${ Self }.`);

export const UInt = (Self: number): UInt =>
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

export const FromInt = (Self: Int): EffectOption.Option<UInt> =>
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

export const ToInt = (Self: UInt): Int => Self as Int;

export const IsUInt = (Value: unknown): Value is UInt =>
{
    return typeof Value === "number" && Number.isSafeInteger(Value) && Value >= 0;
};

export namespace As
{
    export const Option = (Self: number): EffectOption.Option<UInt> =>
    {
        if (Number.isSafeInteger(Self) && Self >= 0)
        {
            return EffectOption.some(Self as UInt);
        }
        else
        {
            return EffectOption.none();
        }
    }

    export const Result = (Self: number): EffectResult.Result<UInt, RangeError> =>
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

    export const Effect = (Self: number): EffectEffect.Effect<UInt, RangeError> =>
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

export const Floor: {
    (Self: UInt): UInt;
    (Self: number): UInt;
} = Math.floor as any;

export const UIntUnsafe = (Self: number): UInt => Self as UInt;

export const Zero: UInt = UIntUnsafe(0);
export const One: UInt = UIntUnsafe(1);
export const Unit: UInt = One;
export const Two: UInt = UIntUnsafe(2);

export const Divides: {
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

export const Sum: {
    (That: UInt): (Self: UInt) => UInt;
    (Self: UInt, That: UInt): UInt;
} = Function.dual(2, (Self: UInt, That: UInt): UInt =>
{
    return Self + That as UInt;
});

export const SumAll: { (Summand: Iterable<UInt>): UInt; } = Iterable.reduce(Zero, Sum);

export const Subtract: {
    (That: UInt): (Self: UInt) => EffectOption.Option<UInt>;
    (Self: UInt, That: UInt): EffectOption.Option<UInt>;
} = Function.dual(2, (Self: UInt, That: UInt): EffectOption.Option<UInt> =>
{
    const Out: UInt = Self - That as UInt;
    return Out >= 0
        ? EffectOption.some(Out)
        : EffectOption.none();
});

export const SubtractUnsafe: {
    (That: UInt): (Self: UInt) => UInt;
    (Self: UInt, That: UInt): UInt;
} = Function.dual(2, (Self: UInt, That: UInt): UInt =>
{
    return Self - That as UInt;
});

export const Multiply: {
    (That: UInt): (Self: UInt) => UInt;
    (Self: UInt, That: UInt): UInt;
} = Function.dual(2, (Self: UInt, That: UInt): UInt =>
{
    return Self * That as UInt;
});

export const MultiplyAll: { (Summand: Iterable<UInt>): UInt; } = Iterable.reduce(Zero, Multiply);

export const Pow: {
    (Exponent: number): (Self: UInt) => EffectOption.Option<number>;
    (Self: UInt, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, (Self: UInt, Exponent: number): EffectOption.Option<number> =>
{
    const Out: number = Math.pow(Self, Exponent);

    return Number.isNaN(Out)
        ? EffectOption.none()
        : EffectOption.some(Out);
});

export const PowUnsafe: {
    (Exponent: number): (Self: UInt) => EffectOption.Option<number>;
    (Self: UInt, Exponent: number): EffectOption.Option<number>;
} = Function.dual(2, Math.pow);

export const Abs: { (Self: UInt): UInt; } = Math.abs as any;

export const Max: { (Values: Iterable<UInt>): UInt; } = Function.tupled(Math.max) as any;
export const Min: { (Values: Iterable<UInt>): UInt; } = Function.tupled(Math.min) as any;

export const Trunc: {
    (Self: UInt): UInt;
    (Self: number): UInt;
} = Math.trunc as any;
