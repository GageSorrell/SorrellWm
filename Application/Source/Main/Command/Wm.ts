/**
 * Commands that mutate the state of the tiling manager *et al.*
 *
 * @module @sorrell/wm/Main/Command/Wm
 *
 * @file      Wm.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Command from "./Command.js";

/**
 * Commands that modify the tiling manager state *et al.*
 *
 * @category Wm
 * @since 0.1.0
 */
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

export/** {@inheritDoc WmCommand:type} */
const WmCommand: () => Command.Command.Constructor<WmCommand> =
    Command.Command.Constructor<WmCommand>("Wm");
