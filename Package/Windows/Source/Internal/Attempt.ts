/**
 *
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

export const TypeId: unique symbol = Symbol.for("~sorrell/windows/Internal/Attempt");
export type TypeId = typeof TypeId;

interface AttemptBase
{
    readonly [ TypeId ]: TypeId;
    readonly _tag: string;
    readonly Value: unknown;
}

export interface Success<in out A> extends AttemptBase
{
    readonly _tag: "Success";
    readonly Value: A;
}

export interface Failure extends AttemptBase
{
    readonly _tag: "Failure";
    readonly Value: string;
}

export type Attempt<A> =
    | Success<A>
    | Failure;

export const AsOption = <A>(Self: Attempt<A>): Option.Option<A> =>
{
    return Self._tag === "Success"
        ? Option.some(Self.Value)
        : Option.none();
};

export const ToOption = <ArgsType extends ReadonlyArray<unknown>, A>(In: Function.FunctionN<ArgsType, Attempt<A>>) => Function.flow(In, AsOption);

export class NativeError extends Data.TaggedClass("NativeError")<{
    readonly Message: string;
}> { }

export type AttemptResult<A> = Result.Result<A, NativeError>;

export const AsResult = <A>(Self: Attempt<A>): AttemptResult<A> =>
{
    return Self._tag === "Success"
        ? Result.succeed(Self.Value)
        : Result.fail(new NativeError({ Message: Self.Value }));
};
