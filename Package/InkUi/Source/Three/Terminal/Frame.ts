/**
 * Terminal frame model and string conversion helpers.
 *
 * @module @sorrell/ink-ui/Three/Terminal/Frame
 *
 * @file      Frame.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Color } from "./Color.js";

/**
 * Frame cell containing a glyph and optional color metadata.
 *
 * @category Frame
 * @since 1.0.0
 */
export interface FrameCell
{
    readonly Brightness: number;
    readonly Character: string;
    readonly Color?: Color | undefined;
}

/**
 * Horizontal row of terminal frame cells.
 *
 * @category Frame
 * @since 1.0.0
 */
export type FrameLine = Array<FrameCell>;

/**
 * Frame model containing terminal-ready rows of cells.
 *
 * @category Frame
 * @since 1.0.0
 */
export interface Frame
{
    readonly Lines: Array<FrameLine>;
}

/**
 * Converts a terminal frame into plain text by joining cell glyphs.
 *
 * @category Conversion
 * @since 1.0.0
 */
export function ToString(Frame: Frame): string
{
    return Frame.Lines
        .map((Line: FrameLine) => Line.map((Cell: FrameCell) => Cell.Character).join(""))
        .join("\n");
}

