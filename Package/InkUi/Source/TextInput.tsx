/**
 *
 *
 * @module @sorrell/ink-ui/TextInput
 *
 * @file      TextInput.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { InsertAt, RemoveAt, RemoveBefore } from "./Internal/Input.tsx";
import { useRoutedInput } from "./Interaction/Shortcut.ts";
import { useTheme } from "./Theme.js";

/** {@inheritDoc TextInput} */
export interface TextInputProps
{
    readonly Focused?: boolean;
    readonly Mask?: string;
    readonly OnChange?: ((Value: string) => void) | undefined;
    readonly OnSubmit?: ((Value: string) => void) | undefined;
    readonly Placeholder?: string | undefined;
    readonly Value: string;
}

export/**
       * Provides a controlled, single-line text input using Ink keyboard events.
       *
       * @category Input
       * @since 1.0.0
       */
const TextInput = ({
    Focused = true,
    Mask,
    OnChange,
    OnSubmit,
    Placeholder = "",
    Value
}: TextInputProps): React.ReactNode =>
{
    const Theme = useTheme();
    const [ Cursor, SetCursor ] = React.useState(Value.length);

    React.useEffect(() =>
    {
        SetCursor((Current: number) => Math.min(Current, Value.length));
    }, [ Value.length ]);

    useRoutedInput((Input: string, Key: Ink.Key) =>
    {
        if (Key.leftArrow)
        {
            SetCursor((Current: number) => Math.max(0, Current - 1));
            return true;
        }
        if (Key.rightArrow)
        {
            SetCursor((Current: number) => Math.min(Value.length, Current + 1));
            return true;
        }
        if (Key.backspace)
        {
            const Next = RemoveBefore(Value, Cursor);
            if (Next !== Value)
            {
                SetCursor(Cursor - 1);
                OnChange?.(Next);
            }
            return true;
        }
        if (Key.delete)
        {
            OnChange?.(RemoveAt(Value, Cursor));
            return true;
        }
        if (Key.return)
        {
            OnSubmit?.(Value);
            return true;
        }
        if (Input.length > 0 && !Key.ctrl && !Key.meta)
        {
            const Next = InsertAt(Value, Cursor, Input);
            SetCursor(Cursor + Input.length);
            OnChange?.(Next);
            return true;
        }
        return false;
    }, { Active: Focused });

    if (!Focused)
    {
        return (
            <Ink.Text color={ Value.length === 0 ? Theme.TextMuted : Theme.Text }>
                { Value.length === 0 ? Placeholder : Mask?.repeat(Value.length) ?? Value }
            </Ink.Text>
        );
    }

    const DisplayValue = Mask?.repeat(Value.length) ?? Value;
    const Before = DisplayValue.slice(0, Cursor);
    const Current = DisplayValue[Cursor] ?? " ";
    const After = DisplayValue.slice(Cursor + 1);

    return (
        <Ink.Text color={ Theme.Text }>
            { Before }
            <Ink.Text
                backgroundColor={ Theme.Primary }
                color={ Theme.Background }>
                { Current }
            </Ink.Text>
            { After }
        </Ink.Text>
    );
};
