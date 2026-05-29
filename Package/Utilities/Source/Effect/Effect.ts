/**
 * @file      Effect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

import type { AnyFunction } from "../HigherKind/HigherKind.Types.ts";
import { Effect } from "effect";
import type { TFunction } from "../Functional/index.ts";

/**
 * Transform a given {@link InFunction:param} into a function of the same 
 * {@link ArgumentVectorType | argument vector}, such that the transformed
 * function returns a call to {@link Effect.sync}, which calls the given
 * {@link InFunction:param} with the argument vector that is passed when called.
 * 
 * @param InFunction - The given function that is called by {@link Effect.sync} when
 * the {@link Effect.Effect | effect} returned by *this* function is yielded.
 * 
 * @template ArgumentVectorType - The type of the {@link ArgumentVector} that is used to call
 * the given {@link InFunction:param}.
 * 
 * @template ReturnType - The type returned by the given {@link InFunction:param}, which is wrapped
 * into an {@link Effect.Effect | effect}.
 * 
 * @returns {TFunction.Safe<ArgumentVectorType, Effect.Effect<ReturnType>>} An {@link Effect.Effect}
 * that returns the value of the original {@link InFunction:param}.  This effect never errors, and has
 * no requirements.
 */
export function MakeSyncCallback<
    ArgumentVectorType extends ReadonlyArray<unknown>,
    ReturnType
>(
    InFunction: TFunction.Safe<ArgumentVectorType, ReturnType>
): TFunction.Safe<ArgumentVectorType, Effect.Effect<ReturnType>>;

/**
 * Transform a given {@link InFunction:param} into a function of the same argument vector, 
 * such that the transformed function returns a call to {@link Effect.sync}, which calls the given
 * {@link InFunction:param} with the argument vector that is passed when called.
 * 
 * @param InFunction - The given function that is called by {@link Effect.sync} when
 * the {@link Effect.Effect | effect} returned by *this* function is yielded.
 * 
 * @template FunctionType - The type of the given {@link InFunction:param}.  This overload
 * allows you to determine this type (and therefore the type returned by this) via inferring,
 * or via the `typeof` operator with the given {@link InFunction:param}.
 * 
 * @returns {TFunction.Safe<ArgumentVectorType, Effect.Effect<ReturnType>>} An {@link Effect.Effect}
 * that returns the value of the original {@link InFunction:param}.  This effect never errors, and has
 * no requirements.
 */
export function MakeSyncCallback<
    FunctionType extends TFunction.Safe<ReadonlyArray<unknown>, unknown>
>(
    InFunction: FunctionType
): TFunction.Safe<Parameters<typeof InFunction>, Effect.Effect<ReturnType<typeof InFunction>>>;

export function MakeSyncCallback<
    ArgumentVectorType extends ReadonlyArray<unknown>,
    ReturnType
>(
    InFunction: TFunction.Safe<ArgumentVectorType, ReturnType>
): TFunction.Safe<ArgumentVectorType, Effect.Effect<ReturnType>>
{
    return function(...ArgumentVector: ArgumentVectorType): Effect.Effect<ReturnType>
    {
        return MakeSync(InFunction, ...ArgumentVector);
    };
}

/**
 * Wrap a given {@link InFunction:param} with {@link Effect.sync} such that the function is
 * always called with the given {@link ArgumentVector}.
 * 
 * @param InFunction - The function to call via {@link Effect.sync}.
 * @param ArgumentVector - The argument vector passed to the given {@link InFunction:param}.
 * 
 * @template ArgumentVectorType - The type of the {@link ArgumentVector} that is used to call
 * the given {@link InFunction:param}.
 * 
 * @template ReturnType - The type returned by the given {@link InFunction:param}, which is wrapped
 * into an {@link Effect.Effect | effect}.
 * 
 * @returns {Effect.Effect<ReturnType>} An {@link Effect.Effect | effect} that returns the
 * result of calling the given {@link InFunction} with the given {@link ArgumentVector}.  It
 * never errors and has no requirements.
 */
export function MakeSync<
    ArgumentVectorType extends ReadonlyArray<unknown>,
    ReturnType
>(
    InFunction: TFunction.Safe<ArgumentVectorType, ReturnType>,
    ...ArgumentVector: ArgumentVectorType
): Effect.Effect<ReturnType>;

/**
 * Wrap a given {@link InFunction:param} with {@link Effect.sync} such that the function is
 * always called with the given {@link ArgumentVector}.
 * 
 * @param InFunction - The given function that is called by {@link Effect.sync} with the given
 * {@link ArgumentVector} when the {@link Effect.Effect | effect} returned by *this* function is yielded.
 * 
 * @param ArgumentVector - The argument vector to pass to the given {@link InFunction | function} when
 * the {@link Effect.Effect | effect} returned by this is yielded.
 * 
 * @template FunctionType - The type of the given {@link InFunction:param}.  This overload
 * allows you to determine this type (and therefore the type returned by this) via inferring,
 * or via the `typeof` operator with the given {@link InFunction:param}.
 * 
 * @returns {TFunction.Safe<Parameters<typeof InFunction>, Effect.Effect<ReturnType<typeof InFunction>>>}
 * An {@link Effect.Effect}
 * that returns the value of the original {@link InFunction:param}.  This effect never errors, and has
 * no requirements.
 */
export function MakeSync<
    FunctionType extends TFunction.Safe<ReadonlyArray<unknown>, unknown>
>(
    InFunction: FunctionType,
    ...ArgumentVector: Parameters<typeof InFunction>
): Effect.Effect<ReturnType<typeof InFunction>>;

export function MakeSync(
    InFunction: AnyFunction,
    ...ArgumentVector: ReadonlyArray<unknown>
): Effect.Effect<ReturnType<typeof InFunction>>
{
    return Effect.sync((): unknown => InFunction(...(ArgumentVector as Parameters<typeof InFunction>)));
}
