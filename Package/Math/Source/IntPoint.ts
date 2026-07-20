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

import { Function, Option, Predicate } from "effect";
import { Vector2D, RealPlane } from "./index.js";
import { Proto } from "./Internal/IntPoint.ts";
import * as Int from "./Int.js";

const TypeIdKey = "~sorrell/math/Point/IntPoint" as const;
export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface IntPoint extends Vector2D.Vector2D
{
    readonly [ TypeId ]: TypeId;
    readonly X: Int.Int;
    readonly Y: Int.Int;
}

export const IntPoint: {
    (X: number, Y: number): IntPoint;
    (X: Int.Int, Y: Int.Int): IntPoint;
    (X: number | Int.Int, Y: number | Int.Int): IntPoint;
} = (X: number | Int.Int, Y: number | Int.Int): IntPoint =>
{
    const Out = Object.create(Proto);

    Out.X = Math.floor(X);
    Out.Y = Math.floor(Y);

    return Out;
};

export const Zero: IntPoint = IntPoint(0, 0);

export const IsVector2D: { (Value: unknown): Value is IntPoint; } = Predicate.hasProperty(TypeId) as any;

const FlowFromVector2D = (In: any) => Function.flow(In, From.Vector2D) as any;

export const Tupled = (Self: IntPoint): readonly [ Int.Int, Int.Int ] => [ Self.X, Self.Y ] as const;

export const Dot: {
    (That: IntPoint): (Self: IntPoint) => number;

    (Self: IntPoint, That: IntPoint): number;
} = Vector2D.Dot;

export const Sum: {
    (That: IntPoint): (Self: IntPoint) => IntPoint;

    (Self: IntPoint, That: IntPoint): IntPoint;
} = FlowFromVector2D(Vector2D.Sum);

export const SumAll: { (Points: Iterable<IntPoint>): IntPoint; } = Function.flow(Vector2D.SumAll, From.Vector2D);

export const Multiply: {
    (That: IntPoint): (Self: IntPoint) => IntPoint;

    (Self: IntPoint, That: IntPoint): IntPoint;
} = FlowFromVector2D(Vector2D.Multiply);

export const MultiplyAll: { (Points: Iterable<IntPoint>): IntPoint; } = FlowFromVector2D(Vector2D.MultiplyAll);

export const Subtract: {
    (That: IntPoint): (Self: IntPoint) => IntPoint;

    (Self: IntPoint, That: IntPoint): IntPoint;
} = FlowFromVector2D(Vector2D.Subtract);

export namespace From
{
    export const Vector2D = (Self: Vector2D.Vector2D): IntPoint => IntPoint(Math.floor(Self.X), Math.floor(Self.Y));

    export const Tuple = (Tuple: [ Int.Int, Int.Int ]): IntPoint => IntPoint(Math.floor(Tuple[0]), Math.floor(Tuple[1]));

    export const ArrayN = (...Components: ReadonlyArray<unknown>): Option.Option<IntPoint> =>
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

    export const ArraySafe = (...Components: readonly [ Int.Int, Int.Int, ...ReadonlyArray<any> ]): IntPoint => IntPoint(Components[0], Components[1]);

    export const ArrayUnsafe = (...Components: ReadonlyArray<unknown>): IntPoint => IntPoint(Components[0] as any, Components[1] as any);

    export const Record = <ArgType extends Pick<IntPoint, "X" | "Y">>(Arg: ArgType): IntPoint => IntPoint(Arg.X, Arg.Y);
}


export const ProjectDimension: {
    (Dimension: RealPlane.Dimension): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Dimension: RealPlane.Dimension): IntPoint;
} = FlowFromVector2D(Vector2D.ProjectDimension);

export const Scale: {
    (Scalar: Int.Int): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Scalar: Int.Int): IntPoint;
} = Function.dual(2, (Self: IntPoint, Scalar: Int.Int): IntPoint =>
{
    return IntPoint(Scalar * Self.X, Scalar * Self.Y);
});

export const Project: {
    (That: IntPoint): (Self: IntPoint) => Option.Option<Vector2D.Vector2D>;

    (Self: IntPoint, That: IntPoint): Option.Option<Vector2D.Vector2D>;
} = FlowFromVector2D(Vector2D.Project);

export function IsZero(Self: IntPoint): boolean;
export function IsZero(Tolerance: number): (Self: IntPoint) => boolean;
export function IsZero(Self: IntPoint, Tolerance: number): boolean;
export function IsZero(LeftArg: IntPoint | number, RightArg?: number)
{
    if (arguments.length === 1)
    {
        return Vector2D.IsZero(LeftArg as any) as any;
    }
    else
    {
        return Vector2D.IsZero(LeftArg as any, RightArg as any);
    }
}

export function IsNonZero(Self: IntPoint): boolean;
export function IsNonZero(Tolerance: number): (Self: IntPoint) => boolean;
export function IsNonZero(Self: IntPoint, Tolerance: number): boolean;
export function IsNonZero(LeftArg: IntPoint | number, RightArg?: number)
{
    return !IsZero(LeftArg as any, RightArg as any) as any;
}

export type ComponentTransform<OutType> =
    | ((Component: Int.Int) => OutType)
    | ((Component: Int.Int, Dimension: RealPlane.Dimension) => OutType)
    | ((Component: Int.Int, Dimension: RealPlane.Dimension, Self: IntPoint) => OutType);

export const MapComponents: {
    (Transform: ComponentTransform<Int.Int>): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Transform: ComponentTransform<Int.Int>): IntPoint;
} = FlowFromVector2D(Vector2D.MapComponents);

export const MapX: {
    (Transform: ComponentTransform<Int.Int>): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Transform: ComponentTransform<Int.Int>): IntPoint;
} = FlowFromVector2D(Vector2D.MapX);

export const MapY: {
    (Transform: ComponentTransform<Int.Int>): (Self: IntPoint) => IntPoint;
    (Self: IntPoint, Transform: ComponentTransform<Int.Int>): IntPoint;
} = FlowFromVector2D(Vector2D.MapY);

export type IntPointTransform<OutType> = (Self: IntPoint) => OutType;

export const Map: {
    <OutType>(Transform: IntPointTransform<OutType>): (Self: IntPoint) => ReturnType<typeof Transform>;
    <OutType>(Self: IntPoint, Transform: IntPointTransform<OutType>): ReturnType<typeof Transform>;
} = FlowFromVector2D(Vector2D.Map);

export namespace Unit
{
    export const I: IntPoint = IntPoint(1, 0);
    export const J: IntPoint = IntPoint(0, 1);

    export const IJ: IntPoint = IntPoint(1, 1);

    export const MinusI: IntPoint = IntPoint(-1, 0);
    export const MinusJ: IntPoint = IntPoint(0, -1);
    export const MinusIJ: IntPoint = IntPoint(-1, -1);
}

export const IfNonZero: {
    <OutType>(Transform: IntPointTransform<OutType>): (Self: IntPoint) => Option.Option<ReturnType<typeof Transform>>;
    <OutType>(Self: IntPoint, Transform: IntPointTransform<OutType>): Option.Option<ReturnType<typeof Transform>>;
} = Function.dual(2, <OutType>(Self: IntPoint, Transform: IntPointTransform<OutType>): Option.Option<ReturnType<typeof Transform>> =>
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

export const IfZero: {
    <OutType>(Transform: IntPointTransform<OutType>): (Self: IntPoint) => Option.Option<ReturnType<typeof Transform>>;
    <OutType>(Self: IntPoint, Transform: IntPointTransform<OutType>): Option.Option<ReturnType<typeof Transform>>;
} = Function.dual(2, <OutType>(Self: IntPoint, Transform: IntPointTransform<OutType>): Option.Option<ReturnType<typeof Transform>> =>
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

export interface MatchZeroCases<out OutType>
{
    readonly OnZero: () => OutType;
    readonly OnNonZero: (Self: IntPoint) => OutType;
}

export const MatchZero: {
    <OutType>(Cases: MatchZeroCases<OutType>): (Self: IntPoint) => ReturnType<typeof Cases[keyof typeof Cases]>;
    <OutType>(Self: IntPoint, Cases: MatchZeroCases<OutType>): ReturnType<typeof Cases[keyof typeof Cases]>;
} = Function.dual(2, <OutType>(Self: IntPoint, Cases: MatchZeroCases<OutType>): ReturnType<typeof Cases[keyof typeof Cases]> =>
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

export const Direction: { (Self: IntPoint): Option.Option<number>; } = Vector2D.Direction;

export const DirectionUnsafe: { (Self: IntPoint): number; } = Vector2D.DirectionUnsafe;

export const AngleUnsafe: {
    (That: IntPoint): (Self: IntPoint) => number;

    (Self: IntPoint, That: IntPoint): number;
} = Vector2D.AngleUnsafe;

export const Angle: {
    (That: IntPoint): (Self: IntPoint) => number;

    (Self: IntPoint, That: IntPoint): number;
} = Vector2D.Angle;

export const Length: { (Self: IntPoint): Option.Option<number>; } = Vector2D.Length;

export const LengthUnsafe: { (Self: IntPoint): number; } = Vector2D.LengthUnsafe;
