/* File:      Initialization.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type BrowserWindow, app, shell } from "electron";
import { CreateBrowserWindow } from "#/BrowserWindow";
import { autoUpdater } from "electron-updater";
import log from "electron-log";

let MainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === "production")
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
    const SourceMapSupport: any = require("source-map-support");
    SourceMapSupport.install();
}

const IsDebug: boolean =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (IsDebug)
{
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    require("electron-debug")();
}

const installExtensions = async () =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
    const Installer: any = require("electron-devtools-installer");
    const ForceDownload: boolean = !!process.env.UPGRADE_EXTENSIONS;
    const Extensions: Array<string> = [ "REACT_DEVELOPER_TOOLS" ];

    return Installer
        .default(
            Extensions.map((Name: string) => Installer[Name]),
            ForceDownload
        )
        .catch(console.log);
};

const CreateWindow = async (): Promise<void> =>
{
    if (IsDebug)
    {
        await installExtensions();
    }

    const { Window, LoadFrontend } = await CreateBrowserWindow({
        height: 728,
        width: 1024,

        show: false
    });

    MainWindow = Window;
    await LoadFrontend();

    MainWindow.on("show", (_Event: Electron.Event, _IsAlwaysOnTop: boolean): void =>
    {
        setTimeout((): void =>
        {
            MainWindow?.webContents.send("Navigate", "TestWindow");
        }, 2000);
    });

    MainWindow.on("ready-to-show", () =>
    {
        if (!MainWindow)
        {
            throw new Error("\"MainWindow\" is not defined");
        }
        if (process.env.START_MINIMIZED)
        {
            MainWindow.minimize();
        }
        else
        {
            MainWindow.setMenuBarVisibility(false);
            MainWindow.show();
        }
    });

    MainWindow.on("closed", () =>
    {
        MainWindow = null;
    });

    MainWindow.webContents.setWindowOpenHandler((Edata: Electron.HandlerDetails) =>
    {
        shell.openExternal(Edata.url);
        return { action: "deny" };
    });

    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
};

app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});

app.whenReady()
    .then(() =>
    {
        CreateWindow();
        app.on("activate", () =>
        {
            if (MainWindow === null)
            {
                CreateWindow();
            }
        });
    })
    .catch(console.log);
