/**
 * @file      Promise.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TExtractFunction, TFunction } from "../Functional/index.js";
import type { TPromise, TPromiseLike } from "./Async.js";

/**
 * @template DataType - The {@link Data} type of this.
 *
 * @property {DataType | undefined} Data - The data returned by the corresponding
 * `async` function or `Promise<DataType>`,
 * iff it resolved successfully.  Otherwise, it is `undefined`.
 *
 * @property {undefined | unknown} Error - The error thrown by the corresponding
 * `async` function or `Promise<DataType>`.  This is `undefined` iff the
 * corresponding `async` function or `Promise<DataType>` resolved successfully.
 */
export type TTryResult<DataType> =
    | {
        Data: DataType;
        Error: undefined;
    }
    | {
        Data: undefined;
        Error: unknown | undefined;
    };

/**
 * An `async` function or `Promise` of the given {@link DataType}.
 * This is the type of the argument of {@link Try}.
 *
 * @template DataType - The type of the data that the `async` function or `Promise<DataType>`.
 */
export type TTrySource<DataType> =
    | Promise<DataType>
    | (() => DataType)
    | (() => Promise<DataType>);

/**
 * The type of the function passed to the `then` method of a `Promise`.
 *
 * @template ParameterType - The type of the parameter passed to the function.
 * @template ReturnType - The type of the value returned by the function.
 */
export type TThen<
    ParameterType = unknown,
    ReturnType = unknown
> =
    (Value: ParameterType) => ReturnType;

// export type TReject<RejectType = unknown> = (Reason: RejectType) => void;

/**
 * The type of the function passed to the `catch` method of a `Promise`.
 *
 * @template Type - The type of the value returned by the `catch` function.
 */
export type TPromiseCatchFunction<Type = unknown> =
    Parameters<TExtractFunction<Promise<Type>["catch"]>>[0];

/**
 * Maps a function type to union of two functions, each with the original
 * argument vector type.  One return type is wrapped with `Promise`, and
 * the other is not.  The nuance regarding the return type is elaborated
 * upon in the note below.
 *
 * @note It is expected that in *most* cases, the given {@link FunctionType}
 * is a regular, synchronous function type (*i.e.*, its return type is *not*
 * a `Promise`), but if it *does* return a `Promise`, the default behavior
 * is to assume that this is the intended async form of the resulting union,
 * and the type wrapped in the `Promise` will be inferred.  If the given
 * {@link FunctionType} returns a `Promise` but is intended to be the *synchronous*
 * form, then {@link RetainPromiseFlag} should be set to `true`.
 *
 * @template FunctionType - The function type from which this union is constructed.
 * @template RetainPromiseFlag - If `true` and `ReturnType<{@link FunctionType}> extends
 * Promise<unknown>`, then the {@link FunctionType} will be treated as the synchronous
 * form, and the other type in this union will return a `Promise<Promise<infer ResolveType>>`.
 */
export type TMaybeAsync<
    FunctionType extends TFunction,
    RetainPromiseFlag extends boolean = false
> =
    FunctionType extends TFunction<infer ArgumentVectorType, infer ReturnType>
        ? ReturnType extends Promise<infer ResolveType>
            ? RetainPromiseFlag extends true
                ? TFunction<ArgumentVectorType, ReturnType>
                : TFunction<ArgumentVectorType, ResolveType>
            : (
                | TFunction<ArgumentVectorType, ReturnType>
                | TFunction<ArgumentVectorType, Promise<ReturnType>>
            )
        : never;

/**
 * A function that is an argument of a given {@link PromiseConstructorLike}`, which is called when
 * the {@link PromiseLike} created by the given {@link PromiseConstructorLike} resolves, if it resolves.
 *
 * @param Value - The value to which the given {@link PromiseLike} will resolve by calling this.
 *
 * @template ResolveType - The type to which the given {@link PromiseLike} will resolve by calling this.
 */
export type TResolve<ResolveType> = (Value: ResolveType | PromiseLike<ResolveType>) => void;

/**
 * A function that is called by a given {@link PromiseLike}`, if the given {@link PromiseLike} resolves.
 *
 * @param Value - The value to which the given {@link PromiseLike} resolves when this is called,
 * if it resolves (this is called precisely when the given {@link PromiseLike} resolves).
 *
 * @template ResolveType - The type to which the given {@link PromiseLike} provides once it has
 * resolved, if it resolves.
 *
 * @template Result1Type - The type to which the resulting {@link PromiseLike} will resolve, if it resolves.
 */
export type TOnFulfilled<
    ResolveType,
    Result1Type = ResolveType
> =
    {
        (Value: ResolveType):
            | Result1Type
            | PromiseLike<Result1Type>;
    };

/**
 * A function that is called by a given {@link Promise}`, if the given {@link Promise} rejects.
 *
 * @param Reason - The reason for why given {@link Promise} rejects when this is called,
 * if it rejects (this is called precisely when the given {@link Promise} rejects).
 *
 * @template RejectType - The type to which the given {@link Promise} provides once it has
 * rejected, if it rejects.
 *
 * @returns {Result2Type | PromiseLike<Result2Type>} A {@link PromiseLike} that resolves when this function
 * has finished handling the rejection of the {@link Promise} which received this function via
 * {@link Promise["catch"]}.
 */
export type TOnRejected<RejectType> =
    {
        (Reason: unknown):
            | RejectType
            | PromiseLike<RejectType>;
    };

/**
 * A function that is an argument of a given {@link PromiseConstructorLike}`, which is called when
 * the {@link PromiseLike} created by the given {@link PromiseConstructorLike} rejects, if it rejects.
 *
 * @param Reason - The reason for why given {@link PromiseLike} will reject by calling this.
 *
 * @template RejectType - The type to which the given {@link PromiseLike} will  by calling this.
 */
export type TReject<RejectType = unknown> = (Reason: RejectType) => void;

/**
 * The argument of a {@link TPromise} (or other {@link PromiseLike}), such that a new
 * {@link PromiseLike} is created by the given constructor using this argument.
 *
 * @param Resolve - The function that, if called, will cause the {@link PromiseLike}
 * constructed with this to resolve.
 *
 * @param Reject - The function that, if called, will cause the {@link PromiseLike}
 * constructed with this to resolve.
 *
 * @template ResolveType - The type to which the {@link PromiseLike} constructed with this will be resolved,
 * if it resolves.
 *
 * @template RejectType - The type to which the {@link PromiseLike} constructed with this will be rejected,
 * if it rejects.
 *
 * @returns {void} This does not return anything; control flow is handled entirely by calling either
 * {@link Resolve} or {@link Reject}.
 */
export type TPromiseExecutor<ResolveType, RejectType = never> =
    {
        (
            Resolve?: TResolve<ResolveType>,
            Reject?: TReject<RejectType>
        ): void;
    };

/**
 * The type of the argument used to construct a {@link TPromise}.
 *
 * @template ResolveType - The type to which the {@link TPromise} constructed with
 * this argument will resolve, if it resolves.
 */
export type TPromiseCtorArgument<ResolveType> =
    | TPromiseExecutor<ResolveType>
    | TPromise<ResolveType>
    | Promise<ResolveType>;

/**
 * Either a given {@link ResultType}, or a {@link TPromiseLike} of a given {@link ResultType}.
 *
 * @template ResultType - The type which is either this, or of which this is a {@link PromiseLike}.
 */
export type TMaybePromiseLike<ResultType> =
    | ResultType
    | TPromiseLike<ResultType>;
