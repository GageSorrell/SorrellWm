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
import { type Key as InkKey, useInput } from "ink";
import { useCallback } from "react";

export type KeyEventType =
    | "press"
    | "repeat"
    | "release";

export interface KeyEvent
{
    readonly Input: string;

    readonly Up: boolean;
    readonly Down: boolean;
    readonly Left: boolean;
    readonly Right: boolean;

    readonly PageDown: boolean;
    readonly PageUp: boolean;
    readonly Home: boolean;
    readonly End: boolean;

    readonly Return: boolean;
    readonly Escape: boolean;
    readonly Tab: boolean;
    readonly Backspace: boolean;
    readonly Delete: boolean;

    readonly Control: boolean;
    readonly Shift: boolean;
    readonly Meta: boolean;
    readonly Super: boolean;
    readonly Hyper: boolean;

    readonly CapsLock: boolean;
    readonly NumLock: boolean;

    readonly EventType?: KeyEventType;
}

export type InputAction =
    | "Submit"
    | "Cancel"
    | "MoveUp"
    | "MoveDown"
    | "MoveLeft"
    | "MoveRight"
    | "PageUp"
    | "PageDown"
    | "MoveHome"
    | "MoveEnd"
    | "DeleteBackward"
    | "DeleteForward"
    | "Toggle"
    | "Complete"
    | "OpenEditor"
    | "Clear"
    | "Search"
    | "AcceptSuggestion"
    | "InsertText"
    | "Noop";

export interface InputCommand
{
    readonly Action: InputAction;
    readonly Event: KeyEvent;
    readonly Text?: string;
}

export interface KeyBinding
{
    readonly Name: string;
    readonly Action: InputAction;
    readonly Matches: (Event: KeyEvent) => boolean;
}

export interface KeyMap
{
    readonly Bindings: ReadonlyArray<KeyBinding>;
}

export interface UseInputCommandsOptions
{
    readonly Active?: boolean;
    readonly KeyMap?: KeyMap;
    readonly AllowTextInput?: boolean;
    readonly IgnoreKeyRelease?: boolean;
}

export const DefaultKeyMap: KeyMap =
    {
        Bindings:
    [
        {
            Action: "Submit",
            Matches: (Event: KeyEvent) => Event.Return,
            Name: "return"
        },
        {
            Name: "escape",
            Action: "Cancel",
            Matches: (Event: KeyEvent) => Event.Escape
        },
        {
            Name: "ctrl-c",
            Action: "Cancel",
            Matches: (Event: KeyEvent) => Event.Control && Event.Input === "c"
        },
        {
            Name: "up",
            Action: "MoveUp",
            Matches: (Event: KeyEvent) => Event.Up
        },
        {
            Name: "shift-tab",
            Action: "MoveUp",
            Matches: (Event: KeyEvent) => Event.Shift && Event.Tab
        },
        {
            Action: "MoveDown",
            Name: "down",
            Matches: (Event: KeyEvent) => Event.Down
        },
        {
            Name: "tab",
            Action: "MoveDown",
            Matches: (Event: KeyEvent) => !Event.Shift && Event.Tab
        },
        {
            Name: "left",
            Action: "MoveLeft",
            Matches: (Event: KeyEvent) => Event.Left
        },
        {
            Name: "right",
            Action: "MoveRight",
            Matches: (Event: KeyEvent) => Event.Right
        },
        {
            Name: "page-up",
            Action: "PageUp",
            Matches: (Event: KeyEvent) => Event.PageUp
        },
        {
            Name: "page-down",
            Action: "PageDown",
            Matches: (Event: KeyEvent) => Event.PageDown
        },
        {
            Name: "home",
            Action: "MoveHome",
            Matches: (Event: KeyEvent) => Event.Home
        },
        {
            Name: "end",
            Action: "MoveEnd",
            Matches: (Event: KeyEvent) => Event.End
        },
        {
            Name: "backspace",
            Action: "DeleteBackward",
            Matches: (Event: KeyEvent) => Event.Backspace
        },
        {
            Name: "ctrl-h",
            Action: "DeleteBackward",
            Matches: (Event: KeyEvent) => Event.Control && Event.Input === "h"
        },
        {
            Name: "delete",
            Action: "DeleteForward",
            Matches: (Event: KeyEvent) => Event.Delete
        },
        {
            Name: "space",
            Action: "Toggle",
            Matches: (Event: KeyEvent) => Event.Input === " "
        },
        {
            Name: "ctrl-space",
            Action: "Complete",
            Matches: (Event: KeyEvent) => Event.Control && Event.Input === " "
        },
        {
            Name: "ctrl-e",
            Action: "OpenEditor",
            Matches: (Event: KeyEvent) => Event.Control && Event.Input === "e"
        },
        {
            Name: "ctrl-u",
            Action: "Clear",
            Matches: (Event: KeyEvent) => Event.Control && Event.Input === "u"
        },
        {
            Name: "ctrl-f",
            Action: "Search",
            Matches: (Event: KeyEvent) => Event.Control && Event.Input === "f"
        },
        {
            Name: "ctrl-y",
            Action: "AcceptSuggestion",
            Matches: (Event: KeyEvent) => Event.Control && Event.Input === "y"
        }
    ]
    };

export const KeyMapReference: Context.Reference<KeyMap> = Context.Reference(
    "@sorrell/effect-ink/KeyMap",
    {
        defaultValue: () => DefaultKeyMap
    }
);

/* eslint-disable-next-line @typescript-eslint/typedef */
export const LayerDefault = Layer.succeed(
    KeyMapReference,
    DefaultKeyMap
);

export const LayerFromKeyMap = (
    Value: KeyMap
) =>
    Layer.succeed(
        KeyMapReference,
        Value
    );

export const NormalizeInkInput = (
    Input: string,
    Key: InkKey
): KeyEvent =>
{
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

export const ResolveInputCommand = (
    Event: KeyEvent,
    CurrentKeyMap: KeyMap = DefaultKeyMap,
    AllowTextInput: boolean = true
): InputCommand =>
{
    const MatchingBinding: KeyBinding | undefined = CurrentKeyMap.Bindings.find(
        (CandidateBinding: KeyBinding) => CandidateBinding.Matches(Event)
    );

    if (MatchingBinding !== undefined)
    {
        return {
            Action: MatchingBinding.Action,
            Event
        };
    }

    if (AllowTextInput && IsTextInput(Event))
    {
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

export const IsTextInput = (
    Event: KeyEvent
): boolean =>
{
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

export const IsPrintableText = (
    Value: string
): boolean =>
{
    return Value.length > 0
        && !ContainsControlCharacter(Value);
};

export const ContainsControlCharacter = (
    Value: string
): boolean =>
{
    for (const Character of Value)
    {
        const CodePoint: number | undefined = Character.codePointAt(0);

        if (
            CodePoint !== undefined
            && (
                CodePoint < 0x20
                || CodePoint === 0x7f
            )
        )
        {
            return true;
        }
    }

    return false;
};

export const InsertTextAtOffset = (
    Value: string,
    Text: string,
    Offset: number
): string =>
{
    const Characters: Array<string> = StringToCharacters(Value);
    const SafeOffset: number = Clamp(
        Offset,
        0,
        Characters.length
    );

    return [
        ...Characters.slice(0, SafeOffset),
        ...StringToCharacters(Text),
        ...Characters.slice(SafeOffset)
    ].join("");
};

export const DeleteBackwardAtOffset = (
    Value: string,
    Offset: number
): string =>
{
    const Characters: Array<string> = StringToCharacters(Value);
    const SafeOffset: number = Clamp(
        Offset,
        0,
        Characters.length
    );

    if (SafeOffset === 0)
    {
        return Value;
    }

    return [
        ...Characters.slice(0, SafeOffset - 1),
        ...Characters.slice(SafeOffset)
    ].join("");
};

export const DeleteForwardAtOffset = (
    Value: string,
    Offset: number
): string =>
{
    const Characters: Array<string> = StringToCharacters(Value);
    const SafeOffset: number = Clamp(
        Offset,
        0,
        Characters.length
    );

    if (SafeOffset >= Characters.length)
    {
        return Value;
    }

    return [
        ...Characters.slice(0, SafeOffset),
        ...Characters.slice(SafeOffset + 1)
    ].join("");
};

export const MoveOffsetLeft = (
    Offset: number
): number =>
{
    return Math.max(
        0,
        Offset - 1
    );
};

export const MoveOffsetRight = (
    Value: string,
    Offset: number
): number =>
{
    return Math.min(
        StringToCharacters(Value).length,
        Offset + 1
    );
};

export const MoveOffsetHome = (): number =>
{
    return 0;
};

export const MoveOffsetEnd = (
    Value: string
): number =>
{
    return StringToCharacters(Value).length;
};

export const MoveIndexUp = (
    Index: number,
    Length: number,
    Wrap: boolean = true
): number =>
{
    if (Length <= 0)
    {
        return 0;
    }

    if (Index <= 0)
    {
        return Wrap
            ? Length - 1
            : 0;
    }

    return Index - 1;
};

export const MoveIndexDown = (
    Index: number,
    Length: number,
    Wrap: boolean = true
): number =>
{
    if (Length <= 0)
    {
        return 0;
    }

    if (Index >= Length - 1)
    {
        return Wrap
            ? 0
            : Length - 1;
    }

    return Index + 1;
};

export const MoveIndexPageUp = (
    Index: number,
    Length: number,
    PageSize: number
): number =>
{
    if (Length <= 0)
    {
        return 0;
    }

    return Clamp(
        Index - Math.max(1, PageSize),
        0,
        Length - 1
    );
};

export const MoveIndexPageDown = (
    Index: number,
    Length: number,
    PageSize: number
): number =>
{
    if (Length <= 0)
    {
        return 0;
    }

    return Clamp(
        Index + Math.max(1, PageSize),
        0,
        Length - 1
    );
};

export const MakeKeyBinding = (
    Name: string,
    Action: InputAction,
    Matches: (Event: KeyEvent) => boolean
): KeyBinding =>
{
    return {
        Action,
        Matches,
        Name
    };
};

export const AppendKeyBinding = (
    CurrentKeyMap: KeyMap,
    Binding: KeyBinding
): KeyMap =>
{
    return {
        Bindings:
        [
            ...CurrentKeyMap.Bindings,
            Binding
        ]
    };
};

export const PrependKeyBinding = (
    CurrentKeyMap: KeyMap,
    Binding: KeyBinding
): KeyMap =>
{
    return {
        Bindings:
        [
            Binding,
            ...CurrentKeyMap.Bindings
        ]
    };
};

export const RemoveKeyBinding = (
    CurrentKeyMap: KeyMap,
    Name: string
): KeyMap =>
{
    return {
        Bindings: CurrentKeyMap.Bindings.filter((Binding: KeyBinding) =>
        {
            return Binding.Name !== Name;
        })
    };
};

export const MergeKeyMaps = (
    BaseKeyMap: KeyMap,
    OverrideKeyMap: KeyMap
): KeyMap =>
{
    const OverrideNames: Set<string> = new Set(
        OverrideKeyMap.Bindings.map((Binding: KeyBinding) => Binding.Name)
    );

    return {
        Bindings:
        [
            ...OverrideKeyMap.Bindings,
            ...BaseKeyMap.Bindings.filter((Binding: KeyBinding) =>
            {
                return !OverrideNames.has(Binding.Name);
            })
        ]
    };
};

export const useInputCommands = (
    OnCommand: (Command: InputCommand) => void,
    Options: UseInputCommandsOptions = {}
): void =>
{
    const {
        Active = true,
        KeyMap: CurrentKeyMap = DefaultKeyMap,
        AllowTextInput = true,
        IgnoreKeyRelease = true
    } = Options;

    const HandleInput: (Input: string, Key: InkKey) => void = useCallback(
        (Input: string, Key: InkKey) =>
        {
            const Event: KeyEvent = NormalizeInkInput(
                Input,
                Key
            );

            if (
                IgnoreKeyRelease
                && Event.EventType === "release"
            )
            {
                return;
            }

            OnCommand(
                ResolveInputCommand(
                    Event,
                    CurrentKeyMap,
                    AllowTextInput
                )
            );
        },
        [
            AllowTextInput,
            CurrentKeyMap,
            IgnoreKeyRelease,
            OnCommand
        ]
    );

    useInput(
        HandleInput,
        {
            isActive: Active
        }
    );
};

const StringToCharacters = (
    Value: string
): Array<string> =>
{
    return Array.from(Value);
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
