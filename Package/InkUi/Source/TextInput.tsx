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
import { Box, type BoxMouseDownEvent, type BoxMouseDragEvent } from "./Box/index.js";
import {
    GetNextWordOffset,
    GetPreviousWordOffset,
    GetTextNavigationOffset,
    GetTextSelection,
    IsTerminalMouseInput,
    IsTextNavigationKey,
    RemoveAt,
    RemoveBefore,
    RemoveTextSelection,
    ReplaceTextSelection,
    type TextReplacement,
    type TextSelection
} from "./Internal/Input.js";
import { Button as MouseButton } from "./Mouse/index.js";
import { useRoutedInput } from "./Interaction/Shortcut.js";
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
    const [ SelectionAnchor, SetSelectionAnchor ] = React.useState<number | undefined>(undefined);
    const MouseAnchorReference = React.useRef<number | undefined>(undefined);
    const Selection: TextSelection | undefined = GetTextSelection(SelectionAnchor, Cursor);

    React.useEffect(() =>
    {
        SetCursor((Current: number) => Math.min(Current, Value.length));
        SetSelectionAnchor((Current: number | undefined) => Current === undefined
            ? undefined
            : Math.min(Current, Value.length));
    }, [ Value.length ]);

    React.useEffect(() =>
    {
        if (!Focused)
        {
            SetSelectionAnchor(undefined);
            MouseAnchorReference.current = undefined;
        }
    }, [ Focused ]);

    const MoveCursor = React.useCallback((Target: number, Extend: boolean): void =>
    {
        SetSelectionAnchor((Current: number | undefined) => Extend
            ? (Current ?? Cursor)
            : undefined);
        SetCursor(Target);
    }, [ Cursor ]);

    const ApplyReplacement = React.useCallback((Replacement: TextReplacement): void =>
    {
        SetCursor(Replacement.Cursor);
        SetSelectionAnchor(undefined);
        OnChange?.(Replacement.Value);
    }, [ OnChange ]);

    useRoutedInput((Input: string, Key: Ink.Key) =>
    {
        if (IsTerminalMouseInput(Input))
        {
            return false;
        }
        if (IsTextNavigationKey(Key))
        {
            MoveCursor(GetTextNavigationOffset(Value, Cursor, Key), Key.shift);
            return true;
        }
        if (Key.backspace)
        {
            const Removed: TextReplacement | undefined = RemoveTextSelection(
                Value,
                Cursor,
                SelectionAnchor
            );
            if (Removed !== undefined)
            {
                ApplyReplacement(Removed);
                return true;
            }
            if (Key.ctrl)
            {
                const Target: number = GetPreviousWordOffset(Value, Cursor);
                ApplyReplacement({
                    Cursor: Target,
                    Value: Value.slice(0, Target) + Value.slice(Cursor)
                });
                return true;
            }
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
            const Removed: TextReplacement | undefined = RemoveTextSelection(
                Value,
                Cursor,
                SelectionAnchor
            );
            if (Removed !== undefined)
            {
                ApplyReplacement(Removed);
                return true;
            }
            if (Key.ctrl)
            {
                const Target: number = GetNextWordOffset(Value, Cursor);
                ApplyReplacement({ Cursor, Value: Value.slice(0, Cursor) + Value.slice(Target) });
                return true;
            }
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
            ApplyReplacement(ReplaceTextSelection(Value, Cursor, SelectionAnchor, Input));
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
    const MouseOffset = (X: number): number => Math.min(Value.length, Math.max(0, X));
    const OnMouseDown = (Event: BoxMouseDownEvent): void =>
    {
        if (!Focused || Event.Button !== MouseButton.Left)
        {
            return;
        }
        const Target: number = MouseOffset(Event.LocalPosition.X);
        const Anchor: number = Event.Modifiers.Shift
            ? (SelectionAnchor ?? Cursor)
            : Target;
        MouseAnchorReference.current = Anchor;
        SetSelectionAnchor(Event.Modifiers.Shift ? Anchor : undefined);
        SetCursor(Target);
    };
    const OnMouseDrag = (Event: BoxMouseDragEvent): void =>
    {
        if (!Focused || Event.Button !== MouseButton.Left)
        {
            return;
        }
        const Anchor: number = MouseAnchorReference.current ?? Cursor;
        SetSelectionAnchor(Anchor);
        SetCursor(MouseOffset(Event.LocalPosition.X));
    };

    return (
        <Box
            onMouseDown={ OnMouseDown }
            onMouseDrag={ OnMouseDrag }>
            <Ink.Text color={ Theme.Text }>
                { Selection === undefined
                    ? <>
                        { DisplayValue.slice(0, Cursor) }
                        <Ink.Text
                            backgroundColor={ Theme.Primary }
                            color={ Theme.Background }>
                            { DisplayValue[Cursor] ?? " " }
                        </Ink.Text>
                        { DisplayValue.slice(Cursor + 1) }
                    </>
                    : <>
                        { DisplayValue.slice(0, Selection.Start) }
                        <Ink.Text
                            backgroundColor={ Theme.Primary }
                            color={ Theme.Background }>
                            { DisplayValue.slice(Selection.Start, Selection.End) }
                        </Ink.Text>
                        { DisplayValue.slice(Selection.End) }
                    </> }
            </Ink.Text>
        </Box>
    );
};
