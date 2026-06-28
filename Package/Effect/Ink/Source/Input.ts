/**
 * Types and functions for handling keyboard input.
 *
 * @module @sorrell/effect-ink/Input
 */

/**
 * @file      Input.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Arr from "effect/Array";
import type * as Ink from "ink";
import { Option, pipe } from "effect";

export interface Modifiers extends Omit<Ink.Key, "eventType"> { }

export interface Key
{
    readonly Input: Option.Option<string>;
    readonly Modifiers: Modifiers;
}

export const EmptyModifiers: Modifiers =
    {
        backspace: false,
        capsLock: false,
        ctrl: false,
        delete: false,
        downArrow: false,
        end: false,
        escape: false,
        home: false,
        hyper: false,
        leftArrow: false,
        meta: false,
        numLock: false,
        pageDown: false,
        pageUp: false,
        return: false,
        rightArrow: false,
        shift: false,
        super: false,
        tab: false,
        upArrow: false
    } as const;

export const EmptyKey: Key =
    {
        Input: Option.none(),
        Modifiers: EmptyModifiers
    } as const;

export interface KeyArgument
{
    readonly Input?: Option.Option<string>;
    readonly Modifiers?: Partial<Modifiers>;
};

export const Key = ({ Input = Option.none(), Modifiers = EmptyModifiers }: KeyArgument): Key =>
{
    return { Input, Modifiers: { ...EmptyModifiers, ...Modifiers } } as const;
};

export interface ModifierLabelPart
{
    readonly Long: string;
    readonly Short: string;
    readonly Symbol: string;
}

export type Platform = Extract<NodeJS.Platform, "win32" | "linux" | "darwin">;

export type ModifierLabel = Record<Platform, ModifierLabelPart>;

/* eslint-disable @typescript-eslint/typedef */

export const ModifierLabels =
    {
        backspace:
        {
            darwin:
            {
                Long: "Delete",
                Short: "Del",
                Symbol: "⌫"
            },
            linux:
            {
                Long: "Backspace",
                Short: "Bksp",
                Symbol: "⌫"
            },
            win32:
            {
                Long: "Backspace",
                Short: "Bksp",
                Symbol: "⌫"
            }
        },

        capsLock:
        {
            darwin:
            {
                Long: "Caps Lock",
                Short: "Caps",
                Symbol: "⇪"
            },
            linux:
            {
                Long: "Caps Lock",
                Short: "Caps",
                Symbol: "⇪"
            },
            win32:
            {
                Long: "Caps Lock",
                Short: "Caps",
                Symbol: "⇪"
            }
        },

        ctrl:
        {
            darwin:
            {
                Long: "Control",
                Short: "Ctrl",
                Symbol: "⌃"
            },
            linux:
            {
                Long: "Control",
                Short: "Ctrl",
                Symbol: "Ctrl"
            },
            win32:
            {
                Long: "Control",
                Short: "Ctrl",
                Symbol: "Ctrl"
            }
        },

        delete:
        {
            darwin:
            {
                Long: "Forward Delete",
                Short: "Fwd Del",
                Symbol: "⌦"
            },
            linux:
            {
                Long: "Delete",
                Short: "Del",
                Symbol: "⌦"
            },
            win32:
            {
                Long: "Delete",
                Short: "Del",
                Symbol: "⌦"
            }
        },

        downArrow:
        {
            darwin:
            {
                Long: "Down Arrow",
                Short: "Down",
                Symbol: "↓"
            },
            linux:
            {
                Long: "Down Arrow",
                Short: "Down",
                Symbol: "↓"
            },
            win32:
            {
                Long: "Down Arrow",
                Short: "Down",
                Symbol: "↓"
            }
        },

        end:
        {
            darwin:
            {
                Long: "End",
                Short: "End",
                Symbol: "↘"
            },
            linux:
            {
                Long: "End",
                Short: "End",
                Symbol: "↘"
            },
            win32:
            {
                Long: "End",
                Short: "End",
                Symbol: "↘"
            }
        },

        escape:
        {
            darwin:
            {
                Long: "Escape",
                Short: "Esc",
                Symbol: "⎋"
            },
            linux:
            {
                Long: "Escape",
                Short: "Esc",
                Symbol: "Esc"
            },
            win32:
            {
                Long: "Escape",
                Short: "Esc",
                Symbol: "Esc"
            }
        },

        home:
        {
            darwin:
            {
                Long: "Home",
                Short: "Home",
                Symbol: "↖"
            },
            linux:
            {
                Long: "Home",
                Short: "Home",
                Symbol: "↖"
            },
            win32:
            {
                Long: "Home",
                Short: "Home",
                Symbol: "↖"
            }
        },

        hyper:
        {
            darwin:
            {
                Long: "Hyper",
                Short: "Hyper",
                Symbol: "Hyper"
            },
            linux:
            {
                Long: "Hyper",
                Short: "Hyper",
                Symbol: "Hyper"
            },
            win32:
            {
                Long: "Hyper",
                Short: "Hyper",
                Symbol: "Hyper"
            }
        },

        leftArrow:
        {
            darwin:
            {
                Long: "Left Arrow",
                Short: "Left",
                Symbol: "←"
            },
            linux:
            {
                Long: "Left Arrow",
                Short: "Left",
                Symbol: "←"
            },
            win32:
            {
                Long: "Left Arrow",
                Short: "Left",
                Symbol: "←"
            }
        },

        meta:
        {
            darwin:
            {
                Long: "Option",
                Short: "Opt",
                Symbol: "⌥"
            },
            linux:
            {
                Long: "Alt",
                Short: "Alt",
                Symbol: "Alt"
            },
            win32:
            {
                Long: "Alt",
                Short: "Alt",
                Symbol: "Alt"
            }
        },

        numLock:
        {
            darwin:
            {
                Long: "Clear",
                Short: "Clr",
                Symbol: "⌧"
            },
            linux:
            {
                Long: "Num Lock",
                Short: "Num",
                Symbol: "Num"
            },
            win32:
            {
                Long: "Num Lock",
                Short: "Num",
                Symbol: "Num"
            }
        },

        pageDown:
        {
            darwin:
            {
                Long: "Page Down",
                Short: "PgDn",
                Symbol: "⇟"
            },
            linux:
            {
                Long: "Page Down",
                Short: "PgDn",
                Symbol: "⇟"
            },
            win32:
            {
                Long: "Page Down",
                Short: "PgDn",
                Symbol: "⇟"
            }
        },

        pageUp:
        {
            darwin:
            {
                Long: "Page Up",
                Short: "PgUp",
                Symbol: "⇞"
            },
            linux:
            {
                Long: "Page Up",
                Short: "PgUp",
                Symbol: "⇞"
            },
            win32:
            {
                Long: "Page Up",
                Short: "PgUp",
                Symbol: "⇞"
            }
        },

        return:
        {
            darwin:
            {
                Long: "Return",
                Short: "Ret",
                Symbol: "⏎"
            },
            linux:
            {
                Long: "Enter",
                Short: "Enter",
                Symbol: "↵"
            },
            win32:
            {
                Long: "Enter",
                Short: "Enter",
                Symbol: "↵"
            }
        },

        rightArrow:
        {
            darwin:
            {
                Long: "Right Arrow",
                Short: "Right",
                Symbol: "→"
            },
            linux:
            {
                Long: "Right Arrow",
                Short: "Right",
                Symbol: "→"
            },
            win32:
            {
                Long: "Right Arrow",
                Short: "Right",
                Symbol: "→"
            }
        },

        shift:
        {
            darwin:
            {
                Long: "Shift",
                Short: "Shift",
                Symbol: "⇧"
            },
            linux:
            {
                Long: "Shift",
                Short: "Shift",
                Symbol: "Shift"
            },
            win32:
            {
                Long: "Shift",
                Short: "Shift",
                Symbol: "Shift"
            }
        },

        super:
        {
            darwin:
            {
                Long: "Command",
                Short: "Cmd",
                Symbol: "⌘"
            },
            linux:
            {
                Long: "Super",
                Short: "Super",
                Symbol: "Super"
            },
            win32:
            {
                Long: "Windows",
                Short: "Win",
                Symbol: "⊞"
            }
        },

        tab:
        {
            darwin:
            {
                Long: "Tab",
                Short: "Tab",
                Symbol: "⇥"
            },
            linux:
            {
                Long: "Tab",
                Short: "Tab",
                Symbol: "Tab"
            },
            win32:
            {
                Long: "Tab",
                Short: "Tab",
                Symbol: "Tab"
            }
        },

        upArrow:
        {
            darwin:
            {
                Long: "Up Arrow",
                Short: "Up",
                Symbol: "↑"
            },
            linux:
            {
                Long: "Up Arrow",
                Short: "Up",
                Symbol: "↑"
            },
            win32:
            {
                Long: "Up Arrow",
                Short: "Up",
                Symbol: "↑"
            }
        }
    } as const;

export const LabelStrategy =
    {
        Long: { _tag: "Long" as const } as const,
        Short: { _tag: "Short" as const } as const,
        Symbol: { _tag: "Symbol" as const } as const
    };

export type LabelStrategy = typeof LabelStrategy[keyof typeof LabelStrategy];

/* eslint-enable @typescript-eslint/typedef */

export const ModifierLabelPriorities: Arr.NonEmptyReadonlyArray<keyof Modifiers> =
    [
        "ctrl",
        "shift",
        "meta",
        "super",
        "hyper",
        "leftArrow",
        "upArrow",
        "downArrow",
        "rightArrow",
        "return",
        "home",
        "end",
        "pageUp",
        "pageDown",
        "delete",
        "tab",
        "numLock",
        "capsLock",
        "backspace",
        "escape"
    ] as const;

export const Separator: "+" = "+" as const;

export const Platforms: ReadonlyArray<Platform> = [ "darwin", "linux", "win32" ] as const;

export const IsPlatform = (Value: unknown): Value is Platform =>
{
    return (Platforms as ReadonlyArray<unknown>).includes(Value);
};

export const GetInputPlatform = (Fallback: Platform = "linux"): Platform =>
{
    return IsPlatform(process.platform)
        ? process.platform
        : Fallback;
};

export const ToString = (
    Key: Key,
    LabelStrategyOverride: LabelStrategy = LabelStrategy.Short,
    PlatformFallback: Platform = "linux"
): string =>
{
    const Platform: Platform = GetInputPlatform(PlatformFallback);

    const IsModifierUsed = (Value: keyof Modifiers, _Index: number) => Key.Modifiers[Value];
    const GetLabel = (
        Value: keyof Modifiers,
        _Index: number
    ): string => ModifierLabels[Value][Platform][LabelStrategyOverride["_tag"]];

    const ModifiersPart: ReadonlyArray<string> =
        pipe(
            ModifierLabelPriorities,
            Arr.filter(IsModifierUsed),
            Arr.map(GetLabel)
        );

    const Separator: string = LabelStrategyOverride === LabelStrategy.Symbol
        ? " "
        : "+";

    const OutArray: ReadonlyArray<string> = Option.isSome(Key.Input)
        ? [ ...ModifiersPart, Key.Input.value ]
        : ModifiersPart;

    return Arr.join(OutArray, Separator);
};
