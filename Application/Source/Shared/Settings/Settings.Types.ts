/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FKeybinds } from "./Keybind.Types";

/**
 * Some settings regard state that is outside of SorrellWm,
 * for example, for the `RunOnStartup` setting to be honored,
 * a task must be registered via the Task Scheduler.  If this
 * fails, then this external state (*i.e.*, the Task Scheduler)
 * is inconsistent with the value of the setting `RunOnStartup`
 * in SorrellWm.
 */
/* eslint-disable-next-line @typescript-eslint/typedef */
export const ExternalSettings = [ "RunOnStartup" ] as const;

export type FExternalSetting = typeof ExternalSettings[number];

export type FSettings =
{
    AnimationScalar: number;
    Gap: number;
    RunOnStartup: boolean;
    Keybinds: FKeybinds;
    ShowUpdateNotifications: boolean;
};

export type FSettingsKeys = keyof FSettings;
