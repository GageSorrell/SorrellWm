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
import { Option, Result, pipe } from "effect";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.ts";
import type { Handle } from "./index.ts";

const MissingTilingApi = <A>(Name: string): Attempt.AttemptResult<A> =>
    Result.fail(new Attempt.NativeError({
        Message: `The loaded native addon does not export Window.${ Name }.`
    }));

export/** Remove every overlay created by {@link DimWindowsExcept} or {@link ShowBackdrop}. */
const ClearWindowDimming = (): Attempt.AttemptResult<void> =>
    Attempt.AsResult(Binding.Window.ClearWindowDimming());

export/** Dim each visible, non-minimized top-level window not present in the exclusion set. */
const DimWindowsExcept = (
    ExcludedWindows: ReadonlyArray<Handle.HWND>
): Attempt.AttemptResult<void> => Attempt.AsResult(
    Binding.Window.DimWindowsExcept(ExcludedWindows)
);

export/** Show a click-through black backdrop over one top-level window. */
const ShowBackdrop = (
    Window: Handle.HWND,
    Intensity: number,
    FadeDurationMilliseconds: number = 0
): Attempt.AttemptResult<void> => Attempt.AsResult(
    Binding.Window.ShowBackdrop(Window, Intensity, FadeDurationMilliseconds)
);

export/** Get the current position of the cursor. */
const GetCursorPosition: { (): Option.Option<IntPoint.IntPoint>; } =
    Attempt.ToOption(Binding.Window.GetCursorPosition);

export/** Get the current foreground window, if a window is focused. */
const GetForegroundWindow: { (): Option.Option<Handle.HWND>; } =
    Attempt.ToOption(Binding.Window.GetForegroundWindow);

export/** Enumerate visible, non-minimized, resizable application windows eligible for tiling. */
const GetManageableTopLevelWindows = (): Attempt.AttemptResult<
    ReadonlyArray<Handle.HWND>
> => typeof Binding.Window.GetManageableTopLevelWindows === "function"
    ? Attempt.AsResult(Binding.Window.GetManageableTopLevelWindows())
    : MissingTilingApi("GetManageableTopLevelWindows");

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

export/** Get the virtual-screen work area of the monitor nearest a window. */
const GetWindowWorkArea = (Window: Handle.HWND): Option.Option<Box.Box> =>
    typeof Binding.Window.GetWindowWorkArea !== "function"
        ? Option.none()
        : pipe(
            Binding.Window.GetWindowWorkArea(Window),
            Attempt.AsOption,
            Option.map((Rectangle: Box.BoxArg<number>) => Box.Box(
                Rectangle.Top,
                Rectangle.Right,
                Rectangle.Bottom,
                Rectangle.Left
            ))
        );

export/** Determine an explicit DWM rounded-corner preference, or return `None` when unsure. */
const HasRoundedCorners: { (Window: Handle.HWND): Option.Option<boolean>; } =
    Attempt.ToOption(Binding.Window.HasRoundedCorners);

export/** Activate a top-level window and direct keyboard input to it. */
const SetForegroundWindow = (
    Window: Handle.HWND
): Attempt.AttemptResult<void> => Attempt.AsResult(
    Binding.Window.SetForegroundWindow(Window)
);

export/** Move and resize a top-level window to the given virtual-screen rectangle. */
const SetWindowRect = (
    Window: Handle.HWND,
    Bounds: Box.Box
): Attempt.AttemptResult<void> => typeof Binding.Window.SetWindowRect === "function"
    ? Attempt.AsResult(Binding.Window.SetWindowRect(Window, Bounds))
    : MissingTilingApi("SetWindowRect");
