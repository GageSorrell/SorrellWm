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
import { InsertAt, RemoveAt, RemoveBefore } from "./Internal/Input.tsx";
import { useRoutedInput } from "./Interaction/Shortcut.ts";
import { useTheme } from "./Theme.tsx";

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

interface CursorPosition
{
    readonly Column: number;
    readonly Row: number;
}

const GetPosition = (Value: string, Offset: number): CursorPosition =>
{
    const Before = Value.slice(0, Offset).split("\n");
    return {
        Column: Before.at(-1)?.length ?? 0,
        Row: Before.length - 1
    };
};

const GetOffset = (Value: string, Row: number, Column: number): number =>
{
    const Lines = Value.split("\n");
    const SafeRow = Math.min(Math.max(0, Row), Lines.length - 1);
    let Offset = 0;

    for (let Index = 0; Index < SafeRow; Index += 1)
    {
        Offset += (Lines[Index]?.length ?? 0) + 1;
    }

    return Offset + Math.min(Column, Lines[SafeRow]?.length ?? 0);
};

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
    const Lines = Value.split("\n");
    const Position = GetPosition(Value, Cursor);
    const ViewHeight = Math.max(1, Height);
    const ViewStart = Math.max(0, Position.Row - ViewHeight + 1);

    React.useEffect(() =>
    {
        SetCursor((Current: number) => Math.min(Current, Value.length));
    }, [ Value.length ]);

    useRoutedInput((Input: string, Key: Ink.Key) =>
    {
        if (Key.leftArrow)
        {
            SetCursor(Math.max(0, Cursor - 1));
            return true;
        }
        if (Key.rightArrow)
        {
            SetCursor(Math.min(Value.length, Cursor + 1));
            return true;
        }
        if (Key.upArrow)
        {
            SetCursor(GetOffset(Value, Position.Row - 1, Position.Column));
            return true;
        }
        if (Key.downArrow)
        {
            SetCursor(GetOffset(Value, Position.Row + 1, Position.Column));
            return true;
        }
        if (ReadOnly)
        {
            return false;
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
        if (Key.return && Key.ctrl)
        {
            OnSubmit?.(Value);
            return true;
        }
        if (Key.return)
        {
            const Next = InsertAt(Value, Cursor, "\n");
            SetCursor(Cursor + 1);
            OnChange?.(Next);
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

    if (Value.length === 0 && !Focused)
    {
        return <Ink.Text color={ Theme.TextMuted }>{ Placeholder }</Ink.Text>;
    }

    return (
        <Ink.Box
            flexDirection="column"
            height={ ViewHeight }
            overflow="hidden">
            { Lines.slice(ViewStart, ViewStart + ViewHeight).map((
                Line: string,
                LocalIndex: number
            ) =>
            {
                const Index = ViewStart + LocalIndex;
                if (Focused && Index === Position.Row)
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

                return (
                    <Ink.Text
                        color={ Theme.Text }
                        key={ Index }>
                        { RenderLine?.(Line, Index) ?? Line }
                    </Ink.Text>
                );
            }) }
        </Ink.Box>
    );
};
