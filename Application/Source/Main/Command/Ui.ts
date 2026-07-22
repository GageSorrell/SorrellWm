/**
 *
 *
 * @module @sorrell/wm/Main/Command/Ui
 *
 * @file      Ui.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "./index.ts";
import { TypeId } from "./Command.ts";

export type UiCommand = Command.Command.Enum<"Ui", {
    /**
     * Show the command UI.
     * @since 0.1.0
     */
    readonly Activate: { };

    /**
     * Hide the command UI.
     * @since 0.1.0
     */
    readonly Blur: { };
}>;

export const UiCommand = Command.Command.Constructor("Ui");
