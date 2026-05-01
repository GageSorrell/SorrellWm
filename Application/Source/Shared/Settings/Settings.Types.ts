/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { ExternalSettings } from "./Settings";
import type { FKeybinds } from "./Keybind.Types";

/**
 * Some settings regard state that is outside of SorrellWm,
 */
export type FExternalSetting = typeof ExternalSettings[number];

/**
 * The settings of `SorrellWm`.
 */
export type FSettings =
    {
        /** Scales the speed of the animations in `SorrellWm`. */
        AnimationScalar: number;

        /** In pixels, the gap between vertices in a given panel. */
        Gap: number;

        /** Whether `SorrellWm` should launch when the system starts. */
        RunOnStartup: boolean;

        /** The {@link FKeybinds}, describing the keyboard shortcuts available to the user. */
        Keybinds: FKeybinds;

        /** Whether the user should be notified when an update is available. */
        ShowUpdateNotifications: boolean;
    };

/**
 * The keys of {@link FSettings}.
 */
export type FSettingsKeys = keyof FSettings;
