/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import * as Path from "path";
import { AnnotatePanel, BringIntoPanel, ChangeFocus, GetCurrentPanel, GetPanelScreenshot, GetPanels, IsWindowTiled } from "./Tree";
import {
    BlurBackground,
    BlurBackground_DEPRECATED,
    GetDwmWindowRect,
    GetFocusedWindow,
    GetWindowLocationAndSize,
    GetWindowTitle,
    type HWindow,
    UnblurBackground,
    UnblurBackground_DEPRECATED} from "@sorrellwm/windows";
import { BrowserWindow, app, ipcMain, screen } from "electron";
import type { FAnnotatedPanel, FFocusChange, FPanel, FVertex } from "./Tree.Types";
import type { FKeyboardEvent } from "./Keyboard.Types";
import type { FVirtualKey } from "@/Domain/Common/Component/Keyboard/Keyboard.Types";
import { Keyboard } from "./Keyboard";
import { Log } from "./Development";
import { ResolveHtmlPath } from "./Core/Utility";
import { Vk } from "@/Domain/Common/Component/Keyboard/Keyboard";
import chalk from "chalk";
import { CreateTestWindows } from "./Development/TestWindows";

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
        }
    );

    ipcMain.on("GetCurrentPanel", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const Panel: FPanel | undefined = GetCurrentPanel();
        MainWindow?.webContents.send("GetCurrentPanel", Panel);
    });

    /** @TODO Find better place for this. */
    ipcMain.on("GetAnnotatedPanels", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const Panels: Array<FPanel> = GetPanels();
        const AnnotatedPanels: Array<FAnnotatedPanel> = (await Promise.all(Panels.map(AnnotatePanel)))
            .filter((Value: FAnnotatedPanel | undefined): boolean =>
            {
                return Value !== undefined;
            }) as Array<FAnnotatedPanel>;

        MainWindow?.webContents.send("GetAnnotatedPanels", AnnotatedPanels);
    });

    /** @TODO Find better place for this. */
    ipcMain.on("OnChangeFocus", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
    {
        const InterimFocus: FVertex = Arguments[0] as FVertex;
        const FocusChange: FFocusChange = Arguments[1] as FFocusChange;
        const NewInterimFocus: FVertex | undefined = ChangeFocus(InterimFocus, FocusChange);

        if (NewInterimFocus?.Size !== undefined)
        {
            BlurBackground(NewInterimFocus?.Size);
        }

        MainWindow?.webContents.send("OnChangeFocus", NewInterimFocus);
    });

    /** @TODO Find better place for this. */
    ipcMain.on("GetPanelScreenshots", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const Panels: Array<FPanel> = GetPanels();
        const Screenshots: Array<string> = (await Promise.all(Panels.map(GetPanelScreenshot)))
            .filter((Value: string | undefined): boolean =>
            {
                return Value !== undefined;
            }) as Array<string>;

        MainWindow?.webContents.send("GetPanelScreenshots", Screenshots);
    });

    ipcMain.on("BringIntoPanel", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
    {
        BringIntoPanel(Arguments[0] as FAnnotatedPanel, GetActiveWindows()[0] as HWindow);
    });

    ipcMain.on("TearDown", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        ActiveWindows.length = 0;
        UnblurBackground();
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

    /** @TODO Run this by flag with `npm start`. */
    CreateTestWindows();
};

/** The window that SorrellWm is being drawn over. */
const ActiveWindows: Array<HWindow> = [ ];

export const GetActiveWindows = (): Array<HWindow> =>
{
    return ActiveWindows;
};

export const Activate = (): void =>
{
    if (GetWindowTitle(GetFocusedWindow()) !== "SorrellWm Main Window")
    {
        ActiveWindows.length = 0;
        ActiveWindows.push(GetFocusedWindow());
        const IsTiled: boolean = IsWindowTiled(GetFocusedWindow());
        Log(`Focused Window of IsTiled call is ${ GetWindowTitle(GetFocusedWindow()) }.`);
        MainWindow?.webContents.send("Navigate", "", { IsTiled });
        // BlurBackground(GetWindowLocationAndSize(ActiveWindows[0]));
        BlurBackground_DEPRECATED(GetDwmWindowRect(ActiveWindows[0]));
    }
};

function OnKey(Event: FKeyboardEvent): void
{
    const { State, VkCode } = Event;
    if (MainWindow === undefined)
    {
        return;
    }

    /** @TODO Make this a modifiable setting. */
    const ActivationKey: FVirtualKey = Vk["F24"];

    if (VkCode === ActivationKey)
    {
        if (State === "Down")
        {
            Activate();
        }
        else
        {
            // UnblurBackground();
            UnblurBackground_DEPRECATED();
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
