/* File:      MainWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell.
 * License:   MIT
 */

import * as Path from "path";
import {
    AnnotatePanel,
    BringIntoPanel,
    ChangeFocus,
    ClearInterimFocusedVertex,
    GetCurrentPanel,
    GetInterimFocusedVertex,
    GetPanelScreenshot,
    GetPanels,
    GetParent,
    IsPanel,
    IsWindowTiled
} from "./Tree";
import {
    BlurBackground,
    GetDwmWindowRect,
    GetFocusedWindow,
    GetWindowTitle,
    type HWindow,
    UnblurBackground } from "@sorrellwm/windows";
import { BrowserWindow, app, ipcMain, screen } from "electron";
import type { FAnnotatedPanel, FFocusChange, FPanel, FVertex } from "./Tree.Types";
import { CreateTestWindows } from "./Development/TestWindows";
import type { FFocusData } from "@/Domain/Focus";
import type { FIpcChannel } from "./Event.Types";
import type { FKeyboardEvent } from "./Keyboard.Types";
import type { FVirtualKey } from "$/Common/Component/Keyboard/Keyboard.Types";
import { Keyboard } from "./Keyboard";
import { Log } from "./Development";
import { ResolveHtmlPath } from "./Core/Utility";
import { Vk } from "$/Common/Component/Keyboard/Keyboard";
import chalk from "chalk";

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

const On = (
    Event: FIpcChannel,
    Callback: ((Event: Electron.Event, ...Arguments: Array<unknown>) => void)) =>
{
    ipcMain.on(Event, Callback);
};

const LaunchMainWindow = async (): Promise<void> =>
{
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
            nodeIntegration: true,
            preload: app.isPackaged
                ? Path.join(__dirname, "Preload.js")
                : Path.join(__dirname, "../../Distribution/Preload.js")
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

    On("GetCurrentPanel", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const Panel: FPanel | undefined = GetCurrentPanel();
        MainWindow?.webContents.send("GetCurrentPanel", Panel);
    });

    /** @TODO Find better place for this. */
    On("GetAnnotatedPanels", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
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
    const GetFocusData = async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const CurrentPanel: FPanel | undefined = GetCurrentPanel();
        const FocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
        if (CurrentPanel === undefined || FocusedVertex === undefined)
        {
            /* eslint-disable-next-line @stylistic/max-len */
            console.log("GetFocusData is returning without sending data because CurrentPanel or FocusedVertex is undefined.");
            return;
        }

        const Direction: "Horizontal" | "Vertical" = CurrentPanel.Type;
        const ParentPanel: FPanel | undefined = GetParent(CurrentPanel);
        const CanStepUp: boolean = ParentPanel !== undefined;
        const CanStepDown: boolean = IsPanel(FocusedVertex);

        const Out: FFocusData =
        {
            CanStepDown,
            CanStepUp,
            Direction
        };

        Log("GetFocusData is sending to the frontend:", Out);

        MainWindow?.webContents.send("GetFocusData", Out);
    };

    On("GetFocusData", GetFocusData);

    On("OnChangeFocus", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
    {
        const FocusChange: FFocusChange = Arguments[0] as FFocusChange;
        ChangeFocus(FocusChange);
        UnblurBackground();
        setTimeout((): void =>
        {
            const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
            if (InterimFocus !== undefined)
            {
                BlurBackground(InterimFocus.Size);
            }
        }, 150);

        GetFocusData(_Event, ...Arguments);
        Log("FocusChange", FocusChange);
    });

    /** @TODO Find better place for this. */
    On("GetPanelScreenshots", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const Panels: Array<FPanel> = GetPanels();
        const Screenshots: Array<string> = (await Promise.all(Panels.map(GetPanelScreenshot)))
            .filter((Value: string | undefined): boolean =>
            {
                return Value !== undefined;
            }) as Array<string>;

        MainWindow?.webContents.send("GetPanelScreenshots", Screenshots);
    });

    On("BringIntoPanel", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
    {
        BringIntoPanel(Arguments[0] as FAnnotatedPanel, GetActiveWindow() as HWindow);
    });

    On("TearDown", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        ActiveWindow = undefined;
        UnblurBackground();
    });

    On("Log", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
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

/** The window(s) that SorrellWm is being drawn over. */
let ActiveWindow: HWindow | undefined = undefined;

export const GetActiveWindow = (): HWindow | undefined =>
{
    return ActiveWindow;
};

export const Activate = (): void =>
{
    if (GetWindowTitle(GetFocusedWindow()) !== "SorrellWm Main Window")
    {
        ActiveWindow = GetFocusedWindow();
        const IsTiled: boolean = IsWindowTiled(GetFocusedWindow());
        MainWindow?.webContents.send("Navigate", "", { IsTiled });
        BlurBackground(GetDwmWindowRect(ActiveWindow));
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
            ClearInterimFocusedVertex();
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
    .catch(Log);

Keyboard.Subscribe(OnKey);
