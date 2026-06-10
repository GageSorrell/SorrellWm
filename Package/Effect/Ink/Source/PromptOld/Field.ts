/**
 * @file      Field.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { BasePromptOptions, Choice } from "./Prompt.ts";
import type { Effect } from "effect";

export type Field<A, E, R> =
    | Text<E, R>
    | Password<E, R>
    | Confirm
    | Select<A, E, R>
    | MultiSelect<A, E, R>;

export interface Text<E, R> extends BasePromptOptions
{
    readonly _tag: "Text";
    readonly InitialValue?: string;
    readonly Placeholder?: string;
    readonly SubmitEmpty?: boolean;
    readonly Validate?: (Value: string) => Effect.Effect<string | undefined, E, R>;
}

export interface Password<E, R> extends BasePromptOptions
{
    readonly _tag: "Password";
    readonly InitialValue?: string;
    readonly Placeholder?: string;
    readonly SubmitEmpty?: boolean;
    readonly Mask?: string;
    readonly Validate?: (Value: string) => Effect.Effect<string | undefined, E, R>;
}

export interface Confirm extends BasePromptOptions
{
    readonly _tag: "Confirm";
    readonly InitialValue?: boolean;
}

export interface Select<Value, E, R> extends BasePromptOptions
{
    readonly _tag: "Select";
    readonly Choices: Effect.Effect<ReadonlyArray<Choice<Value>>, E, R>;
    readonly InitialValue?: Value;
    readonly Validate?: (
        Value: Value,
        Choice: Choice<Value>
    ) => Effect.Effect<string | undefined, E, R>;
}

export interface MultiSelect<A, E, R> extends BasePromptOptions
{
    readonly _tag: "MultiSelect";
    readonly Choices: Effect.Effect<ReadonlyArray<Choice<A>>, E, R>;
    readonly InitialValues?: ReadonlyArray<A>;
    readonly SubmitEmpty?: boolean;
    readonly Validate?: (
        Values: ReadonlyArray<A>,
        Choices: ReadonlyArray<Choice<A>>
    ) => Effect.Effect<string | undefined, E, R>;
}
