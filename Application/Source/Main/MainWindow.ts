/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import * as Fs from "fs";
import * as Path from "path";
import { BrowserWindow, app, ipcMain, screen } from "electron";
import {
    CaptureWindowScreenshot,
    CoverWindow,
    GetFocusedWindow,
    GetIsLightMode,
    GetThemeColor,
    TestFun} from "@sorrellwm/windows";
import { Keyboard } from "./Keyboard";
import { resolveHtmlPath } from "./util";

let MainWindow: BrowserWindow | undefined = undefined;

const GetLeastInvisiblePosition = (): { x: number; y: number } =>
{
    const Displays: Array<Electron.Display> = screen.getAllDisplays();

    type FMonitorBounds = { left: number; right: number; top: number; bottom: number };
    const MonitorBounds: Array<FMonitorBounds> = Displays.map((display: Electron.Display): FMonitorBounds =>
    {
        return {
            bottom: display.bounds.y + display.bounds.height,
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y
        };
    });

    MonitorBounds.sort((A: FMonitorBounds, B: FMonitorBounds) => A.left - B.left || A.top - B.top);

    const MaxRight: number = Math.max(...MonitorBounds.map((bounds: FMonitorBounds) => bounds.right));
    const MaxBottom: number = Math.max(...MonitorBounds.map((bounds: FMonitorBounds) => bounds.bottom));

    const InvisibleX: number = (MaxRight + 1) * 2;
    const InvisibleY: number = (MaxBottom + 1) * 2;

    return {
        x: InvisibleX,
        y: InvisibleY
    };
};

const LaunchMainWindow = async (): Promise<void> =>
{
    console.log("Launching main window.");
    MainWindow = new BrowserWindow({
        alwaysOnTop: true,
        frame: true,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences:
        {
            devTools: false,
            nodeIntegration: true,
            preload: app.isPackaged
                ? Path.join(__dirname, "Preload.js")
                : Path.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    });

    MainWindow.on(
        "page-title-updated",
        (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): void =>
        {
            Event.preventDefault();
            MainWindow?.webContents.closeDevTools();
        }
    );

    MainWindow.loadURL(resolveHtmlPath("index.html"));
};

function OnActivation(State: string): void
{
    if (State === "Down")
    {
        const ScreenshotPath: string = CaptureWindowScreenshot(GetFocusedWindow());
        const Screenshot: Buffer = Fs.readFileSync(ScreenshotPath);
        const ScreenshotEncoded: string = `data:image/png;base64,${ Screenshot.toString("base64") }`;

        // @TODO These calls only need to be made once.  Move to an init function.

        ipcMain.on("GetThemeColor", async (_Event: Electron.Event, _Argument: unknown) =>
        {
            MainWindow?.webContents.send("GetThemeColor", GetThemeColor());
        });

        ipcMain.on("GetIsLightMode", async (_Event: Electron.Event, _Argument:  unknown) =>
        {
            const IsLightMode: boolean = GetIsLightMode();
            MainWindow?.webContents.send("GetIsLightMode", IsLightMode);
        });

        ipcMain.on("BackgroundImage", async (_Event: Electron.Event, _Argument: unknown) =>
        {
            CoverWindow(GetFocusedWindow());
        });
        MainWindow?.webContents.send("BackgroundImage", ScreenshotEncoded);
    }
    else
    {
        MainWindow?.on("closed", (_: Electron.Event): void =>
        {
            LaunchMainWindow();
        });
        MainWindow?.close();

        TestFun();
    }
}

app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);

Keyboard.Subscribe(OnActivation);
