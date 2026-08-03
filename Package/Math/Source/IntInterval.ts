/**
 * Integer interval types and operations.
 *
 * @module @sorrell/math/IntInterval
 *
 * @file      IntInterval.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Int from "./Int.js";
import {
    type Equal,
    type Inspectable,
    type NonEmptyIterable,
    Option,
    type Pipeable,
    Predicate
} from "effect";
import { IntPoint } from "./index.js";
import { Proto } from "./Internal/IntInterval.ts";

const TypeIdKey = "~sorrell/math/IntInterval" as const;
export/** The runtime type identifier for integer intervals. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the integer-interval runtime identifier. */
export type TypeId = typeof TypeId;

/** An immutable interval delimited by integer start and end values. */
export interface IntInterval extends
    Inspectable.Inspectable,
    Equal.Equal,
    Pipeable.Pipeable,
    NonEmptyIterable.NonEmptyIterable<number>
{
    readonly [ TypeId ]: TypeId;
    readonly Start: Int.Int;
    readonly End: Int.Int;
}

export/** Construct an immutable interval after flooring both endpoints. */
const IntInterval: {
    (Start: number, End: number): IntInterval;
    (Start: Int.Int, End: Int.Int): IntInterval;
    (Start: number | Int.Int, End: number | Int.Int): IntInterval;
} = (Start: number | Int.Int, End: number | Int.Int): IntInterval =>
{
    const Out = Object.create(Proto);

    Out.Start = Math.floor(Start);
    Out.End = Math.floor(End);

    return Object.freeze(Out);
};

export/** The unit interval from zero to one. */
const Unit: IntInterval = IntInterval(0 as Int.Int, 1 as Int.Int);

export/** Determine whether a value carries the integer-interval type identifier. */
const IsIntInterval: { (Value: unknown): Value is IntInterval; } =
    Predicate.hasProperty(TypeId) as any;

export/** Convert an interval to a `[Start, End]` tuple. */
const Tupled = (Self: IntInterval): readonly [ Int.Int, Int.Int ] =>
    [ Self.Start, Self.End ] as const;

export/** Represent an interval's endpoints as the coordinates of an integer point. */
const ToIntPoint = (Self: IntInterval): IntPoint.IntPoint =>
    IntPoint.IntPoint(Self.Start, Self.End);

export namespace From
{
    export/** Construct an interval from a `[Start, End]` tuple. */
    const Tuple = (Tuple: [ Int.Int, Int.Int ]): IntInterval =>
        IntInterval(Math.floor(Tuple[0]), Math.floor(Tuple[1]));

    export/** Construct an interval from a record containing `Start` and `End`. */
    const Record = <ArgType extends Pick<IntInterval, "Start" | "End">>(
        Arg: ArgType
    ): IntInterval => IntInterval(Arg.Start, Arg.End);
}

export/** Compute the endpoint difference when it falls outside the safe-integer range. */
const Length = (Self: IntInterval): Option.Option<number> =>
{
    const Out: number = Self.End - Self.Start;
    if (Number.isSafeInteger(Out))
    {
        return Option.none();
    }
    else
    {
        return Option.some(Out);
    }
};

export/** Compute the endpoint difference without checking its numeric range. */
const LengthUnsafe = (Self: IntInterval): number => Self.End - Self.Start;
