/* File:      Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import "./MessageLoop";
import "./Hook";
import "./NodeIpc";
import "./Keyboard";

setTimeout((): void =>
{
    import("./MainWindow");
});

import { BrowserWindow, app, shell } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import path from "path";
import { resolveHtmlPath } from "./util";

// const CurrentWindow: HWindow = GetFocusedWindow();
// console.log(CaptureWindowScreenshot(CurrentWindow));

class FAppUpdater
{
    constructor()
    {
        log.transports.file.level = "info";
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let MainWindow: BrowserWindow | null = null;

// ipcMain.on("ipc-example", async (Event: Electron.IpcMainEvent, Argument: string) =>
// {
//     const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//     console.log(msgTemplate(Argument));
//     Event.reply("ipc-example", msgTemplate("pong"));
// });

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

const createWindow = async () =>
{
    if (IsDebug)
    {
        await installExtensions();
    }

    const ResourcesPath: string = app.isPackaged
        ? path.join(process.resourcesPath, "Resource")
        : path.join(__dirname, "../../Resource");

    const getAssetPath = (...paths: Array<string>): string =>
    {
        return path.join(ResourcesPath, ...paths);
    };

    MainWindow = new BrowserWindow({
        height: 728,
        icon: getAssetPath("icon.png"),
        show: false,
        webPreferences:
        {
            preload: app.isPackaged
                ? path.join(__dirname, "preload.js")
                : path.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 1024
    });

    MainWindow.loadURL(resolveHtmlPath("index.html"));

    MainWindow.on("show", (_Event: Electron.Event, _IsAlwaysOnTop: boolean): void =>
    {
        MainWindow?.webContents.send("Navigate", "TestWindow");
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

    // const MenuBuilder = new MenuBuilder(mainWindow);
    // MenuBuilder.buildMenu();

    // Open urls in the user's browser
    MainWindow.webContents.setWindowOpenHandler((Edata) =>
    {
        shell.openExternal(Edata.url);
        return { action: "deny" };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
  new FAppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () =>
{
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});

app.whenReady().then(() =>
{
    createWindow();
    app.on("activate", () =>
    {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (MainWindow === null)
        {
            createWindow();
        }
    });
}).catch(console.log);
