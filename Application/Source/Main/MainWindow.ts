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
    type FLogLevel,
    type FMonitorInfo,
    type FVector2D,
    GetDwmWindowRect,
    GetFocusedWindow,
    GetMonitorFromWindow,
    GetTileableWindows,
    GetWindowShape,
    GetWindowTitle,
    type HMonitor,
    type HWindow,
    SetWindowPosition,
    UnblurBackground,
    WriteTaskbarIconToPng } from "@sorrellwm/windows";
import { type BrowserWindow, type BrowserWindowConstructorOptions, ipcMain, screen } from "electron";
import type { FAnnotatedPanel, FFocusChange, FPanel, FVertex } from "../Shared/Tree.Types";
import type { FFocusData, FFocusDataBase } from "../Shared/Event/Focus.Types";
import type { FIpcChannel, TEventCallback } from "../Shared/Event";
import { GetLogger, LogFrontend } from "./Development";
import { PoorEventSuccess, RegisterIpcCallbacks, SendIpcEvent } from "./Event";
import { CreateBrowserWindow } from "./BrowserWindow";
import type { FDevSettings } from "./DevSettings.Types";
import type { FInsertableWindowData } from "../Shared/Event/Insert.Types";
import type { FKeyboardEvent } from "./Keyboard.Types";
import type { FLogger } from "../Shared/Log.Types";
import type { FNavigateRequest } from "../Shared/Event/Navigate.Types";
import type { FTranslation } from "../Shared/Event/Move.Types";
import type { FVirtualKey } from "../Shared/Keyboard.Types";
import { GetDevSettings } from "./DevSettings";
import { GetMonitors } from "./Monitor";
import { GetPngBase64 } from "./Utility";
import { Keyboard } from "./Keyboard";
import { RegisterCommonIpcCallbacks } from "./CommonEvents";
import { RegisterInitializationFunction } from "./Core/Initialize";
import type { TIpcCallback } from "./Event.Types";
import { Vk } from "../Shared/Keyboard";

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
        const DevSettings: FDevSettings = GetDevSettings();
        const OutBounds: FBox = DevSettings.StaticMode.Enabled
            ? DevSettings.StaticMode.WindowShape
            : Bounds;

        Log("OutBounds", OutBounds);
        BlurBackgroundNative(OutBounds, SourceHandle);
        if (MainWindow)
        {
            const Foo: number = screen.getDisplayMatching(MainWindow.getBounds()).scaleFactor;
            MainWindow.setBounds({
                height: OutBounds.Height / Foo,
                width: OutBounds.Width / Foo,
                x: OutBounds.X,
                y: OutBounds.Y
            });

            // MainWindow.setPosition(OutBounds.X, OutBounds.Y);
            // MainWindow.setSize(OutBounds.Width, OutBounds.Height, false);
        }
        // MainWindow?.setBounds({
        //     height: OutBounds.Height / 1.25,
        //     width: OutBounds.Width / 1.25,
        //     x: OutBounds.X,
        //     y: OutBounds.Y
        // }, false);
    }
    else
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("BlurBackgroundNative cannot be called because there is no InterimFocusedVertex or ActiveWindow.");
    }
};

let MainWindow: BrowserWindow | undefined = undefined;
export const GetMainWindow = (): BrowserWindow | undefined => MainWindow;

/** Hide the main window. */
const Deactivate = (): void =>
{
    const { x: X, y: Y } = GetLeastInvisiblePosition();
    if (MainWindow)
    {
        MainWindow.setPosition(X, Y, false);
        UnblurBackground();
    }
};

const GetLeastInvisiblePosition = (): { x: number; y: number } =>
{
    const Displays: TArray<Electron.Display> = screen.getAllDisplays();

    type FMonitorBounds = { left: number; right: number; top: number; bottom: number };
    const MonitorBounds: TArray<FMonitorBounds> = Displays.map((display: Electron.Display): FMonitorBounds =>
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
    Callback: ((Event: Electron.Event, ...Arguments: TArray<unknown>) => void)) =>
{
    ipcMain.on(Event, Callback);
};

// /** Send an event from the backend to the frontend. */
// export const SendIpcEvent = async <Type extends FIpcBackendChannel>(
//     BrowserWindow: BrowserWindow,
//     Channel: T,
//     RequestData: TRequestData<T>
// ): Promise<TResponseData<T>> =>
// {
//     return new Promise<TResponseData<T>>((
//         Resolve: TResolveFunction<TResponseData<T>>,
//         _Reject: FRejectFunction
//     ): void =>
//     {
//         const Subscription = (_Event: Electron.Event, ...Arguments: TArray<unknown>): void =>
//         {
//             const Response: TResponseDataBase<T> = Arguments[0] as TResponseDataBase<T>;
//             const RemoveListener = (): void =>
//             {
//                 ipcMain.removeListener(Channel, Subscription);
//             };

//             Resolve({ RemoveListener, Response });
//         };

//         BrowserWindow.webContents.send(Channel, Subscription);
//     });
// };

// export const OnIpcEvent = <Type extends FIpcFrontendChannel>(
//     BrowserWindow: BrowserWindow,
//     Channel: T,
//     Callback: TIpcHandler<T>,
//     bFireOnce: boolean = false
// ): void =>
// {
//     ipcMain.on(Channel, async (_Event: Electron.Event, ...Arguments: TArray<unknown>): Promise<void> =>
//     {
//         const RequestData: TRequestData<T> = Arguments[0] as TRequestData<T>;
//         const ResponseData: TResponseData<T> = await Callback(RequestData);
//         BrowserWindow.webContents.send(Channel, ResponseData);
//     });
// };

RegisterInitializationFunction(async (): Promise<void> =>
{
    const ConstructorOptions: BrowserWindowConstructorOptions =
    {
        alwaysOnTop: true,
        backgroundMaterial: "acrylic",
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences:
        {
            devTools: false
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    };

    const { Window, LoadFrontend } = await CreateBrowserWindow(ConstructorOptions);

    MainWindow = Window;

    On("GetCurrentPanel", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    {
        const Panel: FPanel | undefined = GetCurrentPanel();
        MainWindow?.webContents.send("GetCurrentPanel", Panel);
    });

    /** @TODO Find better place for this. */
    // On("GetAnnotatedPanels", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const Panels: TArray<FPanel> = GetPanels();
    //     const AnnotatedPanels: TArray<FAnnotatedPanel> = (await Promise.all(Panels.map(AnnotatePanel)))
    //         .filter((Value: FAnnotatedPanel | undefined): boolean =>
    //         {
    //             return Value !== undefined;
    //         }) as TArray<FAnnotatedPanel>;

    //     MainWindow?.webContents.send("GetAnnotatedPanels", AnnotatedPanels);
    // });

    /**
     * @TODO On the Focus screen, the Move buttons should be disabled
     * (greyed out) if there is only one vertex in the current panel.
     */

    /** @TODO Find better place for this. */
    const IpcCallbacks: Array<TIpcCallback> =
    [
        {
            Callback: async (): ReturnType<TEventCallback<"GetFocusData">> =>
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
                    return {
                        Data: undefined,
                        Error: "FocusedVertexUndefined"
                    };
                }

                if (CurrentPanel === undefined)
                {
                    Log.Warn("GetFocusData cannot continue because CurrentPanel is undefined.");
                    return {
                        Data: undefined,
                        Error: "CurrentPanelUndefined"
                    };
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
                const CanMoveWithinPanel: boolean = CurrentPanel.Children.length > 1;

                const DataBase: FFocusDataBase =
                {
                    CanMoveWithinPanel,
                    CanStepDown,
                    CanStepUp,
                    Direction
                };

                let Out: FFocusData | undefined = undefined;

                if (IsPanel(FocusedVertex))
                {
                    const NumVertices: number = FocusedVertex.Children.length;

                    Out =
                    {
                        ...DataBase,
                        NumVertices
                    };
                }
                else
                {
                    const FocusedWindowTitle: string = GetWindowTitle(FocusedVertex.Handle);

                    Out =
                    {
                        ...DataBase,
                        FocusedWindowTitle
                    };
                }

                Log("GetFocusData is sending to the frontend:", Out);

                return {
                    Data: Out,
                    Error: undefined
                };
            },
            Channel: "GetFocusData"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"GetMonitorFromFocusedWindow">> =>
            {
                const ActiveWindow: HWindow | undefined = GetActiveWindow();
                if (ActiveWindow !== undefined)
                {
                    const Monitor: HMonitor = GetMonitorFromWindow(ActiveWindow);
                    return {
                        Data: { Monitor },
                        Error: undefined
                    };
                }
                else
                {
                    return {
                        Data: undefined,
                        Error: "ActiveWindowUndefined"
                    };
                }
            },
            Channel: "GetMonitorFromFocusedWindow"
        },
        {
            Callback: async (InTranslation: unknown): ReturnType<TEventCallback<"MoveFloatingWindow">> =>
            {
                const Translation: FTranslation = InTranslation as FTranslation;
                const ActiveWindow: HWindow | undefined = GetActiveWindow();
                if (ActiveWindow !== undefined)
                {
                    const { Height, Width, X, Y }: FBox = GetWindowShape(ActiveWindow);
                    const NewShape: FBox = Translation.Direction === "X"
                        ? {
                            Height,
                            Width,
                            X: X + Translation.Distance,
                            Y
                        }
                        : {
                            Height,
                            Width,
                            X,
                            Y: Y + Translation.Distance
                        };

                    const LeftCorner: FVector2D = { X, Y };
                    const RightCorner: FVector2D = { X: X + Width, Y };

                    const WouldBeOutOfBounds: boolean =
                        !GetMonitors().some(({ Size }: FMonitorInfo): boolean =>
                        {
                            const IsPointInBounds = (Point: FVector2D): boolean =>
                            {
                                return (
                                    Size.X <= Point.X && Point.X <= Size.X + Size.Width &&
                                    Size.Y <= Point.Y && Point.Y <= Size.Y + Size.Height
                                );
                            };

                            return IsPointInBounds(LeftCorner) || IsPointInBounds(RightCorner);
                        });

                    if (WouldBeOutOfBounds)
                    {
                        return {
                            Data: undefined,
                            Error: ""
                        };
                    }
                    else
                    {
                        SetWindowPosition(ActiveWindow, NewShape);
                        return {
                            Data: undefined,
                            Error: undefined
                        };
                    }

                }
                else
                {
                    return {
                        Data: undefined,
                        Error: ""
                    };
                }
            },
            Channel: "MoveFloatingWindow"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"RequestTearDown">> =>
            {
                ActiveWindow = undefined;
                if (!GetDevSettings().StaticMode.Enabled)
                {
                    Deactivate();
                }

                return PoorEventSuccess();
            },
            Channel: "RequestTearDown"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"GetPanelScreenshots">> =>
            {
                const Panels: TArray<FPanel> = GetPanels();
                const Screenshots: TArray<string> = (await Promise.all(Panels.map(GetPanelScreenshot)))
                    .filter((Value: string | undefined): boolean =>
                    {
                        return Value !== undefined;
                    }) as TArray<string>;

                return {
                    Data: { Screenshots },
                    Error: undefined
                };
            },
            Channel: "GetPanelScreenshots"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"GetAnnotatedPanels">> =>
            {
                const Panels: TArray<FPanel> = GetPanels();
                const AnnotatedPanels: TArray<FAnnotatedPanel> =
                    (await Promise.all(Panels.map(AnnotatePanel)))
                        .filter((Value: FAnnotatedPanel | undefined): boolean =>
                        {
                            return Value !== undefined;
                        }) as TArray<FAnnotatedPanel>;

                return {
                    Data: { AnnotatedPanels },
                    Error: undefined
                };
            },
            Channel: "GetAnnotatedPanels"
        }
    ];

    RegisterCommonIpcCallbacks(MainWindow);
    RegisterIpcCallbacks(MainWindow, IpcCallbacks);

    On("OnChangeFocus", async (_Event: Electron.Event, ...Arguments: TArray<unknown>) =>
    {
        const FocusChange: FFocusChange = Arguments[0] as FFocusChange;
        const InterimFocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
        if (InterimFocusedVertex)
        {
            /* eslint-disable-next-line @stylistic/max-len */
            // Log(`In OnChangeFocus, InterimFocusedVertex is ${ VertexToString(InterimFocusedVertex) } at ${ PositionToString(InterimFocusedVertex.Size) }.`);
        }
        ChangeFocus(FocusChange);
        Deactivate();
        // setTimeout((): void =>
        // {
        //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
        //     if (InterimFocus !== undefined)
        //     {
        //         BlurBackground(InterimFocus.Size);
        //     }
        // }, 250);
        const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
        if (InterimFocus !== undefined)
        {
            BlurBackground(InterimFocus.Size);
        }

        // GetFocusData(_Event, ...Arguments);
        Log("FocusChange", FocusChange);
    });

    // /** @TODO Find better place for this. */
    // On("GetPanelScreenshots", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const Panels: TArray<FPanel> = GetPanels();
    //     const Screenshots: TArray<string> = (await Promise.all(Panels.map(GetPanelScreenshot)))
    //         .filter((Value: string | undefined): boolean =>
    //         {
    //             return Value !== undefined;
    //         }) as TArray<string>;

    //     MainWindow?.webContents.send("GetPanelScreenshots", Screenshots);
    // });

    Log("Foo", 3, [ ]);

    On("BringIntoPanel", async (_Event: Electron.Event, ...Arguments: TArray<unknown>) =>
    {
        BringIntoPanel(Arguments[0] as FAnnotatedPanel, GetActiveWindow() as HWindow);
    });

    On("TearDown", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    {
        ActiveWindow = undefined;
        Deactivate();
    });

    On("GetInsertableWindowData", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    {
        const GetInsertableWindowDatum = async (TileableWindow: HWindow): Promise<FInsertableWindowData> =>
        {
            const Icon: string = await GetPngBase64(WriteTaskbarIconToPng(TileableWindow));

            return {
                Handle: TileableWindow,
                Icon,
                Title: GetWindowTitle(TileableWindow)
            };
        };

        const InsertableWindowData: TArray<FInsertableWindowData> =
            await Promise.all(GetTileableWindows().map(GetInsertableWindowDatum));

        MainWindow?.webContents.send("GetInsertableWindowData", InsertableWindowData);
    });

    On("Log", async (_Event: Electron.Event, ...Arguments: TArray<unknown>) =>
    {
        /* eslint-disable-next-line @stylistic/max-len */
        const [ Category, Level, ...Statements ] = Arguments as [ string, FLogLevel, ...TArray<unknown> ];
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

    setTimeout((): void =>
    {
        if (GetDevSettings().StaticMode.Enabled)
        {
            Log("DevSettings.StaticMode.Enabled is true: calling Activate()...");
            Activate();
        }
    }, 3000);

    /** @TODO Run this by flag with `npm start`. */
    // CreateTestWindows();
    // CreateNotepadTestWindows(4);
});

/** The window(s) that SorrellWm is being drawn over. */
let ActiveWindow: HWindow | undefined = undefined;

export const GetActiveWindow = (): HWindow | undefined =>
{
    return ActiveWindow;
};

/**
 * Allows other parts of the application to tell the main window
 * that it should not activate, even when the activation key is used.
 */
let ShouldActivate: boolean = true;

export const SetShouldActivate = (In: boolean): void =>
{
    ShouldActivate = In;
};

/** Show the main window. */
export const Activate = (): void =>
{
    if (!ShouldActivate)
    {
        return;
    }

    if (GetWindowTitle(GetFocusedWindow()) !== "SorrellWm Main Window" && MainWindow)
    {
        ActiveWindow = GetFocusedWindow();

        const IsTiled: boolean = IsWindowTiled(GetFocusedWindow());
        const NavigateRequest: FNavigateRequest =
        {
            Route: "",
            State: { IsTiled }
        };

        // MainWindow?.webContents.closeDevTools();

        SendIpcEvent(MainWindow, "Navigate", NavigateRequest);
        BlurBackground(GetDwmWindowRect(ActiveWindow));

        Log(MainWindow?.getPosition());
        Log(MainWindow?.getSize());
        // StealFocus(GetWindowByName("SorrellWm Main Window"));
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
    const ActivationKey: FVirtualKey = Vk["F20"];

    if (VkCode === ActivationKey)
    {
        if (State === "Down")
        {
            Activate();
        }
        else
        {
            FinishFocus();
            if (!GetDevSettings().StaticMode.Enabled)
            {
                Deactivate();
            }
            // setTimeout(KillOrphans, 750);
        }
    }
    else
    {
        MainWindow.webContents.send("Keyboard", Event);
    }
}

Keyboard.Subscribe(OnKey);
