/**
 * @file      Number.Experimental.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Operator } from "tsover-runtime";

/** A representation of elements in $\mathbf{R}^2$. */
export class FVector2D
{
    /** The $x$-component of this vector. */
    public X: number;

    /** The $y$-component of this vector. */
    public Y: number;

    /** The identity of $\mathbf{R}^2$ *wrt* addition. */
    public static Zero: FVector2D = new FVector2D(0, 0);

    /** Construct an instance of the zero vector. */
    public constructor();

    /**
     * Construct a vector by specifying both components.
     *
     * @param X - The value of the {@link FVector2D!X} component.
     * @param Y - The value of the {@link FVector2D!Y} component.
     */
    public constructor(X: number, Y: number);

    public constructor(InX: number = 0, InY: number = InX)
    {
        this.X = InX;
        this.Y = InY;
    }

    /**
     * Get a representation of this vector as a `string`.
     *
     * @returns {string} The string representation of this vector.
     */
    // public toString(): string
    // {
    //     return `(${ this.X }, ${ this.Y })`;
    // }

    /**
     * Perform per-component addition of two {@link FVector2D}s.
     *
     * @param Left - The left-hand operand.
     * @param Right - The right-hand operand.
     *
     * @returns {FVector2D} The per-component sum of {@link Left} and {@link Right}.
     *
     * @example
     * ```typescript
     * "use tsover";
     *
     * const A: FVector2D = new FVector2D(1, -1);
     * const B: FVector2D = new FVector2D(-3, 5);
     *
     * const C: FVector2D = A + B;
     * // `C` <- `(-2, 4)`
     * ```
     */
    [Operator.plus](Left: FVector2D, Right: FVector2D): FVector2D
    {
        return new FVector2D(Left.X + Right.X, Left.Y + Right.Y);
    }

    [Operator.preMinus](Vector: FVector2D): FVector2D
    {
        return new FVector2D(-1 * Vector.X, -1 * Vector.Y);
    }

    [Operator.eqEq](Left: FVector2D, Right: FVector2D): boolean
    {
        return (Left.X === Right.Y) && Right.X === 0;
    }

    /**
     * Perform scalar multiplication of an {@link FVector2D} and a `number` value.
     * Exactly one of the two arguments must be a `number`, and the other an
     * {@link FVector2D}.
     *
     * @param Left - The left-hand operand (either a `number` or an {@link FVector2D}).
     * @param Left - The right-hand operand (either a `number` or an {@link FVector2D}).
     *
     * @returns {FVector2D} The per-component sum of {@link Left} and {@link Right}.
     */
    [Operator.star](Left: number, Right: FVector2D): FVector2D;
    [Operator.star](Left: FVector2D, Right: number): FVector2D;
    [Operator.star](
        Left: FVector2D | number,
        Right: FVector2D | number
    ): FVector2D | typeof Operator.deferOperation
    {
        if (typeof Left === "number" && Right instanceof FVector2D)
        {
            return new FVector2D(Left * Right.X, Left * Right.Y);
        }
        if (typeof Right === "number" && Left instanceof FVector2D)
        {
            return new FVector2D(Left.X * Right, Left.Y * Right);
        }

        return Operator.deferOperation;
    }
}

export class FVector
{
    X: number;
    Y: number;
    Z: number;

    /** Constructs the zero {@link FVector}. */
    public constructor();

    /**
     * Constructs an {@link FVector} with all components set to {@link Value}.
     *
     * @param Value - The value of all components of the new {@link FVector}.
     */
    public constructor(Value: number);

    /**
     * Constructs an {@link FVector} with all components set to {@link Value}.
     *
     * @param X - The value of the {@link FVector!X} component.
     * @param Y - The value of the {@link FVector!Y} component.
     * @param Z - The value of the {@link FVector!Z} component.
     */
    public constructor(X: number, Y: number, Z: number);

    public constructor(X: number = 0, Y: number = X, Z: number = X)
    {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }

    [Operator.plus](Left: FVector2D, Right: FVector2D): FVector2D
    {
        return new FVector2D(Left.X + Right.X, Left.Y + Right.Y);
    }

    [Operator.star](Left: FVector2D | number, Right: FVector2D | number): FVector2D;
    [Operator.star](
        Left: FVector2D | number,
        Right: FVector2D | number
    ): FVector2D | typeof Operator.deferOperation
    {
        if (typeof Left === "number" && Right instanceof FVector2D)
        {
            return new FVector2D(Left * Right.X, Left * Right.Y);
        }
        if (typeof Right === "number" && Left instanceof FVector2D)
        {
            return new FVector2D(Left.X * Right, Left.Y * Right);
        }
        if (Left instanceof FVector2D && Right instanceof FVector2D)
        {
            return new FVector2D(Left.X * Right.X, Left.Y * Right.Y);
        }

        return Operator.deferOperation;
    }
}

function Foo(): void
{
    "use tsover";

    const A: FVector2D = new FVector2D(1, 2);
    const B: FVector2D = new FVector2D(0, 1);

    const Result: boolean = A == B;
    console.log(Result);

    const OtherResult: FVector2D = A + B;
    console.log(OtherResult);
}

Foo();
