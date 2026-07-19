"use strict";
exports.id = "Source_Main_Window_Overlay_OverlayWindow_ts";
exports.ids = ["Source_Main_Window_Overlay_OverlayWindow_ts"];
exports.modules = {

/***/ "./Source/Main/Keyboard/Keyboard.Types.ts"
/*!************************************************!*\
  !*** ./Source/Main/Keyboard/Keyboard.Types.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


/* File:      Keyboard.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Keyboard/index.ts"
/*!***************************************!*\
  !*** ./Source/Main/Keyboard/index.ts ***!
  \***************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard/Keyboard.ts"), exports);
__exportStar(__webpack_require__(/*! ./Keyboard.Types */ "./Source/Main/Keyboard/Keyboard.Types.ts"), exports);


/***/ },

/***/ "./Source/Main/Window/Overlay/OverlayWindow.ts"
/*!*****************************************************!*\
  !*** ./Source/Main/Window/Overlay/OverlayWindow.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      OverlayWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell.
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Activate = exports.SetShouldActivate = exports.GetActiveWindow = exports.GetMainWindow = void 0;
const Tree_Old_1 = __webpack_require__(/*! ../../Tree/Tree.Old */ "./Source/Main/Tree/Tree.Old.ts");
const windows_1 = __webpack_require__(/*! @sorrellwm/windows */ "@sorrellwm/windows");
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Keyboard_1 = __webpack_require__(/*! #/Keyboard */ "./Source/Main/Keyboard/index.ts");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Event_1 = __webpack_require__(/*! ../../Event */ "./Source/Main/Event/index.ts");
const Event_2 = __webpack_require__(/*! #/Event */ "./Source/Main/Event/index.ts");
const BrowserWindow_1 = __webpack_require__(/*! #/Window/BrowserWindow */ "./Source/Main/Window/BrowserWindow/index.ts");
const Development_2 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Monitor_1 = __webpack_require__(/*! #/Monitor */ "./Source/Main/Monitor.ts");
const Utility_1 = __webpack_require__(/*! #/Utility */ "./Source/Main/Utility/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const Shared_1 = __webpack_require__(/*! ../../../Shared */ "./Source/Shared/index.ts");
const Log = (0, Development_1.GetLogger)("MainWindow");
const BlurBackground = (Bounds) => {
    const InterimFocusedVertex = (0, Tree_Old_1.GetInterimFocusedVertex)();
    const SourceHandle = InterimFocusedVertex !== undefined && (0, Tree_Old_1.IsCell)(InterimFocusedVertex)
        ? InterimFocusedVertex.Handle
        : (0, exports.GetActiveWindow)();
    if (SourceHandle !== undefined) {
        const DevSettings = (0, Development_2.GetDevSettings)();
        const OutBounds = DevSettings.StaticMode.Enabled
            ? DevSettings.StaticMode.WindowShape
            : Bounds;
        Log("OutBounds", OutBounds);
        (0, windows_1.BlurBackground)(OutBounds, SourceHandle);
        if (MainWindow) {
            const Foo = electron_1.screen.getDisplayMatching(MainWindow.getBounds()).scaleFactor;
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
    else {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("BlurBackgroundNative cannot be called because there is no InterimFocusedVertex or ActiveWindow.");
    }
};
let MainWindow = undefined;
const GetMainWindow = () => MainWindow;
exports.GetMainWindow = GetMainWindow;
/** Hide the main window. */
const Deactivate = () => {
    const { x: X, y: Y } = GetLeastInvisiblePosition();
    if (MainWindow) {
        MainWindow.setPosition(X, Y, false);
        (0, windows_1.UnblurBackground)();
    }
};
const GetLeastInvisiblePosition = () => {
    const Displays = electron_1.screen.getAllDisplays();
    const MonitorBounds = Displays.map((display) => {
        return {
            bottom: display.bounds.y + display.bounds.height,
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y
        };
    });
    MonitorBounds.sort((A, B) => A.left - B.left || A.top - B.top);
    const MaxRight = Math.max(...MonitorBounds.map((bounds) => bounds.right));
    const MaxBottom = Math.max(...MonitorBounds.map((bounds) => bounds.bottom));
    const InvisibleX = (MaxRight + 1) * 2;
    const InvisibleY = (MaxBottom + 1) * 2;
    return {
        x: InvisibleX,
        y: InvisibleY
    };
};
/** @deprecated A type-safe version of `ipcMain.on`. */
const On = (Event, Callback) => {
    electron_1.ipcMain.on(Event, Callback);
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
(0, Initialize_1.RegisterInitializationFunction)(async () => {
    const ConstructorOptions = {
        alwaysOnTop: true,
        backgroundMaterial: "acrylic",
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences: {
            devTools: false
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    };
    const { Window, LoadFrontend } = await (0, BrowserWindow_1.CreateBrowserWindow)(ConstructorOptions);
    MainWindow = Window;
    // On("GetCurrentPanel", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const Panel: FPanel | undefined = GetCurrentPanel();
    //     MainWindow?.webContents.send("GetCurrentPanel", Panel);
    // });
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
    const IpcCallbacks = [
        {
            Callback: async (InTransaction) => {
                /**
                 * @TODO Figure out how to have moving tiled window sit on top of panels while selecting,
                 * such that the option to go "Down" is available iff the active window is currently on
                 * top of a panel.
                 */
                const Transaction = InTransaction;
                const ActiveWindow = (0, exports.GetActiveWindow)();
                if (ActiveWindow !== undefined) {
                    const Cell = (0, Tree_Old_1.GetCellFromHandle)(ActiveWindow);
                    if (Cell !== undefined) {
                        const Parent = (0, Tree_Old_1.GetParent)(Cell);
                        if (Parent !== undefined) {
                            const CurrentIndex = Parent.Children.indexOf(Cell);
                            const Actions = {
                                // DownNext: (): void =>
                                // {
                                //     const SiblingPanel: FVertex | undefined = GetNextSibling(Cell);
                                //     if (SiblingPanel !== undefined && IsPanel(SiblingPanel))
                                //     {
                                //         Parent.Children.splice(CurrentIndex, 1);
                                //         SiblingPanel.Children.unshift(Cell);
                                //         Publish();
                                //     }
                                // },
                                // DownPrevious: (): void =>
                                // {
                                //     const SiblingPanel: FVertex | undefined = GetPreviousSibling(Cell);
                                //     if (SiblingPanel !== undefined && IsPanel(SiblingPanel))
                                //     {
                                //         Parent.Children.splice(CurrentIndex, 1);
                                //         SiblingPanel.Children.unshift(Cell);
                                //         Publish();
                                //     }
                                // },
                                Down: () => {
                                },
                                Next: () => {
                                    const NextIndex = (0, Tree_Old_1.GetNextIndex)(Cell);
                                    if (NextIndex !== undefined) {
                                        const Temporary = Parent.Children[NextIndex];
                                        if (Temporary !== undefined) {
                                            Parent.Children[NextIndex] = Cell;
                                            Parent.Children[CurrentIndex] = Temporary;
                                        }
                                    }
                                },
                                Previous: () => {
                                    const CurrentIndex = Parent.Children.indexOf(Cell);
                                    const PreviousIndex = (0, Tree_Old_1.GetPreviousIndex)(Cell);
                                    if (PreviousIndex !== undefined) {
                                        const Temporary = Parent.Children[PreviousIndex];
                                        if (Temporary !== undefined) {
                                            Parent.Children[PreviousIndex] = Cell;
                                            Parent.Children[CurrentIndex] = Temporary;
                                        }
                                    }
                                },
                                Up: () => {
                                    const Grandparent = (0, Tree_Old_1.GetParent)(Parent);
                                    if (Grandparent !== undefined) {
                                        const ParentIndex = Grandparent.Children.indexOf(Parent);
                                        Grandparent.Children.splice(ParentIndex, 0, Cell);
                                        const Index = Parent.Children.indexOf(Cell);
                                        Parent.Children.splice(Index, 1);
                                        (0, Tree_Old_1.Publish)();
                                    }
                                }
                            };
                            Actions[Transaction.Step]();
                            return {
                                Data: {
                                    IsOnPanel: false
                                },
                                Error: undefined
                            };
                        }
                    }
                }
                return (0, Event_1.PoorEventFailureSimple)();
            },
            Channel: "MoveTiledWindow"
        },
        {
            Callback: async () => {
                const WindowToTile = (0, exports.GetActiveWindow)();
                if (WindowToTile !== undefined) {
                    const IsTiled = (0, Tree_Old_1.IsWindowTiled)((0, windows_1.GetFocusedWindow)());
                    return {
                        Data: { IsTiled },
                        Error: undefined
                    };
                }
                else {
                    return {
                        Data: undefined,
                        Error: ""
                    };
                }
            },
            Channel: "GetIsActiveWindowTiled"
        },
        {
            Callback: async (InPanel) => {
                const Panel = InPanel;
                const WindowToTile = (0, exports.GetActiveWindow)();
                if (WindowToTile !== undefined) {
                    (0, Tree_Old_1.BringIntoPanel)(Panel, (0, exports.GetActiveWindow)());
                    return {
                        Data: undefined,
                        Error: undefined
                    };
                }
                else {
                    return {
                        Data: undefined,
                        Error: ""
                    };
                }
            },
            Channel: "BringIntoPanel"
        },
        {
            Callback: async () => {
                const CurrentPanel = (0, Tree_Old_1.GetCurrentPanel)();
                let FocusedVertex = (0, Tree_Old_1.GetInterimFocusedVertex)();
                if (FocusedVertex === undefined) {
                    (0, Tree_Old_1.SetInterimFocusedVertexToActive)();
                    FocusedVertex = (0, Tree_Old_1.GetInterimFocusedVertex)();
                }
                if (FocusedVertex === undefined) {
                    /* eslint-disable-next-line @stylistic/max-len */
                    Log.Warn("GetFocusData cannot continue because FocusedVertex was undefined and could not be set.");
                    return {
                        Data: undefined,
                        Error: "FocusedVertexUndefined"
                    };
                }
                if (CurrentPanel === undefined) {
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
                const Direction = CurrentPanel.Type;
                const ParentPanel = (0, Tree_Old_1.GetParent)(CurrentPanel);
                const CanStepUp = ParentPanel !== undefined;
                const CanStepDown = (0, Tree_Old_1.IsPanel)(FocusedVertex);
                const CanMoveWithinPanel = CurrentPanel.Children.length > 1;
                const DataBase = {
                    CanMoveWithinPanel,
                    CanStepDown,
                    CanStepUp,
                    Direction
                };
                let Out = undefined;
                if ((0, Tree_Old_1.IsPanel)(FocusedVertex)) {
                    const NumVertices = FocusedVertex.Children.length;
                    Out =
                        {
                            ...DataBase,
                            NumVertices
                        };
                }
                else {
                    const FocusedWindowTitle = (0, windows_1.GetWindowTitle)(FocusedVertex.Handle);
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
            Callback: async () => {
                const ActiveWindow = (0, exports.GetActiveWindow)();
                if (ActiveWindow !== undefined) {
                    const Monitor = (0, windows_1.GetMonitorFromWindow)(ActiveWindow);
                    return {
                        Data: { Monitor },
                        Error: undefined
                    };
                }
                else {
                    return {
                        Data: undefined,
                        Error: "ActiveWindowUndefined"
                    };
                }
            },
            Channel: "GetMonitorFromFocusedWindow"
        },
        {
            Callback: async (InTranslation) => {
                const Translation = InTranslation;
                const ActiveWindow = (0, exports.GetActiveWindow)();
                if (ActiveWindow !== undefined) {
                    const { Height, Width, X, Y } = (0, windows_1.GetWindowShape)(ActiveWindow);
                    const NewShape = Translation.Direction === "X"
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
                    const LeftCorner = { X, Y };
                    const RightCorner = { X: X + Width, Y };
                    const WouldBeOutOfBounds = !(0, Monitor_1.GetMonitors)().some(({ Size }) => {
                        const IsPointInBounds = (Point) => {
                            return (Size.X <= Point.X && Point.X <= Size.X + Size.Width &&
                                Size.Y <= Point.Y && Point.Y <= Size.Y + Size.Height);
                        };
                        return IsPointInBounds(LeftCorner) || IsPointInBounds(RightCorner);
                    });
                    if (WouldBeOutOfBounds) {
                        return {
                            Data: undefined,
                            Error: ""
                        };
                    }
                    else {
                        (0, windows_1.SetWindowPosition)(ActiveWindow, NewShape);
                        return {
                            Data: undefined,
                            Error: undefined
                        };
                    }
                }
                else {
                    return {
                        Data: undefined,
                        Error: ""
                    };
                }
            },
            Channel: "MoveFloatingWindow"
        },
        {
            Callback: async () => {
                ActiveWindow = undefined;
                if (!(0, Development_2.GetDevSettings)().StaticMode.Enabled) {
                    Deactivate();
                }
                return (0, Event_1.PoorEventSuccess)();
            },
            Channel: "RequestTearDown"
        },
        {
            Callback: async () => {
                const Panels = (0, Tree_Old_1.GetPanels)();
                const Screenshots = (await Promise.all(Panels.map(Tree_Old_1.GetPanelScreenshot)))
                    .filter((Value) => {
                    return Value !== undefined;
                });
                return {
                    Data: { Screenshots },
                    Error: undefined
                };
            },
            Channel: "GetPanelScreenshots"
        },
        {
            Callback: async () => {
                const Panels = (0, Tree_Old_1.GetPanels)();
                const AnnotatedPanels = (await Promise.all(Panels.map(Tree_Old_1.AnnotatePanel)))
                    .filter((Value) => {
                    return Value !== undefined;
                });
                return {
                    Data: { AnnotatedPanels },
                    Error: undefined
                };
            },
            Channel: "GetAnnotatedPanels"
        }
    ];
    (0, Event_2.RegisterCommonIpcCallbacks)(MainWindow);
    (0, Event_1.RegisterIpcCallbacks)(MainWindow, IpcCallbacks);
    On("OnChangeFocus", async (_Event, ...Arguments) => {
        const FocusChange = Arguments[0];
        const InterimFocusedVertex = (0, Tree_Old_1.GetInterimFocusedVertex)();
        if (InterimFocusedVertex) {
            /* eslint-disable-next-line @stylistic/max-len */
            // Log(`In OnChangeFocus, InterimFocusedVertex is ${ VertexToString(InterimFocusedVertex) } at ${ PositionToString(InterimFocusedVertex.Size) }.`);
        }
        (0, Tree_Old_1.ChangeFocus)(FocusChange);
        Deactivate();
        // setTimeout((): void =>
        // {
        //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
        //     if (InterimFocus !== undefined)
        //     {
        //         BlurBackground(InterimFocus.Size);
        //     }
        // }, 250);
        const InterimFocus = (0, Tree_Old_1.GetInterimFocusedVertex)();
        if (InterimFocus !== undefined) {
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
    Log("Foo", 3, []);
    On("BringIntoPanel", async (_Event, ...Arguments) => {
        (0, Tree_Old_1.BringIntoPanel)(Arguments[0], (0, exports.GetActiveWindow)());
    });
    On("TearDown", async (_Event, ..._Arguments) => {
        ActiveWindow = undefined;
        Deactivate();
    });
    On("GetInsertableWindowData", async (_Event, ..._Arguments) => {
        const GetInsertableWindowDatum = async (TileableWindow) => {
            const Icon = await (0, Utility_1.GetPngBase64)((0, windows_1.WriteTaskbarIconToPng)(TileableWindow));
            return {
                Handle: TileableWindow,
                Icon,
                Title: (0, windows_1.GetWindowTitle)(TileableWindow)
            };
        };
        const InsertableWindowData = await Promise.all((0, windows_1.GetTileableWindows)().map(GetInsertableWindowDatum));
        MainWindow?.webContents.send("GetInsertableWindowData", InsertableWindowData);
    });
    On("Log", async (_Event, ...Arguments) => {
        /* eslint-disable-next-line @stylistic/max-len */
        const [Category, Level, ...Statements] = Arguments;
        (0, Development_1.LogFrontend)(Category, Level, ...Statements);
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
    setTimeout(() => {
        if ((0, Development_2.GetDevSettings)().StaticMode.Enabled) {
            Log("DevSettings.StaticMode.Enabled is true: calling Activate()...");
            (0, exports.Activate)();
        }
    }, 3000);
    /** @TODO Run this by flag with `npm start`. */
    // CreateTestWindows();
    // CreateNotepadTestWindows(4);
});
/** The window(s) that SorrellWm is being drawn over. */
let ActiveWindow = undefined;
const GetActiveWindow = () => {
    return ActiveWindow;
};
exports.GetActiveWindow = GetActiveWindow;
/**
 * Allows other parts of the application to tell the main window
 * that it should not activate, even when the activation key is used.
 */
let ShouldActivate = true;
const SetShouldActivate = (In) => {
    ShouldActivate = In;
};
exports.SetShouldActivate = SetShouldActivate;
/** Show the main window. */
const Activate = () => {
    if (!ShouldActivate) {
        return;
    }
    if ((0, windows_1.GetWindowTitle)((0, windows_1.GetFocusedWindow)()) !== "SorrellWm Main Window" && MainWindow) {
        ActiveWindow = (0, windows_1.GetFocusedWindow)();
        const IsTiled = (0, Tree_Old_1.IsWindowTiled)((0, windows_1.GetFocusedWindow)());
        const NavigateRequest = {
            Route: "",
            State: { IsTiled }
        };
        // MainWindow?.webContents.closeDevTools();
        (0, Event_1.SendIpcEvent)(MainWindow, "Navigate", NavigateRequest);
        BlurBackground((0, windows_1.GetDwmWindowRect)(ActiveWindow));
        Log(MainWindow?.getPosition());
        Log(MainWindow?.getSize());
        // StealFocus(GetWindowByName("SorrellWm Main Window"));
    }
};
exports.Activate = Activate;
function OnKey(Event) {
    const { State, VkCode } = Event;
    if (MainWindow === undefined) {
        return;
    }
    /** @TODO Make this a modifiable setting. */
    const ActivationKey = Shared_1.Vk["F20"];
    if (VkCode === ActivationKey) {
        if (State === "Down") {
            (0, exports.Activate)();
        }
        else {
            (0, Tree_Old_1.FinishFocus)();
            if (!(0, Development_2.GetDevSettings)().StaticMode.Enabled) {
                Deactivate();
            }
            // setTimeout(KillOrphans, 750);
        }
    }
    else {
        MainWindow.webContents.send("Keyboard", Event);
    }
}
Keyboard_1.Keyboard.Subscribe(OnKey);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luZG93X092ZXJsYXlfT3ZlcmxheVdpbmRvd190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7QUNKSDs7OztHQUlHOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsbUdBQTJCO0FBQzNCLCtHQUFpQzs7Ozs7Ozs7Ozs7O0FDUGpDOzs7O0dBSUc7OztBQUVILG9HQWtCNkI7QUFDN0Isc0ZBaUJzRDtBQUN0RCxtRUFBcUc7QUFtQnJHLDRGQUEyRDtBQUMzRCxxR0FBdUQ7QUFDdkQsdUZBQTJHO0FBQzNHLG1GQUF3RTtBQUN4RSx5SEFBNkQ7QUFFN0QscUdBQStDO0FBQy9DLG1GQUF3QztBQUN4Qyx5RkFBeUM7QUFDekMsa0hBQXlFO0FBQ3pFLHdGQUFxQztBQUVyQyxNQUFNLEdBQUcsR0FBWSwyQkFBUyxFQUFDLFlBQVksQ0FBQyxDQUFDO0FBRTdDLE1BQU0sY0FBYyxHQUFHLENBQUMsTUFBWSxFQUFRLEVBQUU7SUFFMUMsTUFBTSxvQkFBb0IsR0FBd0Isc0NBQXVCLEdBQUUsQ0FBQztJQUM1RSxNQUFNLFlBQVksR0FDZCxvQkFBb0IsS0FBSyxTQUFTLElBQUkscUJBQU0sRUFBQyxvQkFBb0IsQ0FBQztRQUM5RCxDQUFDLENBQUMsb0JBQW9CLENBQUMsTUFBTTtRQUM3QixDQUFDLENBQUMsMkJBQWUsR0FBRSxDQUFDO0lBRTVCLElBQUksWUFBWSxLQUFLLFNBQVMsRUFDOUIsQ0FBQztRQUNHLE1BQU0sV0FBVyxHQUFpQixnQ0FBYyxHQUFFLENBQUM7UUFDbkQsTUFBTSxTQUFTLEdBQVMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxPQUFPO1lBQ2xELENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFdBQVc7WUFDcEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUViLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUIsNEJBQW9CLEVBQUMsU0FBUyxFQUFFLFlBQVks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Q0FBQztBQUNMLENBQUMsQ0FBQztBQTNCVyxnQkFBUSxZQTJCbkI7QUFFRixTQUFTLEtBQUssQ0FBQyxLQUFxQjtJQUVoQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNoQyxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQzVCLENBQUM7UUFDRyxPQUFPO0lBQ1gsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxNQUFNLGFBQWEsR0FBZ0IsV0FBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTdDLElBQUksTUFBTSxLQUFLLGFBQWEsRUFDNUIsQ0FBQztRQUNHLElBQUksS0FBSyxLQUFLLE1BQU0sRUFDcEIsQ0FBQztZQUNHLG9CQUFRLEdBQUUsQ0FBQztRQUNmLENBQUM7YUFFRCxDQUFDO1lBQ0csMEJBQVcsR0FBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLGdDQUFjLEdBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUN4QyxDQUFDO2dCQUNHLFVBQVUsRUFBRSxDQUFDO1lBQ2pCLENBQUM7WUFDRCxnQ0FBZ0M7UUFDcEMsQ0FBQztJQUNMLENBQUM7U0FFRCxDQUFDO1FBQ0csVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7QUFDTCxDQUFDO0FBRUQsbUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvTWFpbi9LZXlib2FyZC9LZXlib2FyZC5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvTWFpbi9LZXlib2FyZC9pbmRleC50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvTWFpbi9XaW5kb3cvT3ZlcmxheS9PdmVybGF5V2luZG93LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgICAgS2V5Ym9hcmQuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZWaXJ0dWFsS2V5IH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuXG5leHBvcnQgdHlwZSBGQWN0aXZhdGlvbktleVN0YXRlID1cbiAgICB8IFwiRG93blwiXG4gICAgfCBcIlVwXCI7XG5cbmV4cG9ydCB0eXBlIEZLZXlib2FyZEV2ZW50ID1cbntcbiAgICBTdGF0ZTogRkFjdGl2YXRpb25LZXlTdGF0ZTtcbiAgICBWa0NvZGU6IEZWaXJ0dWFsS2V5O1xufTtcbiIsIi8qIEZpbGU6ICAgICAgaW5kZXgudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9LZXlib2FyZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vS2V5Ym9hcmQuVHlwZXNcIjtcbiIsIi8qIEZpbGU6ICAgICAgT3ZlcmxheVdpbmRvdy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsLlxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQge1xuICAgIEFubm90YXRlUGFuZWwsXG4gICAgQnJpbmdJbnRvUGFuZWwsXG4gICAgQ2hhbmdlRm9jdXMsXG4gICAgRmluaXNoRm9jdXMsXG4gICAgR2V0Q2VsbEZyb21IYW5kbGUsXG4gICAgR2V0Q3VycmVudFBhbmVsLFxuICAgIEdldEludGVyaW1Gb2N1c2VkVmVydGV4LFxuICAgIEdldE5leHRJbmRleCxcbiAgICBHZXRQYW5lbFNjcmVlbnNob3QsXG4gICAgR2V0UGFuZWxzLFxuICAgIEdldFBhcmVudCxcbiAgICBHZXRQcmV2aW91c0luZGV4LFxuICAgIElzQ2VsbCxcbiAgICBJc1BhbmVsLFxuICAgIElzV2luZG93VGlsZWQsXG4gICAgUHVibGlzaCxcbiAgICBTZXRJbnRlcmltRm9jdXNlZFZlcnRleFRvQWN0aXZlXG59IGZyb20gXCIuLi8uLi9UcmVlL1RyZWUuT2xkXCI7XG5pbXBvcnQge1xuICAgIEJsdXJCYWNrZ3JvdW5kIGFzIEJsdXJCYWNrZ3JvdW5kTmF0aXZlLFxuICAgIHR5cGUgRkJveCxcbiAgICB0eXBlIEZMb2dMZXZlbCxcbiAgICB0eXBlIEZNb25pdG9ySW5mbyxcbiAgICB0eXBlIEZWZWN0b3IyRCxcbiAgICBHZXREd21XaW5kb3dSZWN0LFxuICAgIEdldEZvY3VzZWRXaW5kb3csXG4gICAgR2V0TW9uaXRvckZyb21XaW5kb3csXG4gICAgR2V0VGlsZWFibGVXaW5kb3dzLFxuICAgIEdldFdpbmRvd1NoYXBlLFxuICAgIEdldFdpbmRvd1RpdGxlLFxuICAgIHR5cGUgSE1vbml0b3IsXG4gICAgdHlwZSBIV2luZG93LFxuICAgIFNldFdpbmRvd1Bvc2l0aW9uLFxuICAgIHR5cGUgVFJlY29yZCxcbiAgICBVbmJsdXJCYWNrZ3JvdW5kLFxuICAgIFdyaXRlVGFza2Jhckljb25Ub1BuZyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IHR5cGUgQnJvd3NlcldpbmRvdywgdHlwZSBCcm93c2VyV2luZG93Q29uc3RydWN0b3JPcHRpb25zLCBpcGNNYWluLCBzY3JlZW4gfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB0eXBlIHtcbiAgICBGQW5ub3RhdGVkUGFuZWwsXG4gICAgRkNlbGwsXG4gICAgRkZvY3VzQ2hhbmdlLFxuICAgIEZGb2N1c0RhdGEsXG4gICAgRkZvY3VzRGF0YUJhc2UsXG4gICAgRkluc2VydGFibGVXaW5kb3dEYXRhLFxuICAgIEZJcGNDaGFubmVsLFxuICAgIEZMb2dnZXIsXG4gICAgRk5hdmlnYXRlUmVxdWVzdCxcbiAgICBGUGFuZWwsXG4gICAgRlBhbmVsU3RlcCxcbiAgICBGU2ltcGxlQ2FsbGJhY2ssXG4gICAgRlRpbGVkTW92ZVRyYW5zYWN0aW9uLFxuICAgIEZUcmFuc2xhdGlvbixcbiAgICBGVmVydGV4LFxuICAgIEZWaXJ0dWFsS2V5LFxuICAgIFRFdmVudENhbGxiYWNrIH0gZnJvbSBcIi4uLy4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgdHlwZSBGS2V5Ym9hcmRFdmVudCwgS2V5Ym9hcmQgfSBmcm9tIFwiIy9LZXlib2FyZFwiO1xuaW1wb3J0IHsgR2V0TG9nZ2VyLCBMb2dGcm9udGVuZCB9IGZyb20gXCIjL0RldmVsb3BtZW50XCI7XG5pbXBvcnQgeyBQb29yRXZlbnRGYWlsdXJlU2ltcGxlLCBQb29yRXZlbnRTdWNjZXNzLCBSZWdpc3RlcklwY0NhbGxiYWNrcywgU2VuZElwY0V2ZW50IH0gZnJvbSBcIi4uLy4uL0V2ZW50XCI7XG5pbXBvcnQgeyBSZWdpc3RlckNvbW1vbklwY0NhbGxiYWNrcywgdHlwZSBUSXBjQ2FsbGJhY2sgfSBmcm9tIFwiIy9FdmVudFwiO1xuaW1wb3J0IHsgQ3JlYXRlQnJvd3NlcldpbmRvdyB9IGZyb20gXCIjL1dpbmRvdy9Ccm93c2VyV2luZG93XCI7XG5pbXBvcnQgdHlwZSB7IEZEZXZTZXR0aW5ncyB9IGZyb20gXCIjL0RldmVsb3BtZW50L0RldlNldHRpbmdzLlR5cGVzXCI7XG5pbXBvcnQgeyBHZXREZXZTZXR0aW5ncyB9IGZyb20gXCIjL0RldmVsb3BtZW50XCI7XG5pbXBvcnQgeyBHZXRNb25pdG9ycyB9IGZyb20gXCIjL01vbml0b3JcIjtcbmltcG9ydCB7IEdldFBuZ0Jhc2U2NCB9IGZyb20gXCIjL1V0aWxpdHlcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIjL0luaXRpYWxpemUvSW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgVmsgfSBmcm9tIFwiLi4vLi4vLi4vU2hhcmVkXCI7XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIk1haW5XaW5kb3dcIik7XG5cbmNvbnN0IEJsdXJCYWNrZ3JvdW5kID0gKEJvdW5kczogRkJveCk6IHZvaWQgPT5cbntcbiAgICBjb25zdCBJbnRlcmltRm9jdXNlZFZlcnRleDogRlZlcnRleCB8IHVuZGVmaW5lZCA9IEdldEludGVyaW1Gb2N1c2VkVmVydGV4KCk7XG4gICAgY29uc3QgU291cmNlSGFuZGxlOiBIV2luZG93IHwgdW5kZWZpbmVkID1cbiAgICAgICAgSW50ZXJpbUZvY3VzZWRWZXJ0ZXggIT09IHVuZGVmaW5lZCAmJiBJc0NlbGwoSW50ZXJpbUZvY3VzZWRWZXJ0ZXgpXG4gICAgICAgICAgICA/IEludGVyaW1Gb2N1c2VkVmVydGV4LkhhbmRsZVxuICAgICAgICAgICAgOiBHZXRBY3RpdmVXaW5kb3coKTtcblxuICAgIGlmIChTb3VyY2VIYW5kbGUgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IERldlNldHRpbmdzOiBGRGV2U2V0dGluZ3MgPSBHZXREZXZTZXR0aW5ncygpO1xuICAgICAgICBjb25zdCBPdXRCb3VuZHM6IEZCb3ggPSBEZXZTZXR0aW5ncy5TdGF0aWNNb2RlLkVuYWJsZWRcbiAgICAgICAgICAgID8gRGV2U2V0dGluZ3MuU3RhdGljTW9kZS5XaW5kb3dTaGFwZVxuICAgICAgICAgICAgOiBCb3VuZHM7XG5cbiAgICAgICAgTG9nKFwiT3V0Qm91bmRzXCIsIE91dEJvdW5kcyk7XG4gICAgICAgIEJsdXJCYWNrZ3JvdW5kTmF0aXZlKE91dEJvdW5kcywgU291cmNlSGFuZGxlKTtcbiAgICAgICAgaWYgKE1haW5XaW5kb3cpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IEZvbzogbnVtYmVyID0gc2NyZWVuLmdldERpc3BsYXlNYXRjaGluZyhNYWluV2luZG93LmdldEJvdW5kcygpKS5zY2FsZUZhY3RvcjtcbiAgICAgICAgICAgIE1haW5XaW5kb3cuc2V0Qm91bmRzKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IE91dEJvdW5kcy5IZWlnaHQgLyBGb28sXG4gICAgICAgICAgICAgICAgd2lkdGg6IE91dEJvdW5kcy5XaWR0aCAvIEZvbyxcbiAgICAgICAgICAgICAgICB4OiBPdXRCb3VuZHMuWCxcbiAgICAgICAgICAgICAgICB5OiBPdXRCb3VuZHMuWVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIE1haW5XaW5kb3cuc2V0UG9zaXRpb24oT3V0Qm91bmRzLlgsIE91dEJvdW5kcy5ZKTtcbiAgICAgICAgICAgIC8vIE1haW5XaW5kb3cuc2V0U2l6ZShPdXRCb3VuZHMuV2lkdGgsIE91dEJvdW5kcy5IZWlnaHQsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYWluV2luZG93Py5zZXRCb3VuZHMoe1xuICAgICAgICAvLyAgICAgaGVpZ2h0OiBPdXRCb3VuZHMuSGVpZ2h0IC8gMS4yNSxcbiAgICAgICAgLy8gICAgIHdpZHRoOiBPdXRCb3VuZHMuV2lkdGggLyAxLjI1LFxuICAgICAgICAvLyAgICAgeDogT3V0Qm91bmRzLlgsXG4gICAgICAgIC8vICAgICB5OiBPdXRCb3VuZHMuWVxuICAgICAgICAvLyB9LCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgTG9nLkVycm9yKFwiQmx1ckJhY2tncm91bmROYXRpdmUgY2Fubm90IGJlIGNhbGxlZCBiZWNhdXNlIHRoZXJlIGlzIG5vIEludGVyaW1Gb2N1c2VkVmVydGV4IG9yIEFjdGl2ZVdpbmRvdy5cIik7XG4gICAgfVxufTtcblxubGV0IE1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5leHBvcnQgY29uc3QgR2V0TWFpbldpbmRvdyA9ICgpOiBCcm93c2VyV2luZG93IHwgdW5kZWZpbmVkID0+IE1haW5XaW5kb3c7XG5cbi8qKiBIaWRlIHRoZSBtYWluIHdpbmRvdy4gKi9cbmNvbnN0IERlYWN0aXZhdGUgPSAoKTogdm9pZCA9Plxue1xuICAgIGNvbnN0IHsgeDogWCwgeTogWSB9ID0gR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbigpO1xuICAgIGlmIChNYWluV2luZG93KVxuICAgIHtcbiAgICAgICAgTWFpbldpbmRvdy5zZXRQb3NpdGlvbihYLCBZLCBmYWxzZSk7XG4gICAgICAgIFVuYmx1ckJhY2tncm91bmQoKTtcbiAgICB9XG59O1xuXG5jb25zdCBHZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uID0gKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSA9Plxue1xuICAgIGNvbnN0IERpc3BsYXlzOiBUQXJyYXk8RWxlY3Ryb24uRGlzcGxheT4gPSBzY3JlZW4uZ2V0QWxsRGlzcGxheXMoKTtcblxuICAgIHR5cGUgRk1vbml0b3JCb3VuZHMgPSB7IGxlZnQ6IG51bWJlcjsgcmlnaHQ6IG51bWJlcjsgdG9wOiBudW1iZXI7IGJvdHRvbTogbnVtYmVyIH07XG4gICAgY29uc3QgTW9uaXRvckJvdW5kczogVEFycmF5PEZNb25pdG9yQm91bmRzPiA9IERpc3BsYXlzLm1hcCgoZGlzcGxheTogRWxlY3Ryb24uRGlzcGxheSk6IEZNb25pdG9yQm91bmRzID0+XG4gICAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYm90dG9tOiBkaXNwbGF5LmJvdW5kcy55ICsgZGlzcGxheS5ib3VuZHMuaGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogZGlzcGxheS5ib3VuZHMueCxcbiAgICAgICAgICAgIHJpZ2h0OiBkaXNwbGF5LmJvdW5kcy54ICsgZGlzcGxheS5ib3VuZHMud2lkdGgsXG4gICAgICAgICAgICB0b3A6IGRpc3BsYXkuYm91bmRzLnlcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIE1vbml0b3JCb3VuZHMuc29ydCgoQTogRk1vbml0b3JCb3VuZHMsIEI6IEZNb25pdG9yQm91bmRzKSA9PiBBLmxlZnQgLSBCLmxlZnQgfHwgQS50b3AgLSBCLnRvcCk7XG5cbiAgICBjb25zdCBNYXhSaWdodDogbnVtYmVyID0gTWF0aC5tYXgoLi4uTW9uaXRvckJvdW5kcy5tYXAoKGJvdW5kczogRk1vbml0b3JCb3VuZHMpID0+IGJvdW5kcy5yaWdodCkpO1xuICAgIGNvbnN0IE1heEJvdHRvbTogbnVtYmVyID0gTWF0aC5tYXgoLi4uTW9uaXRvckJvdW5kcy5tYXAoKGJvdW5kczogRk1vbml0b3JCb3VuZHMpID0+IGJvdW5kcy5ib3R0b20pKTtcblxuICAgIGNvbnN0IEludmlzaWJsZVg6IG51bWJlciA9IChNYXhSaWdodCArIDEpICogMjtcbiAgICBjb25zdCBJbnZpc2libGVZOiBudW1iZXIgPSAoTWF4Qm90dG9tICsgMSkgKiAyO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogSW52aXNpYmxlWCxcbiAgICAgICAgeTogSW52aXNpYmxlWVxuICAgIH07XG59O1xuXG4vKiogQGRlcHJlY2F0ZWQgQSB0eXBlLXNhZmUgdmVyc2lvbiBvZiBgaXBjTWFpbi5vbmAuICovXG5jb25zdCBPbiA9IChcbiAgICBFdmVudDogRklwY0NoYW5uZWwsXG4gICAgQ2FsbGJhY2s6ICgoRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT4gdm9pZCkpID0+XG57XG4gICAgaXBjTWFpbi5vbihFdmVudCwgQ2FsbGJhY2spO1xufTtcblxuLy8gLyoqIFNlbmQgYW4gZXZlbnQgZnJvbSB0aGUgYmFja2VuZCB0byB0aGUgZnJvbnRlbmQuICovXG4vLyBleHBvcnQgY29uc3QgU2VuZElwY0V2ZW50ID0gYXN5bmMgPFR5cGUgZXh0ZW5kcyBGSXBjQmFja2VuZENoYW5uZWw+KFxuLy8gICAgIEJyb3dzZXJXaW5kb3c6IEJyb3dzZXJXaW5kb3csXG4vLyAgICAgQ2hhbm5lbDogVCxcbi8vICAgICBSZXF1ZXN0RGF0YTogVFJlcXVlc3REYXRhPFQ+XG4vLyApOiBQcm9taXNlPFRSZXNwb25zZURhdGE8VD4+ID0+XG4vLyB7XG4vLyAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFRSZXNwb25zZURhdGE8VD4+KChcbi8vICAgICAgICAgUmVzb2x2ZTogVFJlc29sdmVGdW5jdGlvbjxUUmVzcG9uc2VEYXRhPFQ+Pixcbi8vICAgICAgICAgX1JlamVjdDogRlJlamVjdEZ1bmN0aW9uXG4vLyAgICAgKTogdm9pZCA9PlxuLy8gICAgIHtcbi8vICAgICAgICAgY29uc3QgU3Vic2NyaXB0aW9uID0gKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogVEFycmF5PHVua25vd24+KTogdm9pZCA9PlxuLy8gICAgICAgICB7XG4vLyAgICAgICAgICAgICBjb25zdCBSZXNwb25zZTogVFJlc3BvbnNlRGF0YUJhc2U8VD4gPSBBcmd1bWVudHNbMF0gYXMgVFJlc3BvbnNlRGF0YUJhc2U8VD47XG4vLyAgICAgICAgICAgICBjb25zdCBSZW1vdmVMaXN0ZW5lciA9ICgpOiB2b2lkID0+XG4vLyAgICAgICAgICAgICB7XG4vLyAgICAgICAgICAgICAgICAgaXBjTWFpbi5yZW1vdmVMaXN0ZW5lcihDaGFubmVsLCBTdWJzY3JpcHRpb24pO1xuLy8gICAgICAgICAgICAgfTtcblxuLy8gICAgICAgICAgICAgUmVzb2x2ZSh7IFJlbW92ZUxpc3RlbmVyLCBSZXNwb25zZSB9KTtcbi8vICAgICAgICAgfTtcblxuLy8gICAgICAgICBCcm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoQ2hhbm5lbCwgU3Vic2NyaXB0aW9uKTtcbi8vICAgICB9KTtcbi8vIH07XG5cbi8vIGV4cG9ydCBjb25zdCBPbklwY0V2ZW50ID0gPFR5cGUgZXh0ZW5kcyBGSXBjRnJvbnRlbmRDaGFubmVsPihcbi8vICAgICBCcm93c2VyV2luZG93OiBCcm93c2VyV2luZG93LFxuLy8gICAgIENoYW5uZWw6IFQsXG4vLyAgICAgQ2FsbGJhY2s6IFRJcGNIYW5kbGVyPFQ+LFxuLy8gICAgIGJGaXJlT25jZTogYm9vbGVhbiA9IGZhbHNlXG4vLyApOiB2b2lkID0+XG4vLyB7XG4vLyAgICAgaXBjTWFpbi5vbihDaGFubmVsLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pOiBQcm9taXNlPHZvaWQ+ID0+XG4vLyAgICAge1xuLy8gICAgICAgICBjb25zdCBSZXF1ZXN0RGF0YTogVFJlcXVlc3REYXRhPFQ+ID0gQXJndW1lbnRzWzBdIGFzIFRSZXF1ZXN0RGF0YTxUPjtcbi8vICAgICAgICAgY29uc3QgUmVzcG9uc2VEYXRhOiBUUmVzcG9uc2VEYXRhPFQ+ID0gYXdhaXQgQ2FsbGJhY2soUmVxdWVzdERhdGEpO1xuLy8gICAgICAgICBCcm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoQ2hhbm5lbCwgUmVzcG9uc2VEYXRhKTtcbi8vICAgICB9KTtcbi8vIH07XG5cblJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIGNvbnN0IENvbnN0cnVjdG9yT3B0aW9uczogQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucyA9XG4gICAge1xuICAgICAgICBhbHdheXNPblRvcDogdHJ1ZSxcbiAgICAgICAgYmFja2dyb3VuZE1hdGVyaWFsOiBcImFjcnlsaWNcIixcbiAgICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgICBoZWlnaHQ6IDkwMCxcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgc2tpcFRhc2tiYXI6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIlNvcnJlbGxXbSBNYWluIFdpbmRvd1wiLFxuICAgICAgICB0aXRsZUJhclN0eWxlOiBcImhpZGRlblwiLFxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgd2ViUHJlZmVyZW5jZXM6XG4gICAgICAgIHtcbiAgICAgICAgICAgIGRldlRvb2xzOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICAuLi5HZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uKClcbiAgICB9O1xuXG4gICAgY29uc3QgeyBXaW5kb3csIExvYWRGcm9udGVuZCB9ID0gYXdhaXQgQ3JlYXRlQnJvd3NlcldpbmRvdyhDb25zdHJ1Y3Rvck9wdGlvbnMpO1xuXG4gICAgTWFpbldpbmRvdyA9IFdpbmRvdztcblxuICAgIC8vIE9uKFwiR2V0Q3VycmVudFBhbmVsXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0Q3VycmVudFBhbmVsKCk7XG4gICAgLy8gICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRDdXJyZW50UGFuZWxcIiwgUGFuZWwpO1xuICAgIC8vIH0pO1xuXG4gICAgLyoqIEBUT0RPIEZpbmQgYmV0dGVyIHBsYWNlIGZvciB0aGlzLiAqL1xuICAgIC8vIE9uKFwiR2V0QW5ub3RhdGVkUGFuZWxzXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBQYW5lbHM6IFRBcnJheTxGUGFuZWw+ID0gR2V0UGFuZWxzKCk7XG4gICAgLy8gICAgIGNvbnN0IEFubm90YXRlZFBhbmVsczogVEFycmF5PEZBbm5vdGF0ZWRQYW5lbD4gPSAoYXdhaXQgUHJvbWlzZS5hbGwoUGFuZWxzLm1hcChBbm5vdGF0ZVBhbmVsKSkpXG4gICAgLy8gICAgICAgICAuZmlsdGVyKChWYWx1ZTogRkFubm90YXRlZFBhbmVsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PlxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiBWYWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vICAgICAgICAgfSkgYXMgVEFycmF5PEZBbm5vdGF0ZWRQYW5lbD47XG5cbiAgICAvLyAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkdldEFubm90YXRlZFBhbmVsc1wiLCBBbm5vdGF0ZWRQYW5lbHMpO1xuICAgIC8vIH0pO1xuXG4gICAgLyoqXG4gICAgICogQFRPRE8gT24gdGhlIEZvY3VzIHNjcmVlbiwgdGhlIE1vdmUgYnV0dG9ucyBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgKiAoZ3JleWVkIG91dCkgaWYgdGhlcmUgaXMgb25seSBvbmUgdmVydGV4IGluIHRoZSBjdXJyZW50IHBhbmVsLlxuICAgICAqL1xuXG4gICAgLyoqIEBUT0RPIEZpbmQgYmV0dGVyIHBsYWNlIGZvciB0aGlzLiAqL1xuICAgIGNvbnN0IElwY0NhbGxiYWNrczogQXJyYXk8VElwY0NhbGxiYWNrPiA9XG4gICAgW1xuICAgICAgICB7XG4gICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKEluVHJhbnNhY3Rpb246IHVua25vd24pOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiTW92ZVRpbGVkV2luZG93XCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBUT0RPIEZpZ3VyZSBvdXQgaG93IHRvIGhhdmUgbW92aW5nIHRpbGVkIHdpbmRvdyBzaXQgb24gdG9wIG9mIHBhbmVscyB3aGlsZSBzZWxlY3RpbmcsXG4gICAgICAgICAgICAgICAgICogc3VjaCB0aGF0IHRoZSBvcHRpb24gdG8gZ28gXCJEb3duXCIgaXMgYXZhaWxhYmxlIGlmZiB0aGUgYWN0aXZlIHdpbmRvdyBpcyBjdXJyZW50bHkgb25cbiAgICAgICAgICAgICAgICAgKiB0b3Agb2YgYSBwYW5lbC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjb25zdCBUcmFuc2FjdGlvbjogRlRpbGVkTW92ZVRyYW5zYWN0aW9uID0gSW5UcmFuc2FjdGlvbiBhcyBGVGlsZWRNb3ZlVHJhbnNhY3Rpb247XG4gICAgICAgICAgICAgICAgY29uc3QgQWN0aXZlV2luZG93OiBIV2luZG93IHwgdW5kZWZpbmVkID0gR2V0QWN0aXZlV2luZG93KCk7XG4gICAgICAgICAgICAgICAgaWYgKEFjdGl2ZVdpbmRvdyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgQ2VsbDogRkNlbGwgfCB1bmRlZmluZWQgPSBHZXRDZWxsRnJvbUhhbmRsZShBY3RpdmVXaW5kb3cpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChDZWxsICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFBhcmVudDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0UGFyZW50KENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhcmVudCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IEN1cnJlbnRJbmRleDogbnVtYmVyID0gUGFyZW50LkNoaWxkcmVuLmluZGV4T2YoQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgQWN0aW9uczogVFJlY29yZDxGUGFuZWxTdGVwLCBGU2ltcGxlQ2FsbGJhY2s+ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvd25OZXh0OiAoKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zdCBTaWJsaW5nUGFuZWw6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXROZXh0U2libGluZyhDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmIChTaWJsaW5nUGFuZWwgIT09IHVuZGVmaW5lZCAmJiBJc1BhbmVsKFNpYmxpbmdQYW5lbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgUGFyZW50LkNoaWxkcmVuLnNwbGljZShDdXJyZW50SW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFNpYmxpbmdQYW5lbC5DaGlsZHJlbi51bnNoaWZ0KENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFB1Ymxpc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG93blByZXZpb3VzOiAoKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zdCBTaWJsaW5nUGFuZWw6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRQcmV2aW91c1NpYmxpbmcoQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpZiAoU2libGluZ1BhbmVsICE9PSB1bmRlZmluZWQgJiYgSXNQYW5lbChTaWJsaW5nUGFuZWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFBhcmVudC5DaGlsZHJlbi5zcGxpY2UoQ3VycmVudEluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBTaWJsaW5nUGFuZWwuQ2hpbGRyZW4udW5zaGlmdChDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBQdWJsaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvd246ICgpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBOZXh0OiAoKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBOZXh0SW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCA9IEdldE5leHRJbmRleChDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOZXh0SW5kZXggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBUZW1wb3Jhcnk6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBQYXJlbnQuQ2hpbGRyZW5bTmV4dEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVGVtcG9yYXJ5ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXJlbnQuQ2hpbGRyZW5bTmV4dEluZGV4XSA9IENlbGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhcmVudC5DaGlsZHJlbltDdXJyZW50SW5kZXhdID0gVGVtcG9yYXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJldmlvdXM6ICgpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IEN1cnJlbnRJbmRleDogbnVtYmVyID0gUGFyZW50LkNoaWxkcmVuLmluZGV4T2YoQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBQcmV2aW91c0luZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRQcmV2aW91c0luZGV4KENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFByZXZpb3VzSW5kZXggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBUZW1wb3Jhcnk6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBQYXJlbnQuQ2hpbGRyZW5bUHJldmlvdXNJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFRlbXBvcmFyeSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFyZW50LkNoaWxkcmVuW1ByZXZpb3VzSW5kZXhdID0gQ2VsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFyZW50LkNoaWxkcmVuW0N1cnJlbnRJbmRleF0gPSBUZW1wb3Jhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBVcDogKCk6IHZvaWQgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgR3JhbmRwYXJlbnQ6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldFBhcmVudChQYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEdyYW5kcGFyZW50ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgUGFyZW50SW5kZXg6IG51bWJlciA9IEdyYW5kcGFyZW50LkNoaWxkcmVuLmluZGV4T2YoUGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHcmFuZHBhcmVudC5DaGlsZHJlbi5zcGxpY2UoUGFyZW50SW5kZXgsIDAsIENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IEluZGV4OiBudW1iZXIgPSBQYXJlbnQuQ2hpbGRyZW4uaW5kZXhPZihDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXJlbnQuQ2hpbGRyZW4uc3BsaWNlKEluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQdWJsaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWN0aW9uc1tUcmFuc2FjdGlvbi5TdGVwXSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSXNPblBhbmVsOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBQb29yRXZlbnRGYWlsdXJlU2ltcGxlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2hhbm5lbDogXCJNb3ZlVGlsZWRXaW5kb3dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKCk6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJHZXRJc0FjdGl2ZVdpbmRvd1RpbGVkXCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFdpbmRvd1RvVGlsZTogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgICAgICAgICAgICAgIGlmIChXaW5kb3dUb1RpbGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IElzVGlsZWQ6IGJvb2xlYW4gPSBJc1dpbmRvd1RpbGVkKEdldEZvY3VzZWRXaW5kb3coKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhOiB7IElzVGlsZWQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0SXNBY3RpdmVXaW5kb3dUaWxlZFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoSW5QYW5lbDogdW5rbm93bik6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJCcmluZ0ludG9QYW5lbFwiPj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBQYW5lbDogRkFubm90YXRlZFBhbmVsID0gSW5QYW5lbCBhcyBGQW5ub3RhdGVkUGFuZWw7XG4gICAgICAgICAgICAgICAgY29uc3QgV2luZG93VG9UaWxlOiBIV2luZG93IHwgdW5kZWZpbmVkID0gR2V0QWN0aXZlV2luZG93KCk7XG4gICAgICAgICAgICAgICAgaWYgKFdpbmRvd1RvVGlsZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQnJpbmdJbnRvUGFuZWwoUGFuZWwsIEdldEFjdGl2ZVdpbmRvdygpIGFzIEhXaW5kb3cpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2hhbm5lbDogXCJCcmluZ0ludG9QYW5lbFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkdldEZvY3VzRGF0YVwiPj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBDdXJyZW50UGFuZWw6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldEN1cnJlbnRQYW5lbCgpO1xuICAgICAgICAgICAgICAgIGxldCBGb2N1c2VkVmVydGV4OiBGVmVydGV4IHwgdW5kZWZpbmVkID0gR2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXgoKTtcbiAgICAgICAgICAgICAgICBpZiAoRm9jdXNlZFZlcnRleCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgU2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXhUb0FjdGl2ZSgpO1xuICAgICAgICAgICAgICAgICAgICBGb2N1c2VkVmVydGV4ID0gR2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXgoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoRm9jdXNlZFZlcnRleCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgICAgICAgICBMb2cuV2FybihcIkdldEZvY3VzRGF0YSBjYW5ub3QgY29udGludWUgYmVjYXVzZSBGb2N1c2VkVmVydGV4IHdhcyB1bmRlZmluZWQgYW5kIGNvdWxkIG5vdCBiZSBzZXQuXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IFwiRm9jdXNlZFZlcnRleFVuZGVmaW5lZFwiXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKEN1cnJlbnRQYW5lbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTG9nLldhcm4oXCJHZXRGb2N1c0RhdGEgY2Fubm90IGNvbnRpbnVlIGJlY2F1c2UgQ3VycmVudFBhbmVsIGlzIHVuZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogXCJDdXJyZW50UGFuZWxVbmRlZmluZWRcIlxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiAoQ3VycmVudFBhbmVsID09PSB1bmRlZmluZWQgfHwgRm9jdXNlZFZlcnRleCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuLCBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgICAgICAgICAvLyAgICAgTG9nKFwiR2V0Rm9jdXNEYXRhIGlzIHJldHVybmluZyB3aXRob3V0IHNlbmRpbmcgZGF0YSBiZWNhdXNlIEN1cnJlbnRQYW5lbCBvciBGb2N1c2VkVmVydGV4IGlzIHVuZGVmaW5lZC5cIik7XG4gICAgICAgICAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBEaXJlY3Rpb246IFwiSG9yaXpvbnRhbFwiIHwgXCJWZXJ0aWNhbFwiID0gQ3VycmVudFBhbmVsLlR5cGU7XG4gICAgICAgICAgICAgICAgY29uc3QgUGFyZW50UGFuZWw6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldFBhcmVudChDdXJyZW50UGFuZWwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IENhblN0ZXBVcDogYm9vbGVhbiA9IFBhcmVudFBhbmVsICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgQ2FuU3RlcERvd246IGJvb2xlYW4gPSBJc1BhbmVsKEZvY3VzZWRWZXJ0ZXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IENhbk1vdmVXaXRoaW5QYW5lbDogYm9vbGVhbiA9IEN1cnJlbnRQYW5lbC5DaGlsZHJlbi5sZW5ndGggPiAxO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgRGF0YUJhc2U6IEZGb2N1c0RhdGFCYXNlID1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbk1vdmVXaXRoaW5QYW5lbCxcbiAgICAgICAgICAgICAgICAgICAgQ2FuU3RlcERvd24sXG4gICAgICAgICAgICAgICAgICAgIENhblN0ZXBVcCxcbiAgICAgICAgICAgICAgICAgICAgRGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGxldCBPdXQ6IEZGb2N1c0RhdGEgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoSXNQYW5lbChGb2N1c2VkVmVydGV4KSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE51bVZlcnRpY2VzOiBudW1iZXIgPSBGb2N1c2VkVmVydGV4LkNoaWxkcmVuLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICBPdXQgPVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5EYXRhQmFzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIE51bVZlcnRpY2VzXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IEZvY3VzZWRXaW5kb3dUaXRsZTogc3RyaW5nID0gR2V0V2luZG93VGl0bGUoRm9jdXNlZFZlcnRleC5IYW5kbGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIE91dCA9XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLkRhdGFCYXNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgRm9jdXNlZFdpbmRvd1RpdGxlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgTG9nKFwiR2V0Rm9jdXNEYXRhIGlzIHNlbmRpbmcgdG8gdGhlIGZyb250ZW5kOlwiLCBPdXQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgRGF0YTogT3V0LFxuICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDaGFubmVsOiBcIkdldEZvY3VzRGF0YVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkdldE1vbml0b3JGcm9tRm9jdXNlZFdpbmRvd1wiPj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBBY3RpdmVXaW5kb3c6IEhXaW5kb3cgfCB1bmRlZmluZWQgPSBHZXRBY3RpdmVXaW5kb3coKTtcbiAgICAgICAgICAgICAgICBpZiAoQWN0aXZlV2luZG93ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBNb25pdG9yOiBITW9uaXRvciA9IEdldE1vbml0b3JGcm9tV2luZG93KEFjdGl2ZVdpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhOiB7IE1vbml0b3IgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiBcIkFjdGl2ZVdpbmRvd1VuZGVmaW5lZFwiXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0TW9uaXRvckZyb21Gb2N1c2VkV2luZG93XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jIChJblRyYW5zbGF0aW9uOiB1bmtub3duKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIk1vdmVGbG9hdGluZ1dpbmRvd1wiPj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBUcmFuc2xhdGlvbjogRlRyYW5zbGF0aW9uID0gSW5UcmFuc2xhdGlvbiBhcyBGVHJhbnNsYXRpb247XG4gICAgICAgICAgICAgICAgY29uc3QgQWN0aXZlV2luZG93OiBIV2luZG93IHwgdW5kZWZpbmVkID0gR2V0QWN0aXZlV2luZG93KCk7XG4gICAgICAgICAgICAgICAgaWYgKEFjdGl2ZVdpbmRvdyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBIZWlnaHQsIFdpZHRoLCBYLCBZIH06IEZCb3ggPSBHZXRXaW5kb3dTaGFwZShBY3RpdmVXaW5kb3cpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBOZXdTaGFwZTogRkJveCA9IFRyYW5zbGF0aW9uLkRpcmVjdGlvbiA9PT0gXCJYXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBYOiBYICsgVHJhbnNsYXRpb24uRGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWTogWSArIFRyYW5zbGF0aW9uLkRpc3RhbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IExlZnRDb3JuZXI6IEZWZWN0b3IyRCA9IHsgWCwgWSB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBSaWdodENvcm5lcjogRlZlY3RvcjJEID0geyBYOiBYICsgV2lkdGgsIFkgfTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBXb3VsZEJlT3V0T2ZCb3VuZHM6IGJvb2xlYW4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgIUdldE1vbml0b3JzKCkuc29tZSgoeyBTaXplIH06IEZNb25pdG9ySW5mbyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBJc1BvaW50SW5Cb3VuZHMgPSAoUG9pbnQ6IEZWZWN0b3IyRCk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXplLlggPD0gUG9pbnQuWCAmJiBQb2ludC5YIDw9IFNpemUuWCArIFNpemUuV2lkdGggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpemUuWSA8PSBQb2ludC5ZICYmIFBvaW50LlkgPD0gU2l6ZS5ZICsgU2l6ZS5IZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElzUG9pbnRJbkJvdW5kcyhMZWZ0Q29ybmVyKSB8fCBJc1BvaW50SW5Cb3VuZHMoUmlnaHRDb3JuZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFdvdWxkQmVPdXRPZkJvdW5kcylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZXRXaW5kb3dQb3NpdGlvbihBY3RpdmVXaW5kb3csIE5ld1NoYXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2hhbm5lbDogXCJNb3ZlRmxvYXRpbmdXaW5kb3dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKCk6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJSZXF1ZXN0VGVhckRvd25cIj4+ID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aXZlV2luZG93ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmICghR2V0RGV2U2V0dGluZ3MoKS5TdGF0aWNNb2RlLkVuYWJsZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBEZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBvb3JFdmVudFN1Y2Nlc3MoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDaGFubmVsOiBcIlJlcXVlc3RUZWFyRG93blwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkdldFBhbmVsU2NyZWVuc2hvdHNcIj4+ID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgUGFuZWxzOiBUQXJyYXk8RlBhbmVsPiA9IEdldFBhbmVscygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IFNjcmVlbnNob3RzOiBUQXJyYXk8c3RyaW5nPiA9IChhd2FpdCBQcm9taXNlLmFsbChQYW5lbHMubWFwKEdldFBhbmVsU2NyZWVuc2hvdCkpKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfSkgYXMgVEFycmF5PHN0cmluZz47XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBEYXRhOiB7IFNjcmVlbnNob3RzIH0sXG4gICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0UGFuZWxTY3JlZW5zaG90c1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkdldEFubm90YXRlZFBhbmVsc1wiPj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBQYW5lbHM6IFRBcnJheTxGUGFuZWw+ID0gR2V0UGFuZWxzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgQW5ub3RhdGVkUGFuZWxzOiBUQXJyYXk8RkFubm90YXRlZFBhbmVsPiA9XG4gICAgICAgICAgICAgICAgICAgIChhd2FpdCBQcm9taXNlLmFsbChQYW5lbHMubWFwKEFubm90YXRlUGFuZWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKFZhbHVlOiBGQW5ub3RhdGVkUGFuZWwgfCB1bmRlZmluZWQpOiBib29sZWFuID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSBhcyBUQXJyYXk8RkFubm90YXRlZFBhbmVsPjtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIERhdGE6IHsgQW5ub3RhdGVkUGFuZWxzIH0sXG4gICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0QW5ub3RhdGVkUGFuZWxzXCJcbiAgICAgICAgfVxuICAgIF07XG5cbiAgICBSZWdpc3RlckNvbW1vbklwY0NhbGxiYWNrcyhNYWluV2luZG93KTtcbiAgICBSZWdpc3RlcklwY0NhbGxiYWNrcyhNYWluV2luZG93LCBJcGNDYWxsYmFja3MpO1xuXG4gICAgT24oXCJPbkNoYW5nZUZvY3VzXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEZvY3VzQ2hhbmdlOiBGRm9jdXNDaGFuZ2UgPSBBcmd1bWVudHNbMF0gYXMgRkZvY3VzQ2hhbmdlO1xuICAgICAgICBjb25zdCBJbnRlcmltRm9jdXNlZFZlcnRleDogRlZlcnRleCB8IHVuZGVmaW5lZCA9IEdldEludGVyaW1Gb2N1c2VkVmVydGV4KCk7XG4gICAgICAgIGlmIChJbnRlcmltRm9jdXNlZFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgLy8gTG9nKGBJbiBPbkNoYW5nZUZvY3VzLCBJbnRlcmltRm9jdXNlZFZlcnRleCBpcyAkeyBWZXJ0ZXhUb1N0cmluZyhJbnRlcmltRm9jdXNlZFZlcnRleCkgfSBhdCAkeyBQb3NpdGlvblRvU3RyaW5nKEludGVyaW1Gb2N1c2VkVmVydGV4LlNpemUpIH0uYCk7XG4gICAgICAgIH1cbiAgICAgICAgQ2hhbmdlRm9jdXMoRm9jdXNDaGFuZ2UpO1xuICAgICAgICBEZWFjdGl2YXRlKCk7XG4gICAgICAgIC8vIHNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc3QgSW50ZXJpbUZvY3VzOiBGVmVydGV4IHwgdW5kZWZpbmVkID0gR2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXgoKTtcbiAgICAgICAgLy8gICAgIGlmIChJbnRlcmltRm9jdXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgLy8gICAgIHtcbiAgICAgICAgLy8gICAgICAgICBCbHVyQmFja2dyb3VuZChJbnRlcmltRm9jdXMuU2l6ZSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0sIDI1MCk7XG4gICAgICAgIGNvbnN0IEludGVyaW1Gb2N1czogRlZlcnRleCB8IHVuZGVmaW5lZCA9IEdldEludGVyaW1Gb2N1c2VkVmVydGV4KCk7XG4gICAgICAgIGlmIChJbnRlcmltRm9jdXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgQmx1ckJhY2tncm91bmQoSW50ZXJpbUZvY3VzLlNpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0Rm9jdXNEYXRhKF9FdmVudCwgLi4uQXJndW1lbnRzKTtcbiAgICAgICAgTG9nKFwiRm9jdXNDaGFuZ2VcIiwgRm9jdXNDaGFuZ2UpO1xuICAgIH0pO1xuXG4gICAgLy8gLyoqIEBUT0RPIEZpbmQgYmV0dGVyIHBsYWNlIGZvciB0aGlzLiAqL1xuICAgIC8vIE9uKFwiR2V0UGFuZWxTY3JlZW5zaG90c1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogVEFycmF5PHVua25vd24+KSA9PlxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgUGFuZWxzOiBUQXJyYXk8RlBhbmVsPiA9IEdldFBhbmVscygpO1xuICAgIC8vICAgICBjb25zdCBTY3JlZW5zaG90czogVEFycmF5PHN0cmluZz4gPSAoYXdhaXQgUHJvbWlzZS5hbGwoUGFuZWxzLm1hcChHZXRQYW5lbFNjcmVlbnNob3QpKSlcbiAgICAvLyAgICAgICAgIC5maWx0ZXIoKFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBib29sZWFuID0+XG4gICAgLy8gICAgICAgICB7XG4gICAgLy8gICAgICAgICAgICAgcmV0dXJuIFZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gICAgICAgICB9KSBhcyBUQXJyYXk8c3RyaW5nPjtcblxuICAgIC8vICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0UGFuZWxTY3JlZW5zaG90c1wiLCBTY3JlZW5zaG90cyk7XG4gICAgLy8gfSk7XG5cbiAgICBMb2coXCJGb29cIiwgMywgWyBdKTtcblxuICAgIE9uKFwiQnJpbmdJbnRvUGFuZWxcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogVEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgQnJpbmdJbnRvUGFuZWwoQXJndW1lbnRzWzBdIGFzIEZBbm5vdGF0ZWRQYW5lbCwgR2V0QWN0aXZlV2luZG93KCkgYXMgSFdpbmRvdyk7XG4gICAgfSk7XG5cbiAgICBPbihcIlRlYXJEb3duXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBBY3RpdmVXaW5kb3cgPSB1bmRlZmluZWQ7XG4gICAgICAgIERlYWN0aXZhdGUoKTtcbiAgICB9KTtcblxuICAgIE9uKFwiR2V0SW5zZXJ0YWJsZVdpbmRvd0RhdGFcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEdldEluc2VydGFibGVXaW5kb3dEYXR1bSA9IGFzeW5jIChUaWxlYWJsZVdpbmRvdzogSFdpbmRvdyk6IFByb21pc2U8Rkluc2VydGFibGVXaW5kb3dEYXRhPiA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBJY29uOiBzdHJpbmcgPSBhd2FpdCBHZXRQbmdCYXNlNjQoV3JpdGVUYXNrYmFySWNvblRvUG5nKFRpbGVhYmxlV2luZG93KSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgSGFuZGxlOiBUaWxlYWJsZVdpbmRvdyxcbiAgICAgICAgICAgICAgICBJY29uLFxuICAgICAgICAgICAgICAgIFRpdGxlOiBHZXRXaW5kb3dUaXRsZShUaWxlYWJsZVdpbmRvdylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgSW5zZXJ0YWJsZVdpbmRvd0RhdGE6IFRBcnJheTxGSW5zZXJ0YWJsZVdpbmRvd0RhdGE+ID1cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKEdldFRpbGVhYmxlV2luZG93cygpLm1hcChHZXRJbnNlcnRhYmxlV2luZG93RGF0dW0pKTtcblxuICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0SW5zZXJ0YWJsZVdpbmRvd0RhdGFcIiwgSW5zZXJ0YWJsZVdpbmRvd0RhdGEpO1xuICAgIH0pO1xuXG4gICAgT24oXCJMb2dcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogVEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICBjb25zdCBbIENhdGVnb3J5LCBMZXZlbCwgLi4uU3RhdGVtZW50cyBdID0gQXJndW1lbnRzIGFzIFsgc3RyaW5nLCBGTG9nTGV2ZWwsIC4uLlRBcnJheTx1bmtub3duPiBdO1xuICAgICAgICBMb2dGcm9udGVuZChDYXRlZ29yeSwgTGV2ZWwsIC4uLlN0YXRlbWVudHMpO1xuICAgICAgICAvLyBjb25zdCBTdHJpbmdpZmllZEFyZ3VtZW50czogc3RyaW5nID0gQXJndW1lbnRzXG4gICAgICAgIC8vICAgICAubWFwKChBcmd1bWVudDogdW5rbm93bik6IHN0cmluZyA9PlxuICAgICAgICAvLyAgICAge1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiB0eXBlb2YgQXJndW1lbnQgPT09IFwic3RyaW5nXCJcbiAgICAgICAgLy8gICAgICAgICAgICAgPyBBcmd1bWVudFxuICAgICAgICAvLyAgICAgICAgICAgICA6IEpTT04uc3RyaW5naWZ5KEFyZ3VtZW50KTtcbiAgICAgICAgLy8gICAgIH0pXG4gICAgICAgIC8vICAgICAuam9pbigpO1xuXG4gICAgICAgIC8vIGNvbnN0IEJpcmRpZTogc3RyaW5nID0gY2hhbGsuYmdNYWdlbnRhKFwiIOKam++4jyBcIikgKyBcIiBcIjtcbiAgICAgICAgLy8gbGV0IE91dFN0cmluZzogc3RyaW5nID0gQmlyZGllO1xuICAgICAgICAvLyBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGg7IEluZGV4KyspXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gU3RyaW5naWZpZWRBcmd1bWVudHNbSW5kZXhdO1xuICAgICAgICAvLyAgICAgaWYgKENoYXJhY3RlciA9PT0gXCJcXG5cIiAmJiBJbmRleCAhPT0gU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICAgICAgLy8gICAgIHtcbiAgICAgICAgLy8gICAgICAgICBPdXRTdHJpbmcgKz0gQmlyZGllICsgQ2hhcmFjdGVyO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgICAgZWxzZVxuICAgICAgICAvLyAgICAge1xuICAgICAgICAvLyAgICAgICAgIE91dFN0cmluZyArPSBDaGFyYWN0ZXI7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhPdXRTdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgTG9hZEZyb250ZW5kKCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoR2V0RGV2U2V0dGluZ3MoKS5TdGF0aWNNb2RlLkVuYWJsZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIExvZyhcIkRldlNldHRpbmdzLlN0YXRpY01vZGUuRW5hYmxlZCBpcyB0cnVlOiBjYWxsaW5nIEFjdGl2YXRlKCkuLi5cIik7XG4gICAgICAgICAgICBBY3RpdmF0ZSgpO1xuICAgICAgICB9XG4gICAgfSwgMzAwMCk7XG5cbiAgICAvKiogQFRPRE8gUnVuIHRoaXMgYnkgZmxhZyB3aXRoIGBucG0gc3RhcnRgLiAqL1xuICAgIC8vIENyZWF0ZVRlc3RXaW5kb3dzKCk7XG4gICAgLy8gQ3JlYXRlTm90ZXBhZFRlc3RXaW5kb3dzKDQpO1xufSk7XG5cbi8qKiBUaGUgd2luZG93KHMpIHRoYXQgU29ycmVsbFdtIGlzIGJlaW5nIGRyYXduIG92ZXIuICovXG5sZXQgQWN0aXZlV2luZG93OiBIV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG5leHBvcnQgY29uc3QgR2V0QWN0aXZlV2luZG93ID0gKCk6IEhXaW5kb3cgfCB1bmRlZmluZWQgPT5cbntcbiAgICByZXR1cm4gQWN0aXZlV2luZG93O1xufTtcblxuLyoqXG4gKiBBbGxvd3Mgb3RoZXIgcGFydHMgb2YgdGhlIGFwcGxpY2F0aW9uIHRvIHRlbGwgdGhlIG1haW4gd2luZG93XG4gKiB0aGF0IGl0IHNob3VsZCBub3QgYWN0aXZhdGUsIGV2ZW4gd2hlbiB0aGUgYWN0aXZhdGlvbiBrZXkgaXMgdXNlZC5cbiAqL1xubGV0IFNob3VsZEFjdGl2YXRlOiBib29sZWFuID0gdHJ1ZTtcblxuZXhwb3J0IGNvbnN0IFNldFNob3VsZEFjdGl2YXRlID0gKEluOiBib29sZWFuKTogdm9pZCA9Plxue1xuICAgIFNob3VsZEFjdGl2YXRlID0gSW47XG59O1xuXG4vKiogU2hvdyB0aGUgbWFpbiB3aW5kb3cuICovXG5leHBvcnQgY29uc3QgQWN0aXZhdGUgPSAoKTogdm9pZCA9Plxue1xuICAgIGlmICghU2hvdWxkQWN0aXZhdGUpXG4gICAge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKEdldFdpbmRvd1RpdGxlKEdldEZvY3VzZWRXaW5kb3coKSkgIT09IFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIgJiYgTWFpbldpbmRvdylcbiAgICB7XG4gICAgICAgIEFjdGl2ZVdpbmRvdyA9IEdldEZvY3VzZWRXaW5kb3coKTtcblxuICAgICAgICBjb25zdCBJc1RpbGVkOiBib29sZWFuID0gSXNXaW5kb3dUaWxlZChHZXRGb2N1c2VkV2luZG93KCkpO1xuICAgICAgICBjb25zdCBOYXZpZ2F0ZVJlcXVlc3Q6IEZOYXZpZ2F0ZVJlcXVlc3QgPVxuICAgICAgICB7XG4gICAgICAgICAgICBSb3V0ZTogXCJcIixcbiAgICAgICAgICAgIFN0YXRlOiB7IElzVGlsZWQgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcblxuICAgICAgICBTZW5kSXBjRXZlbnQoTWFpbldpbmRvdywgXCJOYXZpZ2F0ZVwiLCBOYXZpZ2F0ZVJlcXVlc3QpO1xuICAgICAgICBCbHVyQmFja2dyb3VuZChHZXREd21XaW5kb3dSZWN0KEFjdGl2ZVdpbmRvdykpO1xuXG4gICAgICAgIExvZyhNYWluV2luZG93Py5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgTG9nKE1haW5XaW5kb3c/LmdldFNpemUoKSk7XG4gICAgICAgIC8vIFN0ZWFsRm9jdXMoR2V0V2luZG93QnlOYW1lKFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIpKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBPbktleShFdmVudDogRktleWJvYXJkRXZlbnQpOiB2b2lkXG57XG4gICAgY29uc3QgeyBTdGF0ZSwgVmtDb2RlIH0gPSBFdmVudDtcbiAgICBpZiAoTWFpbldpbmRvdyA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKiBAVE9ETyBNYWtlIHRoaXMgYSBtb2RpZmlhYmxlIHNldHRpbmcuICovXG4gICAgY29uc3QgQWN0aXZhdGlvbktleTogRlZpcnR1YWxLZXkgPSBWa1tcIkYyMFwiXTtcblxuICAgIGlmIChWa0NvZGUgPT09IEFjdGl2YXRpb25LZXkpXG4gICAge1xuICAgICAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBBY3RpdmF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgRmluaXNoRm9jdXMoKTtcbiAgICAgICAgICAgIGlmICghR2V0RGV2U2V0dGluZ3MoKS5TdGF0aWNNb2RlLkVuYWJsZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2V0VGltZW91dChLaWxsT3JwaGFucywgNzUwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBNYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXCJLZXlib2FyZFwiLCBFdmVudCk7XG4gICAgfVxufVxuXG5LZXlib2FyZC5TdWJzY3JpYmUoT25LZXkpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9