/* File:      InitializeSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
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
