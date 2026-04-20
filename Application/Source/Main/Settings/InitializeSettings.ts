/**
 * @file      InitializeSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { DefaultSettings } from "../../Shared";
import { RegisterInitializationFunction } from "#/Initialize/Initialize";
import Settings from "electron-settings";

const InitializeSettings = async (): Promise<void> =>
{
    if (!Settings.hasSync("Settings"))
    {
        await Settings.set("Settings", JSON.stringify(DefaultSettings));
    }
};

RegisterInitializationFunction("Settings", InitializeSettings);
