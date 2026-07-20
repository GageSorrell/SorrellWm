/**
 * Low-level tooling for building prompts.  This can be used by dependents
 * to build custom prompts, but most usage of this module is expected to
 * be internal.
 *
 * @module @sorrell/effect-ink/Prompt/Impl
 */

/**
 * @file      PromptImpl.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Prompt from "./Runtime.tsx";
import type * as Prose from "./Prose.tsx";
import { Effect, Effectable, Predicate } from "effect";
import type { Input } from "../Input.ts";
import type { ReactNode } from "react";
import * as Validation from "./Validation.ts";

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

/**
 * The base type for objects that represent the state of a prompt.
 *
 * @remarks
 * This is different from the state of a (`react`) *component*, which
 * also contains ink-related state.
 *
 * @template A - The type produced by a prompt having this state.
 * @template ModelType - The internal representation of the data to be produced
 * by a prompt having this state.
 *
 * @property {boolean} IsActive - Whether the prompt having this state is currently active--that is,
 * whether it is currently being interacted with by the user.
 *
 * @property {Validation.State<A>} Validation - The validation state of the prompt.
 */
export interface State<A, ModelType = A>
{
    readonly IsActive: boolean;
    readonly Validation: Validation.State<ModelType>;
    readonly Value: ModelType;
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
        Input: Input,
        State: StateType
    ) => Effect.Effect<Action.Action<StateType, A>>;
}

export interface LoopPrompt<A> extends PromptImplBase
{
    readonly _tag: "Loop";
    readonly InitialState: unknown;
    readonly Render: (State: unknown) => ReactNode;
    readonly Process: (
        Input: Input,
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

export interface ProseImpl extends PromptImplBase
{
    readonly _tag: "Prose";
    readonly Component: (Props: Prose.Props) => ReactNode;
}

export interface PromptImplBase
{
    readonly _tag: string;
}

export type PromptImpl<A> =
    | ProseImpl
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

/* eslint-disable-next-line @typescript-eslint/typedef, @typescript-eslint/no-explicit-any */
export const Prototype: any =
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        ...Effectable.Prototype<Prompt.Prompt<any>>({
            evaluate()
            {
                return Prompt.Run(this);
            },
            label: "InkPrompt"
        }),
        [ Prompt.TypeId ]:
        {
            _A: (_: never) => _,
            _E: (_: never) => _,
            _R: (_: never) => _
        }
    };
