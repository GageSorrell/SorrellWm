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
import {
    Array,
    Boolean,
    Function,
    Option,
    Predicate,
    Struct,
    pipe
} from "effect";
import {
    type CommandId,
    CommandIdToString,
    useCommandManager
} from "./Command.tsx";
import { CommandScopeContext, InteractionContext, UseInteraction } from "./Context.tsx";
import { useTheme } from "../Theme.tsx";

/**
 * A registered shortcut with internal annotations.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface ShortcutRegistration
{
    readonly Command: CommandId;
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
 * A group of shortcuts that are represented with a custom, unified entry in the footer.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface GroupShortcut extends Pick<ShortcutRegistration, "ScopeId">
{
    readonly Commands: Array.NonEmptyReadonlyArray<CommandId>;
    readonly Label: string;
    readonly Glyph: string;
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
        alt: "Alt",
        // alt: "⎇",
        backTab: "⇤",
        backspace: "⌫",
        // break: "⎊",
        break: "Break",
        capsLock: "⇪",
        clear: "⌧",
        cmd: "⌘",
        command: "⌘",
        // ctrl: "⌃",
        ctrl: "Ctrl",
        del: "⌦",
        downArrow: "↓",
        end: "End",
        // end: "⇲",
        esc: "Esc",
        escape: "Esc",
        home: "Home",
        // Home: "⇱",
        ins: "Ins",
        // insert: "⎀",
        leftArrow: "←",
        // numLock: "⇭",
        numLock: "NumLock",
        option: "⌥",
        // pageDown: "⇟",
        // pause: "⎉",
        pause: "Pause",
        pgdn: "PgDn",
        pgup: "PgUp",
        // pgUp: "⇞",
        // pgUp: "⇞",
        printScreen: "PrScr",
        // printScreen: "⎙",
        return: "⏎",
        rightArrow: "→",
        shift: "⇧",
        space: "␣",
        tab: "⇥",
        upArrow: "↑",
        win: "⊞",
        windows: "⊞"
        // cmd: "meta",
        // command: "meta",
        // control: "ctrl",
        // del: "delete",
        // downarrow: "down",
        // esc: "escape",
        // leftarrow: "left",
        // option: "meta",
        // pgdn: "pagedown",
        // pgup: "pageup",
        // return: "enter",
        // rightarrow: "right",
        // spacebar: "space",
        // upArrow: "up",
        // uparrow: "up",
        // win: "super",
        // windows: "super"
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
const GetKeyChordUnsafe: {
    (Input: string, Key: Ink.Key): string;
    (Key: Ink.Key): string;
} = (InputOrKey: string | Ink.Key, MaybeKey?: Ink.Key): string =>
{
    return GetKeyChord(InputOrKey as any, MaybeKey as any).valueOrUndefined!;
};

export/**
       * Converts Ink input data to the canonical chord used by shortcuts.
       *
       * @category Interaction
       * @since 1.0.0
       */
const GetKeyChord: {
    (Input: string, Key: Ink.Key): Option.Option<string>;
    (Key: Ink.Key): Option.Option<string>;
} = (InputOrKey: string | Ink.Key, MaybeKey?: Ink.Key): Option.Option<string> =>
{
    let Base: string | undefined;

    const KeyArg: Ink.Key = Predicate.isObject(InputOrKey)
        ? InputOrKey
        : MaybeKey!;

    const InputArg: string | undefined = Predicate.isObject(InputOrKey)
        ? undefined
        : InputOrKey;

    if (KeyArg.upArrow)
    {
        Base = "↑";
    }
    else if (KeyArg.downArrow)
    {
        Base = "↓";
    }
    else if (KeyArg.leftArrow)
    {
        Base = "←";
    }
    else if (KeyArg.rightArrow)
    {
        Base = "→";
    }
    else if (KeyArg.pageUp)
    {
        Base = "PgUp";
    }
    else if (KeyArg.pageDown)
    {
        Base = "PgDn";
    }
    else if (KeyArg.home)
    {
        Base = "Home";
    }
    else if (KeyArg.end)
    {
        Base = "End";
    }
    else if (KeyArg.return)
    {
        Base = "⏎";
    }
    else if (KeyArg.escape)
    {
        Base = "Esc";
    }
    else if (KeyArg.tab)
    {
        Base = "⭾";
    }
    else if (KeyArg.backspace)
    {
        Base = "⌫";
    }
    else if (KeyArg.delete)
    {
        Base = "del";
    }
    else if (InputArg === " ")
    {
        Base = "␣";
    }
    else if (
        KeyArg.ctrl
        && InputArg!.length === 1
        && InputArg!.charCodeAt(0) >= 1
        && InputArg!.charCodeAt(0) <= 26
    )
    {
        Base = String.fromCharCode(InputArg!.charCodeAt(0) + 96);
    }
    else if (InputArg!.length === 1)
    {
        Base = InputArg!.toLowerCase();
    }

    if (Base === undefined)
    {
        return Option.none();
    }

    return Option.some(NormalizeKeyChord([
        ...(KeyArg.ctrl ? [ "ctrl" ] : [ ]),
        ...(KeyArg.meta ? [ "meta" ] : [ ]),
        ...(KeyArg.super ? [ "super" ] : [ ]),
        ...(KeyArg.hyper ? [ "hyper" ] : [ ]),
        ...(KeyArg.shift ? [ "shift" ] : [ ]),
        Base
    ].join("+")));
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
    Command: CommandId,
    Options: UseShortcutOptions = { }
): void =>
{
    const { Commands } = UseInteraction();
    const ScopeId = React.useContext(CommandScopeContext);
    const KeysKey = typeof Keys === "string" ? Keys : Keys.join("\0");

    React.useLayoutEffect(() => Commands.RegisterShortcut({
        ...Struct.pick(Options, [ "Description", "Id", "Label" ]),

        Command,
        Enabled: Options.Enabled ?? true,
        Hidden: Options.Hidden ?? false,
        Keys: KeysKey.split("\0"),
        Priority: Options.Priority ?? 0,
        ScopeId
    }), [
        Command,
        Commands,
        KeysKey,
        Options,
        Options.Description,
        Options.Enabled,
        Options.Hidden,
        Options.Id,
        Options.Label,
        Options.Priority,
        ScopeId
    ]);
};

export/**
       *
       * @category Interaction
       * @since 1.0.0
       */
const useShortcutGroup = (
    Group: Omit<GroupShortcut, "ScopeId">
): void =>
{
    const { Commands } = UseInteraction();
    const ScopeId = React.useContext(CommandScopeContext);

    React.useLayoutEffect(
        () => Commands.RegisterShortcutGroup(Struct.assign(Group, { ScopeId })),
        [ Commands, Group, ScopeId ]
    );
};

/** {@inheritDoc Shortcut} */
export interface ShortcutProps extends UseShortcutOptions
{
    readonly children?: React.ReactNode;
    readonly Command: CommandId;
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

export/**
       * Display available shortcuts in a footer.
       *
       * @category Interaction
       * @since 1.0.0
       */
const ShortcutFooter = (): React.ReactNode =>
{
    const { Commands } = UseInteraction();
    // const Shortcuts = Commands.GetActiveShortcuts();
    const Shortcuts = Commands.GetAllShortcuts();

    const Theme = useTheme();

    // const GetDisplayableShortcuts = (In: ReadonlyArray<InternalShortcut>) =>
    // {
    //     return In.filter(({ Label }: InternalShortcut) =>
    //     {
    //         return Label !== undefined;
    //     });
    // };

    const HotkeyBase = ({ Glyph, Label }: Pick<GroupShortcut, "Glyph" | "Label">): React.ReactNode =>
    {
        return (
            <Ink.Box>
                <Ink.Text color={ Theme.Name }>
                    { Glyph }
                </Ink.Text>
                <Ink.Text color={ Theme.TextMuted }>·</Ink.Text>
                <Ink.Text color={ Theme.Text }>
                    { Label }
                </Ink.Text>
            </Ink.Box>
        );
    };

    const Hotkey = ({ Keys, Label = "" }: InternalShortcut): React.ReactNode =>
    {
        const Glyph: string = Array.join(Keys, "+");
        return <HotkeyBase { ...{ Glyph, Label } } />;
    };

    const GroupHotkey = ({ Glyph, Label }: GroupShortcut): React.ReactNode =>
        <HotkeyBase { ...{ Glyph, Label } } />;

    const Groups = Commands.GetShortcutGroups();

    const UngroupedShortcuts = Array.filter(
        // GetDisplayableShortcuts(Shortcuts),
        Shortcuts,
        (InternalShortcut: InternalShortcut) => pipe(
            Groups,
            Array.map(Struct.get("Commands")),
            Array.every(
                Function.flow(
                    Array.contains(InternalShortcut.Command),
                    Boolean.not
                )
            )
        )
    );

    // eslint-disable-next-line no-console
    console.log("ALL Shortcuts: " + pipe(
        Shortcuts,
        Array.map(Struct.get("Command")),
        Array.map(CommandIdToString),
        Array.join(", ")
    ) + (UngroupedShortcuts.length === 0 ? "(None)" : ""));

    // eslint-disable-next-line no-console
    console.log("Ungrouped Shortcuts: " + pipe(
        UngroupedShortcuts,
        Array.map(Struct.get("Command")),
        Array.map(CommandIdToString),
        Array.join(", ")
    ) + (UngroupedShortcuts.length === 0 ? "(None)" : ""));

    // eslint-disable-next-line no-console
    console.log("Grouped Shortcuts: " + pipe(
        Groups,
        Array.flatMap(Struct.get("Commands")),
        Array.map(CommandIdToString),
        Array.join(", ")
    ) + (Groups.length === 0 ? "(None)" : ""));

    const { Shortcuts: ManagerShortcuts } = useCommandManager();

    // eslint-disable-next-line no-console
    console.log("Manager Shortcuts: " + pipe(
        ManagerShortcuts,
        Array.map(Struct.get("Command")),
        Array.map(CommandIdToString),
        Array.join(", ")
    ) + (ManagerShortcuts.length === 0 ? "(None)" : ""));

    return (
        <Ink.Box
            alignItems="flex-start"
            borderTop
            borderTopColor={ Theme.Border }
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-around"
            minHeight={ (UngroupedShortcuts.length + Groups.length) > 0 ? 2 : 0 }
            paddingTop={ 1 }>
            {
                UngroupedShortcuts.map((ActiveShortcut: InternalShortcut) =>
                    <Hotkey
                        { ...ActiveShortcut }
                        key={ ActiveShortcut.Keys.join("+") }
                    />)
            }
            {
                Groups.map((Group: GroupShortcut) =>
                    <GroupHotkey
                        { ...Group }
                        key={ pipe(Group.Commands, Array.map(CommandIdToString), Array.join(".")) }
                    />)
            }
        </Ink.Box>
    );
};
