/**
 *
 *
 * @module @sorrell/windows/Binding
 *
 * @file      Binding.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { createRequire } from "node:module";
import type { Handle } from "./index.ts";
import type { IntPoint } from "@sorrell/math";
import type { Attempt } from "./Internal/index.ts";

export interface NativeBinding
{
    readonly Window:
    {
        readonly GetForegroundWindow: () => Attempt.Attempt<Handle.HWND>;
        readonly GetCursorPosition: () => Attempt.Attempt<IntPoint.IntPoint>;
    };
}

const Require: NodeJS.Require = createRequire(import.meta.url);
export const Binding: NativeBinding =
    Require("../build/Release/SorrellWindows.node") as NativeBinding;
