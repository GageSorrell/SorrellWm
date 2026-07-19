/**
 * @file      Settings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { FLogger, FRejectFunction, FSettings, TResolveFunction } from "../../Shared";
import { DefaultSettings } from "../../Shared";
import ElectronSettings from "electron-settings";
import { GetLogger } from "#/Development";
import { SetRunOnStartup } from "@sorrell/wm-windows";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Settings");

const SaveSettings = async (NewSettings: FSettings): Promise<boolean> =>
{
    try
    {
        await ElectronSettings.set("Settings", JSON.stringify(NewSettings));
        return true;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    catch (_Error: unknown)
    {
        return false;
    }
};

const OnUpdateSettings = async (OldSettings: FSettings, NewSettings: FSettings): Promise<boolean> =>
{
    return new Promise<boolean>((Resolve: TResolveFunction<boolean>, _Reject: FRejectFunction): void =>
    {
        if (OldSettings.RunOnStartup !== NewSettings.RunOnStartup)
        {
            SetRunOnStartup(NewSettings.RunOnStartup, process.execPath, (Success: boolean) =>
            {
                Resolve(Success);
            });
        }
        else
        {
            Resolve(true);
        }
    });
};

export const UpdateSettings = async (NewSettings: FSettings): Promise<boolean> =>
{
    const OldSettings: FSettings = await GetSettings();
    const SavedSuccessful: boolean = await SaveSettings(NewSettings);
    if (SavedSuccessful)
    {
        return await OnUpdateSettings(OldSettings, NewSettings);
    }

    return false;
};

export const GetSettings = async (): Promise<Readonly<FSettings>> =>
{
    const SettingsString: unknown = await ElectronSettings.get("Settings");

    return typeof SettingsString === "string"
        ? JSON.parse(SettingsString) as FSettings
        : DefaultSettings;
};
