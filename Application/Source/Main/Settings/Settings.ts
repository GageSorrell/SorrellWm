/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import { type BrowserWindow, ipcMain } from "electron";
import { CreateBrowserWindow } from "#/BrowserWindow";
import { GetPaths } from "#/Core/Paths";
import type { FSettings } from "./Settings.Types";
import Settings from "electron-settings";

let SettingsWindow: BrowserWindow | undefined = undefined;

export const OpenSettings = async (): Promise<void> =>
{
    let LoadFrontend = async () =>
    {

    };

    if (SettingsWindow === undefined)
    {
        const { Window, LoadFrontend: InLoadFrontend } = await CreateBrowserWindow({
            autoHideMenuBar: true,
            backgroundMaterial: "mica",
            frame: true,
            height: 900,
            icon: Path.join(GetPaths().Resource, "Settings", "SettingsDark.svg"),
            maximizable: true,
            resizable: true,
            show: true,
            skipTaskbar: false,
            title: "SorrellWm Settings",
            titleBarStyle: "default",
            transparent: true,
            width: 1200
        });

        SettingsWindow = Window;
        LoadFrontend = InLoadFrontend;
    }

    SettingsWindow.setMenu(null);

    ipcMain.on("ReadyForRoute", (_Event: Electron.Event): void =>
    {
        SettingsWindow?.webContents.send("Navigate", "Settings");
    });

    LoadFrontend();

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

export const GetSettings = async (): Promise<FSettings | undefined> =>
{
    const OutSettings: FSettings | null = await Settings.get("Settings") as FSettings | null;
    return OutSettings !== null
        ? OutSettings
        : undefined;
};
