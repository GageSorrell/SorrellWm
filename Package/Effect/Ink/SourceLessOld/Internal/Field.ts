/**
 * Internal utilities *et al.* for {@link \@sorrell/effect-ink/Prose}.
 *
 * @module @sorrell/effect-ink/Internal/Field
 * @internal
 */

/**
 * @file      Field.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Field from "../Field/Field.ts";
import * as PromptImpl from "./Prompt.ts";
import type * as React from "../React.ts";
import { Data, type Effect, type Terminal } from "effect";
import type { FC, ReactNode } from "react";
import type { Prompt } from "../index.ts";

/* eslint-disable @typescript-eslint/no-empty-object-type */

export type Operand<Tag extends string, Body = { }> =
    Prompt.Prompt<never> &
    Body &
    {
        readonly _tag: Tag;
    };

export type Action<A, StateType> = Data.TaggedEnum<{
    readonly NoOp: { };
    readonly Next: { readonly State: StateType; };
    readonly Submit: { readonly Value: A; };
}>;

/* eslint-enable @typescript-eslint/no-empty-object-type */

export interface ActionDefinition extends Data.TaggedEnum.WithGenerics<2>
{
    readonly taggedEnum: Action<this["A"], this["B"]>;
}

/* eslint-disable @typescript-eslint/typedef */

export const Action = Data.taggedEnum<ActionDefinition>();

/* eslint-enable @typescript-eslint/typedef */

/**
 * A function that is called to process user input and determine the next
 * `Prompt.Action` that should be taken.
 */
export type Process<A, StateType> =
    {
        (Input: Terminal.UserInput, State: StateType):
        Effect.Effect<Action<StateType, A>, never, Prompt.Environment>;
    };

export type Primitive =
    | OnSuccess
    | Succeed
    | Loop;

/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface OnSuccess extends Operand<"OnSuccess", {
    readonly Prompt: Primitive;
    readonly OnSuccess: (Value: unknown) => Prompt.Prompt<unknown>
}> { }

export interface Succeed extends Operand<"Succeed", {
    readonly Value: unknown;
}> { }

export interface Loop extends Operand<"Succeed", {
    readonly Component: FC<React.FieldProps<object>>;
    readonly InitialState: | unknown | Effect.Effect<unknown, never, Prompt.Environment>;
    readonly Process: Process<unknown, unknown>;
}> { }

/* eslint-enable @typescript-eslint/no-empty-object-type */

// /**
//  * The state of a {@link Field}.
//  *
//  * @template A - The type of the value `yield`ed by the {@link Field}.
//  * @template ModelType - The type used internally (*e.g.*, with `ink`) to
//  * represent the success type.
//  *
//  * @property {(Value: ModelType) => A} ToSuccess - The function, which should be the same
//  * for all instances of a given {@link Field} type, that converts the internal {@link Value}
//  * to the `yield`ed value.
//  *
//  * @property {ModelType} Value - The internal representation of the value that is `yield`ed to
//  * the user.
//  */
// export interface State<A>
// {
//     readonly Value: A;
// }

export const Loop = <A, OptionsType extends Field.Options<A>, StateType, EventsType extends object>(
    Options: OptionsType,
    Process: Process<A, StateType>,
    Component: FC<React.FieldProps<EventsType>>
): Loop =>
{
    const { InitialState, ...Tail } = Options;

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Object.create(PromptImpl.Prototype);

    Out._tag = "Loop";
    Out.Component = Component;
    Out.State = InitialState;
    Out.Options = Tail;
    Out.Process = Process;

    return Out;
};

export interface WithMessage<A> extends Field.Options<A>
{
    Message: ReactNode;
}

