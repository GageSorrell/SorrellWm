/* File:      InitializeSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

// import { app, Notification } from "electron";
import type { FSettings } from "./Settings.Types";
import Settings from "electron-settings";

const DefaultSettings: FSettings =
{
    Gap: 4,
    RunOnStartup: true
};

const InitializeSettings = async (): Promise<void> =>
{
    if (!Settings.hasSync("Settings"))
    {
        await Settings.set("Settings", DefaultSettings);
    }
    // Promise.allSettled(Object.keys(DefaultSettings).map(async (Key: string): Promise<void> =>
    // {
    //     const Setting: keyof FSettings = Key as keyof FSettings;
    //     await Settings.set(Setting, DefaultSettings[Setting]);
    // }));
};

// const InitializeSettings = async (): Promise<void> =>
// {
//     if (!Settings.hasSync("Gap"))
//     {
//         Settings.setSync("Gap", 0);
//     }

//     if (!Settings.hasSync("RunOnStartup"))
//     {
//         Settings.setSync("RunOnStartup", false);
//     }

//     if (!Settings.hasSync("AskEnableRunOnStartup"))
//     {
//         Settings.setSync("AskEnableRunOnStartup", true);
//     }

//     // if (!Settings.getSync("RunOnStartup") && Settings.getSync("AskEnableRunOnStartup"))
//     // {
//     //     const AskToEnableRunOnStartup = (): void =>
//     //     {
//     //         const EnableRunOnStartupNotification: Notification = new Notification({
//     //             /* eslint-disable-next-line @stylistic/max-len */
//     //             body: "SorrellWm is currently not enabled to run on startup.  Would you like to enable SorrellWm to run when Windows starts?",
//     //             title: "Enable Run on Startup?"
//     //         });

//     //         EnableRunOnStartupNotification.show();
//     //     };

//     //     // setTimeout(AskToEnableRunOnStartup, 15 * 60 * 1000);
//     //     await app.whenReady();
//     //     AskToEnableRunOnStartup();
//     // }
// };

InitializeSettings();
