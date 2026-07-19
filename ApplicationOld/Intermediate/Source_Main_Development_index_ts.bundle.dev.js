"use strict";
exports.id = "Source_Main_Development_index_ts";
exports.ids = ["Source_Main_Development_index_ts"];
exports.modules = {

/***/ "./Source/Main/Development/DevSettings.Types.ts"
/*!******************************************************!*\
  !*** ./Source/Main/Development/DevSettings.Types.ts ***!
  \******************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      DevSettings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Development/Log/Log.Types.ts"
/*!**************************************************!*\
  !*** ./Source/Main/Development/Log/Log.Types.ts ***!
  \**************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Log.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Development/Log/index.ts"
/*!**********************************************!*\
  !*** ./Source/Main/Development/Log/index.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
exports.Format = exports.LogFrontend = exports.GetLogger = void 0;
var Log_1 = __webpack_require__(/*! ./Log */ "./Source/Main/Development/Log/Log.ts");
Object.defineProperty(exports, "GetLogger", ({ enumerable: true, get: function () { return Log_1.GetLogger; } }));
Object.defineProperty(exports, "LogFrontend", ({ enumerable: true, get: function () { return Log_1.LogFrontend; } }));
var LogFormat_1 = __webpack_require__(/*! ./LogFormat */ "./Source/Main/Development/Log/LogFormat.ts");
Object.defineProperty(exports, "Format", ({ enumerable: true, get: function () { return LogFormat_1.Format; } }));
__exportStar(__webpack_require__(/*! ./Log.Types */ "./Source/Main/Development/Log/Log.Types.ts"), exports);


/***/ },

/***/ "./Source/Main/Development/SetupPrimaryMonitor.ts"
/*!********************************************************!*\
  !*** ./Source/Main/Development/SetupPrimaryMonitor.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      SetupPrimaryMonitor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 * Comment:   If enabled, then move VS Code to the small monitor,
 *            and create a set of dummy windows to use for testing.
 *            This assumes my personal desktop setup (that is, my
 *            monitors).
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetupPrimaryMonitorDummyVariable = void 0;
const Tree_1 = __webpack_require__(/*! #/Tree */ "./Source/Main/Tree/index.ts");
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const Utility_1 = __webpack_require__(/*! #/Utility */ "./Source/Main/Utility/index.ts");
const Log_1 = __webpack_require__(/*! ./Log */ "./Source/Main/Development/Log/index.ts");
const electron_1 = __webpack_require__(/*! electron */ "electron");
/** Enable/disable the behavior by setting the value of this variable. */
const ShouldSetUpPrimaryMonitor = false;
const WillSetUpPrimaryMonitor = ShouldSetUpPrimaryMonitor && !electron_1.app.isPackaged;
const Log = (0, Log_1.GetLogger)("SetupPrimaryMonitor");
const SetUpPrimaryMonitor = async () => {
    Log("Populating the main monitor with test windows because ShouldSetUpPrimaryMonitor is set to true.");
    const VsCodeWindowNamePart = "SorrellWm (Workspace) - Visual Studio Code";
    const VsCodeWindow = (0, wm_windows_1.GetTileableWindows)().find((TileableWindow) => {
        return (0, wm_windows_1.GetWindowTitle)(TileableWindow).includes(VsCodeWindowNamePart);
    });
    if (VsCodeWindow === undefined) {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("Could not populate the main monitor with test windows because the VS Code window could not be found.");
        return;
    }
    const MonitorsInfo = (0, wm_windows_1.GetMonitors)();
    const SmallMonitorInfo = MonitorsInfo.find((MonitorInfo) => {
        return (MonitorInfo.IsPrimary &&
            MonitorInfo.Size.Width === 1920 &&
            MonitorInfo.Size.Height === 1080);
    });
    const MainMonitorInfo = MonitorsInfo.find((MonitorInfo) => {
        return (MonitorInfo.Size.Width === 3440 &&
            MonitorInfo.Size.Height === 1440);
    });
    if (SmallMonitorInfo === undefined || MainMonitorInfo === undefined) {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("Could not populate the main monitor with test windows because the necessary monitors could not be identified.");
        return;
    }
    const MoveVsCodeWindow = () => {
        (0, wm_windows_1.RestoreWindow)(VsCodeWindow);
        (0, wm_windows_1.SetWindowPosition)(VsCodeWindow, SmallMonitorInfo.WorkSize);
    };
    const MainMonitorWindows = (0, wm_windows_1.GetTileableWindows)().filter((Window) => {
        return ((0, Utility_1.AreHandlesEqual)((0, wm_windows_1.GetMonitorFromWindow)(Window), MainMonitorInfo.Handle) &&
            !(0, Utility_1.AreHandlesEqual)(Window, VsCodeWindow));
    });
    const MinimizeMainWindows = () => {
        MainMonitorWindows.forEach(wm_windows_1.MinimizeWindow);
    };
    const RestoreMainWindows = () => {
        MainMonitorWindows.forEach(wm_windows_1.RestoreWindow);
    };
    /* eslint-disable-next-line @stylistic/max-len */
    const PaintExecutablePath = "C:\\Program Files\\WindowsApps\\Microsoft.Paint_11.2511.291.0_x64__8wekyb3d8bbwe\\PaintApp\\mspaint.exe";
    const PaintProcessIdentifiers = new Set();
    const LaunchPaint = () => {
        const Options = {
            detached: true,
            stdio: "ignore",
            windowsHide: false
        };
        const ProcessIdentifier = (0, child_process_1.spawn)(PaintExecutablePath, [], Options).pid;
        if (ProcessIdentifier !== undefined) {
            PaintProcessIdentifiers.add(ProcessIdentifier);
        }
    };
    const LaunchPaintInstances = () => {
        const NumWindows = 3;
        Array.from(Array(NumWindows).keys()).forEach(LaunchPaint);
        setTimeout(() => {
            const IsPaintWindow = (Window) => (0, wm_windows_1.GetWindowTitle)(Window).includes("Paint");
            const BringPaintWindowIntoRootPanel = (PaintWindow) => {
                const MainMonitorRootPanel = (0, Tree_1.GetForest)().find((Panel) => {
                    if (Panel.MonitorId !== undefined) {
                        return (0, Utility_1.AreHandlesEqual)(Panel.MonitorId, MainMonitorInfo.Handle);
                    }
                    return false;
                });
                if (MainMonitorRootPanel === undefined) {
                    // @TODO
                    return;
                }
                (0, Tree_1.BringIntoPanel)(MainMonitorRootPanel, PaintWindow);
            };
            (0, wm_windows_1.GetTileableWindows)()
                .filter(IsPaintWindow)
                .forEach(BringPaintWindowIntoRootPanel);
        }, 3000);
    };
    const ClosePaintInstances = () => {
        PaintProcessIdentifiers.forEach((ProcessIdentifier) => {
            (0, wm_windows_1.CloseApplication)(ProcessIdentifier);
        });
    };
    const RestoreVsCode = () => {
        (0, wm_windows_1.SetWindowPosition)(VsCodeWindow, MainMonitorInfo.WorkSize);
    };
    const OnAppExit = (..._Arguments) => {
        ClosePaintInstances();
        RestoreVsCode();
        RestoreMainWindows();
    };
    const ProcessEndEventNames = [
        "SIGINT",
        "SIGTERM"
        // "uncaughtException",
        // "unhandledRejection"
    ];
    ProcessEndEventNames.forEach((EventName) => {
        process.on(EventName, OnAppExit);
    });
    MinimizeMainWindows();
    MoveVsCodeWindow();
    LaunchPaintInstances();
};
if (WillSetUpPrimaryMonitor) {
    SetUpPrimaryMonitor();
}
/** Dummy variable so that something is exported, and therefore this file becomes a module. */
exports.SetupPrimaryMonitorDummyVariable = undefined;


/***/ },

/***/ "./Source/Main/Development/TestWindows.ts"
/*!************************************************!*\
  !*** ./Source/Main/Development/TestWindows.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      TestWindows.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTestWindows = exports.CreateNotepadTestWindows = void 0;
const Tree_1 = __webpack_require__(/*! #/Tree */ "./Source/Main/Tree/index.ts");
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Utility_1 = __webpack_require__(/*! #/Utility */ "./Source/Main/Utility/index.ts");
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const CreateTestWindow = async (_Index) => {
    return {};
    // const { Window: TestWindow, LoadFrontend } = await FooMyFunction({
    //     autoHideMenuBar: true,
    //     show: true,
    //     title: `Test Window #${ Index + 1 }`
    // });
    // TestWindow.setMenu(null);
    // ipcMain.on("ReadyForRoute", (_Event: Electron.Event): void =>
    // {
    //     TestWindow.webContents.send("Navigate", "TestWindow");
    // });
    // await LoadFrontend();
    // TestWindow.on(
    //     "page-title-updated",
    //     (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): void =>
    //     {
    //         Event.preventDefault();
    //     }
    // );
    // return TestWindow;
};
const CreateNotepadTestWindows = async (_NumWindows) => {
    (0, wm_windows_1.KillNotepadInstances)();
    await (0, Utility_1.Sleep)(2000);
    for (let Index = 0; Index < 4; Index++) {
        (0, child_process_1.spawn)("C:\\Windows\\System32\\notepad.exe");
    }
    await (0, Utility_1.Sleep)(3000);
    const NotepadHandles = (0, wm_windows_1.GetNotepadHandles)();
    const RightMonitor = (0, Tree_1.Find)((Vertex) => {
        if ((0, Tree_1.IsPanel)(Vertex)) {
            return Vertex.Size.X === 2738;
        }
        else {
            return false;
        }
    });
    if (RightMonitor !== undefined) {
        NotepadHandles.forEach((Handle) => {
            (0, Tree_1.BringIntoPanel)(RightMonitor, Handle);
        });
    }
};
exports.CreateNotepadTestWindows = CreateNotepadTestWindows;
const CreateTestWindows = async () => {
    const TestWindows = [];
    for (let Index = 0; Index < 3; Index++) {
        TestWindows.push(await CreateTestWindow(Index));
    }
    const RightMonitor = (0, Tree_1.Find)((Vertex) => {
        if ((0, Tree_1.IsPanel)(Vertex)) {
            return Vertex.Size.X === 2738;
        }
        else {
            return false;
        }
    });
    if (RightMonitor !== undefined) {
        TestWindows.forEach((TestWindow) => {
            const WindowTitle = TestWindow.getTitle();
            const Handle = (0, wm_windows_1.GetWindowByName)(WindowTitle);
            if (Handle !== undefined) {
                (0, Tree_1.BringIntoPanel)(RightMonitor, Handle);
            }
        });
    }
};
exports.CreateTestWindows = CreateTestWindows;


/***/ },

/***/ "./Source/Main/Development/index.ts"
/*!******************************************!*\
  !*** ./Source/Main/Development/index.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
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
__exportStar(__webpack_require__(/*! ./DevSettings */ "./Source/Main/Development/DevSettings.ts"), exports);
__exportStar(__webpack_require__(/*! ./DevSettings.Types */ "./Source/Main/Development/DevSettings.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Log */ "./Source/Main/Development/Log/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./SetupPrimaryMonitor */ "./Source/Main/Development/SetupPrimaryMonitor.ts"), exports);
__exportStar(__webpack_require__(/*! ./TestWindows */ "./Source/Main/Development/TestWindows.ts"), exports);


/***/ },

/***/ "./Source/Main/Event/CommonEvents.ts"
/*!*******************************************!*\
  !*** ./Source/Main/Event/CommonEvents.ts ***!
  \*******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      CommonEvents.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterCommonIpcCallbacks = void 0;
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Store_1 = __webpack_require__(/*! #/Store */ "./Source/Main/Store.ts");
const _1 = __webpack_require__(/*! . */ "./Source/Main/Event/index.ts");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Settings_1 = __webpack_require__(/*! #/Settings */ "./Source/Main/Settings/index.ts");
const Log = (0, Development_1.GetLogger)("CommonEvents");
const RegisterCommonIpcCallbacks = (Window) => {
    const CommonIpcCallbacks = [
        {
            Callback: async () => {
                Log(`GetThemeColor was received by Main with Id == ${Window.id}.`);
                return {
                    Data: {
                        ThemeColor: (0, wm_windows_1.GetThemeColor)()
                    },
                    Error: undefined
                };
            },
            Channel: "GetThemeColor"
        },
        {
            Callback: async () => {
                return (0, _1.PoorEventSuccess)();
            },
            Channel: "NotifyReady"
        },
        {
            Callback: async () => {
                return {
                    Data: {
                        IsLightMode: (0, wm_windows_1.GetIsLightMode)()
                    },
                    Error: undefined
                };
            },
            Channel: "GetIsLightMode"
        },
        {
            Callback: async () => {
                const Settings = await (0, Settings_1.GetSettings)();
                return {
                    Data: Settings,
                    Error: undefined
                };
            },
            Channel: "GetSettings"
        },
        {
            Callback: async () => {
                return {
                    Data: { Setting: 0 },
                    Error: undefined
                };
            },
            Channel: "GetSetting"
        },
        {
            Callback: async () => {
                const Data = await (0, Store_1.GetStore)();
                return {
                    Data,
                    Error: undefined
                };
            },
            Channel: "GetStore"
        },
        {
            Callback: async (InStore) => {
                const NewStore = InStore;
                (0, Store_1.SetStore)(NewStore);
                return (0, _1.PoorEventSuccess)();
            },
            Channel: "SetStore"
        }
    ];
    (0, _1.RegisterIpcCallbacks)(Window, CommonIpcCallbacks);
};
exports.RegisterCommonIpcCallbacks = RegisterCommonIpcCallbacks;


/***/ },

/***/ "./Source/Main/Event/Dispatcher.Types.ts"
/*!***********************************************!*\
  !*** ./Source/Main/Event/Dispatcher.Types.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Event/Dispatcher.ts"
/*!*****************************************!*\
  !*** ./Source/Main/Event/Dispatcher.ts ***!
  \*****************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Dispatcher.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TDispatcher_DEPRECATED = exports.TDispatcher = void 0;
class TDispatcher {
    NextListenerId = 0;
    Listeners = new Map();
    GetHandle = () => {
        const Subscribe = (Callback) => {
            const Id = this.NextListenerId++;
            this.Listeners.set(Id, Callback);
            return Id;
        };
        const Unsubscribe = (Id) => {
            this.Listeners.delete(Id);
        };
        return {
            Subscribe,
            Unsubscribe
        };
    };
    Dispatch = (Message) => {
        if (this.Listeners.size > 0) {
            this.Listeners.forEach((Callback) => {
                Callback(Message);
            });
        }
    };
}
exports.TDispatcher = TDispatcher;
/* eslint-disable-next-line @typescript-eslint/naming-convention */
class TDispatcher_DEPRECATED {
    NextListenerId = 0;
    Listeners = new Map();
    Subscribe(Callback) {
        const Id = this.NextListenerId++;
        this.Listeners.set(Id, Callback);
        return Id;
    }
    Unsubscribe(Id) {
        this.Listeners.delete(Id);
    }
    Dispatch = (Message) => {
        if (this.Listeners.size > 0) {
            this.Listeners.forEach((Callback) => {
                Callback(Message);
            });
        }
    };
}
exports.TDispatcher_DEPRECATED = TDispatcher_DEPRECATED;


/***/ },

/***/ "./Source/Main/Event/Event.Types.ts"
/*!******************************************!*\
  !*** ./Source/Main/Event/Event.Types.ts ***!
  \******************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Event.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Event/Event.ts"
/*!************************************!*\
  !*** ./Source/Main/Event/Event.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Event.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetPoorResponse = exports.PoorEventFailureSimple = exports.PoorEventFailure = exports.PoorEventSuccess = exports.SendIpcEvent = exports.RegisterIpcCallbacks = exports.RegisterIpcCallback = void 0;
// @TODO Temporary
/* eslint-disable jsdoc/require-jsdoc */
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Log = (0, Development_1.GetLogger)("Event");
/**
 * Register callbacks to respond to events received from the Renderer.
 * All calls to this should be made as early as possible in the application's
 * lifetime.
 */
const RegisterIpcCallback = (BrowserWindow, Channel, Callback) => {
    // const ChannelTagged: FFrontendChannelTagged | undefined = MakeTagFrontend(BrowserWindow.id)(Channel);
    // Log(`RegisterIpcCallback: ChannelTagged == ${ ChannelTagged }`);
    // if (ChannelTagged === undefined)
    // {
    //     return;
    // }
    if (electron_1.ipcMain.eventNames().includes(Channel)) {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Warn(`Main attempted to register IPC callback for Event ${Channel} on window with ID ${BrowserWindow.id}, but a callback has already been registered.`);
        return;
    }
    const Wrapper = async (Event, ...ArgumentVector) => {
        const Request = ArgumentVector[0];
        return Callback(Request);
        /* eslint-disable-next-line @stylistic/max-len */
        // Log(`Response inside Wrapper is going to be sent to the BrowserWindow.  The Response is ${ Response }.`);
        // BrowserWindow.webContents.send(ChannelTagged, Response);
    };
    electron_1.ipcMain.handle(Channel, Wrapper);
};
exports.RegisterIpcCallback = RegisterIpcCallback;
const RegisterIpcCallbacks = (BrowserWindow, IpcCallbacks) => {
    const Register = ({ Callback, Channel }) => {
        (0, exports.RegisterIpcCallback)(BrowserWindow, Channel, Callback);
    };
    IpcCallbacks.forEach(Register);
};
exports.RegisterIpcCallbacks = RegisterIpcCallbacks;
/** Send an event to the Renderer, and receive a response. */
const SendIpcEvent = (BrowserWindow, Channel, _Request) => {
    return new Promise((Resolve, Reject) => {
        // const ChannelTagged: FChannelTagged | undefined = MakeTagBackend(BrowserWindow.id)(Channel);
        // Log(`SendIpcEvent: Attempting to fulfill message having channel ${ ChannelTagged }.`);
        Log(`SendIpcEvent: Attempting to fulfill message having channel ${Channel}.`);
        // if (ChannelTagged === undefined)
        // {
        //     Reject("Channel was not tagged.");
        // }
        // const ChannelTaggedSafe: FChannelTagged = ChannelTagged as FChannelTagged;
        const RequestId = crypto.randomUUID();
        const ResponseChannel = `${RequestId}:Response`;
        /**
         * Where to pick up:
         *   * main --> renderer --> main ==> requires `Window.webContents.send` *and* registering
         *     a callback via `ipcMain.on` to get the reply, with custom response channel.
         *
         *   * renderer --> main --> renderer ==> simple: use `ipcMain.handle` (with return value)
         *     and `ipcRenderer.invoke` with this, the Id / GetId code can be removed, and the
         *     `UseTaggers` hook.
         */
        const Listener = (_Event, Response) => {
            if (Response.RequestId !== RequestId) {
                return;
            }
            electron_1.ipcMain.removeListener(ResponseChannel, Listener);
            if (Response.Error !== undefined) {
                Reject(new Error(Response.Error));
                return;
            }
            Resolve(Response.Result);
        };
        electron_1.ipcMain.on(ResponseChannel, Listener);
        const Request = {
            Payload: undefined,
            RequestId
        };
        BrowserWindow.webContents.send(Channel, Request);
        // BrowserWindow.webContents.send(Channel, );
        // ipcRenderer. (
        //     Channel,
        //     (_Event: Electron.Event, ...ArgumentVector: TArray<unknown>): void =>
        //     {
        //         const Response: TResponse<ChannelType> = ArgumentVector[0] as TResponse<ChannelType>;
        //         Resolve(Response);
        //     }
        // );
        // Log(`SendIpcEvent: ${ ChannelTagged }.`);
        // BrowserWindow.webContents.send(ChannelTaggedSafe, Request);
        // // BrowserWindow.webContents.send(Channel, JSON.stringify(Request));
    });
};
exports.SendIpcEvent = SendIpcEvent;
const PoorEventSuccess = () => {
    return {
        Data: undefined,
        Error: undefined
    };
};
exports.PoorEventSuccess = PoorEventSuccess;
const PoorEventFailure = (Error) => {
    return {
        Data: undefined,
        Error
    };
};
exports.PoorEventFailure = PoorEventFailure;
const PoorEventFailureSimple = () => {
    return {
        Data: undefined,
        Error: ""
    };
};
exports.PoorEventFailureSimple = PoorEventFailureSimple;
const GetPoorResponse = (Success) => {
    return Success
        ? (0, exports.PoorEventSuccess)()
        : (0, exports.PoorEventFailureSimple)();
};
exports.GetPoorResponse = GetPoorResponse;


/***/ },

/***/ "./Source/Main/Event/NodeIpc.Types.ts"
/*!********************************************!*\
  !*** ./Source/Main/Event/NodeIpc.Types.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/**
 * @file      NodeIpc.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Event/NodeIpc.ts"
/*!**************************************!*\
  !*** ./Source/Main/Event/NodeIpc.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      NodeIpc.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Unsubscribe = exports.Subscribe = void 0;
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Initialize_1 = __webpack_require__(/*! ../Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
let NextListenerId = 0;
const Listeners = new Map();
const Subscribe = (Channel, Callback) => {
    const Id = NextListenerId++;
    Listeners.set(Id, { Callback, Channel });
    return Id;
};
exports.Subscribe = Subscribe;
const Unsubscribe = (Id) => {
    Listeners.delete(Id);
};
exports.Unsubscribe = Unsubscribe;
function OnMessage(Channel, Message) {
    Listeners.forEach((Callback) => {
        if (Callback.Channel === Channel) {
            Callback.Callback(Message);
        }
    });
}
(0, wm_windows_1.InitializeIpc)(OnMessage);
async function InitializeNodeIpc() {
    return Promise.resolve();
}
(0, Initialize_1.RegisterInitializationFunction)("NodeIpc", InitializeNodeIpc);


/***/ },

/***/ "./Source/Main/Event/index.ts"
/*!************************************!*\
  !*** ./Source/Main/Event/index.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
__exportStar(__webpack_require__(/*! ./CommonEvents */ "./Source/Main/Event/CommonEvents.ts"), exports);
__exportStar(__webpack_require__(/*! ./Dispatcher */ "./Source/Main/Event/Dispatcher.ts"), exports);
__exportStar(__webpack_require__(/*! ./Dispatcher.Types */ "./Source/Main/Event/Dispatcher.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Event */ "./Source/Main/Event/Event.ts"), exports);
__exportStar(__webpack_require__(/*! ./Event.Types */ "./Source/Main/Event/Event.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./NodeIpc */ "./Source/Main/Event/NodeIpc.ts"), exports);
__exportStar(__webpack_require__(/*! ./NodeIpc.Types */ "./Source/Main/Event/NodeIpc.Types.ts"), exports);


/***/ },

/***/ "./Source/Main/Initialize/index.ts"
/*!*****************************************!*\
  !*** ./Source/Main/Initialize/index.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
__exportStar(__webpack_require__(/*! ./Initialize */ "./Source/Main/Initialize/Initialize.ts"), exports);


/***/ },

/***/ "./Source/Main/Monitor.ts"
/*!********************************!*\
  !*** ./Source/Main/Monitor.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Monitor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MonitorsHandle = exports.GetMonitors = void 0;
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Dispatcher_1 = __webpack_require__(/*! #/Event/Dispatcher */ "./Source/Main/Event/Dispatcher.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const NodeIpc_1 = __webpack_require__(/*! #/Event/NodeIpc */ "./Source/Main/Event/NodeIpc.ts");
const Monitors = [];
const GetMonitors = () => {
    return [...Monitors];
};
exports.GetMonitors = GetMonitors;
const MonitorsDispatcher = new Dispatcher_1.TDispatcher();
exports.MonitorsHandle = MonitorsDispatcher.GetHandle();
const OnMonitorsChanged = (...Data) => {
    const NewMonitors = Data[0];
    Monitors.length = 0;
    Monitors.push(...NewMonitors);
    MonitorsDispatcher.Dispatch(NewMonitors);
};
const TrackMonitors = async () => {
    Monitors.push(...(0, wm_windows_1.InitializeMonitors)());
    (0, NodeIpc_1.Subscribe)("Monitors", OnMonitorsChanged);
};
(0, Initialize_1.RegisterInitializationFunction)("Monitor", TrackMonitors, ["NodeIpc"]);


/***/ },

/***/ "./Source/Main/Settings/InitializeSettings.ts"
/*!****************************************************!*\
  !*** ./Source/Main/Settings/InitializeSettings.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      InitializeSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Shared_1 = __webpack_require__(/*! ../../Shared */ "./Source/Shared/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const electron_settings_1 = __importDefault(__webpack_require__(/*! electron-settings */ "../node_modules/electron-settings/dist/settings.js"));
const InitializeSettings = async () => {
    if (!electron_settings_1.default.hasSync("Settings")) {
        await electron_settings_1.default.set("Settings", JSON.stringify(Shared_1.DefaultSettings));
    }
};
(0, Initialize_1.RegisterInitializationFunction)("Settings", InitializeSettings);


/***/ },

/***/ "./Source/Main/Settings/Settings.ts"
/*!******************************************!*\
  !*** ./Source/Main/Settings/Settings.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Settings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetSettings = exports.UpdateSettings = void 0;
const Shared_1 = __webpack_require__(/*! ../../Shared */ "./Source/Shared/index.ts");
const electron_settings_1 = __importDefault(__webpack_require__(/*! electron-settings */ "../node_modules/electron-settings/dist/settings.js"));
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log = (0, Development_1.GetLogger)("Settings");
const SaveSettings = async (NewSettings) => {
    try {
        await electron_settings_1.default.set("Settings", JSON.stringify(NewSettings));
        return true;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    catch (_Error) {
        return false;
    }
};
const OnUpdateSettings = async (OldSettings, NewSettings) => {
    return new Promise((Resolve, _Reject) => {
        if (OldSettings.RunOnStartup !== NewSettings.RunOnStartup) {
            (0, wm_windows_1.SetRunOnStartup)(NewSettings.RunOnStartup, process.execPath, (Success) => {
                Resolve(Success);
            });
        }
        else {
            Resolve(true);
        }
    });
};
const UpdateSettings = async (NewSettings) => {
    const OldSettings = await (0, exports.GetSettings)();
    const SavedSuccessful = await SaveSettings(NewSettings);
    if (SavedSuccessful) {
        return await OnUpdateSettings(OldSettings, NewSettings);
    }
    return false;
};
exports.UpdateSettings = UpdateSettings;
const GetSettings = async () => {
    const SettingsString = await electron_settings_1.default.get("Settings");
    return typeof SettingsString === "string"
        ? JSON.parse(SettingsString)
        : Shared_1.DefaultSettings;
};
exports.GetSettings = GetSettings;


/***/ },

/***/ "./Source/Main/Settings/index.ts"
/*!***************************************!*\
  !*** ./Source/Main/Settings/index.ts ***!
  \***************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
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
__exportStar(__webpack_require__(/*! ./InitializeSettings */ "./Source/Main/Settings/InitializeSettings.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings */ "./Source/Main/Settings/Settings.ts"), exports);


/***/ },

/***/ "./Source/Main/Store.ts"
/*!******************************!*\
  !*** ./Source/Main/Store.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Store.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetStore = exports.GetStore = void 0;
const Shared_1 = __webpack_require__(/*! ../Shared */ "./Source/Shared/index.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize/Initialize */ "./Source/Main/Initialize/Initialize.ts");
const electron_settings_1 = __importDefault(__webpack_require__(/*! electron-settings */ "../node_modules/electron-settings/dist/settings.js"));
const GetStore = async () => {
    const OutSettings = await electron_settings_1.default.get("Store");
    return (OutSettings !== null)
        ? OutSettings
        : (0, Shared_1.GetDefaultStore)();
};
exports.GetStore = GetStore;
const SetStore = async (NewStore) => {
    await electron_settings_1.default.set("Store", NewStore);
};
exports.SetStore = SetStore;
const InitializeStore = async () => {
    if (!electron_settings_1.default.hasSync("Store")) {
        electron_settings_1.default.set("Store", (0, Shared_1.GetDefaultStore)());
    }
};
(0, Initialize_1.RegisterInitializationFunction)("Store", InitializeStore);


/***/ },

/***/ "./Source/Main/Tree/Log.ts"
/*!*********************************!*\
  !*** ./Source/Main/Tree/Log.ts ***!
  \*********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetTreeLogger = void 0;
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const TreeLogger = (0, Development_1.GetLogger)("Tree");
// TreeLogger.Formatters.push((Statement: unknown): unknown =>
// {
//     if (typeof Statement === "object" && Statement !== null && "Screenshot" in Statement)
//     {
//         const { Screenshot: _, ...Out } = Statement;
//         return Out;
//     }
//     else
//     {
//         return Statement;
//     }
// });
/**
 * Log statements for the `Tree` collection of modules.
 * This function, which returns the logger, is exported
 * (rather than exporting the logger directly) to be
 * consistent with how the logger is typically retrieved
 * (retrieved at the top of each module).
 */
const GetTreeLogger = () => TreeLogger;
exports.GetTreeLogger = GetTreeLogger;


/***/ },

/***/ "./Source/Main/Tree/Tree.ts"
/*!**********************************!*\
  !*** ./Source/Main/Tree/Tree.ts ***!
  \**********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Tree.Old.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetForest = GetForest;
exports.LogForest = LogForest;
exports.UpdateForest = UpdateForest;
exports.TileAllWindows = TileAllWindows;
exports.IsVertex = IsVertex;
exports.IsCell = IsCell;
exports.Flatten = Flatten;
exports.Traverse = Traverse;
exports.Exists = Exists;
exports.ExistsExactlyOne = ExistsExactlyOne;
exports.ForAll = ForAll;
exports.IsWindowTiled = IsWindowTiled;
exports.GetCellFromHandle = GetCellFromHandle;
exports.GetPanels = GetPanels;
exports.GetRealSize = GetRealSize;
exports.Publish = Publish;
exports.GetRootPanel = GetRootPanel;
exports.AnnotatePanel = AnnotatePanel;
exports.GetPanelScreenshot = GetPanelScreenshot;
exports.MakeSizesUniform = MakeSizesUniform;
exports.IsPanelAnnotated = IsPanelAnnotated;
exports.GetCurrentPanel = GetCurrentPanel;
exports.BringIntoPanel = BringIntoPanel;
exports.Find = Find;
exports.IsPanel = IsPanel;
exports.GetPanelFromAnnotated = GetPanelFromAnnotated;
exports.RemoveAnnotations = RemoveAnnotations;
exports.AreVerticesEqual = AreVerticesEqual;
exports.GetParent = GetParent;
exports.GetIndexInPanel = GetIndexInPanel;
exports.SetInterimFocusedVertexToActive = SetInterimFocusedVertexToActive;
exports.GetInterimFocusedVertex = GetInterimFocusedVertex;
exports.ClearInterimFocusedVertex = ClearInterimFocusedVertex;
exports.VertexToString = VertexToString;
exports.ChangeFocus = ChangeFocus;
exports.FinishFocus = FinishFocus;
exports.GetNextIndex = GetNextIndex;
exports.GetNextSibling = GetNextSibling;
exports.GetPreviousSibling = GetPreviousSibling;
exports.GetPreviousIndex = GetPreviousIndex;
const Utility_1 = __webpack_require__(/*! #/Utility */ "./Source/Main/Utility/index.ts");
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Overlay_1 = __webpack_require__(/*! #/Window/Overlay */ "./Source/Main/Window/Overlay/index.ts");
const Monitor_1 = __webpack_require__(/*! #/Monitor */ "./Source/Main/Monitor.ts");
const Settings_1 = __webpack_require__(/*! #/Settings */ "./Source/Main/Settings/index.ts");
const Log_1 = __webpack_require__(/*! ./Log */ "./Source/Main/Tree/Log.ts");
const Initialize_1 = __webpack_require__(/*! #/Initialize */ "./Source/Main/Initialize/index.ts");
const Log = (0, Log_1.GetTreeLogger)();
const Forest = [];
/**
 * Get the current {@link FForest} that models the user's desktop.
 *
 * @returns {FForest} The current {@link FForest} that models the user's desktop.
 */
function GetForest() {
    return Forest;
    // return [ ...Forest ];
}
function GetDepth(Vertex) {
    let Depth = 0;
    let Parent = GetParent(Vertex);
    while (Parent !== undefined) {
        Depth++;
        Parent = GetParent(Parent);
    }
    return Depth;
}
/**
 * Log the contents of the forest.
 *
 * @param Transformer - Optionally, pass a function to transform the log statement for each vertex,
 * based upon the behavior that you wish to describe by logging.
 */
function LogForest(Transformer) {
    Log(Forest);
    Log("Logged Forest!");
    return;
    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow

}
;
const Cell = (Handle) => {
    return {
        Handle,
        Size: { Height: 0, Width: 0, X: 0, Y: 0 },
        ZOrder: 0
    };
};
function UpdateForest(UpdateFunction) {
    const NewForest = UpdateFunction([...Forest]);
    Forest.length = 0;
    Forest.push(...NewForest);
    // @TODO Move and resize, and sort ZOrder of all windows being tiled by SorrellWm.
}
;
async function InitializeTree() {
    const Monitors = (0, Monitor_1.GetMonitors)();
    Forest.push(...Monitors.map((Monitor) => {
        return {
            Children: [],
            MonitorId: Monitor.Handle,
            Size: Monitor.WorkSize,
            Type: Monitor.WorkSize.Width < Monitor.WorkSize.Height
                ? "Vertical"
                : "Horizontal",
            ZOrder: 0
        };
    }));
    // console.log(Forest);
    // /** @TODO Consider changing this. */
    // RestoreAllWindows();
    Log("INITIALIZED TREE.");
}
;
/**
 * Intended to be (optionally) called upon launching SorrellWm,
 * tile all restored windows, and place them in the root panel of the
 * respective monitor to which they belong.
 */
function TileAllWindows() {
    const Monitors = (0, Monitor_1.GetMonitors)();
    const TileableWindows = (0, wm_windows_1.GetTileableWindows)().filter((Handle) => {
        /** @TODO For now, exclude VS Code, just to make development less annoying. */
        return !(0, wm_windows_1.GetWindowTitle)(Handle).includes("SorrellWm (Workspace)");
    });
    // console.log(`Found ${ TileableWindows.length } tileable windows.`);
    TileableWindows.forEach((Handle) => {
        const Monitor = (0, wm_windows_1.GetMonitorFromWindow)(Handle);
        const RootPanel = Forest.find((Panel) => {
            /* eslint-disable @stylistic/max-len */
            // console.log(`Monitor is ${ JSON.stringify(Monitor) } and Panel.MonitorId is ${ JSON.stringify(Panel.MonitorId) }.`);
            // const Info: FMonitorInfo | undefined =
            //     Monitors.find((Foo: FMonitorInfo): boolean =>
            //     {
            //         return Foo.Handle.Handle === Panel.MonitorId?.Handle;
            //     });
            // console.log(`Size ${ JSON.stringify(Info?.Size) } WorkSize ${ JSON.stringify(Info?.WorkSize) }.`);
            /* eslint-enable @stylistic/max-len */
            return Panel.MonitorId?.Handle === Monitor.Handle;
        });
        if (RootPanel === undefined) {
            // @TODO
            Log("RootPanel was undefined.");
        }
        else {
            RootPanel.Children.push(Cell(Handle));
        }
    });
    Forest.forEach((Panel) => {
        const MonitorInfo = Monitors.find((InMonitor) => InMonitor.Handle === Panel.MonitorId);
        /* @TODO For now, skip the main monitor. */
        if (MonitorInfo?.Size.Width === 3440) {
            return;
        }
        if (MonitorInfo === undefined) {
            // @TODO
        }
        // else if (AreBoxesEqual(MonitorInfo.WorkSize, ))
        else {
            Panel.Children = Panel.Children.map((Child, Index) => {
                const UniformWidth = MonitorInfo.WorkSize.Width / Panel.Children.length;
                const OutChild = { ...Child };
                OutChild.Size =
                    {
                        ...MonitorInfo.WorkSize,
                        Width: UniformWidth,
                        X: UniformWidth * Index + MonitorInfo.WorkSize.X
                    };
                return OutChild;
            });
        }
    });
    const Cells = GetAllCells(Forest);
    Cells.forEach((Cell) => {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Verbose(`Setting position of ${(0, wm_windows_1.GetWindowTitle)(Cell.Handle)} to ${JSON.stringify(Cell.Size)}.`);
        (0, wm_windows_1.SetWindowPosition)(Cell.Handle, Cell.Size);
        /* At least for now, ignore SorrellWm windows. */
        // if (GetWindowTitle(Cell.Handle) !== "SorrellWm")
        // {
        //     SetWindowPosition(Cell.Handle, Cell.Size);
        // }
    });
}
;
/** @remarks This is not a completely thorough type-check function. */
function IsVertex(In) {
    return (typeof In === "object" &&
        In !== null &&
        "Size" in In &&
        "Handle" in In &&
        "ZOrder" in In);
}
;
function IsCell(Vertex) {
    return "Handle" in Vertex;
}
;
function Flatten() {
    const OutArray = [];
    Traverse((Vertex) => {
        OutArray.push(Vertex);
        return true;
    });
    return OutArray;
}
;
/**
 * Run a function for each vertex until the function returns `false` for
 * an iteration.
 */
function Traverse(Predicate, Entry) {
    let Continues = true;
    const Recurrence = (Vertex) => {
        if (Continues) {
            Continues = Predicate(Vertex);
            if (Continues && "Children" in Vertex) {
                for (const Child of Vertex.Children) {
                    Recurrence(Child);
                }
            }
        }
    };
    if (Entry) {
        Recurrence(Entry);
    }
    else {
        for (const Panel of Forest) {
            Recurrence(Panel);
        }
    }
}
;
const GetAllCells = (Panels) => {
    const Result = [];
    function Traverse(Vertex) {
        if ("Handle" in Vertex) {
            Result.push(Vertex);
        }
        else if ("Children" in Vertex) {
            for (const Child of Vertex.Children) {
                Traverse(Child);
            }
        }
    }
    for (const Panel of Panels) {
        for (const Child of Panel.Children) {
            Traverse(Child);
        }
    }
    return Result;
};
function Exists(Predicate) {
    let DoesExist = false;
    Traverse((Vertex) => {
        if (!DoesExist) {
            DoesExist = Predicate(Vertex);
        }
        return !DoesExist;
    });
    return DoesExist;
}
;
/** @TODO */
function ExistsExactlyOne(_Predicate) {
    return false;
}
;
function ForAll(_Predicate) {
    return false;
}
;
function IsWindowTiled(Handle) {
    return Exists((Vertex) => {
        return IsCell(Vertex) && (0, Utility_1.AreHandlesEqual)(Vertex.Handle, Handle);
    });
}
;
function GetCellFromHandle(Handle) {
    return Find((Vertex) => {
        return IsCell(Vertex) && (0, Utility_1.AreHandlesEqual)(Vertex.Handle, Handle);
    });
}
;
function GetPanels() {
    const Vertices = Flatten();
    return Vertices.filter((Vertex) => !IsCell(Vertex));
}
;
const TraverseLevelOrder = (Root, Callback) => {
    const Queue = [{ Level: 0, Vertex: Root }];
    while (Queue.length > 0) {
        const { Vertex, Level } = Queue.shift();
        Callback(Vertex, Level);
        if (IsPanel(Vertex)) {
            for (const Child of Vertex.Children) {
                Queue.push({ Level: Level + 1, Vertex: Child });
            }
        }
    }
};
const ComputeGapData = async () => {
    const GapData = new Map();
    /** @TODO Make this a setting. */
    const { Gap } = await (0, Settings_1.GetSettings)();
    Forest.forEach((Root) => {
        /* Apply the outer margin. */
        GapData.set(Root, {
            AdjustedSize: {
                Height: Root.Size.Height - 2 * Gap,
                Width: Root.Size.Width - 2 * Gap,
                X: Root.Size.X + Gap,
                Y: Root.Size.Y + Gap
            },
            PrincipalRatio: 1
        });
        // const GetPreviousVertex = (Vertex: FVertex, Parent: FPanel): FVertex | undefined =>
        // {
        //     const Index: number | undefined = GetIndexInPanel(Vertex);
        //     if (Index !== undefined)
        //     {
        //         return Index > 0
        //             ? Parent.Children[Index - 1]
        //             : undefined;
        //     }
        //     else
        //     {
        /* eslint-disable-next-line @stylistic/max-len */
        //         Log.Error("GetPreviousVertex called GetIndexInPanel, which returned undefined.  This should never happen!");
        //         return undefined;
        //     }
        // };
        const GetCumulativePreviousPrincipalRatios = (Vertex, Parent) => {
            const GivenIndex = GetIndexInPanel(Vertex);
            if (GivenIndex === undefined) {
                Log.Error("Oops.");
                return undefined;
            }
            else if (GivenIndex === 0) {
                return 0;
            }
            else {
                let CumulativePreviousPrincipalMeasures = 0;
                const PrincipalMeasure = Parent.Type === "Horizontal"
                    ? "Width"
                    : "Height";
                for (let Index = 0; Index < GivenIndex; Index++) {
                    const Child = Parent.Children[Index];
                    if (Child !== undefined) {
                        CumulativePreviousPrincipalMeasures += Child.Size[PrincipalMeasure];
                    }
                }
                return CumulativePreviousPrincipalMeasures / Parent.Size[PrincipalMeasure];
            }
        };
        TraverseLevelOrder(Root, (Vertex, _Level) => {
            if (IsPanel(Vertex)) {
                return;
            }
            const Parent = GetParent(Vertex);
            if (Parent === undefined) {
                Log.Error("Beep boop.");
                return;
            }
            // const PrincipalAxis: "X" | "Y" = Parent.Type === "Horizontal"
            //     ? "X"
            //     : "Y";
            const PrincipalMeasure = Parent.Type === "Horizontal"
                ? "Width"
                : "Height";
            const PrincipalRatio = Vertex.Size[PrincipalMeasure] / Parent.Size[PrincipalMeasure];
            const CumulativePreviousRatios = GetCumulativePreviousPrincipalRatios(Vertex, Parent);
            if (CumulativePreviousRatios === undefined) {
                Log.Error("Oops.");
                return;
            }
            const ParentGapData = GapData.get(Parent);
            if (ParentGapData === undefined) {
                Log.Error("Oops.");
                return;
            }
            const Index = GetIndexInPanel(Vertex);
            if (Index === undefined) {
                Log.Error("Oops.");
                return;
            }
            // const TotalGapSizeInPanel: number = (Parent.Children.length - 1) * Gap;
            /* The amount of space that will be taken up by vertices in the parent panel. */
            const ParentWorkPrincipalMeasure = ParentGapData.AdjustedSize[PrincipalMeasure] - Gap * (Parent.Children.length - 1);
            const CumulativePreviousGaps = Index * Gap;
            /* The amount of space that will be taken up in the panel by all previous vertices *and* gaps. */
            const CumulativePrincipalDistance = CumulativePreviousRatios * ParentWorkPrincipalMeasure + CumulativePreviousGaps;
            const X = Math.round(Parent.Type === "Horizontal"
                ? ParentGapData.AdjustedSize.X + CumulativePrincipalDistance
                : ParentGapData.AdjustedSize.X);
            const Y = Math.round(Parent.Type === "Horizontal"
                ? ParentGapData.AdjustedSize.Y
                : ParentGapData.AdjustedSize.Y + CumulativePrincipalDistance);
            const Height = Math.round(Parent.Type === "Horizontal"
                ? ParentGapData.AdjustedSize.Height
                : PrincipalRatio * ParentWorkPrincipalMeasure);
            const Width = Math.round(Parent.Type === "Horizontal"
                ? PrincipalRatio * ParentWorkPrincipalMeasure
                : ParentGapData.AdjustedSize.Width);
            GapData.set(Vertex, {
                AdjustedSize: {
                    Height,
                    Width,
                    X,
                    Y
                },
                PrincipalRatio
            });
        });
    });
    const Out = new Map();
    GapData.forEach((GapData, Vertex) => {
        Out.set(Vertex, GapData.AdjustedSize);
    });
    return Out;
};
async function GetRealSize(InVertex) {
    const { Gap } = await (0, Settings_1.GetSettings)();
    const IsGapNonzero = Gap > 0;
    if (IsGapNonzero) {
        const GapAdjustedSizes = await ComputeGapData();
        const VertexGapAdjustedSize = GapAdjustedSizes.get(InVertex);
        if (VertexGapAdjustedSize !== undefined) {
            return VertexGapAdjustedSize;
        }
        else {
            return undefined;
        }
    }
    else {
        return InVertex.Size;
    }
}
;
async function Publish() {
    const { Gap } = await (0, Settings_1.GetSettings)();
    const IsGapNonzero = Gap > 0;
    const GapAdjustedSizes = IsGapNonzero
        ? await ComputeGapData()
        : undefined;
    Traverse((Vertex) => {
        if (IsCell(Vertex)) {
            if (IsGapNonzero) {
                if (GapAdjustedSizes !== undefined) {
                    const AdjustedSize = GapAdjustedSizes.get(Vertex);
                    if (AdjustedSize !== undefined) {
                        (0, wm_windows_1.SetWindowPosition)(Vertex.Handle, AdjustedSize);
                        /* eslint-disable-next-line @stylistic/max-len */
                        Log(`Cell ${(0, wm_windows_1.GetWindowTitle)(Vertex.Handle).slice(0, 12)} has bounds ${(0, Utility_1.BoxToString)(AdjustedSize)}.`);
                    }
                }
            }
            else {
                (0, wm_windows_1.SetWindowPosition)(Vertex.Handle, Vertex.Size);
            }
        }
        return true;
    });
    const TiledWindows = [];
    Traverse((Vertex) => {
        if (IsCell(Vertex)) {
            TiledWindows.push(Vertex.Handle);
        }
        return true;
    });
    (0, wm_windows_1.UpdateTiledList)(TiledWindows);
}
;
const PanelContainsVertex = (currentVertex, targetVertex) => {
    if (currentVertex === targetVertex) {
        return true;
    }
    // If this is a panel, check its children recursively
    if ("Children" in currentVertex) {
        for (const child of currentVertex.Children) {
            if (PanelContainsVertex(child, targetVertex)) {
                return true;
            }
        }
    }
    return false;
};
function GetRootPanel(Vertex) {
    for (const Panel of Forest) {
        if (PanelContainsVertex(Panel, Vertex)) {
            return Panel;
        }
    }
    return undefined;
}
;
function GetPanelApplicationNames(Panel) {
    const ResultNames = [];
    Traverse((Vertex) => {
        if ("Handle" in Vertex) {
            const FriendlyName = (0, wm_windows_1.GetApplicationFriendlyName)(Vertex.Handle);
            if (FriendlyName !== undefined) {
                ResultNames.push(FriendlyName);
            }
            if (ResultNames.length >= 3) {
                return false;
            }
        }
        return true;
    }, Panel);
    return ResultNames;
}
;
function AnnotatePanel(Panel) {
    const RootPanel = GetRootPanel(Panel);
    if (RootPanel !== undefined && RootPanel.MonitorId !== undefined) {
        const ApplicationNames = GetPanelApplicationNames(Panel);
        const IsRoot = RootPanel === Panel;
        const Monitor = (0, wm_windows_1.GetMonitorFriendlyName)(RootPanel.MonitorId) || "";
        return {
            ...Panel,
            ApplicationNames,
            IsRoot,
            MonitorName: Monitor,
            Screenshot: undefined
        };
    }
    return undefined;
}
;
async function GetPanelScreenshot(Panel) {
    const ScreenshotPath = (0, wm_windows_1.CaptureScreenSectionToTempPngFile)(Panel.Size);
    return await (0, Utility_1.GetPngBase64)(ScreenshotPath);
}
;
function MakeSizesUniform(Panel) {
    Panel.Children.forEach((Child, Index) => {
        if (Panel.Type === "Horizontal") {
            Child.Size.Width = Math.floor(Panel.Size.Width / Panel.Children.length);
            Child.Size.X = Panel.Size.X + Index * Child.Size.Width;
            Child.Size.Height = Panel.Size.Height;
            Child.Size.Y = Panel.Size.Y;
        }
        else if (Panel.Type === "Vertical") {
            Child.Size.Height = Math.floor(Panel.Size.Height / Panel.Children.length);
            Child.Size.Y = Panel.Size.Y + Index * Child.Size.Height;
            Child.Size.Width = Panel.Size.Width;
            Child.Size.X = Panel.Size.X;
        }
    });
}
;
function IsPanelAnnotated(Panel) {
    return "Screenshot" in Panel;
}
;
function GetCurrentPanel() {
    const Handle = (0, Overlay_1.GetActiveWindow)();
    if (Handle !== undefined) {
        return Find((Vertex) => {
            if (IsPanel(Vertex)) {
                return Vertex.Children.some((Child) => {
                    return IsCell(Child) && (0, Utility_1.AreHandlesEqual)(Child.Handle, Handle);
                });
            }
            else {
                return false;
            }
        });
    }
    else {
        return undefined;
    }
}
;
function BringIntoPanel(InPanel, Handle) {
    if (Handle !== undefined) {
        // console.log(`BringingIntoPanel: ${ GetWindowTitle(Handle) }.`);
        const Panel = IsPanelAnnotated(InPanel)
            ? GetPanelFromAnnotated(InPanel)
            : InPanel;
        if (Panel !== undefined) {
            // console.log("BringIntoPanel: PanelFromAnnotated was defined!");
            /* If the window is maximized, then setting its position can cause it to become white. */
            (0, wm_windows_1.RestoreWindow)(Handle);
            const OutCell = Cell(Handle);
            Panel.Children.push(OutCell);
            MakeSizesUniform(Panel);
            Publish();
            return OutCell;
        }
        else {
            // console.log("BringIntoPanel: PanelFromAnnotated was UNDEFINED.");
        }
    }
    return undefined;
}
;
function Find(Predicate) {
    let Out = undefined;
    Traverse((Vertex) => {
        if (Out === undefined) {
            const Satisfies = Predicate(Vertex);
            if (Satisfies) {
                Out = Vertex;
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    });
    return Out;
}
;
function IsPanel(Vertex) {
    return "Children" in Vertex;
}
// const FormatPanel = (InPanel: FPanel | FAnnotatedPanel): string =>
// {
//     return "";
// };
function GetPanelFromAnnotated(Panel) {
    const LoggedPanel = {
        Size: Panel.Size,
        Type: Panel.Type
    };
    Log("Begins GetPanelFromAnnotated, Panel is", LoggedPanel);
    return Find((Vertex) => {
        if (IsPanel(Vertex)) {
            Log("Vertex is a panel.", Vertex);
            const AreEqual = ArePanelsEqual(Panel, Vertex);
            if (AreEqual) {
                Log("Panels are equal", Panel, Vertex);
            }
            else {
                Log("Panels are NOT equal", Panel, Vertex);
            }
            return AreEqual;
        }
        else {
            Log("Vertex was NOT a panel", Vertex);
            return false;
        }
    });
}
;
/**
 * Get an {@link FPanel} from a given {@link FAnnotatedPanel}.
 *
 * @param AnnotatedPanel - The {@link FAnnotatedPanel} from which the annotations
 * will be removed.
 *
 * @returns {FPanel} The {@link FPanel} that constituted the given {@link AnnotatedPanel},
 * without the annotations.
 */
function RemoveAnnotations(AnnotatedPanel) {
    return {
        Children: AnnotatedPanel.Children,
        MonitorId: AnnotatedPanel.MonitorId,
        Size: AnnotatedPanel.Size,
        Type: AnnotatedPanel.Type,
        ZOrder: AnnotatedPanel.ZOrder
    };
}
;
/**
 * Determines whether two panels are equal.
 *
 * @param A - The first {@link FPanel} argument.
 * @param B - The second {@link FPanel} argument.
 *
 * @returns {boolean} Whether {@link A} and {@link B} are equal.
 */
function ArePanelsEqual(A, B) {
    // @TODO To support stack boxes, check if children are also equal as well.
    return A.Children.length === B.Children.length && (0, Utility_1.AreBoxesEqual)(A.Size, B.Size);
}
;
/**
 * Determines whether two vertices are equal.
 *
 * @param A - The first {@link FVertex} argument.
 * @param B - The second {@link FVertex} argument.
 *
 * @returns {boolean} Whether {@link A} and {@link B} are equal.
 */
function AreVerticesEqual(A, B) {
    if (IsCell(A) && IsCell(B)) {
        return (0, Utility_1.AreHandlesEqual)(A.Handle, B.Handle);
    }
    else if (IsPanel(A) && IsPanel(B)) {
        return ArePanelsEqual(A, B);
    }
    else {
        return false;
    }
}
;
/**
 * Get the parent vertex of `Vertex`.  Returns undefined iff it is a root panel.
 *
 * @param Vertex - The {@link FVertex} whose parent is returned by this function,
 * if the given {@link FVertex} has a parent.
 *
 * @returns {FPanel | undefined} The parent of the given {@link Vertex}, if the given
 * {@link Vertex} has a parent (otherwise `undefined`).
 */
function GetParent(Vertex) {
    return Find((InVertex) => {
        if (IsPanel(InVertex)) {
            return InVertex.Children.some((InChild) => {
                return AreVerticesEqual(Vertex, InChild);
            });
        }
        else {
            return false;
        }
    });
}
;
/**
 * Get the index of the given `Vertex` in its parent panel.
 *
 * @param Vertex - The vertex whose index in its parent panel is returned by this.
 *
 * @returns {number | undefined} The index of the given {@link Vertex} in its
 * containing panel.  If the given {@link Vertex} does not have a parent panel,
 * then this function returns `undefined`.
 */
function GetIndexInPanel(Vertex) {
    const ParentPanel = GetParent(Vertex);
    if (ParentPanel !== undefined) {
        const Self = ParentPanel.Children.find((Child) => {
            return AreVerticesEqual(Vertex, Child);
        });
        if (Self !== undefined) {
            const Index = ParentPanel.Children.indexOf(Self);
            if (Index === -1) {
                return undefined;
            }
            else {
                return Index;
            }
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
;
let InterimFocusedVertex = undefined;
function SetInterimFocusedVertexToActive() {
    const ActiveWindow = (0, Overlay_1.GetActiveWindow)();
    if (ActiveWindow !== undefined) {
        InterimFocusedVertex = GetCellFromHandle(ActiveWindow);
    }
}
;
function GetInterimFocusedVertex() {
    return InterimFocusedVertex;
}
;
function ClearInterimFocusedVertex() {
    InterimFocusedVertex = undefined;
}
;
function VertexToString(Vertex) {
    return IsCell(Vertex)
        ? (0, wm_windows_1.GetWindowTitle)(Vertex.Handle)
        : `${Vertex.Type} panel with ${Vertex.Children.length} children.`;
}
;
// let ChangeFocusDebounceTime: number = 0;
function ChangeFocus(FocusChange) {
    // const Now: number = new Date().getTime();
    // const DebounceDuration: number = 50;
    // if (Math.abs(Now - ChangeFocusDebounceTime) <= DebounceDuration && ChangeFocusDebounceTime !== 0)
    // {
    //     Log(`ChangeFocus was called too soon, just ${ Now - ChangeFocusDebounceTime }ms ago.`);
    //     return;
    // }
    // else
    // {
    //     ChangeFocusDebounceTime = Now;
    // }
    const LogChangeFocus = () => {
        LogForest((Vertex, _Depth, DefaultString) => {
            const PositionString = `(${Vertex.Size.X}, ${Vertex.Size.Y})`;
            return Vertex === InterimFocusedVertex
                ? `${DefaultString} ${PositionString} ** INTERIM **`
                : `${DefaultString} ${PositionString}`;
        });
    };
    if (InterimFocusedVertex === undefined) {
        const ActiveWindow = (0, Overlay_1.GetActiveWindow)();
        if (ActiveWindow !== undefined) {
            const ActiveWindowPosition = (0, wm_windows_1.GetWindowShape)(ActiveWindow);
            /* eslint-disable-next-line @stylistic/max-len */
            Log(`In ChangeFocus, the ActiveWindow is ${(0, wm_windows_1.GetWindowTitle)(ActiveWindow)} at ${(0, Utility_1.PositionToString)(ActiveWindowPosition)}.`);
            InterimFocusedVertex = GetCellFromHandle(ActiveWindow);
        }
        else {
            Log("Whoops...");
        }
        return;
    }
    else {
        /* eslint-disable-next-line @stylistic/max-len */
        Log(`In ChangeFocus, InterimFocusedVertex was already defined and is ${VertexToString(InterimFocusedVertex)} at ${(0, Utility_1.PositionToString)(InterimFocusedVertex.Size)}.`);
    }
    const ParentPanel = GetParent(InterimFocusedVertex);
    // /* I have no idea why this is needed. */
    // if (ParentPanel !== undefined)
    // {
    //     const NewIndex: number = ParentPanel.Children.indexOf(InterimFocusedVertex) + 1;
    //     Log(`In ChangeFocus, NewIndex is ${ NewIndex }.`);
    //     InterimFocusedVertex = ParentPanel.Children[NewIndex];
    // }
    Log("Before Changing Focus, this is the current Forest:");
    LogChangeFocus();
    switch (FocusChange) {
        case "Down":
            if (IsPanel(InterimFocusedVertex)) {
                InterimFocusedVertex = InterimFocusedVertex.Children[0];
            }
            break;
        case "Up":
            if (ParentPanel !== undefined) {
                InterimFocusedVertex = ParentPanel;
            }
            break;
        case "Next":
            if (ParentPanel !== undefined) {
                const Index = GetIndexInPanel(InterimFocusedVertex);
                if (Index !== undefined) {
                    if (Index !== ParentPanel.Children.length - 1) {
                        InterimFocusedVertex = ParentPanel.Children[Index + 1];
                    }
                    else {
                        InterimFocusedVertex = ParentPanel.Children[0];
                    }
                }
            }
            break;
        case "Previous":
            if (ParentPanel !== undefined) {
                const Index = GetIndexInPanel(InterimFocusedVertex);
                Log.Verbose(`InChangeFocus, under case "Previous", Index is ${Index}.`);
                /* eslint-disable-next-line @stylistic/max-len */
                Log(`After getting the Index under case "Previous", the InterimFocusedVertex has position (${InterimFocusedVertex.Size.X}, ${InterimFocusedVertex.Size.Y}).`);
                if (Index !== undefined) {
                    if (Index === 0) {
                        InterimFocusedVertex = ParentPanel.Children[ParentPanel.Children.length - 1];
                    }
                    else {
                        InterimFocusedVertex = ParentPanel.Children[Index - 1];
                    }
                }
                else {
                    Log("Whoops.");
                }
            }
            break;
    }
    Log("After Changing Focus, this is the current Forest:");
    LogChangeFocus();
}
;
/**
 * Given a panel, get its 0th cell.
 *
 * @todo Consider modifying this such that if the 0th child of the panel is a panel with no children,
 * then try the 1st child, 2nd, etc.
 *
 * @param Panel - The panel whose zeroth {@link FCell} is returned by this.
 *
 * @returns {FCell | undefined} The zeroth {@link FCell} of the given {@link Panel}.
 * If the given {@link Panel} has no children, then `undefined` is returned.
 */
function GetZerothCell(Panel) {
    if (Panel.Children[0] !== undefined) {
        return IsCell(Panel.Children[0])
            ? Panel.Children[0]
            : GetZerothCell(Panel.Children[0]);
    }
    else {
        return undefined;
    }
}
;
function FinishFocus() {
    if (InterimFocusedVertex !== undefined) {
        if (IsCell(InterimFocusedVertex)) {
            (0, wm_windows_1.SetForegroundWindow)(InterimFocusedVertex.Handle);
        }
        else if (InterimFocusedVertex.Children.length > 0) {
            const ZerothCell = GetZerothCell(InterimFocusedVertex);
            if (ZerothCell !== undefined) {
                (0, wm_windows_1.SetForegroundWindow)(ZerothCell.Handle);
            }
            else {
                /* eslint-disable-next-line @stylistic/max-len */
                Log.Warn("FinishFocus could not set the foreground window, because InterimFocusedVertex was a panel that did not have a zeroth child.");
            }
        }
    }
    else {
        const ActiveWindow = (0, Overlay_1.GetActiveWindow)();
        if (ActiveWindow !== undefined) {
            (0, wm_windows_1.SetForegroundWindow)(ActiveWindow);
        }
    }
}
;
function GetNextIndex(Vertex) {
    const Parent = GetParent(Vertex);
    if (Parent !== undefined) {
        const CurrentIndex = Parent.Children.indexOf(Vertex);
        return CurrentIndex === Parent.Children.length - 1
            ? 0
            : CurrentIndex + 1;
    }
    else {
        return undefined;
    }
}
;
function GetNextSibling(Vertex) {
    const Parent = GetParent(Vertex);
    if (Parent !== undefined) {
        const NextIndex = GetNextIndex(Vertex);
        if (NextIndex !== undefined) {
            return Parent.Children[NextIndex];
        }
    }
    return undefined;
}
;
function GetPreviousSibling(Vertex) {
    const Parent = GetParent(Vertex);
    if (Parent !== undefined) {
        const PreviousIndex = GetPreviousIndex(Vertex);
        if (PreviousIndex !== undefined) {
            return Parent.Children[PreviousIndex];
        }
    }
    return undefined;
}
;
/**
 * Get one less than the index of a given {@link Vertex} in its parent panel.
 *
 * @param Vertex - The {@link FVertex} whose index in its parent panel is used
 * to compute the value returned by this.
 *
 * @returns {number | undefined} One less than the index of the given {@link Vertex}
 * in its parent panel.  If the given {@link Vertex} does not have a parent panel,
 * then `undefined` is returned.
 */
function GetPreviousIndex(Vertex) {
    const Parent = GetParent(Vertex);
    if (Parent !== undefined) {
        const CurrentIndex = Parent.Children.indexOf(Vertex);
        return CurrentIndex === 0
            ? Parent.Children.length - 1
            : CurrentIndex - 1;
    }
    else {
        return undefined;
    }
}
;
(0, Initialize_1.RegisterInitializationFunction)("Tree", InitializeTree, ["Monitor"]);


/***/ },

/***/ "./Source/Main/Tree/index.ts"
/*!***********************************!*\
  !*** ./Source/Main/Tree/index.ts ***!
  \***********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
// export * as Old from "./Tree.Old";
// export * from "./Tree";
__exportStar(__webpack_require__(/*! ./Tree */ "./Source/Main/Tree/Tree.ts"), exports);


/***/ },

/***/ "./Source/Main/Utility/Utility.Types.ts"
/*!**********************************************!*\
  !*** ./Source/Main/Utility/Utility.Types.ts ***!
  \**********************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Main/Utility/Utility.ts"
/*!****************************************!*\
  !*** ./Source/Main/Utility/Utility.ts ***!
  \****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:    Utility.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetPngBase64 = exports.Sleep = exports.BoxToString = exports.SizeToString = exports.PositionToString = exports.ForAsync = exports.MapKeys = exports.AreHandlesEqual = exports.AreBoxesEqual = void 0;
const fs_1 = __webpack_require__(/*! fs */ "fs");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Log = (0, Development_1.GetLogger)("Utility");
const AreBoxesEqual = (A, B) => {
    return (A.X === B.X &&
        A.Y === B.Y &&
        A.Width === B.Width &&
        A.Height === B.Height);
};
exports.AreBoxesEqual = AreBoxesEqual;
const AreHandlesEqual = (A, B) => {
    return A.Handle === B.Handle;
};
exports.AreHandlesEqual = AreHandlesEqual;
const MapKeys = (InObject, Callback) => {
    const OutArray = [];
    Object.keys(InObject).forEach((Key, Index) => {
        OutArray.push(Callback(Key, Index));
    });
    return OutArray;
};
exports.MapKeys = MapKeys;
const ForAsync = async (StartIndex, EndIndex, Callback) => {
    if (!Number.isInteger(StartIndex)) {
        Log.Error("ForAsync was given a StartIndex that wasn't an integer.");
        return;
    }
    if (!Number.isInteger(EndIndex)) {
        Log.Error("ForAsync was given a EndIndex that wasn't an integer.");
        return;
    }
    if (StartIndex > EndIndex) {
        Log.Error("ForAsync was given a StartIndex that is greater than the given EndIndex.");
        return;
    }
    const Range = [...Array(EndIndex - StartIndex + 1).keys()];
    for await (const Index of Range) {
        await Callback(Index);
    }
};
exports.ForAsync = ForAsync;
const PositionToString = (Box) => {
    return `(${Box.X}, ${Box.Y})`;
};
exports.PositionToString = PositionToString;
const SizeToString = (Box) => {
    return `Width ${Box.Width}, Height ${Box.Height}`;
};
exports.SizeToString = SizeToString;
const BoxToString = (Box) => {
    return `${(0, exports.PositionToString)(Box)} with ${(0, exports.SizeToString)(Box)}`;
};
exports.BoxToString = BoxToString;
const Sleep = (Duration) => {
    /* eslint-disable-next-line @typescript-eslint/typedef */
    return new Promise((Resolve, _Reject) => {
        setTimeout(() => {
            Resolve();
        }, Duration);
    });
};
exports.Sleep = Sleep;
const GetPngBase64 = async (Path) => {
    const IconBuffer = await fs_1.promises.readFile(Path);
    return "data:image/png;base64," + IconBuffer.toString("base64");
};
exports.GetPngBase64 = GetPngBase64;


/***/ },

/***/ "./Source/Main/Utility/index.ts"
/*!**************************************!*\
  !*** ./Source/Main/Utility/index.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
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
__exportStar(__webpack_require__(/*! ./Utility */ "./Source/Main/Utility/Utility.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility.Types */ "./Source/Main/Utility/Utility.Types.ts"), exports);


/***/ },

/***/ "./Source/Main/Window/Overlay/OverlayWindow.ts"
/*!*****************************************************!*\
  !*** ./Source/Main/Window/Overlay/OverlayWindow.ts ***!
  \*****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      OverlayWindow.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell.
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Activate = exports.SetShouldActivate = exports.SetActiveWindow = exports.GetActiveWindow = exports.GetLeastInvisiblePosition = exports.Deactivate = exports.BlurBackground = exports.InitializeOverlay = exports.GetOverlayWindow = void 0;
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Development_1 = __webpack_require__(/*! #/Development */ "./Source/Main/Development/index.ts");
const Tree_1 = __webpack_require__(/*! #/Tree/Tree */ "./Source/Main/Tree/Tree.ts");
const Event_1 = __webpack_require__(/*! #/Event */ "./Source/Main/Event/index.ts");
const Log = (0, Development_1.GetLogger)("OverlayWindow");
let OverlayWindow = undefined;
const GetOverlayWindow = () => OverlayWindow;
exports.GetOverlayWindow = GetOverlayWindow;
const InitializeOverlay = (In) => {
    OverlayWindow = In;
    return In;
};
exports.InitializeOverlay = InitializeOverlay;
const BlurBackground = (Bounds) => {
    const InterimFocusedVertex = (0, Tree_1.GetInterimFocusedVertex)();
    const SourceHandle = InterimFocusedVertex !== undefined && (0, Tree_1.IsCell)(InterimFocusedVertex)
        ? InterimFocusedVertex.Handle
        : (0, exports.GetActiveWindow)();
    if (SourceHandle !== undefined) {
        const DevSettings = (0, Development_1.GetDevSettings)();
        const OutBounds = DevSettings.StaticMode.Enabled
            ? DevSettings.StaticMode.WindowShape
            : Bounds;
        Log("OutBounds", OutBounds);
        (0, wm_windows_1.BlurBackground)(OutBounds, SourceHandle);
        if (OverlayWindow) {
            const OutBoundsRectangle = {
                height: OutBounds.Height,
                width: OutBounds.Width,
                x: OutBounds.X,
                y: OutBounds.Y
            };
            const ScaleFactor = electron_1.screen.getDisplayMatching(OutBoundsRectangle).scaleFactor;
            OverlayWindow.setBounds({
                height: OutBounds.Height / ScaleFactor,
                width: OutBounds.Width / ScaleFactor,
                x: OutBounds.X / ScaleFactor,
                y: OutBounds.Y / ScaleFactor
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
exports.BlurBackground = BlurBackground;
/** Hide the main window. */
const Deactivate = () => {
    const { x: X, y: Y } = (0, exports.GetLeastInvisiblePosition)();
    if (OverlayWindow) {
        OverlayWindow.setPosition(X, Y, false);
        (0, wm_windows_1.UnblurBackground)();
    }
};
exports.Deactivate = Deactivate;
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
exports.GetLeastInvisiblePosition = GetLeastInvisiblePosition;
/** The window(s) that SorrellWm is being drawn over. */
let ActiveWindow = undefined;
const GetActiveWindow = () => {
    return ActiveWindow;
};
exports.GetActiveWindow = GetActiveWindow;
const SetActiveWindow = (In) => {
    ActiveWindow = In;
};
exports.SetActiveWindow = SetActiveWindow;
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
    if ((0, wm_windows_1.GetWindowTitle)((0, wm_windows_1.GetFocusedWindow)()) !== "SorrellWm Main Window" && OverlayWindow) {
        ActiveWindow = (0, wm_windows_1.GetFocusedWindow)();
        const IsTiled = (0, Tree_1.IsWindowTiled)((0, wm_windows_1.GetFocusedWindow)());
        const NavigateRequest = {
            Route: "",
            State: { IsTiled }
        };
        // MainWindow?.webContents.closeDevTools();
        (0, Event_1.SendIpcEvent)(OverlayWindow, "Navigate", NavigateRequest);
        (0, exports.BlurBackground)((0, wm_windows_1.GetDwmWindowRect)(ActiveWindow));
        Log(OverlayWindow?.getPosition());
        Log(OverlayWindow?.getSize());
        // StealFocus(GetWindowByName("SorrellWm Main Window"));
    }
};
exports.Activate = Activate;


/***/ },

/***/ "./Source/Main/Window/Overlay/index.ts"
/*!*********************************************!*\
  !*** ./Source/Main/Window/Overlay/index.ts ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
__exportStar(__webpack_require__(/*! ./OverlayWindow */ "./Source/Main/Window/Overlay/OverlayWindow.ts"), exports);
// export const OverlayDummyExport: "OverlayDummyExport" = "OverlayDummyExport" as const;


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fRGV2ZWxvcG1lbnRfaW5kZXhfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRzs7Ozs7Ozs7Ozs7OztBQ0xIOzs7OztHQUtHOzs7Ozs7Ozs7Ozs7O0FDTEg7Ozs7O0dBS0c7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgscUZBQStDO0FBQXRDLDBHQUFTO0FBQUUsOEdBQVc7QUFDL0IsdUdBQXFDO0FBQTVCLDBHQUFNO0FBQ2YsNEdBQTRCOzs7Ozs7Ozs7Ozs7QUNUNUI7Ozs7Ozs7OztHQVNHOzs7QUFFSCxnRkFBbUQ7QUFDbkQsMkZBVW1EO0FBQ25ELGtGQUVpRDtBQUNqRCx5RkFBNEM7QUFFNUMseUZBQWtDO0FBQ2xDLG1FQUErQjtBQUUvQix5RUFBeUU7QUFDekUsTUFBTSx5QkFBeUIsR0FBWSxLQUFLLENBQUM7QUFFakQsTUFBTSx1QkFBdUIsR0FBWSx5QkFBeUIsSUFBSSxDQUFDLGNBQUcsQ0FBQyxVQUFVLENBQUM7QUFFdEYsTUFBTSxHQUFHLEdBQVksbUJBQVMsRUFBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRXRELE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxJQUFtQixFQUFFO0lBRWxELEdBQUcsQ0FBQyxpR0FBaUcsQ0FBQyxDQUFDO0lBRXZHLE1BQU0sb0JBQW9CLEdBQVcsNENBQTRDLENBQUM7SUFDbEYsTUFBTSxZQUFZLEdBQXdCLG1DQUFrQixHQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBdUIsRUFBVyxFQUFFO1FBRXJHLE9BQU8sK0JBQWMsRUFBQyxjQUFjLENBQUMsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksWUFBWSxLQUFLLFNBQVMsRUFDOUIsQ0FBQztRQUNHLGlEQUFpRDtRQUNqRCxHQUFHLENBQUMsS0FBSyxDQUFDLHNHQUFzRyxDQUFDLENBQUM7UUFDbEgsT0FBTztJQUNYLENBQUM7SUFFRCxNQUFNLFlBQVks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Y0FBYyxHQUFHLEVBQUUsQ0FBQztBQUN4QixDQUFDLENBQUM7QUFIVyx5QkFBaUIscUJBRzVCO0FBRUYsNEJBQTRCO0FBQ3JCLE1BQU0sUUFBUSxHQUFHLEdBQVMsRUFBRTtJQUUvQixJQUFJLENBQUMsY0FBYyxFQUNuQixDQUFDO1FBQ0csT0FBTztJQUNYLENBQUM7SUFFRCxJQUFJLCtCQUFjLEVBQUMsaUNBQWdCLEdBQUUsQ0FBQyxLQUFLLHVCQUF1QixJQUFJLGFBQWEsRUFDbkYsQ0FBQztRQUNHLFlBQVksR0FBRyxpQ0FBZ0IsR0FBRSxDQUFDO1FBRWxDLE1BQU0sT0FBTyxHQUFZLHdCQUFhLEVBQUMsaUNBQWdCLEdBQUUsQ0FBQyxDQUFDO1FBQzNELE1BQU0sZUFBZSxHQUNyQjtZQUNJLEtBQUssRUFBRSxFQUFFO1lBQ1QsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFO1NBQ3JCLENBQUM7UUFFRiwyQ0FBMkM7UUFFM0Msd0JBQVksRUFBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELDBCQUFjLEVBQUMsaUNBQWdCLEVBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUUvQyxHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDbEMsR0FBRyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLHdEQUF3RDtJQUM1RCxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBM0JXLGdCQUFRLFlBMkJuQjs7Ozs7Ozs7Ozs7O0FDaExGOzs7OztHQUtHOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsbUhBQWdDO0FBQ2hDLHlGQUF5RiIsInNvdXJjZXMiOlsid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvRGV2U2V0dGluZ3MuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9EZXZlbG9wbWVudC9Mb2cvTG9nLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvTG9nL2luZGV4LnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvU2V0dXBQcmltYXJ5TW9uaXRvci50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0RldmVsb3BtZW50L1Rlc3RXaW5kb3dzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9FdmVudC9Db21tb25FdmVudHMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9FdmVudC9EaXNwYXRjaGVyLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRXZlbnQvRGlzcGF0Y2hlci50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0V2ZW50L0V2ZW50LlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRXZlbnQvRXZlbnQudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9FdmVudC9Ob2RlSXBjLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRXZlbnQvTm9kZUlwYy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0V2ZW50L2luZGV4LnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vSW5pdGlhbGl6ZS9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01vbml0b3IudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9TZXR0aW5ncy9Jbml0aWFsaXplU2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9TZXR0aW5ncy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1NldHRpbmdzL2luZGV4LnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vU3RvcmUudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9UcmVlL0xvZy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1RyZWUvVHJlZS50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1RyZWUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9VdGlsaXR5L1V0aWxpdHkuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9VdGlsaXR5L1V0aWxpdHkudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9VdGlsaXR5L2luZGV4LnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vV2luZG93L092ZXJsYXkvT3ZlcmxheVdpbmRvdy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL1dpbmRvdy9PdmVybGF5L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgICAgICBEZXZTZXR0aW5ncy5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkxvZ1NldHRpbmdzLCBGUGFuZWxEaXJlY3Rpb24gfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgdHlwZSB7IEZCb3ggfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuXG5leHBvcnQgdHlwZSBGRHVtbXlQYW5lbCA9XG57XG4gICAgLyoqXG4gICAgICogRm9yIHRoZSByb290IHBhbmVsLCB0aGlzIGlzIHRoZSBpbmRleCBvZiB0aGUgbW9uaXRvciBpbiB3aGljaCB0aGlzIHBhbmVsIHNob3VsZCBsaXZlLlxuICAgICAqIE90aGVyd2lzZSwgaXQgaXMgdGhlIGluZGV4IG9mIHRoaXMgcGFuZWwgaW4gaXRzIHBhcmVudCBwYW5lbC5cbiAgICAgKi9cbiAgICBJbmRleDogbnVtYmVyO1xuICAgIERpcmVjdGlvbjogRlBhbmVsRGlyZWN0aW9uO1xuICAgIE51bUNoaWxkcmVuOiBudW1iZXI7XG4gICAgUGFuZWxzPzogQXJyYXk8RkR1bW15UGFuZWw+O1xufTtcblxuZXhwb3J0IHR5cGUgRkR1bW15RmxvYXRpbmdXaW5kb3cgPVxuICAgIFBpY2s8RkR1bW15UGFuZWwsIFwiSW5kZXhcIj4gJlxuICAgIHtcbiAgICAgICAgTnVtV2luZG93czogbnVtYmVyO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZEdW1teUNvbmZpZ3VyYXRpb24gPVxuICAgIEZEdW1teVBhbmVsICZcbiAgICB7XG4gICAgICAgIERpcmVjdGlvbjogRlBhbmVsRGlyZWN0aW9uO1xuICAgICAgICBGbG9hdGluZ1dpbmRvd3M/OiBBcnJheTxGRHVtbXlGbG9hdGluZ1dpbmRvdz47XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRkR1bW15Q29uZmlndXJhdGlvblNjaGVtYSA9XG57XG4gICAgQ29uZmlndXJhdGlvbnM6IEFycmF5PEZEdW1teUNvbmZpZ3VyYXRpb24+O1xufTtcblxuZXhwb3J0IHR5cGUgRkR1bW15Q29uZmlndXJhdGlvblBhdGggPSBgLi9EdW1teS4keyBzdHJpbmcgfS5qc29uYDtcblxuZXhwb3J0IHR5cGUgRkRldlNldHRpbmdzID0gUmVhZG9ubHk8e1xuICAgIExvZzogRkxvZ1NldHRpbmdzO1xuICAgIFNldHRpbmdzV2luZG93OlxuICAgIHtcbiAgICAgICAgU2hvd09uTGF1bmNoOlxuICAgICAgICB7XG4gICAgICAgICAgICBFbmFibGVkOiBib29sZWFuO1xuICAgICAgICAgICAgUG9zaXRpb246IEZCb3g7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBTdGF0aWNNb2RlOlxuICAgIHtcbiAgICAgICAgRW5hYmxlZDogYm9vbGVhbjtcbiAgICAgICAgV2luZG93U2hhcGU6IEZCb3g7XG4gICAgfTtcbiAgICAvKiogU3Bhd24gd2luZG93cyBvZiB2YXJpb3VzIHNpemVzIGF0IGxhdW5jaC4gKi9cbiAgICBDcmVhdGVEdW1teVdpbmRvd3M6XG4gICAge1xuICAgICAgICBFbmFibGVkOiBib29sZWFuO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQYXRoIHRvIHRoZSBKU09OIGZpbGUgb2YgdGhlIGNvbmZpZ3VyYXRpb24gdGhhdCBzaG91bGQgYmUgdXNlZCxcbiAgICAgICAgICogcmVsYXRpdmUgdG8gdGhlIGBBcHBsaWNhdGlvbmAgZGlyZWN0b3J5LlxuICAgICAgICAgKi9cbiAgICAgICAgQ29uZmlndXJhdGlvblBhdGg6IEZEdW1teUNvbmZpZ3VyYXRpb25QYXRoO1xuICAgIH07XG59PjtcbiIsIi8qKlxuICogQGZpbGUgICAgICBMb2cuVHlwZXMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBGTG9nSGFuZGxlciA9IChTdGF0ZW1lbnQ6IHVua25vd24sIFN0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPikgPT4gdW5rbm93bjtcblxuZXhwb3J0IHR5cGUgRlNob3J0VGltZXN0YW1wID0gYCR7IHN0cmluZyB9OiR7IHN0cmluZyB9LiR7IHN0cmluZyB9YDtcbiIsIi8qKlxuICogQGZpbGUgICAgICBpbmRleC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCB7IEdldExvZ2dlciwgTG9nRnJvbnRlbmQgfSBmcm9tIFwiLi9Mb2dcIjtcbmV4cG9ydCB7IEZvcm1hdCB9IGZyb20gXCIuL0xvZ0Zvcm1hdFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vTG9nLlR5cGVzXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgU2V0dXBQcmltYXJ5TW9uaXRvci50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICogQ29tbWVudDogICBJZiBlbmFibGVkLCB0aGVuIG1vdmUgVlMgQ29kZSB0byB0aGUgc21hbGwgbW9uaXRvcixcbiAqICAgICAgICAgICAgYW5kIGNyZWF0ZSBhIHNldCBvZiBkdW1teSB3aW5kb3dzIHRvIHVzZSBmb3IgdGVzdGluZy5cbiAqICAgICAgICAgICAgVGhpcyBhc3N1bWVzIG15IHBlcnNvbmFsIGRlc2t0b3Agc2V0dXAgKHRoYXQgaXMsIG15XG4gKiAgICAgICAgICAgIG1vbml0b3JzKS5cbiAqL1xuXG5pbXBvcnQgeyBCcmluZ0ludG9QYW5lbCwgR2V0Rm9yZXN0IH0gZnJvbSBcIiMvVHJlZVwiO1xuaW1wb3J0IHtcbiAgICBDbG9zZUFwcGxpY2F0aW9uLFxuICAgIHR5cGUgRk1vbml0b3JJbmZvLFxuICAgIEdldE1vbml0b3JGcm9tV2luZG93LFxuICAgIEdldE1vbml0b3JzLFxuICAgIEdldFRpbGVhYmxlV2luZG93cyxcbiAgICBHZXRXaW5kb3dUaXRsZSxcbiAgICB0eXBlIEhXaW5kb3csXG4gICAgTWluaW1pemVXaW5kb3csXG4gICAgUmVzdG9yZVdpbmRvdyxcbiAgICBTZXRXaW5kb3dQb3NpdGlvbiB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5pbXBvcnQge1xuICAgIHR5cGUgU3Bhd25PcHRpb25zLFxuICAgIHNwYXduIGFzIFNwYXduUHJvY2VzcyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBBcmVIYW5kbGVzRXF1YWwgfSBmcm9tIFwiIy9VdGlsaXR5XCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dnZXIsIEZQYW5lbCB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IEdldExvZ2dlciB9IGZyb20gXCIuL0xvZ1wiO1xuaW1wb3J0IHsgYXBwIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5cbi8qKiBFbmFibGUvZGlzYWJsZSB0aGUgYmVoYXZpb3IgYnkgc2V0dGluZyB0aGUgdmFsdWUgb2YgdGhpcyB2YXJpYWJsZS4gKi9cbmNvbnN0IFNob3VsZFNldFVwUHJpbWFyeU1vbml0b3I6IGJvb2xlYW4gPSBmYWxzZTtcblxuY29uc3QgV2lsbFNldFVwUHJpbWFyeU1vbml0b3I6IGJvb2xlYW4gPSBTaG91bGRTZXRVcFByaW1hcnlNb25pdG9yICYmICFhcHAuaXNQYWNrYWdlZDtcblxuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiU2V0dXBQcmltYXJ5TW9uaXRvclwiKTtcblxuY29uc3QgU2V0VXBQcmltYXJ5TW9uaXRvciA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgTG9nKFwiUG9wdWxhdGluZyB0aGUgbWFpbiBtb25pdG9yIHdpdGggdGVzdCB3aW5kb3dzIGJlY2F1c2UgU2hvdWxkU2V0VXBQcmltYXJ5TW9uaXRvciBpcyBzZXQgdG8gdHJ1ZS5cIik7XG5cbiAgICBjb25zdCBWc0NvZGVXaW5kb3dOYW1lUGFydDogc3RyaW5nID0gXCJTb3JyZWxsV20gKFdvcmtzcGFjZSkgLSBWaXN1YWwgU3R1ZGlvIENvZGVcIjtcbiAgICBjb25zdCBWc0NvZGVXaW5kb3c6IEhXaW5kb3cgfCB1bmRlZmluZWQgPSBHZXRUaWxlYWJsZVdpbmRvd3MoKS5maW5kKChUaWxlYWJsZVdpbmRvdzogSFdpbmRvdyk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIHJldHVybiBHZXRXaW5kb3dUaXRsZShUaWxlYWJsZVdpbmRvdykuaW5jbHVkZXMoVnNDb2RlV2luZG93TmFtZVBhcnQpO1xuICAgIH0pO1xuXG4gICAgaWYgKFZzQ29kZVdpbmRvdyA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICBMb2cuRXJyb3IoXCJDb3VsZCBub3QgcG9wdWxhdGUgdGhlIG1haW4gbW9uaXRvciB3aXRoIHRlc3Qgd2luZG93cyBiZWNhdXNlIHRoZSBWUyBDb2RlIHdpbmRvdyBjb3VsZCBub3QgYmUgZm91bmQuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgTW9uaXRvcnNJbmZvOiBUQXJyYXk8Rk1vbml0b3JJbmZvPiA9IEdldE1vbml0b3JzKCk7XG4gICAgY29uc3QgU21hbGxNb25pdG9ySW5mbzogRk1vbml0b3JJbmZvIHwgdW5kZWZpbmVkID1cbiAgICAgICAgTW9uaXRvcnNJbmZvLmZpbmQoKE1vbml0b3JJbmZvOiBGTW9uaXRvckluZm8pOiBib29sZWFuID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgTW9uaXRvckluZm8uSXNQcmltYXJ5ICYmXG4gICAgICAgICAgICAgICAgTW9uaXRvckluZm8uU2l6ZS5XaWR0aCA9PT0gMTkyMCAmJlxuICAgICAgICAgICAgICAgIE1vbml0b3JJbmZvLlNpemUuSGVpZ2h0ID09PSAxMDgwXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIGNvbnN0IE1haW5Nb25pdG9ySW5mbzogRk1vbml0b3JJbmZvIHwgdW5kZWZpbmVkID1cbiAgICAgICAgTW9uaXRvcnNJbmZvLmZpbmQoKE1vbml0b3JJbmZvOiBGTW9uaXRvckluZm8pOiBib29sZWFuID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgTW9uaXRvckluZm8uU2l6ZS5XaWR0aCA9PT0gMzQ0MCAmJlxuICAgICAgICAgICAgICAgIE1vbml0b3JJbmZvLlNpemUuSGVpZ2h0ID09PSAxNDQwXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIGlmIChTbWFsbE1vbml0b3JJbmZvID09PSB1bmRlZmluZWQgfHwgTWFpbk1vbml0b3JJbmZvID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgIExvZy5FcnJvcihcIkNvdWxkIG5vdCBwb3B1bGF0ZSB0aGUgbWFpbiBtb25pdG9yIHdpdGggdGVzdCB3aW5kb3dzIGJlY2F1c2UgdGhlIG5lY2Vzc2FyeSBtb25pdG9ycyBjb3VsZCBub3QgYmUgaWRlbnRpZmllZC5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBNb3ZlVnNDb2RlV2luZG93ID0gKCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIFJlc3RvcmVXaW5kb3coVnNDb2RlV2luZG93KTtcbiAgICAgICAgU2V0V2luZG93UG9zaXRpb24oVnNDb2RlV2luZG93LCBTbWFsbE1vbml0b3JJbmZvLldvcmtTaXplKTtcbiAgICB9O1xuXG4gICAgY29uc3QgTWFpbk1vbml0b3JXaW5kb3dzOiBUQXJyYXk8SFdpbmRvdz4gPSBHZXRUaWxlYWJsZVdpbmRvd3MoKS5maWx0ZXIoKFdpbmRvdzogSFdpbmRvdyk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBBcmVIYW5kbGVzRXF1YWwoR2V0TW9uaXRvckZyb21XaW5kb3coV2luZG93KSwgTWFpbk1vbml0b3JJbmZvLkhhbmRsZSkgJiZcbiAgICAgICAgICAgICFBcmVIYW5kbGVzRXF1YWwoV2luZG93LCBWc0NvZGVXaW5kb3cpXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBNaW5pbWl6ZU1haW5XaW5kb3dzID0gKCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIE1haW5Nb25pdG9yV2luZG93cy5mb3JFYWNoKE1pbmltaXplV2luZG93KTtcbiAgICB9O1xuXG4gICAgY29uc3QgUmVzdG9yZU1haW5XaW5kb3dzID0gKCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIE1haW5Nb25pdG9yV2luZG93cy5mb3JFYWNoKFJlc3RvcmVXaW5kb3cpO1xuICAgIH07XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgY29uc3QgUGFpbnRFeGVjdXRhYmxlUGF0aDogc3RyaW5nID0gXCJDOlxcXFxQcm9ncmFtIEZpbGVzXFxcXFdpbmRvd3NBcHBzXFxcXE1pY3Jvc29mdC5QYWludF8xMS4yNTExLjI5MS4wX3g2NF9fOHdla3liM2Q4YmJ3ZVxcXFxQYWludEFwcFxcXFxtc3BhaW50LmV4ZVwiO1xuICAgIGNvbnN0IFBhaW50UHJvY2Vzc0lkZW50aWZpZXJzOiBTZXQ8bnVtYmVyPiA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuXG4gICAgY29uc3QgTGF1bmNoUGFpbnQgPSAoKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgT3B0aW9uczogU3Bhd25PcHRpb25zID0ge1xuICAgICAgICAgICAgZGV0YWNoZWQ6IHRydWUsXG4gICAgICAgICAgICBzdGRpbzogXCJpZ25vcmVcIixcbiAgICAgICAgICAgIHdpbmRvd3NIaWRlOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IFByb2Nlc3NJZGVudGlmaWVyOiBudW1iZXIgfCB1bmRlZmluZWQgPSBTcGF3blByb2Nlc3MoUGFpbnRFeGVjdXRhYmxlUGF0aCwgWyBdLCBPcHRpb25zKS5waWQ7XG4gICAgICAgIGlmIChQcm9jZXNzSWRlbnRpZmllciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBQYWludFByb2Nlc3NJZGVudGlmaWVycy5hZGQoUHJvY2Vzc0lkZW50aWZpZXIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IExhdW5jaFBhaW50SW5zdGFuY2VzID0gKCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE51bVdpbmRvd3M6IG51bWJlciA9IDM7XG4gICAgICAgIEFycmF5LmZyb20oQXJyYXkoTnVtV2luZG93cykua2V5cygpKS5mb3JFYWNoKExhdW5jaFBhaW50KTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElzUGFpbnRXaW5kb3cgPSAoV2luZG93OiBIV2luZG93KTogYm9vbGVhbiA9PiBHZXRXaW5kb3dUaXRsZShXaW5kb3cpLmluY2x1ZGVzKFwiUGFpbnRcIik7XG4gICAgICAgICAgICBjb25zdCBCcmluZ1BhaW50V2luZG93SW50b1Jvb3RQYW5lbCA9IChQYWludFdpbmRvdzogSFdpbmRvdyk6IHZvaWQgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBNYWluTW9uaXRvclJvb3RQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgICAgICAgICAgR2V0Rm9yZXN0KCkuZmluZCgoUGFuZWw6IEZQYW5lbCk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFBhbmVsLk1vbml0b3JJZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBBcmVIYW5kbGVzRXF1YWwoUGFuZWwuTW9uaXRvcklkLCBNYWluTW9uaXRvckluZm8uSGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChNYWluTW9uaXRvclJvb3RQYW5lbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQFRPRE9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIEJyaW5nSW50b1BhbmVsKE1haW5Nb25pdG9yUm9vdFBhbmVsLCBQYWludFdpbmRvdyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBHZXRUaWxlYWJsZVdpbmRvd3MoKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoSXNQYWludFdpbmRvdylcbiAgICAgICAgICAgICAgICAuZm9yRWFjaChCcmluZ1BhaW50V2luZG93SW50b1Jvb3RQYW5lbCk7XG4gICAgICAgIH0sIDMwMDApO1xuICAgIH07XG5cbiAgICBjb25zdCBDbG9zZVBhaW50SW5zdGFuY2VzID0gKCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIFBhaW50UHJvY2Vzc0lkZW50aWZpZXJzLmZvckVhY2goKFByb2Nlc3NJZGVudGlmaWVyOiBudW1iZXIpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIENsb3NlQXBwbGljYXRpb24oUHJvY2Vzc0lkZW50aWZpZXIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgUmVzdG9yZVZzQ29kZSA9ICgpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBTZXRXaW5kb3dQb3NpdGlvbihWc0NvZGVXaW5kb3csIE1haW5Nb25pdG9ySW5mby5Xb3JrU2l6ZSk7XG4gICAgfTtcblxuICAgIGNvbnN0IE9uQXBwRXhpdCA9ICguLi5fQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBDbG9zZVBhaW50SW5zdGFuY2VzKCk7XG4gICAgICAgIFJlc3RvcmVWc0NvZGUoKTtcbiAgICAgICAgUmVzdG9yZU1haW5XaW5kb3dzKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IFByb2Nlc3NFbmRFdmVudE5hbWVzOiBUQXJyYXk8c3RyaW5nPiA9XG4gICAgW1xuICAgICAgICBcIlNJR0lOVFwiLFxuICAgICAgICBcIlNJR1RFUk1cIlxuICAgICAgICAvLyBcInVuY2F1Z2h0RXhjZXB0aW9uXCIsXG4gICAgICAgIC8vIFwidW5oYW5kbGVkUmVqZWN0aW9uXCJcbiAgICBdO1xuXG4gICAgUHJvY2Vzc0VuZEV2ZW50TmFtZXMuZm9yRWFjaCgoRXZlbnROYW1lOiBzdHJpbmcpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBwcm9jZXNzLm9uKEV2ZW50TmFtZSwgT25BcHBFeGl0KTtcbiAgICB9KTtcblxuICAgIE1pbmltaXplTWFpbldpbmRvd3MoKTtcbiAgICBNb3ZlVnNDb2RlV2luZG93KCk7XG5cbiAgICBMYXVuY2hQYWludEluc3RhbmNlcygpO1xufTtcblxuaWYgKFdpbGxTZXRVcFByaW1hcnlNb25pdG9yKVxue1xuICAgIFNldFVwUHJpbWFyeU1vbml0b3IoKTtcbn1cblxuLyoqIER1bW15IHZhcmlhYmxlIHNvIHRoYXQgc29tZXRoaW5nIGlzIGV4cG9ydGVkLCBhbmQgdGhlcmVmb3JlIHRoaXMgZmlsZSBiZWNvbWVzIGEgbW9kdWxlLiAqL1xuZXhwb3J0IGNvbnN0IFNldHVwUHJpbWFyeU1vbml0b3JEdW1teVZhcmlhYmxlOiB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgVGVzdFdpbmRvd3MudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBCcmluZ0ludG9QYW5lbCwgRmluZCwgSXNQYW5lbCB9IGZyb20gXCIjL1RyZWVcIjtcbmltcG9ydCB0eXBlIHsgRlBhbmVsLCBGVmVydGV4IH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgR2V0Tm90ZXBhZEhhbmRsZXMsIEdldFdpbmRvd0J5TmFtZSwgdHlwZSBIV2luZG93LCBLaWxsTm90ZXBhZEluc3RhbmNlcyB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5pbXBvcnQgeyB0eXBlIEJyb3dzZXJXaW5kb3cgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCB7IFNsZWVwIH0gZnJvbSBcIiMvVXRpbGl0eVwiO1xuaW1wb3J0IHsgc3Bhd24gfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuXG5jb25zdCBDcmVhdGVUZXN0V2luZG93ID0gYXN5bmMgKF9JbmRleDogbnVtYmVyKTogUHJvbWlzZTxCcm93c2VyV2luZG93PiA9Plxue1xuICAgIHJldHVybiB7IH0gYXMgQnJvd3NlcldpbmRvdztcbiAgICAvLyBjb25zdCB7IFdpbmRvdzogVGVzdFdpbmRvdywgTG9hZEZyb250ZW5kIH0gPSBhd2FpdCBGb29NeUZ1bmN0aW9uKHtcbiAgICAvLyAgICAgYXV0b0hpZGVNZW51QmFyOiB0cnVlLFxuICAgIC8vICAgICBzaG93OiB0cnVlLFxuICAgIC8vICAgICB0aXRsZTogYFRlc3QgV2luZG93ICMkeyBJbmRleCArIDEgfWBcbiAgICAvLyB9KTtcblxuICAgIC8vIFRlc3RXaW5kb3cuc2V0TWVudShudWxsKTtcblxuICAgIC8vIGlwY01haW4ub24oXCJSZWFkeUZvclJvdXRlXCIsIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50KTogdm9pZCA9PlxuICAgIC8vIHtcbiAgICAvLyAgICAgVGVzdFdpbmRvdy53ZWJDb250ZW50cy5zZW5kKFwiTmF2aWdhdGVcIiwgXCJUZXN0V2luZG93XCIpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYXdhaXQgTG9hZEZyb250ZW5kKCk7XG5cbiAgICAvLyBUZXN0V2luZG93Lm9uKFxuICAgIC8vICAgICBcInBhZ2UtdGl0bGUtdXBkYXRlZFwiLFxuICAgIC8vICAgICAoRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfVGl0bGU6IHN0cmluZywgX0V4cGxpY2l0U2V0OiBib29sZWFuKTogdm9pZCA9PlxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICBFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIC8vICAgICB9XG4gICAgLy8gKTtcblxuICAgIC8vIHJldHVybiBUZXN0V2luZG93O1xufTtcblxuZXhwb3J0IGNvbnN0IENyZWF0ZU5vdGVwYWRUZXN0V2luZG93cyA9IGFzeW5jIChfTnVtV2luZG93czogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIEtpbGxOb3RlcGFkSW5zdGFuY2VzKCk7XG4gICAgYXdhaXQgU2xlZXAoMjAwMCk7XG5cbiAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCA0OyBJbmRleCsrKVxuICAgIHtcbiAgICAgICAgc3Bhd24oXCJDOlxcXFxXaW5kb3dzXFxcXFN5c3RlbTMyXFxcXG5vdGVwYWQuZXhlXCIpO1xuICAgIH1cblxuICAgIGF3YWl0IFNsZWVwKDMwMDApO1xuXG4gICAgY29uc3QgTm90ZXBhZEhhbmRsZXM6IFRBcnJheTxIV2luZG93PiA9IEdldE5vdGVwYWRIYW5kbGVzKCk7XG5cbiAgICBjb25zdCBSaWdodE1vbml0b3I6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEZpbmQoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChJc1BhbmVsKFZlcnRleCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJ0ZXguU2l6ZS5YID09PSAyNzM4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSkgYXMgRlBhbmVsIHwgdW5kZWZpbmVkO1xuXG4gICAgaWYgKFJpZ2h0TW9uaXRvciAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgTm90ZXBhZEhhbmRsZXMuZm9yRWFjaCgoSGFuZGxlOiBIV2luZG93KTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBCcmluZ0ludG9QYW5lbChSaWdodE1vbml0b3IsIEhhbmRsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBDcmVhdGVUZXN0V2luZG93cyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgY29uc3QgVGVzdFdpbmRvd3M6IFRBcnJheTxCcm93c2VyV2luZG93PiA9IFsgXTtcbiAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCAzOyBJbmRleCsrKVxuICAgIHtcbiAgICAgICAgVGVzdFdpbmRvd3MucHVzaChhd2FpdCBDcmVhdGVUZXN0V2luZG93KEluZGV4KSk7XG4gICAgfVxuXG4gICAgY29uc3QgUmlnaHRNb25pdG9yOiBGUGFuZWwgfCB1bmRlZmluZWQgPSBGaW5kKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoSXNQYW5lbChWZXJ0ZXgpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gVmVydGV4LlNpemUuWCA9PT0gMjczODtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pIGFzIEZQYW5lbCB8IHVuZGVmaW5lZDtcbiAgICBpZiAoUmlnaHRNb25pdG9yICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBUZXN0V2luZG93cy5mb3JFYWNoKChUZXN0V2luZG93OiBCcm93c2VyV2luZG93KTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBXaW5kb3dUaXRsZTogc3RyaW5nID0gVGVzdFdpbmRvdy5nZXRUaXRsZSgpO1xuICAgICAgICAgICAgY29uc3QgSGFuZGxlOiBIV2luZG93IHwgdW5kZWZpbmVkID0gR2V0V2luZG93QnlOYW1lKFdpbmRvd1RpdGxlKTtcbiAgICAgICAgICAgIGlmIChIYW5kbGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBCcmluZ0ludG9QYW5lbChSaWdodE1vbml0b3IsIEhhbmRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgaW5kZXgudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9EZXZTZXR0aW5nc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vRGV2U2V0dGluZ3MuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0xvZ1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vU2V0dXBQcmltYXJ5TW9uaXRvclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vVGVzdFdpbmRvd3NcIjtcbiIsIi8qKlxuICogQGZpbGUgICAgICBDb21tb25FdmVudHMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZMb2dnZXIsIEZTZXR0aW5ncywgRlN0b3JlIH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgR2V0SXNMaWdodE1vZGUsIEdldFRoZW1lQ29sb3IgfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuaW1wb3J0IHsgR2V0U3RvcmUsIFNldFN0b3JlIH0gZnJvbSBcIiMvU3RvcmVcIjtcbmltcG9ydCB7IFBvb3JFdmVudFN1Y2Nlc3MsIFJlZ2lzdGVySXBjQ2FsbGJhY2tzIH0gZnJvbSBcIi5cIjtcbmltcG9ydCB0eXBlIHsgQnJvd3NlcldpbmRvdyB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgR2V0TG9nZ2VyIH0gZnJvbSBcIiMvRGV2ZWxvcG1lbnRcIjtcbmltcG9ydCB7IEdldFNldHRpbmdzIH0gZnJvbSBcIiMvU2V0dGluZ3NcIjtcbmltcG9ydCB0eXBlIHsgVElwY0NhbGxiYWNrIH0gZnJvbSBcIi4vRXZlbnQuVHlwZXNcIjtcblxuLy8gQFRPRE8gVGVtcG9yYXJ5LlxudHlwZSBURXZlbnRDYWxsYmFjazxUeXBlPiA9ICguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiBQcm9taXNlPGFueT47XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIkNvbW1vbkV2ZW50c1wiKTtcblxuZXhwb3J0IGNvbnN0IFJlZ2lzdGVyQ29tbW9uSXBjQ2FsbGJhY2tzID0gKFdpbmRvdzogQnJvd3NlcldpbmRvdyk6IHZvaWQgPT5cbntcbiAgICBjb25zdCBDb21tb25JcGNDYWxsYmFja3M6IEFycmF5PFRJcGNDYWxsYmFjaz4gPVxuICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jICgpOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiR2V0VGhlbWVDb2xvclwiPj4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIExvZyhgR2V0VGhlbWVDb2xvciB3YXMgcmVjZWl2ZWQgYnkgTWFpbiB3aXRoIElkID09ICR7IFdpbmRvdy5pZCB9LmApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgVGhlbWVDb2xvcjogR2V0VGhlbWVDb2xvcigpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDaGFubmVsOiBcIkdldFRoZW1lQ29sb3JcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKCk6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJOb3RpZnlSZWFkeVwiPj4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQb29yRXZlbnRTdWNjZXNzKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDaGFubmVsOiBcIk5vdGlmeVJlYWR5XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jICgpOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiR2V0SXNMaWdodE1vZGVcIj4+ID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgSXNMaWdodE1vZGU6IEdldElzTGlnaHRNb2RlKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0SXNMaWdodE1vZGVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDYWxsYmFjazogYXN5bmMgKCk6IFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8XCJHZXRTZXR0aW5nc1wiPj4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFNldHRpbmdzOiBGU2V0dGluZ3MgPSBhd2FpdCBHZXRTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YTogU2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDaGFubmVsOiBcIkdldFNldHRpbmdzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jICgpOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPFwiR2V0U2V0dGluZ1wiPj4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhOiB7IFNldHRpbmc6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIENoYW5uZWw6IFwiR2V0U2V0dGluZ1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrOiBhc3luYyAoKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIkdldFN0b3JlXCI+PiA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgRGF0YTogRlN0b3JlID0gYXdhaXQgR2V0U3RvcmUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBFcnJvcjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDaGFubmVsOiBcIkdldFN0b3JlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2s6IGFzeW5jIChJblN0b3JlOiB1bmtub3duKTogUmV0dXJuVHlwZTxURXZlbnRDYWxsYmFjazxcIlNldFN0b3JlXCI+PiA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgTmV3U3RvcmU6IEZTdG9yZSA9IEluU3RvcmUgYXMgRlN0b3JlO1xuICAgICAgICAgICAgICAgICAgICBTZXRTdG9yZShOZXdTdG9yZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQb29yRXZlbnRTdWNjZXNzKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBDaGFubmVsOiBcIlNldFN0b3JlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgIFJlZ2lzdGVySXBjQ2FsbGJhY2tzKFdpbmRvdywgQ29tbW9uSXBjQ2FsbGJhY2tzKTtcbn07XG4iLG51bGwsIi8qKlxuICogQGZpbGUgICAgICBEaXNwYXRjaGVyLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgVFN1YnNjcmlwdGlvbkhhbmRsZTxUeXBlPiA9XG57XG4gICAgU3Vic2NyaWJlKENhbGxiYWNrOiAoKEFyZ3VtZW50OiBUeXBlKSA9PiB2b2lkKSk6IG51bWJlcjtcbiAgICBVbnN1YnNjcmliZShJZDogbnVtYmVyKTogdm9pZDtcbn07XG5cbmV4cG9ydCBjbGFzcyBURGlzcGF0Y2hlcjxUeXBlPlxue1xuICAgIHByaXZhdGUgTmV4dExpc3RlbmVySWQ6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIExpc3RlbmVyczogVE1hcDxudW1iZXIsIChBcmd1bWVudDogVHlwZSkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUeXBlKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIEdldEhhbmRsZSA9ICgpOiBUU3Vic2NyaXB0aW9uSGFuZGxlPFR5cGU+ID0+XG4gICAge1xuICAgICAgICBjb25zdCBTdWJzY3JpYmUgPSAoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFR5cGUpID0+IHZvaWQpKTogbnVtYmVyID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5zZXQoSWQsIENhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiBJZDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBTdWJzY3JpYmUsXG4gICAgICAgICAgICBVbnN1YnNjcmliZVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBwdWJsaWMgRGlzcGF0Y2ggPSAoTWVzc2FnZTogVHlwZSk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmICh0aGlzLkxpc3RlbmVycy5zaXplID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFR5cGUpID0+IHZvaWQpKTogdm9pZCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uICovXG5leHBvcnQgY2xhc3MgVERpc3BhdGNoZXJfREVQUkVDQVRFRDxUeXBlID0gdW5rbm93bj5cbntcbiAgICBwcml2YXRlIE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBMaXN0ZW5lcnM6IFRNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFR5cGUpID0+IHZvaWQ+ID0gbmV3IE1hcDxudW1iZXIsIChBcmd1bWVudDogVHlwZSkgPT4gdm9pZD4oKTtcblxuICAgIHB1YmxpYyBTdWJzY3JpYmUoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFR5cGUpID0+IHZvaWQpKTogbnVtYmVyXG4gICAge1xuICAgICAgICBjb25zdCBJZDogbnVtYmVyID0gdGhpcy5OZXh0TGlzdGVuZXJJZCsrO1xuICAgICAgICB0aGlzLkxpc3RlbmVycy5zZXQoSWQsIENhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuIElkO1xuICAgIH1cblxuICAgIHB1YmxpYyBVbnN1YnNjcmliZShJZDogbnVtYmVyKTogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZGVsZXRlKElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgRGlzcGF0Y2ggPSAoTWVzc2FnZTogVHlwZSk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGlmICh0aGlzLkxpc3RlbmVycy5zaXplID4gMClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5MaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFR5cGUpID0+IHZvaWQpKTogdm9pZCA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENhbGxiYWNrKE1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiLyoqXG4gKiBAZmlsZSAgICAgIEV2ZW50LlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxudHlwZSBGUG9vckJhY2tlbmRFdmVudHMgPSBhbnk7XG50eXBlIEZQb29yUmVzcG9uc2VBc1N1Y2Nlc3MgPSBhbnk7XG50eXBlIFRFdmVudENhbGxiYWNrPFR5cGUgPSB1bmtub3duPiA9ICguLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PiBQcm9taXNlPGFueT47XG50eXBlIFRQb29yUmVzcG9uc2VBc0ZhaWx1cmU8VHlwZT4gPSBhbnk7XG50eXBlIEZJcGNGcm9udGVuZENoYW5uZWwgPSBzdHJpbmc7XG5cbmV4cG9ydCB0eXBlIFRJcGNDYWxsYmFjazxDaGFubmVsVHlwZSBleHRlbmRzIEZJcGNGcm9udGVuZENoYW5uZWwgPSBGSXBjRnJvbnRlbmRDaGFubmVsPiA9XG4gICAge1xuICAgICAgICBDaGFubmVsOiBDaGFubmVsVHlwZTtcbiAgICAgICAgQ2FsbGJhY2s6IFRFdmVudENhbGxiYWNrPENoYW5uZWxUeXBlPjtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBUUG9vckV2ZW50UmVzcG9uc2U8VHlwZSBleHRlbmRzIGtleW9mIEZQb29yQmFja2VuZEV2ZW50cz4gPVxuICAgIHwgRlBvb3JSZXNwb25zZUFzU3VjY2Vzc1xuICAgIHwgVFBvb3JSZXNwb25zZUFzRmFpbHVyZTxUeXBlPjtcbiIsIi8qKlxuICogQGZpbGUgICAgICBFdmVudC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbi8vIEBUT0RPIFRlbXBvcmFyeVxuLyogZXNsaW50LWRpc2FibGUganNkb2MvcmVxdWlyZS1qc2RvYyAqL1xuXG5pbXBvcnQgeyB0eXBlIEJyb3dzZXJXaW5kb3csIHR5cGUgSXBjTWFpbkludm9rZUV2ZW50LCBpcGNNYWluIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgRkxvZ2dlcixcbiAgICBGUmVqZWN0RnVuY3Rpb24sXG4gICAgVFJlc29sdmVGdW5jdGlvblxufSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiIy9EZXZlbG9wbWVudFwiO1xuXG4vLyBAVE9ETyBUZW1wb3JhcnkuXG50eXBlIFRFdmVudENhbGxiYWNrPFR5cGU+ID0gKC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+IFByb21pc2U8YW55PjtcbnR5cGUgVFJlcXVlc3Q8VHlwZT4gPSBhbnk7XG50eXBlIFRSZXNwb25zZTxUeXBlPiA9IGFueTtcbnR5cGUgVEdldEVycm9yQ29kZTxUeXBlPiA9IGFueTtcblxudHlwZSBGUG9vclJlc3BvbnNlQXNTdWNjZXNzID0gYW55O1xudHlwZSBUUG9vclJlc3BvbnNlQXNGYWlsdXJlPFR5cGU+ID0gYW55O1xudHlwZSBGUG9vckJhY2tlbmRFdmVudHMgPSBhbnk7XG50eXBlIFRQb29yRXZlbnRSZXNwb25zZTxUeXBlPiA9IGFueTtcbnR5cGUgRklwY0JhY2tlbmRDaGFubmVsID0gc3RyaW5nO1xudHlwZSBGSXBjRnJvbnRlbmRFdmVudHMgPSBhbnk7XG50eXBlIEZJcGNGcm9udGVuZENoYW5uZWwgPSBzdHJpbmc7XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIkV2ZW50XCIpO1xuXG4vKipcbiAqIFJlZ2lzdGVyIGNhbGxiYWNrcyB0byByZXNwb25kIHRvIGV2ZW50cyByZWNlaXZlZCBmcm9tIHRoZSBSZW5kZXJlci5cbiAqIEFsbCBjYWxscyB0byB0aGlzIHNob3VsZCBiZSBtYWRlIGFzIGVhcmx5IGFzIHBvc3NpYmxlIGluIHRoZSBhcHBsaWNhdGlvbidzXG4gKiBsaWZldGltZS5cbiAqL1xuZXhwb3J0IGNvbnN0IFJlZ2lzdGVySXBjQ2FsbGJhY2sgPSA8Q2hhbm5lbFR5cGUgZXh0ZW5kcyBGSXBjRnJvbnRlbmRDaGFubmVsPihcbiAgICBCcm93c2VyV2luZG93OiBCcm93c2VyV2luZG93LFxuICAgIENoYW5uZWw6IENoYW5uZWxUeXBlLFxuICAgIENhbGxiYWNrOiBURXZlbnRDYWxsYmFjazxDaGFubmVsVHlwZT5cbik6IHZvaWQgPT5cbntcbiAgICAvLyBjb25zdCBDaGFubmVsVGFnZ2VkOiBGRnJvbnRlbmRDaGFubmVsVGFnZ2VkIHwgdW5kZWZpbmVkID0gTWFrZVRhZ0Zyb250ZW5kKEJyb3dzZXJXaW5kb3cuaWQpKENoYW5uZWwpO1xuXG4gICAgLy8gTG9nKGBSZWdpc3RlcklwY0NhbGxiYWNrOiBDaGFubmVsVGFnZ2VkID09ICR7IENoYW5uZWxUYWdnZWQgfWApO1xuXG4gICAgLy8gaWYgKENoYW5uZWxUYWdnZWQgPT09IHVuZGVmaW5lZClcbiAgICAvLyB7XG4gICAgLy8gICAgIHJldHVybjtcbiAgICAvLyB9XG5cbiAgICBpZiAoaXBjTWFpbi5ldmVudE5hbWVzKCkuaW5jbHVkZXMoQ2hhbm5lbCkpXG4gICAge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgIExvZy5XYXJuKGBNYWluIGF0dGVtcHRlZCB0byByZWdpc3RlciBJUEMgY2FsbGJhY2sgZm9yIEV2ZW50ICR7IENoYW5uZWwgfSBvbiB3aW5kb3cgd2l0aCBJRCAkeyBCcm93c2VyV2luZG93LmlkIH0sIGJ1dCBhIGNhbGxiYWNrIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZC5gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFdyYXBwZXIgPSBhc3luYyAoXG4gICAgICAgIEV2ZW50OiBJcGNNYWluSW52b2tlRXZlbnQsXG4gICAgICAgIC4uLkFyZ3VtZW50VmVjdG9yOiBUQXJyYXk8dW5rbm93bj5cbiAgICApOiBSZXR1cm5UeXBlPFRFdmVudENhbGxiYWNrPENoYW5uZWxUeXBlPj4gPT5cbiAgICB7XG4gICAgICAgIHR5cGUgRlJlcXVlc3QgPSBGSXBjRnJvbnRlbmRFdmVudHNbQ2hhbm5lbFR5cGVdW1wiUmVxdWVzdFwiXTtcbiAgICAgICAgLy8gdHlwZSBGUmVzcG9uc2UgPSBGSXBjRnJvbnRlbmRFdmVudHNbVF1bXCJSZXNwb25zZVwiXTtcbiAgICAgICAgdHlwZSBGUmVzcG9uc2UgPSBBd2FpdGVkPFJldHVyblR5cGU8VEV2ZW50Q2FsbGJhY2s8Q2hhbm5lbFR5cGU+Pj47XG4gICAgICAgIGNvbnN0IFJlcXVlc3Q6IEZSZXF1ZXN0ID0gQXJndW1lbnRWZWN0b3JbMF0gYXMgRlJlcXVlc3Q7XG4gICAgICAgIHJldHVybiBDYWxsYmFjayhSZXF1ZXN0KSBhcyBGUmVzcG9uc2U7XG5cbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAvLyBMb2coYFJlc3BvbnNlIGluc2lkZSBXcmFwcGVyIGlzIGdvaW5nIHRvIGJlIHNlbnQgdG8gdGhlIEJyb3dzZXJXaW5kb3cuICBUaGUgUmVzcG9uc2UgaXMgJHsgUmVzcG9uc2UgfS5gKTtcblxuICAgICAgICAvLyBCcm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoQ2hhbm5lbFRhZ2dlZCwgUmVzcG9uc2UpO1xuICAgIH07XG5cbiAgICBpcGNNYWluLmhhbmRsZShDaGFubmVsLCBXcmFwcGVyKTtcbn07XG5cbmV4cG9ydCBjb25zdCBSZWdpc3RlcklwY0NhbGxiYWNrcyA9IChcbiAgICBCcm93c2VyV2luZG93OiBCcm93c2VyV2luZG93LFxuICAgIElwY0NhbGxiYWNrczogQXJyYXk8YW55PiB8IFJlYWRvbmx5PEFycmF5PGFueT4+XG4pOiB2b2lkID0+XG57XG4gICAgY29uc3QgUmVnaXN0ZXIgPSAoeyBDYWxsYmFjaywgQ2hhbm5lbCB9OiB7IENhbGxiYWNrOiBhbnk7IENoYW5uZWw6IGFueTsgfSk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIFJlZ2lzdGVySXBjQ2FsbGJhY2soQnJvd3NlcldpbmRvdywgQ2hhbm5lbCwgQ2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBJcGNDYWxsYmFja3MuZm9yRWFjaChSZWdpc3Rlcik7XG59O1xuXG4vKiogU2VuZCBhbiBldmVudCB0byB0aGUgUmVuZGVyZXIsIGFuZCByZWNlaXZlIGEgcmVzcG9uc2UuICovXG5leHBvcnQgY29uc3QgU2VuZElwY0V2ZW50ID0gPENoYW5uZWxUeXBlIGV4dGVuZHMgRklwY0JhY2tlbmRDaGFubmVsPihcbiAgICBCcm93c2VyV2luZG93OiBCcm93c2VyV2luZG93LFxuICAgIENoYW5uZWw6IENoYW5uZWxUeXBlLFxuICAgIF9SZXF1ZXN0OiBUUmVxdWVzdDxDaGFubmVsVHlwZT5cbik6IFByb21pc2U8VFJlc3BvbnNlPENoYW5uZWxUeXBlPj4gPT5cbntcbiAgICByZXR1cm4gbmV3IFByb21pc2U8VFJlc3BvbnNlPENoYW5uZWxUeXBlPj4oXG4gICAgICAgIChSZXNvbHZlOiBUUmVzb2x2ZUZ1bmN0aW9uPFRSZXNwb25zZTxDaGFubmVsVHlwZT4+LCBSZWplY3Q6IEZSZWplY3RGdW5jdGlvbik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgLy8gY29uc3QgQ2hhbm5lbFRhZ2dlZDogRkNoYW5uZWxUYWdnZWQgfCB1bmRlZmluZWQgPSBNYWtlVGFnQmFja2VuZChCcm93c2VyV2luZG93LmlkKShDaGFubmVsKTtcblxuICAgICAgICAgICAgLy8gTG9nKGBTZW5kSXBjRXZlbnQ6IEF0dGVtcHRpbmcgdG8gZnVsZmlsbCBtZXNzYWdlIGhhdmluZyBjaGFubmVsICR7IENoYW5uZWxUYWdnZWQgfS5gKTtcbiAgICAgICAgICAgIExvZyhgU2VuZElwY0V2ZW50OiBBdHRlbXB0aW5nIHRvIGZ1bGZpbGwgbWVzc2FnZSBoYXZpbmcgY2hhbm5lbCAkeyBDaGFubmVsIH0uYCk7XG5cbiAgICAgICAgICAgIC8vIGlmIChDaGFubmVsVGFnZ2VkID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgUmVqZWN0KFwiQ2hhbm5lbCB3YXMgbm90IHRhZ2dlZC5cIik7XG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IENoYW5uZWxUYWdnZWRTYWZlOiBGQ2hhbm5lbFRhZ2dlZCA9IENoYW5uZWxUYWdnZWQgYXMgRkNoYW5uZWxUYWdnZWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IFJlcXVlc3RJZDogc3RyaW5nID0gY3J5cHRvLnJhbmRvbVVVSUQoKTtcbiAgICAgICAgICAgIGNvbnN0IFJlc3BvbnNlQ2hhbm5lbDogc3RyaW5nID0gYCR7IFJlcXVlc3RJZCB9OlJlc3BvbnNlYDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaGVyZSB0byBwaWNrIHVwOlxuICAgICAgICAgICAgICogICAqIG1haW4gLS0+IHJlbmRlcmVyIC0tPiBtYWluID09PiByZXF1aXJlcyBgV2luZG93LndlYkNvbnRlbnRzLnNlbmRgICphbmQqIHJlZ2lzdGVyaW5nXG4gICAgICAgICAgICAgKiAgICAgYSBjYWxsYmFjayB2aWEgYGlwY01haW4ub25gIHRvIGdldCB0aGUgcmVwbHksIHdpdGggY3VzdG9tIHJlc3BvbnNlIGNoYW5uZWwuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogICAqIHJlbmRlcmVyIC0tPiBtYWluIC0tPiByZW5kZXJlciA9PT4gc2ltcGxlOiB1c2UgYGlwY01haW4uaGFuZGxlYCAod2l0aCByZXR1cm4gdmFsdWUpXG4gICAgICAgICAgICAgKiAgICAgYW5kIGBpcGNSZW5kZXJlci5pbnZva2VgIHdpdGggdGhpcywgdGhlIElkIC8gR2V0SWQgY29kZSBjYW4gYmUgcmVtb3ZlZCwgYW5kIHRoZVxuICAgICAgICAgICAgICogICAgIGBVc2VUYWdnZXJzYCBob29rLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBMaXN0ZW5lciA9IChfRXZlbnQ6IEVsZWN0cm9uLklwY01haW5FdmVudCwgUmVzcG9uc2U6IGFueSk6IHZvaWQgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoUmVzcG9uc2UuUmVxdWVzdElkICE9PSBSZXF1ZXN0SWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXBjTWFpbi5yZW1vdmVMaXN0ZW5lcihSZXNwb25zZUNoYW5uZWwsIExpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChSZXNwb25zZS5FcnJvciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVqZWN0KG5ldyBFcnJvcihSZXNwb25zZS5FcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgUmVzb2x2ZShSZXNwb25zZS5SZXN1bHQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaXBjTWFpbi5vbihSZXNwb25zZUNoYW5uZWwsIExpc3RlbmVyKTtcblxuICAgICAgICAgICAgY29uc3QgUmVxdWVzdDogYW55ID1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFBheWxvYWQ6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgICAgICAgICAgICAgIFJlcXVlc3RJZFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIEJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZChDaGFubmVsLCBSZXF1ZXN0KTtcblxuICAgICAgICAgICAgLy8gQnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5zZW5kKENoYW5uZWwsICk7XG4gICAgICAgICAgICAvLyBpcGNSZW5kZXJlci4gKFxuICAgICAgICAgICAgLy8gICAgIENoYW5uZWwsXG4gICAgICAgICAgICAvLyAgICAgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50VmVjdG9yOiBUQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zdCBSZXNwb25zZTogVFJlc3BvbnNlPENoYW5uZWxUeXBlPiA9IEFyZ3VtZW50VmVjdG9yWzBdIGFzIFRSZXNwb25zZTxDaGFubmVsVHlwZT47XG4gICAgICAgICAgICAvLyAgICAgICAgIFJlc29sdmUoUmVzcG9uc2UpO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICk7XG5cbiAgICAgICAgICAgIC8vIExvZyhgU2VuZElwY0V2ZW50OiAkeyBDaGFubmVsVGFnZ2VkIH0uYCk7XG5cbiAgICAgICAgICAgIC8vIEJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMuc2VuZChDaGFubmVsVGFnZ2VkU2FmZSwgUmVxdWVzdCk7XG4gICAgICAgICAgICAvLyAvLyBCcm93c2VyV2luZG93LndlYkNvbnRlbnRzLnNlbmQoQ2hhbm5lbCwgSlNPTi5zdHJpbmdpZnkoUmVxdWVzdCkpO1xuICAgICAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBQb29yRXZlbnRTdWNjZXNzID0gKCk6IEZQb29yUmVzcG9uc2VBc1N1Y2Nlc3MgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIEVycm9yOiB1bmRlZmluZWRcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IFBvb3JFdmVudEZhaWx1cmUgPSA8VHlwZSBleHRlbmRzIGtleW9mIEZQb29yQmFja2VuZEV2ZW50cz4oXG4gICAgRXJyb3I6IFRHZXRFcnJvckNvZGU8VHlwZT5cbik6IFRQb29yUmVzcG9uc2VBc0ZhaWx1cmU8VHlwZT4gPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBEYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIEVycm9yXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBQb29yRXZlbnRGYWlsdXJlU2ltcGxlID1cbiAgICA8VHlwZSBleHRlbmRzIGtleW9mIEZQb29yQmFja2VuZEV2ZW50cz4oKTogVFBvb3JSZXNwb25zZUFzRmFpbHVyZTxUeXBlPiA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIERhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEVycm9yOiBcIlwiXG4gICAgICAgIH07XG4gICAgfTtcblxuZXhwb3J0IGNvbnN0IEdldFBvb3JSZXNwb25zZSA9IDxUeXBlIGV4dGVuZHMga2V5b2YgRlBvb3JCYWNrZW5kRXZlbnRzPihcbiAgICBTdWNjZXNzOiBib29sZWFuXG4pOiBUUG9vckV2ZW50UmVzcG9uc2U8VHlwZT4gPT5cbntcbiAgICByZXR1cm4gU3VjY2Vzc1xuICAgICAgICA/IFBvb3JFdmVudFN1Y2Nlc3MoKVxuICAgICAgICA6IFBvb3JFdmVudEZhaWx1cmVTaW1wbGUoKTtcbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTm9kZUlwYy5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIEZJcGNDYWxsYmFjayA9ICguLi5EYXRhOiBUQXJyYXk8dW5rbm93bj4pID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQgPVxue1xuICAgIENoYW5uZWw6IHN0cmluZztcbiAgICBDYWxsYmFjazogRklwY0NhbGxiYWNrO1xufTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBOb2RlSXBjLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGSXBjQ2FsbGJhY2ssIEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQgfSBmcm9tIFwiLi9Ob2RlSXBjLlR5cGVzXCI7XG5pbXBvcnQgeyBJbml0aWFsaXplSXBjIH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIuLi9Jbml0aWFsaXplL0luaXRpYWxpemVcIjtcblxubGV0IE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuY29uc3QgTGlzdGVuZXJzOiBUTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4gPSBuZXcgTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4oKTtcblxuZXhwb3J0IGNvbnN0IFN1YnNjcmliZSA9IChDaGFubmVsOiBzdHJpbmcsIENhbGxiYWNrOiBGSXBjQ2FsbGJhY2spOiBudW1iZXIgPT5cbntcbiAgICBjb25zdCBJZDogbnVtYmVyID0gTmV4dExpc3RlbmVySWQrKztcbiAgICBMaXN0ZW5lcnMuc2V0KElkLCB7IENhbGxiYWNrLCBDaGFubmVsIH0pO1xuICAgIHJldHVybiBJZDtcbn07XG5cbmV4cG9ydCBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9Plxue1xuICAgIExpc3RlbmVycy5kZWxldGUoSWQpO1xufTtcblxuZnVuY3Rpb24gT25NZXNzYWdlKENoYW5uZWw6IHN0cmluZywgTWVzc2FnZTogdW5rbm93bilcbntcbiAgICBMaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6IEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ2FsbGJhY2suQ2hhbm5lbCA9PT0gQ2hhbm5lbClcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2suQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuSW5pdGlhbGl6ZUlwYyhPbk1lc3NhZ2UpO1xuXG5hc3luYyBmdW5jdGlvbiBJbml0aWFsaXplTm9kZUlwYygpOiBQcm9taXNlPHZvaWQ+XG57XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5SZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJOb2RlSXBjXCIsIEluaXRpYWxpemVOb2RlSXBjKTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBpbmRleC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0NvbW1vbkV2ZW50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vRGlzcGF0Y2hlclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vRGlzcGF0Y2hlci5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vRXZlbnRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0V2ZW50LlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Ob2RlSXBjXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Ob2RlSXBjLlR5cGVzXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgaW5kZXgudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9Jbml0aWFsaXplXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTW9uaXRvci50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB7IHR5cGUgRk1vbml0b3JJbmZvLCBJbml0aWFsaXplTW9uaXRvcnMgfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuaW1wb3J0IHsgVERpc3BhdGNoZXIsIHR5cGUgVFN1YnNjcmlwdGlvbkhhbmRsZSB9IGZyb20gXCIjL0V2ZW50L0Rpc3BhdGNoZXJcIjtcbmltcG9ydCB7IFJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbiB9IGZyb20gXCIjL0luaXRpYWxpemUvSW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgU3Vic2NyaWJlIH0gZnJvbSBcIiMvRXZlbnQvTm9kZUlwY1wiO1xuXG5jb25zdCBNb25pdG9yczogVEFycmF5PEZNb25pdG9ySW5mbz4gPSBbIF07XG5cbmV4cG9ydCBjb25zdCBHZXRNb25pdG9ycyA9ICgpOiBUQXJyYXk8Rk1vbml0b3JJbmZvPiA9Plxue1xuICAgIHJldHVybiBbIC4uLk1vbml0b3JzIF07XG59O1xuXG5jb25zdCBNb25pdG9yc0Rpc3BhdGNoZXI6IFREaXNwYXRjaGVyPFRBcnJheTxGTW9uaXRvckluZm8+PiA9IG5ldyBURGlzcGF0Y2hlcjxUQXJyYXk8Rk1vbml0b3JJbmZvPj4oKTtcbmV4cG9ydCBjb25zdCBNb25pdG9yc0hhbmRsZTogVFN1YnNjcmlwdGlvbkhhbmRsZTxUQXJyYXk8Rk1vbml0b3JJbmZvPj4gPSBNb25pdG9yc0Rpc3BhdGNoZXIuR2V0SGFuZGxlKCk7XG5cbmNvbnN0IE9uTW9uaXRvcnNDaGFuZ2VkID0gKC4uLkRhdGE6IFRBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbntcbiAgICBjb25zdCBOZXdNb25pdG9yczogVEFycmF5PEZNb25pdG9ySW5mbz4gPSBEYXRhWzBdIGFzIFRBcnJheTxGTW9uaXRvckluZm8+O1xuICAgIE1vbml0b3JzLmxlbmd0aCA9IDA7XG4gICAgTW9uaXRvcnMucHVzaCguLi5OZXdNb25pdG9ycyk7XG4gICAgTW9uaXRvcnNEaXNwYXRjaGVyLkRpc3BhdGNoKE5ld01vbml0b3JzKTtcbn07XG5cbmNvbnN0IFRyYWNrTW9uaXRvcnMgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIE1vbml0b3JzLnB1c2goLi4uSW5pdGlhbGl6ZU1vbml0b3JzKCkpO1xuICAgIFN1YnNjcmliZShcIk1vbml0b3JzXCIsIE9uTW9uaXRvcnNDaGFuZ2VkKTtcbn07XG5cblJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihcIk1vbml0b3JcIiwgVHJhY2tNb25pdG9ycywgWyBcIk5vZGVJcGNcIiBdKTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBJbml0aWFsaXplU2V0dGluZ3MudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBEZWZhdWx0U2V0dGluZ3MgfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24gfSBmcm9tIFwiIy9Jbml0aWFsaXplL0luaXRpYWxpemVcIjtcbmltcG9ydCBTZXR0aW5ncyBmcm9tIFwiZWxlY3Ryb24tc2V0dGluZ3NcIjtcblxuY29uc3QgSW5pdGlhbGl6ZVNldHRpbmdzID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBpZiAoIVNldHRpbmdzLmhhc1N5bmMoXCJTZXR0aW5nc1wiKSlcbiAgICB7XG4gICAgICAgIGF3YWl0IFNldHRpbmdzLnNldChcIlNldHRpbmdzXCIsIEpTT04uc3RyaW5naWZ5KERlZmF1bHRTZXR0aW5ncykpO1xuICAgIH1cbn07XG5cblJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihcIlNldHRpbmdzXCIsIEluaXRpYWxpemVTZXR0aW5ncyk7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgU2V0dGluZ3MudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZMb2dnZXIsIEZSZWplY3RGdW5jdGlvbiwgRlNldHRpbmdzLCBUUmVzb2x2ZUZ1bmN0aW9uIH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgRGVmYXVsdFNldHRpbmdzIH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IEVsZWN0cm9uU2V0dGluZ3MgZnJvbSBcImVsZWN0cm9uLXNldHRpbmdzXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiIy9EZXZlbG9wbWVudFwiO1xuaW1wb3J0IHsgU2V0UnVuT25TdGFydHVwIH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFycyAqL1xuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiU2V0dGluZ3NcIik7XG5cbmNvbnN0IFNhdmVTZXR0aW5ncyA9IGFzeW5jIChOZXdTZXR0aW5nczogRlNldHRpbmdzKTogUHJvbWlzZTxib29sZWFuPiA9Plxue1xuICAgIHRyeVxuICAgIHtcbiAgICAgICAgYXdhaXQgRWxlY3Ryb25TZXR0aW5ncy5zZXQoXCJTZXR0aW5nc1wiLCBKU09OLnN0cmluZ2lmeShOZXdTZXR0aW5ncykpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFycyAqL1xuICAgIGNhdGNoIChfRXJyb3I6IHVua25vd24pXG4gICAge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxuY29uc3QgT25VcGRhdGVTZXR0aW5ncyA9IGFzeW5jIChPbGRTZXR0aW5nczogRlNldHRpbmdzLCBOZXdTZXR0aW5nczogRlNldHRpbmdzKTogUHJvbWlzZTxib29sZWFuPiA9Plxue1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPigoUmVzb2x2ZTogVFJlc29sdmVGdW5jdGlvbjxib29sZWFuPiwgX1JlamVjdDogRlJlamVjdEZ1bmN0aW9uKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKE9sZFNldHRpbmdzLlJ1bk9uU3RhcnR1cCAhPT0gTmV3U2V0dGluZ3MuUnVuT25TdGFydHVwKVxuICAgICAgICB7XG4gICAgICAgICAgICBTZXRSdW5PblN0YXJ0dXAoTmV3U2V0dGluZ3MuUnVuT25TdGFydHVwLCBwcm9jZXNzLmV4ZWNQYXRoLCAoU3VjY2VzczogYm9vbGVhbikgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZXNvbHZlKFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBSZXNvbHZlKHRydWUpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgVXBkYXRlU2V0dGluZ3MgPSBhc3luYyAoTmV3U2V0dGluZ3M6IEZTZXR0aW5ncyk6IFByb21pc2U8Ym9vbGVhbj4gPT5cbntcbiAgICBjb25zdCBPbGRTZXR0aW5nczogRlNldHRpbmdzID0gYXdhaXQgR2V0U2V0dGluZ3MoKTtcbiAgICBjb25zdCBTYXZlZFN1Y2Nlc3NmdWw6IGJvb2xlYW4gPSBhd2FpdCBTYXZlU2V0dGluZ3MoTmV3U2V0dGluZ3MpO1xuICAgIGlmIChTYXZlZFN1Y2Nlc3NmdWwpXG4gICAge1xuICAgICAgICByZXR1cm4gYXdhaXQgT25VcGRhdGVTZXR0aW5ncyhPbGRTZXR0aW5ncywgTmV3U2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRTZXR0aW5ncyA9IGFzeW5jICgpOiBQcm9taXNlPFJlYWRvbmx5PEZTZXR0aW5ncz4+ID0+XG57XG4gICAgY29uc3QgU2V0dGluZ3NTdHJpbmc6IHVua25vd24gPSBhd2FpdCBFbGVjdHJvblNldHRpbmdzLmdldChcIlNldHRpbmdzXCIpO1xuXG4gICAgcmV0dXJuIHR5cGVvZiBTZXR0aW5nc1N0cmluZyA9PT0gXCJzdHJpbmdcIlxuICAgICAgICA/IEpTT04ucGFyc2UoU2V0dGluZ3NTdHJpbmcpIGFzIEZTZXR0aW5nc1xuICAgICAgICA6IERlZmF1bHRTZXR0aW5ncztcbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgaW5kZXgudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9Jbml0aWFsaXplU2V0dGluZ3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgU3RvcmUudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgeyB0eXBlIEZTdG9yZSwgR2V0RGVmYXVsdFN0b3JlIH0gZnJvbSBcIi4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uIH0gZnJvbSBcIiMvSW5pdGlhbGl6ZS9Jbml0aWFsaXplXCI7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSBcImVsZWN0cm9uLXNldHRpbmdzXCI7XG5cbmV4cG9ydCBjb25zdCBHZXRTdG9yZSA9IGFzeW5jICgpOiBQcm9taXNlPEZTdG9yZT4gPT5cbntcbiAgICBjb25zdCBPdXRTZXR0aW5nczogRlN0b3JlIHwgbnVsbCA9IGF3YWl0IFNldHRpbmdzLmdldChcIlN0b3JlXCIpIGFzIEZTdG9yZSB8IG51bGw7XG4gICAgcmV0dXJuIChPdXRTZXR0aW5ncyAhPT0gbnVsbClcbiAgICAgICAgPyBPdXRTZXR0aW5nc1xuICAgICAgICA6IEdldERlZmF1bHRTdG9yZSgpO1xufTtcblxuZXhwb3J0IGNvbnN0IFNldFN0b3JlID0gYXN5bmMgKE5ld1N0b3JlOiBGU3RvcmUpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgYXdhaXQgU2V0dGluZ3Muc2V0KFwiU3RvcmVcIiwgTmV3U3RvcmUpO1xufTtcblxuY29uc3QgSW5pdGlhbGl6ZVN0b3JlID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBpZiAoIVNldHRpbmdzLmhhc1N5bmMoXCJTdG9yZVwiKSlcbiAgICB7XG4gICAgICAgIFNldHRpbmdzLnNldChcIlN0b3JlXCIsIEdldERlZmF1bHRTdG9yZSgpKTtcbiAgICB9XG59O1xuXG5SZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXCJTdG9yZVwiLCBJbml0aWFsaXplU3RvcmUpO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIExvZy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkxvZ2dlciB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IEdldExvZ2dlciB9IGZyb20gXCIjL0RldmVsb3BtZW50XCI7XG5cbmNvbnN0IFRyZWVMb2dnZXI6IEZMb2dnZXIgPSBHZXRMb2dnZXIoXCJUcmVlXCIpO1xuLy8gVHJlZUxvZ2dlci5Gb3JtYXR0ZXJzLnB1c2goKFN0YXRlbWVudDogdW5rbm93bik6IHVua25vd24gPT5cbi8vIHtcbi8vICAgICBpZiAodHlwZW9mIFN0YXRlbWVudCA9PT0gXCJvYmplY3RcIiAmJiBTdGF0ZW1lbnQgIT09IG51bGwgJiYgXCJTY3JlZW5zaG90XCIgaW4gU3RhdGVtZW50KVxuLy8gICAgIHtcbi8vICAgICAgICAgY29uc3QgeyBTY3JlZW5zaG90OiBfLCAuLi5PdXQgfSA9IFN0YXRlbWVudDtcbi8vICAgICAgICAgcmV0dXJuIE91dDtcbi8vICAgICB9XG4vLyAgICAgZWxzZVxuLy8gICAgIHtcbi8vICAgICAgICAgcmV0dXJuIFN0YXRlbWVudDtcbi8vICAgICB9XG4vLyB9KTtcblxuLyoqXG4gKiBMb2cgc3RhdGVtZW50cyBmb3IgdGhlIGBUcmVlYCBjb2xsZWN0aW9uIG9mIG1vZHVsZXMuXG4gKiBUaGlzIGZ1bmN0aW9uLCB3aGljaCByZXR1cm5zIHRoZSBsb2dnZXIsIGlzIGV4cG9ydGVkXG4gKiAocmF0aGVyIHRoYW4gZXhwb3J0aW5nIHRoZSBsb2dnZXIgZGlyZWN0bHkpIHRvIGJlXG4gKiBjb25zaXN0ZW50IHdpdGggaG93IHRoZSBsb2dnZXIgaXMgdHlwaWNhbGx5IHJldHJpZXZlZFxuICogKHJldHJpZXZlZCBhdCB0aGUgdG9wIG9mIGVhY2ggbW9kdWxlKS5cbiAqL1xuZXhwb3J0IGNvbnN0IEdldFRyZWVMb2dnZXI6ICgoKSA9PiBGTG9nZ2VyKSA9ICgpOiBGTG9nZ2VyID0+IFRyZWVMb2dnZXI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgVHJlZS5PbGQudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQge1xuICAgIEFyZUJveGVzRXF1YWwsXG4gICAgQXJlSGFuZGxlc0VxdWFsLFxuICAgIEJveFRvU3RyaW5nLFxuICAgIEdldFBuZ0Jhc2U2NCxcbiAgICBQb3NpdGlvblRvU3RyaW5nXG59IGZyb20gXCIjL1V0aWxpdHlcIjtcbmltcG9ydCB7XG4gICAgQ2FwdHVyZVNjcmVlblNlY3Rpb25Ub1RlbXBQbmdGaWxlLFxuICAgIHR5cGUgRkJveCxcbiAgICB0eXBlIEZNb25pdG9ySW5mbyxcbiAgICBHZXRBcHBsaWNhdGlvbkZyaWVuZGx5TmFtZSxcbiAgICBHZXRNb25pdG9yRnJpZW5kbHlOYW1lLFxuICAgIEdldE1vbml0b3JGcm9tV2luZG93LFxuICAgIEdldFRpbGVhYmxlV2luZG93cyxcbiAgICBHZXRXaW5kb3dTaGFwZSxcbiAgICBHZXRXaW5kb3dUaXRsZSxcbiAgICB0eXBlIEhNb25pdG9yLFxuICAgIHR5cGUgSFdpbmRvdyxcbiAgICBSZXN0b3JlV2luZG93LFxuICAgIFNldEZvcmVncm91bmRXaW5kb3csXG4gICAgU2V0V2luZG93UG9zaXRpb24sXG4gICAgVXBkYXRlVGlsZWRMaXN0XG59IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgRkFubm90YXRlZFBhbmVsLFxuICAgIEZDZWxsLFxuICAgIEZGb2N1c0NoYW5nZSxcbiAgICBGRm9yZXN0LFxuICAgIEZHYXBEYXRhLFxuICAgIEZMb2dUcmFuc2Zvcm1lcixcbiAgICBGTG9nZ2VyLFxuICAgIEZQYW5lbCxcbiAgICBGUGFuZWxCYXNlLFxuICAgIEZWZXJ0ZXggfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBGb3JtYXQgfSBmcm9tIFwiIy9EZXZlbG9wbWVudFwiO1xuaW1wb3J0IHsgR2V0QWN0aXZlV2luZG93IH0gZnJvbSBcIiMvV2luZG93L092ZXJsYXlcIjtcbmltcG9ydCB7IEdldE1vbml0b3JzIH0gZnJvbSBcIiMvTW9uaXRvclwiO1xuaW1wb3J0IHsgR2V0U2V0dGluZ3MgfSBmcm9tIFwiIy9TZXR0aW5nc1wiO1xuaW1wb3J0IHsgR2V0VHJlZUxvZ2dlciB9IGZyb20gXCIuL0xvZ1wiO1xuaW1wb3J0IHsgUmVnaXN0ZXJJbml0aWFsaXphdGlvbkZ1bmN0aW9uIH0gZnJvbSBcIiMvSW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHR5cGUgeyBUUHJlZGljYXRlIH0gZnJvbSBcIkBzb3JyZWxsL2Z1bmN0aW9uYWxcIjtcblxuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0VHJlZUxvZ2dlcigpO1xuXG5jb25zdCBGb3Jlc3Q6IEZGb3Jlc3QgPSBbIF07XG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IHtAbGluayBGRm9yZXN0fSB0aGF0IG1vZGVscyB0aGUgdXNlcidzIGRlc2t0b3AuXG4gKlxuICogQHJldHVybnMge0ZGb3Jlc3R9IFRoZSBjdXJyZW50IHtAbGluayBGRm9yZXN0fSB0aGF0IG1vZGVscyB0aGUgdXNlcidzIGRlc2t0b3AuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBHZXRGb3Jlc3QoKTogRkZvcmVzdFxue1xuICAgIHJldHVybiBGb3Jlc3Q7XG4gICAgLy8gcmV0dXJuIFsgLi4uRm9yZXN0IF07XG59XG5cbmZ1bmN0aW9uIEdldERlcHRoKFZlcnRleDogRlZlcnRleCk6IG51bWJlclxue1xuICAgIGxldCBEZXB0aDogbnVtYmVyID0gMDtcbiAgICBsZXQgUGFyZW50OiBGUGFuZWwgfCB1bmRlZmluZWQgPSBHZXRQYXJlbnQoVmVydGV4KTtcblxuICAgIHdoaWxlIChQYXJlbnQgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIERlcHRoKys7XG4gICAgICAgIFBhcmVudCA9IEdldFBhcmVudChQYXJlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBEZXB0aDtcbn1cblxuLyoqXG4gKiBMb2cgdGhlIGNvbnRlbnRzIG9mIHRoZSBmb3Jlc3QuXG4gKlxuICogQHBhcmFtIFRyYW5zZm9ybWVyIC0gT3B0aW9uYWxseSwgcGFzcyBhIGZ1bmN0aW9uIHRvIHRyYW5zZm9ybSB0aGUgbG9nIHN0YXRlbWVudCBmb3IgZWFjaCB2ZXJ0ZXgsXG4gKiBiYXNlZCB1cG9uIHRoZSBiZWhhdmlvciB0aGF0IHlvdSB3aXNoIHRvIGRlc2NyaWJlIGJ5IGxvZ2dpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBMb2dGb3Jlc3QoVHJhbnNmb3JtZXI/OiBGTG9nVHJhbnNmb3JtZXIpOiB2b2lkXG57XG4gICAgTG9nKEZvcmVzdCk7XG4gICAgTG9nKFwiTG9nZ2VkIEZvcmVzdCFcIik7XG4gICAgcmV0dXJuO1xuXG4gICAgbGV0IE91dFN0cmluZzogc3RyaW5nID0gXCJcIjtcblxuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBjb25zdCBEZXB0aDogbnVtYmVyID0gR2V0RGVwdGgoVmVydGV4KTtcbiAgICAgICAgY29uc3QgTGVmdFBhZGRpbmc6IHN0cmluZyA9IFwiICBcIi5yZXBlYXQoRGVwdGgpO1xuICAgICAgICBPdXRTdHJpbmcgKz0gTGVmdFBhZGRpbmc7XG5cbiAgICAgICAgaWYgKElzUGFuZWwoVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgUGFuZWxMb2c6IHN0cmluZyA9IGAkeyBWZXJ0ZXguVHlwZSB9IFBhbmVsYDtcbiAgICAgICAgICAgIGlmIChUcmFuc2Zvcm1lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBUcmFuc2Zvcm1lcihWZXJ0ZXgsIERlcHRoLCBQYW5lbExvZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT3V0U3RyaW5nICs9IFBhbmVsTG9nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgQ2VsbExvZzogc3RyaW5nID0gYCR7IEdldFdpbmRvd1RpdGxlKFZlcnRleC5IYW5kbGUpIH0gYDtcbiAgICAgICAgICAgIGlmIChUcmFuc2Zvcm1lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBUcmFuc2Zvcm1lcihWZXJ0ZXgsIERlcHRoLCBDZWxsTG9nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQ2VsbExvZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIE91dFN0cmluZyArPSBcIlxcblwiO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgTG9nKEZvcm1hdChKU09OLnBhcnNlKE91dFN0cmluZykpKTtcbn07XG5cbmNvbnN0IENlbGwgPSAoSGFuZGxlOiBIV2luZG93KTogRkNlbGwgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBIYW5kbGUsXG4gICAgICAgIFNpemU6IHsgSGVpZ2h0OiAwLCBXaWR0aDogMCwgWDogMCwgWTogMCB9LFxuICAgICAgICBaT3JkZXI6IDBcbiAgICB9O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFVwZGF0ZUZvcmVzdChVcGRhdGVGdW5jdGlvbjogKE9sZEZvcmVzdDogRkZvcmVzdCkgPT4gRkZvcmVzdCk6IHZvaWRcbntcbiAgICBjb25zdCBOZXdGb3Jlc3Q6IEZGb3Jlc3QgPSBVcGRhdGVGdW5jdGlvbihbIC4uLkZvcmVzdCBdKTtcbiAgICBGb3Jlc3QubGVuZ3RoID0gMDtcbiAgICBGb3Jlc3QucHVzaCguLi5OZXdGb3Jlc3QpO1xuXG4gICAgLy8gQFRPRE8gTW92ZSBhbmQgcmVzaXplLCBhbmQgc29ydCBaT3JkZXIgb2YgYWxsIHdpbmRvd3MgYmVpbmcgdGlsZWQgYnkgU29ycmVsbFdtLlxufTtcblxuYXN5bmMgZnVuY3Rpb24gSW5pdGlhbGl6ZVRyZWUoKTogUHJvbWlzZTx2b2lkPlxue1xuICAgIGNvbnN0IE1vbml0b3JzOiBUQXJyYXk8Rk1vbml0b3JJbmZvPiA9IEdldE1vbml0b3JzKCk7XG5cbiAgICBGb3Jlc3QucHVzaCguLi5Nb25pdG9ycy5tYXAoKE1vbml0b3I6IEZNb25pdG9ySW5mbyk6IEZQYW5lbCA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIENoaWxkcmVuOiBbIF0sXG4gICAgICAgICAgICBNb25pdG9ySWQ6IE1vbml0b3IuSGFuZGxlLFxuICAgICAgICAgICAgU2l6ZTogTW9uaXRvci5Xb3JrU2l6ZSxcbiAgICAgICAgICAgIFR5cGU6IE1vbml0b3IuV29ya1NpemUuV2lkdGggPCBNb25pdG9yLldvcmtTaXplLkhlaWdodFxuICAgICAgICAgICAgICAgID8gXCJWZXJ0aWNhbFwiXG4gICAgICAgICAgICAgICAgOiBcIkhvcml6b250YWxcIixcbiAgICAgICAgICAgIFpPcmRlcjogMFxuICAgICAgICB9O1xuICAgIH0pKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKEZvcmVzdCk7XG5cbiAgICAvLyAvKiogQFRPRE8gQ29uc2lkZXIgY2hhbmdpbmcgdGhpcy4gKi9cbiAgICAvLyBSZXN0b3JlQWxsV2luZG93cygpO1xuICAgIExvZyhcIklOSVRJQUxJWkVEIFRSRUUuXCIpO1xufTtcblxuLyoqXG4gKiBJbnRlbmRlZCB0byBiZSAob3B0aW9uYWxseSkgY2FsbGVkIHVwb24gbGF1bmNoaW5nIFNvcnJlbGxXbSxcbiAqIHRpbGUgYWxsIHJlc3RvcmVkIHdpbmRvd3MsIGFuZCBwbGFjZSB0aGVtIGluIHRoZSByb290IHBhbmVsIG9mIHRoZVxuICogcmVzcGVjdGl2ZSBtb25pdG9yIHRvIHdoaWNoIHRoZXkgYmVsb25nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gVGlsZUFsbFdpbmRvd3MoKTogdm9pZFxue1xuICAgIGNvbnN0IE1vbml0b3JzOiBUQXJyYXk8Rk1vbml0b3JJbmZvPiA9IEdldE1vbml0b3JzKCk7XG5cbiAgICBjb25zdCBUaWxlYWJsZVdpbmRvd3M6IFRBcnJheTxIV2luZG93PiA9IEdldFRpbGVhYmxlV2luZG93cygpLmZpbHRlcigoSGFuZGxlOiBIV2luZG93KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgLyoqIEBUT0RPIEZvciBub3csIGV4Y2x1ZGUgVlMgQ29kZSwganVzdCB0byBtYWtlIGRldmVsb3BtZW50IGxlc3MgYW5ub3lpbmcuICovXG4gICAgICAgIHJldHVybiAhR2V0V2luZG93VGl0bGUoSGFuZGxlKS5pbmNsdWRlcyhcIlNvcnJlbGxXbSAoV29ya3NwYWNlKVwiKTtcbiAgICB9KTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGBGb3VuZCAkeyBUaWxlYWJsZVdpbmRvd3MubGVuZ3RoIH0gdGlsZWFibGUgd2luZG93cy5gKTtcblxuICAgIFRpbGVhYmxlV2luZG93cy5mb3JFYWNoKChIYW5kbGU6IEhXaW5kb3cpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBNb25pdG9yOiBITW9uaXRvciA9IEdldE1vbml0b3JGcm9tV2luZG93KEhhbmRsZSk7XG4gICAgICAgIGNvbnN0IFJvb3RQYW5lbDogRlBhbmVsQmFzZSB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICBGb3Jlc3QuZmluZCgoUGFuZWw6IEZQYW5lbEJhc2UpOiBib29sZWFuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYE1vbml0b3IgaXMgJHsgSlNPTi5zdHJpbmdpZnkoTW9uaXRvcikgfSBhbmQgUGFuZWwuTW9uaXRvcklkIGlzICR7IEpTT04uc3RyaW5naWZ5KFBhbmVsLk1vbml0b3JJZCkgfS5gKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBJbmZvOiBGTW9uaXRvckluZm8gfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgICAgIC8vICAgICBNb25pdG9ycy5maW5kKChGb286IEZNb25pdG9ySW5mbyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAvLyAgICAge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuIEZvby5IYW5kbGUuSGFuZGxlID09PSBQYW5lbC5Nb25pdG9ySWQ/LkhhbmRsZTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgU2l6ZSAkeyBKU09OLnN0cmluZ2lmeShJbmZvPy5TaXplKSB9IFdvcmtTaXplICR7IEpTT04uc3RyaW5naWZ5KEluZm8/LldvcmtTaXplKSB9LmApO1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUGFuZWwuTW9uaXRvcklkPy5IYW5kbGUgPT09IE1vbml0b3IuSGFuZGxlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKFJvb3RQYW5lbCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBAVE9ET1xuICAgICAgICAgICAgTG9nKFwiUm9vdFBhbmVsIHdhcyB1bmRlZmluZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgUm9vdFBhbmVsLkNoaWxkcmVuLnB1c2goQ2VsbChIYW5kbGUpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgRm9yZXN0LmZvckVhY2goKFBhbmVsOiBGUGFuZWwpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBNb25pdG9ySW5mbzogRk1vbml0b3JJbmZvIHwgdW5kZWZpbmVkID1cbiAgICAgICAgICAgIE1vbml0b3JzLmZpbmQoKEluTW9uaXRvcjogRk1vbml0b3JJbmZvKTogYm9vbGVhbiA9PiBJbk1vbml0b3IuSGFuZGxlID09PSBQYW5lbC5Nb25pdG9ySWQpO1xuXG4gICAgICAgIC8qIEBUT0RPIEZvciBub3csIHNraXAgdGhlIG1haW4gbW9uaXRvci4gKi9cbiAgICAgICAgaWYgKE1vbml0b3JJbmZvPy5TaXplLldpZHRoID09PSAzNDQwKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTW9uaXRvckluZm8gPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQFRPRE9cbiAgICAgICAgfVxuICAgICAgICAvLyBlbHNlIGlmIChBcmVCb3hlc0VxdWFsKE1vbml0b3JJbmZvLldvcmtTaXplLCApKVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFBhbmVsLkNoaWxkcmVuID0gUGFuZWwuQ2hpbGRyZW4ubWFwKChDaGlsZDogRlZlcnRleCwgSW5kZXg6IG51bWJlcik6IEZWZXJ0ZXggPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBVbmlmb3JtV2lkdGg6IG51bWJlciA9IE1vbml0b3JJbmZvLldvcmtTaXplLldpZHRoIC8gUGFuZWwuQ2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IE91dENoaWxkOiBGVmVydGV4ID0geyAuLi5DaGlsZCB9O1xuICAgICAgICAgICAgICAgIE91dENoaWxkLlNpemUgPVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5Nb25pdG9ySW5mby5Xb3JrU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpZHRoOiBVbmlmb3JtV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBYOiBVbmlmb3JtV2lkdGggKiBJbmRleCArIE1vbml0b3JJbmZvLldvcmtTaXplLlhcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPdXRDaGlsZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBDZWxsczogVEFycmF5PEZDZWxsPiA9IEdldEFsbENlbGxzKEZvcmVzdCk7XG5cbiAgICBDZWxscy5mb3JFYWNoKChDZWxsOiBGQ2VsbCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgTG9nLlZlcmJvc2UoYFNldHRpbmcgcG9zaXRpb24gb2YgJHsgR2V0V2luZG93VGl0bGUoQ2VsbC5IYW5kbGUpIH0gdG8gJHsgSlNPTi5zdHJpbmdpZnkoQ2VsbC5TaXplKSB9LmApO1xuICAgICAgICBTZXRXaW5kb3dQb3NpdGlvbihDZWxsLkhhbmRsZSwgQ2VsbC5TaXplKTtcbiAgICAgICAgLyogQXQgbGVhc3QgZm9yIG5vdywgaWdub3JlIFNvcnJlbGxXbSB3aW5kb3dzLiAqL1xuICAgICAgICAvLyBpZiAoR2V0V2luZG93VGl0bGUoQ2VsbC5IYW5kbGUpICE9PSBcIlNvcnJlbGxXbVwiKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBTZXRXaW5kb3dQb3NpdGlvbihDZWxsLkhhbmRsZSwgQ2VsbC5TaXplKTtcbiAgICAgICAgLy8gfVxuICAgIH0pO1xufTtcblxuLyoqIEByZW1hcmtzIFRoaXMgaXMgbm90IGEgY29tcGxldGVseSB0aG9yb3VnaCB0eXBlLWNoZWNrIGZ1bmN0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIElzVmVydGV4KEluOiB1bmtub3duKTogSW4gaXMgRlZlcnRleFxue1xuICAgIHJldHVybiAoXG4gICAgICAgIHR5cGVvZiBJbiA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICBJbiAhPT0gbnVsbCAmJlxuICAgICAgICBcIlNpemVcIiBpbiBJbiAmJlxuICAgICAgICBcIkhhbmRsZVwiIGluIEluICYmXG4gICAgICAgIFwiWk9yZGVyXCIgaW4gSW5cbiAgICApO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIElzQ2VsbChWZXJ0ZXg6IEZWZXJ0ZXgpOiBWZXJ0ZXggaXMgRkNlbGxcbntcbiAgICByZXR1cm4gXCJIYW5kbGVcIiBpbiBWZXJ0ZXg7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gRmxhdHRlbigpOiBUQXJyYXk8RlZlcnRleD5cbntcbiAgICBjb25zdCBPdXRBcnJheTogVEFycmF5PEZWZXJ0ZXg+ID0gWyBdO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIE91dEFycmF5LnB1c2goVmVydGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gT3V0QXJyYXk7XG59O1xuXG4vKipcbiAqIFJ1biBhIGZ1bmN0aW9uIGZvciBlYWNoIHZlcnRleCB1bnRpbCB0aGUgZnVuY3Rpb24gcmV0dXJucyBgZmFsc2VgIGZvclxuICogYW4gaXRlcmF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gVHJhdmVyc2UoUHJlZGljYXRlOiBUUHJlZGljYXRlPEZWZXJ0ZXg+LCBFbnRyeT86IEZWZXJ0ZXgpOiB2b2lkXG57XG4gICAgbGV0IENvbnRpbnVlczogYm9vbGVhbiA9IHRydWU7XG4gICAgY29uc3QgUmVjdXJyZW5jZSA9IChWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ29udGludWVzKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250aW51ZXMgPSBQcmVkaWNhdGUoVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChDb250aW51ZXMgJiYgXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlY3VycmVuY2UoQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoRW50cnkpXG4gICAge1xuICAgICAgICBSZWN1cnJlbmNlKEVudHJ5KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBQYW5lbCBvZiBGb3Jlc3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlY3VycmVuY2UoUGFuZWwpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuY29uc3QgR2V0QWxsQ2VsbHMgPSAoUGFuZWxzOiBUQXJyYXk8RlBhbmVsPik6IFRBcnJheTxGQ2VsbD4gPT5cbntcbiAgICBjb25zdCBSZXN1bHQ6IFRBcnJheTxGQ2VsbD4gPSBbIF07XG5cbiAgICBmdW5jdGlvbiBUcmF2ZXJzZShWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkXG4gICAge1xuICAgICAgICBpZiAoXCJIYW5kbGVcIiBpbiBWZXJ0ZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlc3VsdC5wdXNoKFZlcnRleCBhcyBGQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVHJhdmVyc2UoQ2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBQYW5lbCBvZiBQYW5lbHMpXG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFBhbmVsLkNoaWxkcmVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBUcmF2ZXJzZShDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVzdWx0O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEV4aXN0cyhQcmVkaWNhdGU6IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiBib29sZWFuXG57XG4gICAgbGV0IERvZXNFeGlzdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoIURvZXNFeGlzdClcbiAgICAgICAge1xuICAgICAgICAgICAgRG9lc0V4aXN0ID0gUHJlZGljYXRlKFZlcnRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIURvZXNFeGlzdDtcbiAgICB9KTtcblxuICAgIHJldHVybiBEb2VzRXhpc3Q7XG59O1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBmdW5jdGlvbiBFeGlzdHNFeGFjdGx5T25lKF9QcmVkaWNhdGU6IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiBib29sZWFuXG57XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEZvckFsbChfUHJlZGljYXRlOiAoVmVydGV4OiBGVmVydGV4KSA9PiBib29sZWFuKTogYm9vbGVhblxue1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBJc1dpbmRvd1RpbGVkKEhhbmRsZTogSFdpbmRvdyk6IGJvb2xlYW5cbntcbiAgICByZXR1cm4gRXhpc3RzKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICByZXR1cm4gSXNDZWxsKFZlcnRleCkgJiYgQXJlSGFuZGxlc0VxdWFsKFZlcnRleC5IYW5kbGUsIEhhbmRsZSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0Q2VsbEZyb21IYW5kbGUoSGFuZGxlOiBIV2luZG93KTogRkNlbGwgfCB1bmRlZmluZWRcbntcbiAgICByZXR1cm4gRmluZCgoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIElzQ2VsbChWZXJ0ZXgpICYmIEFyZUhhbmRsZXNFcXVhbChWZXJ0ZXguSGFuZGxlLCBIYW5kbGUpO1xuICAgIH0pIGFzIEZDZWxsIHwgdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldFBhbmVscygpOiBUQXJyYXk8RlBhbmVsPlxue1xuICAgIGNvbnN0IFZlcnRpY2VzOiBUQXJyYXk8RlZlcnRleD4gPSBGbGF0dGVuKCk7XG4gICAgcmV0dXJuIFZlcnRpY2VzLmZpbHRlcigoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PiAhSXNDZWxsKFZlcnRleCkpIGFzIFRBcnJheTxGUGFuZWw+O1xufTtcblxuY29uc3QgVHJhdmVyc2VMZXZlbE9yZGVyID0gKFJvb3Q6IEZWZXJ0ZXgsIENhbGxiYWNrOiAoVmVydGV4OiBGVmVydGV4LCBMZXZlbDogbnVtYmVyKSA9PiB2b2lkKTogdm9pZCA9Plxue1xuICAgIGNvbnN0IFF1ZXVlOiBUQXJyYXk8eyBWZXJ0ZXg6IEZWZXJ0ZXg7IExldmVsOiBudW1iZXIgfT4gPSBbIHsgTGV2ZWw6IDAsIFZlcnRleDogUm9vdCB9IF07XG4gICAgd2hpbGUgKFF1ZXVlLmxlbmd0aCA+IDApXG4gICAge1xuICAgICAgICBjb25zdCB7IFZlcnRleCwgTGV2ZWwgfSA9IFF1ZXVlLnNoaWZ0KCkhO1xuICAgICAgICBDYWxsYmFjayhWZXJ0ZXgsIExldmVsKTtcbiAgICAgICAgaWYgKElzUGFuZWwoVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUXVldWUucHVzaCh7IExldmVsOiBMZXZlbCArIDEsIFZlcnRleDogQ2hpbGQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5jb25zdCBDb21wdXRlR2FwRGF0YSA9IGFzeW5jICgpOiBQcm9taXNlPFRNYXA8RlZlcnRleCwgRkJveD4+ID0+XG57XG4gICAgY29uc3QgR2FwRGF0YTogVE1hcDxGVmVydGV4LCBGR2FwRGF0YT4gPSBuZXcgTWFwPEZWZXJ0ZXgsIEZHYXBEYXRhPigpO1xuXG4gICAgLyoqIEBUT0RPIE1ha2UgdGhpcyBhIHNldHRpbmcuICovXG4gICAgY29uc3QgeyBHYXAgfSA9IGF3YWl0IEdldFNldHRpbmdzKCk7XG5cbiAgICBGb3Jlc3QuZm9yRWFjaCgoUm9vdDogRlZlcnRleCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIC8qIEFwcGx5IHRoZSBvdXRlciBtYXJnaW4uICovXG4gICAgICAgIEdhcERhdGEuc2V0KFxuICAgICAgICAgICAgUm9vdCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBZGp1c3RlZFNpemU6XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBIZWlnaHQ6IFJvb3QuU2l6ZS5IZWlnaHQgLSAyICogR2FwLFxuICAgICAgICAgICAgICAgICAgICBXaWR0aDogUm9vdC5TaXplLldpZHRoIC0gMiAqIEdhcCxcbiAgICAgICAgICAgICAgICAgICAgWDogUm9vdC5TaXplLlggKyBHYXAsXG4gICAgICAgICAgICAgICAgICAgIFk6IFJvb3QuU2l6ZS5ZICsgR2FwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBQcmluY2lwYWxSYXRpbzogMVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGNvbnN0IEdldFByZXZpb3VzVmVydGV4ID0gKFZlcnRleDogRlZlcnRleCwgUGFyZW50OiBGUGFuZWwpOiBGVmVydGV4IHwgdW5kZWZpbmVkID0+XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRJbmRleEluUGFuZWwoVmVydGV4KTtcbiAgICAgICAgLy8gICAgIGlmIChJbmRleCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAvLyAgICAge1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBJbmRleCA+IDBcbiAgICAgICAgLy8gICAgICAgICAgICAgPyBQYXJlbnQuQ2hpbGRyZW5bSW5kZXggLSAxXVxuICAgICAgICAvLyAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgIGVsc2VcbiAgICAgICAgLy8gICAgIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAvLyAgICAgICAgIExvZy5FcnJvcihcIkdldFByZXZpb3VzVmVydGV4IGNhbGxlZCBHZXRJbmRleEluUGFuZWwsIHdoaWNoIHJldHVybmVkIHVuZGVmaW5lZC4gIFRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlbiFcIik7XG4gICAgICAgIC8vICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfTtcblxuICAgICAgICBjb25zdCBHZXRDdW11bGF0aXZlUHJldmlvdXNQcmluY2lwYWxSYXRpb3MgPSAoVmVydGV4OiBGVmVydGV4LCBQYXJlbnQ6IEZQYW5lbCk6IG51bWJlciB8IHVuZGVmaW5lZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBHaXZlbkluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRJbmRleEluUGFuZWwoVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChHaXZlbkluZGV4ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTG9nLkVycm9yKFwiT29wcy5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKEdpdmVuSW5kZXggPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGV0IEN1bXVsYXRpdmVQcmV2aW91c1ByaW5jaXBhbE1lYXN1cmVzOiBudW1iZXIgPSAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IFByaW5jaXBhbE1lYXN1cmU6IFwiSGVpZ2h0XCIgfCBcIldpZHRoXCIgPSBQYXJlbnQuVHlwZSA9PT0gXCJIb3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgICAgICAgPyBcIldpZHRoXCJcbiAgICAgICAgICAgICAgICAgICAgOiBcIkhlaWdodFwiO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IDA7IEluZGV4IDwgR2l2ZW5JbmRleDsgSW5kZXgrKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IENoaWxkOiBGVmVydGV4IHwgdW5kZWZpbmVkID0gUGFyZW50LkNoaWxkcmVuW0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENoaWxkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEN1bXVsYXRpdmVQcmV2aW91c1ByaW5jaXBhbE1lYXN1cmVzICs9IENoaWxkLlNpemVbUHJpbmNpcGFsTWVhc3VyZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gQ3VtdWxhdGl2ZVByZXZpb3VzUHJpbmNpcGFsTWVhc3VyZXMgLyBQYXJlbnQuU2l6ZVtQcmluY2lwYWxNZWFzdXJlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBUcmF2ZXJzZUxldmVsT3JkZXIoUm9vdCwgKFZlcnRleDogRlZlcnRleCwgX0xldmVsOiBudW1iZXIpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChJc1BhbmVsKFZlcnRleCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBQYXJlbnQ6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBHZXRQYXJlbnQoVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChQYXJlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBMb2cuRXJyb3IoXCJCZWVwIGJvb3AuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc3QgUHJpbmNpcGFsQXhpczogXCJYXCIgfCBcIllcIiA9IFBhcmVudC5UeXBlID09PSBcIkhvcml6b250YWxcIlxuICAgICAgICAgICAgLy8gICAgID8gXCJYXCJcbiAgICAgICAgICAgIC8vICAgICA6IFwiWVwiO1xuXG4gICAgICAgICAgICBjb25zdCBQcmluY2lwYWxNZWFzdXJlOiBcIkhlaWdodFwiIHwgXCJXaWR0aFwiID0gUGFyZW50LlR5cGUgPT09IFwiSG9yaXpvbnRhbFwiXG4gICAgICAgICAgICAgICAgPyBcIldpZHRoXCJcbiAgICAgICAgICAgICAgICA6IFwiSGVpZ2h0XCI7XG5cbiAgICAgICAgICAgIGNvbnN0IFByaW5jaXBhbFJhdGlvOiBudW1iZXIgPSBWZXJ0ZXguU2l6ZVtQcmluY2lwYWxNZWFzdXJlXSAvIFBhcmVudC5TaXplW1ByaW5jaXBhbE1lYXN1cmVdO1xuXG4gICAgICAgICAgICBjb25zdCBDdW11bGF0aXZlUHJldmlvdXNSYXRpb3M6IG51bWJlciB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICAgICAgR2V0Q3VtdWxhdGl2ZVByZXZpb3VzUHJpbmNpcGFsUmF0aW9zKFZlcnRleCwgUGFyZW50KTtcblxuICAgICAgICAgICAgaWYgKEN1bXVsYXRpdmVQcmV2aW91c1JhdGlvcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIExvZy5FcnJvcihcIk9vcHMuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgUGFyZW50R2FwRGF0YTogRkdhcERhdGEgfCB1bmRlZmluZWQgPSBHYXBEYXRhLmdldChQYXJlbnQpO1xuICAgICAgICAgICAgaWYgKFBhcmVudEdhcERhdGEgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBMb2cuRXJyb3IoXCJPb3BzLlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRJbmRleEluUGFuZWwoVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChJbmRleCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIExvZy5FcnJvcihcIk9vcHMuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc3QgVG90YWxHYXBTaXplSW5QYW5lbDogbnVtYmVyID0gKFBhcmVudC5DaGlsZHJlbi5sZW5ndGggLSAxKSAqIEdhcDtcblxuICAgICAgICAgICAgLyogVGhlIGFtb3VudCBvZiBzcGFjZSB0aGF0IHdpbGwgYmUgdGFrZW4gdXAgYnkgdmVydGljZXMgaW4gdGhlIHBhcmVudCBwYW5lbC4gKi9cbiAgICAgICAgICAgIGNvbnN0IFBhcmVudFdvcmtQcmluY2lwYWxNZWFzdXJlOiBudW1iZXIgPVxuICAgICAgICAgICAgICAgIFBhcmVudEdhcERhdGEuQWRqdXN0ZWRTaXplW1ByaW5jaXBhbE1lYXN1cmVdIC0gR2FwICogKFBhcmVudC5DaGlsZHJlbi5sZW5ndGggLSAxKTtcblxuICAgICAgICAgICAgY29uc3QgQ3VtdWxhdGl2ZVByZXZpb3VzR2FwczogbnVtYmVyID0gSW5kZXggKiBHYXA7XG5cbiAgICAgICAgICAgIC8qIFRoZSBhbW91bnQgb2Ygc3BhY2UgdGhhdCB3aWxsIGJlIHRha2VuIHVwIGluIHRoZSBwYW5lbCBieSBhbGwgcHJldmlvdXMgdmVydGljZXMgKmFuZCogZ2Fwcy4gKi9cbiAgICAgICAgICAgIGNvbnN0IEN1bXVsYXRpdmVQcmluY2lwYWxEaXN0YW5jZTogbnVtYmVyID1cbiAgICAgICAgICAgICAgICBDdW11bGF0aXZlUHJldmlvdXNSYXRpb3MgKiBQYXJlbnRXb3JrUHJpbmNpcGFsTWVhc3VyZSArIEN1bXVsYXRpdmVQcmV2aW91c0dhcHM7XG5cbiAgICAgICAgICAgIGNvbnN0IFg6IG51bWJlciA9IE1hdGgucm91bmQoXG4gICAgICAgICAgICAgICAgUGFyZW50LlR5cGUgPT09IFwiSG9yaXpvbnRhbFwiXG4gICAgICAgICAgICAgICAgICAgID8gUGFyZW50R2FwRGF0YS5BZGp1c3RlZFNpemUuWCArIEN1bXVsYXRpdmVQcmluY2lwYWxEaXN0YW5jZVxuICAgICAgICAgICAgICAgICAgICA6IFBhcmVudEdhcERhdGEuQWRqdXN0ZWRTaXplLlhcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IFk6IG51bWJlciA9IE1hdGgucm91bmQoXG4gICAgICAgICAgICAgICAgUGFyZW50LlR5cGUgPT09IFwiSG9yaXpvbnRhbFwiXG4gICAgICAgICAgICAgICAgICAgID8gUGFyZW50R2FwRGF0YS5BZGp1c3RlZFNpemUuWVxuICAgICAgICAgICAgICAgICAgICA6IFBhcmVudEdhcERhdGEuQWRqdXN0ZWRTaXplLlkgKyBDdW11bGF0aXZlUHJpbmNpcGFsRGlzdGFuY2VcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IEhlaWdodDogbnVtYmVyID0gTWF0aC5yb3VuZChcbiAgICAgICAgICAgICAgICBQYXJlbnQuVHlwZSA9PT0gXCJIb3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgICAgICAgPyBQYXJlbnRHYXBEYXRhLkFkanVzdGVkU2l6ZS5IZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgOiBQcmluY2lwYWxSYXRpbyAqIFBhcmVudFdvcmtQcmluY2lwYWxNZWFzdXJlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBXaWR0aDogbnVtYmVyID0gTWF0aC5yb3VuZChcbiAgICAgICAgICAgICAgICBQYXJlbnQuVHlwZSA9PT0gXCJIb3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgICAgICAgPyBQcmluY2lwYWxSYXRpbyAqIFBhcmVudFdvcmtQcmluY2lwYWxNZWFzdXJlXG4gICAgICAgICAgICAgICAgICAgIDogUGFyZW50R2FwRGF0YS5BZGp1c3RlZFNpemUuV2lkdGhcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIEdhcERhdGEuc2V0KFxuICAgICAgICAgICAgICAgIFZlcnRleCxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIEFkanVzdGVkU2l6ZTpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBYLFxuICAgICAgICAgICAgICAgICAgICAgICAgWVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBQcmluY2lwYWxSYXRpb1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgT3V0OiBUTWFwPEZWZXJ0ZXgsIEZCb3g+ID0gbmV3IE1hcDxGVmVydGV4LCBGQm94PigpO1xuXG4gICAgR2FwRGF0YS5mb3JFYWNoKChHYXBEYXRhOiBGR2FwRGF0YSwgVmVydGV4OiBGVmVydGV4KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgT3V0LnNldChWZXJ0ZXgsIEdhcERhdGEuQWRqdXN0ZWRTaXplKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBPdXQ7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0UmVhbFNpemUoSW5WZXJ0ZXg6IEZWZXJ0ZXgpOiBQcm9taXNlPEZCb3ggfCB1bmRlZmluZWQ+XG57XG4gICAgY29uc3QgeyBHYXAgfSA9IGF3YWl0IEdldFNldHRpbmdzKCk7XG4gICAgY29uc3QgSXNHYXBOb256ZXJvOiBib29sZWFuID0gR2FwID4gMDtcbiAgICBpZiAoSXNHYXBOb256ZXJvKVxuICAgIHtcbiAgICAgICAgY29uc3QgR2FwQWRqdXN0ZWRTaXplczogVE1hcDxGVmVydGV4LCBGQm94PiB8IHVuZGVmaW5lZCA9IGF3YWl0IENvbXB1dGVHYXBEYXRhKCk7XG5cbiAgICAgICAgY29uc3QgVmVydGV4R2FwQWRqdXN0ZWRTaXplOiBGQm94IHwgdW5kZWZpbmVkID0gR2FwQWRqdXN0ZWRTaXplcy5nZXQoSW5WZXJ0ZXgpO1xuICAgICAgICBpZiAoVmVydGV4R2FwQWRqdXN0ZWRTaXplICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJ0ZXhHYXBBZGp1c3RlZFNpemU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBJblZlcnRleC5TaXplO1xuICAgIH1cbn07XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQdWJsaXNoKCk6IFByb21pc2U8dm9pZD5cbntcbiAgICBjb25zdCB7IEdhcCB9ID0gYXdhaXQgR2V0U2V0dGluZ3MoKTtcbiAgICBjb25zdCBJc0dhcE5vbnplcm86IGJvb2xlYW4gPSBHYXAgPiAwO1xuICAgIGNvbnN0IEdhcEFkanVzdGVkU2l6ZXM6IFRNYXA8RlZlcnRleCwgRkJveD4gfCB1bmRlZmluZWQgPSBJc0dhcE5vbnplcm9cbiAgICAgICAgPyBhd2FpdCBDb21wdXRlR2FwRGF0YSgpXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChJc0NlbGwoVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKElzR2FwTm9uemVybylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoR2FwQWRqdXN0ZWRTaXplcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgQWRqdXN0ZWRTaXplOiBGQm94IHwgdW5kZWZpbmVkID0gR2FwQWRqdXN0ZWRTaXplcy5nZXQoVmVydGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEFkanVzdGVkU2l6ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZXRXaW5kb3dQb3NpdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZXJ0ZXguSGFuZGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkanVzdGVkU2l6ZVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nKGBDZWxsICR7IEdldFdpbmRvd1RpdGxlKFZlcnRleC5IYW5kbGUpLnNsaWNlKDAsIDEyKSB9IGhhcyBib3VuZHMgJHsgQm94VG9TdHJpbmcoQWRqdXN0ZWRTaXplKSB9LmApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFNldFdpbmRvd1Bvc2l0aW9uKFxuICAgICAgICAgICAgICAgICAgICBWZXJ0ZXguSGFuZGxlLFxuICAgICAgICAgICAgICAgICAgICBWZXJ0ZXguU2l6ZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IFRpbGVkV2luZG93czogQXJyYXk8SFdpbmRvdz4gPSBbIF07XG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChJc0NlbGwoVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgVGlsZWRXaW5kb3dzLnB1c2goVmVydGV4LkhhbmRsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICBVcGRhdGVUaWxlZExpc3QoVGlsZWRXaW5kb3dzKTtcbn07XG5cbmNvbnN0IFBhbmVsQ29udGFpbnNWZXJ0ZXggPSAoY3VycmVudFZlcnRleDogRlZlcnRleCwgdGFyZ2V0VmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9Plxue1xuICAgIGlmIChjdXJyZW50VmVydGV4ID09PSB0YXJnZXRWZXJ0ZXgpXG4gICAge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIGlzIGEgcGFuZWwsIGNoZWNrIGl0cyBjaGlsZHJlbiByZWN1cnNpdmVseVxuICAgIGlmIChcIkNoaWxkcmVuXCIgaW4gY3VycmVudFZlcnRleClcbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY3VycmVudFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKFBhbmVsQ29udGFpbnNWZXJ0ZXgoY2hpbGQsIHRhcmdldFZlcnRleCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0Um9vdFBhbmVsKFZlcnRleDogRlZlcnRleCk6IEZQYW5lbCB8IHVuZGVmaW5lZFxue1xuICAgIGZvciAoY29uc3QgUGFuZWwgb2YgRm9yZXN0KVxuICAgIHtcbiAgICAgICAgaWYgKFBhbmVsQ29udGFpbnNWZXJ0ZXgoUGFuZWwsIFZlcnRleCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBQYW5lbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5mdW5jdGlvbiBHZXRQYW5lbEFwcGxpY2F0aW9uTmFtZXMoUGFuZWw6IEZQYW5lbCk6IFRBcnJheTxzdHJpbmc+XG57XG4gICAgY29uc3QgUmVzdWx0TmFtZXM6IFRBcnJheTxzdHJpbmc+ID0gWyBdO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChcIkhhbmRsZVwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgRnJpZW5kbHlOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBHZXRBcHBsaWNhdGlvbkZyaWVuZGx5TmFtZShWZXJ0ZXguSGFuZGxlKTtcbiAgICAgICAgICAgIGlmIChGcmllbmRseU5hbWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZXN1bHROYW1lcy5wdXNoKEZyaWVuZGx5TmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChSZXN1bHROYW1lcy5sZW5ndGggPj0gMylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LCBQYW5lbCk7XG5cbiAgICByZXR1cm4gUmVzdWx0TmFtZXM7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQW5ub3RhdGVQYW5lbChQYW5lbDogRlBhbmVsKTogRkFubm90YXRlZFBhbmVsIHwgdW5kZWZpbmVkXG57XG4gICAgY29uc3QgUm9vdFBhbmVsOiBGUGFuZWwgfCB1bmRlZmluZWQgPSBHZXRSb290UGFuZWwoUGFuZWwpO1xuICAgIGlmIChSb290UGFuZWwgIT09IHVuZGVmaW5lZCAmJiBSb290UGFuZWwuTW9uaXRvcklkICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBjb25zdCBBcHBsaWNhdGlvbk5hbWVzOiBUQXJyYXk8c3RyaW5nPiA9IEdldFBhbmVsQXBwbGljYXRpb25OYW1lcyhQYW5lbCk7XG4gICAgICAgIGNvbnN0IElzUm9vdDogYm9vbGVhbiA9IFJvb3RQYW5lbCA9PT0gUGFuZWw7XG4gICAgICAgIGNvbnN0IE1vbml0b3I6IHN0cmluZyA9IEdldE1vbml0b3JGcmllbmRseU5hbWUoUm9vdFBhbmVsLk1vbml0b3JJZCkgfHwgXCJcIjtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uUGFuZWwsXG5cbiAgICAgICAgICAgIEFwcGxpY2F0aW9uTmFtZXMsXG4gICAgICAgICAgICBJc1Jvb3QsXG4gICAgICAgICAgICBNb25pdG9yTmFtZTogTW9uaXRvcixcbiAgICAgICAgICAgIFNjcmVlbnNob3Q6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR2V0UGFuZWxTY3JlZW5zaG90KFBhbmVsOiBGUGFuZWwpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD5cbntcbiAgICBjb25zdCBTY3JlZW5zaG90UGF0aDogc3RyaW5nID0gQ2FwdHVyZVNjcmVlblNlY3Rpb25Ub1RlbXBQbmdGaWxlKFBhbmVsLlNpemUpO1xuXG4gICAgcmV0dXJuIGF3YWl0IEdldFBuZ0Jhc2U2NChTY3JlZW5zaG90UGF0aCk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gTWFrZVNpemVzVW5pZm9ybShQYW5lbDogRlBhbmVsKTogdm9pZFxue1xuICAgIFBhbmVsLkNoaWxkcmVuLmZvckVhY2goKENoaWxkOiBGVmVydGV4LCBJbmRleDogbnVtYmVyKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKFBhbmVsLlR5cGUgPT09IFwiSG9yaXpvbnRhbFwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBDaGlsZC5TaXplLldpZHRoID0gTWF0aC5mbG9vcihQYW5lbC5TaXplLldpZHRoIC8gUGFuZWwuQ2hpbGRyZW4ubGVuZ3RoKTtcbiAgICAgICAgICAgIENoaWxkLlNpemUuWCA9IFBhbmVsLlNpemUuWCArIEluZGV4ICogQ2hpbGQuU2l6ZS5XaWR0aDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuSGVpZ2h0ID0gUGFuZWwuU2l6ZS5IZWlnaHQ7XG4gICAgICAgICAgICBDaGlsZC5TaXplLlkgPSBQYW5lbC5TaXplLlk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoUGFuZWwuVHlwZSA9PT0gXCJWZXJ0aWNhbFwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBDaGlsZC5TaXplLkhlaWdodCA9IE1hdGguZmxvb3IoUGFuZWwuU2l6ZS5IZWlnaHQgLyBQYW5lbC5DaGlsZHJlbi5sZW5ndGgpO1xuICAgICAgICAgICAgQ2hpbGQuU2l6ZS5ZID0gUGFuZWwuU2l6ZS5ZICsgSW5kZXggKiBDaGlsZC5TaXplLkhlaWdodDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuV2lkdGggPSBQYW5lbC5TaXplLldpZHRoO1xuICAgICAgICAgICAgQ2hpbGQuU2l6ZS5YID0gUGFuZWwuU2l6ZS5YO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gSXNQYW5lbEFubm90YXRlZChcbiAgICBQYW5lbDogRlBhbmVsIHwgRkFubm90YXRlZFBhbmVsXG4pOiBQYW5lbCBpcyBGQW5ub3RhdGVkUGFuZWxcbntcbiAgICByZXR1cm4gXCJTY3JlZW5zaG90XCIgaW4gUGFuZWw7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0Q3VycmVudFBhbmVsKCk6IEZQYW5lbCB8IHVuZGVmaW5lZFxue1xuICAgIGNvbnN0IEhhbmRsZTogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgIGlmIChIYW5kbGUgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIHJldHVybiBGaW5kKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChJc1BhbmVsKFZlcnRleCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFZlcnRleC5DaGlsZHJlbi5zb21lKChDaGlsZDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJc0NlbGwoQ2hpbGQpICYmIEFyZUhhbmRsZXNFcXVhbChDaGlsZC5IYW5kbGUsIEhhbmRsZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSBhcyBGUGFuZWwgfCB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEJyaW5nSW50b1BhbmVsKFxuICAgIEluUGFuZWw6IEZQYW5lbCB8IEZBbm5vdGF0ZWRQYW5lbCxcbiAgICBIYW5kbGU6IEhXaW5kb3dcbik6IEZDZWxsIHwgdW5kZWZpbmVkXG57XG4gICAgaWYgKEhhbmRsZSAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYEJyaW5naW5nSW50b1BhbmVsOiAkeyBHZXRXaW5kb3dUaXRsZShIYW5kbGUpIH0uYCk7XG4gICAgICAgIGNvbnN0IFBhbmVsOiBGUGFuZWwgfCB1bmRlZmluZWQgPSBJc1BhbmVsQW5ub3RhdGVkKEluUGFuZWwpXG4gICAgICAgICAgICA/IEdldFBhbmVsRnJvbUFubm90YXRlZChJblBhbmVsKVxuICAgICAgICAgICAgOiBJblBhbmVsO1xuXG4gICAgICAgIGlmIChQYW5lbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJyaW5nSW50b1BhbmVsOiBQYW5lbEZyb21Bbm5vdGF0ZWQgd2FzIGRlZmluZWQhXCIpO1xuICAgICAgICAgICAgLyogSWYgdGhlIHdpbmRvdyBpcyBtYXhpbWl6ZWQsIHRoZW4gc2V0dGluZyBpdHMgcG9zaXRpb24gY2FuIGNhdXNlIGl0IHRvIGJlY29tZSB3aGl0ZS4gKi9cbiAgICAgICAgICAgIFJlc3RvcmVXaW5kb3coSGFuZGxlKTtcbiAgICAgICAgICAgIGNvbnN0IE91dENlbGw6IEZDZWxsID0gQ2VsbChIYW5kbGUpO1xuICAgICAgICAgICAgUGFuZWwuQ2hpbGRyZW4ucHVzaChPdXRDZWxsKTtcbiAgICAgICAgICAgIE1ha2VTaXplc1VuaWZvcm0oUGFuZWwpO1xuICAgICAgICAgICAgUHVibGlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIE91dENlbGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkJyaW5nSW50b1BhbmVsOiBQYW5lbEZyb21Bbm5vdGF0ZWQgd2FzIFVOREVGSU5FRC5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEZpbmQoUHJlZGljYXRlOiBUUHJlZGljYXRlPEZWZXJ0ZXg+KTogRlZlcnRleCB8IHVuZGVmaW5lZFxue1xuICAgIGxldCBPdXQ6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBUcmF2ZXJzZSgoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKE91dCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBTYXRpc2ZpZXM6IGJvb2xlYW4gPSBQcmVkaWNhdGUoVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChTYXRpc2ZpZXMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT3V0ID0gVmVydGV4O1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gT3V0O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIElzUGFuZWwoVmVydGV4OiBGVmVydGV4KTogVmVydGV4IGlzIEZQYW5lbFxue1xuICAgIHJldHVybiBcIkNoaWxkcmVuXCIgaW4gVmVydGV4O1xufVxuXG4vLyBjb25zdCBGb3JtYXRQYW5lbCA9IChJblBhbmVsOiBGUGFuZWwgfCBGQW5ub3RhdGVkUGFuZWwpOiBzdHJpbmcgPT5cbi8vIHtcbi8vICAgICByZXR1cm4gXCJcIjtcbi8vIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRQYW5lbEZyb21Bbm5vdGF0ZWQoUGFuZWw6IEZBbm5vdGF0ZWRQYW5lbCk6IEZQYW5lbCB8IHVuZGVmaW5lZFxue1xuICAgIGNvbnN0IExvZ2dlZFBhbmVsOiBQYXJ0aWFsPEZQYW5lbD4gPVxuICAgICAgICB7XG4gICAgICAgICAgICBTaXplOiBQYW5lbC5TaXplLFxuICAgICAgICAgICAgVHlwZTogUGFuZWwuVHlwZVxuICAgICAgICB9O1xuXG4gICAgTG9nKFwiQmVnaW5zIEdldFBhbmVsRnJvbUFubm90YXRlZCwgUGFuZWwgaXNcIiwgTG9nZ2VkUGFuZWwpO1xuICAgIHJldHVybiBGaW5kKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoSXNQYW5lbChWZXJ0ZXgpKVxuICAgICAgICB7XG4gICAgICAgICAgICBMb2coXCJWZXJ0ZXggaXMgYSBwYW5lbC5cIiwgVmVydGV4KTtcbiAgICAgICAgICAgIGNvbnN0IEFyZUVxdWFsOiBib29sZWFuID0gQXJlUGFuZWxzRXF1YWwoUGFuZWwsIFZlcnRleCk7XG5cbiAgICAgICAgICAgIGlmIChBcmVFcXVhbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBMb2coXCJQYW5lbHMgYXJlIGVxdWFsXCIsIFBhbmVsLCBWZXJ0ZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIExvZyhcIlBhbmVscyBhcmUgTk9UIGVxdWFsXCIsIFBhbmVsLCBWZXJ0ZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gQXJlRXF1YWw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBMb2coXCJWZXJ0ZXggd2FzIE5PVCBhIHBhbmVsXCIsIFZlcnRleCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KSBhcyBGUGFuZWwgfCB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIEdldCBhbiB7QGxpbmsgRlBhbmVsfSBmcm9tIGEgZ2l2ZW4ge0BsaW5rIEZBbm5vdGF0ZWRQYW5lbH0uXG4gKlxuICogQHBhcmFtIEFubm90YXRlZFBhbmVsIC0gVGhlIHtAbGluayBGQW5ub3RhdGVkUGFuZWx9IGZyb20gd2hpY2ggdGhlIGFubm90YXRpb25zXG4gKiB3aWxsIGJlIHJlbW92ZWQuXG4gKlxuICogQHJldHVybnMge0ZQYW5lbH0gVGhlIHtAbGluayBGUGFuZWx9IHRoYXQgY29uc3RpdHV0ZWQgdGhlIGdpdmVuIHtAbGluayBBbm5vdGF0ZWRQYW5lbH0sXG4gKiB3aXRob3V0IHRoZSBhbm5vdGF0aW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFJlbW92ZUFubm90YXRpb25zKEFubm90YXRlZFBhbmVsOiBGQW5ub3RhdGVkUGFuZWwpOiBGUGFuZWxcbntcbiAgICByZXR1cm4ge1xuICAgICAgICBDaGlsZHJlbjogQW5ub3RhdGVkUGFuZWwuQ2hpbGRyZW4sXG4gICAgICAgIE1vbml0b3JJZDogQW5ub3RhdGVkUGFuZWwuTW9uaXRvcklkLFxuICAgICAgICBTaXplOiBBbm5vdGF0ZWRQYW5lbC5TaXplLFxuICAgICAgICBUeXBlOiBBbm5vdGF0ZWRQYW5lbC5UeXBlLFxuICAgICAgICBaT3JkZXI6IEFubm90YXRlZFBhbmVsLlpPcmRlclxuICAgIH07XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0d28gcGFuZWxzIGFyZSBlcXVhbC5cbiAqXG4gKiBAcGFyYW0gQSAtIFRoZSBmaXJzdCB7QGxpbmsgRlBhbmVsfSBhcmd1bWVudC5cbiAqIEBwYXJhbSBCIC0gVGhlIHNlY29uZCB7QGxpbmsgRlBhbmVsfSBhcmd1bWVudC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB7QGxpbmsgQX0gYW5kIHtAbGluayBCfSBhcmUgZXF1YWwuXG4gKi9cbmZ1bmN0aW9uIEFyZVBhbmVsc0VxdWFsKEE6IEZQYW5lbCwgQjogRlBhbmVsKTogYm9vbGVhblxue1xuICAgIC8vIEBUT0RPIFRvIHN1cHBvcnQgc3RhY2sgYm94ZXMsIGNoZWNrIGlmIGNoaWxkcmVuIGFyZSBhbHNvIGVxdWFsIGFzIHdlbGwuXG4gICAgcmV0dXJuIEEuQ2hpbGRyZW4ubGVuZ3RoID09PSBCLkNoaWxkcmVuLmxlbmd0aCAmJiBBcmVCb3hlc0VxdWFsKEEuU2l6ZSwgQi5TaXplKTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHR3byB2ZXJ0aWNlcyBhcmUgZXF1YWwuXG4gKlxuICogQHBhcmFtIEEgLSBUaGUgZmlyc3Qge0BsaW5rIEZWZXJ0ZXh9IGFyZ3VtZW50LlxuICogQHBhcmFtIEIgLSBUaGUgc2Vjb25kIHtAbGluayBGVmVydGV4fSBhcmd1bWVudC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB7QGxpbmsgQX0gYW5kIHtAbGluayBCfSBhcmUgZXF1YWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBBcmVWZXJ0aWNlc0VxdWFsKEE6IEZWZXJ0ZXgsIEI6IEZWZXJ0ZXgpOiBib29sZWFuXG57XG4gICAgaWYgKElzQ2VsbChBKSAmJiBJc0NlbGwoQikpXG4gICAge1xuICAgICAgICByZXR1cm4gQXJlSGFuZGxlc0VxdWFsKEEuSGFuZGxlLCBCLkhhbmRsZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKElzUGFuZWwoQSkgJiYgSXNQYW5lbChCKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBBcmVQYW5lbHNFcXVhbChBLCBCKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5cbi8qKlxuICogR2V0IHRoZSBwYXJlbnQgdmVydGV4IG9mIGBWZXJ0ZXhgLiAgUmV0dXJucyB1bmRlZmluZWQgaWZmIGl0IGlzIGEgcm9vdCBwYW5lbC5cbiAqXG4gKiBAcGFyYW0gVmVydGV4IC0gVGhlIHtAbGluayBGVmVydGV4fSB3aG9zZSBwYXJlbnQgaXMgcmV0dXJuZWQgYnkgdGhpcyBmdW5jdGlvbixcbiAqIGlmIHRoZSBnaXZlbiB7QGxpbmsgRlZlcnRleH0gaGFzIGEgcGFyZW50LlxuICpcbiAqIEByZXR1cm5zIHtGUGFuZWwgfCB1bmRlZmluZWR9IFRoZSBwYXJlbnQgb2YgdGhlIGdpdmVuIHtAbGluayBWZXJ0ZXh9LCBpZiB0aGUgZ2l2ZW5cbiAqIHtAbGluayBWZXJ0ZXh9IGhhcyBhIHBhcmVudCAob3RoZXJ3aXNlIGB1bmRlZmluZWRgKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEdldFBhcmVudChWZXJ0ZXg6IEZWZXJ0ZXgpOiBGUGFuZWwgfCB1bmRlZmluZWRcbntcbiAgICByZXR1cm4gRmluZCgoSW5WZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoSXNQYW5lbChJblZlcnRleCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBJblZlcnRleC5DaGlsZHJlbi5zb21lKChJbkNoaWxkOiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcmVWZXJ0aWNlc0VxdWFsKFZlcnRleCwgSW5DaGlsZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pIGFzIEZQYW5lbCB8IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogR2V0IHRoZSBpbmRleCBvZiB0aGUgZ2l2ZW4gYFZlcnRleGAgaW4gaXRzIHBhcmVudCBwYW5lbC5cbiAqXG4gKiBAcGFyYW0gVmVydGV4IC0gVGhlIHZlcnRleCB3aG9zZSBpbmRleCBpbiBpdHMgcGFyZW50IHBhbmVsIGlzIHJldHVybmVkIGJ5IHRoaXMuXG4gKlxuICogQHJldHVybnMge251bWJlciB8IHVuZGVmaW5lZH0gVGhlIGluZGV4IG9mIHRoZSBnaXZlbiB7QGxpbmsgVmVydGV4fSBpbiBpdHNcbiAqIGNvbnRhaW5pbmcgcGFuZWwuICBJZiB0aGUgZ2l2ZW4ge0BsaW5rIFZlcnRleH0gZG9lcyBub3QgaGF2ZSBhIHBhcmVudCBwYW5lbCxcbiAqIHRoZW4gdGhpcyBmdW5jdGlvbiByZXR1cm5zIGB1bmRlZmluZWRgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gR2V0SW5kZXhJblBhbmVsKFZlcnRleDogRlZlcnRleCk6IG51bWJlciB8IHVuZGVmaW5lZFxue1xuICAgIGNvbnN0IFBhcmVudFBhbmVsOiBGUGFuZWwgfCB1bmRlZmluZWQgPSBHZXRQYXJlbnQoVmVydGV4KTtcbiAgICBpZiAoUGFyZW50UGFuZWwgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IFNlbGY6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPSBQYXJlbnRQYW5lbC5DaGlsZHJlbi5maW5kKChDaGlsZDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEFyZVZlcnRpY2VzRXF1YWwoVmVydGV4LCBDaGlsZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChTZWxmICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBQYXJlbnRQYW5lbC5DaGlsZHJlbi5pbmRleE9mKFNlbGYpO1xuXG4gICAgICAgICAgICBpZiAoSW5kZXggPT09IC0xKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn07XG5cbmxldCBJbnRlcmltRm9jdXNlZFZlcnRleDogRlZlcnRleCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuZXhwb3J0IGZ1bmN0aW9uIFNldEludGVyaW1Gb2N1c2VkVmVydGV4VG9BY3RpdmUoKTogdm9pZFxue1xuICAgIGNvbnN0IEFjdGl2ZVdpbmRvdzogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgIGlmIChBY3RpdmVXaW5kb3cgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIEludGVyaW1Gb2N1c2VkVmVydGV4ID0gR2V0Q2VsbEZyb21IYW5kbGUoQWN0aXZlV2luZG93KTtcbiAgICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXgoKTogRlZlcnRleCB8IHVuZGVmaW5lZFxue1xuICAgIHJldHVybiBJbnRlcmltRm9jdXNlZFZlcnRleDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBDbGVhckludGVyaW1Gb2N1c2VkVmVydGV4KCk6IHZvaWRcbntcbiAgICBJbnRlcmltRm9jdXNlZFZlcnRleCA9IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBWZXJ0ZXhUb1N0cmluZyhWZXJ0ZXg6IEZWZXJ0ZXgpOiBzdHJpbmdcbntcbiAgICByZXR1cm4gSXNDZWxsKFZlcnRleClcbiAgICAgICAgPyBHZXRXaW5kb3dUaXRsZShWZXJ0ZXguSGFuZGxlKVxuICAgICAgICA6IGAkeyBWZXJ0ZXguVHlwZSB9IHBhbmVsIHdpdGggJHsgVmVydGV4LkNoaWxkcmVuLmxlbmd0aCB9IGNoaWxkcmVuLmA7XG59O1xuXG4vLyBsZXQgQ2hhbmdlRm9jdXNEZWJvdW5jZVRpbWU6IG51bWJlciA9IDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBDaGFuZ2VGb2N1cyhGb2N1c0NoYW5nZTogRkZvY3VzQ2hhbmdlKTogdm9pZFxue1xuICAgIC8vIGNvbnN0IE5vdzogbnVtYmVyID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgLy8gY29uc3QgRGVib3VuY2VEdXJhdGlvbjogbnVtYmVyID0gNTA7XG4gICAgLy8gaWYgKE1hdGguYWJzKE5vdyAtIENoYW5nZUZvY3VzRGVib3VuY2VUaW1lKSA8PSBEZWJvdW5jZUR1cmF0aW9uICYmIENoYW5nZUZvY3VzRGVib3VuY2VUaW1lICE9PSAwKVxuICAgIC8vIHtcbiAgICAvLyAgICAgTG9nKGBDaGFuZ2VGb2N1cyB3YXMgY2FsbGVkIHRvbyBzb29uLCBqdXN0ICR7IE5vdyAtIENoYW5nZUZvY3VzRGVib3VuY2VUaW1lIH1tcyBhZ28uYCk7XG4gICAgLy8gICAgIHJldHVybjtcbiAgICAvLyB9XG4gICAgLy8gZWxzZVxuICAgIC8vIHtcbiAgICAvLyAgICAgQ2hhbmdlRm9jdXNEZWJvdW5jZVRpbWUgPSBOb3c7XG4gICAgLy8gfVxuXG4gICAgY29uc3QgTG9nQ2hhbmdlRm9jdXMgPSAoKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgTG9nRm9yZXN0KChWZXJ0ZXg6IEZWZXJ0ZXgsIF9EZXB0aDogbnVtYmVyLCBEZWZhdWx0U3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgUG9zaXRpb25TdHJpbmc6IHN0cmluZyA9IGAoJHsgVmVydGV4LlNpemUuWCB9LCAkeyBWZXJ0ZXguU2l6ZS5ZIH0pYDtcbiAgICAgICAgICAgIHJldHVybiBWZXJ0ZXggPT09IEludGVyaW1Gb2N1c2VkVmVydGV4XG4gICAgICAgICAgICAgICAgPyBgJHsgRGVmYXVsdFN0cmluZyB9ICR7IFBvc2l0aW9uU3RyaW5nIH0gKiogSU5URVJJTSAqKmBcbiAgICAgICAgICAgICAgICA6IGAkeyBEZWZhdWx0U3RyaW5nIH0gJHsgUG9zaXRpb25TdHJpbmcgfWA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoSW50ZXJpbUZvY3VzZWRWZXJ0ZXggPT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IEFjdGl2ZVdpbmRvdzogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgICAgICBpZiAoQWN0aXZlV2luZG93ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IEFjdGl2ZVdpbmRvd1Bvc2l0aW9uOiBGQm94ID0gR2V0V2luZG93U2hhcGUoQWN0aXZlV2luZG93KTtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgICAgIExvZyhgSW4gQ2hhbmdlRm9jdXMsIHRoZSBBY3RpdmVXaW5kb3cgaXMgJHsgR2V0V2luZG93VGl0bGUoQWN0aXZlV2luZG93KSB9IGF0ICR7IFBvc2l0aW9uVG9TdHJpbmcoQWN0aXZlV2luZG93UG9zaXRpb24pIH0uYCk7XG4gICAgICAgICAgICBJbnRlcmltRm9jdXNlZFZlcnRleCA9IEdldENlbGxGcm9tSGFuZGxlKEFjdGl2ZVdpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBMb2coXCJXaG9vcHMuLi5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgIExvZyhgSW4gQ2hhbmdlRm9jdXMsIEludGVyaW1Gb2N1c2VkVmVydGV4IHdhcyBhbHJlYWR5IGRlZmluZWQgYW5kIGlzICR7IFZlcnRleFRvU3RyaW5nKEludGVyaW1Gb2N1c2VkVmVydGV4KSB9IGF0ICR7IFBvc2l0aW9uVG9TdHJpbmcoSW50ZXJpbUZvY3VzZWRWZXJ0ZXguU2l6ZSkgfS5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBQYXJlbnRQYW5lbDogRlZlcnRleCB8IHVuZGVmaW5lZCA9IEdldFBhcmVudChJbnRlcmltRm9jdXNlZFZlcnRleCk7XG4gICAgLy8gLyogSSBoYXZlIG5vIGlkZWEgd2h5IHRoaXMgaXMgbmVlZGVkLiAqL1xuICAgIC8vIGlmIChQYXJlbnRQYW5lbCAhPT0gdW5kZWZpbmVkKVxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgTmV3SW5kZXg6IG51bWJlciA9IFBhcmVudFBhbmVsLkNoaWxkcmVuLmluZGV4T2YoSW50ZXJpbUZvY3VzZWRWZXJ0ZXgpICsgMTtcbiAgICAvLyAgICAgTG9nKGBJbiBDaGFuZ2VGb2N1cywgTmV3SW5kZXggaXMgJHsgTmV3SW5kZXggfS5gKTtcbiAgICAvLyAgICAgSW50ZXJpbUZvY3VzZWRWZXJ0ZXggPSBQYXJlbnRQYW5lbC5DaGlsZHJlbltOZXdJbmRleF07XG4gICAgLy8gfVxuXG4gICAgTG9nKFwiQmVmb3JlIENoYW5naW5nIEZvY3VzLCB0aGlzIGlzIHRoZSBjdXJyZW50IEZvcmVzdDpcIik7XG4gICAgTG9nQ2hhbmdlRm9jdXMoKTtcblxuICAgIHN3aXRjaCAoRm9jdXNDaGFuZ2UpXG4gICAge1xuICAgICAgICBjYXNlIFwiRG93blwiOlxuICAgICAgICAgICAgaWYgKElzUGFuZWwoSW50ZXJpbUZvY3VzZWRWZXJ0ZXgpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEludGVyaW1Gb2N1c2VkVmVydGV4ID0gSW50ZXJpbUZvY3VzZWRWZXJ0ZXguQ2hpbGRyZW5bMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiVXBcIjpcbiAgICAgICAgICAgIGlmIChQYXJlbnRQYW5lbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEludGVyaW1Gb2N1c2VkVmVydGV4ID0gUGFyZW50UGFuZWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiTmV4dFwiOlxuICAgICAgICAgICAgaWYgKFBhcmVudFBhbmVsICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgSW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCA9IEdldEluZGV4SW5QYW5lbChJbnRlcmltRm9jdXNlZFZlcnRleCk7XG4gICAgICAgICAgICAgICAgaWYgKEluZGV4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoSW5kZXggIT09IFBhcmVudFBhbmVsLkNoaWxkcmVuLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEludGVyaW1Gb2N1c2VkVmVydGV4ID0gUGFyZW50UGFuZWwuQ2hpbGRyZW5bSW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEludGVyaW1Gb2N1c2VkVmVydGV4ID0gUGFyZW50UGFuZWwuQ2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiUHJldmlvdXNcIjpcbiAgICAgICAgICAgIGlmIChQYXJlbnRQYW5lbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRJbmRleEluUGFuZWwoSW50ZXJpbUZvY3VzZWRWZXJ0ZXgpO1xuICAgICAgICAgICAgICAgIExvZy5WZXJib3NlKGBJbkNoYW5nZUZvY3VzLCB1bmRlciBjYXNlIFwiUHJldmlvdXNcIiwgSW5kZXggaXMgJHsgSW5kZXggfS5gKTtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICAgICAgTG9nKGBBZnRlciBnZXR0aW5nIHRoZSBJbmRleCB1bmRlciBjYXNlIFwiUHJldmlvdXNcIiwgdGhlIEludGVyaW1Gb2N1c2VkVmVydGV4IGhhcyBwb3NpdGlvbiAoJHsgSW50ZXJpbUZvY3VzZWRWZXJ0ZXguU2l6ZS5YIH0sICR7IEludGVyaW1Gb2N1c2VkVmVydGV4LlNpemUuWSB9KS5gKTtcbiAgICAgICAgICAgICAgICBpZiAoSW5kZXggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChJbmRleCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgSW50ZXJpbUZvY3VzZWRWZXJ0ZXggPSBQYXJlbnRQYW5lbC5DaGlsZHJlbltQYXJlbnRQYW5lbC5DaGlsZHJlbi5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEludGVyaW1Gb2N1c2VkVmVydGV4ID0gUGFyZW50UGFuZWwuQ2hpbGRyZW5bSW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBMb2coXCJXaG9vcHMuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgTG9nKFwiQWZ0ZXIgQ2hhbmdpbmcgRm9jdXMsIHRoaXMgaXMgdGhlIGN1cnJlbnQgRm9yZXN0OlwiKTtcbiAgICBMb2dDaGFuZ2VGb2N1cygpO1xufTtcblxuLyoqXG4gKiBHaXZlbiBhIHBhbmVsLCBnZXQgaXRzIDB0aCBjZWxsLlxuICpcbiAqIEB0b2RvIENvbnNpZGVyIG1vZGlmeWluZyB0aGlzIHN1Y2ggdGhhdCBpZiB0aGUgMHRoIGNoaWxkIG9mIHRoZSBwYW5lbCBpcyBhIHBhbmVsIHdpdGggbm8gY2hpbGRyZW4sXG4gKiB0aGVuIHRyeSB0aGUgMXN0IGNoaWxkLCAybmQsIGV0Yy5cbiAqXG4gKiBAcGFyYW0gUGFuZWwgLSBUaGUgcGFuZWwgd2hvc2UgemVyb3RoIHtAbGluayBGQ2VsbH0gaXMgcmV0dXJuZWQgYnkgdGhpcy5cbiAqXG4gKiBAcmV0dXJucyB7RkNlbGwgfCB1bmRlZmluZWR9IFRoZSB6ZXJvdGgge0BsaW5rIEZDZWxsfSBvZiB0aGUgZ2l2ZW4ge0BsaW5rIFBhbmVsfS5cbiAqIElmIHRoZSBnaXZlbiB7QGxpbmsgUGFuZWx9IGhhcyBubyBjaGlsZHJlbiwgdGhlbiBgdW5kZWZpbmVkYCBpcyByZXR1cm5lZC5cbiAqL1xuZnVuY3Rpb24gR2V0WmVyb3RoQ2VsbChQYW5lbDogRlBhbmVsKTogRkNlbGwgfCB1bmRlZmluZWRcbntcbiAgICBpZiAoUGFuZWwuQ2hpbGRyZW5bMF0gIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIHJldHVybiBJc0NlbGwoUGFuZWwuQ2hpbGRyZW5bMF0pXG4gICAgICAgICAgICA/IFBhbmVsLkNoaWxkcmVuWzBdXG4gICAgICAgICAgICA6IEdldFplcm90aENlbGwoUGFuZWwuQ2hpbGRyZW5bMF0pO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBGaW5pc2hGb2N1cygpOiB2b2lkXG57XG4gICAgaWYgKEludGVyaW1Gb2N1c2VkVmVydGV4ICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBpZiAoSXNDZWxsKEludGVyaW1Gb2N1c2VkVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgU2V0Rm9yZWdyb3VuZFdpbmRvdyhJbnRlcmltRm9jdXNlZFZlcnRleC5IYW5kbGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEludGVyaW1Gb2N1c2VkVmVydGV4LkNoaWxkcmVuLmxlbmd0aCA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IFplcm90aENlbGw6IEZDZWxsIHwgdW5kZWZpbmVkID0gR2V0WmVyb3RoQ2VsbChJbnRlcmltRm9jdXNlZFZlcnRleCk7XG4gICAgICAgICAgICBpZiAoWmVyb3RoQ2VsbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFNldEZvcmVncm91bmRXaW5kb3coWmVyb3RoQ2VsbC5IYW5kbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgICAgICAgICBMb2cuV2FybihcIkZpbmlzaEZvY3VzIGNvdWxkIG5vdCBzZXQgdGhlIGZvcmVncm91bmQgd2luZG93LCBiZWNhdXNlIEludGVyaW1Gb2N1c2VkVmVydGV4IHdhcyBhIHBhbmVsIHRoYXQgZGlkIG5vdCBoYXZlIGEgemVyb3RoIGNoaWxkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBjb25zdCBBY3RpdmVXaW5kb3c6IEhXaW5kb3cgfCB1bmRlZmluZWQgPSBHZXRBY3RpdmVXaW5kb3coKTtcbiAgICAgICAgaWYgKEFjdGl2ZVdpbmRvdyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBTZXRGb3JlZ3JvdW5kV2luZG93KEFjdGl2ZVdpbmRvdyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0TmV4dEluZGV4KFZlcnRleDogRlZlcnRleCk6IG51bWJlciB8IHVuZGVmaW5lZFxue1xuICAgIGNvbnN0IFBhcmVudDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0UGFyZW50KFZlcnRleCk7XG4gICAgaWYgKFBhcmVudCAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgY29uc3QgQ3VycmVudEluZGV4OiBudW1iZXIgPSBQYXJlbnQuQ2hpbGRyZW4uaW5kZXhPZihWZXJ0ZXgpO1xuICAgICAgICByZXR1cm4gQ3VycmVudEluZGV4ID09PSBQYXJlbnQuQ2hpbGRyZW4ubGVuZ3RoIC0gMVxuICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICA6IEN1cnJlbnRJbmRleCArIDE7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldE5leHRTaWJsaW5nKFZlcnRleDogRlZlcnRleCk6IEZWZXJ0ZXggfCB1bmRlZmluZWRcbntcbiAgICBjb25zdCBQYXJlbnQ6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldFBhcmVudChWZXJ0ZXgpO1xuICAgIGlmIChQYXJlbnQgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IE5leHRJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkID0gR2V0TmV4dEluZGV4KFZlcnRleCk7XG4gICAgICAgIGlmIChOZXh0SW5kZXggIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFBhcmVudC5DaGlsZHJlbltOZXh0SW5kZXhdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRQcmV2aW91c1NpYmxpbmcoVmVydGV4OiBGVmVydGV4KTogRlZlcnRleCB8IHVuZGVmaW5lZFxue1xuICAgIGNvbnN0IFBhcmVudDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0UGFyZW50KFZlcnRleCk7XG4gICAgaWYgKFBhcmVudCAhPT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgY29uc3QgUHJldmlvdXNJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkID0gR2V0UHJldmlvdXNJbmRleChWZXJ0ZXgpO1xuICAgICAgICBpZiAoUHJldmlvdXNJbmRleCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gUGFyZW50LkNoaWxkcmVuW1ByZXZpb3VzSW5kZXhdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogR2V0IG9uZSBsZXNzIHRoYW4gdGhlIGluZGV4IG9mIGEgZ2l2ZW4ge0BsaW5rIFZlcnRleH0gaW4gaXRzIHBhcmVudCBwYW5lbC5cbiAqXG4gKiBAcGFyYW0gVmVydGV4IC0gVGhlIHtAbGluayBGVmVydGV4fSB3aG9zZSBpbmRleCBpbiBpdHMgcGFyZW50IHBhbmVsIGlzIHVzZWRcbiAqIHRvIGNvbXB1dGUgdGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoaXMuXG4gKlxuICogQHJldHVybnMge251bWJlciB8IHVuZGVmaW5lZH0gT25lIGxlc3MgdGhhbiB0aGUgaW5kZXggb2YgdGhlIGdpdmVuIHtAbGluayBWZXJ0ZXh9XG4gKiBpbiBpdHMgcGFyZW50IHBhbmVsLiAgSWYgdGhlIGdpdmVuIHtAbGluayBWZXJ0ZXh9IGRvZXMgbm90IGhhdmUgYSBwYXJlbnQgcGFuZWwsXG4gKiB0aGVuIGB1bmRlZmluZWRgIGlzIHJldHVybmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gR2V0UHJldmlvdXNJbmRleChWZXJ0ZXg6IEZWZXJ0ZXgpOiBudW1iZXIgfCB1bmRlZmluZWRcbntcbiAgICBjb25zdCBQYXJlbnQ6IEZQYW5lbCB8IHVuZGVmaW5lZCA9IEdldFBhcmVudChWZXJ0ZXgpO1xuICAgIGlmIChQYXJlbnQgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IEN1cnJlbnRJbmRleDogbnVtYmVyID0gUGFyZW50LkNoaWxkcmVuLmluZGV4T2YoVmVydGV4KTtcbiAgICAgICAgcmV0dXJuIEN1cnJlbnRJbmRleCA9PT0gMFxuICAgICAgICAgICAgPyBQYXJlbnQuQ2hpbGRyZW4ubGVuZ3RoIC0gMVxuICAgICAgICAgICAgOiBDdXJyZW50SW5kZXggLSAxO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn07XG5cblJlZ2lzdGVySW5pdGlhbGl6YXRpb25GdW5jdGlvbihcIlRyZWVcIiwgSW5pdGlhbGl6ZVRyZWUsIFsgXCJNb25pdG9yXCIgXSk7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgaW5kZXgudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5cbi8vIGV4cG9ydCAqIGFzIE9sZCBmcm9tIFwiLi9UcmVlLk9sZFwiO1xuLy8gZXhwb3J0ICogZnJvbSBcIi4vVHJlZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vVHJlZVwiO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIFV0aWxpdHkuVHlwZXMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEhNb25pdG9yLCBIV2luZG93IH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcblxuZXhwb3J0IHR5cGUgSEhhbmRsZSA9XG4gICAgfCBIV2luZG93XG4gICAgfCBITW9uaXRvcjtcbiIsIi8qIEZpbGU6ICAgIFV0aWxpdHkudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGQm94IH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcbmltcG9ydCB0eXBlIHsgRkxvZ2dlciB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IHByb21pc2VzIGFzIEZzIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiIy9EZXZlbG9wbWVudFwiO1xuaW1wb3J0IHR5cGUgeyBISGFuZGxlIH0gZnJvbSBcIi4vVXRpbGl0eS5UeXBlc1wiO1xuXG5jb25zdCBMb2c6IEZMb2dnZXIgPSBHZXRMb2dnZXIoXCJVdGlsaXR5XCIpO1xuXG5leHBvcnQgY29uc3QgQXJlQm94ZXNFcXVhbCA9IChBOiBGQm94LCBCOiBGQm94KTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiAoXG4gICAgICAgIEEuWCA9PT0gQi5YICYmXG4gICAgICAgIEEuWSA9PT0gQi5ZICYmXG4gICAgICAgIEEuV2lkdGggPT09IEIuV2lkdGggJiZcbiAgICAgICAgQS5IZWlnaHQgPT09IEIuSGVpZ2h0XG4gICAgKTtcblxufTtcblxuZXhwb3J0IGNvbnN0IEFyZUhhbmRsZXNFcXVhbCA9IChBOiBISGFuZGxlLCBCOiBISGFuZGxlKTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBBLkhhbmRsZSA9PT0gQi5IYW5kbGU7XG59O1xuXG5leHBvcnQgY29uc3QgTWFwS2V5cyA9IDxJblR5cGUgZXh0ZW5kcyBvYmplY3QgPSBvYmplY3QsIE91dFR5cGUgPSB1bmtub3duPihcbiAgICBJbk9iamVjdDogb2JqZWN0LFxuICAgIENhbGxiYWNrOiAoS2V5OiBrZXlvZiBJblR5cGUsIEluZGV4PzogbnVtYmVyKSA9PiBPdXRUeXBlXG4pOiBUQXJyYXk8T3V0VHlwZT4gPT5cbntcbiAgICBjb25zdCBPdXRBcnJheTogVEFycmF5PE91dFR5cGU+ID0gWyBdO1xuXG4gICAgT2JqZWN0LmtleXMoSW5PYmplY3QpLmZvckVhY2goKEtleTogc3RyaW5nLCBJbmRleDogbnVtYmVyKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgT3V0QXJyYXkucHVzaChDYWxsYmFjayhLZXkgYXMga2V5b2YgSW5UeXBlLCBJbmRleCkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIE91dEFycmF5O1xufTtcblxuZXhwb3J0IGNvbnN0IEZvckFzeW5jID0gYXN5bmMgKFxuICAgIFN0YXJ0SW5kZXg6IG51bWJlcixcbiAgICBFbmRJbmRleDogbnVtYmVyLFxuICAgIENhbGxiYWNrOiAoKEluZGV4OiBudW1iZXIpID0+IFByb21pc2U8dm9pZD4pXG4pID0+XG57XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKFN0YXJ0SW5kZXgpKVxuICAgIHtcbiAgICAgICAgTG9nLkVycm9yKFwiRm9yQXN5bmMgd2FzIGdpdmVuIGEgU3RhcnRJbmRleCB0aGF0IHdhc24ndCBhbiBpbnRlZ2VyLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihFbmRJbmRleCkpXG4gICAge1xuICAgICAgICBMb2cuRXJyb3IoXCJGb3JBc3luYyB3YXMgZ2l2ZW4gYSBFbmRJbmRleCB0aGF0IHdhc24ndCBhbiBpbnRlZ2VyLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChTdGFydEluZGV4ID4gRW5kSW5kZXgpXG4gICAge1xuICAgICAgICBMb2cuRXJyb3IoXCJGb3JBc3luYyB3YXMgZ2l2ZW4gYSBTdGFydEluZGV4IHRoYXQgaXMgZ3JlYXRlciB0aGFuIHRoZSBnaXZlbiBFbmRJbmRleC5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBSYW5nZTogVEFycmF5PG51bWJlcj4gPSBbIC4uLkFycmF5KEVuZEluZGV4IC0gU3RhcnRJbmRleCArIDEpLmtleXMoKSBdO1xuXG4gICAgZm9yIGF3YWl0IChjb25zdCBJbmRleCBvZiBSYW5nZSlcbiAgICB7XG4gICAgICAgIGF3YWl0IENhbGxiYWNrKEluZGV4KTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgUG9zaXRpb25Ub1N0cmluZyA9IChCb3g6IEZCb3gpOiBzdHJpbmcgPT5cbntcbiAgICByZXR1cm4gYCgkeyBCb3guWCB9LCAkeyBCb3guWSB9KWA7XG59O1xuXG5leHBvcnQgY29uc3QgU2l6ZVRvU3RyaW5nID0gKEJveDogRkJveCk6IHN0cmluZyA9Plxue1xuICAgIHJldHVybiBgV2lkdGggJHsgQm94LldpZHRoIH0sIEhlaWdodCAkeyBCb3guSGVpZ2h0IH1gO1xufTtcblxuZXhwb3J0IGNvbnN0IEJveFRvU3RyaW5nID0gKEJveDogRkJveCk6IHN0cmluZyA9Plxue1xuICAgIHJldHVybiBgJHsgUG9zaXRpb25Ub1N0cmluZyhCb3gpIH0gd2l0aCAkeyBTaXplVG9TdHJpbmcoQm94KSB9YDtcbn07XG5cbmV4cG9ydCBjb25zdCBTbGVlcCA9IChEdXJhdGlvbjogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvdHlwZWRlZiAqL1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigoUmVzb2x2ZSwgX1JlamVjdCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIHNldFRpbWVvdXQoKCk6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgUmVzb2x2ZSgpO1xuICAgICAgICB9LCBEdXJhdGlvbik7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgR2V0UG5nQmFzZTY0ID0gYXN5bmMgKFBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiA9Plxue1xuICAgIGNvbnN0IEljb25CdWZmZXI6IEJ1ZmZlciA9IGF3YWl0IEZzLnJlYWRGaWxlKFBhdGgpO1xuICAgIHJldHVybiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIEljb25CdWZmZXIudG9TdHJpbmcoXCJiYXNlNjRcIik7XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIGluZGV4LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vVXRpbGl0eVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vVXRpbGl0eS5UeXBlc1wiO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIE92ZXJsYXlXaW5kb3cudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbC5cbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHtcbiAgICBCbHVyQmFja2dyb3VuZCBhcyBCbHVyQmFja2dyb3VuZE5hdGl2ZSxcbiAgICB0eXBlIEZCb3gsXG4gICAgR2V0RHdtV2luZG93UmVjdCxcbiAgICBHZXRGb2N1c2VkV2luZG93LFxuICAgIEdldFdpbmRvd1RpdGxlLFxuICAgIHR5cGUgSFdpbmRvdyxcbiAgICBVbmJsdXJCYWNrZ3JvdW5kIH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcbmltcG9ydCB7IHR5cGUgQnJvd3NlcldpbmRvdywgdHlwZSBSZWN0YW5nbGUsIHNjcmVlbiB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgdHlwZSBGRGV2U2V0dGluZ3MsIEdldERldlNldHRpbmdzLCBHZXRMb2dnZXIgfSBmcm9tIFwiIy9EZXZlbG9wbWVudFwiO1xuaW1wb3J0IHR5cGUgeyBGTG9nZ2VyLCBGTmF2aWdhdGVSZXF1ZXN0LCBGVmVydGV4IH0gZnJvbSBcIi4uLy4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgR2V0SW50ZXJpbUZvY3VzZWRWZXJ0ZXgsIElzQ2VsbCwgSXNXaW5kb3dUaWxlZCB9IGZyb20gXCIjL1RyZWUvVHJlZVwiO1xuaW1wb3J0IHsgU2VuZElwY0V2ZW50IH0gZnJvbSBcIiMvRXZlbnRcIjtcblxuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiT3ZlcmxheVdpbmRvd1wiKTtcblxubGV0IE92ZXJsYXlXaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbmV4cG9ydCBjb25zdCBHZXRPdmVybGF5V2luZG93ID0gKCk6IEJyb3dzZXJXaW5kb3cgPT4gKE92ZXJsYXlXaW5kb3cgYXMgQnJvd3NlcldpbmRvdyk7XG5cbmV4cG9ydCBjb25zdCBJbml0aWFsaXplT3ZlcmxheSA9IChJbjogQnJvd3NlcldpbmRvdyk6IEJyb3dzZXJXaW5kb3cgPT5cbntcbiAgICBPdmVybGF5V2luZG93ID0gSW47XG4gICAgcmV0dXJuIEluO1xufTtcblxuZXhwb3J0IGNvbnN0IEJsdXJCYWNrZ3JvdW5kID0gKEJvdW5kczogRkJveCk6IHZvaWQgPT5cbntcbiAgICBjb25zdCBJbnRlcmltRm9jdXNlZFZlcnRleDogRlZlcnRleCB8IHVuZGVmaW5lZCA9IEdldEludGVyaW1Gb2N1c2VkVmVydGV4KCk7XG4gICAgY29uc3QgU291cmNlSGFuZGxlOiBIV2luZG93IHwgdW5kZWZpbmVkID1cbiAgICAgICAgSW50ZXJpbUZvY3VzZWRWZXJ0ZXggIT09IHVuZGVmaW5lZCAmJiBJc0NlbGwoSW50ZXJpbUZvY3VzZWRWZXJ0ZXgpXG4gICAgICAgICAgICA/IEludGVyaW1Gb2N1c2VkVmVydGV4LkhhbmRsZVxuICAgICAgICAgICAgOiBHZXRBY3RpdmVXaW5kb3coKTtcblxuICAgIGlmIChTb3VyY2VIYW5kbGUgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IERldlNldHRpbmdzOiBGRGV2U2V0dGluZ3MgPSBHZXREZXZTZXR0aW5ncygpO1xuICAgICAgICBjb25zdCBPdXRCb3VuZHM6IEZCb3ggPSBEZXZTZXR0aW5ncy5TdGF0aWNNb2RlLkVuYWJsZWRcbiAgICAgICAgICAgID8gRGV2U2V0dGluZ3MuU3RhdGljTW9kZS5XaW5kb3dTaGFwZVxuICAgICAgICAgICAgOiBCb3VuZHM7XG5cbiAgICAgICAgTG9nKFwiT3V0Qm91bmRzXCIsIE91dEJvdW5kcyk7XG4gICAgICAgIEJsdXJCYWNrZ3JvdW5kTmF0aXZlKE91dEJvdW5kcywgU291cmNlSGFuZGxlKTtcbiAgICAgICAgaWYgKE92ZXJsYXlXaW5kb3cpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IE91dEJvdW5kc1JlY3RhbmdsZTogUmVjdGFuZ2xlID1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IE91dEJvdW5kcy5IZWlnaHQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IE91dEJvdW5kcy5XaWR0aCxcbiAgICAgICAgICAgICAgICB4OiBPdXRCb3VuZHMuWCxcbiAgICAgICAgICAgICAgICB5OiBPdXRCb3VuZHMuWVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IFNjYWxlRmFjdG9yOiBudW1iZXIgPSBzY3JlZW4uZ2V0RGlzcGxheU1hdGNoaW5nKE91dEJvdW5kc1JlY3RhbmdsZSkuc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICBPdmVybGF5V2luZG93LnNldEJvdW5kcyh7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBPdXRCb3VuZHMuSGVpZ2h0IC8gU2NhbGVGYWN0b3IsXG4gICAgICAgICAgICAgICAgd2lkdGg6IE91dEJvdW5kcy5XaWR0aCAvIFNjYWxlRmFjdG9yLFxuICAgICAgICAgICAgICAgIHg6IE91dEJvdW5kcy5YIC8gU2NhbGVGYWN0b3IsXG4gICAgICAgICAgICAgICAgeTogT3V0Qm91bmRzLlkgLyBTY2FsZUZhY3RvclxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIE1haW5XaW5kb3cuc2V0UG9zaXRpb24oT3V0Qm91bmRzLlgsIE91dEJvdW5kcy5ZKTtcbiAgICAgICAgICAgIC8vIE1haW5XaW5kb3cuc2V0U2l6ZShPdXRCb3VuZHMuV2lkdGgsIE91dEJvdW5kcy5IZWlnaHQsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYWluV2luZG93Py5zZXRCb3VuZHMoe1xuICAgICAgICAvLyAgICAgaGVpZ2h0OiBPdXRCb3VuZHMuSGVpZ2h0IC8gMS4yNSxcbiAgICAgICAgLy8gICAgIHdpZHRoOiBPdXRCb3VuZHMuV2lkdGggLyAxLjI1LFxuICAgICAgICAvLyAgICAgeDogT3V0Qm91bmRzLlgsXG4gICAgICAgIC8vICAgICB5OiBPdXRCb3VuZHMuWVxuICAgICAgICAvLyB9LCBmYWxzZSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgTG9nLkVycm9yKFwiQmx1ckJhY2tncm91bmROYXRpdmUgY2Fubm90IGJlIGNhbGxlZCBiZWNhdXNlIHRoZXJlIGlzIG5vIEludGVyaW1Gb2N1c2VkVmVydGV4IG9yIEFjdGl2ZVdpbmRvdy5cIik7XG4gICAgfVxufTtcblxuLyoqIEhpZGUgdGhlIG1haW4gd2luZG93LiAqL1xuZXhwb3J0IGNvbnN0IERlYWN0aXZhdGUgPSAoKTogdm9pZCA9Plxue1xuICAgIGNvbnN0IHsgeDogWCwgeTogWSB9ID0gR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbigpO1xuICAgIGlmIChPdmVybGF5V2luZG93KVxuICAgIHtcbiAgICAgICAgT3ZlcmxheVdpbmRvdy5zZXRQb3NpdGlvbihYLCBZLCBmYWxzZSk7XG4gICAgICAgIFVuYmx1ckJhY2tncm91bmQoKTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbiA9ICgpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gPT5cbntcbiAgICBjb25zdCBEaXNwbGF5czogVEFycmF5PEVsZWN0cm9uLkRpc3BsYXk+ID0gc2NyZWVuLmdldEFsbERpc3BsYXlzKCk7XG5cbiAgICB0eXBlIEZNb25pdG9yQm91bmRzID0geyBsZWZ0OiBudW1iZXI7IHJpZ2h0OiBudW1iZXI7IHRvcDogbnVtYmVyOyBib3R0b206IG51bWJlciB9O1xuICAgIGNvbnN0IE1vbml0b3JCb3VuZHM6IFRBcnJheTxGTW9uaXRvckJvdW5kcz4gPSBEaXNwbGF5cy5tYXAoKGRpc3BsYXk6IEVsZWN0cm9uLkRpc3BsYXkpOiBGTW9uaXRvckJvdW5kcyA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvdHRvbTogZGlzcGxheS5ib3VuZHMueSArIGRpc3BsYXkuYm91bmRzLmhlaWdodCxcbiAgICAgICAgICAgIGxlZnQ6IGRpc3BsYXkuYm91bmRzLngsXG4gICAgICAgICAgICByaWdodDogZGlzcGxheS5ib3VuZHMueCArIGRpc3BsYXkuYm91bmRzLndpZHRoLFxuICAgICAgICAgICAgdG9wOiBkaXNwbGF5LmJvdW5kcy55XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBNb25pdG9yQm91bmRzLnNvcnQoKEE6IEZNb25pdG9yQm91bmRzLCBCOiBGTW9uaXRvckJvdW5kcykgPT4gQS5sZWZ0IC0gQi5sZWZ0IHx8IEEudG9wIC0gQi50b3ApO1xuXG4gICAgY29uc3QgTWF4UmlnaHQ6IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMucmlnaHQpKTtcbiAgICBjb25zdCBNYXhCb3R0b206IG51bWJlciA9IE1hdGgubWF4KC4uLk1vbml0b3JCb3VuZHMubWFwKChib3VuZHM6IEZNb25pdG9yQm91bmRzKSA9PiBib3VuZHMuYm90dG9tKSk7XG5cbiAgICBjb25zdCBJbnZpc2libGVYOiBudW1iZXIgPSAoTWF4UmlnaHQgKyAxKSAqIDI7XG4gICAgY29uc3QgSW52aXNpYmxlWTogbnVtYmVyID0gKE1heEJvdHRvbSArIDEpICogMjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHg6IEludmlzaWJsZVgsXG4gICAgICAgIHk6IEludmlzaWJsZVlcbiAgICB9O1xufTtcblxuLyoqIFRoZSB3aW5kb3cocykgdGhhdCBTb3JyZWxsV20gaXMgYmVpbmcgZHJhd24gb3Zlci4gKi9cbmxldCBBY3RpdmVXaW5kb3c6IEhXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbmV4cG9ydCBjb25zdCBHZXRBY3RpdmVXaW5kb3cgPSAoKTogSFdpbmRvdyB8IHVuZGVmaW5lZCA9Plxue1xuICAgIHJldHVybiBBY3RpdmVXaW5kb3c7XG59O1xuXG5leHBvcnQgY29uc3QgU2V0QWN0aXZlV2luZG93ID0gKEluOiBIV2luZG93IHwgdW5kZWZpbmVkKTogdm9pZCA9Plxue1xuICAgIEFjdGl2ZVdpbmRvdyA9IEluO1xufTtcblxuLyoqXG4gKiBBbGxvd3Mgb3RoZXIgcGFydHMgb2YgdGhlIGFwcGxpY2F0aW9uIHRvIHRlbGwgdGhlIG1haW4gd2luZG93XG4gKiB0aGF0IGl0IHNob3VsZCBub3QgYWN0aXZhdGUsIGV2ZW4gd2hlbiB0aGUgYWN0aXZhdGlvbiBrZXkgaXMgdXNlZC5cbiAqL1xubGV0IFNob3VsZEFjdGl2YXRlOiBib29sZWFuID0gdHJ1ZTtcblxuZXhwb3J0IGNvbnN0IFNldFNob3VsZEFjdGl2YXRlID0gKEluOiBib29sZWFuKTogdm9pZCA9Plxue1xuICAgIFNob3VsZEFjdGl2YXRlID0gSW47XG59O1xuXG4vKiogU2hvdyB0aGUgbWFpbiB3aW5kb3cuICovXG5leHBvcnQgY29uc3QgQWN0aXZhdGUgPSAoKTogdm9pZCA9Plxue1xuICAgIGlmICghU2hvdWxkQWN0aXZhdGUpXG4gICAge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKEdldFdpbmRvd1RpdGxlKEdldEZvY3VzZWRXaW5kb3coKSkgIT09IFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIgJiYgT3ZlcmxheVdpbmRvdylcbiAgICB7XG4gICAgICAgIEFjdGl2ZVdpbmRvdyA9IEdldEZvY3VzZWRXaW5kb3coKTtcblxuICAgICAgICBjb25zdCBJc1RpbGVkOiBib29sZWFuID0gSXNXaW5kb3dUaWxlZChHZXRGb2N1c2VkV2luZG93KCkpO1xuICAgICAgICBjb25zdCBOYXZpZ2F0ZVJlcXVlc3Q6IEZOYXZpZ2F0ZVJlcXVlc3QgPVxuICAgICAgICB7XG4gICAgICAgICAgICBSb3V0ZTogXCJcIixcbiAgICAgICAgICAgIFN0YXRlOiB7IElzVGlsZWQgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcblxuICAgICAgICBTZW5kSXBjRXZlbnQoT3ZlcmxheVdpbmRvdywgXCJOYXZpZ2F0ZVwiLCBOYXZpZ2F0ZVJlcXVlc3QpO1xuICAgICAgICBCbHVyQmFja2dyb3VuZChHZXREd21XaW5kb3dSZWN0KEFjdGl2ZVdpbmRvdykpO1xuXG4gICAgICAgIExvZyhPdmVybGF5V2luZG93Py5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgTG9nKE92ZXJsYXlXaW5kb3c/LmdldFNpemUoKSk7XG4gICAgICAgIC8vIFN0ZWFsRm9jdXMoR2V0V2luZG93QnlOYW1lKFwiU29ycmVsbFdtIE1haW4gV2luZG93XCIpKTtcbiAgICB9XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIGluZGV4LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vT3ZlcmxheVdpbmRvd1wiO1xuLy8gZXhwb3J0IGNvbnN0IE92ZXJsYXlEdW1teUV4cG9ydDogXCJPdmVybGF5RHVtbXlFeHBvcnRcIiA9IFwiT3ZlcmxheUR1bW15RXhwb3J0XCIgYXMgY29uc3Q7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=