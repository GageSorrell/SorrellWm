/**
 *
 *
 * @module @sorrell/ink-ui/TextArea
 *
 * @file      TextArea.tsx
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
    GetTextOffset,
    GetTextPosition,
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

/** {@inheritDoc TextArea} */
export interface TextAreaProps
{
    readonly Focused?: boolean;
    readonly Height?: number;
    readonly OnChange?: ((Value: string) => void) | undefined;
    readonly OnSubmit?: ((Value: string) => void) | undefined;
    readonly Placeholder?: string;
    readonly ReadOnly?: boolean;
    readonly RenderLine?: (Line: string, Index: number) => React.ReactNode;
    readonly Value: string;
}

export/**
       * Provides a controlled multiline editor with cursor and viewport handling.
       *
       * @category Input
       * @since 1.0.0
       */
const TextArea = ({
    Focused = true,
    Height = 6,
    OnChange,
    OnSubmit,
    Placeholder = "",
    ReadOnly = false,
    RenderLine,
    Value
}: TextAreaProps): React.ReactNode =>
{
    const Theme = useTheme();
    const [ Cursor, SetCursor ] = React.useState(Value.length);
    const [ SelectionAnchor, SetSelectionAnchor ] = React.useState<number | undefined>(undefined);
    const MouseAnchorReference = React.useRef<number | undefined>(undefined);
    const PreferredColumnReference = React.useRef<number | undefined>(undefined);
    const Lines = Value.split("\n");
    const Position = GetTextPosition(Value, Cursor);
    const ViewHeight = Math.max(1, Height);
    const [ ViewStart, SetViewStart ] = React.useState(
        Math.max(0, Position.Row - ViewHeight + 1)
    );
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
        SetViewStart((Current: number) =>
        {
            if (Position.Row < Current)
            {
                return Position.Row;
            }
            if (Position.Row >= Current + ViewHeight)
            {
                return Position.Row - ViewHeight + 1;
            }
            return Math.min(Current, Math.max(0, Lines.length - ViewHeight));
        });
    }, [ Lines.length, Position.Row, ViewHeight ]);

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
        PreferredColumnReference.current = undefined;
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
            const IsVertical: boolean = !Key.ctrl
                && (Key.upArrow || Key.downArrow || Key.pageUp || Key.pageDown);
            if (IsVertical && PreferredColumnReference.current === undefined)
            {
                PreferredColumnReference.current = Position.Column;
            }
            else if (!IsVertical)
            {
                PreferredColumnReference.current = undefined;
            }
            MoveCursor(GetTextNavigationOffset(Value, Cursor, Key, {
                Multiline: true,
                PageRows: ViewHeight,
                PreferredColumn: PreferredColumnReference.current
            }), Key.shift);
            return true;
        }
        if (ReadOnly)
        {
            return false;
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
        if (Key.return && Key.ctrl)
        {
            OnSubmit?.(Value);
            return true;
        }
        if (Key.return)
        {
            ApplyReplacement(ReplaceTextSelection(Value, Cursor, SelectionAnchor, "\n"));
            return true;
        }
        if (Input.length > 0 && !Key.ctrl && !Key.meta)
        {
            ApplyReplacement(ReplaceTextSelection(Value, Cursor, SelectionAnchor, Input));
            return true;
        }
        return false;
    }, { Active: Focused });

    if (Value.length === 0 && !Focused)
    {
        return <Ink.Text color={ Theme.TextMuted }>{ Placeholder }</Ink.Text>;
    }

    const MouseOffset = (X: number, Y: number): number => GetTextOffset(
        Value,
        ViewStart + Math.max(0, Y),
        Math.max(0, X)
    );
    const OnMouseDown = (Event: BoxMouseDownEvent): void =>
    {
        if (!Focused || Event.Button !== MouseButton.Left)
        {
            return;
        }
        const Target: number = MouseOffset(Event.LocalPosition.X, Event.LocalPosition.Y);
        const Anchor: number = Event.Modifiers.Shift
            ? (SelectionAnchor ?? Cursor)
            : Target;
        PreferredColumnReference.current = undefined;
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
        PreferredColumnReference.current = undefined;
        SetSelectionAnchor(Anchor);
        SetCursor(MouseOffset(Event.LocalPosition.X, Event.LocalPosition.Y));
    };

    return (
        <Box
            flexDirection="column"
            height={ ViewHeight }
            onMouseDown={ OnMouseDown }
            onMouseDrag={ OnMouseDrag }
            overflow="hidden">
            { Lines.slice(ViewStart, ViewStart + ViewHeight).map((
                Line: string,
                LocalIndex: number
            ) =>
            {
                const Index = ViewStart + LocalIndex;
                const LineStart: number = GetTextOffset(Value, Index, 0);
                const SelectedStart: number = Selection === undefined
                    ? 0
                    : Math.max(0, Selection.Start - LineStart);
                const SelectedEnd: number = Selection === undefined
                    ? 0
                    : Math.min(Line.length, Selection.End - LineStart);
                const SelectsLine: boolean = Selection !== undefined
                    && Selection.Start <= LineStart + Line.length
                    && Selection.End > LineStart;
                const SelectsNewline: boolean = Selection !== undefined
                    && Index < Lines.length - 1
                    && Selection.Start <= LineStart + Line.length
                    && Selection.End > LineStart + Line.length;
                if (Focused && Selection === undefined && Index === Position.Row)
                {
                    return (
                        <Ink.Text
                            color={ Theme.Text }
                            key={ Index }>
                            { Line.slice(0, Position.Column) }
                            <Ink.Text
                                backgroundColor={ Theme.Primary }
                                color={ Theme.Background }>
                                { Line[Position.Column] ?? " " }
                            </Ink.Text>
                            { Line.slice(Position.Column + 1) }
                        </Ink.Text>
                    );
                }

                if (Focused && SelectsLine)
                {
                    return (
                        <Ink.Text
                            color={ Theme.Text }
                            key={ Index }>
                            { Line.slice(0, SelectedStart) }
                            <Ink.Text
                                backgroundColor={ Theme.Primary }
                                color={ Theme.Background }>
                                { Line.slice(SelectedStart, SelectedEnd) }
                                { SelectsNewline ? " " : "" }
                            </Ink.Text>
                            { Line.slice(SelectedEnd) }
                        </Ink.Text>
                    );
                }

                return (
                    <Ink.Text
                        color={ Theme.Text }
                        key={ Index }>
                        { RenderLine?.(Line, Index) ?? Line }
                    </Ink.Text>
                );
            }) }
        </Box>
    );
};
