/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FKeybinds } from "./Keybind.Types";

export type FSettings =
{
    AnimationScalar: number;
    Gap: number;
    RunOnStartup: boolean;
    Keybinds: FKeybinds;
};

export type FSettingsKeys = keyof FSettings;
