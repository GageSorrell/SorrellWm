/* File:      Initialization.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable-next-line @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/typedef */

import { type BrowserWindow, app, shell } from "electron";
import { CreateBrowserWindow } from "#/BrowserWindow";
import type { FLogger } from "../../Shared/Log.Types";
import { GetLogger } from "#/Development";
import { RegisterInitializationFunction } from "./Initialize";
import { autoUpdater } from "electron-updater";
import log from "electron-log";

const Log: FLogger = GetLogger("Electron");

const Initialize = async (): Promise<void> =>
{
    let MainWindow: BrowserWindow | null = null;

    if (process.env.NODE_ENV === "production")
    {
        const SourceMapSupport = require("source-map-support");
        SourceMapSupport.install();
    }

    const IsDebug: boolean = (
        process.env.NODE_ENV === "development" ||
        process.env.DEBUG_PROD === "true"
    );

    if (IsDebug)
    {
        const Installer: any = require("electron-devtools-installer");
        const ForceDownload: boolean = !!process.env.UPGRADE_EXTENSIONS;
        const Extensions: TArray<string> = [ "REACT_DEVELOPER_TOOLS" ];

        Installer
            .default(
                Extensions.map((Name: string) => Installer[Name]),
                ForceDownload
            )
            .catch(Log.Error);
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const CreateWindow = async (): Promise<void> =>
    {
        if (IsDebug)
        {
            // await InstallExtensions();
        }

        const { Window, LoadFrontend } = await CreateBrowserWindow({
            height: 728,
            width: 1024,

            show: false,
            webPreferences:
            {
                devTools: true
            }
        });

        MainWindow = Window;
        await LoadFrontend();

        // MainWindow.on("show", (_Event: Electron.Event, _IsAlwaysOnTop: boolean): void =>
        // {
        //     setTimeout((): void =>
        //     {
        //         MainWindow?.webContents.send("Navigate", "TestWindow");
        //     }, 2000);
        // });

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
};

app.setAppUserModelId("gagesorrell.sorrellwm");
app.setToastActivatorCLSID("{87654321-4321-4321-1234-1234567890AB}");

RegisterInitializationFunction(async (): Promise<void> =>
{
    app.on("activate", Initialize);
});

