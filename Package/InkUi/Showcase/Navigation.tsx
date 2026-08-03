/**
 * Navigation state and controls for the Ink UI showcase.
 *
 * @module @sorrell/ink-ui/Showcase/Navigation
 *
 * @file      Navigation.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { type FocusableState, useFocusable, useRoutedInput } from "../Source/Interaction/index.js";
import { Box } from "../Source/Box/index.js";
import type { ComponentStory } from "./Story.js";
import { GradientBadge } from "../Source/Badge/index.js";
import { useTheme } from "../Source/Theme.js";

export interface NavigationProps
{
    readonly AutoFocus?: boolean;
    readonly Collapsed: boolean;
    readonly Height: number;
    readonly Id?: string;
    readonly Items: ReadonlyArray<ComponentStory>;
    readonly OnCollapse: () => void;
    readonly OnExit: () => void;
    readonly OnFocus?: (() => void) | undefined;
    readonly OnSearchActiveChange: (Active: boolean) => void;
    readonly OnSearchChange: (Value: string) => void;
    readonly OnSelect: (Story: ComponentStory) => void;
    readonly OnSelectedChange: (Index: number) => void;
    readonly Order?: number;
    readonly Search: string;
    readonly SearchActive: boolean;
    readonly Selected: number;
}

export function Navigation({
    AutoFocus = false,
    Collapsed,
    Height,
    Id,
    Items,
    OnCollapse,
    OnExit,
    OnFocus,
    OnSearchActiveChange,
    OnSearchChange,
    OnSelect,
    OnSelectedChange,
    Order = 0,
    Search,
    SearchActive,
    Selected
}: NavigationProps): React.ReactElement
{
    const Theme = useTheme();
    const HandleBlur = React.useCallback((): void =>
    {
        OnSearchActiveChange(false);
    }, [ OnSearchActiveChange ]);
    const Focus: FocusableState = useFocusable({
        AutoFocus,
        ...(Id === undefined ? { } : { Id }),
        OnBlur: HandleBlur,
        OnFocus,
        Order
    });

    useRoutedInput((Input: string, Key: Ink.Key): boolean =>
    {
        if (SearchActive)
        {
            if (Key.tab)
            {
                return false;
            }
            if (Key.escape)
            {
                OnSearchActiveChange(false);
            }
            else if (Key.return)
            {
                const Item = Items[Selected];
                if (Item !== undefined)
                {
                    OnSelect(Item);
                }

                OnSearchActiveChange(false);
            }
            else if (Key.upArrow)
            {
                OnSelectedChange(Math.max(0, Selected - 1));
            }
            else if (Key.downArrow)
            {
                OnSelectedChange(Math.max(0, Math.min(Items.length - 1, Selected + 1)));
            }
            else if (Key.backspace || Key.delete)
            {
                OnSearchChange(Search.slice(0, -1));
                OnSelectedChange(0);
            }
            else if (Input.length > 0 && !Key.ctrl && !Key.meta)
            {
                OnSearchChange(Search + Input);
                OnSelectedChange(0);
            }
            return true;
        }
        if (Input === "/")
        {
            OnSearchActiveChange(true);
            return true;
        }
        if (Key.escape)
        {
            OnExit();
            return true;
        }
        if (Key.upArrow || Input === "k")
        {
            OnSelectedChange(Math.max(0, Selected - 1));
            return true;
        }
        if (Key.downArrow || Input === "j")
        {
            OnSelectedChange(Math.max(0, Math.min(Items.length - 1, Selected + 1)));
            return true;
        }
        if (Key.return)
        {
            const Item = Items[Selected];
            if (Item !== undefined)
            {
                OnSelect(Item);
            }

            return true;
        }
        return false;
    }, { Active: Focus.Focused, Priority: 100 });

    if (Collapsed)
    {
        return (
            <Box
                borderColor={ Theme.Border }
                borderRight
                flexDirection="column"
                onClick={ () =>
                {
                    Focus.Focus();
                    OnCollapse();
                } }
                onMouseDown={ () => Focus.Focus() }
                width={ 4 }>
                <Ink.Text color={ Theme.Primary }>»</Ink.Text>
            </Box>
        );
    }
    const ListHeight = Math.max(1, Height - 5);
    const Offset = Math.min(
        Math.max(0, Items.length - ListHeight),
        Math.max(0, Selected - ListHeight + 1)
    );
    return (
        <Box
            borderColor={ Focus.Focused ? Theme.BorderActive : Theme.Border }
            borderRight
            flexDirection="column"
            onMouseDown={ () => Focus.Focus() }
            paddingRight={ 1 }
            width={ 30 }>
            <Ink.Box justifyContent="space-between">
                <GradientBadge
                    From={ Theme.Primary }
                    Text="@sorrell/ink-ui"
                    To={ Theme.Secondary }
                />
                <Box onClick={ OnCollapse }>
                    <Ink.Text color={ Theme.TextMuted }>
                        «
                    </Ink.Text>
                </Box>
            </Ink.Box>
            <Box
                borderColor={ SearchActive ? Theme.Primary : Theme.Border }
                borderStyle="round"
                onClick={ () =>
                {
                    Focus.Focus();
                    OnSearchActiveChange(true);
                } }
                paddingX={ 1 }>
                <Ink.Text color={ Search.length > 0 ? Theme.Text : Theme.TextMuted }>
                    { Search.length > 0 ? Search : "/ Search components" }
                    { SearchActive ? "▌" : "" }
                </Ink.Text>
            </Box>
            <Ink.Text color={ Theme.TextMuted }>Components ({ Items.length })</Ink.Text>
            <Ink.Box flexDirection="column"
                overflow="hidden">
                { Items.slice(Offset, Offset + ListHeight).map((Item: ComponentStory, LocalIndex: number) =>
                {
                    const Index = Offset + LocalIndex;
                    return (
                        <Box
                            { ...(Index === Selected
                                ? { backgroundColor: Theme.BackgroundElement }
                                : { }) }
                            key={ Item.Name }
                            onClick={ () =>
                            {
                                Focus.Focus();
                                OnSelect(Item);
                            } }
                            paddingLeft={ 1 }>
                            <Ink.Text
                                bold={ Index === Selected }
                                color={ Index === Selected ? Theme.Primary : Theme.Text }>
                                { Index === Selected ? "› " : "  " }{ Item.Name }
                            </Ink.Text>
                        </Box>
                    );
                }) }
            </Ink.Box>
        </Box>
    );
}
