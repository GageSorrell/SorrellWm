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

import * as Command from "./Command.js";
import type { OverlayCommandId, OverlayScreenId } from "../../Shared/OverlayCommand.js";

/** Commands that control the application's user interface. */
export type UiCommand = Command.Command.Enum<"Ui", {
    /**
     * Show the command UI.
     * @since 0.1.0
     */
    readonly Activate: { };

    /**
     * Hide the command UI when the activation key is released.
     * @since 0.1.0
     */
    readonly Deactivate: { };

    /**
     * Return to the preceding overlay screen.
     * @since 0.1.0
     */
    readonly BackOverlayScreen: { };

    /**
     * Navigate to another overlay screen.
     * @since 0.1.0
     */
    readonly NavigateOverlayScreen: {
        readonly ScreenId: OverlayScreenId;
    };

    /**
     * Represent an overlay command whose behavior has not been implemented yet.
     * @since 0.1.0
     */
    readonly NoOpOverlayCommand: {
        readonly Id: OverlayCommandId;
    };
}>;

export/** Construct immutable user-interface commands. */
const UiCommand: () => Command.Command.Constructor<UiCommand> =
    Command.Command.Constructor<UiCommand>("Ui");
