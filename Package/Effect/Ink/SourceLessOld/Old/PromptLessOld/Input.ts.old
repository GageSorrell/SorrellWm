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

export type Kind =
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

    readonly EventType?: Kind;
}

export type Action =
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

export interface Command
{
    readonly Action: Action;
    readonly Event: KeyEvent;
    readonly Text?: string;
}

export interface KeyBinding
{
    readonly Name: string;
    readonly Action: Action;
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
                Action: "Cancel",
                Matches: (Event: KeyEvent) => Event.Escape,
                Name: "escape"
            },
            {
                Action: "Cancel",
                Matches: (Event: KeyEvent) => Event.Control && Event.Input === "c",
                Name: "ctrl-c"
            },
            {
                Action: "MoveUp",
                Matches: (Event: KeyEvent) => Event.Up,
                Name: "up"
            },
            {
                Action: "MoveUp",
                Matches: (Event: KeyEvent) => Event.Shift && Event.Tab,
                Name: "shift-tab"
            },
            {
                Action: "MoveDown",
                Matches: (Event: KeyEvent) => Event.Down,
                Name: "down"
            },
            {
                Action: "MoveDown",
                Matches: (Event: KeyEvent) => !Event.Shift && Event.Tab,
                Name: "tab"
            },
            {
                Action: "MoveLeft",
                Matches: (Event: KeyEvent) => Event.Left,
                Name: "left"
            },
            {
                Action: "MoveRight",
                Matches: (Event: KeyEvent) => Event.Right,
                Name: "right"
            },
            {
                Action: "PageUp",
                Matches: (Event: KeyEvent) => Event.PageUp,
                Name: "page-up"
            },
            {
                Action: "PageDown",
                Matches: (Event: KeyEvent) => Event.PageDown,
                Name: "page-down"
            },
            {
                Action: "MoveHome",
                Matches: (Event: KeyEvent) => Event.Home,
                Name: "home"
            },
            {
                Action: "MoveEnd",
                Matches: (Event: KeyEvent) => Event.End,
                Name: "end"
            },
            {
                Action: "DeleteBackward",
                Matches: (Event: KeyEvent) => Event.Backspace,
                Name: "backspace"
            },
            {
                Action: "DeleteBackward",
                Matches: (Event: KeyEvent) => Event.Control && Event.Input === "h",
                Name: "ctrl-h"
            },
            {
                Action: "DeleteForward",
                Matches: (Event: KeyEvent) => Event.Delete,
                Name: "delete"
            },
            {
                Action: "Toggle",
                Matches: (Event: KeyEvent) => Event.Input === " ",
                Name: "space"
            },
            {
                Action: "Complete",
                Matches: (Event: KeyEvent) => Event.Control && Event.Input === " ",
                Name: "ctrl-space"
            },
            {
                Action: "OpenEditor",
                Matches: (Event: KeyEvent) => Event.Control && Event.Input === "e",
                Name: "ctrl-e"
            },
            {
                Action: "Clear",
                Matches: (Event: KeyEvent) => Event.Control && Event.Input === "u",
                Name: "ctrl-u"
            },
            {
                Action: "Search",
                Matches: (Event: KeyEvent) => Event.Control && Event.Input === "f",
                Name: "ctrl-f"
            },
            {
                Action: "AcceptSuggestion",
                Matches: (Event: KeyEvent) => Event.Control && Event.Input === "y",
                Name: "ctrl-y"
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
): Command =>
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
    Action: Action,
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
    OnCommand: (Command: Command) => void,
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
