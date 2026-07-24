/**
 *
 *
 * @module @sorrell/ink-ui/Interaction/Shortcut
 *
 * @file      Shortcut.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { CommandScopeContext, InteractionContext, UseInteraction } from "./Context.tsx";
import { useTheme } from "../Theme.tsx";
import { JumpBadge } from "../Badge/JumpBadge.tsx";

/**
 * A registered shortcut with internal annotations.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface ShortcutRegistration
{
    readonly Command: string;
    readonly Description?: string | undefined;
    readonly Enabled?: boolean;
    readonly Hidden?: boolean;
    readonly Id?: string;
    readonly Keys: string | ReadonlyArray<string>;
    readonly Label?: string | undefined;
    readonly Priority?: number;
    readonly ScopeId: string;
}

/**
 * A registered shortcut.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface RegisteredShortcut extends Pick<ShortcutRegistration,
    | "Command"
    | "Description"
    | "Label"
    | "ScopeId">
{
    readonly Id: string;
    readonly Keys: ReadonlyArray<string>;
}

/**
 * A handler for input that is mapped to a command.
 *
 * @category Interaction
 * @since 1.0.0
 */
export type RoutedInputHandler =
    (Input: string, Key: Ink.Key) => boolean | void;

/**
 * A shortcut with internal state.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface InternalShortcut extends RegisteredShortcut
{
    readonly Enabled: boolean;
    readonly Hidden: boolean;
    readonly Priority: number;
    readonly Sequence: number;
}

/**
 * An input handler with internal state.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface RegisteredInputHandler
{
    readonly Enabled: boolean;
    readonly Handler: RoutedInputHandler;
    readonly Priority: number;
    readonly ScopeId: string;
    readonly Sequence: number;
}

export/**
       * Aliases for common keys to unify API.
       *
       * @category Interaction
       * @since 1.0.0
       */
const KeyAliases: Readonly<Record<string, string>> =
    {
        cmd: "meta",
        command: "meta",
        control: "ctrl",
        del: "delete",
        downarrow: "down",
        esc: "escape",
        leftarrow: "left",
        option: "meta",
        pgdn: "pagedown",
        pgup: "pageup",
        return: "enter",
        rightarrow: "right",
        spacebar: "space",
        upArrow: "up",
        uparrow: "up",
        win: "super",
        windows: "super"
    };

export/**
       * The order in which modifiers are displayed.
       *
       * @category Interaction
       * @since 1.0.0
       */
const ModifierOrder =
    [
        "ctrl",
        "meta",
        "super",
        "hyper",
        "shift"
    ] as const;

export/**
       * Converts a human-friendly key chord to the canonical shortcut form.
       *
       * @category Interaction
       * @since 1.0.0
       */
const NormalizeKeyChord = (Chord: string): string =>
{
    const Parts = Chord
        .trim()
        .toLowerCase()
        .split("+")
        .map((Part: string) => KeyAliases[Part.trim()] ?? Part.trim())
        .filter((Part: string) => Part.length > 0);
    const Modifiers = ModifierOrder.filter((Modifier: string) =>
        Parts.includes(Modifier)
    );
    const Base = Parts.find((Part: string) =>
        !(ModifierOrder as ReadonlyArray<string>).includes(Part)
    );
    return [ ...Modifiers, ...(Base === undefined ? [ ] : [ Base ]) ].join("+");
};

export/**
       * Converts Ink input data to the canonical chord used by shortcuts.
       *
       * @category Interaction
       * @since 1.0.0
       */
const GetKeyChord = (
    Input: string,
    Key: Ink.Key
): string | undefined =>
{
    let Base: string | undefined;
    if (Key.upArrow)
    {
        Base = "↑";
    }
    else if (Key.downArrow)
    {
        Base = "↓";
    }
    else if (Key.leftArrow)
    {
        Base = "←";
    }
    else if (Key.rightArrow)
    {
        Base = "→";
    }
    else if (Key.pageUp)
    {
        Base = "PgUp";
    }
    else if (Key.pageDown)
    {
        Base = "PgDn";
    }
    else if (Key.home)
    {
        Base = "Home";
    }
    else if (Key.end)
    {
        Base = "End";
    }
    else if (Key.return)
    {
        Base = "⏎";
    }
    else if (Key.escape)
    {
        Base = "Esc";
    }
    else if (Key.tab)
    {
        Base = "⭾";
    }
    else if (Key.backspace)
    {
        Base = "⌫";
    }
    else if (Key.delete)
    {
        Base = "del";
    }
    else if (Input === " ")
    {
        Base = "space";
    }
    else if (
        Key.ctrl
        && Input.length === 1
        && Input.charCodeAt(0) >= 1
        && Input.charCodeAt(0) <= 26
    )
    {
        Base = String.fromCharCode(Input.charCodeAt(0) + 96);
    }
    else if (Input.length === 1)
    {
        Base = Input.toLowerCase();
    }

    if (Base === undefined)
    {
        return undefined;
    }

    return NormalizeKeyChord([
        ...(Key.ctrl ? [ "ctrl" ] : [ ]),
        ...(Key.meta ? [ "meta" ] : [ ]),
        ...(Key.super ? [ "super" ] : [ ]),
        ...(Key.hyper ? [ "hyper" ] : [ ]),
        ...(Key.shift ? [ "shift" ] : [ ]),
        Base
    ].join("+"));
};

/** {@inheritDoc useShortcut} */
export interface UseShortcutOptions
{
    readonly Description?: string | undefined;
    readonly Enabled?: boolean;
    readonly Hidden?: boolean;
    readonly Id?: string;
    readonly Label?: string | undefined;
    readonly Priority?: number;
}

export/**
       * Binds one or more key chords to a command in the nearest command scope.
       *
       * @category Interaction
       * @since 1.0.0
       */
const useShortcut = (
    Keys: string | ReadonlyArray<string>,
    Command: string,
    Options: UseShortcutOptions = { }
): void =>
{
    const { Commands } = UseInteraction();
    const ScopeId = React.useContext(CommandScopeContext);
    const KeysKey = typeof Keys === "string" ? Keys : Keys.join("\0");

    React.useLayoutEffect(() => Commands.RegisterShortcut({
        Command,
        ...(Options.Description === undefined
            ? {}
            : { Description: Options.Description }),
        Enabled: Options.Enabled ?? true,
        Hidden: Options.Hidden ?? false,
        ...(Options.Id === undefined ? {} : { Id: Options.Id }),
        Keys: KeysKey.split("\0"),
        ...(Options.Label === undefined ? {} : { Label: Options.Label }),
        Priority: Options.Priority ?? 0,
        ScopeId
    }), [
        Command,
        Commands,
        KeysKey,
        Options.Description,
        Options.Enabled,
        Options.Hidden,
        Options.Id,
        Options.Label,
        Options.Priority,
        ScopeId
    ]);
};

/** {@inheritDoc Shortcut} */
export interface ShortcutProps extends UseShortcutOptions
{
    readonly children?: React.ReactNode;
    readonly Command: string;
    readonly Keys: string | ReadonlyArray<string>;
}

export/**
       * Declaratively registers a discoverable key binding for a command.
       *
       * @category Interaction
       * @since 1.0.0
       */
const Shortcut = ({
    children,
    Command,
    Keys,
    ...Options
}: ShortcutProps): React.ReactNode =>
{
    useShortcut(Keys, Command, Options);
    return children ?? null;
};

/** {@inheritDoc useRoutedInput} */
export interface RoutedInputOptions
{
    readonly Active?: boolean;
    readonly Priority?: number;
}

export/**
       * Routes input through the focused command path, with direct Ink input as a
       * provider-free fallback.
       *
       * @category Interaction
       * @since 1.0.0
       */
const useRoutedInput = (
    Handler: RoutedInputHandler,
    {
        Active = true,
        Priority = 0
    }: RoutedInputOptions = { }
): void =>
{
    const Interaction = React.useContext(InteractionContext);
    const ScopeId = React.useContext(CommandScopeContext);
    const HandlerReference = React.useRef(Handler);
    HandlerReference.current = Handler;

    Ink.useInput((Input: string, Key: Ink.Key) =>
    {
        HandlerReference.current(Input, Key);
    }, {
        isActive: Active && Interaction === undefined
    });

    React.useLayoutEffect(() =>
    {
        if (Interaction === undefined || Interaction.Commands === undefined)
        {
            return;
        }

        return Interaction.Commands.RegisterInputHandler(
            ScopeId,
            (Input: string, Key: Ink.Key) =>
                HandlerReference.current(Input, Key),
            Active,
            Priority
        );
    }, [ Active, Interaction, Priority, ScopeId ]);
};

export const ShortcutFooter = (): React.ReactNode =>
{
    const { Commands } = UseInteraction();
    const Shortcuts = Commands.GetActiveShortcuts();

    const Theme = useTheme();

    const GetDisplayableShortcuts = (In: ReadonlyArray<InternalShortcut>) =>
    {
        return In.filter(({ Label }: InternalShortcut) =>
        {
            return Label !== undefined;
        });
    };

    const Hotkey = ({ Keys, Label }: InternalShortcut): React.ReactNode =>
    {
        return (
            <Ink.Box gap={ 1 }>
                <JumpBadge Hint={ Keys.join("+") } />
                <Ink.Text color={ Theme.Text }>
                    { Label }
                </Ink.Text>
            </Ink.Box>
        );
    };

    return (
        <Ink.Box
            alignItems="flex-start"
            borderTop
            borderTopColor={ Theme.Border }
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-around">
            {
                GetDisplayableShortcuts(Shortcuts).map((ActiveShortcut: InternalShortcut) =>
                    <Hotkey
                        { ...ActiveShortcut }
                        key={ ActiveShortcut.Keys.join("+") }
                    />)
            }
        </Ink.Box>
    );
};
