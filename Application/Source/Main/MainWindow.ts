/* File:      MainWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell.
 * License:   MIT
 */

import {
    AnnotatePanel,
    BringIntoPanel,
    ChangeFocus,
    FinishFocus,
    GetCurrentPanel,
    GetInterimFocusedVertex,
    GetPanelScreenshot,
    GetPanels,
    GetParent,
    IsCell,
    IsPanel,
    IsWindowTiled,
    SetInterimFocusedVertexToActive
} from "./Tree";
import {
    BlurBackground as BlurBackgroundNative,
    type FBox,
    type FLogCategory,
    type FLogLevel,
    GetDwmWindowRect,
    GetFocusedWindow,
    GetTileableWindows,
    GetWindowTitle,
    type HWindow,
    KillOrphans,
    UnblurBackground,
    WriteTaskbarIconToPng } from "@sorrellwm/windows";
import { type BrowserWindow, app, ipcMain, screen } from "electron";
import { CreateBrowserWindow, RegisterBrowserWindowEvents } from "./BrowserWindow";
import type { FAnnotatedPanel, FFocusChange, FPanel, FVertex } from "./Tree.Types";
import { type FLogger, GetLogger, LogFrontend } from "./Development";
import { CreateNotepadTestWindows } from "./Development/TestWindows";
import type { FBrowserWindowEvents } from "./BrowserWindow.Types";
import type { FFocusData, FInsertableWindowData } from "?/Transaction.Types";
import type { FIpcChannel } from "../Shared/Event.Types";
import type { FKeyboardEvent } from "./Keyboard.Types";
import type { FVirtualKey } from "$/Common/Component/Keyboard/Keyboard.Types";
import { promises as Fs } from "fs";
import { Keyboard } from "./Keyboard";
import { Vk } from "$/Common/Component/Keyboard/Keyboard";
import type { FIpcBackendChannel, TIpcHandler, FIpcFrontendChannel, TRequestData, TResponseData, TIpcCallback } from "?/Event.Types";

const Log: FLogger = GetLogger("MainWindow");

const BlurBackground = (Bounds: FBox): void =>
{
    const InterimFocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
    const SourceHandle: HWindow | undefined =
        InterimFocusedVertex !== undefined && IsCell(InterimFocusedVertex)
            ? InterimFocusedVertex.Handle
            : GetActiveWindow();

    if (SourceHandle !== undefined)
    {
        BlurBackgroundNative(Bounds, SourceHandle);
    }
    else
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("BlurBackgroundNative cannot be called because there is no InterimFocusedVertex or ActiveWindow.");
    }
};

let MainWindow: BrowserWindow | undefined = undefined;
export const GetMainWindow = (): BrowserWindow | undefined => MainWindow;

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

/** @deprecated A type-safe version of `ipcMain.on`. */
const On = (
    Event: FIpcChannel,
    Callback: ((Event: Electron.Event, ...Arguments: Array<unknown>) => void)) =>
{
    ipcMain.on(Event, Callback);
};

/** Send an event from the backend to the frontend. */
export const SendIpcEvent = <T extends FIpcBackendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: T,
    RequestData: TRequestData<T>,
    Callback: TIpcCallback<T>
): void =>
{
    ipcMain.on(Channel, (_Event: Electron.Event, ...Arguments: Array<unknown>): void =>
    {
        const ResponseData: TResponseData<T> | undefined = Arguments[0] as TResponseData<T> | undefined;
        Callback(ResponseData);
    });
    BrowserWindow.webContents.send(Channel, RequestData);
};

export const OnIpcEvent = <T extends FIpcFrontendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: T,
    Callback: TIpcHandler<T>
): void =>
{
    ipcMain.on(Channel, async (_Event: Electron.Event, ...Arguments: Array<unknown>): Promise<void> =>
    {
        const RequestData: TRequestData<T> = Arguments[0] as TRequestData<T>;
        const ResponseData: TResponseData<T> = await Callback(RequestData);
        BrowserWindow.webContents.send(Channel, ResponseData);
    });
};

const MainBrowserEvents: FBrowserWindowEvents =
{
    show: async (_Event: Electron.Event, _IsAlwaysOnTop: boolean): Promise<void> =>
    {
        MainWindow?.webContents.send("Navigate", "Main");
    }
};

const LaunchMainWindow = async (): Promise<void> =>
{
    const { Window, LoadFrontend } = await CreateBrowserWindow({
        alwaysOnTop: true,
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        width: 900,
        ...GetLeastInvisiblePosition()
    });

    MainWindow = Window;

    RegisterBrowserWindowEvents(MainWindow, MainBrowserEvents);

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
        let FocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
        if (FocusedVertex === undefined)
        {
            SetInterimFocusedVertexToActive();
            FocusedVertex = GetInterimFocusedVertex();
        }

        if (FocusedVertex === undefined)
        {
            /* eslint-disable-next-line @stylistic/max-len */
            Log.Warn("GetFocusData cannot continue because FocusedVertex was undefined and could not be set.");
            return;
        }

        if (CurrentPanel === undefined)
        {
            Log.Warn("GetFocusData cannot continue because CurrentPanel is undefined.");
            return;
        }
        // if (CurrentPanel === undefined || FocusedVertex === undefined)
        // {
        /* eslint-disable-next-line @stylistic/max-len, @stylistic/max-len */
        //     Log("GetFocusData is returning without sending data because CurrentPanel or FocusedVertex is undefined.");
        //     return;
        // }

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
        const InterimFocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
        if (InterimFocusedVertex)
        {
            /* eslint-disable-next-line @stylistic/max-len */
            // Log(`In OnChangeFocus, InterimFocusedVertex is ${ VertexToString(InterimFocusedVertex) } at ${ PositionToString(InterimFocusedVertex.Size) }.`);
        }
        ChangeFocus(FocusChange);
        UnblurBackground();
        setTimeout((): void =>
        {
            const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
            if (InterimFocus !== undefined)
            {
                BlurBackground(InterimFocus.Size);
            }
        }, 250);

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

    On("GetInsertableWindowData", async (_Event: Electron.Event, ..._Arguments: Array<unknown>) =>
    {
        const GetInsertableWindowDatum = async (TileableWindow: HWindow): Promise<FInsertableWindowData> =>
        {
            const IconBuffer: Buffer = await Fs.readFile(WriteTaskbarIconToPng(TileableWindow));
            const Icon: string = "data:image/png;base64," + IconBuffer.toString("base64");
            return {
                Handle: TileableWindow,
                Icon,
                Title: GetWindowTitle(TileableWindow)
            };
        };

        const InsertableWindowData: Array<FInsertableWindowData> =
            await Promise.all(GetTileableWindows().map(GetInsertableWindowDatum));

        MainWindow?.webContents.send("GetInsertableWindowData", InsertableWindowData);
    });

    On("Log", async (_Event: Electron.Event, ...Arguments: Array<unknown>) =>
    {
        /* eslint-disable-next-line @stylistic/max-len */
        const [ Category, Level, ...Statements ] = Arguments as [ FLogCategory, FLogLevel, ...Array<unknown> ];
        LogFrontend(Category, Level, ...Statements);
        // const StringifiedArguments: string = Arguments
        //     .map((Argument: unknown): string =>
        //     {
        //         return typeof Argument === "string"
        //             ? Argument
        //             : JSON.stringify(Argument);
        //     })
        //     .join();

        // const Birdie: string = chalk.bgMagenta(" ⚛️ ") + " ";
        // let OutString: string = Birdie;
        // for (let Index: number = 0; Index < StringifiedArguments.length; Index++)
        // {
        //     const Character: string = StringifiedArguments[Index];
        //     if (Character === "\n" && Index !== StringifiedArguments.length - 1)
        //     {
        //         OutString += Birdie + Character;
        //     }
        //     else
        //     {
        //         OutString += Character;
        //     }
        // }

        // console.log(OutString);
    });

    LoadFrontend();

    /** @TODO Run this by flag with `npm start`. */
    // CreateTestWindows();
    CreateNotepadTestWindows(4);
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
            FinishFocus();
            UnblurBackground();
            setTimeout(KillOrphans, 750);
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
