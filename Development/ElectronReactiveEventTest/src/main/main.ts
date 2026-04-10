/* File:      main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { BrowserWindow, type IpcMainEvent, app, shell } from "electron";
import type {
    Channel,
    EventErrorRecord,
    HandlerRequest,
    ListenerRequest,
    PackageKey,
    RawResponse,
    RendererOwner } from "../Reactive.Generated";
import { handle, on } from "./ReactiveIpc";
import type { IpcMainInvokeEvent } from "electron/main";
import MenuBuilder from "./menu";
import { ReactiveEventError } from "../Reactive.Generated";
import type { Registrar } from "electron-reactive-event/registrar";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import path from "path";
import { resolveHtmlPath } from "./util";

/* eslint global-require: off, no-console: off */

class AppUpdater
{
    constructor()
    {
        log.transports.file.level = "info";
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

// let mainWindow: BrowserWindow | null = null;
const mainWindow: BrowserWindow = new BrowserWindow();

// const {
//     registerCallback,
//     registerCallbacks,
//     send,
//     unregisterCallback,
//     unregisterCallbacks,
//     unregisterAll
// } = GetMainReactiveEventFunctions<IMainRegistrar, IRendererRegistrar>();
handle()

handle("GetDataPayload", async (
    Event: IpcMainInvokeEvent,
    Request: HandlerRequest<RendererOwner, "GetDataPayload">
): Promise<RawResponse<"GetData">> =>
{
    type ThisReturnType = RawResponse<"GetDataPayload">;
    return ReactiveEventError<"GetDataPayload">("NotFound");
});

send(undefined, "Notify", "Foo");

on("GetData", (Event: IpcMainEvent): void =>
{

});

on("GetData", (Event: IpcMainEvent, Request: boolean) =>
{

});

let Data: number = 0;

// const OnSetData = async ({ Event, Request }: MainCallbackArgument<"SetData", IRendererRegistrar>): Promise<void> =>
// {
//     Data = Request;
//     return;
// };

// registerCallback("SetData", OnSetData);
// send("Notify", "Foo", mainWindow);

// ipcMain.on("ipc-example", async (event, arg) =>
// {
//     const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//     console.log(msgTemplate(arg));
//     event.reply("ipc-example", msgTemplate("pong"));
// });

if (process.env.NODE_ENV === "production")
{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    type SourceMapSupport = { install: Function; };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sourceMapSupport: SourceMapSupport = require("source-map-support");
    sourceMapSupport.install();
}

const isDebug: boolean = (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
);

if (isDebug)
{
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("electron-debug").default();
}

/* eslint-disable */
const installExtensions = async () =>
{
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [ "REACT_DEVELOPER_TOOLS" ];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log);
};
/* eslint-enable */

const createWindow = async () =>
{
    if (isDebug)
    {
        await installExtensions();
    }

    const RESOURCES_PATH: string = app.isPackaged
        ? path.join(process.resourcesPath, "assets")
        : path.join(__dirname, "../../assets");

    const getAssetPath = (...paths: Array<string>): string =>
    {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        icon: getAssetPath("icon.png"),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, "preload.js")
                : path.join(__dirname, "../../.erb/dll/preload.js")
        }
    });

    mainWindow.loadURL(resolveHtmlPath("index.html"));

    mainWindow.on("ready-to-show", () =>
    {
        if (!mainWindow)
        {
            throw new Error("\"mainWindow\" is not defined");
        }
        if (process.env.START_MINIMIZED)
        {
            mainWindow.minimize();
        }
        else
        {
            mainWindow.show();
        }
    });

    mainWindow.on("closed", () =>
    {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) =>
    {
        shell.openExternal(edata.url);
        return { action: "deny" };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
  new AppUpdater();
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

app
    .whenReady()
    .then(() =>
    {
        createWindow();
        app.on("activate", () =>
        {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) {createWindow();}
        });
    })
    .catch(console.log);
