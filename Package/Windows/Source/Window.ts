/**
 *
 *
 * @module @sorrell/windows/Window
 *
 * @file      Window.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Box, type IntPoint } from "@sorrell/math";
import { Option, pipe } from "effect";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.ts";
import type { Handle } from "./index.ts";

export/** Remove every dimming overlay created by {@link DimWindowsExcept}. */
const ClearWindowDimming = (): Attempt.AttemptResult<void> =>
    Attempt.AsResult(Binding.Window.ClearWindowDimming());

export/** Dim each visible, non-minimized top-level window not present in the exclusion set. */
const DimWindowsExcept = (
    ExcludedWindows: ReadonlyArray<Handle.HWND>
): Attempt.AttemptResult<void> => Attempt.AsResult(
    Binding.Window.DimWindowsExcept(ExcludedWindows)
);

export/** Get the current position of the cursor. */
const GetCursorPosition: { (): Option.Option<IntPoint.IntPoint>; } =
    Attempt.ToOption(Binding.Window.GetCursorPosition);

export/** Get the current foreground window, if a window is focused. */
const GetForegroundWindow: { (): Option.Option<Handle.HWND>; } =
    Attempt.ToOption(Binding.Window.GetForegroundWindow);

export/** Get a window's current outer bounds in screen coordinates. */
const GetWindowRect = (Window: Handle.HWND): Option.Option<Box.Box> => pipe(
    Binding.Window.GetWindowRect(Window),
    Attempt.AsOption,
    Option.map((Rectangle: Box.BoxArg<number>) => Box.Box(
        Rectangle.Top,
        Rectangle.Right,
        Rectangle.Bottom,
        Rectangle.Left
    ))
);

export/** Get a window's title, including an empty title when the window has no caption. */
const GetWindowText: { (Window: Handle.HWND): Option.Option<string>; } =
    Attempt.ToOption(Binding.Window.GetWindowText);

export/** Determine an explicit DWM rounded-corner preference, or return `None` when unsure. */
const HasRoundedCorners: { (Window: Handle.HWND): Option.Option<boolean>; } =
    Attempt.ToOption(Binding.Window.HasRoundedCorners);
