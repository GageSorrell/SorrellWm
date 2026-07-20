/**
 * `ink`-driven prompts for CLI applications.
 *
 * @module @sorrell/effect-ink/cli/Prompt
 */
import { type PromptChoice } from "../State.ts";
import { Effect } from "effect";
import type { InkRenderOptions, InkRenderer as InkRendererService } from "../InkRenderer.ts";
import { type ReactNode } from "react";
import { type PromptError } from "../Error.ts";
export interface PromptRenderOptions {
    readonly RenderOptions?: InkRenderOptions;
}
export interface BasePromptOptions extends PromptRenderOptions {
    readonly Message: ReactNode;
    readonly Hint?: ReactNode;
    readonly Required?: boolean;
    readonly Optional?: boolean;
}
export interface TextPromptOptions extends BasePromptOptions {
    readonly InitialValue?: string;
    readonly Placeholder?: string;
    readonly SubmitEmpty?: boolean;
    readonly Validate?: (Value: string) => string | undefined;
}
export interface PasswordPromptOptions extends TextPromptOptions {
    readonly Mask?: string;
}
export interface ConfirmPromptOptions extends BasePromptOptions {
    readonly InitialValue?: boolean;
}
export interface SelectPromptOptions<Value> extends BasePromptOptions {
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number;
    readonly Wrap?: boolean;
    readonly PageSize?: number;
    readonly Validate?: (Value: Value, Choice: PromptChoice<Value>) => string | undefined;
}
export interface MultiSelectPromptOptions<Value> extends BasePromptOptions {
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number;
    readonly InitialSelectedIndexes?: ReadonlyArray<number>;
    readonly Wrap?: boolean;
    readonly PageSize?: number;
    readonly SubmitEmpty?: boolean;
    readonly Validate?: (Values: ReadonlyArray<Value>, Choices: ReadonlyArray<PromptChoice<Value>>) => string | undefined;
}
export interface PromptCompletion<A> {
    readonly Submit: (Value: A) => void;
    readonly Cancel: () => void;
    readonly Fail: (Error: PromptError) => void;
}
export declare const RunPrompt: <A>(MakeElement: (Completion: PromptCompletion<A>) => ReactNode, Options?: PromptRenderOptions) => Effect.Effect<A, PromptError, InkRendererService>;
export declare const TextPrompt: (Options: TextPromptOptions) => Effect.Effect<string, PromptError, InkRendererService>;
export declare const PasswordPrompt: (Options: PasswordPromptOptions) => Effect.Effect<string, PromptError, InkRendererService>;
export declare const ConfirmPrompt: (Options: ConfirmPromptOptions) => Effect.Effect<boolean, PromptError, InkRendererService>;
export declare const SelectPrompt: <Value>(Options: SelectPromptOptions<Value>) => Effect.Effect<Value, PromptError, InkRendererService>;
export declare const MultiSelectPrompt: <Value>(Options: MultiSelectPromptOptions<Value>) => Effect.Effect<ReadonlyArray<Value>, PromptError, InkRendererService>;
export type FormPromptFields = Record<string, Effect.Effect<unknown, PromptError, InkRendererService>>;
export type FormPromptResult<Fields extends FormPromptFields> = {
    readonly [Key in keyof Fields]: Effect.Success<Fields[Key]>;
};
export declare const FormPrompt: <Fields extends FormPromptFields>(Fields: Fields) => Effect.Effect<FormPromptResult<Fields>, PromptError, InkRendererService>;
export declare const MakeChoice: <Value>(Value: Value, Label: string, Options?: {
    readonly Description?: string;
    readonly Disabled?: boolean;
    readonly Group?: string;
}) => PromptChoice<Value>;
//# sourceMappingURL=Prompt.d.ts.map