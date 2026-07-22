/**
 *
 *
 * @module @sorrell/wm/Main/Command/Wm
 *
 * @file      Wm.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "./index.ts";
import { TypeId } from "./Command.ts";

export type WmCommand = Command.Command.Enum<"Wm", {
    /**
     * Bring attention to a given set of windows by temporarily drawing a darkened form of
     * the desktop background over all other windows.
     *
     * @since 0.1.0
     */
    readonly Isolate: { };

    /**
     * Focus on a given window.
     * @since 0.1.0
     */
    readonly SetFocus: { };
}>;

export const WmCommand = Command.Command.Constructor("Wm");
