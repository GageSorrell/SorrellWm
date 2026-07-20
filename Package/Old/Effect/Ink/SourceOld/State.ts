/**
 * Manage `ink` state with `effect`.
 *
 * @module @sorrell/effect-ink/State
 */

/**
 * @file      State.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    DeleteBackwardAtOffset,
    DeleteForwardAtOffset,
    InsertTextAtOffset,
    MoveIndexDown,
    MoveIndexUp,
    MoveOffsetEnd,
    MoveOffsetHome,
    MoveOffsetLeft,
    MoveOffsetRight
} from "./Input.js";
import type { InputCommand } from "./Input.js";

export type PromptStatus =
    | "Active"
    | "Submitted"
    | "Cancelled";

export interface TextPromptState
{
    readonly Status: PromptStatus;
    readonly Value: string;
    readonly CursorOffset: number;
    readonly ErrorMessage?: string;
}

export interface TextPromptStateOptions
{
    readonly InitialValue?: string;
    readonly InitialCursorOffset?: number;
    readonly ErrorMessage?: string;
}

export interface TextPromptReducerOptions
{
    readonly SubmitEmpty?: boolean;
}

export const CreateTextPromptState = (
    Options: TextPromptStateOptions = {}
): TextPromptState =>
{
    const Value: string = Options.InitialValue ?? "";

    return {
        CursorOffset: Clamp(
            Options.InitialCursorOffset ?? CharacterLength(Value),
            0,
            CharacterLength(Value)
        ),
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : { }),
        Status: "Active",
        Value
    };
};

export const ReduceTextPromptState = (
    State: TextPromptState,
    Command: InputCommand,
    Options: TextPromptReducerOptions = {}
): TextPromptState =>
{
    if (State.Status !== "Active")
    {
        return State;
    }

    switch (Command.Action)
    {
        case "Submit":
        {
            if (
                State.Value.length === 0
                && Options.SubmitEmpty !== true
            )
            {
                return State;
            }

            return {
                ...State,
                Status: "Submitted"
            };
        }

        case "Cancel":
        {
            return {
                ...State,
                Status: "Cancelled"
            };
        }

        case "InsertText":
        {
            if (Command.Text === undefined)
            {
                return State;
            }

            const NextValue: string = InsertTextAtOffset(
                State.Value,
                Command.Text,
                State.CursorOffset
            );

            return {
                ...State,
                CursorOffset: State.CursorOffset + CharacterLength(Command.Text),
                Value: NextValue
            };
        }

        case "DeleteBackward":
        {
            const NextValue: string = DeleteBackwardAtOffset(
                State.Value,
                State.CursorOffset
            );

            return {
                ...State,
                CursorOffset: MoveOffsetLeft(State.CursorOffset),
                Value: NextValue
            };
        }

        case "DeleteForward":
        {
            return {
                ...State,
                Value: DeleteForwardAtOffset(
                    State.Value,
                    State.CursorOffset
                )
            };
        }

        case "MoveLeft":
        {
            return {
                ...State,
                CursorOffset: MoveOffsetLeft(State.CursorOffset)
            };
        }

        case "MoveRight":
        {
            return {
                ...State,
                CursorOffset: MoveOffsetRight(
                    State.Value,
                    State.CursorOffset
                )
            };
        }

        case "MoveHome":
        {
            return {
                ...State,
                CursorOffset: MoveOffsetHome()
            };
        }

        case "MoveEnd":
        {
            return {
                ...State,
                CursorOffset: MoveOffsetEnd(State.Value)
            };
        }

        case "Clear":
        {
            return {
                ...State,
                CursorOffset: 0,
                Value: ""
            };
        }

        default:
        {
            return State;
        }
    }
};

export const SetTextPromptError = (
    State: TextPromptState,
    ErrorMessage: string | undefined
): TextPromptState =>
{
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : { })
    };
};

export interface ConfirmPromptState
{
    readonly Status: PromptStatus;
    readonly Value: boolean;
    readonly ErrorMessage?: string;
}

export interface ConfirmPromptStateOptions
{
    readonly InitialValue?: boolean;
    readonly ErrorMessage?: string;
}

export const CreateConfirmPromptState = (
    Options: ConfirmPromptStateOptions = { }
): ConfirmPromptState =>
{
    return {
        Status: "Active",
        Value: Options.InitialValue ?? false,
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : { })
    };
};

export const ReduceConfirmPromptState = (
    State: ConfirmPromptState,
    Command: InputCommand
): ConfirmPromptState =>
{
    if (State.Status !== "Active")
    {
        return State;
    }

    switch (Command.Action)
    {
        case "Submit":
        {
            return {
                ...State,
                Status: "Submitted"
            };
        }

        case "Cancel":
        {
            return {
                ...State,
                Status: "Cancelled"
            };
        }

        case "Toggle":
        {
            return {
                ...State,
                Value: !State.Value
            };
        }

        case "MoveLeft":
        {
            return {
                ...State,
                Value: false
            };
        }

        case "MoveRight":
        {
            return {
                ...State,
                Value: true
            };
        }

        case "InsertText":
        {
            if (Command.Text === undefined)
            {
                return State;
            }

            const NormalizedText: string = Command.Text.toLowerCase();

            if (NormalizedText === "y")
            {
                return {
                    ...State,
                    Value: true
                };
            }

            if (NormalizedText === "n")
            {
                return {
                    ...State,
                    Value: false
                };
            }

            return State;
        }

        default:
        {
            return State;
        }
    }
};

export const SetConfirmPromptError = (
    State: ConfirmPromptState,
    ErrorMessage: string | undefined
): ConfirmPromptState =>
{
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : { })
    };
};

export interface PromptChoice<Value>
{
    readonly Value: Value;
    readonly Label: string;
    readonly Description?: string;
    readonly Disabled?: boolean;
    readonly Group?: string;
}

export interface SelectPromptState<Value>
{
    readonly Status: PromptStatus;
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly CursorIndex: number;
    readonly SubmittedChoice?: PromptChoice<Value>;
    readonly ErrorMessage?: string;
}

export interface SelectPromptStateOptions<Value>
{
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number | undefined;
    readonly ErrorMessage?: string | undefined;
}

export interface SelectPromptReducerOptions
{
    readonly Wrap?: boolean | undefined;
    readonly PageSize?: number | undefined;
}

export const CreateSelectPromptState = <Value>(
    Options: SelectPromptStateOptions<Value>
): SelectPromptState<Value> =>
{
    const InitialCursorIndex: number = NormalizeInitialChoiceIndex(
        Options.Choices,
        Options.InitialCursorIndex
    );

    return {
        Choices: Options.Choices,
        CursorIndex: InitialCursorIndex,
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : { }),
        Status: "Active"
    };
};

export const ReduceSelectPromptState = <Value>(
    State: SelectPromptState<Value>,
    Command: InputCommand,
    Options: SelectPromptReducerOptions = { }
): SelectPromptState<Value> =>
{
    if (State.Status !== "Active")
    {
        return State;
    }

    const Wrap: boolean = Options.Wrap ?? true;
    const PageSize: number = Options.PageSize ?? 5;

    switch (Command.Action)
    {
        case "Submit":
        {
            const CurrentChoice: PromptChoice<Value> = State.Choices[State.CursorIndex];

            if (
                CurrentChoice === undefined
                || CurrentChoice.Disabled === true
            )
            {
                return State;
            }

            return {
                ...State,
                Status: "Submitted",
                SubmittedChoice: CurrentChoice
            };
        }

        case "Cancel":
        {
            return {
                ...State,
                Status: "Cancelled"
            };
        }

        case "MoveUp":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursor(
                    State.Choices,
                    State.CursorIndex,
                    -1,
                    Wrap
                )
            };
        }

        case "MoveDown":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursor(
                    State.Choices,
                    State.CursorIndex,
                    1,
                    Wrap
                )
            };
        }

        case "PageUp":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursorByPage(
                    State.Choices,
                    State.CursorIndex,
                    -PageSize,
                    Wrap
                )
            };
        }

        case "PageDown":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursorByPage(
                    State.Choices,
                    State.CursorIndex,
                    PageSize,
                    Wrap
                )
            };
        }

        case "MoveHome":
        {
            return {
                ...State,
                CursorIndex: FindFirstEnabledChoiceIndex(State.Choices)
            };
        }

        case "MoveEnd":
        {
            return {
                ...State,
                CursorIndex: FindLastEnabledChoiceIndex(State.Choices)
            };
        }

        default:
        {
            return State;
        }
    }
};

export const SetSelectPromptError = <Value>(
    State: SelectPromptState<Value>,
    ErrorMessage: string | undefined
): SelectPromptState<Value> =>
{
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : { })
    };
};

export interface MultiSelectPromptState<Value>
{
    readonly Status: PromptStatus;
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly CursorIndex: number;
    readonly SelectedIndexes: ReadonlySet<number>;
    readonly SubmittedChoices?: ReadonlyArray<PromptChoice<Value>> | undefined;
    readonly ErrorMessage?: string | undefined;
}

export interface MultiSelectPromptStateOptions<Value>
{
    readonly Choices: ReadonlyArray<PromptChoice<Value>>;
    readonly InitialCursorIndex?: number | undefined;
    readonly InitialSelectedIndexes?: ReadonlyArray<number> | undefined;
    readonly ErrorMessage?: string | undefined;
}

export interface MultiSelectPromptReducerOptions
{
    readonly Wrap?: boolean | undefined;
    readonly PageSize?: number | undefined;
    readonly SubmitEmpty?: boolean | undefined;
}

export const CreateMultiSelectPromptState = <Value>(
    Options: MultiSelectPromptStateOptions<Value>
): MultiSelectPromptState<Value> =>
{
    const InitialCursorIndex: number = NormalizeInitialChoiceIndex(
        Options.Choices,
        Options.InitialCursorIndex
    );

    const SelectedIndexes: Set<number> = new Set<number>();

    for (const Index of Options.InitialSelectedIndexes ?? [])
    {
        const Choice: PromptChoice<Value> = Options.Choices[Index];

        if (
            Choice !== undefined
            && Choice.Disabled !== true
        )
        {
            SelectedIndexes.add(Index);
        }
    }

    return {
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : { }),
        Choices: Options.Choices,
        CursorIndex: InitialCursorIndex,
        SelectedIndexes,
        Status: "Active"
    };
};

export const ReduceMultiSelectPromptState = <Value>(
    State: MultiSelectPromptState<Value>,
    Command: InputCommand,
    Options: MultiSelectPromptReducerOptions = {}
): MultiSelectPromptState<Value> =>
{
    if (State.Status !== "Active")
    {
        return State;
    }

    const Wrap: boolean = Options.Wrap ?? true;
    const PageSize: number = Options.PageSize ?? 5;

    switch (Command.Action)
    {
        case "Submit":
        {
            if (
                State.SelectedIndexes.size === 0
                && Options.SubmitEmpty !== true
            )
            {
                return State;
            }

            return {
                ...State,
                Status: "Submitted",
                SubmittedChoices: GetSelectedChoices(State)
            };
        }

        case "Cancel":
        {
            return {
                ...State,
                Status: "Cancelled"
            };
        }

        case "Toggle":
        {
            return ToggleMultiSelectChoice(State);
        }

        case "MoveUp":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursor(
                    State.Choices,
                    State.CursorIndex,
                    -1,
                    Wrap
                )
            };
        }

        case "MoveDown":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursor(
                    State.Choices,
                    State.CursorIndex,
                    1,
                    Wrap
                )
            };
        }

        case "PageUp":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursorByPage(
                    State.Choices,
                    State.CursorIndex,
                    -PageSize,
                    Wrap
                )
            };
        }

        case "PageDown":
        {
            return {
                ...State,
                CursorIndex: MoveChoiceCursorByPage(
                    State.Choices,
                    State.CursorIndex,
                    PageSize,
                    Wrap
                )
            };
        }

        case "MoveHome":
        {
            return {
                ...State,
                CursorIndex: FindFirstEnabledChoiceIndex(State.Choices)
            };
        }

        case "MoveEnd":
        {
            return {
                ...State,
                CursorIndex: FindLastEnabledChoiceIndex(State.Choices)
            };
        }

        default:
        {
            return State;
        }
    }
};

export const ToggleMultiSelectChoice = <Value>(
    State: MultiSelectPromptState<Value>
): MultiSelectPromptState<Value> =>
{
    const CurrentChoice: PromptChoice<Value> = State.Choices[State.CursorIndex];

    if (
        CurrentChoice === undefined
        || CurrentChoice.Disabled === true
    )
    {
        return State;
    }

    const SelectedIndexes: Set<number> = new Set(State.SelectedIndexes);

    if (SelectedIndexes.has(State.CursorIndex))
    {
        SelectedIndexes.delete(State.CursorIndex);
    }
    else
    {
        SelectedIndexes.add(State.CursorIndex);
    }

    return {
        ...State,
        SelectedIndexes
    };
};

export const SetMultiSelectPromptError = <Value>(
    State: MultiSelectPromptState<Value>,
    ErrorMessage: string | undefined
): MultiSelectPromptState<Value> =>
{
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : { })
    };
};

export const GetSelectedChoices = <Value>(
    State: MultiSelectPromptState<Value>
): ReadonlyArray<PromptChoice<Value>> =>
{
    return State.Choices.filter((_Choice: PromptChoice<Value>, Index: number) =>
    {
        return State.SelectedIndexes.has(Index);
    });
};

export interface FormFieldState<Name extends string>
{
    readonly Name: Name;
    readonly Label: string;
    readonly Completed: boolean;
    readonly Disabled?: boolean;
    readonly ErrorMessage?: string;
}

export interface FormPromptState<Name extends string>
{
    readonly Status: PromptStatus;
    readonly Fields: ReadonlyArray<FormFieldState<Name>>;
    readonly ActiveFieldIndex: number;
    readonly ErrorMessage?: string;
}

export interface FormPromptStateOptions<Name extends string>
{
    readonly Fields: ReadonlyArray<FormFieldState<Name>>;
    readonly InitialActiveFieldIndex?: number;
    readonly ErrorMessage?: string;
}

export interface FormPromptReducerOptions
{
    readonly Wrap?: boolean;
}

export const CreateFormPromptState = <Name extends string>(
    Options: FormPromptStateOptions<Name>
): FormPromptState<Name> =>
{
    const ActiveFieldIndex: number = NormalizeInitialFieldIndex(
        Options.Fields,
        Options.InitialActiveFieldIndex
    );

    return {
        ActiveFieldIndex,
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : { }),
        Fields: Options.Fields,
        Status: "Active"
    };
};

export const ReduceFormPromptState = <Name extends string>(
    State: FormPromptState<Name>,
    Command: InputCommand,
    Options: FormPromptReducerOptions = {}
): FormPromptState<Name> =>
{
    if (State.Status !== "Active")
    {
        return State;
    }

    const Wrap: boolean = Options.Wrap ?? true;

    switch (Command.Action)
    {
        case "Submit":
        {
            if (!AreAllFormFieldsCompleted(State))
            {
                return State;
            }

            return {
                ...State,
                Status: "Submitted"
            };
        }

        case "Cancel":
        {
            return {
                ...State,
                Status: "Cancelled"
            };
        }

        case "MoveUp":
        {
            return {
                ...State,
                ActiveFieldIndex: MoveFieldCursor(
                    State.Fields,
                    State.ActiveFieldIndex,
                    -1,
                    Wrap
                )
            };
        }

        case "MoveDown":
        {
            return {
                ...State,
                ActiveFieldIndex: MoveFieldCursor(
                    State.Fields,
                    State.ActiveFieldIndex,
                    1,
                    Wrap
                )
            };
        }

        case "MoveHome":
        {
            return {
                ...State,
                ActiveFieldIndex: FindFirstEnabledFieldIndex(State.Fields)
            };
        }

        case "MoveEnd":
        {
            return {
                ...State,
                ActiveFieldIndex: FindLastEnabledFieldIndex(State.Fields)
            };
        }

        default:
        {
            return State;
        }
    }
};

export const SetFormPromptError = <Name extends string>(
    State: FormPromptState<Name>,
    ErrorMessage: string | undefined
): FormPromptState<Name> =>
{
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : { })
    };
};

export const SetFormFieldCompleted = <Name extends string>(
    State: FormPromptState<Name>,
    Name: Name,
    Completed: boolean
): FormPromptState<Name> =>
{
    return {
        ...State,
        Fields: State.Fields.map((Field: FormFieldState<Name>) =>
        {
            if (Field.Name !== Name)
            {
                return Field;
            }

            return {
                ...Field,
                Completed,
                ...(Completed ? { ErrorMessage: Field.ErrorMessage } : { })
            };
        })
    };
};

export const SetFormFieldError = <Name extends string>(
    State: FormPromptState<Name>,
    Name: Name,
    ErrorMessage: string | undefined
): FormPromptState<Name> =>
{
    return {
        ...State,
        Fields: State.Fields.map((Field: FormFieldState<Name>) =>
        {
            if (Field.Name !== Name)
            {
                return Field;
            }

            return {
                ...Field,
                ...(ErrorMessage !== undefined ? { ErrorMessage } : { })
            };
        })
    };
};

export const AreAllFormFieldsCompleted = <Name extends string>(
    State: FormPromptState<Name>
): boolean =>
{
    return State.Fields.every((Field: FormFieldState<Name>) =>
    {
        return Field.Disabled === true
            || Field.Completed;
    });
};

export const IsActive = (
    Status: PromptStatus
): boolean =>
{
    return Status === "Active";
};

export const IsSubmitted = (
    Status: PromptStatus
): boolean =>
{
    return Status === "Submitted";
};

export const IsCancelled = (
    Status: PromptStatus
): boolean =>
{
    return Status === "Cancelled";
};

export const IsChoiceEnabled = <Value>(
    Choice: PromptChoice<Value> | undefined
): boolean =>
{
    return Choice !== undefined
        && Choice.Disabled !== true;
};

export const FindFirstEnabledChoiceIndex = <Value>(
    Choices: ReadonlyArray<PromptChoice<Value>>
): number =>
{
    const Index: number = Choices.findIndex(IsChoiceEnabled);

    return Index < 0
        ? 0
        : Index;
};

export const FindLastEnabledChoiceIndex = <Value>(
    Choices: ReadonlyArray<PromptChoice<Value>>
): number =>
{
    for (let Index: number = Choices.length - 1; Index >= 0; Index--)
    {
        if (IsChoiceEnabled(Choices[Index]))
        {
            return Index;
        }
    }

    return 0;
};

export const MoveChoiceCursor = <Value>(
    Choices: ReadonlyArray<PromptChoice<Value>>,
    CurrentIndex: number,
    Step: number,
    Wrap: boolean
): number =>
{
    if (Choices.length === 0)
    {
        return 0;
    }

    if (!Choices.some(IsChoiceEnabled))
    {
        return Clamp(
            CurrentIndex,
            0,
            Choices.length - 1
        );
    }

    let NextIndex: number = Clamp(
        CurrentIndex,
        0,
        Choices.length - 1
    );

    for (let Attempt: number = 0; Attempt < Choices.length; Attempt++)
    {
        NextIndex = Step < 0
            ? MoveIndexUp(
                NextIndex,
                Choices.length,
                Wrap
            )
            : MoveIndexDown(
                NextIndex,
                Choices.length,
                Wrap
            );

        if (IsChoiceEnabled(Choices[NextIndex]))
        {
            return NextIndex;
        }
    }

    return CurrentIndex;
};

export const MoveChoiceCursorByPage = <Value>(
    Choices: ReadonlyArray<PromptChoice<Value>>,
    CurrentIndex: number,
    Step: number,
    Wrap: boolean
): number =>
{
    if (Choices.length === 0)
    {
        return 0;
    }

    if (!Choices.some(IsChoiceEnabled))
    {
        return Clamp(
            CurrentIndex,
            0,
            Choices.length - 1
        );
    }

    const AbsoluteStep: number = Math.max(
        1,
        Math.abs(Step)
    );

    let NextIndex: number = Clamp(
        CurrentIndex,
        0,
        Choices.length - 1
    );

    for (let Count: number = 0; Count < AbsoluteStep; Count++)
    {
        NextIndex = MoveChoiceCursor(
            Choices,
            NextIndex,
            Step < 0 ? -1 : 1,
            Wrap
        );
    }

    return NextIndex;
};

export const FindFirstEnabledFieldIndex = <Name extends string>(
    Fields: ReadonlyArray<FormFieldState<Name>>
): number =>
{
    const Index: number = Fields.findIndex((Field: FormFieldState<Name>) =>
    {
        return Field.Disabled !== true;
    });

    return Index < 0
        ? 0
        : Index;
};

export const FindLastEnabledFieldIndex = <Name extends string>(
    Fields: ReadonlyArray<FormFieldState<Name>>
): number =>
{
    for (let Index: number = Fields.length - 1; Index >= 0; Index--)
    {
        if (Fields[Index]?.Disabled !== true)
        {
            return Index;
        }
    }

    return 0;
};

export const MoveFieldCursor = <Name extends string>(
    Fields: ReadonlyArray<FormFieldState<Name>>,
    CurrentIndex: number,
    Step: number,
    Wrap: boolean
): number =>
{
    if (Fields.length === 0)
    {
        return 0;
    }

    if (
        !Fields.some((Field: FormFieldState<Name>) =>
        {
            return Field.Disabled !== true;
        })
    )
    {
        return Clamp(
            CurrentIndex,
            0,
            Fields.length - 1
        );
    }

    let NextIndex: number = Clamp(
        CurrentIndex,
        0,
        Fields.length - 1
    );

    for (let Attempt: number = 0; Attempt < Fields.length; Attempt++)
    {
        NextIndex = Step < 0
            ? MoveIndexUp(
                NextIndex,
                Fields.length,
                Wrap
            )
            : MoveIndexDown(
                NextIndex,
                Fields.length,
                Wrap
            );

        if (Fields[NextIndex]?.Disabled !== true)
        {
            return NextIndex;
        }
    }

    return CurrentIndex;
};

const NormalizeInitialChoiceIndex = <Value>(
    Choices: ReadonlyArray<PromptChoice<Value>>,
    InitialIndex: number | undefined
): number =>
{
    if (Choices.length === 0)
    {
        return 0;
    }

    if (
        InitialIndex !== undefined
        && IsChoiceEnabled(Choices[InitialIndex])
    )
    {
        return InitialIndex;
    }

    return FindFirstEnabledChoiceIndex(Choices);
};

const NormalizeInitialFieldIndex = <Name extends string>(
    Fields: ReadonlyArray<FormFieldState<Name>>,
    InitialIndex: number | undefined
): number =>
{
    if (Fields.length === 0)
    {
        return 0;
    }

    if (
        InitialIndex !== undefined
        && Fields[InitialIndex]?.Disabled !== true
    )
    {
        return InitialIndex;
    }

    return FindFirstEnabledFieldIndex(Fields);
};

const CharacterLength = (
    Value: string
): number =>
{
    return Array.from(Value).length;
};

const Clamp = (
    Value: number,
    Minimum: number,
    Maximum: number
): number =>
{
    return Math.min(
        Math.max(Value, Minimum),
        Maximum
    );
};
