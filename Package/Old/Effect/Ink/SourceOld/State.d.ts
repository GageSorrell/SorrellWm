/**
 * Manage `ink` state with `effect`.
 *
 * @module @sorrell/effect-ink/State
 */
import type { InputCommand } from "./Input.js";
export type PromptStatus = "Active" | "Submitted" | "Cancelled";
export interface TextPromptState {
    readonly Status: PromptStatus;
    readonly Value: string;
    readonly CursorOffset: number;
    readonly ErrorMessage?: string;
}
export interface TextPromptStateOptions {
    readonly InitialValue?: string;
    readonly InitialCursorOffset?: number;
    readonly ErrorMessage?: string;
}
export interface TextPromptReducerOptions {
    readonly SubmitEmpty?: boolean;
}
export declare const CreateTextPromptState: (Options?: TextPromptStateOptions) => TextPromptState;
export declare const ReduceTextPromptState: (State: TextPromptState, Command: InputCommand, Options?: TextPromptReducerOptions) => TextPromptState;
export declare const SetTextPromptError: (State: TextPromptState, ErrorMessage: string | undefined) => TextPromptState;
export interface ConfirmPromptState {
    readonly Status: PromptStatus;
    readonly Value: boolean;
    readonly ErrorMessage?: string;
}
export interface ConfirmPromptStateOptions {
    readonly InitialValue?: boolean;
    readonly ErrorMessage?: string;
}
export declare const CreateConfirmPromptState: (Options?: ConfirmPromptStateOptions) => ConfirmPromptState;
export declare const ReduceConfirmPromptState: (State: ConfirmPromptState, Command: InputCommand) => ConfirmPromptState;
export declare const SetConfirmPromptError: (State: ConfirmPromptState, ErrorMessage: string | undefined) => ConfirmPromptState;
export interface PromptChoice<Value> {
    readonly Value: Value;
    readonly Label: string;
    readonly Description?: string;
    readonly Disabled?: boolean;
    readonly Group?: string;
}
export interface SelectPromptState<Value> {
    readonly Status: PromptStatus;
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly CursorIndex: number;
    readonly SubmittedChoice?: PromptChoice<Value>;
    readonly ErrorMessage?: string;
}
export interface SelectPromptStateOptions<Value> {
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number | undefined;
    readonly ErrorMessage?: string | undefined;
}
export interface SelectPromptReducerOptions {
    readonly Wrap?: boolean | undefined;
    readonly PageSize?: number | undefined;
}
export declare const CreateSelectPromptState: <Value>(Options: SelectPromptStateOptions<Value>) => SelectPromptState<Value>;
export declare const ReduceSelectPromptState: <Value>(State: SelectPromptState<Value>, Command: InputCommand, Options?: SelectPromptReducerOptions) => SelectPromptState<Value>;
export declare const SetSelectPromptError: <Value>(State: SelectPromptState<Value>, ErrorMessage: string | undefined) => SelectPromptState<Value>;
export interface MultiSelectPromptState<Value> {
    readonly Status: PromptStatus;
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly CursorIndex: number;
    readonly SelectedIndexes: ReadonlySet<number>;
    readonly SubmittedChoices?: ReadonlyArray<PromptChoice<Value>> | undefined;
    readonly ErrorMessage?: string | undefined;
}
export interface MultiSelectPromptStateOptions<Value> {
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number | undefined;
    readonly InitialSelectedIndexes?: ReadonlyArray<number> | undefined;
    readonly ErrorMessage?: string | undefined;
}
export interface MultiSelectPromptReducerOptions {
    readonly Wrap?: boolean | undefined;
    readonly PageSize?: number | undefined;
    readonly SubmitEmpty?: boolean | undefined;
}
export declare const CreateMultiSelectPromptState: <Value>(Options: MultiSelectPromptStateOptions<Value>) => MultiSelectPromptState<Value>;
export declare const ReduceMultiSelectPromptState: <Value>(State: MultiSelectPromptState<Value>, Command: InputCommand, Options?: MultiSelectPromptReducerOptions) => MultiSelectPromptState<Value>;
export declare const ToggleMultiSelectChoice: <Value>(State: MultiSelectPromptState<Value>) => MultiSelectPromptState<Value>;
export declare const SetMultiSelectPromptError: <Value>(State: MultiSelectPromptState<Value>, ErrorMessage: string | undefined) => MultiSelectPromptState<Value>;
export declare const GetSelectedChoices: <Value>(State: MultiSelectPromptState<Value>) => ReadonlyArray<PromptChoice<Value>>;
export interface FormFieldState<Name extends string> {
    readonly Name: Name;
    readonly Label: string;
    readonly Completed: boolean;
    readonly Disabled?: boolean;
    readonly ErrorMessage?: string;
}
export interface FormPromptState<Name extends string> {
    readonly Status: PromptStatus;
    readonly Fields: ReadonlyArray<FormFieldState<Name>>;
    readonly ActiveFieldIndex: number;
    readonly ErrorMessage?: string;
}
export interface FormPromptStateOptions<Name extends string> {
    readonly Fields: ReadonlyArray<FormFieldState<Name>>;
    readonly InitialActiveFieldIndex?: number;
    readonly ErrorMessage?: string;
}
export interface FormPromptReducerOptions {
    readonly Wrap?: boolean;
}
export declare const CreateFormPromptState: <Name extends string>(Options: FormPromptStateOptions<Name>) => FormPromptState<Name>;
export declare const ReduceFormPromptState: <Name extends string>(State: FormPromptState<Name>, Command: InputCommand, Options?: FormPromptReducerOptions) => FormPromptState<Name>;
export declare const SetFormPromptError: <Name extends string>(State: FormPromptState<Name>, ErrorMessage: string | undefined) => FormPromptState<Name>;
export declare const SetFormFieldCompleted: <Name extends string>(State: FormPromptState<Name>, Name: Name, Completed: boolean) => FormPromptState<Name>;
export declare const SetFormFieldError: <Name extends string>(State: FormPromptState<Name>, Name: Name, ErrorMessage: string | undefined) => FormPromptState<Name>;
export declare const AreAllFormFieldsCompleted: <Name extends string>(State: FormPromptState<Name>) => boolean;
export declare const IsActive: (Status: PromptStatus) => boolean;
export declare const IsSubmitted: (Status: PromptStatus) => boolean;
export declare const IsCancelled: (Status: PromptStatus) => boolean;
export declare const IsChoiceEnabled: <Value>(Choice: PromptChoice<Value> | undefined) => boolean;
export declare const FindFirstEnabledChoiceIndex: <Value>(Choices: ReadonlyArray<PromptChoice<Value>>) => number;
export declare const FindLastEnabledChoiceIndex: <Value>(Choices: ReadonlyArray<PromptChoice<Value>>) => number;
export declare const MoveChoiceCursor: <Value>(Choices: ReadonlyArray<PromptChoice<Value>>, CurrentIndex: number, Step: number, Wrap: boolean) => number;
export declare const MoveChoiceCursorByPage: <Value>(Choices: ReadonlyArray<PromptChoice<Value>>, CurrentIndex: number, Step: number, Wrap: boolean) => number;
export declare const FindFirstEnabledFieldIndex: <Name extends string>(Fields: ReadonlyArray<FormFieldState<Name>>) => number;
export declare const FindLastEnabledFieldIndex: <Name extends string>(Fields: ReadonlyArray<FormFieldState<Name>>) => number;
export declare const MoveFieldCursor: <Name extends string>(Fields: ReadonlyArray<FormFieldState<Name>>, CurrentIndex: number, Step: number, Wrap: boolean) => number;
//# sourceMappingURL=State.d.ts.map