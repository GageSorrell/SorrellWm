/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type FSettings =
{
    AnimationScalar: number;
    RunOnStartup: boolean;
};

export type FSettingsKeys = keyof FSettings;
