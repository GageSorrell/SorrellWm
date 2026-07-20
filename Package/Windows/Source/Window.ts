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

import type { IntPoint } from "@sorrell/math";
import type { Option } from "effect";
import { Binding } from "./Binding.ts";
import { Attempt } from "./Internal/index.js";
import type { Handle } from "./index.ts";

export const GetCursorPosition: { (): Option.Option<IntPoint.IntPoint>; } = Attempt.ToOption(Binding.Window.GetCursorPosition);
export const GetForegroundWindow: { (): Option.Option<Handle.HWND>; } = Attempt.ToOption(Binding.Window.GetForegroundWindow);
