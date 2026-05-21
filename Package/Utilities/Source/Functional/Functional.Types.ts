/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TOrAsync } from "../Async/Async.Types.ts";

export type TExtractFunction<Type> =
    Type extends { (...ArgumentVector: infer ArgumentVectorType): infer ReturnType }
        ? (...ArgumentVector: ArgumentVectorType) => ReturnType
        : never;

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

export namespace TFunction
{
    export type OrAsync<ArgumentType = never, ReturnType = void> =
        TOrAsync<TFunction<ArgumentType, ReturnType>>;
}
