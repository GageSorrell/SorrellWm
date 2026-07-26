/**
 *
 *
 * @module @sorrell/ink-ui/ScrollArea
 *
 * @file      ScrollArea.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    BuiltIn,
    type CommandEvent,
    type CommandHandler,
    type CommandId,
    useCommand
} from "./Interaction/Command.tsx";
import { GetKeyChordUnsafe, useShortcut, useShortcutGroup } from "./Interaction/Shortcut.ts";
import { Key } from "./Interaction/Key.ts";

/** {@inheritDoc ScrollArea} */
export interface ScrollAreaProps<A>
{
    readonly Active?: boolean;
    readonly Height: number;
    readonly Items: ReadonlyArray<A>;
    readonly OnSelect?: ((Item: A, Index: number) => void) | undefined;
    readonly RenderItem: (Item: A, Index: number, Selected: boolean) => React.ReactNode;
    readonly Index?: number;
    readonly OnChangeIndex?: ((Index: number) => void) | undefined;
}

export/**
       * Renders a keyboard-scrollable, windowed list of equally sized rows.
       *
       * @category Navigation
       * @since 1.0.0
       */
const ScrollArea = <A,>({
    Active = true,
    Height,
    Index = 0,
    Items,
    OnChangeIndex,
    OnSelect,
    RenderItem
}: ScrollAreaProps<A>): React.ReactNode =>
{
    const SafeHeight = Math.max(1, Height);
    const LastIndex = Math.max(0, Items.length - 1);
    const SafeSelected = Math.min(Math.max(0, Index), LastIndex);
    const MaximumOffset = Math.max(0, Items.length - SafeHeight);
    const Offset = Math.min(
        MaximumOffset,
        Math.max(0, SafeSelected - SafeHeight + 1)
    );

    React.useEffect(() =>
    {
        if (Index !== SafeSelected)
        {
            OnChangeIndex?.(SafeSelected);
        }
    }, [ SafeSelected, Index, OnChangeIndex ]);

    // @TODO Make this use commands instead, and allow commands
    // with keybinds to be assigned footer items arbitrarily with icons.

    // const LogCommand = (Id: CommandId) => Predicate.isSymbol(Id)
    //     ? (Symbol.keyFor(Id) ?? "UNKNOWN BUILT-IN COMMAND")
    //     : Id;

    const useScrollAreaCommand = <A,>(Id: CommandId, Listener: CommandHandler<A>) =>
    {
        useCommand<A>(
            Id,
            (Event: CommandEvent<A>) =>
            {
                Listener(Event);
            },
            { Enabled: Active && Items.length > 0 }
        );
    };

    useScrollAreaCommand(BuiltIn.Move.Up, () => OnChangeIndex?.(Math.max(0, SafeSelected - 1)));

    useScrollAreaCommand(BuiltIn.Move.PageUp, () => OnChangeIndex?.(Math.max(0, SafeSelected - SafeHeight)));

    useScrollAreaCommand(BuiltIn.Move.Down, () => OnChangeIndex?.(Math.min(LastIndex, SafeSelected + 1)));

    useScrollAreaCommand(
        BuiltIn.Move.PageDown,
        () => OnChangeIndex?.(Math.min(LastIndex, SafeSelected + SafeHeight))
    );

    useScrollAreaCommand(BuiltIn.Move.Home, () => OnChangeIndex?.(0));

    useScrollAreaCommand(BuiltIn.Move.End, () => OnChangeIndex?.(LastIndex));

    useScrollAreaCommand(BuiltIn.Commit, () =>
    {
        const Item = Items[SafeSelected];
        if (Item !== undefined)
        {
            OnSelect?.(Item, SafeSelected);
        }
    });

    useShortcut(GetKeyChordUnsafe(Key({ upArrow: true }))!, BuiltIn.Move.Up);
    useShortcut(GetKeyChordUnsafe(Key({ downArrow: true }))!, BuiltIn.Move.Down);

    useShortcut(GetKeyChordUnsafe(Key({ pageUp: true }))!, BuiltIn.Move.PageUp, { Label: "Page up" });
    useShortcut(GetKeyChordUnsafe(Key({ pageDown: true }))!, BuiltIn.Move.PageDown, { Label: "Page down" });

    useShortcut(GetKeyChordUnsafe(Key({ home: true }))!, BuiltIn.Move.Home, { Label: "Go to top" });
    useShortcut(GetKeyChordUnsafe(Key({ end: true }))!, BuiltIn.Move.End, { Label: "Go to bottom" });

    useShortcut(GetKeyChordUnsafe(Key({ return: true }))!, BuiltIn.Commit, { Label: "Select" });

    useShortcutGroup({
        Commands: [ BuiltIn.Move.Up, BuiltIn.Move.Down ],
        Glyph: "⇅",
        Label: "Move Up/Down"
    });

    // useRoutedInput((_Input: string, Key: Ink.Key) =>
    // {
    //     if (Items.length === 0)
    //     {
    //         return false;
    //     }

    //     if (Key.upArrow)
    //     {
    //         return true;
    //     }
    //     else if (Key.downArrow)
    //     {
    //         OnChangeIndex?.(Math.min(LastIndex, SafeSelected + 1));
    //         return true;
    //     }
    //     else if (Key.pageUp)
    //     {
    //         OnChangeIndex?.(Math.max(0, SafeSelected - SafeHeight));
    //         return true;
    //     }
    //     else if (Key.pageDown)
    //     {
    //         OnChangeIndex?.(Math.min(LastIndex, SafeSelected + SafeHeight));
    //         return true;
    //     }
    //     else if (Key.return)
    //     {
    //         const Item = Items[SafeSelected];
    //         if (Item !== undefined)
    //         {
    //             OnSelect?.(Item, SafeSelected);
    //         }
    //         return true;
    //     }
    //     return false;
    // }, { Active });

    return (
        <Ink.Box
            flexDirection="column"
            height={ SafeHeight }
            overflow="hidden">
            { Items.slice(Offset, Offset + SafeHeight).map((
                Item: A,
                LocalIndex: number
            ) =>
            {
                const Index = Offset + LocalIndex;
                return (
                    <Ink.Box key={ Index }>
                        { RenderItem(Item, Index, Index === SafeSelected) }
                    </Ink.Box>
                );
            }) }
        </Ink.Box>
    );
};
