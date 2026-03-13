/* File:      InitializeSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

// import { app, Notification } from "electron";
import { DefaultSettings } from "../../Shared/Settings";
import { RegisterInitializationFunction } from "#/Core/Initialize";
import Settings from "electron-settings";

const InitializeSettings = async (): Promise<void> =>
{
    if (!Settings.hasSync("Settings"))
    {
        await Settings.set("Settings", DefaultSettings);
    }
};

RegisterInitializationFunction(InitializeSettings);
