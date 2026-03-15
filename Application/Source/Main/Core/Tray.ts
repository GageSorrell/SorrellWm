/* File:      Tray.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { app as App, Tray as ElectronTray, Menu } from "electron";
import type { FTray } from "./Tray.Types";
import { GetIconPath } from "./Icon";
import { OpenSettings } from "#/Settings";
import { RegisterInitializationFunction } from "./Initialize";

const Tray: FTray = { Ref: undefined };

RegisterInitializationFunction(async (): Promise<void> =>
{
    Tray.Ref = new ElectronTray(await GetIconPath("Brand", "PNG"));

    const ContextMenu: Menu = Menu.buildFromTemplate([
        {
            click: OpenSettings,
            label: "Settings",
            sublabel: "Double-click",
            type: "normal"
        },
        {
            click: () => App.exit(),
            label: "Exit",
            type: "normal"
        }
    ]);

    Tray.Ref.setToolTip("SorrellWm v0.0.1\nUp to date");
    Tray.Ref.setContextMenu(ContextMenu);
    Tray.Ref.addListener("click", OpenSettings);
});
