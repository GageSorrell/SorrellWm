/**
 * Converts native operation attempts into Effect results and options.
 *
 * @module @sorrell/windows/Internal/Attempt
 * @internal
 *
 * @file      Attempt.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data, Function, Option, Result } from "effect";

export/** The native attempt protocol's runtime identifier. */
const TypeId: unique symbol = Symbol.for("~sorrell/windows/Internal/Attempt");
/** The type of the native attempt protocol's runtime identifier. */
export type TypeId = typeof TypeId;

interface AttemptBase
{
    readonly [ TypeId ]: TypeId;
    readonly _tag: string;
    readonly Value: unknown;
}

/** A successful value returned by the native addon. */
export interface Success<in out A> extends AttemptBase
{
    readonly _tag: "Success";
    readonly Value: A;
}

/** A failure message returned by the native addon. */
export interface Failure extends AttemptBase
{
    readonly _tag: "Failure";
    readonly Value: string;
}

/** A success-or-failure value returned across the Node-API boundary. */
export type NativeAttempt<A> =
    | Success<A>
    | Failure;

export/** Convert a native attempt into an Effect `Option`. */
const AsOption = <A>(Self: NativeAttempt<A>): Option.Option<A> =>
{
    return Self._tag === "Success"
        ? Option.some(Self.Value)
        : Option.none();
};

export/** Wrap a function returning a native attempt with `Option` conversion. */
const ToOption = <ArgsType extends ReadonlyArray<unknown>, A>(
    In: Function.FunctionN<ArgsType, NativeAttempt<A>>
) => Function.flow(In, AsOption);

/** A failure reported by the native Windows binding. */
export class NativeError extends Data.TaggedClass("NativeError")<{
    readonly Message: string;
}> { }

/** An Effect `Result` containing either a native value or error. */
export type Attempt<A> = Result.Result<A, NativeError>;

export/** Convert a native attempt into an Effect `Result`. */
const AsResult = <A>(Self: NativeAttempt<A>): Attempt<A> =>
{
    return Self._tag === "Success"
        ? Result.succeed(Self.Value)
        : Result.fail(new NativeError({ Message: Self.Value }));
};
