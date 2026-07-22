/**
 *
 *
 * @module @sorrell/math/IntPoint
 *
 * @file      IntPoint.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Int from "./Int.js";
import {
    type Equal,
    Function,
    type Inspectable,
    Iterable,
    type NonEmptyIterable,
    Option,
    type Pipeable,
    Predicate
} from "effect";
import { Proto } from "./Internal/IntPoint.ts";
import { RealPlane } from "./index.js";

const TypeIdKey = "~sorrell/math/IntPoint" as const;
export/** The runtime type identifier for integer points. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);
/** The type of the integer-point runtime identifier. */
export type TypeId = typeof TypeId;

/** An immutable two-dimensional point whose components are integers. */
export interface IntPoint extends
    Inspectable.Inspectable,
    Equal.Equal,
    Pipeable.Pipeable,
    NonEmptyIterable.NonEmptyIterable<number>
{
    readonly [ TypeId ]: TypeId;
    readonly X: Int.Int;
    readonly Y: Int.Int;
}

export/** Construct an integer point by flooring its two components. */
const IntPoint: {
    (X: number, Y: number): IntPoint;
    (X: Int.Int, Y: Int.Int): IntPoint;
    (X: number | Int.Int, Y: number | Int.Int): IntPoint;
} = (X: number | Int.Int, Y: number | Int.Int): IntPoint =>
{
    const Out = Object.create(Proto);

    Out.X = Math.floor(X);
    Out.Y = Math.floor(Y);

    return Object.freeze(Out);
};

export/** The integer point at the origin. */
const Zero: IntPoint = IntPoint(0, 0);

export/** Determine whether a value carries the integer-point runtime identifier. */
const IsIntPoint: { (Value: unknown): Value is IntPoint; } = Predicate.hasProperty(TypeId) as any;

export/** Convert an integer point to an X-Y tuple. */
const Tupled = (Self: IntPoint): readonly [ Int.Int, Int.Int ] => [ Self.X, Self.Y ] as const;

export/** Compute the dot product of two integer points. */
const Dot: {
    (That: IntPoint): (Self: IntPoint) => number;

    (Self: IntPoint, That: IntPoint): number;
} = Function.dual(2, (Self: IntPoint, That: IntPoint): number =>
{
    return Self.X * That.X + Self.Y * That.Y;
});

export/** Add two integer points component-wise. */
const Sum: {
    (That: IntPoint): (Self: IntPoint) => IntPoint;

    (Self: IntPoint, That: IntPoint): IntPoint;
} = Function.dual(2, (Self: IntPoint, That: IntPoint): IntPoint =>
{
    return IntPoint(Self.X + That.X, Self.Y + That.Y);
});

export/** Add every integer point in an iterable. */
const SumAll: { (Points: Iterable<IntPoint>): IntPoint; } = Iterable.reduce(Zero, Sum);

export/** Multiply two integer points component-wise. */
const Multiply: {
    (That: IntPoint): (Self: IntPoint) => IntPoint;

    (Self: IntPoint, That: IntPoint): IntPoint;
} = Function.dual(2, (Self: IntPoint, That: IntPoint): IntPoint =>
{
    return IntPoint(Self.X * That.X, Self.Y * That.Y);
});

export/** Multiply every integer point in an iterable component-wise. */
const MultiplyAll: { (Points: Iterable<IntPoint>): IntPoint; } = Iterable.reduce(Zero, Multiply);

export/** Subtract two integer points component-wise. */
const Subtract: {
    (That: IntPoint): (Self: IntPoint) => IntPoint;

    (Self: IntPoint, That: IntPoint): IntPoint;
} = Function.dual(2, (Self: IntPoint, That: IntPoint): IntPoint =>
{
    return IntPoint(Self.X - That.X, Self.Y - That.Y);
});

export namespace From
{
    // export const Vector2D = (Self: Vector2D.Vector2D): IntPoint =>
    //     IntPoint(Math.floor(Self.X), Math.floor(Self.Y));

    export/** Construct an integer point from an X-Y tuple. */
    const Tuple = (Tuple: [ Int.Int, Int.Int ]): IntPoint =>
        IntPoint(Math.floor(Tuple[0]), Math.floor(Tuple[1]));

    export/** Construct a point from the first two numeric values, if present. */
    const ArrayN = (...Components: ReadonlyArray<unknown>): Option.Option<IntPoint> =>
    {
        if (Components.length >= 2 && Predicate.isNumber(Components[0]) && Predicate.isNumber(Components[1]))
        {
            return Option.some(IntPoint(Components[0], Components[1]));
        }
        else
        {
            return Option.none();
        }
    };

    export/** Construct a point from a tuple known to contain at least two integers. */
    const ArraySafe = (
        ...Components: readonly [ Int.Int, Int.Int, ...ReadonlyArray<any> ]
    ): IntPoint => IntPoint(Components[0], Components[1]);

    export/** Construct a point from the first two values without validating them. */
    const ArrayUnsafe = (
        ...Components: ReadonlyArray<unknown>
    ): IntPoint => IntPoint(Components[0] as any, Components[1] as any);

    export/** Construct a point from a record containing X and Y components. */
    const Record = <ArgType extends Pick<IntPoint, "X" | "Y">>(
        Arg: ArgType
    ): IntPoint => IntPoint(Arg.X, Arg.Y);
}

export/** Retain one component of a point and set the other to zero. */
const ProjectDimension: {
    (Dimension: RealPlane.Dimension): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Dimension: RealPlane.Dimension): IntPoint;
} = Function.dual(2, (Self: IntPoint, InDimension: RealPlane.Dimension): IntPoint =>
{
    return RealPlane.Dimension.$match(
        InDimension,
        {
            X: () => IntPoint(Self.X, 0),
            Y: () => IntPoint(0, Self.Y)
        }
    );
});

export/** Multiply both components of a point by an integer scalar. */
const Scale: {
    (Scalar: Int.Int): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Scalar: Int.Int): IntPoint;
} = Function.dual(2, (Self: IntPoint, Scalar: Int.Int): IntPoint =>
{
    return IntPoint(Scalar * Self.X, Scalar * Self.Y);
});

/** Determine whether both components of an integer point are zero. */
export function IsZero(Self: IntPoint): boolean
{
    return Self.X === 0 && Self.Y === 0;
}

/** Determine whether either component of an integer point is nonzero. */
export function IsNonZero(Self: IntPoint): boolean
{
    return !IsZero(Self);
}

/** A function that transforms a component, optionally using its dimension and source point. */
export type ComponentTransform<A> =
    | ((Component: Int.Int) => A)
    | ((Component: Int.Int, Dimension: RealPlane.Dimension) => A)
    | ((Component: Int.Int, Dimension: RealPlane.Dimension, Self: IntPoint) => A);

export/** Apply a component transform to both components of a point. */
const MapComponents: {
    (Transform: ComponentTransform<number>): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Transform: ComponentTransform<number>): IntPoint;
} = Function.dual(2, (Self: IntPoint, Transform: ComponentTransform<number>): IntPoint =>
{
    return IntPoint(
        Transform(Self.X, RealPlane.Dimension.X, Self),
        Transform(Self.Y, RealPlane.Dimension.Y, Self)
    );
});

export/** Transform the X component of a point. */
const MapX: {
    (Transform: ComponentTransform<Int.Int>): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Transform: ComponentTransform<Int.Int>): IntPoint;
} = Function.dual(2, (Self: IntPoint, Transform: ComponentTransform<number>): IntPoint =>
{
    return IntPoint(Transform(Self.X, RealPlane.Dimension.X, Self), Self.Y);
});

export/** Transform the Y component of a point. */
const MapY: {
    (Transform: ComponentTransform<number>): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Transform: ComponentTransform<number>): IntPoint;
} = Function.dual(2, (Self: IntPoint, Transform: ComponentTransform<number>): IntPoint =>
{
    return IntPoint(Self.X, Transform(Self.Y, RealPlane.Dimension.Y, Self));
});

/** A function that transforms an integer point. */
export type IntPointTransform<A> = (Self: IntPoint) => A;

export/** Apply a transform to an integer point. */
const Map: {
    <A>(Transform: IntPointTransform<A>): (Self: IntPoint) => ReturnType<typeof Transform>;
    <A>(Self: IntPoint, Transform: IntPointTransform<A>): ReturnType<typeof Transform>;
} = Function.dual(2, <A>(
    Self: IntPoint,
    Transform: IntPointTransform<A>
): ReturnType<typeof Transform> =>
{
    return Transform(Self);
});

export namespace Unit
{
    export/** The positive X unit point. */
    const I: IntPoint = IntPoint(1, 0);
    export/** The positive Y unit point. */
    const J: IntPoint = IntPoint(0, 1);

    export/** The point with both components equal to one. */
    const IJ: IntPoint = IntPoint(1, 1);

    export/** The negative X unit point. */
    const MinusI: IntPoint = IntPoint(-1, 0);
    export/** The negative Y unit point. */
    const MinusJ: IntPoint = IntPoint(0, -1);
    export/** The point with both components equal to negative one. */
    const MinusIJ: IntPoint = IntPoint(-1, -1);
}

export/** Apply a transform only when the point is nonzero. */
const IfNonZero: {
    <A>(Transform: IntPointTransform<A>):
    (Self: IntPoint) => Option.Option<ReturnType<typeof Transform>>;

    <A>(
        Self: IntPoint,
        Transform: IntPointTransform<A>
    ): Option.Option<ReturnType<typeof Transform>>;
} = Function.dual(2, <A>(
    Self: IntPoint,
    Transform: IntPointTransform<A>
): Option.Option<ReturnType<typeof Transform>> =>
{
    if (IsNonZero(Self))
    {
        return Option.some(Transform(Self));
    }
    else
    {
        return Option.none();
    }
});

export/** Apply a transform only when the point is zero. */
const IfZero: {
    <A>(Transform: IntPointTransform<A>): (Self: IntPoint) => Option.Option<ReturnType<typeof Transform>>;
    <A>(Self: IntPoint, Transform: IntPointTransform<A>): Option.Option<ReturnType<typeof Transform>>;
} = Function.dual(2, <A>(
    Self: IntPoint,
    Transform: IntPointTransform<A>
): Option.Option<ReturnType<typeof Transform>> =>
{
    if (IsZero(Self))
    {
        return Option.some(Transform(Self));
    }
    else
    {
        return Option.none();
    }
});

/** The cases used to branch on whether an integer point is zero. */
export interface MatchZeroCases<out A>
{
    readonly OnZero: () => A;
    readonly OnNonZero: (Self: IntPoint) => A;
}

export/** Evaluate the case corresponding to whether a point is zero. */
const MatchZero: {
    <A>(Cases: MatchZeroCases<A>): (Self: IntPoint) => ReturnType<typeof Cases[keyof typeof Cases]>;
    <A>(Self: IntPoint, Cases: MatchZeroCases<A>): ReturnType<typeof Cases[keyof typeof Cases]>;
} = Function.dual(2, <A>(
    Self: IntPoint,
    Cases: MatchZeroCases<A>
): ReturnType<typeof Cases[keyof typeof Cases]> =>
{
    if (IsZero(Self))
    {
        return Cases.OnZero();
    }
    else
    {
        return Cases.OnNonZero(Self);
    }
});

export/** Return a nonzero point's direction in radians, or `None` for the origin. */
const Direction = (Self: IntPoint): Option.Option<number> =>
{
    return IfNonZero(Self, DirectionUnsafe);
};

export/** Return a point's direction in radians without rejecting the origin. */
const DirectionUnsafe = (Self: IntPoint): number => Math.atan2(Self.X, Self.Y);

export/** Compute the angle between two points without checking for zero length. */
const AngleUnsafe: {
    (That: IntPoint): (Self: IntPoint) => number;

    (Self: IntPoint, That: IntPoint): number;
} = Function.dual(2, (Self: IntPoint, That: IntPoint): number =>
{
    const DotProduct: number = Dot(Self, That);

    const Cosine = DotProduct / (LengthUnsafe(Self) * LengthUnsafe(That));

    const ClampedCosine = Math.max(-1, Math.min(1, Cosine));

    return Math.acos(ClampedCosine);
});

export/** Compute the angle between two nonzero points, returning `None` otherwise. */
const Angle: {
    (That: IntPoint): (Self: IntPoint) => number;

    (Self: IntPoint, That: IntPoint): number;
} = Function.dual(2, (Self: IntPoint, That: IntPoint): Option.Option<number> =>
{
    if (IsNonZero(Self) && IsNonZero(That))
    {
        return Option.some(AngleUnsafe(Self, That));
    }
    else
    {
        return Option.none();
    }
});

export/** Compute a nonzero point's Euclidean length, or `None` for the origin. */
const Length = (Self: IntPoint): Option.Option<number> =>
{
    return IfNonZero(Self, LengthUnsafe);
};

export/** Compute a point's Euclidean length without rejecting the origin. */
const LengthUnsafe = (Self: IntPoint): number => Math.sqrt(Math.pow(Self.X, 2) + Math.pow(Self.Y, 2));
