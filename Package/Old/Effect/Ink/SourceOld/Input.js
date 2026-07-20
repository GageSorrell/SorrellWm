/**
 * Handle user input between `ink` and `effect`.
 *
 * @module @sorrell/effect-ink/Input
 */
/**
 * @file      Input.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Context, Layer } from "effect";
import { useInput } from "ink";
import { useCallback } from "react";
export const DefaultKeyMap = {
    Bindings: [
        {
            Action: "Submit",
            Matches: (Event) => Event.Return,
            Name: "return"
        },
        {
            Name: "escape",
            Action: "Cancel",
            Matches: (Event) => Event.Escape
        },
        {
            Name: "ctrl-c",
            Action: "Cancel",
            Matches: (Event) => Event.Control && Event.Input === "c"
        },
        {
            Name: "up",
            Action: "MoveUp",
            Matches: (Event) => Event.Up
        },
        {
            Name: "shift-tab",
            Action: "MoveUp",
            Matches: (Event) => Event.Shift && Event.Tab
        },
        {
            Action: "MoveDown",
            Name: "down",
            Matches: (Event) => Event.Down
        },
        {
            Name: "tab",
            Action: "MoveDown",
            Matches: (Event) => !Event.Shift && Event.Tab
        },
        {
            Name: "left",
            Action: "MoveLeft",
            Matches: (Event) => Event.Left
        },
        {
            Name: "right",
            Action: "MoveRight",
            Matches: (Event) => Event.Right
        },
        {
            Name: "page-up",
            Action: "PageUp",
            Matches: (Event) => Event.PageUp
        },
        {
            Name: "page-down",
            Action: "PageDown",
            Matches: (Event) => Event.PageDown
        },
        {
            Name: "home",
            Action: "MoveHome",
            Matches: (Event) => Event.Home
        },
        {
            Name: "end",
            Action: "MoveEnd",
            Matches: (Event) => Event.End
        },
        {
            Name: "backspace",
            Action: "DeleteBackward",
            Matches: (Event) => Event.Backspace
        },
        {
            Name: "ctrl-h",
            Action: "DeleteBackward",
            Matches: (Event) => Event.Control && Event.Input === "h"
        },
        {
            Name: "delete",
            Action: "DeleteForward",
            Matches: (Event) => Event.Delete
        },
        {
            Name: "space",
            Action: "Toggle",
            Matches: (Event) => Event.Input === " "
        },
        {
            Name: "ctrl-space",
            Action: "Complete",
            Matches: (Event) => Event.Control && Event.Input === " "
        },
        {
            Name: "ctrl-e",
            Action: "OpenEditor",
            Matches: (Event) => Event.Control && Event.Input === "e"
        },
        {
            Name: "ctrl-u",
            Action: "Clear",
            Matches: (Event) => Event.Control && Event.Input === "u"
        },
        {
            Name: "ctrl-f",
            Action: "Search",
            Matches: (Event) => Event.Control && Event.Input === "f"
        },
        {
            Name: "ctrl-y",
            Action: "AcceptSuggestion",
            Matches: (Event) => Event.Control && Event.Input === "y"
        }
    ]
};
export const KeyMapReference = Context.Reference("@sorrell/effect-ink/KeyMap", {
    defaultValue: () => DefaultKeyMap
});
/* eslint-disable-next-line @typescript-eslint/typedef */
export const LayerDefault = Layer.succeed(KeyMapReference, DefaultKeyMap);
export const LayerFromKeyMap = (Value) => Layer.succeed(KeyMapReference, Value);
export const NormalizeInkInput = (Input, Key) => {
    return {
        Input,
        Down: Key.downArrow,
        Left: Key.leftArrow,
        Right: Key.rightArrow,
        Up: Key.upArrow,
        End: Key.end,
        Home: Key.home,
        PageDown: Key.pageDown,
        PageUp: Key.pageUp,
        Backspace: Key.backspace,
        Delete: Key.delete,
        Escape: Key.escape,
        Return: Key.return,
        Tab: Key.tab,
        Control: Key.ctrl,
        Hyper: Key.hyper,
        Meta: Key.meta,
        Shift: Key.shift,
        Super: Key.super,
        CapsLock: Key.capsLock,
        NumLock: Key.numLock,
        EventType: Key.eventType ?? "press"
    };
};
export const ResolveInputCommand = (Event, CurrentKeyMap = DefaultKeyMap, AllowTextInput = true) => {
    const MatchingBinding = CurrentKeyMap.Bindings.find((CandidateBinding) => CandidateBinding.Matches(Event));
    if (MatchingBinding !== undefined) {
        return {
            Action: MatchingBinding.Action,
            Event
        };
    }
    if (AllowTextInput && IsTextInput(Event)) {
        return {
            Action: "InsertText",
            Event,
            Text: Event.Input
        };
    }
    return {
        Action: "Noop",
        Event
    };
};
export const IsTextInput = (Event) => {
    return IsPrintableText(Event.Input)
        && !Event.Control
        && !Event.Meta
        && !Event.Super
        && !Event.Hyper
        && !Event.Return
        && !Event.Escape
        && !Event.Tab
        && !Event.Backspace
        && !Event.Delete
        && !Event.Up
        && !Event.Down
        && !Event.Left
        && !Event.Right
        && !Event.PageUp
        && !Event.PageDown
        && !Event.Home
        && !Event.End;
};
export const IsPrintableText = (Value) => {
    return Value.length > 0
        && !ContainsControlCharacter(Value);
};
export const ContainsControlCharacter = (Value) => {
    for (const Character of Value) {
        const CodePoint = Character.codePointAt(0);
        if (CodePoint !== undefined
            && (CodePoint < 0x20
                || CodePoint === 0x7f)) {
            return true;
        }
    }
    return false;
};
export const InsertTextAtOffset = (Value, Text, Offset) => {
    const Characters = StringToCharacters(Value);
    const SafeOffset = Clamp(Offset, 0, Characters.length);
    return [
        ...Characters.slice(0, SafeOffset),
        ...StringToCharacters(Text),
        ...Characters.slice(SafeOffset)
    ].join("");
};
export const DeleteBackwardAtOffset = (Value, Offset) => {
    const Characters = StringToCharacters(Value);
    const SafeOffset = Clamp(Offset, 0, Characters.length);
    if (SafeOffset === 0) {
        return Value;
    }
    return [
        ...Characters.slice(0, SafeOffset - 1),
        ...Characters.slice(SafeOffset)
    ].join("");
};
export const DeleteForwardAtOffset = (Value, Offset) => {
    const Characters = StringToCharacters(Value);
    const SafeOffset = Clamp(Offset, 0, Characters.length);
    if (SafeOffset >= Characters.length) {
        return Value;
    }
    return [
        ...Characters.slice(0, SafeOffset),
        ...Characters.slice(SafeOffset + 1)
    ].join("");
};
export const MoveOffsetLeft = (Offset) => {
    return Math.max(0, Offset - 1);
};
export const MoveOffsetRight = (Value, Offset) => {
    return Math.min(StringToCharacters(Value).length, Offset + 1);
};
export const MoveOffsetHome = () => {
    return 0;
};
export const MoveOffsetEnd = (Value) => {
    return StringToCharacters(Value).length;
};
export const MoveIndexUp = (Index, Length, Wrap = true) => {
    if (Length <= 0) {
        return 0;
    }
    if (Index <= 0) {
        return Wrap
            ? Length - 1
            : 0;
    }
    return Index - 1;
};
export const MoveIndexDown = (Index, Length, Wrap = true) => {
    if (Length <= 0) {
        return 0;
    }
    if (Index >= Length - 1) {
        return Wrap
            ? 0
            : Length - 1;
    }
    return Index + 1;
};
export const MoveIndexPageUp = (Index, Length, PageSize) => {
    if (Length <= 0) {
        return 0;
    }
    return Clamp(Index - Math.max(1, PageSize), 0, Length - 1);
};
export const MoveIndexPageDown = (Index, Length, PageSize) => {
    if (Length <= 0) {
        return 0;
    }
    return Clamp(Index + Math.max(1, PageSize), 0, Length - 1);
};
export const MakeKeyBinding = (Name, Action, Matches) => {
    return {
        Action,
        Matches,
        Name
    };
};
export const AppendKeyBinding = (CurrentKeyMap, Binding) => {
    return {
        Bindings: [
            ...CurrentKeyMap.Bindings,
            Binding
        ]
    };
};
export const PrependKeyBinding = (CurrentKeyMap, Binding) => {
    return {
        Bindings: [
            Binding,
            ...CurrentKeyMap.Bindings
        ]
    };
};
export const RemoveKeyBinding = (CurrentKeyMap, Name) => {
    return {
        Bindings: CurrentKeyMap.Bindings.filter((Binding) => {
            return Binding.Name !== Name;
        })
    };
};
export const MergeKeyMaps = (BaseKeyMap, OverrideKeyMap) => {
    const OverrideNames = new Set(OverrideKeyMap.Bindings.map((Binding) => Binding.Name));
    return {
        Bindings: [
            ...OverrideKeyMap.Bindings,
            ...BaseKeyMap.Bindings.filter((Binding) => {
                return !OverrideNames.has(Binding.Name);
            })
        ]
    };
};
export const useInputCommands = (OnCommand, Options = {}) => {
    const { Active = true, KeyMap: CurrentKeyMap = DefaultKeyMap, AllowTextInput = true, IgnoreKeyRelease = true } = Options;
    const HandleInput = useCallback((Input, Key) => {
        const Event = NormalizeInkInput(Input, Key);
        if (IgnoreKeyRelease
            && Event.EventType === "release") {
            return;
        }
        OnCommand(ResolveInputCommand(Event, CurrentKeyMap, AllowTextInput));
    }, [
        AllowTextInput,
        CurrentKeyMap,
        IgnoreKeyRelease,
        OnCommand
    ]);
    useInput(HandleInput, {
        isActive: Active
    });
};
const StringToCharacters = (Value) => {
    return Array.from(Value);
};
const Clamp = (Value, Minimum, Maximum) => {
    return Math.min(Math.max(Value, Minimum), Maximum);
};
//# sourceMappingURL=Input.js.map