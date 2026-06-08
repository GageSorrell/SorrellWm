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
import { DeleteBackwardAtOffset, DeleteForwardAtOffset, InsertTextAtOffset, MoveIndexDown, MoveIndexUp, MoveOffsetEnd, MoveOffsetHome, MoveOffsetLeft, MoveOffsetRight } from "./Input.js";
export const CreateTextPromptState = (Options = {}) => {
    const Value = Options.InitialValue ?? "";
    return {
        CursorOffset: Clamp(Options.InitialCursorOffset ?? CharacterLength(Value), 0, CharacterLength(Value)),
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : {}),
        Status: "Active",
        Value
    };
};
export const ReduceTextPromptState = (State, Command, Options = {}) => {
    if (State.Status !== "Active") {
        return State;
    }
    switch (Command.Action) {
        case "Submit":
            {
                if (State.Value.length === 0
                    && Options.SubmitEmpty !== true) {
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
                if (Command.Text === undefined) {
                    return State;
                }
                const NextValue = InsertTextAtOffset(State.Value, Command.Text, State.CursorOffset);
                return {
                    ...State,
                    CursorOffset: State.CursorOffset + CharacterLength(Command.Text),
                    Value: NextValue
                };
            }
        case "DeleteBackward":
            {
                const NextValue = DeleteBackwardAtOffset(State.Value, State.CursorOffset);
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
                    Value: DeleteForwardAtOffset(State.Value, State.CursorOffset)
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
                    CursorOffset: MoveOffsetRight(State.Value, State.CursorOffset)
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
export const SetTextPromptError = (State, ErrorMessage) => {
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : {})
    };
};
export const CreateConfirmPromptState = (Options = {}) => {
    return {
        Status: "Active",
        Value: Options.InitialValue ?? false,
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : {})
    };
};
export const ReduceConfirmPromptState = (State, Command) => {
    if (State.Status !== "Active") {
        return State;
    }
    switch (Command.Action) {
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
                if (Command.Text === undefined) {
                    return State;
                }
                const NormalizedText = Command.Text.toLowerCase();
                if (NormalizedText === "y") {
                    return {
                        ...State,
                        Value: true
                    };
                }
                if (NormalizedText === "n") {
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
export const SetConfirmPromptError = (State, ErrorMessage) => {
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : {})
    };
};
export const CreateSelectPromptState = (Options) => {
    const InitialCursorIndex = NormalizeInitialChoiceIndex(Options.Choices, Options.InitialCursorIndex);
    return {
        Choices: Options.Choices,
        CursorIndex: InitialCursorIndex,
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : {}),
        Status: "Active"
    };
};
export const ReduceSelectPromptState = (State, Command, Options = {}) => {
    if (State.Status !== "Active") {
        return State;
    }
    const Wrap = Options.Wrap ?? true;
    const PageSize = Options.PageSize ?? 5;
    switch (Command.Action) {
        case "Submit":
            {
                const CurrentChoice = State.Choices[State.CursorIndex];
                if (CurrentChoice === undefined
                    || CurrentChoice.Disabled === true) {
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
                    CursorIndex: MoveChoiceCursor(State.Choices, State.CursorIndex, -1, Wrap)
                };
            }
        case "MoveDown":
            {
                return {
                    ...State,
                    CursorIndex: MoveChoiceCursor(State.Choices, State.CursorIndex, 1, Wrap)
                };
            }
        case "PageUp":
            {
                return {
                    ...State,
                    CursorIndex: MoveChoiceCursorByPage(State.Choices, State.CursorIndex, -PageSize, Wrap)
                };
            }
        case "PageDown":
            {
                return {
                    ...State,
                    CursorIndex: MoveChoiceCursorByPage(State.Choices, State.CursorIndex, PageSize, Wrap)
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
export const SetSelectPromptError = (State, ErrorMessage) => {
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : {})
    };
};
export const CreateMultiSelectPromptState = (Options) => {
    const InitialCursorIndex = NormalizeInitialChoiceIndex(Options.Choices, Options.InitialCursorIndex);
    const SelectedIndexes = new Set();
    for (const Index of Options.InitialSelectedIndexes ?? []) {
        const Choice = Options.Choices[Index];
        if (Choice !== undefined
            && Choice.Disabled !== true) {
            SelectedIndexes.add(Index);
        }
    }
    return {
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : {}),
        Choices: Options.Choices,
        CursorIndex: InitialCursorIndex,
        SelectedIndexes,
        Status: "Active"
    };
};
export const ReduceMultiSelectPromptState = (State, Command, Options = {}) => {
    if (State.Status !== "Active") {
        return State;
    }
    const Wrap = Options.Wrap ?? true;
    const PageSize = Options.PageSize ?? 5;
    switch (Command.Action) {
        case "Submit":
            {
                if (State.SelectedIndexes.size === 0
                    && Options.SubmitEmpty !== true) {
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
                    CursorIndex: MoveChoiceCursor(State.Choices, State.CursorIndex, -1, Wrap)
                };
            }
        case "MoveDown":
            {
                return {
                    ...State,
                    CursorIndex: MoveChoiceCursor(State.Choices, State.CursorIndex, 1, Wrap)
                };
            }
        case "PageUp":
            {
                return {
                    ...State,
                    CursorIndex: MoveChoiceCursorByPage(State.Choices, State.CursorIndex, -PageSize, Wrap)
                };
            }
        case "PageDown":
            {
                return {
                    ...State,
                    CursorIndex: MoveChoiceCursorByPage(State.Choices, State.CursorIndex, PageSize, Wrap)
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
export const ToggleMultiSelectChoice = (State) => {
    const CurrentChoice = State.Choices[State.CursorIndex];
    if (CurrentChoice === undefined
        || CurrentChoice.Disabled === true) {
        return State;
    }
    const SelectedIndexes = new Set(State.SelectedIndexes);
    if (SelectedIndexes.has(State.CursorIndex)) {
        SelectedIndexes.delete(State.CursorIndex);
    }
    else {
        SelectedIndexes.add(State.CursorIndex);
    }
    return {
        ...State,
        SelectedIndexes
    };
};
export const SetMultiSelectPromptError = (State, ErrorMessage) => {
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : {})
    };
};
export const GetSelectedChoices = (State) => {
    return State.Choices.filter((_Choice, Index) => {
        return State.SelectedIndexes.has(Index);
    });
};
export const CreateFormPromptState = (Options) => {
    const ActiveFieldIndex = NormalizeInitialFieldIndex(Options.Fields, Options.InitialActiveFieldIndex);
    return {
        ActiveFieldIndex,
        ...((Options.ErrorMessage !== undefined) ? { ErrorMessage: Options.ErrorMessage } : {}),
        Fields: Options.Fields,
        Status: "Active"
    };
};
export const ReduceFormPromptState = (State, Command, Options = {}) => {
    if (State.Status !== "Active") {
        return State;
    }
    const Wrap = Options.Wrap ?? true;
    switch (Command.Action) {
        case "Submit":
            {
                if (!AreAllFormFieldsCompleted(State)) {
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
                    ActiveFieldIndex: MoveFieldCursor(State.Fields, State.ActiveFieldIndex, -1, Wrap)
                };
            }
        case "MoveDown":
            {
                return {
                    ...State,
                    ActiveFieldIndex: MoveFieldCursor(State.Fields, State.ActiveFieldIndex, 1, Wrap)
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
export const SetFormPromptError = (State, ErrorMessage) => {
    return {
        ...State,
        ...((ErrorMessage !== undefined) ? { ErrorMessage } : {})
    };
};
export const SetFormFieldCompleted = (State, Name, Completed) => {
    return {
        ...State,
        Fields: State.Fields.map((Field) => {
            if (Field.Name !== Name) {
                return Field;
            }
            return {
                ...Field,
                Completed,
                ...(Completed ? { ErrorMessage: Field.ErrorMessage } : {})
            };
        })
    };
};
export const SetFormFieldError = (State, Name, ErrorMessage) => {
    return {
        ...State,
        Fields: State.Fields.map((Field) => {
            if (Field.Name !== Name) {
                return Field;
            }
            return {
                ...Field,
                ...(ErrorMessage !== undefined ? { ErrorMessage } : {})
            };
        })
    };
};
export const AreAllFormFieldsCompleted = (State) => {
    return State.Fields.every((Field) => {
        return Field.Disabled === true
            || Field.Completed;
    });
};
export const IsActive = (Status) => {
    return Status === "Active";
};
export const IsSubmitted = (Status) => {
    return Status === "Submitted";
};
export const IsCancelled = (Status) => {
    return Status === "Cancelled";
};
export const IsChoiceEnabled = (Choice) => {
    return Choice !== undefined
        && Choice.Disabled !== true;
};
export const FindFirstEnabledChoiceIndex = (Choices) => {
    const Index = Choices.findIndex(IsChoiceEnabled);
    return Index < 0
        ? 0
        : Index;
};
export const FindLastEnabledChoiceIndex = (Choices) => {
    for (let Index = Choices.length - 1; Index >= 0; Index--) {
        if (IsChoiceEnabled(Choices[Index])) {
            return Index;
        }
    }
    return 0;
};
export const MoveChoiceCursor = (Choices, CurrentIndex, Step, Wrap) => {
    if (Choices.length === 0) {
        return 0;
    }
    if (!Choices.some(IsChoiceEnabled)) {
        return Clamp(CurrentIndex, 0, Choices.length - 1);
    }
    let NextIndex = Clamp(CurrentIndex, 0, Choices.length - 1);
    for (let Attempt = 0; Attempt < Choices.length; Attempt++) {
        NextIndex = Step < 0
            ? MoveIndexUp(NextIndex, Choices.length, Wrap)
            : MoveIndexDown(NextIndex, Choices.length, Wrap);
        if (IsChoiceEnabled(Choices[NextIndex])) {
            return NextIndex;
        }
    }
    return CurrentIndex;
};
export const MoveChoiceCursorByPage = (Choices, CurrentIndex, Step, Wrap) => {
    if (Choices.length === 0) {
        return 0;
    }
    if (!Choices.some(IsChoiceEnabled)) {
        return Clamp(CurrentIndex, 0, Choices.length - 1);
    }
    const AbsoluteStep = Math.max(1, Math.abs(Step));
    let NextIndex = Clamp(CurrentIndex, 0, Choices.length - 1);
    for (let Count = 0; Count < AbsoluteStep; Count++) {
        NextIndex = MoveChoiceCursor(Choices, NextIndex, Step < 0 ? -1 : 1, Wrap);
    }
    return NextIndex;
};
export const FindFirstEnabledFieldIndex = (Fields) => {
    const Index = Fields.findIndex((Field) => {
        return Field.Disabled !== true;
    });
    return Index < 0
        ? 0
        : Index;
};
export const FindLastEnabledFieldIndex = (Fields) => {
    for (let Index = Fields.length - 1; Index >= 0; Index--) {
        if (Fields[Index]?.Disabled !== true) {
            return Index;
        }
    }
    return 0;
};
export const MoveFieldCursor = (Fields, CurrentIndex, Step, Wrap) => {
    if (Fields.length === 0) {
        return 0;
    }
    if (!Fields.some((Field) => {
        return Field.Disabled !== true;
    })) {
        return Clamp(CurrentIndex, 0, Fields.length - 1);
    }
    let NextIndex = Clamp(CurrentIndex, 0, Fields.length - 1);
    for (let Attempt = 0; Attempt < Fields.length; Attempt++) {
        NextIndex = Step < 0
            ? MoveIndexUp(NextIndex, Fields.length, Wrap)
            : MoveIndexDown(NextIndex, Fields.length, Wrap);
        if (Fields[NextIndex]?.Disabled !== true) {
            return NextIndex;
        }
    }
    return CurrentIndex;
};
const NormalizeInitialChoiceIndex = (Choices, InitialIndex) => {
    if (Choices.length === 0) {
        return 0;
    }
    if (InitialIndex !== undefined
        && IsChoiceEnabled(Choices[InitialIndex])) {
        return InitialIndex;
    }
    return FindFirstEnabledChoiceIndex(Choices);
};
const NormalizeInitialFieldIndex = (Fields, InitialIndex) => {
    if (Fields.length === 0) {
        return 0;
    }
    if (InitialIndex !== undefined
        && Fields[InitialIndex]?.Disabled !== true) {
        return InitialIndex;
    }
    return FindFirstEnabledFieldIndex(Fields);
};
const CharacterLength = (Value) => {
    return Array.from(Value).length;
};
const Clamp = (Value, Minimum, Maximum) => {
    return Math.min(Math.max(Value, Minimum), Maximum);
};
//# sourceMappingURL=State.js.map