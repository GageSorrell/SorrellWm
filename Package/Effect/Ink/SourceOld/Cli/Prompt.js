import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * `ink`-driven prompts for CLI applications.
 *
 * @module @sorrell/effect-ink/cli/Prompt
 */
/**
 * @file      Prompt.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { ChoiceList, ErrorLine, HintLine, PromptLine, StyledText, SuccessLine, TextInputLine, useTheme } from "../Component.js";
import { CreateConfirmPromptState, CreateMultiSelectPromptState, CreateSelectPromptState, CreateTextPromptState, GetSelectedChoices, ReduceConfirmPromptState, ReduceMultiSelectPromptState, ReduceSelectPromptState, ReduceTextPromptState, SetMultiSelectPromptError, SetSelectPromptError, SetTextPromptError } from "../State.js";
import { Deferred, Effect } from "effect";
import { useInputCommands } from "../Input.js";
import { useCallback, useEffect, useState } from "react";
import { PromptValidationError, promptCancelled } from "../Error.js";
import { Box } from "ink";
import { InkRenderer } from "../InkRenderer.js";
import { RuntimeProvider } from "../React.js";
export const RunPrompt = (MakeElement, Options = {}) => Effect.scoped(Effect.gen(function* () {
    const Renderer = yield* InkRenderer;
    const RuntimeContext = yield* Effect.context();
    const Result = yield* Deferred.make();
    const Completion = {
        Submit: (Value) => {
            Effect.runFork(Deferred.succeed(Result, Value));
        },
        Cancel: () => {
            Effect.runFork(Deferred.fail(Result, promptCancelled()));
        },
        Fail: (Error) => {
            Effect.runFork(Deferred.fail(Result, Error));
        }
    };
    const Element = (_jsx(RuntimeProvider, { Context: RuntimeContext, children: MakeElement(Completion) }));
    const Instance = yield* Renderer.Render(Element, NormalizePromptRenderOptions(Options.RenderOptions));
    return yield* Deferred
        .await(Result)
        .pipe(Effect.ensuring(Instance.Unmount.pipe(Effect.ignore)));
}));
export const TextPrompt = (Options) => RunPrompt((Completion) => (_jsx(TextPromptView, { Completion: Completion, Mask: undefined, Options: Options })), Options);
export const PasswordPrompt = (Options) => RunPrompt((Completion) => (_jsx(TextPromptView, { Completion: Completion, Mask: Options.Mask ?? "•", Options: Options })), Options);
export const ConfirmPrompt = (Options) => RunPrompt((Completion) => (_jsx(ConfirmPromptView, { Completion, Options })), Options);
export const SelectPrompt = (Options) => RunPrompt((Completion) => (_jsx(SelectPromptView, { Completion, Options })), Options);
export const MultiSelectPrompt = (Options) => RunPrompt((Completion) => (_jsx(MultiSelectPromptView, { Completion, Options })), Options);
export const FormPrompt = (Fields) => Effect.gen(function* () {
    const Result = {};
    for (const FieldName of Object.keys(Fields)) {
        Result[FieldName] = yield* Fields[FieldName];
    }
    return Result;
});
export const MakeChoice = (Value, Label, Options = {}) => {
    return {
        Label,
        Value,
        ...Options
    };
};
function TextPromptView(Props) {
    const { Options, Mask, Completion } = Props;
    const [State, SetState] = useState(() => CreateTextPromptState(Options.InitialValue !== undefined
        ? { InitialValue: Options.InitialValue }
        : {}));
    const SubmitEmpty = Options.SubmitEmpty ?? true;
    const HandleCommand = useCallback((Command) => {
        SetState((CurrentState) => {
            if (Command.Action === "Submit"
                && SubmitEmpty !== true
                && CurrentState.Value.length === 0) {
                return SetTextPromptError(CurrentState, "Enter a value.");
            }
            return ReduceTextPromptState(CurrentState, Command, {
                SubmitEmpty
            });
        });
    }, [
        SubmitEmpty
    ]);
    useInputCommands(HandleCommand, {
        Active: State.Status === "Active",
        AllowTextInput: true
    });
    useEffect(() => {
        if (State.Status === "Cancelled") {
            Completion.Cancel();
            return;
        }
        if (State.Status !== "Submitted") {
            return;
        }
        try {
            const ValidationMessage = Options.Validate?.(State.Value);
            if (ValidationMessage !== undefined) {
                SetState({
                    ...State,
                    Status: "Active",
                    ...(ValidationMessage !== undefined ? { ErrorMessage: ValidationMessage } : {})
                });
                return;
            }
            Completion.Submit(State.Value);
        }
        catch (Cause) {
            Completion.Fail(new PromptValidationError({
                Cause,
                Message: "Prompt validation threw an error.",
                Value: State.Value
            }));
        }
    }, [
        Completion,
        Options,
        State
    ]);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(PromptLine, { Message: Options.Message ?? "", ...(Options.Optional !== undefined ? { Optional: Options.Optional } : {}), ...(Options.Required !== undefined ? { Required: Options.Required } : {}) }), _jsx(Box, { marginLeft: 2, children: _jsx(TextInputLine, { ...(Options.Placeholder !== undefined ? { Placeholder: Options.Placeholder } : {}), ...(State.CursorOffset !== undefined ? { CursorOffset: State.CursorOffset } : {}), ...(Mask !== undefined ? { Mask } : {}), Focused: State.Status === "Active", Value: State.Value }) }), State.ErrorMessage === undefined
                ? (_jsx(HintLine, { children: Options.Hint }))
                : (_jsx(ErrorLine, { children: State.ErrorMessage }))] }));
}
function ConfirmPromptView(Props) {
    const { Options, Completion } = Props;
    const Theme = useTheme();
    const [State, SetState] = useState(() => CreateConfirmPromptState(Options.InitialValue !== undefined
        ? { InitialValue: Options.InitialValue }
        : {}));
    const HandleCommand = useCallback((Command) => {
        SetState((CurrentState) => ReduceConfirmPromptState(CurrentState, Command));
    }, []);
    useInputCommands(HandleCommand, {
        Active: State.Status === "Active",
        AllowTextInput: true
    });
    useEffect(() => {
        if (State.Status === "Cancelled") {
            Completion.Cancel();
            return;
        }
        if (State.Status === "Submitted") {
            Completion.Submit(State.Value);
        }
    }, [
        Completion,
        State
    ]);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(PromptLine, { Message: Options.Message ?? "", ...(Options.Optional !== undefined ? { Optional: Options.Optional } : {}), ...(Options.Required !== undefined ? { Required: Options.Required } : {}) }), _jsxs(Box, { marginLeft: 2, children: [_jsx(StyledText, { Style: State.Value
                            ? Theme.Prompt.SelectedChoice
                            : Theme.Prompt.UnselectedChoice, children: "Yes" }), _jsx(StyledText, { Style: Theme.Base.Muted, children: " / " }), _jsx(StyledText, { Style: !State.Value
                            ? Theme.Prompt.SelectedChoice
                            : Theme.Prompt.UnselectedChoice, children: "No" })] }), _jsx(HintLine, { children: Options.Hint ?? "Use left/right, y/n, or space. Press enter to confirm." })] }));
}
function SelectPromptView(Props) {
    const { Options, Completion } = Props;
    const [State, SetState] = useState(() => CreateSelectPromptState({
        Choices: Options.Choices,
        InitialCursorIndex: Options.InitialCursorIndex
    }));
    const HandleCommand = useCallback((Command) => {
        SetState((CurrentState) => {
            if (Command.Action === "Submit") {
                const CurrentChoice = CurrentState.Choices[CurrentState.CursorIndex];
                if (CurrentChoice === undefined
                    || CurrentChoice.Disabled === true) {
                    return SetSelectPromptError(CurrentState, "Select an enabled option.");
                }
            }
            return ReduceSelectPromptState(CurrentState, Command, Options);
        });
    }, [Options]);
    useInputCommands(HandleCommand, {
        Active: State.Status === "Active",
        AllowTextInput: false
    });
    useEffect(() => {
        if (State.Status === "Cancelled") {
            Completion.Cancel();
            return;
        }
        if (State.Status !== "Submitted") {
            return;
        }
        const SubmittedChoice = State.SubmittedChoice;
        if (SubmittedChoice === undefined) {
            SetState({
                ...State,
                ErrorMessage: "No option was selected.",
                Status: "Active"
            });
            return;
        }
        try {
            const ValidationMessage = Options.Validate?.(SubmittedChoice.Value, SubmittedChoice);
            if (ValidationMessage !== undefined) {
                SetState({
                    ...State,
                    ErrorMessage: ValidationMessage,
                    Status: "Active"
                });
                return;
            }
            Completion.Submit(SubmittedChoice.Value);
        }
        catch (Cause) {
            Completion.Fail(new PromptValidationError({
                Cause,
                Message: "Prompt validation threw an error.",
                Value: SubmittedChoice.Value
            }));
        }
    }, [
        Completion,
        Options,
        State
    ]);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(PromptLine, { Message: Options.Message ?? "", ...(Options.Optional !== undefined ? { Optional: Options.Optional } : {}), ...(Options.Required !== undefined ? { Required: Options.Required } : {}) }), _jsx(Box, { flexDirection: "column", marginLeft: 2, children: State.Choices.length === 0
                    ? (_jsx(ErrorLine, { children: "No choices are available." }))
                    : (_jsx(ChoiceList, { Choices: State.Choices, GetDescription: (Choice) => Choice.Description, GetLabel: (Choice) => Choice.Label, IsCursor: (_Choice, Index) => Index === State.CursorIndex, IsDisabled: (Choice) => Choice.Disabled === true, IsSelected: (_Choice, Index) => Index === State.CursorIndex })) }), State.ErrorMessage === undefined
                ? (_jsx(HintLine, { children: Options.Hint ?? "Use up/down. Press enter to select." }))
                : (_jsx(ErrorLine, { children: State.ErrorMessage }))] }));
}
function MultiSelectPromptView(Props) {
    const { Options, Completion } = Props;
    const [State, SetState] = useState(() => CreateMultiSelectPromptState({
        Choices: Options.Choices,
        InitialCursorIndex: Options.InitialCursorIndex,
        InitialSelectedIndexes: Options.InitialSelectedIndexes
    }));
    const SubmitEmpty = Options.SubmitEmpty ?? false;
    const HandleCommand = useCallback((Command) => {
        SetState((CurrentState) => {
            if (Command.Action === "Submit"
                && SubmitEmpty !== true
                && CurrentState.SelectedIndexes.size === 0) {
                return SetMultiSelectPromptError(CurrentState, "Select at least one option.");
            }
            return ReduceMultiSelectPromptState(CurrentState, Command, {
                PageSize: Options.PageSize,
                SubmitEmpty,
                Wrap: Options.Wrap
            });
        });
    }, [
        Options.PageSize,
        Options.Wrap,
        SubmitEmpty
    ]);
    useInputCommands(HandleCommand, {
        Active: State.Status === "Active",
        AllowTextInput: false
    });
    useEffect(() => {
        if (State.Status === "Cancelled") {
            Completion.Cancel();
            return;
        }
        if (State.Status !== "Submitted") {
            return;
        }
        const SubmittedChoices = State.SubmittedChoices ?? GetSelectedChoices(State);
        const SubmittedValues = SubmittedChoices.map((Choice) => Choice.Value);
        try {
            const ValidationMessage = Options.Validate?.(SubmittedValues, SubmittedChoices);
            if (ValidationMessage !== undefined) {
                SetState({
                    ...State,
                    ErrorMessage: ValidationMessage,
                    Status: "Active"
                });
                return;
            }
            Completion.Submit(SubmittedValues);
        }
        catch (Cause) {
            Completion.Fail(new PromptValidationError({
                Cause,
                Message: "Prompt validation threw an error.",
                Value: SubmittedValues
            }));
        }
    }, [
        Completion,
        Options,
        State
    ]);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(PromptLine, { Message: Options.Message ?? "", ...(Options.Optional !== undefined ? { Optional: Options.Optional } : {}), ...(Options.Required !== undefined ? { Required: Options.Required } : {}) }), _jsx(Box, { flexDirection: "column", marginLeft: 2, children: State.Choices.length === 0
                    ? (_jsx(ErrorLine, { children: "No choices are available." }))
                    : (_jsx(ChoiceList, { Choices: State.Choices, GetDescription: (Choice) => Choice.Description, GetLabel: (Choice, Index) => {
                            const Marker = State.SelectedIndexes.has(Index)
                                ? "◉"
                                : "○";
                            return `${Marker} ${Choice.Label}`;
                        }, IsCursor: (_Choice, Index) => Index === State.CursorIndex, IsDisabled: (Choice) => Choice.Disabled === true, IsSelected: (_Choice, Index) => State.SelectedIndexes.has(Index) })) }), State.ErrorMessage === undefined
                ? (_jsx(HintLine, { children: Options.Hint ?? "Use up/down, space to toggle, enter to submit." }))
                : (_jsx(ErrorLine, { children: State.ErrorMessage })), State.SelectedIndexes.size > 0
                ? (_jsxs(SuccessLine, { children: [State.SelectedIndexes.size, " selected"] }))
                : null] }));
}
const NormalizePromptRenderOptions = (Options) => {
    return {
        exitOnCtrlC: false,
        interactive: true,
        patchConsole: false,
        ...Options
    };
};
//# sourceMappingURL=Prompt.js.map