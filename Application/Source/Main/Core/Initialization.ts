/* File:      Initialization.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import * as Path from "path";
import { BrowserWindow, app, shell } from "electron";
import { ResolveHtmlPath } from "./Utility";
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

const CreateWindow = async () =>
{
    if (IsDebug)
    {
        await installExtensions();
    }

    const ResourcesPath: string = app.isPackaged
        ? Path.join(process.resourcesPath, "Resource")
        : Path.join(__dirname, "../../Resource");

    const getAssetPath = (...paths: Array<string>): string =>
    {
        return Path.join(ResourcesPath, ...paths);
    };

    MainWindow = new BrowserWindow({
        height: 728,
        width: 1024,

        // frame: false,
        icon: getAssetPath("icon.png"),
        show: false,
        // transparent: true,
        webPreferences:
        {
            devTools: true,
            preload: app.isPackaged
                ? Path.join(__dirname, "Preload.js")
                : Path.join(__dirname, "../Intermediate/Preload.js")
        }
    });

    MainWindow.loadURL(ResolveHtmlPath("index.html"));

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
