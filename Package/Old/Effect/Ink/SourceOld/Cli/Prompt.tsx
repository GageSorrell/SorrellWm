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

import {
    ChoiceList,
    ErrorLine,
    HintLine,
    PromptLine,
    StyledText,
    SuccessLine,
    TextInputLine,
    useTheme
} from "../Component.tsx";
import {
    type ConfirmPromptState,
    CreateConfirmPromptState,
    CreateMultiSelectPromptState,
    CreateSelectPromptState,
    CreateTextPromptState,
    GetSelectedChoices,
    type MultiSelectPromptState,
    type PromptChoice,
    ReduceConfirmPromptState,
    ReduceMultiSelectPromptState,
    ReduceSelectPromptState,
    ReduceTextPromptState,
    type SelectPromptState,
    SetMultiSelectPromptError,
    SetSelectPromptError,
    SetTextPromptError,
    type TextPromptState
} from "../State.ts";
import { type Context, Deferred, Effect } from "effect";
import type {
    InkInstance,
    InkRenderOptions,
    InkRenderer as InkRendererService
} from "../InkRenderer.ts";
import {
    type InputCommand,
    useInputCommands
} from "../Input.ts";
import {
    type JSX,
    type ReactNode,
    useCallback,
    useEffect,
    useState
} from "react";
import {
    type PromptError,
    PromptValidationError,
    promptCancelled
} from "../Error.ts";
import { Box } from "ink";
import { InkRenderer } from "../InkRenderer.ts";
import type { InkTheme } from "../Theme.ts";
import { RuntimeProvider } from "../React.ts";

export interface PromptRenderOptions
{
    readonly RenderOptions?: InkRenderOptions;
}

export interface BasePromptOptions extends PromptRenderOptions
{
    readonly Message: ReactNode;
    readonly Hint?: ReactNode;
    readonly Required?: boolean;
    readonly Optional?: boolean;
}

export interface TextPromptOptions extends BasePromptOptions
{
    readonly InitialValue?: string;
    readonly Placeholder?: string;
    readonly SubmitEmpty?: boolean;
    readonly Validate?: (Value: string) => string | undefined;
}

export interface PasswordPromptOptions extends TextPromptOptions
{
    readonly Mask?: string;
}

export interface ConfirmPromptOptions extends BasePromptOptions
{
    readonly InitialValue?: boolean;
}

export interface SelectPromptOptions<Value> extends BasePromptOptions
{
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number;
    readonly Wrap?: boolean;
    readonly PageSize?: number;
    readonly Validate?: (Value: Value, Choice: PromptChoice<Value>) => string | undefined;
}

export interface MultiSelectPromptOptions<Value> extends BasePromptOptions
{
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number;
    readonly InitialSelectedIndexes?: ReadonlyArray<number>;
    readonly Wrap?: boolean;
    readonly PageSize?: number;
    readonly SubmitEmpty?: boolean;
    readonly Validate?: (
        Values: ReadonlyArray<Value>,
        Choices: ReadonlyArray<PromptChoice<Value>>
    ) => string | undefined;
}

export interface PromptCompletion<A>
{
    readonly Submit: (Value: A) => void;
    readonly Cancel: () => void;
    readonly Fail: (Error: PromptError) => void;
}

export const RunPrompt = <A,>(
    MakeElement: (Completion: PromptCompletion<A>) => ReactNode,
    Options: PromptRenderOptions = {}
): Effect.Effect<A, PromptError, InkRendererService> =>
    Effect.scoped(
        Effect.gen(function* ()
        {
            const Renderer: InkRendererService = yield* InkRenderer;
            const RuntimeContext: Context.Context<InkRendererService> =
                yield* Effect.context<InkRendererService>();
            const Result: Deferred.Deferred<A, PromptError> =
                yield* Deferred.make<A, PromptError>();

            const Completion: PromptCompletion<A> =
                {
                    Submit: (Value: A) =>
                    {
                        Effect.runFork(
                            Deferred.succeed(
                                Result,
                                Value
                            )
                        );
                    },

                    Cancel: () =>
                    {
                        Effect.runFork(
                            Deferred.fail(
                                Result,
                                promptCancelled()
                            )
                        );
                    },

                    Fail: (Error: PromptError) =>
                    {
                        Effect.runFork(
                            Deferred.fail(
                                Result,
                                Error
                            )
                        );
                    }
                };

            const Element: JSX.Element = (
                <RuntimeProvider Context={ RuntimeContext as Context.Context<never> }>
                    { MakeElement(Completion) }
                </RuntimeProvider>
            );

            const Instance: InkInstance = yield* Renderer.Render(
                Element,
                NormalizePromptRenderOptions(Options.RenderOptions)
            );

            return yield* Deferred
                .await(Result)
                .pipe(
                    Effect.ensuring(
                        Instance.Unmount.pipe(
                            Effect.ignore
                        )
                    )
                );
        })
    );

export const TextPrompt = (
    Options: TextPromptOptions
): Effect.Effect<string, PromptError, InkRendererService> =>
    RunPrompt(
        (Completion: PromptCompletion<string>) => (
            <TextPromptView
                Completion={ Completion }
                Mask={ undefined }
                Options={ Options }
            />
        ),
        Options
    );

export const PasswordPrompt = (
    Options: PasswordPromptOptions
): Effect.Effect<string, PromptError, InkRendererService> =>
    RunPrompt(
        (Completion: PromptCompletion<string>) => (
            <TextPromptView
                Completion={ Completion }
                Mask={ Options.Mask ?? "•" }
                Options={ Options }
            />
        ),
        Options
    );

export const ConfirmPrompt = (
    Options: ConfirmPromptOptions
): Effect.Effect<boolean, PromptError, InkRendererService> =>
    RunPrompt(
        (Completion: PromptCompletion<boolean>) => (
            <ConfirmPromptView
                { ...{ Completion, Options } }
            />
        ),
        Options
    );

export const SelectPrompt = <Value,>(
    Options: SelectPromptOptions<Value>
): Effect.Effect<Value, PromptError, InkRendererService> =>
    RunPrompt(
        (Completion: PromptCompletion<Value>) => (
            <SelectPromptView
                { ...{ Completion, Options } }
            />
        ),
        Options
    );

export const MultiSelectPrompt = <Value,>(
    Options: MultiSelectPromptOptions<Value>
): Effect.Effect<ReadonlyArray<Value>, PromptError, InkRendererService> =>
    RunPrompt(
        (Completion: PromptCompletion<ReadonlyArray<Value>>) => (
            <MultiSelectPromptView
                { ...{ Completion, Options } }
            />
        ),
        Options
    );

export type FormPromptFields = Record<
    string,
    Effect.Effect<unknown, PromptError, InkRendererService>
>;

export type FormPromptResult<Fields extends FormPromptFields> =
    {
        readonly [Key in keyof Fields]: Effect.Success<Fields[Key]>;
    };

export const FormPrompt = <Fields extends FormPromptFields>(
    Fields: Fields
): Effect.Effect<FormPromptResult<Fields>, PromptError, InkRendererService> =>
    Effect.gen(function* ()
    {
        const Result: Record<string, unknown> = {};

        for (const FieldName of Object.keys(Fields))
        {
            Result[FieldName] = yield* Fields[FieldName] as Effect.Effect<
                unknown,
                PromptError,
                InkRendererService
            >;
        }

        return Result as FormPromptResult<Fields>;
    });

export const MakeChoice = <Value,>(
    Value: Value,
    Label: string,
    Options: {
        readonly Description?: string;
        readonly Disabled?: boolean;
        readonly Group?: string;
    } = {}
): PromptChoice<Value> =>
{
    return {
        Label,
        Value,
        ...Options
    };
};

interface TextPromptViewProps
{
    readonly Options: TextPromptOptions;
    readonly Mask: string | undefined;
    readonly Completion: PromptCompletion<string>;
}

function TextPromptView(
    Props: TextPromptViewProps
): ReactNode
{
    const {
        Options,
        Mask,
        Completion
    } = Props;

    const [ State, SetState ] = useState<TextPromptState>(() =>
        CreateTextPromptState(Options.InitialValue !== undefined
            ? { InitialValue: Options.InitialValue }
            : { }
        )
    );

    const SubmitEmpty: boolean = Options.SubmitEmpty ?? true;

    const HandleCommand: (Command: InputCommand) => void = useCallback(
        (Command: InputCommand) =>
        {
            SetState((CurrentState: TextPromptState) =>
            {
                if (
                    Command.Action === "Submit"
                    && SubmitEmpty !== true
                    && CurrentState.Value.length === 0
                )
                {
                    return SetTextPromptError(
                        CurrentState,
                        "Enter a value."
                    );
                }

                return ReduceTextPromptState(
                    CurrentState,
                    Command,
                    {
                        SubmitEmpty
                    }
                );
            });
        },
        [
            SubmitEmpty
        ]
    );

    useInputCommands(
        HandleCommand,
        {
            Active: State.Status === "Active",
            AllowTextInput: true
        }
    );

    useEffect(
        () =>
        {
            if (State.Status === "Cancelled")
            {
                Completion.Cancel();
                return;
            }

            if (State.Status !== "Submitted")
            {
                return;
            }

            try
            {
                const ValidationMessage: string | undefined = Options.Validate?.(State.Value);

                if (ValidationMessage !== undefined)
                {
                    SetState({
                        ...State,
                        Status: "Active",
                        ...(ValidationMessage !== undefined ? { ErrorMessage: ValidationMessage } : { })
                    });

                    return;
                }

                Completion.Submit(State.Value);
            }
            catch (Cause)
            {
                Completion.Fail(
                    new PromptValidationError({
                        Cause,
                        Message: "Prompt validation threw an error.",
                        Value: State.Value
                    })
                );
            }
        },
        [
            Completion,
            Options,
            State
        ]
    );

    return (
        <Box flexDirection="column">
            <PromptLine
                Message={ Options.Message ?? "" }
                { ...(Options.Optional !== undefined ? { Optional: Options.Optional } : { }) }
                { ...(Options.Required !== undefined ? { Required: Options.Required } : { }) }
            />
            <Box marginLeft={ 2 }>
                <TextInputLine
                    { ...(Options.Placeholder !== undefined ? { Placeholder: Options.Placeholder } : { }) }
                    { ...(State.CursorOffset !== undefined ? { CursorOffset: State.CursorOffset } : { }) }
                    { ...(Mask !== undefined ? { Mask } : { }) }
                    Focused={ State.Status === "Active" }
                    Value={ State.Value }
                />
            </Box>
            {State.ErrorMessage === undefined
                ? (
                    <HintLine>
                        {Options.Hint}
                    </HintLine>
                )
                : (
                    <ErrorLine>
                        {State.ErrorMessage}
                    </ErrorLine>
                )}
        </Box>
    );
}

interface ConfirmPromptViewProps
{
    readonly Options: ConfirmPromptOptions;
    readonly Completion: PromptCompletion<boolean>;
}

function ConfirmPromptView(
    Props: ConfirmPromptViewProps
): ReactNode
{
    const {
        Options,
        Completion
    } = Props;

    const Theme: InkTheme = useTheme();

    const [ State, SetState ] = useState<ConfirmPromptState>(() =>
        CreateConfirmPromptState(Options.InitialValue !== undefined
            ? { InitialValue: Options.InitialValue }
            : { }
        )
    );

    const HandleCommand: (Command: InputCommand) => void = useCallback(
        (Command: InputCommand) =>
        {
            SetState((CurrentState: ConfirmPromptState) =>
                ReduceConfirmPromptState(
                    CurrentState,
                    Command
                )
            );
        },
        []
    );

    useInputCommands(
        HandleCommand,
        {
            Active: State.Status === "Active",
            AllowTextInput: true
        }
    );

    useEffect(
        () =>
        {
            if (State.Status === "Cancelled")
            {
                Completion.Cancel();
                return;
            }

            if (State.Status === "Submitted")
            {
                Completion.Submit(State.Value);
            }
        },
        [
            Completion,
            State
        ]
    );

    return (
        <Box flexDirection="column">
            <PromptLine
                Message={ Options.Message ?? "" }
                { ...(Options.Optional !== undefined ? { Optional: Options.Optional } : { }) }
                { ...(Options.Required !== undefined ? { Required: Options.Required } : { }) }
            />
            <Box marginLeft={ 2 }>
                <StyledText
                    Style={ State.Value
                        ? Theme.Prompt.SelectedChoice
                        : Theme.Prompt.UnselectedChoice }
                >
                    Yes
                </StyledText>
                <StyledText Style={ Theme.Base.Muted }>
                    {" / "}
                </StyledText>
                <StyledText
                    Style={ !State.Value
                        ? Theme.Prompt.SelectedChoice
                        : Theme.Prompt.UnselectedChoice }
                >
                    No
                </StyledText>
            </Box>
            <HintLine>
                {Options.Hint ?? "Use left/right, y/n, or space. Press enter to confirm."}
            </HintLine>
        </Box>
    );
}

interface SelectPromptViewProps<Value>
{
    readonly Options: SelectPromptOptions<Value>;
    readonly Completion: PromptCompletion<Value>;
}

function SelectPromptView<Value>(
    Props: SelectPromptViewProps<Value>
): ReactNode
{
    const {
        Options,
        Completion
    } = Props;

    const [ State, SetState ] = useState<SelectPromptState<Value>>(() =>
        CreateSelectPromptState({
            Choices: Options.Choices,
            InitialCursorIndex: Options.InitialCursorIndex
        })
    );

    const HandleCommand: (Command: InputCommand) => void = useCallback(
        (Command: InputCommand) =>
        {
            SetState((CurrentState: SelectPromptState<Value>) =>
            {
                if (Command.Action === "Submit")
                {
                    const CurrentChoice: PromptChoice<Value> = CurrentState.Choices[CurrentState.CursorIndex];

                    if (
                        CurrentChoice === undefined
                        || CurrentChoice.Disabled === true
                    )
                    {
                        return SetSelectPromptError(
                            CurrentState,
                            "Select an enabled option."
                        );
                    }
                }

                return ReduceSelectPromptState(
                    CurrentState,
                    Command,
                    Options
                );
            });
        },
        [ Options ]
    );

    useInputCommands(
        HandleCommand,
        {
            Active: State.Status === "Active",
            AllowTextInput: false
        }
    );

    useEffect(
        () =>
        {
            if (State.Status === "Cancelled")
            {
                Completion.Cancel();
                return;
            }

            if (State.Status !== "Submitted")
            {
                return;
            }

            const SubmittedChoice: PromptChoice<Value> | undefined = State.SubmittedChoice;

            if (SubmittedChoice === undefined)
            {
                SetState({
                    ...State,
                    ErrorMessage: "No option was selected.",
                    Status: "Active"
                });

                return;
            }

            try
            {
                const ValidationMessage: string | undefined = Options.Validate?.(
                    SubmittedChoice.Value,
                    SubmittedChoice
                );

                if (ValidationMessage !== undefined)
                {
                    SetState({
                        ...State,
                        ErrorMessage: ValidationMessage,
                        Status: "Active"
                    });

                    return;
                }

                Completion.Submit(SubmittedChoice.Value);
            }
            catch (Cause)
            {
                Completion.Fail(
                    new PromptValidationError({
                        Cause,
                        Message: "Prompt validation threw an error.",
                        Value: SubmittedChoice.Value
                    })
                );
            }
        },
        [
            Completion,
            Options,
            State
        ]
    );

    return (
        <Box flexDirection="column">
            <PromptLine
                Message={ Options.Message ?? "" }
                { ...(Options.Optional !== undefined ? { Optional: Options.Optional } : { }) }
                { ...(Options.Required !== undefined ? { Required: Options.Required } : { }) }
            />
            <Box
                flexDirection="column"
                marginLeft={ 2 }>
                {State.Choices.length === 0
                    ? (
                        <ErrorLine>
                            No choices are available.
                        </ErrorLine>
                    )
                    : (
                        <ChoiceList
                            Choices={ State.Choices }
                            GetDescription={ (Choice: PromptChoice<Value>) => Choice.Description }
                            GetLabel={ (Choice: PromptChoice<Value>) => Choice.Label }
                            IsCursor={ (_Choice: PromptChoice<Value>, Index: number) =>
                                Index === State.CursorIndex }
                            IsDisabled={ (Choice: PromptChoice<Value>) => Choice.Disabled === true }
                            IsSelected={ (_Choice: PromptChoice<Value>, Index: number) =>
                                Index === State.CursorIndex }
                        />
                    )}
            </Box>
            {State.ErrorMessage === undefined
                ? (
                    <HintLine>
                        {Options.Hint ?? "Use up/down. Press enter to select."}
                    </HintLine>
                )
                : (
                    <ErrorLine>
                        {State.ErrorMessage}
                    </ErrorLine>
                )}
        </Box>
    );
}

interface MultiSelectPromptViewProps<Value>
{
    readonly Options: MultiSelectPromptOptions<Value>;
    readonly Completion: PromptCompletion<ReadonlyArray<Value>>;
}

function MultiSelectPromptView<Value>(
    Props: MultiSelectPromptViewProps<Value>
): ReactNode
{
    const {
        Options,
        Completion
    } = Props;

    const [ State, SetState ] = useState<MultiSelectPromptState<Value>>(() =>
        CreateMultiSelectPromptState({
            Choices: Options.Choices,
            InitialCursorIndex: Options.InitialCursorIndex,
            InitialSelectedIndexes: Options.InitialSelectedIndexes
        })
    );

    const SubmitEmpty: boolean = Options.SubmitEmpty ?? false;

    const HandleCommand: (Command: InputCommand) => void = useCallback(
        (Command: InputCommand) =>
        {
            SetState((CurrentState: MultiSelectPromptState<Value>) =>
            {
                if (
                    Command.Action === "Submit"
                    && SubmitEmpty !== true
                    && CurrentState.SelectedIndexes.size === 0
                )
                {
                    return SetMultiSelectPromptError(
                        CurrentState,
                        "Select at least one option."
                    );
                }

                return ReduceMultiSelectPromptState(
                    CurrentState,
                    Command,
                    {
                        PageSize: Options.PageSize,
                        SubmitEmpty,
                        Wrap: Options.Wrap
                    }
                );
            });
        },
        [
            Options.PageSize,
            Options.Wrap,
            SubmitEmpty
        ]
    );

    useInputCommands(
        HandleCommand,
        {
            Active: State.Status === "Active",
            AllowTextInput: false
        }
    );

    useEffect(
        () =>
        {
            if (State.Status === "Cancelled")
            {
                Completion.Cancel();
                return;
            }

            if (State.Status !== "Submitted")
            {
                return;
            }

            const SubmittedChoices: ReadonlyArray<PromptChoice<Value>> =
                State.SubmittedChoices ?? GetSelectedChoices(State);
            const SubmittedValues: Array<Value> = SubmittedChoices.map(
                (Choice: PromptChoice<Value>) => Choice.Value
            );

            try
            {
                const ValidationMessage: string | undefined = Options.Validate?.(
                    SubmittedValues,
                    SubmittedChoices
                );

                if (ValidationMessage !== undefined)
                {
                    SetState({
                        ...State,
                        ErrorMessage: ValidationMessage,
                        Status: "Active"
                    });

                    return;
                }

                Completion.Submit(SubmittedValues);
            }
            catch (Cause)
            {
                Completion.Fail(
                    new PromptValidationError({
                        Cause,
                        Message: "Prompt validation threw an error.",
                        Value: SubmittedValues
                    })
                );
            }
        },
        [
            Completion,
            Options,
            State
        ]
    );

    return (
        <Box flexDirection="column">
            <PromptLine
                Message={ Options.Message ?? "" }
                { ...(Options.Optional !== undefined ? { Optional: Options.Optional } : { }) }
                { ...(Options.Required !== undefined ? { Required: Options.Required } : { }) }
            />
            <Box
                flexDirection="column"
                marginLeft={ 2 }>
                {State.Choices.length === 0
                    ? (
                        <ErrorLine>
                            No choices are available.
                        </ErrorLine>
                    )
                    : (
                        <ChoiceList
                            Choices={ State.Choices }
                            GetDescription={ (Choice: PromptChoice<Value>) => Choice.Description }
                            GetLabel={ (Choice: PromptChoice<Value>, Index: number) =>
                            {
                                const Marker: "◉" | "○" = State.SelectedIndexes.has(Index)
                                    ? "◉"
                                    : "○";

                                return `${Marker} ${Choice.Label}`;
                            } }
                            IsCursor={ (_Choice: PromptChoice<Value>, Index: number) =>
                                Index === State.CursorIndex }
                            IsDisabled={ (Choice: PromptChoice<Value>) => Choice.Disabled === true }
                            IsSelected={ (_Choice: PromptChoice<Value>, Index: number) =>
                                State.SelectedIndexes.has(Index) }
                        />
                    )}
            </Box>
            {State.ErrorMessage === undefined
                ? (
                    <HintLine>
                        {Options.Hint ?? "Use up/down, space to toggle, enter to submit."}
                    </HintLine>
                )
                : (
                    <ErrorLine>
                        {State.ErrorMessage}
                    </ErrorLine>
                )}
            {State.SelectedIndexes.size > 0
                ? (
                    <SuccessLine>
                        {State.SelectedIndexes.size} selected
                    </SuccessLine>
                )
                : null}
        </Box>
    );
}

const NormalizePromptRenderOptions = (
    Options: InkRenderOptions | undefined
): InkRenderOptions =>
{
    return {
        exitOnCtrlC: false,
        interactive: true,
        patchConsole: false,
        ...Options
    };
};

