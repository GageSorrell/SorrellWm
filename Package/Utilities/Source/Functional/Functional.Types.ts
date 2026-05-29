/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TOrAsync } from "../Async/Async.Types.ts";
import type { AnyFunction } from "../HigherKind/HigherKind.Types.ts";

/**
 * For a given {@link Type}, such as a callable object, extract its call signature type.
 *
 * @template Type - The type whose call signature, if it has a call signature, is extracted by this (if
 * {@link Type} does *not* have a call signature, then this is `never`).
 */
export type TExtractFunction<Type> =
    Type extends { (...ArgumentVector: infer ArgumentVectorType): infer ReturnType }
        ? (...ArgumentVector: ArgumentVectorType) => ReturnType
        : Type extends (...ArgumentVector: infer ArgumentVectorType) => infer ReturnType
            ? (...ArgumentVector: ArgumentVectorType) => ReturnType
            : never;

/**
 * A {@link TFunction} whose return type is its {@link ArgumentType}.
 *
 * @template ArgumentType - The type of the argument.  If this is an `Array`, then
 * it will be unzipped to construct the argument vector signature.  Regardless, the
 * return type will always be simply {@link ArgumentType}.
 */
export type TMapper<ArgumentType> =
    [ ArgumentType ] extends [ never ]
        ? never
        : ArgumentType extends ReadonlyArray<unknown>
            ? (...ArgumentVector: ArgumentType) => ArgumentType
            : (Argument: ArgumentType) => ArgumentType;

/**
 * A function type with defaults that make defining callback types convenient.
 *
 * @template ArgumentType - The type of the argument or argument vector.
 * If `ArgumentType extends Array<unknown>`, then this will be taken to
 * be the argument vector.  To set the argument vector to be a single,
 * `Array` argument, say `MyArrayType`, set `ArgumentType` to `[ MyArrayType ]`.
 * @template ReturnType - The type returned by this.
 */
export type TFunction<ArgumentType = never, ReturnType = void> =
    [ ArgumentType ] extends [ never ]
        ? {
            (): ReturnType;
        }
        : ArgumentType extends Array<unknown> | ReadonlyArray<unknown>
            ? (...ArgumentVector: ArgumentType) => ReturnType
            : (Argument: ArgumentType) => ReturnType;

/** Additional types, related to and extending {@link TFunction:type | the TFunction type}. */
export namespace TFunction
{
    /**
     * A {@link TFunction:type}, wrapped with {@link TOrAsync}.
     *
     * @template ArgumentType - The argument (or possibly argument vector) type
     * of this function.
     * @template ReturnType - The type returned by this (possibly wrapped in a {@link Promise}).
     */
    export type OrAsync<ArgumentType = never, ReturnType = void> =
        TOrAsync<TFunction<ArgumentType, ReturnType>>;

    /**
     * The {@link TFunction:type | TFunction type}, but with an {@link ArgumentVectorType}
     * that *must* extend {@link ReadonlyArray}.  This is slightly less ergonomic, but
     * works (or works more nicely) in some cases where the {@link TFunction:type | TFunction type} does
     * not work (or works, but not nicely).
     *
     * @template ArgumentVectorType - The type of the argument vector.  This is unzipped as a rest parameter,
     * but tuple types will allow the type checker to infer a finite argument vector (*i.e.*, not
     * a rest parameter).
     *
     * @template ReturnType - The type returned by this.
     */
    export type Safe<ArgumentVectorType extends ReadonlyArray<unknown>, ReturnType = void> =
        (...ArgumentVector: ArgumentVectorType) => ReturnType;

    export type RestParameter<FunctionType extends AnyFunction> =
        Parameters<FunctionType>["length"] extends 0
            ? ReadonlyArray<unknown>
            : [ Parameters<FunctionType> ] extends [ never ]
                ? ReadonlyArray<unknown>
                : Parameters<FunctionType>;
}

/** Types for function arguments and argument vectors. */
export namespace Argument
{
    /**
     * For a given {@link ArgumentType}, if it does *not* extend {@link ReadonlyArray},
     * then wrap it as a `readonly` singleton tuple-type.
     *
     * This allows for a type parameter to be used with a rest parameter, and still allow
     * for argument vectors of just one argument.
     *
     * @template ArgumentType - The type of argument (or argument vector) of some function.
     */
    export type VectorSafe<ArgumentType> =
        ArgumentType extends ReadonlyArray<unknown>
            ? ArgumentType
            : readonly [ ArgumentType ];
}
