/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FKeybinds } from "./Keybind.Types";

/** @TODO Finish defining this type and move it to a more appropriate module. */
export type FCommand =
    | "Resize"
    | "Focus"
    | "Confirm"
    | "Tile";

export type FSettings =
{
    AnimationScalar: number;
    RunOnStartup: boolean;
    Keybinds: FKeybinds;
};

export type FSettingsKeys = keyof FSettings;
