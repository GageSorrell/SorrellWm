/**
 *
 *
 * @module @sorrell/math/Vector2D
 *
 * @file      Vector2D.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

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
import { Proto, TypeId } from "./Internal/Vector2D.js";
import { RealPlane } from "./index.js";

export { TypeId } from "./Internal/Vector2D.js";

/** An immutable two-dimensional vector with numeric components. */
export interface Vector2D extends
    Inspectable.Inspectable,
    Equal.Equal,
    Pipeable.Pipeable,
    NonEmptyIterable.NonEmptyIterable<number>
{
    readonly [ TypeId ]: TypeId;

    readonly X: number;
    readonly Y: number;
}

export/** Construct a two-dimensional vector from X and Y components. */
const Vector2D = (X: number, Y: number): Vector2D =>
{
    const Out = Object.create(Proto);

    Out.X = X;
    Out.Y = Y;

    return Object.freeze(Out);
};

export/** The vector at the origin. */
const Zero: Vector2D = Vector2D(0, 0);

export/** Determine whether a value carries the vector runtime identifier. */
const IsVector2D: { (Value: unknown): Value is Vector2D; } = Predicate.hasProperty(TypeId) as any;

export/** Convert a vector to an X-Y tuple. */
const Tupled = (Self: Vector2D): readonly [ number, number ] => [ Self.X, Self.Y ] as const;

export/** Compute the dot product of two vectors. */
const Dot: {
    (That: Vector2D): (Self: Vector2D) => number;

    (Self: Vector2D, That: Vector2D): number;
} = Function.dual(2, (Self: Vector2D, That: Vector2D): number =>
{
    return Self.X * That.X + Self.Y * That.Y;
});

export/** Add two vectors component-wise. */
const Sum: {
    (That: Vector2D): (Self: Vector2D) => Vector2D;

    (Self: Vector2D, That: Vector2D): Vector2D;
} = Function.dual(2, (Self: Vector2D, That: Vector2D): Vector2D =>
{
    return Vector2D(Self.X + That.X, Self.Y + That.Y);
});

export/** Add every vector in an iterable. */
const SumAll: { (Points: Iterable<Vector2D>): Vector2D; } = Iterable.reduce(Zero, Sum);

export/** Multiply two vectors component-wise. */
const Multiply: {
    (That: Vector2D): (Self: Vector2D) => Vector2D;

    (Self: Vector2D, That: Vector2D): Vector2D;
} = Function.dual(2, (Self: Vector2D, That: Vector2D): Vector2D =>
{
    return Vector2D(Self.X * That.X, Self.Y * That.Y);
});

export/** Multiply every vector in an iterable component-wise. */
const MultiplyAll: { (Points: Iterable<Vector2D>): Vector2D; } = Iterable.reduce(Zero, Multiply);

export/** Subtract two vectors component-wise. */
const Subtract: {
    (That: Vector2D): (Self: Vector2D) => Vector2D;

    (Self: Vector2D, That: Vector2D): Vector2D;
} = Function.dual(2, (Self: Vector2D, That: Vector2D): Vector2D =>
{
    return Vector2D(Self.X - That.X, Self.Y - That.Y);
});

export namespace From
{
    export/** Construct a vector from an X-Y tuple. */
    const Tuple = (Tuple: [ number, number ]): Vector2D => Vector2D(Tuple[0], Tuple[1]);

    export/** Construct a vector from the first two numeric values, if present. */
    const ArrayN = (...Components: ReadonlyArray<unknown>): Option.Option<Vector2D> =>
    {
        if (Components.length >= 2 && Predicate.isNumber(Components[0]) && Predicate.isNumber(Components[1]))
        {
            return Option.some(Vector2D(Components[0], Components[1]));
        }
        else
        {
            return Option.none();
        }
    };

    export/** Construct a vector from a tuple known to contain at least two numbers. */
    const ArraySafe = (
        ...Components: readonly [ number, number, ...ReadonlyArray<any> ]
    ): Vector2D => Vector2D(Components[0], Components[1]);

    export/** Construct a vector from the first two values without validating them. */
    const ArrayUnsafe = (
        ...Components: ReadonlyArray<unknown>
    ): Vector2D => Vector2D(Components[0] as any, Components[1] as any);

    export/** Construct a vector from a record containing X and Y components. */
    const Record = <ArgType extends Pick<Vector2D, "X" | "Y">>(
        Arg: ArgType
    ): Vector2D => Vector2D(Arg.X, Arg.Y);
}

export/** Retain one component of a vector and set the other to zero. */
const ProjectDimension: {
    (Dimension: RealPlane.Dimension): (Self: Vector2D) => Vector2D;
    (Self: Vector2D, Dimension: RealPlane.Dimension): Vector2D;
} = Function.dual(2, (Self: Vector2D, InDimension: RealPlane.Dimension): Vector2D =>
{
    return RealPlane.Dimension.$match(
        InDimension,
        {
            X: () => Vector2D(Self.X, 0),
            Y: () => Vector2D(0, Self.Y)
        }
    );
});

export/** Multiply both components of a vector by a scalar. */
const Scale: {
    (Scalar: number): (Self: Vector2D) => Vector2D;
    (Self: Vector2D, Scalar: number): Vector2D;
} = Function.dual(2, (Self: Vector2D, Scalar: number): Vector2D =>
{
    return Vector2D(Scalar * Self.X, Scalar * Self.Y);
});

export/** Project relative to a nonzero vector, returning `None` when it has zero length. */
const Project: {
    (That: Vector2D): (Self: Vector2D) => Option.Option<Vector2D>;

    (Self: Vector2D, That: Vector2D): Option.Option<Vector2D>;
} = Function.dual(2, (Self: Vector2D, That: Vector2D): Option.Option<Vector2D> =>
{
    return Option.map(Length(That), (ThatLength: number): Vector2D =>
    {
        const Scalar: number = Dot(Self, That) / ThatLength;

        return Scale(Self, Scalar);
    });
});

/** Determine whether both vector components are zero or within an optional tolerance. */
export function IsZero(Self: Vector2D): boolean;
export function IsZero(Tolerance: number): (Self: Vector2D) => boolean;
export function IsZero(Self: Vector2D, Tolerance: number): boolean;
export function IsZero(LeftArg: Vector2D | number, RightArg?: number)
{
    const _IsZero = (Self: Vector2D): boolean => Self.X === 0 && Self.Y === 0;

    const IsWithinTolerance = (Tolerance: number) =>
        (Component: number): boolean => Math.abs(Component) < Tolerance;

    const _IsAlmostZero = (Self: Vector2D, Tolerance: number): boolean =>
    {
        const _IsWithinTolerance = IsWithinTolerance(Tolerance);
        return _IsWithinTolerance(Self.X) && _IsWithinTolerance(Self.Y);
    };

    if (arguments.length === 1)
    {
        return Predicate.isNumber(LeftArg)
            ? (Self: Vector2D): boolean => _IsAlmostZero(Self, LeftArg)
            : _IsZero(LeftArg);
    }
    else
    {
        return _IsAlmostZero(LeftArg as Vector2D, RightArg as number);
    }
}

/** Determine whether either vector component is nonzero beyond an optional tolerance. */
export function IsNonZero(Self: Vector2D): boolean;
export function IsNonZero(Tolerance: number): (Self: Vector2D) => boolean;
export function IsNonZero(Self: Vector2D, Tolerance: number): boolean;
export function IsNonZero(LeftArg: Vector2D | number, RightArg?: number)
{
    return !IsZero(LeftArg as any, RightArg as any) as any;
}

/** A function that transforms a component, optionally using its dimension and source vector. */
export type ComponentTransform<OutType> =
    | ((Component: number) => OutType)
    | ((Component: number, Dimension: RealPlane.Dimension) => OutType)
    | ((Component: number, Dimension: RealPlane.Dimension, Self: Vector2D) => OutType);

export/** Apply a component transform to both components of a vector. */
const MapComponents: {
    (Transform: ComponentTransform<number>): (Self: Vector2D) => Vector2D;
    (Self: Vector2D, Transform: ComponentTransform<number>): Vector2D;
} = Function.dual(2, (Self: Vector2D, Transform: ComponentTransform<number>): Vector2D =>
{
    return Vector2D(
        Transform(Self.X, RealPlane.Dimension.X, Self),
        Transform(Self.Y, RealPlane.Dimension.Y, Self)
    );
});

export/** Transform the X component of a vector. */
const MapX: {
    (Transform: ComponentTransform<number>): (Self: Vector2D) => Vector2D;
    (Self: Vector2D, Transform: ComponentTransform<number>): Vector2D;
} = Function.dual(2, (Self: Vector2D, Transform: ComponentTransform<number>): Vector2D =>
{
    return Vector2D(Transform(Self.X, RealPlane.Dimension.X, Self), Self.Y);
});

export/** Transform the Y component of a vector. */
const MapY: {
    (Transform: ComponentTransform<number>): (Self: Vector2D) => Vector2D;
    (Self: Vector2D, Transform: ComponentTransform<number>): Vector2D;
} = Function.dual(2, (Self: Vector2D, Transform: ComponentTransform<number>): Vector2D =>
{
    return Vector2D(Self.X, Transform(Self.Y, RealPlane.Dimension.Y, Self));
});

/** A function that transforms a vector. */
export type Vector2DTransform<OutType> = (Self: Vector2D) => OutType;

export/** Apply a transform to a vector. */
const Map: {
    <OutType>(Transform: Vector2DTransform<OutType>):
    (Self: Vector2D) => ReturnType<typeof Transform>;

    <OutType>(Self: Vector2D, Transform: Vector2DTransform<OutType>):
    ReturnType<typeof Transform>;
} = Function.dual(2, <OutType>(
    Self: Vector2D,
    Transform: Vector2DTransform<OutType>
): ReturnType<typeof Transform> =>
{
    return Transform(Self);
});

export namespace Unit
{
    export/** The positive X unit vector. */
    const I: Vector2D = Vector2D(1, 0);
    export/** The positive Y unit vector. */
    const J: Vector2D = Vector2D(0, 1);

    export/** The vector with both components equal to one. */
    const IJ: Vector2D = Vector2D(1, 1);

    export/** The negative X unit vector. */
    const MinusI: Vector2D = Vector2D(-1, 0);
    export/** The negative Y unit vector. */
    const MinusJ: Vector2D = Vector2D(0, -1);
    export/** The vector with both components equal to negative one. */
    const MinusIJ: Vector2D = Vector2D(-1, -1);
}

export/** Apply a transform only when the vector is nonzero. */
const IfNonZero: {
    <OutType>(Transform: Vector2DTransform<OutType>):
    (Self: Vector2D) => Option.Option<ReturnType<typeof Transform>>;

    <OutType>(Self: Vector2D, Transform: Vector2DTransform<OutType>):
    Option.Option<ReturnType<typeof Transform>>;
} = Function.dual(2, <OutType>(
    Self: Vector2D,
    Transform: Vector2DTransform<OutType>
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

export/** Apply a transform only when the vector is zero. */
const IfZero: {
    <OutType>(Transform: Vector2DTransform<OutType>):
    (Self: Vector2D) => Option.Option<ReturnType<typeof Transform>>;

    <OutType>(Self: Vector2D, Transform: Vector2DTransform<OutType>):
    Option.Option<ReturnType<typeof Transform>>;
} = Function.dual(2, <OutType>(
    Self: Vector2D,
    Transform: Vector2DTransform<OutType>
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

/** The cases used to branch on whether a vector is zero. */
export interface MatchZeroCases<out OutType>
{
    readonly OnZero: () => OutType;
    readonly OnNonZero: (Self: Vector2D) => OutType;
}

export/** Evaluate the case corresponding to whether a vector is zero. */
const MatchZero: {
    <OutType>(Cases: MatchZeroCases<OutType>):
    (Self: Vector2D) => ReturnType<typeof Cases[keyof typeof Cases]>;

    <OutType>(Self: Vector2D, Cases: MatchZeroCases<OutType>):
    ReturnType<typeof Cases[keyof typeof Cases]>;
} = Function.dual(2, <OutType>(
    Self: Vector2D,
    Cases: MatchZeroCases<OutType>
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

export/** Return a nonzero vector's direction in radians, or `None` for the origin. */
const Direction = (Self: Vector2D): Option.Option<number> =>
{
    return IfNonZero(Self, DirectionUnsafe);
};

export/** Return a vector's direction in radians without rejecting the origin. */
const DirectionUnsafe = (Self: Vector2D): number => Math.atan2(Self.X, Self.Y);

export/** Compute the angle between two vectors without checking for zero length. */
const AngleUnsafe: {
    (That: Vector2D): (Self: Vector2D) => number;

    (Self: Vector2D, That: Vector2D): number;
} = Function.dual(2, (Self: Vector2D, That: Vector2D): number =>
{
    const DotProduct: number = Dot(Self, That);

    const Cosine = DotProduct / (LengthUnsafe(Self) * LengthUnsafe(That));

    const ClampedCosine = Math.max(-1, Math.min(1, Cosine));

    return Math.acos(ClampedCosine);
});

export/** Compute the angle between two nonzero vectors, returning `None` otherwise. */
const Angle: {
    (That: Vector2D): (Self: Vector2D) => number;

    (Self: Vector2D, That: Vector2D): number;
} = Function.dual(2, (Self: Vector2D, That: Vector2D): Option.Option<number> =>
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

export/** Compute a nonzero vector's Euclidean length, or `None` for the origin. */
const Length = (Self: Vector2D): Option.Option<number> =>
{
    return IfNonZero(Self, LengthUnsafe);
};

export/** Compute a vector's Euclidean length without rejecting the origin. */
const LengthUnsafe = (Self: Vector2D): number =>
    Math.sqrt(Math.pow(Self.X, 2) + Math.pow(Self.Y, 2));
