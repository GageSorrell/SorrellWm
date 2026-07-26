/**
 * Ink-native input and selection components.
 *
 * @module @sorrell/ink-ui/Internal/Input
 * @internal
 *
 * @file      Input.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Ink from "ink";

export/**
       * Insert a substring.
       *
       * @since 1.0.0
       */
const InsertAt = (Value: string, Offset: number, Insertion: string): string =>
    Value.slice(0, Offset) + Insertion + Value.slice(Offset);

export/**
       * Remove before a substring.
       *
       * @since 1.0.0
       */
const RemoveBefore = (Value: string, Offset: number): string =>
    Offset === 0 ? Value : Value.slice(0, Offset - 1) + Value.slice(Offset);

export/**
       * Remove a substring at a given offset.
       *
       * @since 1.0.0
       */
const RemoveAt = (Value: string, Offset: number): string =>
    Value.slice(0, Offset) + Value.slice(Offset + 1);

/** A normalized, half-open text selection. */
export interface TextSelection
{
    readonly End: number;
    readonly Start: number;
}

/** Options that influence editor-style cursor navigation. */
export interface TextNavigationOptions
{
    readonly Multiline?: boolean;
    readonly PageRows?: number;
    readonly PreferredColumn?: number | undefined;
}

/** The result of replacing either a selection or the insertion point. */
export interface TextReplacement
{
    readonly Cursor: number;
    readonly Value: string;
}

export/** Return a non-empty normalized selection. */
const GetTextSelection = (
    Anchor: number | undefined,
    Cursor: number
): TextSelection | undefined =>
{
    if (Anchor === undefined || Anchor === Cursor)
    {
        return undefined;
    }
    return {
        End: Math.max(Anchor, Cursor),
        Start: Math.min(Anchor, Cursor)
    };
};

export/** Replace the active selection, or insert at the cursor when none exists. */
const ReplaceTextSelection = (
    Value: string,
    Cursor: number,
    Anchor: number | undefined,
    Insertion: string
): TextReplacement =>
{
    const Selection: TextSelection | undefined = GetTextSelection(Anchor, Cursor);
    const Start: number = Selection?.Start ?? Cursor;
    const End: number = Selection?.End ?? Cursor;
    return {
        Cursor: Start + Insertion.length,
        Value: Value.slice(0, Start) + Insertion + Value.slice(End)
    };
};

export/** Remove the active selection, if one exists. */
const RemoveTextSelection = (
    Value: string,
    Cursor: number,
    Anchor: number | undefined
): TextReplacement | undefined =>
{
    const Selection: TextSelection | undefined = GetTextSelection(Anchor, Cursor);
    if (Selection === undefined)
    {
        return undefined;
    }
    return {
        Cursor: Selection.Start,
        Value: Value.slice(0, Selection.Start) + Value.slice(Selection.End)
    };
};

export/** Move to the beginning of the previous word-like segment. */
const GetPreviousWordOffset = (Value: string, Cursor: number): number =>
{
    let Offset: number = ClampOffset(Value, Cursor);
    while (Offset > 0 && IsWhitespace(Value[Offset - 1] ?? ""))
    {
        Offset -= 1;
    }
    if (Offset === 0)
    {
        return 0;
    }

    const Word: boolean = IsWordCharacter(Value[Offset - 1] ?? "");
    while (Offset > 0)
    {
        const Character: string = Value[Offset - 1] ?? "";
        if (IsWhitespace(Character) || IsWordCharacter(Character) !== Word)
        {
            break;
        }
        Offset -= 1;
    }
    return Offset;
};

export/** Move to the beginning of the next word-like segment. */
const GetNextWordOffset = (Value: string, Cursor: number): number =>
{
    let Offset: number = ClampOffset(Value, Cursor);
    if (Offset < Value.length && !IsWhitespace(Value[Offset] ?? ""))
    {
        const Word: boolean = IsWordCharacter(Value[Offset] ?? "");
        while (Offset < Value.length)
        {
            const Character: string = Value[Offset] ?? "";
            if (IsWhitespace(Character) || IsWordCharacter(Character) !== Word)
            {
                break;
            }
            Offset += 1;
        }
    }
    while (Offset < Value.length && IsWhitespace(Value[Offset] ?? ""))
    {
        Offset += 1;
    }
    return Offset;
};

export/** Convert an absolute string offset to a zero-based row and column. */
const GetTextPosition = (
    Value: string,
    Offset: number
): { readonly Column: number; readonly Row: number } =>
{
    const Before: ReadonlyArray<string> = Value.slice(0, ClampOffset(Value, Offset)).split("\n");
    return {
        Column: Before.at(-1)?.length ?? 0,
        Row: Before.length - 1
    };
};

export/** Convert a row and column into an absolute string offset. */
const GetTextOffset = (Value: string, Row: number, Column: number): number =>
{
    const Lines: ReadonlyArray<string> = Value.split("\n");
    const SafeRow: number = Math.min(Math.max(0, Row), Lines.length - 1);
    let Offset = 0;
    for (let Index = 0; Index < SafeRow; Index += 1)
    {
        Offset += (Lines[Index]?.length ?? 0) + 1;
    }
    return Offset + Math.min(Math.max(0, Column), Lines[SafeRow]?.length ?? 0);
};

export/** Determine whether a key participates in text navigation. */
const IsTextNavigationKey = (Key: Ink.Key): boolean =>
    Key.leftArrow || Key.rightArrow || Key.upArrow || Key.downArrow
    || Key.pageUp || Key.pageDown || Key.home || Key.end;

export/** Recognize SGR mouse reports after Ink has removed their leading escape byte. */
const IsTerminalMouseInput = (Input: string): boolean =>
    /^\[<\d+;\d+;\d+[Mm]$/u.test(Input);

export/** Resolve editor-style character, word, line, page, paragraph, and document movement. */
const GetTextNavigationOffset = (
    Value: string,
    Cursor: number,
    Key: Ink.Key,
    {
        Multiline = false,
        PageRows = 1,
        PreferredColumn
    }: TextNavigationOptions = { }
): number =>
{
    const SafeCursor: number = ClampOffset(Value, Cursor);
    if (Key.leftArrow)
    {
        return Key.ctrl ? GetPreviousWordOffset(Value, SafeCursor) : Math.max(0, SafeCursor - 1);
    }
    if (Key.rightArrow)
    {
        return Key.ctrl ? GetNextWordOffset(Value, SafeCursor) : Math.min(Value.length, SafeCursor + 1);
    }
    if (!Multiline)
    {
        return Key.home || Key.upArrow || Key.pageUp ? 0
            : Key.end || Key.downArrow || Key.pageDown ? Value.length
                : SafeCursor;
    }

    const Position = GetTextPosition(Value, SafeCursor);
    const Column: number = PreferredColumn ?? Position.Column;
    if (Key.home)
    {
        return Key.ctrl ? 0 : GetTextOffset(Value, Position.Row, 0);
    }
    if (Key.end)
    {
        return Key.ctrl
            ? Value.length
            : GetTextOffset(Value, Position.Row, Number.POSITIVE_INFINITY);
    }
    if (Key.pageUp)
    {
        return Key.ctrl ? 0 : GetTextOffset(Value, Position.Row - Math.max(1, PageRows), Column);
    }
    if (Key.pageDown)
    {
        return Key.ctrl
            ? Value.length
            : GetTextOffset(Value, Position.Row + Math.max(1, PageRows), Column);
    }
    if (Key.upArrow)
    {
        return Key.ctrl
            ? GetParagraphOffset(Value, Position.Row, -1)
            : GetTextOffset(Value, Position.Row - 1, Column);
    }
    if (Key.downArrow)
    {
        return Key.ctrl
            ? GetParagraphOffset(Value, Position.Row, 1)
            : GetTextOffset(Value, Position.Row + 1, Column);
    }
    return SafeCursor;
};

const ClampOffset = (Value: string, Offset: number): number =>
    Math.min(Value.length, Math.max(0, Offset));

const IsWhitespace = (Character: string): boolean => /\s/u.test(Character);
const IsWordCharacter = (Character: string): boolean => /[\p{L}\p{N}_]/u.test(Character);

const GetParagraphOffset = (Value: string, Row: number, Direction: -1 | 1): number =>
{
    const Lines: ReadonlyArray<string> = Value.split("\n");
    if (Direction < 0)
    {
        let Target: number = Math.max(0, Row - 1);
        while (Target > 0 && (Lines[Target] ?? "").trim().length === 0)
        {
            Target -= 1;
        }
        while (Target > 0 && (Lines[Target - 1] ?? "").trim().length > 0)
        {
            Target -= 1;
        }
        return GetTextOffset(Value, Target, 0);
    }

    let Target: number = Math.min(Lines.length - 1, Row + 1);
    while (Target < Lines.length - 1 && (Lines[Target] ?? "").trim().length > 0)
    {
        Target += 1;
    }
    while (Target < Lines.length - 1 && (Lines[Target] ?? "").trim().length === 0)
    {
        Target += 1;
    }
    return Target === Lines.length - 1 && (Lines[Target] ?? "").trim().length > 0
        ? Value.length
        : GetTextOffset(Value, Target, 0);
};
