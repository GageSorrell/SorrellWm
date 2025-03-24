/* File:      Tray.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Tray as ElectronTray, Menu, app } from "electron";
import type { FTray } from "./Tray.Types";
import { OpenSettings } from "#/Settings/Settings";
import { Activate } from "#/MainWindow";

const Tray: FTray = { Ref: undefined };

app.whenReady().then(() =>
{
    Tray.Ref = new ElectronTray("./Resource/Tray.png");

    const ContextMenu: Menu = Menu.buildFromTemplate([
        {
            click: OpenSettings,
            label: "Settings",
            type: "normal"
        },
        {
            click: () => app.exit(),
            label: "Exit",
            type: "normal"
        }
    ]);

    Tray.Ref.setToolTip("SorrellWm v0.0.1\nUp to date");
    Tray.Ref.setContextMenu(ContextMenu);
    Tray.Ref.addListener("click", Activate);
});
