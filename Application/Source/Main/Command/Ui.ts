/**
 * Commands that mutate the SorrellWm UI.
 *
 * @module @sorrell/wm/Main/Command/Ui
 *
 * @file      Ui.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Command from "./Command.js";
import type { OverlayCommandId, OverlayScreenId, ResizeMode } from "../../Shared/OverlayCommand.js";
import type { Option } from "effect";

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

    /** Cancel the current tiled Insert flow and restore the committed layout. */
    readonly CancelTiledInsert: { };

    /** Descend logical tiled focus from a panel to its first child. */
    readonly CommitTiledFocus: { };

    /** Tile every existing floating window into its monitor's root panel. */
    readonly TileAll: { };

    /** Cycle how tiled Resize redistributes space to neighboring windows. */
    readonly ToggleTiledResizeBehavior: { };

    /**
     * Navigate to another overlay screen.
     * @since 0.1.0
     */
    readonly NavigateOverlayScreen:
    {
        readonly ScreenId: OverlayScreenId;
    };

    /**
     * Represent an overlay command whose behavior has not been implemented yet.
     * @since 0.1.0
     */
    readonly NoOpOverlayCommand:
    {
        readonly Id: OverlayCommandId;
    };

    readonly OpenSettings:
    {
        readonly Path: Option.Option<string>;
    }

    /** Return from the temporary Insert target to the floating-window picker. */
    readonly ReturnToTiledInsertList: { };

    /**
     * Update whether the primary modifier (e.g. Shift) is currently held.
     * @since 0.1.0
     */
    readonly SetPrimaryModifierHeld:
    {
        readonly Held: boolean;
    }

    /**
     * Update whether the fine-step modifier (e.g. Alt) is currently held.
     * @since 0.1.0
     */
    readonly SetFineModifierHeld:
    {
        readonly Held: boolean;
    }

    /**
     * Update whether the Resize screen grows or shrinks the window.
     * @since 0.1.0
     */
    readonly SetResizeMode:
    {
        readonly Mode: ResizeMode;
    }

    /** Select one window from the stack panel currently shown by tiled Focus. */
    readonly SelectTiledStackWindow:
    {
        readonly Index: number;
    };

    /** Choose whether the temporary Insert target captures the next new window. */
    readonly SetTiledInsertCaptureNext:
    {
        readonly Enabled: boolean;
    };
}>;

export/** Construct immutable user-interface commands. */
const UiCommand: () => Command.Command.Constructor<UiCommand> =
    Command.Command.Constructor<UiCommand>("Ui");
