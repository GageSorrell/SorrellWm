/**
 * @file      HigherKind.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { HigherArgumentVector } from "../Tuple";

/** The type that all function types extend. */
export type AnyFunction = (...ArgumentVector: Array<never>) => unknown;

/**
 * Define {@link https://en.wikipedia.org/wiki/Kind_(type_theory) | higher-kinded types }
 * by extending this class (see the example below).
 *
 * @template ArgumentVectorType - The `readonly` tuple-type that defines the type parameter
 * signature of the resulting generic type.  Please note that the `readonly` keyword *must*
 * be used when defining a higher-kind type with this.
 *
 * @example Map a tuple-type to a union of its element types.
 * ```typescript
 * interface TupleToUnion extends HigherKind<ReadonlyArray<unknown>>
 * {
 *     new: () => this["ArgumentVector"][number];
 * }
 *
 * type A = Apply<TupleToUnion, [ string, number, boolean ]>;
 * //   ^? string | number | boolean
 * ```
 *
 * @example A constrained higher-kinded type.
 * ```typescript
 * interface FooWithNumberTail extends HigherKind<ReadonlyArray<number>>
 * {
 *     new: () => this["ArgumentVector"];
 * }
 *
 * // ✓ Good
 * type A = Apply<FooWithNumberTail, [ ]>;
 * //   ^? [ "Foo" ]
 *
 * // ✓ Good
 * type B = Apply<FooWithNumberTail, [ 1, 2, 3 ]>;
 * //   ^? [ "Foo", 1, 2, 3 ]
 *
 * // (To define the constants below)
 * type C = Apply<FooWithNumberTail, [ number, number ]>;
 *
 * // ✓ Good
 * const Bar: C = [ "Foo", 3, 2 ];
 * //    ^? [ "Foo", 3, 2 ]
 *
 * // ✗ Bad
 * const Baz: C = [ "Foo", 3, 4, 5 ];
 * //                          ^^^ Error
 *
 * // ✗ Bad
 * type D = Apply<FooWithNumberTail, [ 4, 5, 6, "Bar" ]>;
 * //                                         ^^^^^^^ Error
 * ```
 */
export abstract class HigherKind<
    ArgumentVectorType extends ReadonlyArray<unknown> = ReadonlyArray<unknown>
>
{
    declare readonly ArgumentVector: ArgumentVectorType;

    declare new: AnyFunction;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get the argument vector type of a given {@link HigherKind | higher-kinded type}.
 *
 *
 * @template HigherKindType - The {@link HigherKind | higher-kinded type} whose
 * argument vector type will be inferred.
 */
export type ArgumentsOf<HigherKindType extends HigherKind<any>> =
    HigherKindType extends HigherKind<infer OutType>
        ? OutType
        : never;

/* eslint-enable @typescript-eslint/no-explicit-any */

const AssertTupleFailure: unique symbol = Symbol("__AssertTupleFailure__");

export type AssertTuple<
    LeftType extends ReadonlyArray<unknown>,
    RightType extends ReadonlyArray<unknown>
> =
    typeof AssertTupleFailure extends (
    {
        [ Index in number ]: LeftType[Index] extends RightType[Index]
            ? LeftType[Index]
            : typeof AssertTupleFailure;
    }[number])
        ? never
        : LeftType;

/**
 * Define a type from a {@link HigherKind | higher-kinded type}, optionally
 * with a constrained {@link ArgumentVectorType}.
 *
 * @see {@link HigherKind}
 *
 * @template HigherKindType - The {@link | higher-kinded type} to apply.
 * @template ArgumentVectorType - The type parameter vector that is passed to
 * the given {@link HigherKindType}.
 */
export type Apply<
    HigherKindType extends HigherKind<ReadonlyArray<any>>,
    ArgumentVectorType extends ArgumentsOf<HigherKindType> = ArgumentsOf<HigherKindType>
> =
    ReturnType<
        (
            HigherKindType &
            {
                readonly ArgumentVector: ArgumentVectorType;
            }
        )["new"]
    >;
