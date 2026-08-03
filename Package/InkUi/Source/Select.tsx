/**
 * Ink UI component for select.
 *
 * @module @sorrell/ink-ui/Select
 *
 * @file      Select.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useRoutedInput } from "./Interaction/Shortcut.ts";
import { useTheme } from "./Theme.js";

/**
 * An item displayed by the `Select` component.
 *
 * @category Input
 * @since 1.0.0
 */
export interface SelectItem<A extends string = string>
{
    readonly Description?: string;
    readonly Disabled?: boolean;
    readonly Label: string;
    readonly Value: A;
}

/** {@inheritDoc Select} */
export interface SelectProps<A extends string = string>
{
    readonly Focused?: boolean;
    readonly Items: ReadonlyArray<SelectItem<A>>;
    readonly OnChange?: (Value: A) => void;
    readonly Open?: boolean;
    readonly Placeholder?: string;
    readonly Value?: A;
}

export/**
       * Renders a compact select control with an inline keyboard-operated menu.
       *
       * @category Input
       * @since 1.0.0
       */
const Select = <Value extends string = string>({
    Focused = true,
    Items,
    OnChange,
    Open,
    Placeholder = "Select…",
    Value
}: SelectProps<Value>): React.ReactNode =>
{
    const Theme = useTheme();
    const [ IsOpen, SetIsOpen ] = React.useState(Open ?? false);
    const SelectedIndex = Math.max(
        0,
        Items.findIndex((Item: SelectItem<Value>) => Item.Value === Value)
    );
    const [ Highlighted, SetHighlighted ] = React.useState(SelectedIndex);

    React.useEffect(() =>
    {
        if (Open !== undefined)
        {
            SetIsOpen(Open);
        }
    }, [ Open ]);

    useRoutedInput((Input: string, Key: Ink.Key) =>
    {
        if (!IsOpen && (Key.return || Input === " "))
        {
            SetHighlighted(SelectedIndex);
            SetIsOpen(true);
            return true;
        }
        if (!IsOpen)
        {
            return false;
        }
        if (Key.escape)
        {
            SetIsOpen(false);
            return true;
        }
        else if (Key.upArrow)
        {
            SetHighlighted((Current: number) => Math.max(0, Current - 1));
            return true;
        }
        else if (Key.downArrow)
        {
            SetHighlighted((Current: number) =>
                Math.min(Items.length - 1, Current + 1)
            );
            return true;
        }
        else if (Key.return)
        {
            const Item = Items[Highlighted];
            if (Item !== undefined && Item.Disabled !== true)
            {
                OnChange?.(Item.Value);
                SetIsOpen(false);
            }
            return true;
        }
        return false;
    }, { Active: Focused });

    const Selected = Items.find((Item: SelectItem<Value>) => Item.Value === Value);

    return (
        <Ink.Box flexDirection="column">
            <Ink.Text color={ Focused ? Theme.Primary : Theme.TextMuted }>
                { Selected?.Label ?? Placeholder } { IsOpen ? "▲" : "▼" }
            </Ink.Text>
            { IsOpen && (
                <Ink.Box
                    borderColor={ Theme.BorderActive }
                    borderStyle="round"
                    flexDirection="column"
                    paddingX={ 1 }>
                    { Items.map((Item: SelectItem<Value>, Index: number) => (
                        <Ink.Text
                            bold={ Index === Highlighted }
                            color={ Item.Disabled === true
                                ? Theme.TextMuted
                                : Index === Highlighted
                                    ? Theme.Primary
                                    : Theme.Text }
                            key={ Item.Value }>
                            { Index === Highlighted ? "› " : "  " }
                            { Item.Label }
                            { Item.Description === undefined
                                ? ""
                                : ` — ${ Item.Description }` }
                        </Ink.Text>
                    )) }
                </Ink.Box>
            ) }
        </Ink.Box>
    );
};
