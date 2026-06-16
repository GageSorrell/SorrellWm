/**
 * Low-level tooling for building prompts.  This can be used by dependents
 * to build custom prompts.
 *
 * @module @sorrell/effect-ink/PromptImpl
 */

/**
 * @file      PromptImpl.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, Predicate } from "effect";
import type { PromptInput } from "./Input.ts";
import type { ReactNode } from "react";

export namespace Action
{
    export interface Beep
    {
        readonly _tag: "Beep";
    }

    export interface NextFrame<StateType>
    {
        readonly _tag: "NextFrame";
        readonly State: StateType;
    }

    export interface Submit<A>
    {
        readonly _tag: "Submit";
        readonly Value: A;
    }

    export type Action<StateType, A> =
        | Beep
        | NextFrame<StateType>
        | Submit<A>;
}

export function Beep(): Action.Beep
{
    return {
        _tag: "Beep"
    };
}

export function NextFrame<StateType>(
    InitialState: StateType
): {
    (Patch: Partial<StateType>): Effect.Effect<Action.NextFrame<StateType>>;
    (Transform: (State: StateType) => StateType): Effect.Effect<Action.NextFrame<StateType>>;
}
{
    function Out(Patch: Partial<StateType>): Effect.Effect<Action.NextFrame<StateType>>;
    function Out(
        Transform: (State: StateType) => StateType
    ): Effect.Effect<Action.NextFrame<StateType>>;
    function Out(PatchOrTransform:
        | Partial<StateType>
        | ((State: StateType) => StateType)
    ): Effect.Effect<Action.NextFrame<StateType>>
    {
        return Effect.succeed({
            _tag: "NextFrame",

            State: Predicate.isFunction(PatchOrTransform)
                ? PatchOrTransform(InitialState)
                : {
                    ...InitialState,
                    ...PatchOrTransform
                }
        });
    }

    return Out;
}

// function MakeNextFrame

export function Submit<A>(Value: A): Action.Submit<A>
{
    return {
        _tag: "Submit",

        Value
    };
}

export interface LoopDecl<StateType, A>
{
    readonly InitialState: StateType;
    readonly Render: (State: StateType) => ReactNode;
    readonly Process: (
        Input: PromptInput,
        State: StateType
    ) => Effect.Effect<Action.Action<StateType, A>>;
}

export interface LoopPrompt<A> extends PromptImplBase
{
    readonly _tag: "Loop";
    readonly InitialState: unknown;
    readonly Render: (State: unknown) => ReactNode;
    readonly Process: (
        Input: PromptInput,
        State: unknown
    ) => Effect.Effect<Action.Action<unknown, A>>;
}

export interface Success<A> extends PromptImplBase
{
    readonly _tag: "Succeed";
    readonly Value: A;
}

export interface OnSuccess<A> extends PromptImplBase
{
    readonly _tag: "OnSuccess";
    readonly Prompt: PromptImpl<unknown>;
    readonly OnSuccess: (Value: unknown) => PromptImpl<A>;
}

export interface PromptImplBase
{
    readonly Prose?: ReadonlyArray<Prose.Prose>;
}

export type PromptImpl<A> =
    | LoopPrompt<A>
    | Success<A>
    | OnSuccess<A>;

export interface ActiveLoopState
{
    readonly Loop: LoopPrompt<unknown>;
    readonly State: unknown;
    readonly Resolve: (Value: unknown) => void;
    readonly Reject: (Cause: unknown) => void;
}
