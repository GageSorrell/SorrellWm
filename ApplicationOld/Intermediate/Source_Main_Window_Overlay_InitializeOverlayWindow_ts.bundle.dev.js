"use strict";
exports.id = "Source_Main_Window_Overlay_InitializeOverlayWindow_ts";
exports.ids = ["Source_Main_Window_Overlay_InitializeOverlayWindow_ts"];
exports.modules = {

/***/ "./Source/Main/Keyboard/Keyboard.ts"
/*!******************************************!*\
  !*** ./Source/Main/Keyboard/Keyboard.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Keyboard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Keyboard = void 0;
const NodeIpc_1 = __webpack_require__(/*! #/Event/NodeIpc */ "./Source/Main/Event/NodeIpc.ts");
const Shared_1 = __webpack_require__(/*! ../../Shared */ "./Source/Shared/index.ts");
const Event_1 = __webpack_require__(/*! #/Event */ "./Source/Main/Event/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize */ "./Source/Main/Initialize/index.ts");
class FKeyboard extends Event_1.TDispatcher_DEPRECATED {
    constructor() {
        super();
    }
    IsKeyDown = false;
    /** Returns true if the `OnKey` should continue. */
    Debounce = (State) => {
        if (State === "Down") {
            if (!this.IsKeyDown) {
                this.IsKeyDown = true;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            this.IsKeyDown = false;
            return true;
        }
    };
    OnKey = (...Data) => {
        const Event = Data[0];
        const IsDebounced = this.Debounce(Event.State);
        if (IsDebounced && (0, Shared_1.IsVirtualKey)(Event.VkCode)) {
            this.Dispatch(Event);
        }
    };
}
exports.Keyboard = new FKeyboard();
async function InitializeKeyboard() {
    (0, NodeIpc_1.Subscribe)("Keyboard", exports.Keyboard.OnKey);
}
(0, Initialize_1.RegisterInitializationFunction)("Keyboard", InitializeKeyboard);


/***/ },

/***/ "./Source/Main/Window/Overlay/InitializeOverlayWindow.ts"
/*!***************************************************************!*\
  !*** ./Source/Main/Window/Overlay/InitializeOverlayWindow.ts ***!
  \***************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      InitializeOverlayWindow.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const OverlayWindow_1 = __webpack_require__(/*! ./OverlayWindow */ "./Source/Main/Window/Overlay/OverlayWindow.ts");
const BrowserWindow_1 = __webpack_require__(/*! #/Window/BrowserWindow */ "./Source/Main/Window/BrowserWindow/index.ts");
const Tree_1 = __webpack_require__(/*! #/Tree/Tree */ "./Source/Main/Tree/Tree.ts");
const DevSettings_1 = __webpack_require__(/*! #/Development/DevSettings */ "./Source/Main/Development/DevSettings.ts");
const Log_1 = __webpack_require__(/*! #/Development/Log/Log */ "./Source/Main/Development/Log/Log.ts");
const Keyboard_1 = __webpack_require__(/*! #/Keyboard/Keyboard */ "./Source/Main/Keyboard/Keyboard.ts");
const OverlayEvents_1 = __webpack_require__(/*! ./OverlayEvents */ "./Source/Main/Window/Overlay/OverlayEvents.ts");
const CommonEvents_1 = __webpack_require__(/*! #/Event/CommonEvents */ "./Source/Main/Event/CommonEvents.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const Event_1 = __webpack_require__(/*! #/Event/Event */ "./Source/Main/Event/Event.ts");
const Shared_1 = __webpack_require__(/*! ../../../Shared */ "./Source/Shared/index.ts");
const Log = (0, Log_1.GetLogger)("InitializeOverlayWindow");
async function InitializeOverlayWindow() {
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
        ...(0, OverlayWindow_1.GetLeastInvisiblePosition)()
    };
    const { Window, LoadFrontend } = await (0, BrowserWindow_1.CreateBrowserWindow)(ConstructorOptions);
    const OverlayWindow = (0, OverlayWindow_1.InitializeOverlay)(Window);
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
    (0, CommonEvents_1.RegisterCommonIpcCallbacks)(OverlayWindow);
    (0, Event_1.RegisterIpcCallbacks)(OverlayWindow, OverlayEvents_1.OverlayEvents);
    /* eslint-disable @stylistic/max-len */
    // On("OnChangeFocus", async (_Event: Electron.Event, ...Arguments: TArray<unknown>) =>
    // {
    //     const FocusChange: FFocusChange = Arguments[0] as FFocusChange;
    //     const InterimFocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
    //     if (InterimFocusedVertex)
    //     {
    //         /* eslint-disable-next-line @stylistic/max-len */
    //         // Log(`In OnChangeFocus, InterimFocusedVertex is ${ VertexToString(InterimFocusedVertex) } at ${ PositionToString(InterimFocusedVertex.Size) }.`);
    //     }
    //     ChangeFocus(FocusChange);
    //     Deactivate();
    //     // setTimeout((): void =>
    //     // {
    //     //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
    //     //     if (InterimFocus !== undefined)
    //     //     {
    //     //         BlurBackground(InterimFocus.Size);
    //     //     }
    //     // }, 250);
    //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
    //     if (InterimFocus !== undefined)
    //     {
    //         BlurBackground(InterimFocus.Size);
    //     }
    //     // GetFocusData(_Event, ...Arguments);
    //     Log("FocusChange", FocusChange);
    // });
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
    // On("BringIntoPanel", async (_Event: Electron.Event, ...Arguments: TArray<unknown>) =>
    // {
    //     BringIntoPanel(Arguments[0] as FAnnotatedPanel, GetActiveWindow() as HWindow);
    // });
    // On("TearDown", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     SetActiveWindow(undefined);
    //     Deactivate();
    // });
    // On("GetInsertableWindowData", async (_Event: Electron.Event, ..._Arguments: TArray<unknown>) =>
    // {
    //     const GetInsertableWindowDatum = async (TileableWindow: HWindow): Promise<FInsertableWindowData> =>
    //     {
    //         const Icon: string = await GetPngBase64(WriteTaskbarIconToPng(TileableWindow));
    //         return {
    //             Handle: TileableWindow,
    //             Icon,
    //             Title: GetWindowTitle(TileableWindow)
    //         };
    //     };
    //     const InsertableWindowData: TArray<FInsertableWindowData> =
    //         await Promise.all(GetTileableWindows().map(GetInsertableWindowDatum));
    //     MainWindow?.webContents.send("GetInsertableWindowData", InsertableWindowData);
    // });
    //     const StringifiedArguments: string = Arguments
    //         .map((Argument: unknown): string =>
    //         {
    //             return typeof Argument === "string"
    //                 ? Argument
    //                 : JSON.stringify(Argument);
    //         })
    //         .join();
    //     const Birdie: string = chalk.bgMagenta(" ⚛️ ") + " ";
    //     let OutString: string = Birdie;
    //     for (let Index: number = 0; Index < StringifiedArguments.length; Index++)
    //     {
    //         const Character: string = StringifiedArguments[Index];
    //         if (Character === "\n" && Index !== StringifiedArguments.length - 1)
    //         {
    //             OutString += Birdie + Character;
    //         }
    //         else
    //         {
    //             OutString += Character;
    //         }
    //     }
    //     console.log(OutString);
    // });
    /* eslint-enable @stylistic/max-len */
    LoadFrontend();
    setTimeout(() => {
        if ((0, DevSettings_1.GetDevSettings)().StaticMode.Enabled) {
            Log("DevSettings.StaticMode.Enabled is true: calling Activate()...");
            (0, OverlayWindow_1.Activate)();
        }
    }, 3000);
    /** @TODO Run this by flag with `npm start`. */
    // CreateTestWindows();
    // CreateNotepadTestWindows(4);
    function OnKey(Event) {
        const { State, VkCode } = Event;
        if (OverlayWindow === undefined) {
            return;
        }
        /** @TODO Make this a modifiable setting. */
        const ActivationKey = Shared_1.Vk["F20"];
        if (VkCode === ActivationKey) {
            if (State === "Down") {
                (0, OverlayWindow_1.Activate)();
            }
            else {
                (0, Tree_1.FinishFocus)();
                if (!(0, DevSettings_1.GetDevSettings)().StaticMode.Enabled) {
                    (0, OverlayWindow_1.Deactivate)();
                }
                // setTimeout(KillOrphans, 750);
            }
        }
        else {
            OverlayWindow.webContents.send("Keyboard", Event);
        }
    }
    Keyboard_1.Keyboard.Subscribe(OnKey);
}
;
(0, Initialize_1.RegisterInitializationFunction)("OverlayWindow", InitializeOverlayWindow);


/***/ },

/***/ "./Source/Main/Window/Overlay/OverlayEvents.ts"
/*!*****************************************************!*\
  !*** ./Source/Main/Window/Overlay/OverlayEvents.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      OverlayEvents.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OverlayEvents = void 0;
const Tree_1 = __webpack_require__(/*! #/Tree/Tree */ "./Source/Main/Tree/Tree.ts");
const OverlayWindow_1 = __webpack_require__(/*! ./OverlayWindow */ "./Source/Main/Window/Overlay/OverlayWindow.ts");
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Event_1 = __webpack_require__(/*! #/Event */ "./Source/Main/Event/index.ts");
const Log = (0, Development_1.GetLogger)("OverlayEvents");
// const GetFocusData = async (): Promise<TAwaitedCallback<"GetFocusData", IFrontendEventRegistrar>> =>
const GetFocusData = async () => {
    const CurrentPanel = (0, Tree_1.GetCurrentPanel)();
    let FocusedVertex = (0, Tree_1.GetInterimFocusedVertex)();
    if (FocusedVertex === undefined) {
        (0, Tree_1.SetInterimFocusedVertexToActive)();
        FocusedVertex = (0, Tree_1.GetInterimFocusedVertex)();
    }
    if (FocusedVertex === undefined) {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Warn("GetFocusData cannot continue because FocusedVertex was undefined and could not be set.");
        return {
            Error: "FocusedVertexUndefined"
        };
    }
    if (CurrentPanel === undefined) {
        Log.Warn("GetFocusData cannot continue because CurrentPanel is undefined.");
        return {
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
    const ParentPanel = (0, Tree_1.GetParent)(CurrentPanel);
    const CanStepUp = ParentPanel !== undefined;
    const CanStepDown = (0, Tree_1.IsPanel)(FocusedVertex);
    const CanMoveWithinPanel = CurrentPanel.Children.length > 1;
    const RealSize = await (0, Tree_1.GetRealSize)(FocusedVertex);
    if (RealSize === undefined) {
        return {
            Error: "UnspecifiedError"
        };
    }
    const DataBase = {
        CanMoveWithinPanel,
        CanStepDown,
        CanStepUp,
        Direction,
        RealSize
    };
    let Out = undefined;
    if ((0, Tree_1.IsPanel)(FocusedVertex)) {
        const NumVertices = FocusedVertex.Children.length;
        Out =
            {
                ...DataBase,
                NumVertices
            };
    }
    else {
        const FocusedWindowTitle = (0, wm_windows_1.GetWindowTitle)(FocusedVertex.Handle);
        Out =
            {
                ...DataBase,
                FocusedWindowTitle
            };
    }
    Log("GetFocusData is sending to the frontend:", Out);
    return {
        Data: Out
    };
};
exports.OverlayEvents = [
    // GetFocusDataEvent,
    undefined,
    {
        Callback: async (InFocusChange) => {
            const FocusChange = InFocusChange;
            (0, Tree_1.ChangeFocus)(FocusChange);
            (0, OverlayWindow_1.Deactivate)();
            // setTimeout((): void =>
            // {
            //     const InterimFocus: FVertex | undefined = GetInterimFocusedVertex();
            //     if (InterimFocus !== undefined)
            //     {
            //         BlurBackground(InterimFocus.Size);
            //     }
            // }, 250);
            const InterimFocus = (0, Tree_1.GetInterimFocusedVertex)();
            if (InterimFocus !== undefined) {
                (0, OverlayWindow_1.BlurBackground)(InterimFocus.Size);
            }
            // GetFocusData(_Event, ...Arguments);
            Log("FocusChange", FocusChange);
            const Response = await undefined(undefined);
            // await (GetFocusDataEvent.Callback as TEventCallback<"GetFocusData">)(undefined);
            return Response;
        },
        Channel: "OnChangeFocus"
    },
    {
        Callback: async (InTransaction) => {
            /**
             * @TODO Figure out how to have moving tiled window sit on top of panels while selecting,
             * such that the option to go "Down" is available iff the active window is currently on
             * top of a panel.
             */
            const Transaction = InTransaction;
            const ActiveWindow = (0, OverlayWindow_1.GetActiveWindow)();
            if (ActiveWindow !== undefined) {
                const Cell = (0, Tree_1.GetCellFromHandle)(ActiveWindow);
                if (Cell !== undefined) {
                    const Parent = (0, Tree_1.GetParent)(Cell);
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
                                const NextIndex = (0, Tree_1.GetNextIndex)(Cell);
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
                                const PreviousIndex = (0, Tree_1.GetPreviousIndex)(Cell);
                                if (PreviousIndex !== undefined) {
                                    const Temporary = Parent.Children[PreviousIndex];
                                    if (Temporary !== undefined) {
                                        Parent.Children[PreviousIndex] = Cell;
                                        Parent.Children[CurrentIndex] = Temporary;
                                    }
                                }
                            },
                            Up: () => {
                                const Grandparent = (0, Tree_1.GetParent)(Parent);
                                if (Grandparent !== undefined) {
                                    const ParentIndex = Grandparent.Children.indexOf(Parent);
                                    Grandparent.Children.splice(ParentIndex, 0, Cell);
                                    const Index = Parent.Children.indexOf(Cell);
                                    Parent.Children.splice(Index, 1);
                                    (0, Tree_1.Publish)();
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
            const WindowToTile = (0, OverlayWindow_1.GetActiveWindow)();
            if (WindowToTile !== undefined) {
                const IsTiled = (0, Tree_1.IsWindowTiled)((0, wm_windows_1.GetFocusedWindow)());
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
            const WindowToTile = (0, OverlayWindow_1.GetActiveWindow)();
            if (WindowToTile !== undefined) {
                (0, Tree_1.BringIntoPanel)(Panel, (0, OverlayWindow_1.GetActiveWindow)());
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
            const ActiveWindow = (0, OverlayWindow_1.GetActiveWindow)();
            if (ActiveWindow !== undefined) {
                const Monitor = (0, wm_windows_1.GetMonitorFromWindow)(ActiveWindow);
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
            const ActiveWindow = (0, OverlayWindow_1.GetActiveWindow)();
            if (ActiveWindow !== undefined) {
                const { Height, Width, X, Y } = (0, wm_windows_1.GetWindowShape)(ActiveWindow);
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
                const WouldBeOutOfBounds = !(0, wm_windows_1.GetMonitors)().some(({ Size }) => {
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
                    (0, wm_windows_1.SetWindowPosition)(ActiveWindow, NewShape);
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
        Callback: async (InStatements) => {
            const [Category, Level, ...Statements] = InStatements;
            (0, Development_1.LogFrontend)(Category, Level, ...Statements);
            return (0, Event_1.PoorEventSuccess)();
        },
        Channel: "Log"
    },
    {
        Callback: async () => {
            (0, OverlayWindow_1.SetActiveWindow)(undefined);
            if (!(0, Development_1.GetDevSettings)().StaticMode.Enabled) {
                (0, OverlayWindow_1.Deactivate)();
            }
            return (0, Event_1.PoorEventSuccess)();
        },
        Channel: "RequestTearDown"
    },
    {
        Callback: async () => {
            const Panels = (0, Tree_1.GetPanels)();
            const Screenshots = (await Promise.all(Panels.map(Tree_1.GetPanelScreenshot)))
                .filter((Value) => {
                return Value !== undefined;
            });
            return {
                Data: Screenshots,
                Error: undefined
            };
        },
        Channel: "GetPanelScreenshots"
    },
    {
        Callback: async () => {
            const Panels = (0, Tree_1.GetPanels)();
            const AnnotatedPanels = (await Promise.all(Panels.map(Tree_1.AnnotatePanel)))
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


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fV2luZG93X092ZXJsYXlfSW5pdGlhbGl6ZU92ZXJsYXlXaW5kb3dfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRzs7O0FBR0gsK0ZBQTREO0FBQzVELHFGQUE0QztBQUM1QyxtRkFBaUQ7QUFDakQsa0dBQThEO0FBRTlELE1BQU0sU0FBVSxTQUFRLDhCQUFzQztJQUUxRDtRQUVJLEtBQUssRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVPLFNBQVMsR0FBWSxLQUFLLENBQUM7SUFFbkMsbURBQW1EO0lBQzNDLFFBQVEsR0FBRyxDQUFDLEtBQThCLEVBQVcsRUFBRTtRQUUzRCxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQ3BCLENBQUM7WUFDRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFDbkIsQ0FBQztnQkFDRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztpQkFFRCxDQUFDO2dCQUNHLE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDO2FBRUQsQ0FBQztZQUNHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDLENBQUM7SUFFSyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQXFCLEVBQVEsRUFBRTtRQUU5QyxNQUFNLEtBQUssR0FBbUIsSUFBSSxDQUFDLENBQUMsQ0FBbUIsQ0FBQztRQUN4RCxNQUFNLFdBQVcsR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RCxJQUFJLFdBQVcsSUFBSSx5QkFBWSxFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFDN0MsQ0FBQztZQUNHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUMsQ0FBQztDQUNM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Q2pDO0lBQ0Q7UUFDSSxRQUFRLEVBQUUsS0FBSyxJQUFzRCxFQUFFO1lBRW5FLE1BQU0sTUFBTSxHQUFtQixvQkFBUyxHQUFFLENBQUM7WUFDM0MsTUFBTSxlQUFlLEdBQ2pCLENBQUMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQWEsQ0FBQyxDQUFDLENBQUM7aUJBQ3pDLE1BQU0sQ0FBQyxDQUFDLEtBQWtDLEVBQVcsRUFBRTtnQkFFcEQsT0FBTyxLQUFLLEtBQUssU0FBUyxDQUFDO1lBQy9CLENBQUMsQ0FBNEIsQ0FBQztZQUV0QyxPQUFPO2dCQUNILElBQUksRUFBRSxFQUFFLGVBQWUsRUFBRTtnQkFDekIsS0FBSyxFQUFFLFNBQVM7YUFDbkIsQ0FBQztRQUNOLENBQUM7UUFDRCxPQUFPLEVBQUUsb0JBQW9CO0tBQ2hDO0NBQ0ssQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vS2V5Ym9hcmQvS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9XaW5kb3cvT3ZlcmxheS9Jbml0aWFsaXplT3ZlcmxheVdpbmRvdy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1dpbmRvdy9PdmVybGF5L092ZXJsYXlFdmVudHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZSAgICAgIEtleWJvYXJkLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGS2V5Ym9hcmRFdmVudCB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmUgYXMgSXBjU3Vic2NyaWJlIH0gZnJvbSBcIiMvRXZlbnQvTm9kZUlwY1wiO1xuaW1wb3J0IHsgSXNWaXJ0dWFsS2V5IH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgVERpc3BhdGNoZXJfREVQUkVDQVRFRCB9IGZyb20gXCIjL0V2ZW50XCI7XG5pbXBvcnQgeyBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24gfSBmcm9tIFwiIy9Jbml0aWFsaXplXCI7XG5cbmNsYXNzIEZLZXlib2FyZCBleHRlbmRzIFREaXNwYXRjaGVyX0RFUFJFQ0FURUQ8RktleWJvYXJkRXZlbnQ+XG57XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBJc0tleURvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGBPbktleWAgc2hvdWxkIGNvbnRpbnVlLiAqL1xuICAgIHByaXZhdGUgRGVib3VuY2UgPSAoU3RhdGU6IEZLZXlib2FyZEV2ZW50W1wiU3RhdGVcIl0pOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuSXNLZXlEb3duKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuSXNLZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLklzS2V5RG93biA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIE9uS2V5ID0gKC4uLkRhdGE6IFRBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEV2ZW50OiBGS2V5Ym9hcmRFdmVudCA9IERhdGFbMF0gYXMgRktleWJvYXJkRXZlbnQ7XG4gICAgICAgIGNvbnN0IElzRGVib3VuY2VkOiBib29sZWFuID0gdGhpcy5EZWJvdW5jZShFdmVudC5TdGF0ZSk7XG4gICAgICAgIGlmIChJc0RlYm91bmNlZCAmJiBJc1ZpcnR1YWxLZXkoRXZlbnQuVmtDb2RlKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5EaXNwYXRjaChFdmVudCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgY29uc3QgS2V5Ym9hcmQ6IEZLZXlib2FyZCA9IG5ldyBGS2V5Ym9hcmQoKTtcblxuYXN5bmMgZnVuY3Rpb24gSW5pdGlhbGl6ZUtleWJvYXJkKCk6IFByb21pc2U8dm9pZD5cbntcbiAgICBJcGNTdWJzY3JpYmUoXCJLZXlib2FyZFwiLCBLZXlib2FyZC5PbktleSk7XG59XG5cblJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihcIktleWJvYXJkXCIsIEluaXRpYWxpemVLZXlib2FyZCk7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgSW5pdGlhbGl6ZU92ZXJsYXlXaW5kb3cudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBBY3RpdmF0ZSwgRGVhY3RpdmF0ZSwgR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbiwgSW5pdGlhbGl6ZU92ZXJsYXkgfSBmcm9tIFwiLi9PdmVybGF5V2luZG93XCI7XG5pbXBvcnQgeyB0eXBlIEJyb3dzZXJXaW5kb3csIHR5cGUgQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHR5cGUgeyBGTG9nZ2VyLCBGVmlydHVhbEtleSB9IGZyb20gXCIuLi8uLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IENyZWF0ZUJyb3dzZXJXaW5kb3cgfSBmcm9tIFwiIy9XaW5kb3cvQnJvd3NlcldpbmRvd1wiO1xuaW1wb3J0IHsgdHlwZSBGS2V5Ym9hcmRFdmVudCB9IGZyb20gXCIjL0tleWJvYXJkL0tleWJvYXJkLlR5cGVzXCI7XG5pbXBvcnQgeyBGaW5pc2hGb2N1cyB9IGZyb20gXCIjL1RyZWUvVHJlZVwiO1xuaW1wb3J0IHsgR2V0RGV2U2V0dGluZ3MgfSBmcm9tIFwiIy9EZXZlbG9wbWVudC9EZXZTZXR0aW5nc1wiO1xuaW1wb3J0IHsgR2V0TG9nZ2VyIH0gZnJvbSBcIiMvRGV2ZWxvcG1lbnQvTG9nL0xvZ1wiO1xuaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiIy9LZXlib2FyZC9LZXlib2FyZFwiO1xuaW1wb3J0IHsgT3ZlcmxheUV2ZW50cyB9IGZyb20gXCIuL092ZXJsYXlFdmVudHNcIjtcbmltcG9ydCB7IFJlZ2lzdGVyQ29tbW9uSXBjQ2FsbGJhY2tzIH0gZnJvbSBcIiMvRXZlbnQvQ29tbW9uRXZlbnRzXCI7XG5pbXBvcnQgeyBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24gfSBmcm9tIFwiIy9Jbml0aWFsaXplL0luaXRpYWxpemVcIjtcbmltcG9ydCB7IFJlZ2lzdGVySXBjQ2FsbGJhY2tzIH0gZnJvbSBcIiMvRXZlbnQvRXZlbnRcIjtcbmltcG9ydCB7IFZrIH0gZnJvbSBcIi4uLy4uLy4uL1NoYXJlZFwiO1xuXG5jb25zdCBMb2c6IEZMb2dnZXIgPSBHZXRMb2dnZXIoXCJJbml0aWFsaXplT3ZlcmxheVdpbmRvd1wiKTtcblxuYXN5bmMgZnVuY3Rpb24gSW5pdGlhbGl6ZU92ZXJsYXlXaW5kb3coKTogUHJvbWlzZTx2b2lkPlxue1xuICAgIGNvbnN0IENvbnN0cnVjdG9yT3B0aW9uczogQnJvd3NlcldpbmRvd0NvbnN0cnVjdG9yT3B0aW9ucyA9XG4gICAge1xuICAgICAgICBhbHdheXNPblRvcDogdHJ1ZSxcbiAgICAgICAgYmFja2dyb3VuZE1hdGVyaWFsOiBcImFjcnlsaWNcIixcbiAgICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgICBoZWlnaHQ6IDkwMCxcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgc2tpcFRhc2tiYXI6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIlNvcnJlbGxXbSBNYWluIFdpbmRvd1wiLFxuICAgICAgICB0aXRsZUJhclN0eWxlOiBcImhpZGRlblwiLFxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgd2ViUHJlZmVyZW5jZXM6XG4gICAgICAgIHtcbiAgICAgICAgICAgIGRldlRvb2xzOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICAuLi5HZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uKClcbiAgICB9O1xuXG4gICAgY29uc3QgeyBXaW5kb3csIExvYWRGcm9udGVuZCB9ID0gYXdhaXQgQ3JlYXRlQnJvd3NlcldpbmRvdyhDb25zdHJ1Y3Rvck9wdGlvbnMpO1xuXG4gICAgY29uc3QgT3ZlcmxheVdpbmRvdzogQnJvd3NlcldpbmRvdyA9IEluaXRpYWxpemVPdmVybGF5KFdpbmRvdyk7XG5cbiAgICAvLyBPbihcIkdldEN1cnJlbnRQYW5lbFwiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogVEFycmF5PHVua25vd24+KSA9PlxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgUGFuZWw6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldEN1cnJlbnRQYW5lbCgpO1xuICAgIC8vICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kKFwiR2V0Q3VycmVudFBhbmVsXCIsIFBhbmVsKTtcbiAgICAvLyB9KTtcblxuICAgIC8qKiBAVE9ETyBGaW5kIGJldHRlciBwbGFjZSBmb3IgdGhpcy4gKi9cbiAgICAvLyBPbihcIkdldEFubm90YXRlZFBhbmVsc1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogVEFycmF5PHVua25vd24+KSA9PlxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgUGFuZWxzOiBUQXJyYXk8RlBhbmVsPiA9IEdldFBhbmVscygpO1xuICAgIC8vICAgICBjb25zdCBBbm5vdGF0ZWRQYW5lbHM6IFRBcnJheTxGQW5ub3RhdGVkUGFuZWw+ID0gKGF3YWl0IFByb21pc2UuYWxsKFBhbmVscy5tYXAoQW5ub3RhdGVQYW5lbCkpKVxuICAgIC8vICAgICAgICAgLmZpbHRlcigoVmFsdWU6IEZBbm5vdGF0ZWRQYW5lbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT5cbiAgICAvLyAgICAgICAgIHtcbiAgICAvLyAgICAgICAgICAgICByZXR1cm4gVmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICAvLyAgICAgICAgIH0pIGFzIFRBcnJheTxGQW5ub3RhdGVkUGFuZWw+O1xuXG4gICAgLy8gICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRBbm5vdGF0ZWRQYW5lbHNcIiwgQW5ub3RhdGVkUGFuZWxzKTtcbiAgICAvLyB9KTtcblxuICAgIC8qKlxuICAgICAqIEBUT0RPIE9uIHRoZSBGb2N1cyBzY3JlZW4sIHRoZSBNb3ZlIGJ1dHRvbnMgc2hvdWxkIGJlIGRpc2FibGVkXG4gICAgICogKGdyZXllZCBvdXQpIGlmIHRoZXJlIGlzIG9ubHkgb25lIHZlcnRleCBpbiB0aGUgY3VycmVudCBwYW5lbC5cbiAgICAgKi9cblxuICAgIC8qKiBAVE9ETyBGaW5kIGJldHRlciBwbGFjZSBmb3IgdGhpcy4gKi9cblxuICAgIFJlZ2lzdGVyQ29tbW9uSXBjQ2FsbGJhY2tzKE92ZXJsYXlXaW5kb3cpO1xuICAgIFJlZ2lzdGVySXBjQ2FsbGJhY2tzKE92ZXJsYXlXaW5kb3csIE92ZXJsYXlFdmVudHMgYXMgYW55KTtcblxuICAgIC8qIGVzbGludC1kaXNhYmxlIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgIC8vIE9uKFwiT25DaGFuZ2VGb2N1c1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBGb2N1c0NoYW5nZTogRkZvY3VzQ2hhbmdlID0gQXJndW1lbnRzWzBdIGFzIEZGb2N1c0NoYW5nZTtcbiAgICAvLyAgICAgY29uc3QgSW50ZXJpbUZvY3VzZWRWZXJ0ZXg6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRJbnRlcmltRm9jdXNlZFZlcnRleCgpO1xuICAgIC8vICAgICBpZiAoSW50ZXJpbUZvY3VzZWRWZXJ0ZXgpXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAvLyAgICAgICAgIC8vIExvZyhgSW4gT25DaGFuZ2VGb2N1cywgSW50ZXJpbUZvY3VzZWRWZXJ0ZXggaXMgJHsgVmVydGV4VG9TdHJpbmcoSW50ZXJpbUZvY3VzZWRWZXJ0ZXgpIH0gYXQgJHsgUG9zaXRpb25Ub1N0cmluZyhJbnRlcmltRm9jdXNlZFZlcnRleC5TaXplKSB9LmApO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIENoYW5nZUZvY3VzKEZvY3VzQ2hhbmdlKTtcbiAgICAvLyAgICAgRGVhY3RpdmF0ZSgpO1xuICAgIC8vICAgICAvLyBzZXRUaW1lb3V0KCgpOiB2b2lkID0+XG4gICAgLy8gICAgIC8vIHtcbiAgICAvLyAgICAgLy8gICAgIGNvbnN0IEludGVyaW1Gb2N1czogRlZlcnRleCB8IHVuZGVmaW5lZCA9IEdldEludGVyaW1Gb2N1c2VkVmVydGV4KCk7XG4gICAgLy8gICAgIC8vICAgICBpZiAoSW50ZXJpbUZvY3VzICE9PSB1bmRlZmluZWQpXG4gICAgLy8gICAgIC8vICAgICB7XG4gICAgLy8gICAgIC8vICAgICAgICAgQmx1ckJhY2tncm91bmQoSW50ZXJpbUZvY3VzLlNpemUpO1xuICAgIC8vICAgICAvLyAgICAgfVxuICAgIC8vICAgICAvLyB9LCAyNTApO1xuICAgIC8vICAgICBjb25zdCBJbnRlcmltRm9jdXM6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRJbnRlcmltRm9jdXNlZFZlcnRleCgpO1xuICAgIC8vICAgICBpZiAoSW50ZXJpbUZvY3VzICE9PSB1bmRlZmluZWQpXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIEJsdXJCYWNrZ3JvdW5kKEludGVyaW1Gb2N1cy5TaXplKTtcbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgIC8vIEdldEZvY3VzRGF0YShfRXZlbnQsIC4uLkFyZ3VtZW50cyk7XG4gICAgLy8gICAgIExvZyhcIkZvY3VzQ2hhbmdlXCIsIEZvY3VzQ2hhbmdlKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIC8qKiBAVE9ETyBGaW5kIGJldHRlciBwbGFjZSBmb3IgdGhpcy4gKi9cbiAgICAvLyBPbihcIkdldFBhbmVsU2NyZWVuc2hvdHNcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT5cbiAgICAvLyB7XG4gICAgLy8gICAgIGNvbnN0IFBhbmVsczogVEFycmF5PEZQYW5lbD4gPSBHZXRQYW5lbHMoKTtcbiAgICAvLyAgICAgY29uc3QgU2NyZWVuc2hvdHM6IFRBcnJheTxzdHJpbmc+ID0gKGF3YWl0IFByb21pc2UuYWxsKFBhbmVscy5tYXAoR2V0UGFuZWxTY3JlZW5zaG90KSkpXG4gICAgLy8gICAgICAgICAuZmlsdGVyKChWYWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PlxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiBWYWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vICAgICAgICAgfSkgYXMgVEFycmF5PHN0cmluZz47XG5cbiAgICAvLyAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkdldFBhbmVsU2NyZWVuc2hvdHNcIiwgU2NyZWVuc2hvdHMpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gT24oXCJCcmluZ0ludG9QYW5lbFwiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+XG4gICAgLy8ge1xuICAgIC8vICAgICBCcmluZ0ludG9QYW5lbChBcmd1bWVudHNbMF0gYXMgRkFubm90YXRlZFBhbmVsLCBHZXRBY3RpdmVXaW5kb3coKSBhcyBIV2luZG93KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIE9uKFwiVGVhckRvd25cIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT5cbiAgICAvLyB7XG4gICAgLy8gICAgIFNldEFjdGl2ZVdpbmRvdyh1bmRlZmluZWQpO1xuICAgIC8vICAgICBEZWFjdGl2YXRlKCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBPbihcIkdldEluc2VydGFibGVXaW5kb3dEYXRhXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5fQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBHZXRJbnNlcnRhYmxlV2luZG93RGF0dW0gPSBhc3luYyAoVGlsZWFibGVXaW5kb3c6IEhXaW5kb3cpOiBQcm9taXNlPEZJbnNlcnRhYmxlV2luZG93RGF0YT4gPT5cbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgY29uc3QgSWNvbjogc3RyaW5nID0gYXdhaXQgR2V0UG5nQmFzZTY0KFdyaXRlVGFza2Jhckljb25Ub1BuZyhUaWxlYWJsZVdpbmRvdykpO1xuXG4gICAgLy8gICAgICAgICByZXR1cm4ge1xuICAgIC8vICAgICAgICAgICAgIEhhbmRsZTogVGlsZWFibGVXaW5kb3csXG4gICAgLy8gICAgICAgICAgICAgSWNvbixcbiAgICAvLyAgICAgICAgICAgICBUaXRsZTogR2V0V2luZG93VGl0bGUoVGlsZWFibGVXaW5kb3cpXG4gICAgLy8gICAgICAgICB9O1xuICAgIC8vICAgICB9O1xuXG4gICAgLy8gICAgIGNvbnN0IEluc2VydGFibGVXaW5kb3dEYXRhOiBUQXJyYXk8Rkluc2VydGFibGVXaW5kb3dEYXRhPiA9XG4gICAgLy8gICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChHZXRUaWxlYWJsZVdpbmRvd3MoKS5tYXAoR2V0SW5zZXJ0YWJsZVdpbmRvd0RhdHVtKSk7XG5cbiAgICAvLyAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkdldEluc2VydGFibGVXaW5kb3dEYXRhXCIsIEluc2VydGFibGVXaW5kb3dEYXRhKTtcbiAgICAvLyB9KTtcblxuICAgIC8vICAgICBjb25zdCBTdHJpbmdpZmllZEFyZ3VtZW50czogc3RyaW5nID0gQXJndW1lbnRzXG4gICAgLy8gICAgICAgICAubWFwKChBcmd1bWVudDogdW5rbm93bik6IHN0cmluZyA9PlxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgQXJndW1lbnQgPT09IFwic3RyaW5nXCJcbiAgICAvLyAgICAgICAgICAgICAgICAgPyBBcmd1bWVudFxuICAgIC8vICAgICAgICAgICAgICAgICA6IEpTT04uc3RyaW5naWZ5KEFyZ3VtZW50KTtcbiAgICAvLyAgICAgICAgIH0pXG4gICAgLy8gICAgICAgICAuam9pbigpO1xuXG4gICAgLy8gICAgIGNvbnN0IEJpcmRpZTogc3RyaW5nID0gY2hhbGsuYmdNYWdlbnRhKFwiIOKam++4jyBcIikgKyBcIiBcIjtcbiAgICAvLyAgICAgbGV0IE91dFN0cmluZzogc3RyaW5nID0gQmlyZGllO1xuICAgIC8vICAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGg7IEluZGV4KyspXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gU3RyaW5naWZpZWRBcmd1bWVudHNbSW5kZXhdO1xuICAgIC8vICAgICAgICAgaWYgKENoYXJhY3RlciA9PT0gXCJcXG5cIiAmJiBJbmRleCAhPT0gU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICAvLyAgICAgICAgIHtcbiAgICAvLyAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQmlyZGllICsgQ2hhcmFjdGVyO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZWxzZVxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIE91dFN0cmluZyArPSBDaGFyYWN0ZXI7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICBjb25zb2xlLmxvZyhPdXRTdHJpbmcpO1xuICAgIC8vIH0pO1xuICAgIC8qIGVzbGludC1lbmFibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG5cbiAgICBMb2FkRnJvbnRlbmQoKTtcblxuICAgIHNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmIChHZXREZXZTZXR0aW5ncygpLlN0YXRpY01vZGUuRW5hYmxlZClcbiAgICAgICAge1xuICAgICAgICAgICAgTG9nKFwiRGV2U2V0dGluZ3MuU3RhdGljTW9kZS5FbmFibGVkIGlzIHRydWU6IGNhbGxpbmcgQWN0aXZhdGUoKS4uLlwiKTtcbiAgICAgICAgICAgIEFjdGl2YXRlKCk7XG4gICAgICAgIH1cbiAgICB9LCAzMDAwKTtcblxuICAgIC8qKiBAVE9ETyBSdW4gdGhpcyBieSBmbGFnIHdpdGggYG5wbSBzdGFydGAuICovXG4gICAgLy8gQ3JlYXRlVGVzdFdpbmRvd3MoKTtcbiAgICAvLyBDcmVhdGVOb3RlcGFkVGVzdFdpbmRvd3MoNCk7XG5cbiAgICBmdW5jdGlvbiBPbktleShFdmVudDogRktleWJvYXJkRXZlbnQpOiB2b2lkXG4gICAge1xuICAgICAgICBjb25zdCB7IFN0YXRlLCBWa0NvZGUgfSA9IEV2ZW50O1xuICAgICAgICBpZiAoT3ZlcmxheVdpbmRvdyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKiogQFRPRE8gTWFrZSB0aGlzIGEgbW9kaWZpYWJsZSBzZXR0aW5nLiAqL1xuICAgICAgICBjb25zdCBBY3RpdmF0aW9uS2V5OiBGVmlydHVhbEtleSA9IFZrW1wiRjIwXCJdO1xuXG4gICAgICAgIGlmIChWa0NvZGUgPT09IEFjdGl2YXRpb25LZXkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChTdGF0ZSA9PT0gXCJEb3duXCIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aXZhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBGaW5pc2hGb2N1cygpO1xuICAgICAgICAgICAgICAgIGlmICghR2V0RGV2U2V0dGluZ3MoKS5TdGF0aWNNb2RlLkVuYWJsZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBEZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoS2lsbE9ycGhhbnMsIDc1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBPdmVybGF5V2luZG93LndlYkNvbnRlbnRzLnNlbmQoXCJLZXlib2FyZFwiLCBFdmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBLZXlib2FyZC5TdWJzY3JpYmUoT25LZXkpO1xufTtcblxuUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uKFwiT3ZlcmxheVdpbmRvd1wiLCBJbml0aWFsaXplT3ZlcmxheVdpbmRvdyk7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgT3ZlcmxheUV2ZW50cy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB7XG4gICAgQW5ub3RhdGVQYW5lbCxcbiAgICBCcmluZ0ludG9QYW5lbCxcbiAgICBDaGFuZ2VGb2N1cyxcbiAgICBHZXRDZWxsRnJvbUhhbmRsZSxcbiAgICBHZXRDdXJyZW50UGFuZWwsXG4gICAgR2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXgsXG4gICAgR2V0TmV4dEluZGV4LFxuICAgIEdldFBhbmVsU2NyZWVuc2hvdCxcbiAgICBHZXRQYW5lbHMsXG4gICAgR2V0UGFyZW50LFxuICAgIEdldFByZXZpb3VzSW5kZXgsXG4gICAgR2V0UmVhbFNpemUsXG4gICAgSXNQYW5lbCxcbiAgICBJc1dpbmRvd1RpbGVkLFxuICAgIFB1Ymxpc2gsXG4gICAgU2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXhUb0FjdGl2ZSB9IGZyb20gXCIjL1RyZWUvVHJlZVwiO1xuaW1wb3J0IHsgQmx1ckJhY2tncm91bmQsIERlYWN0aXZhdGUsIEdldEFjdGl2ZVdpbmRvdywgU2V0QWN0aXZlV2luZG93IH0gZnJvbSBcIi4vT3ZlcmxheVdpbmRvd1wiO1xuaW1wb3J0IHR5cGUge1xuICAgIEZBbm5vdGF0ZWRQYW5lbCxcbiAgICBGQ2VsbCxcbiAgICBGRm9jdXNDaGFuZ2UsXG4gICAgRkZvY3VzRGF0YSxcbiAgICBGRm9jdXNEYXRhQmFzZSxcbiAgICBGTG9nZ2VyLFxuICAgIEZQYW5lbCxcbiAgICBGUGFuZWxTdGVwLFxuICAgIEZTaW1wbGVDYWxsYmFjayxcbiAgICBGVGlsZWRNb3ZlVHJhbnNhY3Rpb24sXG4gICAgRlRyYW5zbGF0aW9uLFxuICAgIEZWZXJ0ZXggfSBmcm9tIFwiLi4vLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQge1xuICAgIHR5cGUgRkJveCxcbiAgICB0eXBlIEZMb2dMZXZlbCxcbiAgICB0eXBlIEZNb25pdG9ySW5mbyxcbiAgICB0eXBlIEZWZWN0b3IyRCxcbiAgICBHZXRGb2N1c2VkV2luZG93LFxuICAgIEdldE1vbml0b3JGcm9tV2luZG93LFxuICAgIEdldE1vbml0b3JzLFxuICAgIEdldFdpbmRvd1NoYXBlLFxuICAgIEdldFdpbmRvd1RpdGxlLFxuICAgIHR5cGUgSE1vbml0b3IsXG4gICAgdHlwZSBIV2luZG93LFxuICAgIFNldFdpbmRvd1Bvc2l0aW9uXG59IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5pbXBvcnQgeyBHZXREZXZTZXR0aW5ncywgR2V0TG9nZ2VyLCBMb2dGcm9udGVuZCB9IGZyb20gXCIjL0RldmVsb3BtZW50XCI7XG5pbXBvcnQgeyBQb29yRXZlbnRGYWlsdXJlU2ltcGxlLCBQb29yRXZlbnRTdWNjZXNzLCB0eXBlIFRJcGNDYWxsYmFjayB9IGZyb20gXCIjL0V2ZW50XCI7XG5cbi8vIEBUT0RPIFRlbXBvcmFyeVxudHlwZSBURXZlbnRDYWxsYmFjazxUeXBlPiA9ICguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiBQcm9taXNlPGFueT47XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIk92ZXJsYXlFdmVudHNcIik7XG5cbi8vIHR5cGUgRkdldEZvY3VzRGF0YVJldHVyblR5cGUgPSBBd2FpdGVkPFJldHVyblR5cGU8VENhbGxiYWNrPFwiR2V0Rm9jdXNEYXRhXCIsIElGcm9udGVuZEV2ZW50UmVnaXN0cmFyPj4+O1xudHlwZSBGR2V0Rm9jdXNEYXRhUmV0dXJuVHlwZSA9IFByb21pc2U8YW55Pjtcbi8vIGNvbnN0IEdldEZvY3VzRGF0YSA9IGFzeW5jICgpOiBQcm9taXNlPFRBd2FpdGVkQ2FsbGJhY2s8XCJHZXRGb2N1c0RhdGFcIiwgSUZyb250ZW5kRXZlbnRSZWdpc3RyYXI+PiA9PlxuY29uc3QgR2V0Rm9jdXNEYXRhID0gYXN5bmMgKCk6IFByb21pc2U8YW55PiA9Plxue1xuICAgIGNvbnN0IEN1cnJlbnRQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0Q3VycmVudFBhbmVsKCk7XG4gICAgbGV0IEZvY3VzZWRWZXJ0ZXg6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRJbnRlcmltRm9jdXNlZFZlcnRleCgpO1xuICAgIGlmIChGb2N1c2VkVmVydGV4ID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBTZXRJbnRlcmltRm9jdXNlZFZlcnRleFRvQWN0aXZlKCk7XG4gICAgICAgIEZvY3VzZWRWZXJ0ZXggPSBHZXRJbnRlcmltRm9jdXNlZFZlcnRleCgpO1xuICAgIH1cblxuICAgIGlmIChGb2N1c2VkVmVydGV4ID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgIExvZy5XYXJuKFwiR2V0Rm9jdXNEYXRhIGNhbm5vdCBjb250aW51ZSBiZWNhdXNlIEZvY3VzZWRWZXJ0ZXggd2FzIHVuZGVmaW5lZCBhbmQgY291bGQgbm90IGJlIHNldC5cIik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBFcnJvcjogXCJGb2N1c2VkVmVydGV4VW5kZWZpbmVkXCJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoQ3VycmVudFBhbmVsID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBMb2cuV2FybihcIkdldEZvY3VzRGF0YSBjYW5ub3QgY29udGludWUgYmVjYXVzZSBDdXJyZW50UGFuZWwgaXMgdW5kZWZpbmVkLlwiKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIEVycm9yOiBcIkN1cnJlbnRQYW5lbFVuZGVmaW5lZFwiXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIGlmIChDdXJyZW50UGFuZWwgPT09IHVuZGVmaW5lZCB8fCBGb2N1c2VkVmVydGV4ID09PSB1bmRlZmluZWQpXG4gICAgLy8ge1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4sIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgIC8vICAgICBMb2coXCJHZXRGb2N1c0RhdGEgaXMgcmV0dXJuaW5nIHdpdGhvdXQgc2VuZGluZyBkYXRhIGJlY2F1c2UgQ3VycmVudFBhbmVsIG9yIEZvY3VzZWRWZXJ0ZXggaXMgdW5kZWZpbmVkLlwiKTtcbiAgICAvLyAgICAgcmV0dXJuO1xuICAgIC8vIH1cblxuICAgIGNvbnN0IERpcmVjdGlvbjogXCJIb3Jpem9udGFsXCIgfCBcIlZlcnRpY2FsXCIgPSBDdXJyZW50UGFuZWwuVHlwZTtcbiAgICBjb25zdCBQYXJlbnRQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0UGFyZW50KEN1cnJlbnRQYW5lbCk7XG4gICAgY29uc3QgQ2FuU3RlcFVwOiBib29sZWFuID0gUGFyZW50UGFuZWwgIT09IHVuZGVmaW5lZDtcbiAgICBjb25zdCBDYW5TdGVwRG93bjogYm9vbGVhbiA9IElzUGFuZWwoRm9jdXNlZFZlcnRleCk7XG4gICAgY29uc3QgQ2FuTW92ZVdpdGhpblBhbmVsOiBib29sZWFuID0gQ3VycmVudFBhbmVsLkNoaWxkcmVuLmxlbmd0aCA+IDE7XG4gICAgY29uc3QgUmVhbFNpemU6IEZCb3ggfCB1bmRlZmluZWQgPSBhd2FpdCBHZXRSZWFsU2l6ZShGb2N1c2VkVmVydGV4KTtcblxuICAgIGlmIChSZWFsU2l6ZSA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIEVycm9yOiBcIlVuc3BlY2lmaWVkRXJyb3JcIlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IERhdGFCYXNlOiBGRm9jdXNEYXRhQmFzZSA9XG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbk1vdmVXaXRoaW5QYW5lbCxcbiAgICAgICAgICAgIENhblN0ZXBEb3duLFxuICAgICAgICAgICAgQ2FuU3RlcFVwLFxuICAgICAgICAgICAgRGlyZWN0aW9uLFxuICAgICAgICAgICAgUmVhbFNpemVcbiAgICAgICAgfTtcblxuICAgIGxldCBPdXQ6IEZGb2N1c0RhdGEgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoSXNQYW5lbChGb2N1c2VkVmVydGV4KSlcbiAgICB7XG4gICAgICAgIGNvbnN0IE51bVZlcnRpY2VzOiBudW1iZXIgPSBGb2N1c2VkVmVydGV4LkNoaWxkcmVuLmxlbmd0aDtcblxuICAgICAgICBPdXQgPVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFCYXNlLFxuICAgICAgICAgICAgICAgIE51bVZlcnRpY2VzXG4gICAgICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBjb25zdCBGb2N1c2VkV2luZG93VGl0bGU6IHN0cmluZyA9IEdldFdpbmRvd1RpdGxlKEZvY3VzZWRWZXJ0ZXguSGFuZGxlKTtcblxuICAgICAgICBPdXQgPVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLkRhdGFCYXNlLFxuICAgICAgICAgICAgICAgIEZvY3VzZWRXaW5kb3dUaXRsZVxuICAgICAgICAgICAgfTtcbiAgICB9XG5cbiAgICBMb2coXCJHZXRGb2N1c0RhdGEgaXMgc2VuZGluZyB0byB0aGUgZnJvbnRlbmQ6XCIsIE91dCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBEYXRhOiBPdXRcblxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgT3ZlcmxheUV2ZW50czogUmVhZG9ubHk8QXJyYXk8VElwY0NhbGxiYWNrPj4gPVxuICAgIFtcbiAgICAgICAgLy8gR2V0Rm9jdXNEYXRhRXZlbnQsXG4gICAgICAgIHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoSW5Gb2N1c0NoYW5nZTogdW5rbm93bik6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJPbkNoYW5nZUZvY3VzXCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IEZvY3VzQ2hhbmdlOiBGRm9jdXNDaGFuZ2UgPSBJbkZvY3VzQ2hhbmdlIGFzIEZGb2N1c0NoYW5nZTtcblxuICAgICAgICAgICAgICAgIENoYW5nZUZvY3VzKEZvY3VzQ2hhbmdlKTtcbiAgICAgICAgICAgICAgICBEZWFjdGl2YXRlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZXRUaW1lb3V0KCgpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBjb25zdCBJbnRlcmltRm9jdXM6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRJbnRlcmltRm9jdXNlZFZlcnRleCgpO1xuICAgICAgICAgICAgICAgIC8vICAgICBpZiAoSW50ZXJpbUZvY3VzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLy8gICAgIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIEJsdXJCYWNrZ3JvdW5kKEludGVyaW1Gb2N1cy5TaXplKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH0sIDI1MCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBJbnRlcmltRm9jdXM6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRJbnRlcmltRm9jdXNlZFZlcnRleCgpO1xuICAgICAgICAgICAgICAgIGlmIChJbnRlcmltRm9jdXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIEJsdXJCYWNrZ3JvdW5kKEludGVyaW1Gb2N1cy5TaXplKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBHZXRGb2N1c0RhdGEoX0V2ZW50LCAuLi5Bcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIExvZyhcIkZvY3VzQ2hhbmdlXCIsIEZvY3VzQ2hhbmdlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IFJlc3BvbnNlOiBBd2FpdGVkPFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJHZXRGb2N1c0RhdGFcIj4+PiA9XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICgodW5kZWZpbmVkIGFzIGFueSkgYXMgVEV2ZW50Q2FsbGJhY2s8XCJHZXRGb2N1c0RhdGFcIj4pKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF3YWl0IChHZXRGb2N1c0RhdGFFdmVudC5DYWxsYmFjayBhcyBURXZlbnRDYWxsYmFjazxcIkdldEZvY3VzRGF0YVwiPikodW5kZWZpbmVkKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBSZXNwb25zZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDaGFubmVsOiBcIk9uQ2hhbmdlRm9jdXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKEluVHJhbnNhY3Rpb246IHVua25vd24pOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiTW92ZVRpbGVkV2luZG93XCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAVE9ETyBGaWd1cmUgb3V0IGhvdyB0byBoYXZlIG1vdmluZyB0aWxlZCB3aW5kb3cgc2l0IG9uIHRvcCBvZiBwYW5lbHMgd2hpbGUgc2VsZWN0aW5nLFxuICAgICAgICAgICAgICogc3VjaCB0aGF0IHRoZSBvcHRpb24gdG8gZ28gXCJEb3duXCIgaXMgYXZhaWxhYmxlIGlmZiB0aGUgYWN0aXZlIHdpbmRvdyBpcyBjdXJyZW50bHkgb25cbiAgICAgICAgICAgICAqIHRvcCBvZiBhIHBhbmVsLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY29uc3QgVHJhbnNhY3Rpb246IEZUaWxlZE1vdmVUcmFuc2FjdGlvbiA9IEluVHJhbnNhY3Rpb24gYXMgRlRpbGVkTW92ZVRyYW5zYWN0aW9uO1xuICAgICAgICAgICAgICAgIGNvbnN0IEFjdGl2ZVdpbmRvdzogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgICAgICAgICAgICAgIGlmIChBY3RpdmVXaW5kb3cgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IENlbGw6IEZDZWxsIHwgdW5kZWZpbmVkID0gR2V0Q2VsbEZyb21IYW5kbGUoQWN0aXZlV2luZG93KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoQ2VsbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBQYXJlbnQ6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldFBhcmVudChDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQYXJlbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBDdXJyZW50SW5kZXg6IG51bWJlciA9IFBhcmVudC5DaGlsZHJlbi5pbmRleE9mKENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IEFjdGlvbnM6IFRSZWNvcmQ8RlBhbmVsU3RlcCwgRlNpbXBsZUNhbGxiYWNrPiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvd25OZXh0OiAoKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNvbnN0IFNpYmxpbmdQYW5lbDogRlZlcnRleCB8IHVuZGVmaW5lZCA9IEdldE5leHRTaWJsaW5nKENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmIChTaWJsaW5nUGFuZWwgIT09IHVuZGVmaW5lZCAmJiBJc1BhbmVsKFNpYmxpbmdQYW5lbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBQYXJlbnQuQ2hpbGRyZW4uc3BsaWNlKEN1cnJlbnRJbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFNpYmxpbmdQYW5lbC5DaGlsZHJlbi51bnNoaWZ0KENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBQdWJsaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvd25QcmV2aW91czogKCk6IHZvaWQgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zdCBTaWJsaW5nUGFuZWw6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRQcmV2aW91c1NpYmxpbmcoQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYgKFNpYmxpbmdQYW5lbCAhPT0gdW5kZWZpbmVkICYmIElzUGFuZWwoU2libGluZ1BhbmVsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFBhcmVudC5DaGlsZHJlbi5zcGxpY2UoQ3VycmVudEluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgU2libGluZ1BhbmVsLkNoaWxkcmVuLnVuc2hpZnQoQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIFB1Ymxpc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG93bjogKCk6IHZvaWQgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5leHQ6ICgpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgTmV4dEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXROZXh0SW5kZXgoQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE5leHRJbmRleCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgVGVtcG9yYXJ5OiBGVmVydGV4IHwgdW5kZWZpbmVkID0gUGFyZW50LkNoaWxkcmVuW05leHRJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZW1wb3JhcnkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFyZW50LkNoaWxkcmVuW05leHRJbmRleF0gPSBDZWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFyZW50LkNoaWxkcmVuW0N1cnJlbnRJbmRleF0gPSBUZW1wb3Jhcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJldmlvdXM6ICgpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgQ3VycmVudEluZGV4OiBudW1iZXIgPSBQYXJlbnQuQ2hpbGRyZW4uaW5kZXhPZihDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBQcmV2aW91c0luZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRQcmV2aW91c0luZGV4KENlbGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQcmV2aW91c0luZGV4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBUZW1wb3Jhcnk6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBQYXJlbnQuQ2hpbGRyZW5bUHJldmlvdXNJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUZW1wb3JhcnkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFyZW50LkNoaWxkcmVuW1ByZXZpb3VzSW5kZXhdID0gQ2VsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhcmVudC5DaGlsZHJlbltDdXJyZW50SW5kZXhdID0gVGVtcG9yYXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVwOiAoKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IEdyYW5kcGFyZW50OiBGUGFuZWwgfCB1bmRlZmluZWQgPSBHZXRQYXJlbnQoUGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoR3JhbmRwYXJlbnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFBhcmVudEluZGV4OiBudW1iZXIgPSBHcmFuZHBhcmVudC5DaGlsZHJlbi5pbmRleE9mKFBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdyYW5kcGFyZW50LkNoaWxkcmVuLnNwbGljZShQYXJlbnRJbmRleCwgMCwgQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IEluZGV4OiBudW1iZXIgPSBQYXJlbnQuQ2hpbGRyZW4uaW5kZXhPZihDZWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFyZW50LkNoaWxkcmVuLnNwbGljZShJbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFB1Ymxpc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY3Rpb25zW1RyYW5zYWN0aW9uLlN0ZXBdKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSXNPblBhbmVsOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBvb3JFdmVudEZhaWx1cmVTaW1wbGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDaGFubmVsOiBcIk1vdmVUaWxlZFdpbmRvd1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkdldElzQWN0aXZlV2luZG93VGlsZWRcIj4+ID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgV2luZG93VG9UaWxlOiBIV2luZG93IHwgdW5kZWZpbmVkID0gR2V0QWN0aXZlV2luZG93KCk7XG4gICAgICAgICAgICAgICAgaWYgKFdpbmRvd1RvVGlsZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgSXNUaWxlZDogYm9vbGVhbiA9IElzV2luZG93VGlsZWQoR2V0Rm9jdXNlZFdpbmRvdygpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGE6IHsgSXNUaWxlZCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2hhbm5lbDogXCJHZXRJc0FjdGl2ZVdpbmRvd1RpbGVkXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jIChJblBhbmVsOiB1bmtub3duKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkJyaW5nSW50b1BhbmVsXCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFBhbmVsOiBGQW5ub3RhdGVkUGFuZWwgPSBJblBhbmVsIGFzIEZBbm5vdGF0ZWRQYW5lbDtcbiAgICAgICAgICAgICAgICBjb25zdCBXaW5kb3dUb1RpbGU6IEhXaW5kb3cgfCB1bmRlZmluZWQgPSBHZXRBY3RpdmVXaW5kb3coKTtcbiAgICAgICAgICAgICAgICBpZiAoV2luZG93VG9UaWxlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBCcmluZ0ludG9QYW5lbChQYW5lbCwgR2V0QWN0aXZlV2luZG93KCkgYXMgSFdpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogXCJcIlxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDaGFubmVsOiBcIkJyaW5nSW50b1BhbmVsXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jICgpOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiR2V0TW9uaXRvckZyb21Gb2N1c2VkV2luZG93XCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IEFjdGl2ZVdpbmRvdzogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgICAgICAgICAgICAgIGlmIChBY3RpdmVXaW5kb3cgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE1vbml0b3I6IEhNb25pdG9yID0gR2V0TW9uaXRvckZyb21XaW5kb3coQWN0aXZlV2luZG93KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGE6IHsgTW9uaXRvciB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgRXJyb3I6IFwiQWN0aXZlV2luZG93VW5kZWZpbmVkXCJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2hhbm5lbDogXCJHZXRNb25pdG9yRnJvbUZvY3VzZWRXaW5kb3dcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKEluVHJhbnNsYXRpb246IHVua25vd24pOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiTW92ZUZsb2F0aW5nV2luZG93XCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFRyYW5zbGF0aW9uOiBGVHJhbnNsYXRpb24gPSBJblRyYW5zbGF0aW9uIGFzIEZUcmFuc2xhdGlvbjtcbiAgICAgICAgICAgICAgICBjb25zdCBBY3RpdmVXaW5kb3c6IEhXaW5kb3cgfCB1bmRlZmluZWQgPSBHZXRBY3RpdmVXaW5kb3coKTtcbiAgICAgICAgICAgICAgICBpZiAoQWN0aXZlV2luZG93ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IEhlaWdodCwgV2lkdGgsIFgsIFkgfTogRkJveCA9IEdldFdpbmRvd1NoYXBlKEFjdGl2ZVdpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IE5ld1NoYXBlOiBGQm94ID0gVHJhbnNsYXRpb24uRGlyZWN0aW9uID09PSBcIlhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFg6IFggKyBUcmFuc2xhdGlvbi5EaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBZXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBZOiBZICsgVHJhbnNsYXRpb24uRGlzdGFuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgTGVmdENvcm5lcjogRlZlY3RvcjJEID0geyBYLCBZIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFJpZ2h0Q29ybmVyOiBGVmVjdG9yMkQgPSB7IFg6IFggKyBXaWR0aCwgWSB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFdvdWxkQmVPdXRPZkJvdW5kczogYm9vbGVhbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAhR2V0TW9uaXRvcnMoKS5zb21lKCh7IFNpemUgfTogRk1vbml0b3JJbmZvKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IElzUG9pbnRJbkJvdW5kcyA9IChQb2ludDogRlZlY3RvcjJEKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpemUuWCA8PSBQb2ludC5YICYmIFBvaW50LlggPD0gU2l6ZS5YICsgU2l6ZS5XaWR0aCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaXplLlkgPD0gUG9pbnQuWSAmJiBQb2ludC5ZIDw9IFNpemUuWSArIFNpemUuSGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJc1BvaW50SW5Cb3VuZHMoTGVmdENvcm5lcikgfHwgSXNQb2ludEluQm91bmRzKFJpZ2h0Q29ybmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChXb3VsZEJlT3V0T2ZCb3VuZHMpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgU2V0V2luZG93UG9zaXRpb24oQWN0aXZlV2luZG93LCBOZXdTaGFwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENoYW5uZWw6IFwiTW92ZUZsb2F0aW5nV2luZG93XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jIChJblN0YXRlbWVudHM6IHVua25vd24pOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiTG9nXCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFsgQ2F0ZWdvcnksIExldmVsLCAuLi5TdGF0ZW1lbnRzIF0gPVxuICAgICAgICAgICAgICAgICAgICBJblN0YXRlbWVudHMgYXMgWyBzdHJpbmcsIEZMb2dMZXZlbCwgLi4uVEFycmF5PHVua25vd24+IF07XG5cbiAgICAgICAgICAgICAgICBMb2dGcm9udGVuZChDYXRlZ29yeSwgTGV2ZWwsIC4uLlN0YXRlbWVudHMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBvb3JFdmVudFN1Y2Nlc3MoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBDaGFubmVsOiBcIkxvZ1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIlJlcXVlc3RUZWFyRG93blwiPj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBTZXRBY3RpdmVXaW5kb3codW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICBpZiAoIUdldERldlNldHRpbmdzKCkuU3RhdGljTW9kZS5FbmFibGVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgRGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBQb29yRXZlbnRTdWNjZXNzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQ2hhbm5lbDogXCJSZXF1ZXN0VGVhckRvd25cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKCk6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJHZXRQYW5lbFNjcmVlbnNob3RzXCI+PiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFBhbmVsczogVEFycmF5PEZQYW5lbD4gPSBHZXRQYW5lbHMoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBTY3JlZW5zaG90czogVEFycmF5PHN0cmluZz4gPSAoYXdhaXQgUHJvbWlzZS5hbGwoUGFuZWxzLm1hcChHZXRQYW5lbFNjcmVlbnNob3QpKSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0pIGFzIFRBcnJheTxzdHJpbmc+O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgRGF0YTogU2NyZWVuc2hvdHMsXG4gICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0UGFuZWxTY3JlZW5zaG90c1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkdldEFubm90YXRlZFBhbmVsc1wiPj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBQYW5lbHM6IFRBcnJheTxGUGFuZWw+ID0gR2V0UGFuZWxzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgQW5ub3RhdGVkUGFuZWxzOiBUQXJyYXk8RkFubm90YXRlZFBhbmVsPiA9XG4gICAgICAgICAgICAgICAgICAgIChhd2FpdCBQcm9taXNlLmFsbChQYW5lbHMubWFwKEFubm90YXRlUGFuZWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKFZhbHVlOiBGQW5ub3RhdGVkUGFuZWwgfCB1bmRlZmluZWQpOiBib29sZWFuID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSBhcyBUQXJyYXk8RkFubm90YXRlZFBhbmVsPjtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIERhdGE6IHsgQW5ub3RhdGVkUGFuZWxzIH0sXG4gICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0QW5ub3RhdGVkUGFuZWxzXCJcbiAgICAgICAgfVxuICAgIF0gYXMgY29uc3Q7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=