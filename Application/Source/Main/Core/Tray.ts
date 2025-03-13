/* File:      Tray.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Tray as ElectronTray, Menu, app } from "electron";
import type { FTray } from "./Tray.Types";

const Tray: FTray = { Ref: null };

app.whenReady().then(() =>
{
    Tray.Ref = new ElectronTray("./Resource/Tray.png");

    const ContextMenu: Menu = Menu.buildFromTemplate([
        {
            label: "foo",
            type: "normal"
        }
    ]);

    Tray.Ref.setToolTip("SorrellWm v0.0.1\nUp to date");
    Tray.Ref.setContextMenu(ContextMenu);

    console.log("Registered tray");
});
