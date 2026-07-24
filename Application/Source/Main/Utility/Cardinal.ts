/**
 *
 *
 * @module @sorrell/wm/Main/Utility/Cardinal
 *
 * @file      Cardinal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Function, type Record } from "effect";

export/** The type ID of this module. */
const TypeId = "~sorrell/wm/Main/Utility/Cardinal" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

const GetKey = (...Labels: ReadonlyArray<string>): string =>
    [ TypeId, "Cardinal", ...Labels ].join("!");

export/** The upward direction in the plane, corresponding to the `+Y` direction in usual terms. */
const Up: unique symbol = Symbol.for(GetKey("Up"));

/** {@inheritDoc Up:var} */
export type Up = typeof Up;

export/** The downward direction in the plane, corresponding to the `-Y` direction in usual terms. */
const Down: unique symbol = Symbol.for(GetKey("Down"));

/** {@inheritDoc Down:var} */
export type Down = typeof Down;

export/** The leftward direction in the plane, corresponding to the `+X` direction in usual terms. */
const Left: unique symbol = Symbol.for(GetKey("Left"));

/** {@inheritDoc Left:var} */
export type Left = typeof Left;

export/** The rightward direction in the plane, corresponding to the `-X` direction in usual terms. */
const Right: unique symbol = Symbol.for(GetKey("Right"));

/** {@inheritDoc Right:var} */
export type Right = typeof Right;

/** The `Up` or `Down` direction. */
export type Vertical =
    | Up
    | Down;

/** The `Left` or `Right` direction. */
export type Horizontal =
    | Left
    | Right;

export/** Whether a given value is a vertical direction. */
const IsVertical = (Value: Cardinal): Value is Vertical =>
    Value === Up || Value === Down;

export/** Whether a given value is a horizontal direction. */
const IsHorizontal = (Value: Cardinal): Value is Horizontal =>
    Value === Left || Value === Right;

export/** Match a given direction to a lazily-evaluated argument. */
const Match: {
    <A>(Value: Cardinal, Cases: Record.ReadonlyRecord<Cardinal, Function.LazyArg<A>>): A;

    <A>(Cases: Record.ReadonlyRecord<Cardinal, Function.LazyArg<A>>): (Value: Cardinal) => A;
} = Function.dual(2, <A>(
    Value: Cardinal,
    Cases: Record.ReadonlyRecord<Cardinal, Function.LazyArg<A>>): A =>
{
    return Cases[Value]();
});

export/**
       * For a given direction, get the corresponding mirrored value.
       */
const GetMirror: {
    (Value: Left): Right;
    (Value: Right): Left;

    (Value: Up): Down;
    (Value: Down): Up;

    (Value: Cardinal): Cardinal;
} = ((Value: Cardinal): Cardinal =>
{
    switch (Value)
    {
        case Left:
            return Right;
        case Up:
            return Down;
        case Down:
            return Up;
        case Right:
            return Left;
    }
}) as any;

export/**
       * For a given direction, get the direction that is obtained by
       * rotating 90 degrees clockwise.
       */
const RotateClockwise: {
    (Value: Left): Up;
    (Value: Right): Down;

    (Value: Up): Right;
    (Value: Down): Left;

    (Value: Cardinal): Cardinal;
} = ((Value: Cardinal): Cardinal =>
{
    switch (Value)
    {
        case Left:
            return Up;
        case Up:
            return Right;
        case Down:
            return Left;
        case Right:
            return Down;
    }
}) as any;

export/**
       * For a given direction, get the direction that is obtained by
       * rotating 90 degrees anticlockwise.
       */
const RotateAnticlockwise: {
    (Value: Left): Down;
    (Value: Right): Up;

    (Value: Up): Left;
    (Value: Down): Right;

    (Value: Cardinal): Cardinal;
} = ((Value: Cardinal): Cardinal =>
{
    switch (Value)
    {
        case Left:
            return Down;
        case Up:
            return Left;
        case Down:
            return Right;
        case Right:
            return Up;
    }
}) as any;

/** A direction that, alongside its corresponding values, partitions the plane into quadrants. */
export type Cardinal =
    | Up
    | Down
    | Left
    | Right;
