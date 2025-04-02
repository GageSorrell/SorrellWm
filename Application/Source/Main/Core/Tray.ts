/* File:      Tray.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Tray as ElectronTray, Menu, app as App } from "electron";
import { Activate } from "#/MainWindow";
import type { FTray } from "./Tray.Types";
import { GetIconPath } from "./Icon";
import { OpenSettings } from "#/Settings";

const Tray: FTray = { Ref: undefined };

const MakeTray = async (): Promise<void> =>
{
    Tray.Ref = new ElectronTray(GetIconPath("Brand"));

    const ContextMenu: Menu = Menu.buildFromTemplate([
        {
            click: OpenSettings,
            label: "Settings",
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
    Tray.Ref.addListener("click", Activate);
};

App.whenReady().then(MakeTray);
