import { BrowserWindow, app, ipcMain, screen } from "electron";
import type { FActivationKeyState } from "./Keyboard.Types";
import { CaptureWindowScreenshot, CoverWindow, GetFocusedWindow, GetWindowLocationAndSize, Test, type HWindow } from "@sorrellwm/windows";
import path from "path";
import * as Fs from "fs";

import { Keyboard } from "./Keyboard";
import { resolveHtmlPath } from "./util";
import Main from "electron/main";

let MainWindow: BrowserWindow | undefined = undefined;

const GetLeastInvisiblePosition = (): { x: number; y: number } =>
{
    // Fetch all monitors using Electron
    const displays = screen.getAllDisplays();

    // Gather the bounds of all monitors
    const monitorBounds: Array<{ left: number; right: number; top: number; bottom: number }> = displays.map((display) =>
    {
        return {
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y,
            bottom: display.bounds.y + display.bounds.height,
        };
    });

    // Sort monitors by their leftmost position and topmost position
    monitorBounds.sort((a, b) => a.left - b.left || a.top - b.top);

    // Calculate the farthest visible X and Y positions
    const farthestRight = Math.max(...monitorBounds.map((bounds) => bounds.right));
    const farthestBottom = Math.max(...monitorBounds.map((bounds) => bounds.bottom));

    // Calculate the first X and Y coordinates just outside all monitors
    const invisibleX = (farthestRight + 1) * 2;
    const invisibleY = (farthestBottom + 1) * 2;

    return { x: invisibleX, y: invisibleY };
};

const LaunchMainWindow = async (): Promise<void> =>
{
    console.log("Launching main window...");
    // const FocusedWindow: HWindow = GetFocusedWindow();
    // const Screenshot: string = CaptureWindowScreenshot(FocusedWindow);
    // const FocusedWindowBounds = GetWindowLocationAndSize(FocusedWindow);
    // console.log(FocusedWindowBounds);
    MainWindow = new BrowserWindow({
        alwaysOnTop: true,
        frame: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        skipTaskbar: true,
        webPreferences:
        {
            devTools: false,
            nodeIntegration: true,
            preload: app.isPackaged
                ? path.join(__dirname, 'Preload.js')
                : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
        // width: FocusedWindowBounds.Width,
        // height: FocusedWindowBounds.Height,
        width: 900,
        height: 900,
        show: true,
        ...GetLeastInvisiblePosition()
        // x: 0,
        // y: 0
    });
    MainWindow.on("page-title-updated", (Event: Electron.Event, Title: string, ExplicitSet: boolean): void =>
    {
        Event.preventDefault();
        MainWindow?.webContents.closeDevTools();
    });

    MainWindow.loadURL(resolveHtmlPath("index.html"));
    // console.log("Before ready to show");
    // Ref.once("ready-to-show", () =>
    // {
    //     console.log("Ready to show!");
    //     Ref.show();
    // });

    // Ref.on("show", (Event: Electron.Event, IsAlwaysOnTop: boolean): void =>
    // {
    //     console.log("Covering window...");
    //     CoverWindow(GetFocusedWindow());
    // });
};

function OnActivation(State: string): void
{
    if (State === "Down")
    {
        // @TODO Check to see if we actually should create a new window...
        // SummonMainWindow();
        console.log("Summoning Main Window...", (MainWindow as BrowserWindow).getPosition());
        // Test();
        const ScreenshotPath: string = CaptureWindowScreenshot(GetFocusedWindow());
        const Screenshot: Buffer = Fs.readFileSync(ScreenshotPath);
        const ScreenshotEncoded: string = `data:image/png;base64,${ Screenshot.toString("base64") }`;
        MainWindow?.webContents.on("BackgroundImageBack", (_): void =>
        {
        });
        ipcMain.on("BackgroundImage", async (Event, Argument) =>
        {
            console.log("BackgroundImage received by Main");
            CoverWindow(GetFocusedWindow());
        });
        MainWindow?.webContents.send("BackgroundImage", ScreenshotEncoded);
        setTimeout((): void =>
        {
        }, 500);
        // console.log("After calling `CoverWindow`", (MainWindow as BrowserWindow).getPosition());
    }
}

app
  .whenReady()
  .then(LaunchMainWindow)
  .catch(console.log);
Keyboard.Subscribe(OnActivation);
