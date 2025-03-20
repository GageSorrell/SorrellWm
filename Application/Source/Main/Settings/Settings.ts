/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import * as Path from "path";
import { BrowserWindow, app, ipcMain } from "electron";
import { ResolveHtmlPath } from "#/Core/Utility";

let SettingsWindow: BrowserWindow | undefined = undefined;

export const OpenSettings = (): void =>
{
    if (SettingsWindow === undefined)
    {
        SettingsWindow = new BrowserWindow({
            autoHideMenuBar: true,
            backgroundMaterial: "mica",
            frame: true,
            height: 900,
            maximizable: true,
            resizable: true,
            show: true,
            skipTaskbar: false,
            title: "SorrellWm Settings",
            titleBarStyle: "default",
            transparent: true,
            webPreferences:
            {
                devTools: false,
                nodeIntegration: true,
                preload: app.isPackaged
                    ? Path.join(__dirname, "Preload.js")
                    : Path.join(__dirname, "../../.erb/dll/preload.js")
            },
            width: 1200
        });
    }

    SettingsWindow.setMenu(null);

    ipcMain.on("ReadyForRoute", (_Event: Electron.Event): void =>
    {
        SettingsWindow?.webContents.send("Navigate", "Settings");
    });

    SettingsWindow.loadURL(ResolveHtmlPath("index.html"));

    SettingsWindow.on(
        "page-title-updated",
        (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): void =>
        {
            Event.preventDefault();
        }
    );

    ipcMain.on("UpdateSettings", (_Event: Electron.Event, ..._Arguments: Array<unknown>): void =>
    {
        UpdateSettings();
    });
};

export const UpdateSettings = async (): Promise<void> =>
{

};

