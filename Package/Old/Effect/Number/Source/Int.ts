/**
 * A data structure for modeling the integers.
 *
 * @module @sorrell/effect-number/Int
 */

/**
 * @file      Int.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Natural from "./Natural.ts";
import * as UnsignedInt from "./UnsignedInt.ts";
import { BigInt, Brand, Option, type BigDecimal } from "effect";
import type { Integral } from "./Integral.ts";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-number/Int");
export type TypeId = typeof TypeId;

export interface Int extends Integral<number>
{
    readonly [ TypeId ]: TypeId;
}

export type IntLike =
    | string
    | number
    | bigint
    | BigDecimal.BigDecimal
    | UnsignedInt.UnsignedInt
    | Natural.Natural;

export type AnyInt =
    | bigint
    | Natural.Natural
    | UnsignedInt.UnsignedInt
    | Int;

export type NonpositiveInt = Brand.Branded<Int, "NonpositiveInt">;

const NonpositiveIntConstructorUnsafe = Brand.nominal<NonpositiveInt>();

export const FromAnyInt = (In: AnyInt): Int =>
{

};

export const NonpositiveIntUnsafe = (Value: AnyInt): NonpositiveInt =>
{
    const Normalized: Int
    if (typeof Value === "bigint")
    {
        return  BigInt.toNumber(Value);
    }
    Option.some(NonpositiveIntConstructorUnsafe(Value))
};

export const NonpositiveInt = (Value: Int): Option.Option<NonpositiveInt> =>
{
    return IsNonzero(Value)
        ? Option.some(Brand.nominal<NonpositiveInt>()(Value))
        : Option.none();
};

export type NonzeroInt = Brand.Branded<Int, "NonzeroInt">;

export const Int: {
    (In: number) => Option.Option<Int>;
    (In: bigint) => Option.Option<Int>;
    (In: BigDecimal.BigDecimal) => Option.Option<Int>;
    (In: number | bigint) => Option.Option<Int>;
} = (In: number | bigint)
