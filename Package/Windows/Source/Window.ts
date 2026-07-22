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

import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.ts";
import type { Handle } from "./index.ts";
import type { IntPoint } from "@sorrell/math";
import type { Option } from "effect";

export/** Get the current position of the cursor. */
const GetCursorPosition: { (): Option.Option<IntPoint.IntPoint>; } =
    Attempt.ToOption(Binding.Window.GetCursorPosition);

export/** Get the current foreground window, if a window is focused. */
const GetForegroundWindow: { (): Option.Option<Handle.HWND>; } =
    Attempt.ToOption(Binding.Window.GetForegroundWindow);
