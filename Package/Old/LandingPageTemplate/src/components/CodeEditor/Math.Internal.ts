/**
 * @file      Math.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FCursorPosition } from "./CodeEditor.Types";
import type { FCursorPositionResolved } from "./CodeEditor.Internal.Types";

export function ClampNumber(
    Value: number,
    Minimum: number,
    Maximum: number
): number
{
    return Math.max(Minimum, Math.min(Maximum, Value));
}

export function GetNormalizedCursorPosition(
    Code: string,
    CursorPosition: FCursorPositionResolved
): FCursorPosition
{
    const RawLines: Array<string> = Code.split("\n");

    const RequestedLineIndex: number = Math.trunc(CursorPosition[0]);
    const LineIndex: number = ClampNumber(
        RequestedLineIndex,
        0,
        Math.max(0, RawLines.length - 1)
    );

    const RawLine: string = RawLines[LineIndex] ?? "";
    const RequestedColumnIndex: number = Math.trunc(CursorPosition[1]);
    const ColumnIndex: number = ClampNumber(
        RequestedColumnIndex,
        0,
        RawLine.length
    );

    return [ LineIndex, ColumnIndex ];
}

export function GetValidatedInsertionPosition(
    Code: string,
    Position: FCursorPosition
): FCursorPosition
{
    const CodeLines: Array<string> = Code.split("\n");

    const LineIndex: number = Math.trunc(Position[0]);
    const ColumnIndex: number = Math.trunc(Position[1]);

    if (LineIndex < 0 || LineIndex > CodeLines.length)
    {
        throw new RangeError(`The insertion line ${ LineIndex } does not exist.`);
    }

    const LineText: string = CodeLines[LineIndex] ?? "";

    if (ColumnIndex < 0 || ColumnIndex > LineText.length)
    {
        throw new RangeError(`The insertion position ${ ColumnIndex } is outside line ${ LineIndex }.`);
    }

    return [ LineIndex, ColumnIndex ];
}

export function GetValidatedLineInsertionIndex(
    Code: string,
    LineIndex: number
): number
{
    const CodeLines: Array<string> = Code.split("\n");
    const NormalizedLineIndex: number = Math.trunc(LineIndex);

    if (
        NormalizedLineIndex < 0
        || NormalizedLineIndex > CodeLines.length
    )
    {
        throw new RangeError(`The line insertion index ${ NormalizedLineIndex } is outside the code.`);
    }

    return NormalizedLineIndex;
}
