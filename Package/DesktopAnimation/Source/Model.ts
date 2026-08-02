/**
 * Types describing desktop animation scenes and their timeline steps.
 *
 * @module @sorrell/desktop-animation/Model
 *
 * @file      Model.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";

/**
 * The type identifier for this module.
 *
 * @category Constant
 * @since 1.0.0
 */
export const TypeId = "~sorrell/desktop-animation/Model" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Position in logical canvas pixels.
 *
 * @category Model
 * @since 1.0.0
 */
export interface Point
{
    readonly X: number;
    readonly Y: number;
}

/**
 * Size in logical canvas pixels.
 *
 * @category Model
 * @since 1.0.0
 */
export interface Size
{
    readonly Height: number;
    readonly Width: number;
}

/**
 * Position and size of a desktop window.
 *
 * @category Model
 * @since 1.0.0
 */
export interface WindowFrame extends Point, Size {}

/**
 * Window rendered in a desktop animation.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DesktopWindow
{
    readonly AccentColor?: string;
    readonly Content?: ReactNode;
    readonly Frame: WindowFrame;
    readonly Id: string;
    readonly Title?: ReactNode;
}

/**
 * Visual shape used to represent the animated cursor.
 *
 * @category Model
 * @since 1.0.0
 */
export type CursorType =
    | "Arrow"
    | "Crosshair"
    | "Grab"
    | "Grabbing"
    | "Move"
    | "Pointer"
    | "Text";

/**
 * Cursor rendered in a desktop animation.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DesktopCursor
{
    readonly Position: Point;
    readonly Type: CursorType;
}

/**
 * Canvas on which windows and an optional cursor are rendered.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DesktopCanvas extends Size
{
    readonly Background?: string;
}

/**
 * Adds a window with the Windows-style opening motion.
 *
 * @category Model
 * @since 1.0.0
 */
export interface CreateWindowStep
{
    readonly Duration: number;
    readonly Kind: "CreateWindow";
    readonly Window: DesktopWindow;
}

/**
 * Moves a window, instantaneously when `Duration` is zero.
 *
 * @category Model
 * @since 1.0.0
 */
export interface MoveWindowStep
{
    readonly Duration: number;
    readonly Id: string;
    readonly Kind: "MoveWindow";
    readonly Position: Point;
}

/**
 * Resizes a window over a fixed duration.
 *
 * @category Model
 * @since 1.0.0
 */
export interface ResizeWindowStep
{
    readonly Duration: number;
    readonly Id: string;
    readonly Kind: "ResizeWindow";
    readonly Size: Size;
}

/**
 * Removes a window with the Windows-style closing motion.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DestroyWindowStep
{
    readonly Duration: number;
    readonly Id: string;
    readonly Kind: "DestroyWindow";
}

/**
 * Makes a cursor visible with a short entrance motion.
 *
 * @category Model
 * @since 1.0.0
 */
export interface ShowCursorStep
{
    readonly Cursor: DesktopCursor;
    readonly Duration: number;
    readonly Kind: "ShowCursor";
}

/**
 * Moves the visible cursor, instantaneously when `Duration` is zero.
 *
 * @category Model
 * @since 1.0.0
 */
export interface MoveCursorStep
{
    readonly Duration: number;
    readonly Kind: "MoveCursor";
    readonly Position: Point;
}

/**
 * Changes the visible cursor shape, cross-fading when the duration is positive.
 *
 * @category Model
 * @since 1.0.0
 */
export interface ChangeCursorStep
{
    readonly CursorType: CursorType;
    readonly Duration: number;
    readonly Kind: "ChangeCursor";
}

/**
 * Hides the cursor with a short exit motion.
 *
 * @category Model
 * @since 1.0.0
 */
export interface HideCursorStep
{
    readonly Duration: number;
    readonly Kind: "HideCursor";
}

/**
 * Moves a visible cursor and window together while showing a grabbing cursor.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DragWindowStep
{
    readonly Duration: number;
    readonly Id: string;
    readonly Kind: "DragWindow";
    readonly Position: Point;
}

/**
 * Holds the current scene for a fixed duration.
 *
 * @category Model
 * @since 1.0.0
 */
export interface WaitStep
{
    readonly Duration: number;
    readonly Kind: "Wait";
}

/**
 * Single operation in a sequential desktop animation timeline.
 *
 * @category Model
 * @since 1.0.0
 */
export type DesktopAnimationStep =
    | ChangeCursorStep
    | CreateWindowStep
    | DestroyWindowStep
    | DragWindowStep
    | HideCursorStep
    | MoveCursorStep
    | MoveWindowStep
    | ResizeWindowStep
    | ShowCursorStep
    | WaitStep;

/**
 * Complete, validated definition rendered by `DesktopAnimation`.
 *
 * @category Model
 * @since 1.0.0
 */
export interface DesktopAnimationDefinition
{
    readonly Canvas: DesktopCanvas;
    readonly Cursor?: DesktopCursor;
    readonly Label: string;
    readonly Loop?: boolean;
    readonly Steps: ReadonlyArray<DesktopAnimationStep>;
    readonly Windows?: ReadonlyArray<DesktopWindow>;
}
