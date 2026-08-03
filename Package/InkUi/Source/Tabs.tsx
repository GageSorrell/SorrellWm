/**
 * Ink UI component for tabs.
 *
 * @module @sorrell/ink-ui/Tabs
 *
 * @file      Tabs.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useRoutedInput } from "./Interaction/Shortcut.ts";
import { useTheme } from "./Theme.js";

/**
 * An item displayed as a tab.
 *
 * @category Navigation
 * @since 1.0.0
 */
export interface TabItem
{
    readonly Id: string;
    readonly Label: string;
}

/** {@inheritDoc Tabs} */
export interface TabsProps
{
    readonly Active?: boolean;
    readonly Items: ReadonlyArray<TabItem>;
    readonly OnChange?: ((Id: string) => void) | undefined;
    readonly Value: string;
}

export/**
       * Displays a horizontal tab list with optional keyboard navigation.
       *
       * @category Navigation
       * @since 1.0.0
       */
const Tabs = ({
    Active = true,
    Items,
    OnChange,
    Value
}: TabsProps): React.ReactNode =>
{
    const Theme = useTheme();
    const Index = Math.max(0, Items.findIndex((Item: TabItem) => Item.Id === Value));

    useRoutedInput((Input: string, Key: Ink.Key) =>
    {
        if (Items.length === 0)
        {
            return false;
        }

        if (Key.leftArrow || Input === "h")
        {
            const Previous = Items[(Index - 1 + Items.length) % Items.length];
            if (Previous !== undefined)
            {
                OnChange?.(Previous.Id);
            }
            return true;
        }
        else if (Key.rightArrow || Input === "l")
        {
            const Next = Items[(Index + 1) % Items.length];
            if (Next !== undefined)
            {
                OnChange?.(Next.Id);
            }
            return true;
        }
        return false;
    }, { Active });

    return (
        <Ink.Box gap={ 2 }>
            { Items.map((Item: TabItem) =>
            {
                const IsActive = Item.Id === Value;
                return (
                    <Ink.Text
                        bold={ IsActive }
                        color={ IsActive ? Theme.Primary : Theme.TextMuted }
                        key={ Item.Id }
                        underline={ IsActive }>
                        { Item.Label }
                    </Ink.Text>
                );
            }) }
        </Ink.Box>
    );
};
