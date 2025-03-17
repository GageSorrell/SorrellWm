/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import * as Fs from "fs";
import * as Path from "path";
import {
    BlurBackground,
    CaptureScreenSectionToTempPngFile,
    type FBox,
    GetFocusedWindow,
    GetWindowTitle,
    UnblurBackground } from "@sorrellwm/windows";
import { BrowserWindow, app, ipcMain, screen } from "electron";
import type { FKeyboardEvent } from "./Keyboard.Types";
import type { FVirtualKey } from "@/Domain/Common/Component/Keyboard/Keyboard.Types";
import { Keyboard } from "./Keyboard";
import { ResolveHtmlPath } from "./Core/Utility";
import { Vk } from "@/Domain/Common/Component/Keyboard/Keyboard";
import { GetForest, GetPanels, IsWindowTiled } from "./Tree";
import chalk from "chalk";
import { Log } from "./Development";
import type { FPanel } from "./Tree.Types";

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
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences:
        {
            devTools: false,
            // devTools: true,
            nodeIntegration: true,
            preload: app.isPackaged
                ? Path.join(__dirname, "Preload.js")
                : Path.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    });

    MainWindow.on("show", (_Event: Electron.Event, _IsAlwaysOnTop: boolean): void =>
    {
        MainWindow?.webContents.send("Navigate", "Main");
    });

    MainWindow.on(
        "page-title-updated",
        (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): void =>
        {
            Event.preventDefault();
            // MainWindow?.webContents.openDevTools();
        }
    );

    /** @TODO Find better place for this. */
    ipcMain.on("GetScreenshot", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const Panels: Array<FPanel> = GetPanels();
        Log("Panels are ", Panels);
        const TestBounds: FBox = (Panels[0] as FPanel).Size;
        const ScreenshotFile: string = CaptureScreenSectionToTempPngFile(TestBounds);
        Fs.promises.readFile(ScreenshotFile).then((Data: Buffer): void =>
        {
            const Screenshot: string = "data:image/png;base64," + Data.toString("base64");
            /** @TODO Send dimensions of screenshot (Size). */
            MainWindow?.webContents.send("GetScreenshot", Screenshot);
        });
    });

    ipcMain.on("Log", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
    {
        const StringifiedArguments: string = Arguments
            .map((Argument: unknown): string =>
            {
                return typeof Argument === "string"
                    ? Argument
                    : JSON.stringify(Argument);
            })
            .join();

        const Birdie: string = chalk.bgMagenta(" ⚛️ ") + " ";
        let OutString: string = Birdie;
        for (let Index: number = 0; Index < StringifiedArguments.length; Index++)
        {
            const Character: string = StringifiedArguments[Index];
            if (Character === "\n" && Index !== StringifiedArguments.length - 1)
            {
                OutString += Birdie + Character;
            }
            else
            {
                OutString += Character;
            }
        }

        console.log(OutString);
    });

    MainWindow.loadURL(ResolveHtmlPath("index.html"));
};

function OnKey(Event: FKeyboardEvent): void
{
    const { State, VkCode } = Event;
    if (MainWindow === undefined)
    {
        return;
    }

    /** @TODO Make this a modifiable setting. */
    const ActivationKey: FVirtualKey = Vk["+"];

    if (VkCode === ActivationKey)
    {
        if (State === "Down")
        {
            const IsTiled: boolean = IsWindowTiled(GetFocusedWindow());
            console.log("Focused Window is ", GetWindowTitle(GetFocusedWindow()));
            console.log("Forest is:", GetForest());
            MainWindow.webContents.send("Navigate", "", { IsTiled });
            BlurBackground();
        }
        else
        {
            UnblurBackground();
        }
    }
    else
    {
        MainWindow.webContents.send("Keyboard", Event);
    }
}

app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);

Keyboard.Subscribe(OnKey);
