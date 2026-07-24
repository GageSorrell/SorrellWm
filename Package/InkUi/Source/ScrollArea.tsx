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
import { useRoutedInput } from "./Interaction/Shortcut.ts";
import { useCommand } from "./Interaction/Command.tsx";

/** {@inheritDoc ScrollArea} */
export interface ScrollAreaProps<A>
{
    readonly Active?: boolean;
    readonly Height: number;
    readonly Items: ReadonlyArray<A>;
    readonly OnSelect?: ((Item: A, Index: number) => void) | undefined;
    readonly RenderItem: (Item: A, Index: number, Selected: boolean) => React.ReactNode;
    readonly SelectedIndex?: number;
    readonly SetSelectedIndex?: ((Index: number) => void) | undefined;
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
    Items,
    OnSelect,
    RenderItem,
    SelectedIndex = 0,
    SetSelectedIndex
}: ScrollAreaProps<A>): React.ReactNode =>
{
    const SafeHeight = Math.max(1, Height);
    const LastIndex = Math.max(0, Items.length - 1);
    const SafeSelected = Math.min(Math.max(0, SelectedIndex), LastIndex);
    const MaximumOffset = Math.max(0, Items.length - SafeHeight);
    const Offset = Math.min(
        MaximumOffset,
        Math.max(0, SafeSelected - SafeHeight + 1)
    );

    React.useEffect(() =>
    {
        if (SelectedIndex !== SafeSelected)
        {
            SetSelectedIndex?.(SafeSelected);
        }
    }, [ SafeSelected, SelectedIndex, SetSelectedIndex ]);

    // @TODO Make this use commands instead, and allow commands
    // with keybinds to be assigned footer items arbitrarily with icons.

    useRoutedInput((_Input: string, Key: Ink.Key) =>
    {
        if (Items.length === 0)
        {
            return false;
        }

        if (Key.upArrow)
        {
            SetSelectedIndex?.(Math.max(0, SafeSelected - 1));
            return true;
        }
        else if (Key.downArrow)
        {
            SetSelectedIndex?.(Math.min(LastIndex, SafeSelected + 1));
            return true;
        }
        else if (Key.pageUp)
        {
            SetSelectedIndex?.(Math.max(0, SafeSelected - SafeHeight));
            return true;
        }
        else if (Key.pageDown)
        {
            SetSelectedIndex?.(Math.min(LastIndex, SafeSelected + SafeHeight));
            return true;
        }
        else if (Key.return)
        {
            const Item = Items[SafeSelected];
            if (Item !== undefined)
            {
                OnSelect?.(Item, SafeSelected);
            }
            return true;
        }
        return false;
    }, { Active });

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
