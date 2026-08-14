/**
 * Conversions between `@sorrell/wm-api`'s portable automation DTOs and the native/internal
 * types `@sorrell/windows` and this app's `Tiling` module actually operate on. Kept in one
 * place so every tool handler crosses the boundary the same way.
 *
 * @module @sorrell/wm/Main/Mcp/Convert
 *
 * @file      Convert.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as TilingTree from "../Tiling/Tree.ts";
import { Box, IntPoint } from "@sorrell/math";
import type { Handle, Mouse as NativeMouse } from "@sorrell/windows";
import type { Mouse } from "@sorrell/wm-api";
import { VK } from "@sorrell/windows";
import { Window } from "@sorrell/wm-api";

export/** Convert a native window handle to its portable `WmApi` string form. */
const ToWindowId = (WindowValue: Handle.HWND): Window.WindowId =>
    Window.ToWindowId(WindowValue as unknown as bigint);

export/** Convert a portable `WmApi` window-handle string back into a native handle. */
const FromWindowId = (Id: Window.WindowId): Handle.HWND =>
    Window.FromWindowId(Id) as unknown as Handle.HWND;

export/** Convert a native rectangle to its portable `WmApi` form. */
const ToBox = (Bounds: Box.Box): Window.Box => ({
    Bottom: Bounds.Bottom,
    Left: Bounds.Left,
    Right: Bounds.Right,
    Top: Bounds.Top
});

export/** Convert a portable `WmApi` rectangle back into a native box. */
const FromBox = (Bounds: Window.Box): Box.Box =>
    Box.Box(Bounds.Top, Bounds.Right, Bounds.Bottom, Bounds.Left);

export/** Convert a portable `WmApi` point into a native integer point. */
const FromIntPoint = (Point: Mouse.IntPoint): IntPoint.IntPoint =>
    IntPoint.IntPoint(Point.X, Point.Y);

/** Every mouse-button virtual-key code, keyed by its portable `WmApi` name. */
const MouseButtonVk: Readonly<Record<Mouse.MouseButton, NativeMouse.MouseButton>> = Object.freeze({
    Left: VK.LBUTTON,
    Middle: VK.MBUTTON,
    Right: VK.RBUTTON,
    X1: VK.XBUTTON1,
    X2: VK.XBUTTON2
});

export/** Convert a portable `WmApi` mouse button into its native virtual-key code. */
const FromMouseButton = (Button: Mouse.MouseButton): NativeMouse.MouseButton => MouseButtonVk[Button];

export/** Convert a portable `WmApi` panel orientation into the tiling tree's own type. */
const FromOrientation = (Value: string): TilingTree.Orientation =>
    Value as TilingTree.Orientation;

export/** Convert a portable `WmApi` focus direction into the tiling tree's own type. */
const FromFocusDirection = (Value: string): TilingTree.FocusDirection =>
    Value as TilingTree.FocusDirection;
