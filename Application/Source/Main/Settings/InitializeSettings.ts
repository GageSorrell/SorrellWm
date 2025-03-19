/* File:      InitializeSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

// import { app, Notification } from "electron";
import Settings from "electron-settings";

const InitializeSettings = async (): Promise<void> =>
{
    if (!Settings.hasSync("RunOnStartup"))
    {
        Settings.setSync("RunOnStartup", false);
    }

    if (!Settings.hasSync("AskEnableRunOnStartup"))
    {
        Settings.setSync("AskEnableRunOnStartup", true);
    }

    // if (!Settings.getSync("RunOnStartup") && Settings.getSync("AskEnableRunOnStartup"))
    // {
    //     const AskToEnableRunOnStartup = (): void =>
    //     {
    //         const EnableRunOnStartupNotification: Notification = new Notification({
    //             /* eslint-disable-next-line @stylistic/max-len */
    //             body: "SorrellWm is currently not enabled to run on startup.  Would you like to enable SorrellWm to run when Windows starts?",
    //             title: "Enable Run on Startup?"
    //         });

    //         EnableRunOnStartupNotification.show();
    //     };

    //     // setTimeout(AskToEnableRunOnStartup, 15 * 60 * 1000);
    //     await app.whenReady();
    //     AskToEnableRunOnStartup();
    // }
};

InitializeSettings();
