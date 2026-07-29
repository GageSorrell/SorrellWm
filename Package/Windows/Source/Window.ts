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
import { File, type Handle } from "./index.ts";
import { Option, Result, pipe } from "effect";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.js";

/** A top-level window maximize button currently beneath the system cursor. */
export interface HoveredMaximizeButton
{
    /** The maximize-button bounds in physical virtual-screen coordinates. */
    readonly Bounds: Box.Box;

    /** The top-level window that owns the maximize button. */
    readonly Window: Handle.HWND;
}

const MissingTilingApi = <A>(Name: string): Attempt.Attempt<A> =>
    Result.fail(new Attempt.NativeError({
        Message: `The loaded native addon does not export Window.${ Name }.`
    }));

export/**
       * Capture a visible top-level window from the desktop as a raw
       * base64-encoded PNG string.
       *
       * Pixels outside a rounded or explicitly region-shaped window are
       * transparent.
       */
const Capture = (Window: Handle.HWND): Option.Option<string> =>
{
    if (typeof Binding.Window.Capture === "function")
    {
        const { Value } = Binding.Window.Capture(Window);
        if (File.Png.IsPng(Value))
        {
            return Option.some(Value);
        }
    }

    return Option.none();
};

export/** Remove every overlay created by {@link ShowIsolation}. */
const ClearIsolation = (): Attempt.Attempt<void> =>
    typeof Binding.Window.ClearIsolation === "function"
        ? Attempt.AsResult(Binding.Window.ClearIsolation())
        : MissingTilingApi("ClearIsolation");

export/**
       * Cover each visible, non-minimized top-level window not present in the
       * exclusion set with an opaque black, titlebar-less window that is
       * hidden from the taskbar and Alt+Tab.
       *
       * This is independent of {@link DimWindowsExcept}/{@link ShowBackdrop}: it
       * replaces any windows created by a prior call to {@link ShowIsolation}, but
       * leaves dimming/backdrop overlays untouched, and vice versa.
       */
const ShowIsolation = (
    ExcludedWindows: ReadonlyArray<Handle.HWND>
): Attempt.Attempt<void> => typeof Binding.Window.ShowIsolation === "function"
    ? Attempt.AsResult(Binding.Window.ShowIsolation(ExcludedWindows))
    : MissingTilingApi("ShowIsolation");

export/** Remove every overlay created by {@link DimWindowsExcept} or {@link ShowBackdrop}. */
const ClearWindowDimming = (): Attempt.Attempt<void> =>
    Attempt.AsResult(Binding.Window.ClearWindowDimming());

export/** Dim each visible, non-minimized top-level window not present in the exclusion set. */
const DimWindowsExcept = (
    ExcludedWindows: ReadonlyArray<Handle.HWND>
): Attempt.Attempt<void> => Attempt.AsResult(
    Binding.Window.DimWindowsExcept(ExcludedWindows)
);

export/** Show a click-through black backdrop over one top-level window. */
const ShowBackdrop = (
    Window: Handle.HWND,
    Intensity: number,
    FadeDurationMilliseconds: number = 0
): Attempt.Attempt<void> => Attempt.AsResult(
    Binding.Window.ShowBackdrop(Window, Intensity, FadeDurationMilliseconds)
);

export/** Get the current position of the cursor. */
const GetCursorPosition: { (): Option.Option<IntPoint.IntPoint>; } =
    Attempt.ToOption(Binding.Window.GetCursorPosition);

export/** Get the current foreground window, if a window is focused. */
const GetForegroundWindow: { (): Option.Option<Handle.HWND>; } =
    Attempt.ToOption(Binding.Window.GetForegroundWindow);

export/** Get the display name of the application that owns a window. */
const GetApplicationName = (Window: Handle.HWND): Option.Option<string> =>
    typeof Binding.Window.GetApplicationName === "function"
        ? Attempt.AsOption(Binding.Window.GetApplicationName(Window))
        : Option.none();

export/** Get the display name stored in an executable's Windows version resources. */
const GetApplicationNameFromPath = (
    ExecutablePath: string
): Option.Option<string> =>
    typeof Binding.Window.GetApplicationNameFromPath === "function"
        ? Attempt.AsOption(Binding.Window.GetApplicationNameFromPath(ExecutablePath))
        : Option.none();

export/** Get the maximize button beneath the cursor, if one is being hovered. */
const GetHoveredMaximizeButton = (): Option.Option<HoveredMaximizeButton> =>
    typeof Binding.Window.GetHoveredMaximizeButton !== "function"
        ? Option.none()
        : pipe(
            Binding.Window.GetHoveredMaximizeButton(),
            Attempt.AsOption,
            Option.map((Hover: {
                readonly Bounds: Box.BoxArg<number>;
                readonly Window: Handle.HWND;
            }): HoveredMaximizeButton => ({
                Bounds: Box.Box(
                    Hover.Bounds.Top,
                    Hover.Bounds.Right,
                    Hover.Bounds.Bottom,
                    Hover.Bounds.Left
                ),
                Window: Hover.Window
            }))
        );

export/** Enumerate visible, non-minimized, resizable application windows eligible for tiling. */
const GetManageableTopLevelWindows = (): Attempt.Attempt<
    ReadonlyArray<Handle.HWND>
> => typeof Binding.Window.GetManageableTopLevelWindows === "function"
    ? Attempt.AsResult(Binding.Window.GetManageableTopLevelWindows())
    : MissingTilingApi("GetManageableTopLevelWindows");

export/** Get the top-level native window in the foreground move/size loop. */
const GetMovingWindow = (): Option.Option<Handle.HWND> =>
    typeof Binding.Window.GetMovingWindow === "function"
        ? Attempt.AsOption(Binding.Window.GetMovingWindow())
        : Option.none();

export/** Get the configured Windows mouse-hover time in milliseconds. */
const GetMouseHoverTime = (): Option.Option<number> =>
    typeof Binding.Window.GetMouseHoverTime === "function"
        ? Attempt.AsOption(Binding.Window.GetMouseHoverTime())
        : Option.none();

export/** Get the refresh rate in Hz of the monitor nearest a window. */
const GetRefreshRate = (Window: Handle.HWND): Option.Option<number> =>
    typeof Binding.Window.GetRefreshRate !== "function"
        ? Option.none()
        : Attempt.AsOption(Binding.Window.GetRefreshRate(Window));

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

export/**
       * Get the window application's taskbar icon, falling back to its
       * executable icon, as a raw base64-encoded PNG string.
       */
const GetIcon = (Window: Handle.HWND): Option.Option<string> =>
    typeof Binding.Window.GetIcon === "function"
        ? Attempt.AsOption(Binding.Window.GetIcon(Window))
        : Option.none();

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

export/**
       * Determine whether the effective maximize-button Snap layouts feature
       * is enabled, or return `None` when Windows cannot be queried.
       */
const IsSnapLayoutsOnHoverEnabled = (): Option.Option<boolean> =>
    typeof Binding.Window.IsSnapLayoutsOnHoverEnabled === "function"
        ? Attempt.AsOption(Binding.Window.IsSnapLayoutsOnHoverEnabled())
        : Option.none();

export/**
       * Determine whether the Windows "Snap windows" feature is enabled, or
       * return `None` when Windows cannot be queried.
       */
const IsSnapWindowsEnabled = (): Option.Option<boolean> =>
    typeof Binding.Window.IsSnapWindowsEnabled === "function"
        ? Attempt.AsOption(Binding.Window.IsSnapWindowsEnabled())
        : Option.none();

export/**
       * Determine whether the process that owns a window is running elevated
       * (as Administrator), or return `None` when Windows cannot be queried.
       */
const IsWindowElevated = (Window: Handle.HWND): Option.Option<boolean> =>
    typeof Binding.Window.IsWindowElevated === "function"
        ? Attempt.AsOption(Binding.Window.IsWindowElevated(Window))
        : Option.none();

export/**
       * Determine whether higher z-order windows completely cover a top-level
       * window, ignoring any explicitly excluded windows.
       */
const IsWindowObscured = (
    Window: Handle.HWND,
    ExcludedWindows: ReadonlyArray<Handle.HWND> = [ ]
): Attempt.Attempt<boolean> =>
    typeof Binding.Window.IsWindowObscured === "function"
        ? Attempt.AsResult(Binding.Window.IsWindowObscured(Window, ExcludedWindows))
        : MissingTilingApi("IsWindowObscured");

export/**
       * Determine whether the current process is running elevated (as
       * Administrator), or return `None` when Windows cannot be queried.
       */
const IsCurrentProcessElevated = (): Option.Option<boolean> =>
    typeof Binding.Window.IsCurrentProcessElevated === "function"
        ? Attempt.AsOption(Binding.Window.IsCurrentProcessElevated())
        : Option.none();

export/** Activate a top-level window and direct keyboard input to it. */
const SetForegroundWindow = (
    Window: Handle.HWND
): Attempt.Attempt<void> => Attempt.AsResult(
    Binding.Window.SetForegroundWindow(Window)
);

export/** Place a window immediately behind another window without activating it. */
const SetWindowZOrderAfter = (
    Window: Handle.HWND,
    PrecedingWindow: Handle.HWND
): Attempt.Attempt<void> => typeof Binding.Window.SetWindowZOrderAfter === "function"
    ? Attempt.AsResult(Binding.Window.SetWindowZOrderAfter(Window, PrecedingWindow))
    : MissingTilingApi("SetWindowZOrderAfter");

export/** Move and resize a top-level window to the given virtual-screen rectangle. */
const SetWindowRect = (
    Window: Handle.HWND,
    Bounds: Box.Box
): Attempt.Attempt<void> => typeof Binding.Window.SetWindowRect === "function"
    ? Attempt.AsResult(Binding.Window.SetWindowRect(Window, Bounds))
    : MissingTilingApi("SetWindowRect");
