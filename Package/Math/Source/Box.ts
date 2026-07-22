/**
 *
 *
 * @module @sorrell/math/Box
 *
 * @file      Box.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Int from "./Int.js";
import { Array, Function, Predicate, type Record } from "effect";
import { IntInterval, IntPoint, type Vector2D } from "./index.js";
import { Proto } from "./Internal/IntPoint.ts";

const TypeIdKey = "~sorrell/math/Box" as const;
export/** The runtime type identifier for boxes. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the box runtime identifier. */
export type TypeId = typeof TypeId;

/** An axis-aligned box described by its four integer edges. */
export interface Box
{
    readonly [ TypeId ]: TypeId;
    readonly Top: Int.Int;
    readonly Bottom: Int.Int;
    readonly Left: Int.Int;
    readonly Right: Int.Int;
}

export/** Construct a box from edges, a tuple, an edge record, or two corner points. */
const Box: {
    (Top: Int.Int, Right: Int.Int, Bottom: Int.Int, Left: Int.Int): Box;

    (Top: number, Right: number, Bottom: number, Left: number): Box;

    (Arg: readonly [ Top: Int.Int, Right: Int.Int, Bottom: Int.Int, Left: Int.Int ]): Box;

    (Arg: BoxArg): Box;

    (Minimum: IntPoint.IntPoint, Maximum: IntPoint.IntPoint): Box;

    (Width: IntInterval.IntInterval, Height: IntInterval.IntInterval): Box;

    (Width: Int.Int, Height: Int.Int): Box;

    /**
     * Construct a Box whose minimum point is the origin, and whose maximum is `(Width, Height)`.
     *
     * @since 1.0.0
     */
    (Width: number, Height: number): Box;
} = (
    ArgOne:
        | number
        | Int.Int
        | readonly [ Top: Int.Int, Right: Int.Int, Bottom: Int.Int, Left: Int.Int ]
        | BoxArg
        | IntPoint.IntPoint
        | IntInterval.IntInterval,
    ArgTwo:
        | number
        | Int.Int
        | IntPoint.IntPoint
        | IntInterval.IntInterval
        | undefined = undefined,
    Bottom: Int.Int | number | undefined = undefined,
    Left: Int.Int | number | undefined = undefined
): Box =>
{
    const Out = Object.create(Proto);

    Out[TypeId] = TypeId;

    if (Predicate.isNumber(ArgOne) &&
        Predicate.isNumber(ArgTwo) &&
        Predicate.isNumber(Bottom) &&
        Predicate.isNumber(Left))
    {
        Out.Top = Math.floor(ArgOne);
        Out.Bottom = Math.floor(Bottom as number);
        Out.Left = Math.floor(Left as number);
        Out.Right = Math.floor(ArgTwo as number);
    }
    else if (Array.isArray(ArgOne))
    {
        Out.Top = Math.floor(ArgOne[0] as number);
        Out.Bottom = Math.floor(ArgOne[2] as number);
        Out.Left = Math.floor(ArgOne[3] as number);
        Out.Right = Math.floor(ArgOne[1] as number);
    }
    else if (IntPoint.IsIntPoint(ArgTwo))
    {
        const Minimum: IntPoint.IntPoint = ArgOne as IntPoint.IntPoint;
        const Maximum: IntPoint.IntPoint = ArgTwo as IntPoint.IntPoint;
        Out.Top = Math.floor(Minimum.Y);
        Out.Bottom = Math.floor(Maximum.Y);
        Out.Left = Math.floor(Minimum.X);
        Out.Right = Math.floor(Maximum.X);
    }
    else if (IntInterval.IsIntInterval(ArgTwo))
    {
        const Width: IntInterval.IntInterval = ArgOne as IntInterval.IntInterval;
        const Height: IntInterval.IntInterval = ArgTwo as IntInterval.IntInterval;
        Out.Top = Math.floor(Height.Start);
        Out.Bottom = Math.floor(Height.End);
        Out.Left = Math.floor(Width.Start);
        Out.Right = Math.floor(Width.End);
    }
    else if (
        Predicate.isNumber(ArgOne) &&
        Predicate.isNumber(ArgTwo) &&
        Predicate.isUndefined(Bottom) &&
        Predicate.isUndefined(Left))
    {
        const Width: number = ArgOne;
        const Height: number = ArgTwo;
        Out.Top = 0;
        Out.Bottom = Math.floor(Height);
        Out.Left = 0;
        Out.Right = Math.floor(Width);
    }
    else
    {
        const BoxArg: BoxArg = ArgOne as BoxArg;
        Out.Top = Math.floor(BoxArg.Top);
        Out.Bottom = Math.floor(BoxArg.Bottom);
        Out.Left = Math.floor(BoxArg.Left);
        Out.Right = Math.floor(BoxArg.Right);
    }

    return Object.freeze(Out);
};

export/** The box whose four edges are zero. */
const Zero: Box = Box(0 as Int.Int, 0 as Int.Int, 0 as Int.Int, 0 as Int.Int);

/** A box represented as top, right, bottom, and left edges. */
export type Tupled = readonly [ Top: Int.Int, Right: Int.Int, Bottom: Int.Int, Left: Int.Int ];

/** An object containing the four edge values needed to construct a box. */
export type BoxArg<A = Int.Int> =
    {
        readonly [ Key in Extract<keyof Box, "Top" | "Bottom" | "Left" | "Right"> ]: A;
    };

export/** Convert a box to a top-right-bottom-left tuple. */
const Tupled = (Self: Box): Tupled => [ Self.Top, Self.Right, Self.Bottom, Self.Left ] as const;

export/** Replace selected edges of a box. */
const Patch: {
    (Patch: Partial<BoxArg>): (Self: Box) => Box;
    (Self: Box, Patch: Partial<BoxArg>): Box;
} = Function.dual(2, (Self: Box, Patch: Partial<BoxArg>): Box =>
{
    return Box({ ...Self, ...Patch });
});

export/** Transform selected edges of a box. */
const Evolve: {
    (Patch: Partial<BoxArg<(Edge: Int.Int) => Int.Int>>): (Self: Box) => Box;
    (Self: Box, Patch: BoxArg<(Edge: Int.Int) => Int.Int>): Box;
} = Function.dual(2, (Self: Box, Patch: Partial<BoxArg<(Edge: Int.Int) => Int.Int>>): Box =>
{
    return Box({
        Bottom: Patch?.Bottom?.(Self.Bottom) ?? Self.Bottom,
        Left: Patch?.Left?.(Self.Left) ?? Self.Left,
        Right: Patch?.Right?.(Self.Right) ?? Self.Right,
        Top: Patch?.Top?.(Self.Top) ?? Self.Top
    });
});

export/** Project a box onto its horizontal interval. */
const ProjectX = (Self: Box): IntInterval.IntInterval =>
    IntInterval.IntInterval(Self.Left, Self.Right);

export/** Project a box onto its vertical interval. */
const ProjectY = (Self: Box): IntInterval.IntInterval =>
    IntInterval.IntInterval(Self.Top, Self.Bottom);

export/** Compute the signed horizontal extent of a box. */
const Width = (Self: Box): Int.Int => Int.Subtract(Self.Right, Self.Left);

export/** Compute the signed vertical extent of a box. */
const Height = (Self: Box): Int.Int => Int.Subtract(Self.Bottom, Self.Top);

/** Determine whether every edge of a box is zero. */
export function IsZero(Self: Box): boolean
{
    return (
        Self.Bottom === 0 &&
        Self.Top === 0 &&
        Self.Left === 0 &&
        Self.Right === 0
    );
}

/** Determine whether at least one edge of a box is nonzero. */
export function IsNonZero(Self: Box): boolean
{
    return !IsZero(Self);
}

export/** Determine whether a value carries the box runtime identifier. */
const IsBox: { (Value: unknown): Value is Box; } = Predicate.hasProperty(TypeId) as any;

export/** Determine whether a point lies strictly inside a box. */
const IsInterior: {
    (Point: IntPoint.IntPoint): (Self: Box) => boolean;
    (Self: Box, Point: IntPoint.IntPoint): boolean;

    (Point: Vector2D.Vector2D): (Self: Box) => boolean;
    (Self: Box, Point: Vector2D.Vector2D): boolean;
} = Function.dual(2, (Self: Box, Point: IntPoint.IntPoint | Vector2D.Vector2D): boolean =>
{
    return (
        Self.Left < Point.X && Point.X < Self.Right &&
        Self.Top < Point.Y && Point.Y < Self.Bottom
    );
});

export/** Determine whether a point lies outside the strict interior of a box. */
const IsExterior: {
    (Point: IntPoint.IntPoint): (Self: Box) => boolean;
    (Self: Box, Point: IntPoint.IntPoint): boolean;

    (Point: Vector2D.Vector2D): (Self: Box) => boolean;
    (Self: Box, Point: Vector2D.Vector2D): boolean;
} = Function.dual(2, (Self: Box, Point: IntPoint.IntPoint | Vector2D.Vector2D): boolean =>
{
    return (
        !(Self.Left < Point.X && Point.X < Self.Right) ||
        !(Self.Top < Point.Y && Point.Y < Self.Bottom)
    );
});

export/** Determine whether a point lies on a box edge. */
const IsBoundary: {
    (Point: IntPoint.IntPoint): (Self: Box) => boolean;
    (Self: Box, Point: IntPoint.IntPoint): boolean;

    (Point: Vector2D.Vector2D): (Self: Box) => boolean;
    (Self: Box, Point: Vector2D.Vector2D): boolean;
} = Function.dual(2, (Self: Box, Point: IntPoint.IntPoint | Vector2D.Vector2D): boolean =>
{
    return (
        (
            (Self.Left <= Point.X && Point.X <= Self.Right) &&
            (Point.Y === Self.Top || Point.Y === Self.Bottom)
        ) ||
        (
            (Self.Top <= Point.Y && Point.Y <= Self.Bottom) &&
            (Point.X === Self.Left || Point.X === Self.Right)
        )
    );
});

export/** The box whose four edges are one. */
const Unit: Box = Box(1 as Int.Int, 1 as Int.Int, 1 as Int.Int, 1 as Int.Int);

export/** Compute the signed area of a box. */
const Area = (Self: Box): Int.Int => Int.Multiply(Width(Self), Height(Self));

export/** Return the bottom-right corner of a box. */
const Max = (Self: Box): IntPoint.IntPoint => IntPoint.IntPoint(Self.Right, Self.Bottom);

export/** Return the top-left corner of a box. */
const Min = (Self: Box): IntPoint.IntPoint => IntPoint.IntPoint(Self.Left, Self.Top);

export/** Return the width and height of a box as an integer point. */
const AspectRatio = (Self: Box) => IntPoint.IntPoint(Width(Self), Height(Self));
export/** Return the numeric width-to-height ratio of a box. */
const AspectRatioNum = (Self: Box) => Width(Self) / Height(Self);

export namespace Orientation
{
    export/** The orientation of a box wider than it is tall. */
    const Landscape = Symbol.for(`${ TypeIdKey }!Orientation!Landscape`);
    export/** The orientation of a box taller than it is wide. */
    const Portrait = Symbol.for(`${ TypeIdKey }!Orientation!Portrait`);
    export/** The orientation of a box with equal width and height. */
    const Square = Symbol.for(`${ TypeIdKey }!Orientation!Square`);

    /** The landscape-orientation symbol type. */
    export type Landscape = typeof Landscape;
    /** The portrait-orientation symbol type. */
    export type Portrait = typeof Portrait;
    /** The square-orientation symbol type. */
    export type Square = typeof Square;

    /** A classification of a box by the relationship between its width and height. */
    export type Orientation =
        | Landscape
        | Portrait
        | Square;

    export/** Determine whether a box has a specified orientation. */
    const $is: {
        (Orientation: Orientation): (Self: Box) => boolean;
        (Self: Box, Orientation: Orientation): boolean;
    } = Function.dual(2, (Self: Box, Arg: Orientation): boolean =>
    {
        return Orientation(Self) === Arg;
    });

    export/** Classify a box as landscape, portrait, or square. */
    const Orientation = (Self: Box): Orientation =>
    {
        if (Width(Self) > Height(Self))
        {
            return Landscape;
        }
        else if (Width(Self) < Height(Self))
        {
            return Portrait;
        }
        else
        {
            return Square;
        }
    };

    export/** Evaluate the case associated with a box's orientation. */
    const $match: {
        <A>(Cases: Record.ReadonlyRecord<Orientation, Function.LazyArg<A>>): (Self: Box) => A;
        <A>(Self: Box, Cases: Record.ReadonlyRecord<Orientation, Function.LazyArg<A>>): A;
    } = Function.dual(2, <A>(Self: Box, Cases: Record.ReadonlyRecord<Orientation, Function.LazyArg<A>>): A =>
    {
        return Cases[Orientation(Self)]();
    });
}
