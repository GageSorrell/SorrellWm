"use strict";
exports.id = "Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts";
exports.ids = ["Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"];
exports.modules = {

/***/ "./Source/Main/Initialize/Initialize.ts"
/*!**********************************************!*\
  !*** ./Source/Main/Initialize/Initialize.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Initialize.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterInitializationFunction = RegisterInitializationFunction;
const electron_1 = __webpack_require__(/*! electron */ "electron");
const Log_1 = __webpack_require__(/*! #/Development/Log/Log */ "./Source/Main/Development/Log/Log.ts");
const InitializationFunctions = {};
let LoggedAppReady = false;
/**
 * For side effects `import`ed via `SideEffects.ts` that require `app.whenReady()` to be fulfilled.
 */
async function RegisterInitializationFunction(Name, Initializer, DependencyArray = []) {
    const Log = (0, Log_1.GetLogger)("Initialize");
    Log(`Going to register initializer with name ${Name}.`);
    // process.stdout.write(`Going to register initializer with name ${ Name }.\n`);
    await electron_1.app.whenReady();
    if (!LoggedAppReady) {
        LoggedAppReady = true;
        // Log("App is ready!");
        process.stdout.write("App is ready!");
    }
    const PartialInitializer = {
        DependencyArray,
        IsFulfilled: false
    };
    const WrappedInitializer = new Promise((Resolve, Reject) => {
        let TimerId = undefined;
        const TimeStarted = new Date().getTime();
        const TimeBetweenChecks = 250;
        const MaxDuration = 60 * 1000;
        let TimeOfLastCheck = TimeStarted;
        const Check = () => {
            const TimedOut = (TimeOfLastCheck - TimeStarted) >= MaxDuration;
            if (TimedOut && TimerId !== undefined) {
                /* eslint-disable @stylistic/max-len */
                // Log.Error(`Initializer ${ Name } could not be fulfilled.  Its dependencies are ${ DependencyArray.join(", ") }.`);
                clearInterval(TimerId);
                Reject(`Initializer ${Name} could not be fulfilled.  Its dependencies are ${DependencyArray.join(", ")}.`);
                /* eslint-enable @stylistic/max-len */
            }
            const AreDependenciesRegistered = DependencyArray.every((DependencyName) => {
                return DependencyName in InitializationFunctions;
            });
            if (!AreDependenciesRegistered) {
                TimeOfLastCheck = new Date().getTime();
                return;
            }
            const AreDependenciesFulfilled = DependencyArray.every((DependencyName) => {
                if (InitializationFunctions[DependencyName]) {
                    const { IsFulfilled } = InitializationFunctions[DependencyName];
                    return IsFulfilled;
                }
                else {
                    return false;
                }
            });
            if (AreDependenciesFulfilled) {
                if (TimerId !== undefined) {
                    clearInterval(TimerId);
                    Initializer().then(() => {
                        PartialInitializer.IsFulfilled = true;
                        Resolve();
                    });
                }
            }
            TimeOfLastCheck = new Date().getTime();
        };
        TimerId = setInterval(Check, TimeBetweenChecks);
    });
    if (Name in InitializationFunctions) {
        throw new Error(`Two initializer functions were registered with the same name, "${Name}".`);
    }
    PartialInitializer.Initializer = WrappedInitializer;
    InitializationFunctions[Name] = PartialInitializer;
}


/***/ },

/***/ "./Source/Renderer/Log.ts"
/*!********************************!*\
  !*** ./Source/Renderer/Log.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetLogger = exports.GetTime = void 0;
const Log_1 = __webpack_require__(/*! ../Shared/Log */ "./Source/Shared/Log.ts");
const GetTime = () => {
    return Log_1.GetTimeToken;
};
exports.GetTime = GetTime;
/** Use this to create a logger within a given module so that the log category is set for that module. */
const GetLogger = (Category) => {
    const MakeLoggerInternal = (Level) => {
        return (...Statements) => {
            const FilteredStatements = Statements.map((Statement) => {
                if (typeof Statement === "object") {
                    return JSON.stringify(Statement, null, 4);
                }
                else {
                    return Statement;
                }
            });
            window.electron.ipcRenderer.Send("Log", Category, Level, ...FilteredStatements);
        };
    };
    const Logger = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");
    return Logger;
};
exports.GetLogger = GetLogger;


/***/ },

/***/ "./Source/Shared/Event/Focus.Types.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Event/Focus.Types.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Transactions.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 * Comment:   Define types used in `Event.Types.ts` that
 *            do not otherwise have a good place to go.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/Insert.Types.ts"
/*!*********************************************!*\
  !*** ./Source/Shared/Event/Insert.Types.ts ***!
  \*********************************************/
(__unused_webpack_module, exports) {


/**
 * @file      InsertEvent.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/Move.Types.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Event/Move.Types.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Move.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Navigate.Types.ts"
/*!***********************************************!*\
  !*** ./Source/Shared/Event/Navigate.Types.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Navigate.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Settings.Types.ts"
/*!***********************************************!*\
  !*** ./Source/Shared/Event/Settings.Types.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Tile.Types.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Event/Tile.Types.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Tile.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/index.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Event/index.ts ***!
  \**************************************/
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
__exportStar(__webpack_require__(/*! ./Focus.Types */ "./Source/Shared/Event/Focus.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Insert.Types */ "./Source/Shared/Event/Insert.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Move.Types */ "./Source/Shared/Event/Move.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Navigate.Types */ "./Source/Shared/Event/Navigate.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings.Types */ "./Source/Shared/Event/Settings.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Tile.Types */ "./Source/Shared/Event/Tile.Types.ts"), exports);


/***/ },

/***/ "./Source/Shared/Keyboard.Types.ts"
/*!*****************************************!*\
  !*** ./Source/Shared/Keyboard.Types.ts ***!
  \*****************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Keyboard.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Keyboard.ts"
/*!***********************************!*\
  !*** ./Source/Shared/Keyboard.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {


/**
 * @file      Keyboard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VirtualKeys = exports.Vk = exports.KeyIds = exports.KeyIdsById = void 0;
exports.IsKeyId = IsKeyId;
exports.GetKeyName = GetKeyName;
exports.IsVirtualKey = IsVirtualKey;
/* eslint-disable sort-keys */
exports.KeyIdsById = {
    0x05: "MouseX1",
    0x06: "MouseX2",
    0x08: "Backspace",
    0x09: "Tab",
    0x0D: "Enter",
    0x10: "Shift",
    0x11: "Ctrl",
    0x12: "Alt",
    0x13: "Pause",
    0x20: "Space",
    0x21: "PgUp",
    0x22: "PgDown",
    0x23: "End",
    0x24: "Home",
    0x25: "LeftArrow",
    0x26: "UpArrow",
    0x27: "RightArrow",
    0x28: "DownArrow",
    0x2D: "Ins",
    0x2E: "Del",
    0x30: "0",
    0x31: "1",
    0x32: "2",
    0x33: "3",
    0x34: "4",
    0x35: "5",
    0x36: "6",
    0x37: "7",
    0x38: "8",
    0x39: "9",
    0x41: "A",
    0x42: "B",
    0x43: "C",
    0x44: "D",
    0x45: "E",
    0x46: "F",
    0x47: "G",
    0x48: "H",
    0x49: "I",
    0x4A: "J",
    0x4B: "K",
    0x4C: "L",
    0x4D: "M",
    0x4E: "N",
    0x4F: "O",
    0x50: "P",
    0x51: "Q",
    0x52: "R",
    0x53: "S",
    0x54: "T",
    0x55: "U",
    0x56: "V",
    0x57: "W",
    0x58: "X",
    0x59: "Y",
    0x5A: "Z",
    0x5B: "LWin",
    0x5C: "RWin",
    0x5D: "Applications",
    0x60: "Num0",
    0x61: "Num1",
    0x62: "Num2",
    0x63: "Num3",
    0x64: "Num4",
    0x65: "Num5",
    0x66: "Num6",
    0x67: "Num7",
    0x68: "Num8",
    0x69: "Num9",
    0x6A: "Multiply",
    0x6B: "Add",
    0x6D: "Subtract",
    0x6E: "NumDecimal",
    0x6F: "NumDivide",
    0x70: "F1",
    0x71: "F2",
    0x72: "F3",
    0x73: "F4",
    0x74: "F5",
    0x75: "F6",
    0x76: "F7",
    0x77: "F8",
    0x78: "F9",
    0x79: "F10",
    0x7A: "F11",
    0x7B: "F12",
    0x7C: "F13",
    0x7D: "F14",
    0x7E: "F15",
    0x7F: "F16",
    0x80: "F17",
    0x81: "F18",
    0x82: "F19",
    0x83: "F20",
    0x84: "F21",
    0x85: "F22",
    0x86: "F23",
    0x87: "F24",
    0xA0: "LShift",
    0xA1: "RShift",
    0xA2: "LCtrl",
    0xA3: "RCtrl",
    0xA4: "LAlt",
    0xA5: "RAlt",
    0xA6: "BrowserBack",
    0xA7: "BrowserForward",
    0xA8: "BrowserRefresh",
    0xA9: "BrowserStop",
    0xAA: "BrowserSearch",
    0xAB: "BrowserFavorites",
    0xAC: "BrowserStart",
    0xB0: "NextTrack",
    0xB1: "PreviousTrack",
    0xB2: "StopMedia",
    0xB3: "PlayPauseMedia",
    0xB4: "StartMail",
    0xB5: "SelectMedia",
    0xB6: "StartApplicationOne",
    0xB7: "StartApplicationTwo",
    0xBA: ";",
    0xBB: "+",
    0xBC: ",",
    0xBD: "-",
    0xBE: ".",
    0xBF: "/",
    0xC0: "`",
    0xDB: "[",
    0xDC: "\\",
    0xDD: "]",
    0xDE: "'"
};
exports.KeyIds = [
    "MouseX1",
    "MouseX2",
    "Backspace",
    "Tab",
    "Enter",
    "Shift",
    "Ctrl",
    "Alt",
    "Pause",
    "Space",
    "PgUp",
    "PgDown",
    "End",
    "Home",
    "LeftArrow",
    "UpArrow",
    "RightArrow",
    "DownArrow",
    "Ins",
    "Del",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "LWin",
    "RWin",
    "Applications",
    "Num0",
    "Num1",
    "Num2",
    "Num3",
    "Num4",
    "Num5",
    "Num6",
    "Num7",
    "Num8",
    "Num9",
    "Multiply",
    "Add",
    "Subtract",
    "NumDecimal",
    "NumDivide",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "F13",
    "F14",
    "F15",
    "F16",
    "F17",
    "F18",
    "F19",
    "F20",
    "F21",
    "F22",
    "F23",
    "F24",
    "LShift",
    "RShift",
    "LCtrl",
    "RCtrl",
    "LAlt",
    "RAlt",
    "BrowserBack",
    "BrowserForward",
    "BrowserRefresh",
    "BrowserStop",
    "BrowserSearch",
    "BrowserFavorites",
    "BrowserStart",
    "NextTrack",
    "PreviousTrack",
    "StopMedia",
    "PlayPauseMedia",
    "StartMail",
    "SelectMedia",
    "StartApplicationOne",
    "StartApplicationTwo",
    ";",
    "+",
    ",",
    "-",
    ".",
    "/",
    "`",
    "[",
    "\\",
    "]",
    "'"
];
/**
 * Determine whether a {@link In | given string} is an {@link FKeyId}.
 *
 * @param In - The string to test.
 * @returns {In is FKeyId} Whether the {@link In | given string} is an {@link FKeyId}.
 */
function IsKeyId(In) {
    return exports.KeyIds.includes(In);
}
;
/**
 * Get the {@link FKeyId} that corresponds to a given {@link VkCode}.
 *
 * @param VkCode - The {@link FVirtualKey} of which the corresponding {@link FKeyId}
 * is returned by this.
 *
 * @returns {FKeyId} The {@link FKeyId} that corresponds to the given {@link VkCode}.
 */
function GetKeyName(VkCode) {
    return exports.KeyIdsById[VkCode];
}
;
exports.Vk = {
    MouseX1: 0x05,
    MouseX2: 0x06,
    Backspace: 0x08,
    Tab: 0x09,
    Enter: 0x0D,
    Shift: 0x10,
    Ctrl: 0x11,
    Alt: 0x12,
    Pause: 0x13,
    Space: 0x20,
    PgUp: 0x21,
    PgDown: 0x22,
    End: 0x23,
    Home: 0x24,
    LeftArrow: 0x25,
    UpArrow: 0x26,
    RightArrow: 0x27,
    DownArrow: 0x28,
    Ins: 0x2D,
    Del: 0x2E,
    0: 0x30,
    1: 0x31,
    2: 0x32,
    3: 0x33,
    4: 0x34,
    5: 0x35,
    6: 0x36,
    7: 0x37,
    8: 0x38,
    9: 0x39,
    A: 0x41,
    B: 0x42,
    C: 0x43,
    D: 0x44,
    E: 0x45,
    F: 0x46,
    G: 0x47,
    H: 0x48,
    I: 0x49,
    J: 0x4A,
    K: 0x4B,
    L: 0x4C,
    M: 0x4D,
    N: 0x4E,
    O: 0x4F,
    P: 0x50,
    Q: 0x51,
    R: 0x52,
    S: 0x53,
    T: 0x54,
    U: 0x55,
    V: 0x56,
    W: 0x57,
    X: 0x58,
    Y: 0x59,
    Z: 0x5A,
    LWin: 0x5B,
    RWin: 0x5C,
    Applications: 0x5D,
    Num0: 0x60,
    Num1: 0x61,
    Num2: 0x62,
    Num3: 0x63,
    Num4: 0x64,
    Num5: 0x65,
    Num6: 0x66,
    Num7: 0x67,
    Num8: 0x68,
    Num9: 0x69,
    Multiply: 0x6A,
    Add: 0x6B,
    Subtract: 0x6D,
    NumDecimal: 0x6E,
    NumDivide: 0x6F,
    F1: 0x70,
    F2: 0x71,
    F3: 0x72,
    F4: 0x73,
    F5: 0x74,
    F6: 0x75,
    F7: 0x76,
    F8: 0x77,
    F9: 0x78,
    F10: 0x79,
    F11: 0x7A,
    F12: 0x7B,
    F13: 0x7C,
    F14: 0x7D,
    F15: 0x7E,
    F16: 0x7F,
    F17: 0x80,
    F18: 0x81,
    F19: 0x82,
    F20: 0x83,
    F21: 0x84,
    F22: 0x85,
    F23: 0x86,
    F24: 0x87,
    LShift: 0xA0,
    RShift: 0xA1,
    LCtrl: 0xA2,
    RCtrl: 0xA3,
    LAlt: 0xA4,
    RAlt: 0xA5,
    BrowserBack: 0xA6,
    BrowserForward: 0xA7,
    BrowserRefresh: 0xA8,
    BrowserStop: 0xA9,
    BrowserSearch: 0xAA,
    BrowserFavorites: 0xAB,
    BrowserStart: 0xAC,
    NextTrack: 0xB0,
    PreviousTrack: 0xB1,
    StopMedia: 0xB2,
    PlayPauseMedia: 0xB3,
    StartMail: 0xB4,
    SelectMedia: 0xB5,
    StartApplicationOne: 0xB6,
    StartApplicationTwo: 0xB7,
    ";": 0xBA,
    "+": 0xBB,
    ",": 0xBC,
    "-": 0xBD,
    ".": 0xBE,
    "/": 0xBF,
    "`": 0xC0,
    "[": 0xDB,
    "\\": 0xDC,
    "]": 0xDD,
    "'": 0xDE
};
exports.VirtualKeys = [
    0x05,
    0x06,
    0x08,
    0x09,
    0x0D,
    0x10,
    0x11,
    0x12,
    0x13,
    0x20,
    0x21,
    0x22,
    0x23,
    0x24,
    0x25,
    0x26,
    0x27,
    0x28,
    0x2D,
    0x2E,
    0x30,
    0x31,
    0x32,
    0x33,
    0x34,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x41,
    0x42,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4A,
    0x4B,
    0x4C,
    0x4D,
    0x4E,
    0x4F,
    0x50,
    0x51,
    0x52,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5A,
    0x5B,
    0x5C,
    0x5D,
    0x60,
    0x61,
    0x62,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6A,
    0x6B,
    0x6D,
    0x6E,
    0x6F,
    0x70,
    0x71,
    0x72,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7A,
    0x7B,
    0x7C,
    0x7D,
    0x7E,
    0x7F,
    0x80,
    0x81,
    0x82,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0xA0,
    0xA1,
    0xA2,
    0xA3,
    0xA4,
    0xA5,
    0xA6,
    0xA7,
    0xA8,
    0xA9,
    0xAA,
    0xAB,
    0xAC,
    0xB0,
    0xB1,
    0xB2,
    0xB3,
    0xB4,
    0xB5,
    0xB6,
    0xB7,
    0xBA,
    0xBB,
    0xBC,
    0xBD,
    0xBE,
    0xBF,
    0xC0,
    0xDB,
    0xDC,
    0xDD,
    0xDE
];
/* eslint-enable sort-keys */
/**
 * Determines whether a given {@link KeyCode} is a VK Code that can be used
 * by an Electron application (without native modules or the Keyboard API).
 *
 * @param KeyCode - The numeric key code value to test.
 *
 * @returns {KeyCode is FVirtualKey} Whether the given {@link KeyCode} is
 * an {@link FVirtualKey}.
 */
function IsVirtualKey(KeyCode) {
    return exports.VirtualKeys.includes(KeyCode);
}


/***/ },

/***/ "./Source/Shared/Log.Types.ts"
/*!************************************!*\
  !*** ./Source/Shared/Log.Types.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Log.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Log.ts"
/*!******************************!*\
  !*** ./Source/Shared/Log.ts ***!
  \******************************/
(__unused_webpack_module, exports) {


/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetTimeToken = void 0;
exports.GetTimeToken = "__GetTime__";


/***/ },

/***/ "./Source/Shared/Settings/Keybind.Types.ts"
/*!*************************************************!*\
  !*** ./Source/Shared/Settings/Keybind.Types.ts ***!
  \*************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Keybind.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Settings/Keybind.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Settings/Keybind.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Keybind.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionKeys = exports.Keys = void 0;
const WindowsLogo = "\uE782";
const GlobeSymbol = "\uE774";
const NumModifier = "NUM";
const ShiftSymbol = "\uE752";
exports.Keys = {
    0x05: {
        Display: "\uE962",
        Modifier: "1",
        Side: undefined
    },
    0x06: {
        Display: "\uE962",
        Modifier: "2",
        Side: undefined
    },
    0x08: {
        Display: "\uE750",
        Modifier: undefined,
        Side: undefined
    },
    0x09: {
        Display: "\uE7FD",
        Modifier: undefined,
        Side: undefined
    },
    0x0D: {
        Display: "\uE751",
        Modifier: undefined,
        Side: undefined
    },
    0x10: {
        Display: "\uE752",
        Modifier: undefined,
        Side: "Either"
    },
    0x11: {
        Display: "CTRL",
        Modifier: undefined,
        Side: "Either"
    },
    0x12: {
        Display: "ALT",
        Modifier: undefined,
        Side: "Either"
    },
    0x13: {
        Display: "\uE81A",
        Modifier: undefined,
        Side: undefined
    },
    0x20: {
        Display: "\uE75D",
        Modifier: undefined,
        Side: undefined
    },
    0x21: {
        Display: "PgUp",
        Modifier: undefined,
        Side: undefined
    },
    0x22: {
        Display: "PgDown",
        Modifier: undefined,
        Side: undefined
    },
    0x23: {
        Display: "End",
        Modifier: undefined,
        Side: undefined
    },
    0x24: {
        Display: "Home",
        Modifier: undefined,
        Side: undefined
    },
    0x25: {
        Display: "LeftArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x26: {
        Display: "UpArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x27: {
        Display: "RightArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x28: {
        Display: "DownArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x2D: {
        Display: "Ins",
        Modifier: undefined,
        Side: undefined
    },
    0x2E: {
        Display: "Del",
        Modifier: undefined,
        Side: undefined
    },
    0x30: {
        Display: "0",
        Modifier: undefined,
        Side: undefined
    },
    0x31: {
        Display: "1",
        Modifier: undefined,
        Side: undefined
    },
    0x32: {
        Display: "2",
        Modifier: undefined,
        Side: undefined
    },
    0x33: {
        Display: "3",
        Modifier: undefined,
        Side: undefined
    },
    0x34: {
        Display: "4",
        Modifier: undefined,
        Side: undefined
    },
    0x35: {
        Display: "5",
        Modifier: undefined,
        Side: undefined
    },
    0x36: {
        Display: "6",
        Modifier: undefined,
        Side: undefined
    },
    0x37: {
        Display: "7",
        Modifier: undefined,
        Side: undefined
    },
    0x38: {
        Display: "8",
        Modifier: undefined,
        Side: undefined
    },
    0x39: {
        Display: "9",
        Modifier: undefined,
        Side: undefined
    },
    0x41: {
        Display: "A",
        Modifier: undefined,
        Side: undefined
    },
    0x42: {
        Display: "B",
        Modifier: undefined,
        Side: undefined
    },
    0x43: {
        Display: "C",
        Modifier: undefined,
        Side: undefined
    },
    0x44: {
        Display: "D",
        Modifier: undefined,
        Side: undefined
    },
    0x45: {
        Display: "E",
        Modifier: undefined,
        Side: undefined
    },
    0x46: {
        Display: "F",
        Modifier: undefined,
        Side: undefined
    },
    0x47: {
        Display: "G",
        Modifier: undefined,
        Side: undefined
    },
    0x48: {
        Display: "H",
        Modifier: undefined,
        Side: undefined
    },
    0x49: {
        Display: "I",
        Modifier: undefined,
        Side: undefined
    },
    0x4A: {
        Display: "J",
        Modifier: undefined,
        Side: undefined
    },
    0x4B: {
        Display: "K",
        Modifier: undefined,
        Side: undefined
    },
    0x4C: {
        Display: "L",
        Modifier: undefined,
        Side: undefined
    },
    0x4D: {
        Display: "M",
        Modifier: undefined,
        Side: undefined
    },
    0x4E: {
        Display: "N",
        Modifier: undefined,
        Side: undefined
    },
    0x4F: {
        Display: "O",
        Modifier: undefined,
        Side: undefined
    },
    0x50: {
        Display: "P",
        Modifier: undefined,
        Side: undefined
    },
    0x51: {
        Display: "Q",
        Modifier: undefined,
        Side: undefined
    },
    0x52: {
        Display: "R",
        Modifier: undefined,
        Side: undefined
    },
    0x53: {
        Display: "S",
        Modifier: undefined,
        Side: undefined
    },
    0x54: {
        Display: "T",
        Modifier: undefined,
        Side: undefined
    },
    0x55: {
        Display: "U",
        Modifier: undefined,
        Side: undefined
    },
    0x56: {
        Display: "V",
        Modifier: undefined,
        Side: undefined
    },
    0x57: {
        Display: "W",
        Modifier: undefined,
        Side: undefined
    },
    0x58: {
        Display: "X",
        Modifier: undefined,
        Side: undefined
    },
    0x59: {
        Display: "Y",
        Modifier: undefined,
        Side: undefined
    },
    0x5A: {
        Display: "Z",
        Modifier: undefined,
        Side: undefined
    },
    0x5B: {
        Display: WindowsLogo,
        Modifier: undefined,
        Side: "L"
    },
    0x5C: {
        Display: WindowsLogo,
        Modifier: undefined,
        Side: "R"
    },
    0x5D: {
        Display: "\uE700",
        Modifier: undefined,
        Side: undefined
    },
    0x60: {
        Display: "0",
        Modifier: NumModifier,
        Side: undefined
    },
    0x61: {
        Display: "1",
        Modifier: NumModifier,
        Side: undefined
    },
    0x62: {
        Display: "2",
        Modifier: NumModifier,
        Side: undefined
    },
    0x63: {
        Display: "3",
        Modifier: NumModifier,
        Side: undefined
    },
    0x64: {
        Display: "4",
        Modifier: NumModifier,
        Side: undefined
    },
    0x65: {
        Display: "5",
        Modifier: NumModifier,
        Side: undefined
    },
    0x66: {
        Display: "6",
        Modifier: NumModifier,
        Side: undefined
    },
    0x67: {
        Display: "7",
        Modifier: NumModifier,
        Side: undefined
    },
    0x68: {
        Display: "8",
        Modifier: NumModifier,
        Side: undefined
    },
    0x69: {
        Display: "9",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6A: {
        Display: "×",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6B: {
        Display: "+",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6D: {
        Display: "-",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6E: {
        Display: ".",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6F: {
        Display: "/",
        Modifier: NumModifier,
        Side: undefined
    },
    0x70: {
        Display: "F1",
        Modifier: undefined,
        Side: undefined
    },
    0x71: {
        Display: "F2",
        Modifier: undefined,
        Side: undefined
    },
    0x72: {
        Display: "F3",
        Modifier: undefined,
        Side: undefined
    },
    0x73: {
        Display: "F4",
        Modifier: undefined,
        Side: undefined
    },
    0x74: {
        Display: "F5",
        Modifier: undefined,
        Side: undefined
    },
    0x75: {
        Display: "F6",
        Modifier: undefined,
        Side: undefined
    },
    0x76: {
        Display: "F7",
        Modifier: undefined,
        Side: undefined
    },
    0x77: {
        Display: "F8",
        Modifier: undefined,
        Side: undefined
    },
    0x78: {
        Display: "F9",
        Modifier: undefined,
        Side: undefined
    },
    0x79: {
        Display: "F10",
        Modifier: undefined,
        Side: undefined
    },
    0x7A: {
        Display: "F11",
        Modifier: undefined,
        Side: undefined
    },
    0x7B: {
        Display: "F12",
        Modifier: undefined,
        Side: undefined
    },
    0x7C: {
        Display: "F13",
        Modifier: undefined,
        Side: undefined
    },
    0x7D: {
        Display: "F14",
        Modifier: undefined,
        Side: undefined
    },
    0x7E: {
        Display: "F15",
        Modifier: undefined,
        Side: undefined
    },
    0x7F: {
        Display: "F16",
        Modifier: undefined,
        Side: undefined
    },
    0x80: {
        Display: "F17",
        Modifier: undefined,
        Side: undefined
    },
    0x81: {
        Display: "F18",
        Modifier: undefined,
        Side: undefined
    },
    0x82: {
        Display: "F19",
        Modifier: undefined,
        Side: undefined
    },
    0x83: {
        Display: "F20",
        Modifier: undefined,
        Side: undefined
    },
    0x84: {
        Display: "F21",
        Modifier: undefined,
        Side: undefined
    },
    0x85: {
        Display: "F22",
        Modifier: undefined,
        Side: undefined
    },
    0x86: {
        Display: "F23",
        Modifier: undefined,
        Side: undefined
    },
    0x87: {
        Display: "F24",
        Modifier: undefined,
        Side: undefined
    },
    0xA0: {
        Display: ShiftSymbol,
        Modifier: undefined,
        Side: "L"
    },
    0xA1: {
        Display: ShiftSymbol,
        Modifier: undefined,
        Side: "R"
    },
    0xA2: {
        Display: "CTRL",
        Modifier: undefined,
        Side: "L"
    },
    0xA3: {
        Display: "CTRL",
        Modifier: undefined,
        Side: "R"
    },
    0xA4: {
        Display: "ALT",
        Modifier: undefined,
        Side: "L"
    },
    0xA5: {
        Display: "ALT",
        Modifier: undefined,
        Side: "R"
    },
    0xA6: {
        Display: "&#E72B",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA7: {
        Display: "\uE72A",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA8: {
        Display: "\uE72C",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA9: {
        Display: "\uE733",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAA: {
        Display: "\uE721",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAB: {
        Display: "\uE728",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAC: {
        /* @TODO Consider using a different icon. */
        Display: "\uF71C",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xB0: {
        Display: "\uEB9D",
        Modifier: undefined,
        Side: undefined
    },
    0xB1: {
        Display: "\uEB9E",
        Modifier: undefined,
        Side: undefined
    },
    0xB2: {
        Display: "\uE71A",
        Modifier: undefined,
        Side: undefined
    },
    0xB3: {
        Display: "\uE768",
        Modifier: undefined,
        Side: undefined
    },
    0xB4: {
        Display: "\uE715",
        Modifier: undefined,
        Side: undefined
    },
    0xB5: {
        Display: "\uEA69",
        Modifier: undefined,
        Side: undefined
    },
    0xB6: {
        Display: "\uEB3B",
        Modifier: undefined,
        Side: undefined
    },
    0xB7: {
        Display: "\uED35",
        Modifier: undefined,
        Side: undefined
    },
    0xBA: {
        Display: ";",
        Modifier: undefined,
        Side: undefined
    },
    0xBB: {
        Display: "+",
        Modifier: undefined,
        Side: undefined
    },
    0xBC: {
        Display: ",",
        Modifier: undefined,
        Side: undefined
    },
    0xBD: {
        Display: "-",
        Modifier: undefined,
        Side: undefined
    },
    0xBE: {
        Display: ".",
        Modifier: undefined,
        Side: undefined
    },
    0xBF: {
        Display: "/",
        Modifier: undefined,
        Side: undefined
    },
    0xC0: {
        Display: "`",
        Modifier: undefined,
        Side: undefined
    },
    0xDB: {
        Display: "[",
        Modifier: undefined,
        Side: undefined
    },
    0xDC: {
        Display: "\\",
        Modifier: undefined,
        Side: undefined
    },
    0xDD: {
        Display: "]",
        Modifier: undefined,
        Side: undefined
    },
    0xDE: {
        Display: "'",
        Modifier: undefined,
        Side: undefined
    }
};
exports.ActionKeys = [
    "Activate",
    "Cancel",
    "Direction.Down",
    "Direction.Left",
    "Direction.Right",
    "Direction.Up",
    "Miscellaneous.FocusList",
    "Miscellaneous.FocusTextInput",
    "Miscellaneous.Peek",
    "Miscellaneous.Settings",
    "Primary[0]",
    "Primary[1]",
    "Primary[2]",
    "Primary[3]",
    "Secondary[0]",
    "Secondary[1]",
    "Secondary[2]",
    "Secondary[3]"
];


/***/ },

/***/ "./Source/Shared/Settings/Settings.Types.ts"
/*!**************************************************!*\
  !*** ./Source/Shared/Settings/Settings.Types.ts ***!
  \**************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Settings/Settings.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Settings/Settings.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Settings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultSettings = exports.ExternalSettings = void 0;
exports.ExternalSettings = ["RunOnStartup"];
exports.DefaultSettings = {
    AnimationScalar: 1,
    Gap: 4,
    Keybinds: {
        Activate: ["F20"],
        Cancel: ["Backspace"],
        Direction: {
            /* eslint-disable sort-keys */
            Left: ["D"],
            Up: ["H"],
            Down: ["T"],
            Right: ["N"]
            /* eslint-enable sort-keys */
        },
        Miscellaneous: {
            FocusList: ["`"],
            FocusTextInput: ["Tab"],
            Peek: ["Z"],
            Settings: ["+"]
        },
        Primary: {
            0: ["F"],
            1: ["G"],
            2: ["T"],
            3: ["R"]
        },
        Secondary: {
            0: ["Ctrl", "F"],
            1: ["Ctrl", "G"],
            2: ["Ctrl", "T"],
            3: ["Ctrl", "R"]
        }
    },
    RunOnStartup: false,
    ShowUpdateNotifications: true
};


/***/ },

/***/ "./Source/Shared/Settings/index.ts"
/*!*****************************************!*\
  !*** ./Source/Shared/Settings/index.ts ***!
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
__exportStar(__webpack_require__(/*! ./Keybind */ "./Source/Shared/Settings/Keybind.ts"), exports);
__exportStar(__webpack_require__(/*! ./Keybind.Types */ "./Source/Shared/Settings/Keybind.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings */ "./Source/Shared/Settings/Settings.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings.Types */ "./Source/Shared/Settings/Settings.Types.ts"), exports);


/***/ },

/***/ "./Source/Shared/Shared.Types.ts"
/*!***************************************!*\
  !*** ./Source/Shared/Shared.Types.ts ***!
  \***************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Shared.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Store.Types.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Store.Types.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Store.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Store.ts"
/*!********************************!*\
  !*** ./Source/Shared/Store.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


/**
 * @file      Store.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetDefaultStore = void 0;
// import { app } from "electron";
const GetDefaultStore = () => {
    return {
        // AppVersion: app.getVersion(),
        AppVersion: "@TODO",
        TimeLastCheckedUpdate: null
    };
};
exports.GetDefaultStore = GetDefaultStore;


/***/ },

/***/ "./Source/Shared/Tokens.ts"
/*!*********************************!*\
  !*** ./Source/Shared/Tokens.ts ***!
  \*********************************/
(__unused_webpack_module, exports) {


/**
 * @file      Tokens.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 * Comment:   This hosts simple values used by `main` and the `renderer`.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tokens = void 0;
/* eslint-disable-next-line @typescript-eslint/typedef */
exports.Tokens = {
    TitlebarHeight: 48
};


/***/ },

/***/ "./Source/Shared/Tree.Types.ts"
/*!*************************************!*\
  !*** ./Source/Shared/Tree.Types.ts ***!
  \*************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Tree.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Functional.Types.ts"
/*!***************************************************!*\
  !*** ./Source/Shared/Utility/Functional.Types.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Utility.Types.ts"
/*!************************************************!*\
  !*** ./Source/Shared/Utility/Utility.Types.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Utility.ts"
/*!******************************************!*\
  !*** ./Source/Shared/Utility/Utility.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZeroBox = void 0;
exports.GetEmptyMonitor = GetEmptyMonitor;
exports.GetEmptyWindow = GetEmptyWindow;
exports.IsAsyncFunction = IsAsyncFunction;
exports.CallMaybeAsync = CallMaybeAsync;
exports.ExtractFromRecordArray = ExtractFromRecordArray;
exports.GetByKey = GetByKey;
exports.Delay = Delay;
exports.RetryUntilFulfilled = RetryUntilFulfilled;
const Log_1 = __webpack_require__(/*! @/Log */ "./Source/Renderer/Log.ts");
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log = (0, Log_1.GetLogger)("Utility");
function GetEmptyMonitor() {
    return {
        Handle: -1
    };
}
;
function GetEmptyWindow() {
    return {
        Handle: ""
    };
}
;
/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @stylistic/brace-style */
const AsyncFunction = (async function () { }).constructor;
function IsAsyncFunction(Value) {
    return typeof Value === "function" && Value.constructor === AsyncFunction;
}
async function CallMaybeAsync(Function, ...ArgumentVector) {
    if (IsAsyncFunction(Function)) {
        return await Function(...ArgumentVector);
    }
    else {
        return Function(...ArgumentVector);
    }
}
exports.ZeroBox = {
    Height: 0,
    Width: 0,
    X: 0,
    Y: 0
};
function ExtractFromRecordArray(Key, InArray) {
    return InArray.map((Record) => {
        return Record[Key];
    });
}
;
function GetByKey(Key) {
    return (Record) => {
        return Record[Key];
    };
}
async function Delay(Duration) {
    return new Promise((Resolve, _Reject) => {
        setTimeout(Resolve, Duration);
    });
}
async function RetryUntilFulfilled(In, NumTries = undefined, DurationToTry = undefined) {
    let StartTime = undefined;
    let LastCompletionTime = undefined;
    let NumAttempts = 0;
    const HasExceededLimits = () => {
        const ExceededNumAttempts = (NumTries !== undefined)
            ? NumAttempts === NumTries
            : false;
        const AreDurationVariablesInitialized = (DurationToTry !== undefined &&
            LastCompletionTime !== undefined &&
            StartTime !== undefined);
        if (StartTime !== undefined && LastCompletionTime !== undefined) {
            StartTime = LastCompletionTime;
        }
        const ExceededDurationToTry = AreDurationVariablesInitialized
            ? (LastCompletionTime - StartTime) >= DurationToTry
            : false;
        return ExceededNumAttempts || ExceededDurationToTry;
    };
    while (HasExceededLimits()) {
        try {
            const Out = await In();
            return Out;
        }
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        catch (_Error) {
            LastCompletionTime = new Date().getTime();
            if (NumTries !== undefined) {
                NumAttempts++;
            }
        }
    }
    return undefined;
}
;


/***/ },

/***/ "./Source/Shared/Utility/index.ts"
/*!****************************************!*\
  !*** ./Source/Shared/Utility/index.ts ***!
  \****************************************/
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
__exportStar(__webpack_require__(/*! ./Functional.Types */ "./Source/Shared/Utility/Functional.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility */ "./Source/Shared/Utility/Utility.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility.Types */ "./Source/Shared/Utility/Utility.Types.ts"), exports);


/***/ },

/***/ "./Source/Shared/index.ts"
/*!********************************!*\
  !*** ./Source/Shared/index.ts ***!
  \********************************/
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
__exportStar(__webpack_require__(/*! ./Event */ "./Source/Shared/Event/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./Keyboard */ "./Source/Shared/Keyboard.ts"), exports);
__exportStar(__webpack_require__(/*! ./Keyboard.Types */ "./Source/Shared/Keyboard.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Log.Types */ "./Source/Shared/Log.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings */ "./Source/Shared/Settings/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./Shared.Types */ "./Source/Shared/Shared.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Store */ "./Source/Shared/Store.ts"), exports);
__exportStar(__webpack_require__(/*! ./Store.Types */ "./Source/Shared/Store.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Tree.Types */ "./Source/Shared/Tree.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Tokens */ "./Source/Shared/Tokens.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility */ "./Source/Shared/Utility/index.ts"), exports);


/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fSW5pdGlhbGl6ZV9Jbml0aWFsaXplX3RzLVNvdXJjZV9TaGFyZWRfaW5kZXhfdHMuYnVuZGxlLmRldi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRzs7QUFlSCx3RUFzR0M7QUFqSEQsbUVBQXNDO0FBRXRDLHVHQUFrRDtBQUVsRCxNQUFNLHVCQUF1QixHQUFrQixFQUFHLENBQUM7QUFFbkQsSUFBSSxjQUFjLEdBQVksS0FBSyxDQUFDO0FBRXBDOztHQUVHO0FBQ0ksS0FBSyxVQUFVLDhCQUE4QixDQUNoRCxJQUFZLEVBQ1osV0FBa0MsRUFDbEMsa0JBQWlDLEVBQUc7SUFHcEMsTUFBTSxHQUFHLEdBQVksbUJBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQztJQUM3QyxHQUFHLENBQUMsMkNBQTRDLElBQUssR0FBRyxDQUFDLENBQUM7SUFDMUQsZ0ZBQWdGO0lBQ2hGLE1BQU0sY0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBRXRCLElBQUksQ0FBQyxjQUFjLEVBQ25CLENBQUM7UUFDRyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLHdCQUF3QjtRQUN4QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsTUFBTSxrQkFBa0IsR0FDcEI7UUFDSSxlQUFlO1FBQ2YsV0FBVyxFQUFFLEtBQUs7S0FDckIsQ0FBQztJQUVOLE1BQU0sa0JBQWtCLEdBQWtCLElBQUksT0FBTyxDQUFPLENBQ3hELE9BQW9CLEVBQ3BCLE1BQWUsRUFDWCxFQUFFO1FBRU4sSUFBSSxPQUFPLEdBQStCLFNBQVMsQ0FBQztRQUNwRCxNQUFNLFdBQVcsR0FBVyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pELE1BQU0saUJBQWlCLEdBQVcsR0FBRyxDQUFDO1FBQ3RDLE1BQU0sV0FBVyxHQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDdEMsSUFBSSxlQUFlLEdBQVcs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LEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsY0FBYztJQUNwQixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxVQUFVO0lBQ2hCLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNY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QUNULElBQUksRUFBRSxJQUFJO0lBQ1YsU0FBUyxFQUFFLElBQUk7SUFDZixPQUFPLEVBQUUsSUFBSTtJQUNiLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixZQUFZLEVBQUUsSUFBSTtJQUNsQixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFFBQVEsRUFBRSxJQUFJO0lBQ2QsR0FBRyxFQUFFLElBQUk7SUFDVCxRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsSUFBSTtJQUNaLEtBQUssRUFBRSxJQUFJO0lBQ1gsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsV0FBVyxFQUFFLElBQUk7SUFDakIsY0FBYyxFQUFFLElBQUk7SUFDcEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsV0FBVyxFQUFFLElBQUk7SUFDakIsYUFBYSxFQUFFLElBQUk7SUFDbkIsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixZQUFZLEVBQUUsSUFBSTtJQUNsQixTQUFTLEVBQUUsSUFBSTtJQUNmLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFNBQVMsRUFBRSxJQUFJO0lBQ2YsY0FBYyxFQUFFLElBQUk7SUFDcEIsU0FBUyxFQUFFLElBQUk7SUFDZixXQUFXLEVBQUUsSUFBSTtJQUNqQixtQkFBbUIsRUFBRSxJQUFJO0lBQ3pCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtDQUNILENBQUM7QUFLVCxtQkFBVyxHQUNiO0lBQ0ksSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNK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bkIsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFDRCxJQUFJLEVBQ0o7UUFDSSxPQUFPLEVBQUUsSUFBSTtRQUNiLFFBQVEsRUFBRSxTQUFTO1FBQ25CLElBQUksRUFBRSxTQUFTO0tBQ2xCO0lBQ0QsSUFBSSxFQUNKO1FBQ0ksT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsU0FBUztRQUNuQixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUNELElBQUksRUFDSjtRQUNJLE9BQU8sRUFBRSxLQUFLO1FBQ2QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFDRCxJQUFJLEVBQ0o7UUFDSSxPQUFPLEVBQUUsS0FBSztRQUNkLFFBQVEsRUFBRSxTQUFTO1FBQ25CLElBQUksRUFBRSxTQUFTO0tBQ2xCO0lBQ0QsSUFBSSxFQUNKO1FBQ0ksT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsU0FBUztRQUNuQixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUNELElBQUksRUFDSjtRQUNJLE9BQU8sRUFBRSxLQUFLO1FBQ2QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFDRCxJQUFJLEVBQ0o7UUFDSSxPQUFPLEVBQUUsS0FBSztRQUNkLFFBQVEsRUFBRSxTQUFTO1FBQ25CLElBQUksRUFBRSxTQUFTO0tBQ2xCO0lBQ0QsSUFBSSxFQUNKO1FBQ0ksT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsU0FBUztRQUNuQixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUNELElBQUksRUFDSjtRQUNJLE9BQU8sRUFBRSxLQUFLO1FBQ2QsUUFBUSxFQUFFLFNBQVM7UUFDbkIsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFDRCxJQUFJLEVBQ0o7UUFDSSxPQUFPLEVBQUUsS0FBSztRQUNkLFFBQVEsRUFBRSxTQUFTO1FBQ25CLElBQUksRUFBRSxTQUFTO0tBQ2xCO0lBQ0QsSUFBSSxFQUNKO1FBQ0ksT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsU0FBUztR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LDhGQUE0QjtBQUM1QixrR0FBMkI7QUFDM0Isb0dBQStCO0FBQy9CLHNGQUF3QjtBQUN4QixrR0FBOEI7QUFDOUIsZ0dBQTZCO0FBQzdCLHdGQUF5QjtBQUN6QixnR0FBMEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0luaXRpYWxpemUvSW5pdGlhbGl6ZS50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9SZW5kZXJlci9Mb2cudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L0ZvY3VzLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL1NoYXJlZC9FdmVudC9JbnNlcnQuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L01vdmUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L05hdmlnYXRlLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL1NoYXJlZC9FdmVudC9TZXR0aW5ncy5UeXBlcy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9TaGFyZWQvRXZlbnQvVGlsZS5UeXBlcy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9TaGFyZWQvRXZlbnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL0tleWJvYXJkLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL1NoYXJlZC9LZXlib2FyZC50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9TaGFyZWQvTG9nLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL1NoYXJlZC9Mb2cudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1NldHRpbmdzL0tleWJpbmQuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1NldHRpbmdzL0tleWJpbmQudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1NldHRpbmdzL1NldHRpbmdzLlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL1NoYXJlZC9TZXR0aW5ncy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9TaGFyZWQvU2V0dGluZ3MvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1NoYXJlZC5UeXBlcy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9TaGFyZWQvU3RvcmUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1N0b3JlLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL1NoYXJlZC9Ub2tlbnMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1RyZWUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1V0aWxpdHkvRnVuY3Rpb25hbC5UeXBlcy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9VdGlsaXR5LlR5cGVzLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL1NoYXJlZC9VdGlsaXR5L1V0aWxpdHkudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL1V0aWxpdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvU2hhcmVkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgICAgICBJbml0aWFsaXplLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGSW5pdGlhbGl6ZXIsIEZJbml0aWFsaXplcnMgfSBmcm9tIFwiLi9Jbml0aWFsaXplLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRSZWplY3QsIFRUaGVuIH0gZnJvbSBcIkBzb3JyZWxsL3V0aWxpdGllcy9hc3luY1wiO1xuaW1wb3J0IHsgYXBwIGFzIEFwcCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHR5cGUgeyBGTG9nZ2VyIH0gZnJvbSBcIi4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHsgR2V0TG9nZ2VyIH0gZnJvbSBcIiMvRGV2ZWxvcG1lbnQvTG9nL0xvZ1wiO1xuXG5jb25zdCBJbml0aWFsaXphdGlvbkZ1bmN0aW9uczogRkluaXRpYWxpemVycyA9IHsgfTtcblxubGV0IExvZ2dlZEFwcFJlYWR5OiBib29sZWFuID0gZmFsc2U7XG5cbi8qKlxuICogRm9yIHNpZGUgZWZmZWN0cyBgaW1wb3J0YGVkIHZpYSBgU2lkZUVmZmVjdHMudHNgIHRoYXQgcmVxdWlyZSBgYXBwLndoZW5SZWFkeSgpYCB0byBiZSBmdWxmaWxsZWQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBSZWdpc3RlckluaXRpYWxpemF0aW9uRnVuY3Rpb24oXG4gICAgTmFtZTogc3RyaW5nLFxuICAgIEluaXRpYWxpemVyOiAoKCkgPT4gUHJvbWlzZTx2b2lkPiksXG4gICAgRGVwZW5kZW5jeUFycmF5OiBBcnJheTxzdHJpbmc+ID0gWyBdXG4pOiBQcm9taXNlPHZvaWQ+XG57XG4gICAgY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiSW5pdGlhbGl6ZVwiKTtcbiAgICBMb2coYEdvaW5nIHRvIHJlZ2lzdGVyIGluaXRpYWxpemVyIHdpdGggbmFtZSAkeyBOYW1lIH0uYCk7XG4gICAgLy8gcHJvY2Vzcy5zdGRvdXQud3JpdGUoYEdvaW5nIHRvIHJlZ2lzdGVyIGluaXRpYWxpemVyIHdpdGggbmFtZSAkeyBOYW1lIH0uXFxuYCk7XG4gICAgYXdhaXQgQXBwLndoZW5SZWFkeSgpO1xuXG4gICAgaWYgKCFMb2dnZWRBcHBSZWFkeSlcbiAgICB7XG4gICAgICAgIExvZ2dlZEFwcFJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgLy8gTG9nKFwiQXBwIGlzIHJlYWR5IVwiKTtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoXCJBcHAgaXMgcmVhZHkhXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IFBhcnRpYWxJbml0aWFsaXplcjogUGFydGlhbDxGSW5pdGlhbGl6ZXI+ID1cbiAgICAgICAge1xuICAgICAgICAgICAgRGVwZW5kZW5jeUFycmF5LFxuICAgICAgICAgICAgSXNGdWxmaWxsZWQ6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICBjb25zdCBXcmFwcGVkSW5pdGlhbGl6ZXI6IFByb21pc2U8dm9pZD4gPSBuZXcgUHJvbWlzZTx2b2lkPigoXG4gICAgICAgIFJlc29sdmU6IFRUaGVuPHZvaWQ+LFxuICAgICAgICBSZWplY3Q6IFRSZWplY3RcbiAgICApOiB2b2lkID0+XG4gICAge1xuICAgICAgICBsZXQgVGltZXJJZDogTm9kZUpTLlRpbWVvdXQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IFRpbWVTdGFydGVkOiBudW1iZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgVGltZUJldHdlZW5DaGVja3M6IG51bWJlciA9IDI1MDtcbiAgICAgICAgY29uc3QgTWF4RHVyYXRpb246IG51bWJlciA9IDYwICogMTAwMDtcbiAgICAgICAgbGV0IFRpbWVPZkxhc3RDaGVjazogbnVtYmVyID0gVGltZVN0YXJ0ZWQ7XG5cbiAgICAgICAgY29uc3QgQ2hlY2sgPSAoKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBUaW1lZE91dDogYm9vbGVhbiA9IChUaW1lT2ZMYXN0Q2hlY2sgLSBUaW1lU3RhcnRlZCkgPj0gTWF4RHVyYXRpb247XG4gICAgICAgICAgICBpZiAoVGltZWRPdXQgJiYgVGltZXJJZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgICAgIC8vIExvZy5FcnJvcihgSW5pdGlhbGl6ZXIgJHsgTmFtZSB9IGNvdWxkIG5vdCBiZSBmdWxmaWxsZWQuICBJdHMgZGVwZW5kZW5jaWVzIGFyZSAkeyBEZXBlbmRlbmN5QXJyYXkuam9pbihcIiwgXCIpIH0uYCk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChUaW1lcklkKTtcbiAgICAgICAgICAgICAgICBSZWplY3QoYEluaXRpYWxpemVyICR7IE5hbWUgfSBjb3VsZCBub3QgYmUgZnVsZmlsbGVkLiAgSXRzIGRlcGVuZGVuY2llcyBhcmUgJHsgRGVwZW5kZW5jeUFycmF5LmpvaW4oXCIsIFwiKSB9LmApO1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IEFyZURlcGVuZGVuY2llc1JlZ2lzdGVyZWQ6IGJvb2xlYW4gPSBEZXBlbmRlbmN5QXJyYXkuZXZlcnkoXG4gICAgICAgICAgICAgICAgKERlcGVuZGVuY3lOYW1lOiBzdHJpbmcpOiBib29sZWFuID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGVwZW5kZW5jeU5hbWUgaW4gSW5pdGlhbGl6YXRpb25GdW5jdGlvbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFBcmVEZXBlbmRlbmNpZXNSZWdpc3RlcmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFRpbWVPZkxhc3RDaGVjayA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgQXJlRGVwZW5kZW5jaWVzRnVsZmlsbGVkOiBib29sZWFuID0gRGVwZW5kZW5jeUFycmF5LmV2ZXJ5KFxuICAgICAgICAgICAgICAgIChEZXBlbmRlbmN5TmFtZTogc3RyaW5nKTogYm9vbGVhbiA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEluaXRpYWxpemF0aW9uRnVuY3Rpb25zW0RlcGVuZGVuY3lOYW1lXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBJc0Z1bGZpbGxlZCB9ID0gSW5pdGlhbGl6YXRpb25GdW5jdGlvbnNbRGVwZW5kZW5jeU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElzRnVsZmlsbGVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKEFyZURlcGVuZGVuY2llc0Z1bGZpbGxlZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoVGltZXJJZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChUaW1lcklkKTtcbiAgICAgICAgICAgICAgICAgICAgSW5pdGlhbGl6ZXIoKS50aGVuKCgpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFBhcnRpYWxJbml0aWFsaXplci5Jc0Z1bGZpbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVGltZU9mTGFzdENoZWNrID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgVGltZXJJZCA9IHNldEludGVydmFsKENoZWNrLCBUaW1lQmV0d2VlbkNoZWNrcyk7XG4gICAgfSk7XG5cbiAgICBpZiAoTmFtZSBpbiBJbml0aWFsaXphdGlvbkZ1bmN0aW9ucylcbiAgICB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVHdvIGluaXRpYWxpemVyIGZ1bmN0aW9ucyB3ZXJlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgc2FtZSBuYW1lLCBcIiR7IE5hbWUgfVwiLmApO1xuICAgIH1cblxuICAgIFBhcnRpYWxJbml0aWFsaXplci5Jbml0aWFsaXplciA9IFdyYXBwZWRJbml0aWFsaXplcjtcblxuICAgIEluaXRpYWxpemF0aW9uRnVuY3Rpb25zW05hbWVdID0gUGFydGlhbEluaXRpYWxpemVyIGFzIEZJbml0aWFsaXplcjtcbn1cbiIsIi8qKlxuICogQGZpbGUgICAgICBMb2cudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZHZXRUaW1lVG9rZW4sIEZMb2dGdW5jdGlvbiwgRkxvZ2dlciwgRkxvZ2dlckludGVyaW0gfSBmcm9tIFwiLi4vU2hhcmVkL0xvZy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGTG9nTGV2ZWwgfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuaW1wb3J0IHsgR2V0VGltZVRva2VuIH0gZnJvbSBcIi4uL1NoYXJlZC9Mb2dcIjtcblxuZXhwb3J0IGNvbnN0IEdldFRpbWUgPSAoKTogRkdldFRpbWVUb2tlbiA9Plxue1xuICAgIHJldHVybiBHZXRUaW1lVG9rZW47XG59O1xuXG4vKiogVXNlIHRoaXMgdG8gY3JlYXRlIGEgbG9nZ2VyIHdpdGhpbiBhIGdpdmVuIG1vZHVsZSBzbyB0aGF0IHRoZSBsb2cgY2F0ZWdvcnkgaXMgc2V0IGZvciB0aGF0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBHZXRMb2dnZXIgPSAoQ2F0ZWdvcnk6IHN0cmluZyk6IEZMb2dnZXIgPT5cbntcbiAgICBjb25zdCBNYWtlTG9nZ2VySW50ZXJuYWwgPSAoTGV2ZWw6IEZMb2dMZXZlbCk6IEZMb2dGdW5jdGlvbiA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuICguLi5TdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IEZpbHRlcmVkU3RhdGVtZW50czogVEFycmF5PHVua25vd24+ID0gU3RhdGVtZW50cy5tYXAoKFN0YXRlbWVudDogdW5rbm93bik6IHVua25vd24gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFN0YXRlbWVudCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShTdGF0ZW1lbnQsIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3aW5kb3cuZWxlY3Ryb24uaXBjUmVuZGVyZXIuU2VuZChcIkxvZ1wiLCBDYXRlZ29yeSwgTGV2ZWwsIC4uLkZpbHRlcmVkU3RhdGVtZW50cyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IExvZ2dlcjogRkxvZ2dlckludGVyaW0gPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJOb3JtYWxcIik7XG4gICAgTG9nZ2VyLkVycm9yID0gTWFrZUxvZ2dlckludGVybmFsKFwiRXJyb3JcIik7XG4gICAgTG9nZ2VyLlZlcmJvc2UgPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJWZXJib3NlXCIpO1xuICAgIExvZ2dlci5XYXJuID0gTWFrZUxvZ2dlckludGVybmFsKFwiV2FyblwiKTtcblxuICAgIHJldHVybiBMb2dnZXIgYXMgRkxvZ2dlcjtcbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgVHJhbnNhY3Rpb25zLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKiBDb21tZW50OiAgIERlZmluZSB0eXBlcyB1c2VkIGluIGBFdmVudC5UeXBlcy50c2AgdGhhdFxuICogICAgICAgICAgICBkbyBub3Qgb3RoZXJ3aXNlIGhhdmUgYSBnb29kIHBsYWNlIHRvIGdvLlxuICovXG5cbmltcG9ydCB0eXBlIHsgRXZlbnREZWNsLCBSZW5kZXJlck93bmVyIH0gZnJvbSBcImVsZWN0cm9uLXJlYWN0aXZlLWV2ZW50XCI7XG5pbXBvcnQgdHlwZSB7IEZCb3ggfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuaW1wb3J0IHR5cGUgeyBGRm9jdXNDaGFuZ2UgfSBmcm9tIFwiLi4vVHJlZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZXaW5kb3dGb2N1c0RhdGEgPVxuICAgIHtcbiAgICAgICAgRm9jdXNlZFdpbmRvd1RpdGxlOiBzdHJpbmc7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRlBhbmVsRm9jdXNEYXRhID1cbiAgICB7XG4gICAgICAgIE51bVZlcnRpY2VzOiBudW1iZXI7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRkZvY3VzRGF0YUJhc2UgPVxuICAgIHtcbiAgICAgICAgQ2FuTW92ZVdpdGhpblBhbmVsOiBib29sZWFuO1xuICAgICAgICBDYW5TdGVwVXA6IGJvb2xlYW47XG4gICAgICAgIENhblN0ZXBEb3duOiBib29sZWFuO1xuICAgICAgICBEaXJlY3Rpb246IFwiSG9yaXpvbnRhbFwiIHwgXCJWZXJ0aWNhbFwiO1xuICAgICAgICBSZWFsU2l6ZTogRkJveDtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBGRm9jdXNEYXRhID1cbiAgICBGRm9jdXNEYXRhQmFzZSAmXG4gICAgKFxuICAgICAgICB8IEZXaW5kb3dGb2N1c0RhdGFcbiAgICAgICAgfCBGUGFuZWxGb2N1c0RhdGFcbiAgICApO1xuXG5leHBvcnQgdHlwZSBGT25DaGFuZ2VGb2N1c0Vycm9yQ29kZSA9XG4gICAgfCBGR2V0Rm9jdXNEYXRhRXJyb3JDb2RlXG4gICAgfCBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRGb2N1c0RhdGFFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XG4gICAgfCBcIkN1cnJlbnRQYW5lbFVuZGVmaW5lZFwiXG4gICAgfCBcIkZvY3VzZWRWZXJ0ZXhVbmRlZmluZWRcIlxuPjtcblxuZGVjbGFyZSBtb2R1bGUgXCJlbGVjdHJvbi1yZWFjdGl2ZS1ldmVudC9yZWdpc3RyYXJcIlxue1xuICAgIGludGVyZmFjZSBSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIEdldEZvY3VzRGF0YTogRXZlbnREZWNsPFxuICAgICAgICAgICAgUmVuZGVyZXJPd25lcixcbiAgICAgICAgICAgIG5ldmVyLFxuICAgICAgICAgICAgRkZvY3VzRGF0YSxcbiAgICAgICAgICAgIEZHZXRGb2N1c0RhdGFFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgT25DaGFuZ2VGb2N1czogRXZlbnREZWNsPFxuICAgICAgICAgICAgUmVuZGVyZXJPd25lcixcbiAgICAgICAgICAgIEZGb2N1c0NoYW5nZSxcbiAgICAgICAgICAgIEZGb2N1c0RhdGEsXG4gICAgICAgICAgICBGT25DaGFuZ2VGb2N1c0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgIH1cbn1cbiIsIi8qKlxuICogQGZpbGUgICAgICBJbnNlcnRFdmVudC5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgSFdpbmRvdyB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5cbi8qKlxuICogV2hlbiBhIG5ldyB2ZXJ0ZXggaXMgY3JlYXRlZCB3aXRoaW4gYSBwYW5lbCwgaG93IHNob3VsZCBpdHMgc2l6ZVxuICogYmUgZGV0ZXJtaW5lZCwgYXMgd2VsbCBhcyB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudCB2ZXJ0aWNlcz9cbiAqL1xuZXhwb3J0IHR5cGUgRkluc2VydFNpemluZ01ldGhvZCA9XG4gICAgfCBcIkJpc2VjdGlvblwiXG4gICAgfCBcIlVuaWZvcm1SZXNpemVcIjtcblxuZXhwb3J0IHR5cGUgRkluc2VydGFibGVXaW5kb3dEYXRhID1cbiAgICB7XG4gICAgICAgIEhhbmRsZTogSFdpbmRvdztcbiAgICAgICAgSWNvbjogc3RyaW5nO1xuICAgICAgICBUaXRsZTogc3RyaW5nO1xuICAgIH07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTW92ZS5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRXZlbnREZWNsIH0gZnJvbSBcImVsZWN0cm9uLXJlYWN0aXZlLWV2ZW50XCI7XG5pbXBvcnQgdHlwZSB7IEZBeGlzIH0gZnJvbSBcIi4uLy4uL1NoYXJlZC9TaGFyZWQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkZvY3VzRGF0YUJhc2UgfSBmcm9tIFwiLi9Gb2N1cy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZUcmFuc2xhdGlvbiA9XG4gICAge1xuICAgICAgICBEaXJlY3Rpb246IEZBeGlzO1xuICAgICAgICBEaXN0YW5jZTogbnVtYmVyO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZQYW5lbFN0ZXAgPVxuICAgIHwgXCJVcFwiXG4gICAgfCBcIkRvd25cIlxuICAgIHwgXCJOZXh0XCJcbiAgICB8IFwiUHJldmlvdXNcIjtcblxuZXhwb3J0IHR5cGUgRlRpbGVkTW92ZURhdGEgPSBPbWl0PEZGb2N1c0RhdGFCYXNlLCBcIkNhbk1vdmVXaXRoaW5QYW5lbFwiPjtcblxuZXhwb3J0IHR5cGUgRlRpbGVkTW92ZVRyYW5zYWN0aW9uID1cbiAgICB7XG4gICAgICAgIFN0ZXA6IEZQYW5lbFN0ZXA7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRlRpbGVkTW92ZVJlc3VsdCA9XG4gICAge1xuICAgICAgICBJc09uUGFuZWw6IGJvb2xlYW47XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRk1vdmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZGVjbGFyZSBtb2R1bGUgXCJlbGVjdHJvbi1yZWFjdGl2ZS1ldmVudC9yZWdpc3RyYXJcIlxue1xuICAgIGludGVyZmFjZSBSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIE1vdmVGbG9hdGluZ1dpbmRvdzogRXZlbnREZWNsPFxuICAgICAgICAgICAgUmVuZGVyZXJPd25lcixcbkZUcmFuc2xhdGlvbixcbiAgICAgICAgICAgIG5ldmVyLFxuICAgICAgICAgICAgRk1vdmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBNb3ZlVGlsZWRXaW5kb3c6IEV2ZW50RGVjbDxcbiAgICAgICAgICAgIFJlbmRlcmVyT3duZXIsXG5GVGlsZWRNb3ZlVHJhbnNhY3Rpb24sXG4gICAgICAgICAgICBGVGlsZWRNb3ZlUmVzdWx0LFxuICAgICAgICAgICAgRk1vdmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgIH1cbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTmF2aWdhdGUuVHlwZXMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEV2ZW50RGVjbCwgUmVuZGVyZXJPd25lciB9IGZyb20gXCJlbGVjdHJvbi1yZWFjdGl2ZS1ldmVudFwiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZOYXZpZ2F0ZVJlcXVlc3QgPVxuICAgIHtcbiAgICAgICAgUm91dGU6IHN0cmluZztcbiAgICAgICAgU3RhdGU/OiBSZWNvcmQ8UHJvcGVydHlLZXksIHVua25vd24+O1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZOYXZpZ2F0ZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZGVjbGFyZSBtb2R1bGUgXCJlbGVjdHJvbi1yZWFjdGl2ZS1ldmVudC9yZWdpc3RyYXJcIlxue1xuICAgIGludGVyZmFjZSBSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIE5hdmlnYXRlOiBFdmVudERlY2w8XG4gICAgICAgICAgICBSZW5kZXJlck93bmVyLFxuICAgICAgICAgICAgRk5hdmlnYXRlUmVxdWVzdCxcbiAgICAgICAgICAgIG5ldmVyLFxuICAgICAgICAgICAgRk5hdmlnYXRlRXJyb3JDb2RlXG4gICAgICAgID47XG5cbiAgICB9XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIFNldHRpbmdzLlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBFdmVudERlY2wsIFJlbmRlcmVyT3duZXIgfSBmcm9tIFwiZWxlY3Ryb24tcmVhY3RpdmUtZXZlbnRcIjtcbmltcG9ydCB0eXBlIHsgRkV4dGVybmFsU2V0dGluZywgRlNldHRpbmdzIH0gZnJvbSBcIi4uL1NldHRpbmdzXCI7XG5pbXBvcnQgdHlwZSB7IFRFdmVudEVycm9yQ29kZSB9IGZyb20gXCIuL0Vycm9yQ29kZXMuVHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRlVwZGF0ZVN0YXR1cyA9XG57XG4gICAgQXZhaWxhYmxlVmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IHR5cGUgRlVwZGF0ZVNldHRpbmdzRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuZXhwb3J0IHR5cGUgRkdldFNldHRpbmdzRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuZXhwb3J0IHR5cGUgRkdldFNldHRpbmdFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5leHBvcnQgdHlwZSBGQ2hlY2tGb3JVcGRhdGVzRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuZXhwb3J0IHR5cGUgRkdldEV4dGVybmFsU2V0dGluZ1N0YXRlRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5kZWNsYXJlIG1vZHVsZSBcImVsZWN0cm9uLXJlYWN0aXZlLWV2ZW50L3JlZ2lzdHJhclwiXG57XG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiAqL1xuICAgIGludGVyZmFjZSBSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIEdldEV4dGVybmFsU2V0dGluZ1N0YXRlOiBFdmVudERlY2w8XG4gICAgICAgICAgICBSZW5kZXJlck93bmVyLFxuICAgICAgICAgICAgRkV4dGVybmFsU2V0dGluZyxcbiAgICAgICAgICAgIEZTZXR0aW5nc1tGRXh0ZXJuYWxTZXR0aW5nXSxcbiAgICAgICAgICAgIEZHZXRFeHRlcm5hbFNldHRpbmdTdGF0ZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRTZXR0aW5nOiBFdmVudERlY2w8XG4gICAgICAgICAgICBSZW5kZXJlck93bmVyLFxuICAgICAgICAgICAga2V5b2YgRlNldHRpbmdzLFxuICAgICAgICAgICAgRlNldHRpbmdzW2tleW9mIEZTZXR0aW5nc10sXG4gICAgICAgICAgICBGR2V0U2V0dGluZ0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRTZXR0aW5nczogRXZlbnREZWNsPFxuICAgICAgICAgICAgUmVuZGVyZXJPd25lcixcbiAgICAgICAgICAgIG5ldmVyLFxuICAgICAgICAgICAgRlNldHRpbmdzLFxuICAgICAgICAgICAgRkdldFNldHRpbmdzRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIENoZWNrRm9yVXBkYXRlczogRXZlbnREZWNsPFxuICAgICAgICAgICAgUmVuZGVyZXJPd25lcixcbiAgICAgICAgICAgIG5ldmVyLFxuICAgICAgICAgICAgRlVwZGF0ZVN0YXR1cyxcbiAgICAgICAgICAgIEZDaGVja0ZvclVwZGF0ZXNFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgVXBkYXRlU2V0dGluZ3M6IEV2ZW50RGVjbDxcbiAgICAgICAgICAgIFJlbmRlcmVyT3duZXIsXG4gICAgICAgICAgICBGU2V0dGluZ3MsXG4gICAgICAgICAgICBuZXZlcixcbiAgICAgICAgICAgIEZVcGRhdGVTZXR0aW5nc0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgIH1cbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgVGlsZS5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRXZlbnREZWNsLCBSZW5kZXJlck93bmVyIH0gZnJvbSBcImVsZWN0cm9uLXJlYWN0aXZlLWV2ZW50XCI7XG5pbXBvcnQgdHlwZSB7IEZBbm5vdGF0ZWRQYW5lbCB9IGZyb20gXCIuLi9UcmVlLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRFdmVudEVycm9yQ29kZSB9IGZyb20gXCIuL0Vycm9yQ29kZXMuVHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRkJyaW5nSW50b1BhbmVsRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5kZWNsYXJlIG1vZHVsZSBcImVsZWN0cm9uLXJlYWN0aXZlLWV2ZW50L3JlZ2lzdHJhclwiXG57XG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiAqL1xuICAgIGludGVyZmFjZSBSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIEJyaW5nSW50b1BhbmVsOiBFdmVudERlY2w8XG4gICAgICAgICAgICBSZW5kZXJlck93bmVyLFxuICAgICAgICAgICAgRkFubm90YXRlZFBhbmVsLFxuICAgICAgICAgICAgbmV2ZXIsXG4gICAgICAgICAgICBGQnJpbmdJbnRvUGFuZWxFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICB9XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIGluZGV4LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vRm9jdXMuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0luc2VydC5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vTW92ZS5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vTmF2aWdhdGUuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9UaWxlLlR5cGVzXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgS2V5Ym9hcmQuVHlwZXMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG4vKipcbiAqIFRoZSBudW1lcmljIHZhbHVlcyBvZiBrZXlib2FyZCBrZXlzLFxuICoge0BsaW5rIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy93aW5kb3dzL3dpbjMyL2lucHV0ZGV2L3ZpcnR1YWwta2V5LWNvZGVzIHwgYXNzaWduZWQgYnkgTWljcm9zb2Z0fS5cbiAqL1xuZXhwb3J0IHR5cGUgRlZpcnR1YWxLZXkgPVxuICAgIHwgMHgwNVxuICAgIHwgMHgwNlxuICAgIHwgMHgwOFxuICAgIHwgMHgwOVxuICAgIHwgMHgwRFxuICAgIHwgMHgxMFxuICAgIHwgMHgxMVxuICAgIHwgMHgxMlxuICAgIHwgMHgxM1xuICAgIHwgMHgyMFxuICAgIHwgMHgyMVxuICAgIHwgMHgyMlxuICAgIHwgMHgyM1xuICAgIHwgMHgyNFxuICAgIHwgMHgyNVxuICAgIHwgMHgyNlxuICAgIHwgMHgyN1xuICAgIHwgMHgyOFxuICAgIHwgMHgyRFxuICAgIHwgMHgyRVxuICAgIHwgMHgzMFxuICAgIHwgMHgzMVxuICAgIHwgMHgzMlxuICAgIHwgMHgzM1xuICAgIHwgMHgzNFxuICAgIHwgMHgzNVxuICAgIHwgMHgzNlxuICAgIHwgMHgzN1xuICAgIHwgMHgzOFxuICAgIHwgMHgzOVxuICAgIHwgMHg0MVxuICAgIHwgMHg0MlxuICAgIHwgMHg0M1xuICAgIHwgMHg0NFxuICAgIHwgMHg0NVxuICAgIHwgMHg0NlxuICAgIHwgMHg0N1xuICAgIHwgMHg0OFxuICAgIHwgMHg0OVxuICAgIHwgMHg0QVxuICAgIHwgMHg0QlxuICAgIHwgMHg0Q1xuICAgIHwgMHg0RFxuICAgIHwgMHg0RVxuICAgIHwgMHg0RlxuICAgIHwgMHg1MFxuICAgIHwgMHg1MVxuICAgIHwgMHg1MlxuICAgIHwgMHg1M1xuICAgIHwgMHg1NFxuICAgIHwgMHg1NVxuICAgIHwgMHg1NlxuICAgIHwgMHg1N1xuICAgIHwgMHg1OFxuICAgIHwgMHg1OVxuICAgIHwgMHg1QVxuICAgIHwgMHg1QlxuICAgIHwgMHg1Q1xuICAgIHwgMHg1RFxuICAgIHwgMHg2MFxuICAgIHwgMHg2MVxuICAgIHwgMHg2MlxuICAgIHwgMHg2M1xuICAgIHwgMHg2NFxuICAgIHwgMHg2NVxuICAgIHwgMHg2NlxuICAgIHwgMHg2N1xuICAgIHwgMHg2OFxuICAgIHwgMHg2OVxuICAgIHwgMHg2QVxuICAgIHwgMHg2QlxuICAgIHwgMHg2RFxuICAgIHwgMHg2RVxuICAgIHwgMHg2RlxuICAgIHwgMHg3MFxuICAgIHwgMHg3MVxuICAgIHwgMHg3MlxuICAgIHwgMHg3M1xuICAgIHwgMHg3NFxuICAgIHwgMHg3NVxuICAgIHwgMHg3NlxuICAgIHwgMHg3N1xuICAgIHwgMHg3OFxuICAgIHwgMHg3OVxuICAgIHwgMHg3QVxuICAgIHwgMHg3QlxuICAgIHwgMHg3Q1xuICAgIHwgMHg3RFxuICAgIHwgMHg3RVxuICAgIHwgMHg3RlxuICAgIHwgMHg4MFxuICAgIHwgMHg4MVxuICAgIHwgMHg4MlxuICAgIHwgMHg4M1xuICAgIHwgMHg4NFxuICAgIHwgMHg4NVxuICAgIHwgMHg4NlxuICAgIHwgMHg4N1xuICAgIHwgMHhBMFxuICAgIHwgMHhBMVxuICAgIHwgMHhBMlxuICAgIHwgMHhBM1xuICAgIHwgMHhBNFxuICAgIHwgMHhBNVxuICAgIHwgMHhBNlxuICAgIHwgMHhBN1xuICAgIHwgMHhBOFxuICAgIHwgMHhBOVxuICAgIHwgMHhBQVxuICAgIHwgMHhBQlxuICAgIHwgMHhBQ1xuICAgIHwgMHhCMFxuICAgIHwgMHhCMVxuICAgIHwgMHhCMlxuICAgIHwgMHhCM1xuICAgIHwgMHhCNFxuICAgIHwgMHhCNVxuICAgIHwgMHhCNlxuICAgIHwgMHhCN1xuICAgIHwgMHhCQVxuICAgIHwgMHhCQlxuICAgIHwgMHhCQ1xuICAgIHwgMHhCRFxuICAgIHwgMHhCRVxuICAgIHwgMHhCRlxuICAgIHwgMHhDMFxuICAgIHwgMHhEQlxuICAgIHwgMHhEQ1xuICAgIHwgMHhERFxuICAgIHwgMHhERTtcblxuLyoqIERldmVsb3Blci1mcmllbmRseSBuYW1lcyBmb3Iga2V5cywgYXNzaWduZWQgaW4gYEtleS50c3hgLiAqL1xuZXhwb3J0IHR5cGUgRktleUlkID1cbiAgICB8IFwiTW91c2VYMVwiXG4gICAgfCBcIk1vdXNlWDJcIlxuICAgIHwgXCJCYWNrc3BhY2VcIlxuICAgIHwgXCJUYWJcIlxuICAgIHwgXCJFbnRlclwiXG4gICAgfCBcIlNoaWZ0XCJcbiAgICB8IFwiQ3RybFwiXG4gICAgfCBcIkFsdFwiXG4gICAgfCBcIlNwYWNlXCJcbiAgICB8IFwiUGdVcFwiXG4gICAgfCBcIlBnRG93blwiXG4gICAgfCBcIkVuZFwiXG4gICAgfCBcIkhvbWVcIlxuICAgIHwgXCJMZWZ0QXJyb3dcIlxuICAgIHwgXCJVcEFycm93XCJcbiAgICB8IFwiUmlnaHRBcnJvd1wiXG4gICAgfCBcIkRvd25BcnJvd1wiXG4gICAgfCBcIkluc1wiXG4gICAgfCBcIkRlbFwiXG4gICAgfCBcIjBcIlxuICAgIHwgXCIxXCJcbiAgICB8IFwiMlwiXG4gICAgfCBcIjNcIlxuICAgIHwgXCI0XCJcbiAgICB8IFwiNVwiXG4gICAgfCBcIjZcIlxuICAgIHwgXCI3XCJcbiAgICB8IFwiOFwiXG4gICAgfCBcIjlcIlxuICAgIHwgXCJBXCJcbiAgICB8IFwiQlwiXG4gICAgfCBcIkNcIlxuICAgIHwgXCJEXCJcbiAgICB8IFwiRVwiXG4gICAgfCBcIkZcIlxuICAgIHwgXCJHXCJcbiAgICB8IFwiSFwiXG4gICAgfCBcIklcIlxuICAgIHwgXCJKXCJcbiAgICB8IFwiS1wiXG4gICAgfCBcIkxcIlxuICAgIHwgXCJNXCJcbiAgICB8IFwiTlwiXG4gICAgfCBcIk9cIlxuICAgIHwgXCJQXCJcbiAgICB8IFwiUVwiXG4gICAgfCBcIlJcIlxuICAgIHwgXCJTXCJcbiAgICB8IFwiVFwiXG4gICAgfCBcIlVcIlxuICAgIHwgXCJWXCJcbiAgICB8IFwiV1wiXG4gICAgfCBcIlhcIlxuICAgIHwgXCJZXCJcbiAgICB8IFwiWlwiXG4gICAgfCBcIkxXaW5cIlxuICAgIHwgXCJSV2luXCJcbiAgICB8IFwiTnVtMFwiXG4gICAgfCBcIk51bTFcIlxuICAgIHwgXCJOdW0yXCJcbiAgICB8IFwiTnVtM1wiXG4gICAgfCBcIk51bTRcIlxuICAgIHwgXCJOdW01XCJcbiAgICB8IFwiTnVtNlwiXG4gICAgfCBcIk51bTdcIlxuICAgIHwgXCJOdW04XCJcbiAgICB8IFwiTnVtOVwiXG4gICAgfCBcIk11bHRpcGx5XCJcbiAgICB8IFwiQWRkXCJcbiAgICB8IFwiU3VidHJhY3RcIlxuICAgIHwgXCJOdW1EZWNpbWFsXCJcbiAgICB8IFwiTnVtRGl2aWRlXCJcbiAgICB8IFwiRjFcIlxuICAgIHwgXCJGMlwiXG4gICAgfCBcIkYzXCJcbiAgICB8IFwiRjRcIlxuICAgIHwgXCJGNVwiXG4gICAgfCBcIkY2XCJcbiAgICB8IFwiRjdcIlxuICAgIHwgXCJGOFwiXG4gICAgfCBcIkY5XCJcbiAgICB8IFwiRjEwXCJcbiAgICB8IFwiRjExXCJcbiAgICB8IFwiRjEyXCJcbiAgICB8IFwiRjEzXCJcbiAgICB8IFwiUGF1c2VcIlxuICAgIHwgXCJGMTRcIlxuICAgIHwgXCJGMTVcIlxuICAgIHwgXCJGMTZcIlxuICAgIHwgXCJGMTdcIlxuICAgIHwgXCJGMThcIlxuICAgIHwgXCJGMTlcIlxuICAgIHwgXCJGMjBcIlxuICAgIHwgXCJGMjFcIlxuICAgIHwgXCJGMjJcIlxuICAgIHwgXCJGMjNcIlxuICAgIHwgXCJGMjRcIlxuICAgIHwgXCJMU2hpZnRcIlxuICAgIHwgXCJSU2hpZnRcIlxuICAgIHwgXCJMQ3RybFwiXG4gICAgfCBcIlJDdHJsXCJcbiAgICB8IFwiTEFsdFwiXG4gICAgfCBcIlJBbHRcIlxuICAgIHwgXCJCcm93c2VyQmFja1wiXG4gICAgfCBcIkJyb3dzZXJGb3J3YXJkXCJcbiAgICB8IFwiQnJvd3NlclJlZnJlc2hcIlxuICAgIHwgXCJCcm93c2VyU3RvcFwiXG4gICAgfCBcIkJyb3dzZXJTZWFyY2hcIlxuICAgIHwgXCJCcm93c2VyRmF2b3JpdGVzXCJcbiAgICB8IFwiQnJvd3NlclN0YXJ0XCJcbiAgICB8IFwiTmV4dFRyYWNrXCJcbiAgICB8IFwiUHJldmlvdXNUcmFja1wiXG4gICAgfCBcIlN0b3BNZWRpYVwiXG4gICAgfCBcIlBhdXNlXCJcbiAgICB8IFwiUGxheVBhdXNlTWVkaWFcIlxuICAgIHwgXCJTdGFydE1haWxcIlxuICAgIHwgXCJTZWxlY3RNZWRpYVwiXG4gICAgfCBcIkFwcGxpY2F0aW9uc1wiXG4gICAgfCBcIlN0YXJ0QXBwbGljYXRpb25PbmVcIlxuICAgIHwgXCJTdGFydEFwcGxpY2F0aW9uVHdvXCJcbiAgICB8IFwiO1wiXG4gICAgfCBcIitcIlxuICAgIHwgXCIsXCJcbiAgICB8IFwiLVwiXG4gICAgfCBcIi5cIlxuICAgIHwgXCIvXCJcbiAgICB8IFwiYFwiXG4gICAgfCBcIltcIlxuICAgIHwgXCJcXFxcXCJcbiAgICB8IFwiXVwiXG4gICAgfCBcIidcIjtcbiIsIi8qKlxuICogQGZpbGUgICAgICBLZXlib2FyZC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleUlkLCBGVmlydHVhbEtleSB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG5leHBvcnQvKipcbiAgICAgICAqIERldmVsb3Blci1mcmllbmRseSBuYW1lcyBvZiBrZXkgY29kZXMuXG4gICAgICAgKi9cbmNvbnN0IEtleUlkc0J5SWQ6IFJlYWRvbmx5PFJlY29yZDxGVmlydHVhbEtleSwgRktleUlkPj4gPVxuICAgIHtcbiAgICAgICAgMHgwNTogXCJNb3VzZVgxXCIsXG4gICAgICAgIDB4MDY6IFwiTW91c2VYMlwiLFxuICAgICAgICAweDA4OiBcIkJhY2tzcGFjZVwiLFxuICAgICAgICAweDA5OiBcIlRhYlwiLFxuICAgICAgICAweDBEOiBcIkVudGVyXCIsXG4gICAgICAgIDB4MTA6IFwiU2hpZnRcIixcbiAgICAgICAgMHgxMTogXCJDdHJsXCIsXG4gICAgICAgIDB4MTI6IFwiQWx0XCIsXG4gICAgICAgIDB4MTM6IFwiUGF1c2VcIixcbiAgICAgICAgMHgyMDogXCJTcGFjZVwiLFxuICAgICAgICAweDIxOiBcIlBnVXBcIixcbiAgICAgICAgMHgyMjogXCJQZ0Rvd25cIixcbiAgICAgICAgMHgyMzogXCJFbmRcIixcbiAgICAgICAgMHgyNDogXCJIb21lXCIsXG4gICAgICAgIDB4MjU6IFwiTGVmdEFycm93XCIsXG4gICAgICAgIDB4MjY6IFwiVXBBcnJvd1wiLFxuICAgICAgICAweDI3OiBcIlJpZ2h0QXJyb3dcIixcbiAgICAgICAgMHgyODogXCJEb3duQXJyb3dcIixcbiAgICAgICAgMHgyRDogXCJJbnNcIixcbiAgICAgICAgMHgyRTogXCJEZWxcIixcbiAgICAgICAgMHgzMDogXCIwXCIsXG4gICAgICAgIDB4MzE6IFwiMVwiLFxuICAgICAgICAweDMyOiBcIjJcIixcbiAgICAgICAgMHgzMzogXCIzXCIsXG4gICAgICAgIDB4MzQ6IFwiNFwiLFxuICAgICAgICAweDM1OiBcIjVcIixcbiAgICAgICAgMHgzNjogXCI2XCIsXG4gICAgICAgIDB4Mzc6IFwiN1wiLFxuICAgICAgICAweDM4OiBcIjhcIixcbiAgICAgICAgMHgzOTogXCI5XCIsXG4gICAgICAgIDB4NDE6IFwiQVwiLFxuICAgICAgICAweDQyOiBcIkJcIixcbiAgICAgICAgMHg0MzogXCJDXCIsXG4gICAgICAgIDB4NDQ6IFwiRFwiLFxuICAgICAgICAweDQ1OiBcIkVcIixcbiAgICAgICAgMHg0NjogXCJGXCIsXG4gICAgICAgIDB4NDc6IFwiR1wiLFxuICAgICAgICAweDQ4OiBcIkhcIixcbiAgICAgICAgMHg0OTogXCJJXCIsXG4gICAgICAgIDB4NEE6IFwiSlwiLFxuICAgICAgICAweDRCOiBcIktcIixcbiAgICAgICAgMHg0QzogXCJMXCIsXG4gICAgICAgIDB4NEQ6IFwiTVwiLFxuICAgICAgICAweDRFOiBcIk5cIixcbiAgICAgICAgMHg0RjogXCJPXCIsXG4gICAgICAgIDB4NTA6IFwiUFwiLFxuICAgICAgICAweDUxOiBcIlFcIixcbiAgICAgICAgMHg1MjogXCJSXCIsXG4gICAgICAgIDB4NTM6IFwiU1wiLFxuICAgICAgICAweDU0OiBcIlRcIixcbiAgICAgICAgMHg1NTogXCJVXCIsXG4gICAgICAgIDB4NTY6IFwiVlwiLFxuICAgICAgICAweDU3OiBcIldcIixcbiAgICAgICAgMHg1ODogXCJYXCIsXG4gICAgICAgIDB4NTk6IFwiWVwiLFxuICAgICAgICAweDVBOiBcIlpcIixcbiAgICAgICAgMHg1QjogXCJMV2luXCIsXG4gICAgICAgIDB4NUM6IFwiUldpblwiLFxuICAgICAgICAweDVEOiBcIkFwcGxpY2F0aW9uc1wiLFxuICAgICAgICAweDYwOiBcIk51bTBcIixcbiAgICAgICAgMHg2MTogXCJOdW0xXCIsXG4gICAgICAgIDB4NjI6IFwiTnVtMlwiLFxuICAgICAgICAweDYzOiBcIk51bTNcIixcbiAgICAgICAgMHg2NDogXCJOdW00XCIsXG4gICAgICAgIDB4NjU6IFwiTnVtNVwiLFxuICAgICAgICAweDY2OiBcIk51bTZcIixcbiAgICAgICAgMHg2NzogXCJOdW03XCIsXG4gICAgICAgIDB4Njg6IFwiTnVtOFwiLFxuICAgICAgICAweDY5OiBcIk51bTlcIixcbiAgICAgICAgMHg2QTogXCJNdWx0aXBseVwiLFxuICAgICAgICAweDZCOiBcIkFkZFwiLFxuICAgICAgICAweDZEOiBcIlN1YnRyYWN0XCIsXG4gICAgICAgIDB4NkU6IFwiTnVtRGVjaW1hbFwiLFxuICAgICAgICAweDZGOiBcIk51bURpdmlkZVwiLFxuICAgICAgICAweDcwOiBcIkYxXCIsXG4gICAgICAgIDB4NzE6IFwiRjJcIixcbiAgICAgICAgMHg3MjogXCJGM1wiLFxuICAgICAgICAweDczOiBcIkY0XCIsXG4gICAgICAgIDB4NzQ6IFwiRjVcIixcbiAgICAgICAgMHg3NTogXCJGNlwiLFxuICAgICAgICAweDc2OiBcIkY3XCIsXG4gICAgICAgIDB4Nzc6IFwiRjhcIixcbiAgICAgICAgMHg3ODogXCJGOVwiLFxuICAgICAgICAweDc5OiBcIkYxMFwiLFxuICAgICAgICAweDdBOiBcIkYxMVwiLFxuICAgICAgICAweDdCOiBcIkYxMlwiLFxuICAgICAgICAweDdDOiBcIkYxM1wiLFxuICAgICAgICAweDdEOiBcIkYxNFwiLFxuICAgICAgICAweDdFOiBcIkYxNVwiLFxuICAgICAgICAweDdGOiBcIkYxNlwiLFxuICAgICAgICAweDgwOiBcIkYxN1wiLFxuICAgICAgICAweDgxOiBcIkYxOFwiLFxuICAgICAgICAweDgyOiBcIkYxOVwiLFxuICAgICAgICAweDgzOiBcIkYyMFwiLFxuICAgICAgICAweDg0OiBcIkYyMVwiLFxuICAgICAgICAweDg1OiBcIkYyMlwiLFxuICAgICAgICAweDg2OiBcIkYyM1wiLFxuICAgICAgICAweDg3OiBcIkYyNFwiLFxuICAgICAgICAweEEwOiBcIkxTaGlmdFwiLFxuICAgICAgICAweEExOiBcIlJTaGlmdFwiLFxuICAgICAgICAweEEyOiBcIkxDdHJsXCIsXG4gICAgICAgIDB4QTM6IFwiUkN0cmxcIixcbiAgICAgICAgMHhBNDogXCJMQWx0XCIsXG4gICAgICAgIDB4QTU6IFwiUkFsdFwiLFxuICAgICAgICAweEE2OiBcIkJyb3dzZXJCYWNrXCIsXG4gICAgICAgIDB4QTc6IFwiQnJvd3NlckZvcndhcmRcIixcbiAgICAgICAgMHhBODogXCJCcm93c2VyUmVmcmVzaFwiLFxuICAgICAgICAweEE5OiBcIkJyb3dzZXJTdG9wXCIsXG4gICAgICAgIDB4QUE6IFwiQnJvd3NlclNlYXJjaFwiLFxuICAgICAgICAweEFCOiBcIkJyb3dzZXJGYXZvcml0ZXNcIixcbiAgICAgICAgMHhBQzogXCJCcm93c2VyU3RhcnRcIixcbiAgICAgICAgMHhCMDogXCJOZXh0VHJhY2tcIixcbiAgICAgICAgMHhCMTogXCJQcmV2aW91c1RyYWNrXCIsXG4gICAgICAgIDB4QjI6IFwiU3RvcE1lZGlhXCIsXG4gICAgICAgIDB4QjM6IFwiUGxheVBhdXNlTWVkaWFcIixcbiAgICAgICAgMHhCNDogXCJTdGFydE1haWxcIixcbiAgICAgICAgMHhCNTogXCJTZWxlY3RNZWRpYVwiLFxuICAgICAgICAweEI2OiBcIlN0YXJ0QXBwbGljYXRpb25PbmVcIixcbiAgICAgICAgMHhCNzogXCJTdGFydEFwcGxpY2F0aW9uVHdvXCIsXG4gICAgICAgIDB4QkE6IFwiO1wiLFxuICAgICAgICAweEJCOiBcIitcIixcbiAgICAgICAgMHhCQzogXCIsXCIsXG4gICAgICAgIDB4QkQ6IFwiLVwiLFxuICAgICAgICAweEJFOiBcIi5cIixcbiAgICAgICAgMHhCRjogXCIvXCIsXG4gICAgICAgIDB4QzA6IFwiYFwiLFxuICAgICAgICAweERCOiBcIltcIixcbiAgICAgICAgMHhEQzogXCJcXFxcXCIsXG4gICAgICAgIDB4REQ6IFwiXVwiLFxuICAgICAgICAweERFOiBcIidcIlxuICAgIH0gYXMgY29uc3Q7XG5cbmV4cG9ydC8qKlxuICAgICAgICogVGhlIHZhbHVlcyBvZiB7QGxpbmsgRktleUlkfSwgbWFkZSBhdmFpbGFibGUgYXQgcnVudGltZS5cbiAgICAgICAqL1xuY29uc3QgS2V5SWRzOiBSZWFkb25seUFycmF5PEZLZXlJZD4gPVxuICAgIFtcbiAgICAgICAgXCJNb3VzZVgxXCIsXG4gICAgICAgIFwiTW91c2VYMlwiLFxuICAgICAgICBcIkJhY2tzcGFjZVwiLFxuICAgICAgICBcIlRhYlwiLFxuICAgICAgICBcIkVudGVyXCIsXG4gICAgICAgIFwiU2hpZnRcIixcbiAgICAgICAgXCJDdHJsXCIsXG4gICAgICAgIFwiQWx0XCIsXG4gICAgICAgIFwiUGF1c2VcIixcbiAgICAgICAgXCJTcGFjZVwiLFxuICAgICAgICBcIlBnVXBcIixcbiAgICAgICAgXCJQZ0Rvd25cIixcbiAgICAgICAgXCJFbmRcIixcbiAgICAgICAgXCJIb21lXCIsXG4gICAgICAgIFwiTGVmdEFycm93XCIsXG4gICAgICAgIFwiVXBBcnJvd1wiLFxuICAgICAgICBcIlJpZ2h0QXJyb3dcIixcbiAgICAgICAgXCJEb3duQXJyb3dcIixcbiAgICAgICAgXCJJbnNcIixcbiAgICAgICAgXCJEZWxcIixcbiAgICAgICAgXCIwXCIsXG4gICAgICAgIFwiMVwiLFxuICAgICAgICBcIjJcIixcbiAgICAgICAgXCIzXCIsXG4gICAgICAgIFwiNFwiLFxuICAgICAgICBcIjVcIixcbiAgICAgICAgXCI2XCIsXG4gICAgICAgIFwiN1wiLFxuICAgICAgICBcIjhcIixcbiAgICAgICAgXCI5XCIsXG4gICAgICAgIFwiQVwiLFxuICAgICAgICBcIkJcIixcbiAgICAgICAgXCJDXCIsXG4gICAgICAgIFwiRFwiLFxuICAgICAgICBcIkVcIixcbiAgICAgICAgXCJGXCIsXG4gICAgICAgIFwiR1wiLFxuICAgICAgICBcIkhcIixcbiAgICAgICAgXCJJXCIsXG4gICAgICAgIFwiSlwiLFxuICAgICAgICBcIktcIixcbiAgICAgICAgXCJMXCIsXG4gICAgICAgIFwiTVwiLFxuICAgICAgICBcIk5cIixcbiAgICAgICAgXCJPXCIsXG4gICAgICAgIFwiUFwiLFxuICAgICAgICBcIlFcIixcbiAgICAgICAgXCJSXCIsXG4gICAgICAgIFwiU1wiLFxuICAgICAgICBcIlRcIixcbiAgICAgICAgXCJVXCIsXG4gICAgICAgIFwiVlwiLFxuICAgICAgICBcIldcIixcbiAgICAgICAgXCJYXCIsXG4gICAgICAgIFwiWVwiLFxuICAgICAgICBcIlpcIixcbiAgICAgICAgXCJMV2luXCIsXG4gICAgICAgIFwiUldpblwiLFxuICAgICAgICBcIkFwcGxpY2F0aW9uc1wiLFxuICAgICAgICBcIk51bTBcIixcbiAgICAgICAgXCJOdW0xXCIsXG4gICAgICAgIFwiTnVtMlwiLFxuICAgICAgICBcIk51bTNcIixcbiAgICAgICAgXCJOdW00XCIsXG4gICAgICAgIFwiTnVtNVwiLFxuICAgICAgICBcIk51bTZcIixcbiAgICAgICAgXCJOdW03XCIsXG4gICAgICAgIFwiTnVtOFwiLFxuICAgICAgICBcIk51bTlcIixcbiAgICAgICAgXCJNdWx0aXBseVwiLFxuICAgICAgICBcIkFkZFwiLFxuICAgICAgICBcIlN1YnRyYWN0XCIsXG4gICAgICAgIFwiTnVtRGVjaW1hbFwiLFxuICAgICAgICBcIk51bURpdmlkZVwiLFxuICAgICAgICBcIkYxXCIsXG4gICAgICAgIFwiRjJcIixcbiAgICAgICAgXCJGM1wiLFxuICAgICAgICBcIkY0XCIsXG4gICAgICAgIFwiRjVcIixcbiAgICAgICAgXCJGNlwiLFxuICAgICAgICBcIkY3XCIsXG4gICAgICAgIFwiRjhcIixcbiAgICAgICAgXCJGOVwiLFxuICAgICAgICBcIkYxMFwiLFxuICAgICAgICBcIkYxMVwiLFxuICAgICAgICBcIkYxMlwiLFxuICAgICAgICBcIkYxM1wiLFxuICAgICAgICBcIkYxNFwiLFxuICAgICAgICBcIkYxNVwiLFxuICAgICAgICBcIkYxNlwiLFxuICAgICAgICBcIkYxN1wiLFxuICAgICAgICBcIkYxOFwiLFxuICAgICAgICBcIkYxOVwiLFxuICAgICAgICBcIkYyMFwiLFxuICAgICAgICBcIkYyMVwiLFxuICAgICAgICBcIkYyMlwiLFxuICAgICAgICBcIkYyM1wiLFxuICAgICAgICBcIkYyNFwiLFxuICAgICAgICBcIkxTaGlmdFwiLFxuICAgICAgICBcIlJTaGlmdFwiLFxuICAgICAgICBcIkxDdHJsXCIsXG4gICAgICAgIFwiUkN0cmxcIixcbiAgICAgICAgXCJMQWx0XCIsXG4gICAgICAgIFwiUkFsdFwiLFxuICAgICAgICBcIkJyb3dzZXJCYWNrXCIsXG4gICAgICAgIFwiQnJvd3NlckZvcndhcmRcIixcbiAgICAgICAgXCJCcm93c2VyUmVmcmVzaFwiLFxuICAgICAgICBcIkJyb3dzZXJTdG9wXCIsXG4gICAgICAgIFwiQnJvd3NlclNlYXJjaFwiLFxuICAgICAgICBcIkJyb3dzZXJGYXZvcml0ZXNcIixcbiAgICAgICAgXCJCcm93c2VyU3RhcnRcIixcbiAgICAgICAgXCJOZXh0VHJhY2tcIixcbiAgICAgICAgXCJQcmV2aW91c1RyYWNrXCIsXG4gICAgICAgIFwiU3RvcE1lZGlhXCIsXG4gICAgICAgIFwiUGxheVBhdXNlTWVkaWFcIixcbiAgICAgICAgXCJTdGFydE1haWxcIixcbiAgICAgICAgXCJTZWxlY3RNZWRpYVwiLFxuICAgICAgICBcIlN0YXJ0QXBwbGljYXRpb25PbmVcIixcbiAgICAgICAgXCJTdGFydEFwcGxpY2F0aW9uVHdvXCIsXG4gICAgICAgIFwiO1wiLFxuICAgICAgICBcIitcIixcbiAgICAgICAgXCIsXCIsXG4gICAgICAgIFwiLVwiLFxuICAgICAgICBcIi5cIixcbiAgICAgICAgXCIvXCIsXG4gICAgICAgIFwiYFwiLFxuICAgICAgICBcIltcIixcbiAgICAgICAgXCJcXFxcXCIsXG4gICAgICAgIFwiXVwiLFxuICAgICAgICBcIidcIlxuICAgIF0gYXMgY29uc3Q7XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgYSB7QGxpbmsgSW4gfCBnaXZlbiBzdHJpbmd9IGlzIGFuIHtAbGluayBGS2V5SWR9LlxuICpcbiAqIEBwYXJhbSBJbiAtIFRoZSBzdHJpbmcgdG8gdGVzdC5cbiAqIEByZXR1cm5zIHtJbiBpcyBGS2V5SWR9IFdoZXRoZXIgdGhlIHtAbGluayBJbiB8IGdpdmVuIHN0cmluZ30gaXMgYW4ge0BsaW5rIEZLZXlJZH0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBJc0tleUlkKEluOiBzdHJpbmcpOiBJbiBpcyBGS2V5SWRcbntcbiAgICByZXR1cm4gS2V5SWRzLmluY2x1ZGVzKEluIGFzIEZLZXlJZCk7XG59O1xuXG4vKipcbiAqIEdldCB0aGUge0BsaW5rIEZLZXlJZH0gdGhhdCBjb3JyZXNwb25kcyB0byBhIGdpdmVuIHtAbGluayBWa0NvZGV9LlxuICpcbiAqIEBwYXJhbSBWa0NvZGUgLSBUaGUge0BsaW5rIEZWaXJ0dWFsS2V5fSBvZiB3aGljaCB0aGUgY29ycmVzcG9uZGluZyB7QGxpbmsgRktleUlkfVxuICogaXMgcmV0dXJuZWQgYnkgdGhpcy5cbiAqXG4gKiBAcmV0dXJucyB7RktleUlkfSBUaGUge0BsaW5rIEZLZXlJZH0gdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgZ2l2ZW4ge0BsaW5rIFZrQ29kZX0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBHZXRLZXlOYW1lKFZrQ29kZTogRlZpcnR1YWxLZXkpOiBGS2V5SWRcbntcbiAgICByZXR1cm4gS2V5SWRzQnlJZFtWa0NvZGVdO1xufTtcblxuZXhwb3J0LyoqXG4gICAgICAgKiBEZXZlbG9wZXItZnJpZW5kbHkgbmFtZXMgb2Yga2V5IGNvZGVzLlxuICAgICAgICovXG5jb25zdCBWazogUmVhZG9ubHk8UmVjb3JkPEZLZXlJZCwgRlZpcnR1YWxLZXk+PiA9XG4gICAge1xuICAgICAgICBNb3VzZVgxOiAweDA1LFxuICAgICAgICBNb3VzZVgyOiAweDA2LFxuICAgICAgICBCYWNrc3BhY2U6IDB4MDgsXG4gICAgICAgIFRhYjogMHgwOSxcbiAgICAgICAgRW50ZXI6IDB4MEQsXG4gICAgICAgIFNoaWZ0OiAweDEwLFxuICAgICAgICBDdHJsOiAweDExLFxuICAgICAgICBBbHQ6IDB4MTIsXG4gICAgICAgIFBhdXNlOiAweDEzLFxuICAgICAgICBTcGFjZTogMHgyMCxcbiAgICAgICAgUGdVcDogMHgyMSxcbiAgICAgICAgUGdEb3duOiAweDIyLFxuICAgICAgICBFbmQ6IDB4MjMsXG4gICAgICAgIEhvbWU6IDB4MjQsXG4gICAgICAgIExlZnRBcnJvdzogMHgyNSxcbiAgICAgICAgVXBBcnJvdzogMHgyNixcbiAgICAgICAgUmlnaHRBcnJvdzogMHgyNyxcbiAgICAgICAgRG93bkFycm93OiAweDI4LFxuICAgICAgICBJbnM6IDB4MkQsXG4gICAgICAgIERlbDogMHgyRSxcbiAgICAgICAgMDogMHgzMCxcbiAgICAgICAgMTogMHgzMSxcbiAgICAgICAgMjogMHgzMixcbiAgICAgICAgMzogMHgzMyxcbiAgICAgICAgNDogMHgzNCxcbiAgICAgICAgNTogMHgzNSxcbiAgICAgICAgNjogMHgzNixcbiAgICAgICAgNzogMHgzNyxcbiAgICAgICAgODogMHgzOCxcbiAgICAgICAgOTogMHgzOSxcbiAgICAgICAgQTogMHg0MSxcbiAgICAgICAgQjogMHg0MixcbiAgICAgICAgQzogMHg0MyxcbiAgICAgICAgRDogMHg0NCxcbiAgICAgICAgRTogMHg0NSxcbiAgICAgICAgRjogMHg0NixcbiAgICAgICAgRzogMHg0NyxcbiAgICAgICAgSDogMHg0OCxcbiAgICAgICAgSTogMHg0OSxcbiAgICAgICAgSjogMHg0QSxcbiAgICAgICAgSzogMHg0QixcbiAgICAgICAgTDogMHg0QyxcbiAgICAgICAgTTogMHg0RCxcbiAgICAgICAgTjogMHg0RSxcbiAgICAgICAgTzogMHg0RixcbiAgICAgICAgUDogMHg1MCxcbiAgICAgICAgUTogMHg1MSxcbiAgICAgICAgUjogMHg1MixcbiAgICAgICAgUzogMHg1MyxcbiAgICAgICAgVDogMHg1NCxcbiAgICAgICAgVTogMHg1NSxcbiAgICAgICAgVjogMHg1NixcbiAgICAgICAgVzogMHg1NyxcbiAgICAgICAgWDogMHg1OCxcbiAgICAgICAgWTogMHg1OSxcbiAgICAgICAgWjogMHg1QSxcbiAgICAgICAgTFdpbjogMHg1QixcbiAgICAgICAgUldpbjogMHg1QyxcbiAgICAgICAgQXBwbGljYXRpb25zOiAweDVELFxuICAgICAgICBOdW0wOiAweDYwLFxuICAgICAgICBOdW0xOiAweDYxLFxuICAgICAgICBOdW0yOiAweDYyLFxuICAgICAgICBOdW0zOiAweDYzLFxuICAgICAgICBOdW00OiAweDY0LFxuICAgICAgICBOdW01OiAweDY1LFxuICAgICAgICBOdW02OiAweDY2LFxuICAgICAgICBOdW03OiAweDY3LFxuICAgICAgICBOdW04OiAweDY4LFxuICAgICAgICBOdW05OiAweDY5LFxuICAgICAgICBNdWx0aXBseTogMHg2QSxcbiAgICAgICAgQWRkOiAweDZCLFxuICAgICAgICBTdWJ0cmFjdDogMHg2RCxcbiAgICAgICAgTnVtRGVjaW1hbDogMHg2RSxcbiAgICAgICAgTnVtRGl2aWRlOiAweDZGLFxuICAgICAgICBGMTogMHg3MCxcbiAgICAgICAgRjI6IDB4NzEsXG4gICAgICAgIEYzOiAweDcyLFxuICAgICAgICBGNDogMHg3MyxcbiAgICAgICAgRjU6IDB4NzQsXG4gICAgICAgIEY2OiAweDc1LFxuICAgICAgICBGNzogMHg3NixcbiAgICAgICAgRjg6IDB4NzcsXG4gICAgICAgIEY5OiAweDc4LFxuICAgICAgICBGMTA6IDB4NzksXG4gICAgICAgIEYxMTogMHg3QSxcbiAgICAgICAgRjEyOiAweDdCLFxuICAgICAgICBGMTM6IDB4N0MsXG4gICAgICAgIEYxNDogMHg3RCxcbiAgICAgICAgRjE1OiAweDdFLFxuICAgICAgICBGMTY6IDB4N0YsXG4gICAgICAgIEYxNzogMHg4MCxcbiAgICAgICAgRjE4OiAweDgxLFxuICAgICAgICBGMTk6IDB4ODIsXG4gICAgICAgIEYyMDogMHg4MyxcbiAgICAgICAgRjIxOiAweDg0LFxuICAgICAgICBGMjI6IDB4ODUsXG4gICAgICAgIEYyMzogMHg4NixcbiAgICAgICAgRjI0OiAweDg3LFxuICAgICAgICBMU2hpZnQ6IDB4QTAsXG4gICAgICAgIFJTaGlmdDogMHhBMSxcbiAgICAgICAgTEN0cmw6IDB4QTIsXG4gICAgICAgIFJDdHJsOiAweEEzLFxuICAgICAgICBMQWx0OiAweEE0LFxuICAgICAgICBSQWx0OiAweEE1LFxuICAgICAgICBCcm93c2VyQmFjazogMHhBNixcbiAgICAgICAgQnJvd3NlckZvcndhcmQ6IDB4QTcsXG4gICAgICAgIEJyb3dzZXJSZWZyZXNoOiAweEE4LFxuICAgICAgICBCcm93c2VyU3RvcDogMHhBOSxcbiAgICAgICAgQnJvd3NlclNlYXJjaDogMHhBQSxcbiAgICAgICAgQnJvd3NlckZhdm9yaXRlczogMHhBQixcbiAgICAgICAgQnJvd3NlclN0YXJ0OiAweEFDLFxuICAgICAgICBOZXh0VHJhY2s6IDB4QjAsXG4gICAgICAgIFByZXZpb3VzVHJhY2s6IDB4QjEsXG4gICAgICAgIFN0b3BNZWRpYTogMHhCMixcbiAgICAgICAgUGxheVBhdXNlTWVkaWE6IDB4QjMsXG4gICAgICAgIFN0YXJ0TWFpbDogMHhCNCxcbiAgICAgICAgU2VsZWN0TWVkaWE6IDB4QjUsXG4gICAgICAgIFN0YXJ0QXBwbGljYXRpb25PbmU6IDB4QjYsXG4gICAgICAgIFN0YXJ0QXBwbGljYXRpb25Ud286IDB4QjcsXG4gICAgICAgIFwiO1wiOiAweEJBLFxuICAgICAgICBcIitcIjogMHhCQixcbiAgICAgICAgXCIsXCI6IDB4QkMsXG4gICAgICAgIFwiLVwiOiAweEJELFxuICAgICAgICBcIi5cIjogMHhCRSxcbiAgICAgICAgXCIvXCI6IDB4QkYsXG4gICAgICAgIFwiYFwiOiAweEMwLFxuICAgICAgICBcIltcIjogMHhEQixcbiAgICAgICAgXCJcXFxcXCI6IDB4REMsXG4gICAgICAgIFwiXVwiOiAweERELFxuICAgICAgICBcIidcIjogMHhERVxuICAgIH0gYXMgY29uc3Q7XG5leHBvcnQvKipcbiAgICAgICAqIEEge0BsaW5rIFJlYWRvbmx5QXJyYXl9IG9mIGFsbCB7QGxpbmsgRlZpcnR1YWxLZXkgfCBGVmlydHVhbEtleXN9XG4gICAgICAgKiBhdmFpbGFibGUgdG8gRWxlY3Ryb24uXG4gICAgICAgKi9cbmNvbnN0IFZpcnR1YWxLZXlzOiBSZWFkb25seUFycmF5PEZWaXJ0dWFsS2V5PiA9XG4gICAgW1xuICAgICAgICAweDA1LFxuICAgICAgICAweDA2LFxuICAgICAgICAweDA4LFxuICAgICAgICAweDA5LFxuICAgICAgICAweDBELFxuICAgICAgICAweDEwLFxuICAgICAgICAweDExLFxuICAgICAgICAweDEyLFxuICAgICAgICAweDEzLFxuICAgICAgICAweDIwLFxuICAgICAgICAweDIxLFxuICAgICAgICAweDIyLFxuICAgICAgICAweDIzLFxuICAgICAgICAweDI0LFxuICAgICAgICAweDI1LFxuICAgICAgICAweDI2LFxuICAgICAgICAweDI3LFxuICAgICAgICAweDI4LFxuICAgICAgICAweDJELFxuICAgICAgICAweDJFLFxuICAgICAgICAweDMwLFxuICAgICAgICAweDMxLFxuICAgICAgICAweDMyLFxuICAgICAgICAweDMzLFxuICAgICAgICAweDM0LFxuICAgICAgICAweDM1LFxuICAgICAgICAweDM2LFxuICAgICAgICAweDM3LFxuICAgICAgICAweDM4LFxuICAgICAgICAweDM5LFxuICAgICAgICAweDQxLFxuICAgICAgICAweDQyLFxuICAgICAgICAweDQzLFxuICAgICAgICAweDQ0LFxuICAgICAgICAweDQ1LFxuICAgICAgICAweDQ2LFxuICAgICAgICAweDQ3LFxuICAgICAgICAweDQ4LFxuICAgICAgICAweDQ5LFxuICAgICAgICAweDRBLFxuICAgICAgICAweDRCLFxuICAgICAgICAweDRDLFxuICAgICAgICAweDRELFxuICAgICAgICAweDRFLFxuICAgICAgICAweDRGLFxuICAgICAgICAweDUwLFxuICAgICAgICAweDUxLFxuICAgICAgICAweDUyLFxuICAgICAgICAweDUzLFxuICAgICAgICAweDU0LFxuICAgICAgICAweDU1LFxuICAgICAgICAweDU2LFxuICAgICAgICAweDU3LFxuICAgICAgICAweDU4LFxuICAgICAgICAweDU5LFxuICAgICAgICAweDVBLFxuICAgICAgICAweDVCLFxuICAgICAgICAweDVDLFxuICAgICAgICAweDVELFxuICAgICAgICAweDYwLFxuICAgICAgICAweDYxLFxuICAgICAgICAweDYyLFxuICAgICAgICAweDYzLFxuICAgICAgICAweDY0LFxuICAgICAgICAweDY1LFxuICAgICAgICAweDY2LFxuICAgICAgICAweDY3LFxuICAgICAgICAweDY4LFxuICAgICAgICAweDY5LFxuICAgICAgICAweDZBLFxuICAgICAgICAweDZCLFxuICAgICAgICAweDZELFxuICAgICAgICAweDZFLFxuICAgICAgICAweDZGLFxuICAgICAgICAweDcwLFxuICAgICAgICAweDcxLFxuICAgICAgICAweDcyLFxuICAgICAgICAweDczLFxuICAgICAgICAweDc0LFxuICAgICAgICAweDc1LFxuICAgICAgICAweDc2LFxuICAgICAgICAweDc3LFxuICAgICAgICAweDc4LFxuICAgICAgICAweDc5LFxuICAgICAgICAweDdBLFxuICAgICAgICAweDdCLFxuICAgICAgICAweDdDLFxuICAgICAgICAweDdELFxuICAgICAgICAweDdFLFxuICAgICAgICAweDdGLFxuICAgICAgICAweDgwLFxuICAgICAgICAweDgxLFxuICAgICAgICAweDgyLFxuICAgICAgICAweDgzLFxuICAgICAgICAweDg0LFxuICAgICAgICAweDg1LFxuICAgICAgICAweDg2LFxuICAgICAgICAweDg3LFxuICAgICAgICAweEEwLFxuICAgICAgICAweEExLFxuICAgICAgICAweEEyLFxuICAgICAgICAweEEzLFxuICAgICAgICAweEE0LFxuICAgICAgICAweEE1LFxuICAgICAgICAweEE2LFxuICAgICAgICAweEE3LFxuICAgICAgICAweEE4LFxuICAgICAgICAweEE5LFxuICAgICAgICAweEFBLFxuICAgICAgICAweEFCLFxuICAgICAgICAweEFDLFxuICAgICAgICAweEIwLFxuICAgICAgICAweEIxLFxuICAgICAgICAweEIyLFxuICAgICAgICAweEIzLFxuICAgICAgICAweEI0LFxuICAgICAgICAweEI1LFxuICAgICAgICAweEI2LFxuICAgICAgICAweEI3LFxuICAgICAgICAweEJBLFxuICAgICAgICAweEJCLFxuICAgICAgICAweEJDLFxuICAgICAgICAweEJELFxuICAgICAgICAweEJFLFxuICAgICAgICAweEJGLFxuICAgICAgICAweEMwLFxuICAgICAgICAweERCLFxuICAgICAgICAweERDLFxuICAgICAgICAweERELFxuICAgICAgICAweERFXG4gICAgXSBhcyBjb25zdDtcblxuLyogZXNsaW50LWVuYWJsZSBzb3J0LWtleXMgKi9cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiB7QGxpbmsgS2V5Q29kZX0gaXMgYSBWSyBDb2RlIHRoYXQgY2FuIGJlIHVzZWRcbiAqIGJ5IGFuIEVsZWN0cm9uIGFwcGxpY2F0aW9uICh3aXRob3V0IG5hdGl2ZSBtb2R1bGVzIG9yIHRoZSBLZXlib2FyZCBBUEkpLlxuICpcbiAqIEBwYXJhbSBLZXlDb2RlIC0gVGhlIG51bWVyaWMga2V5IGNvZGUgdmFsdWUgdG8gdGVzdC5cbiAqXG4gKiBAcmV0dXJucyB7S2V5Q29kZSBpcyBGVmlydHVhbEtleX0gV2hldGhlciB0aGUgZ2l2ZW4ge0BsaW5rIEtleUNvZGV9IGlzXG4gKiBhbiB7QGxpbmsgRlZpcnR1YWxLZXl9LlxuICovXG5leHBvcnQgZnVuY3Rpb24gSXNWaXJ0dWFsS2V5KEtleUNvZGU6IG51bWJlcik6IEtleUNvZGUgaXMgRlZpcnR1YWxLZXlcbntcbiAgICByZXR1cm4gVmlydHVhbEtleXMuaW5jbHVkZXMoS2V5Q29kZSBhcyBGVmlydHVhbEtleSk7XG59XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTG9nLlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGTG9nTGV2ZWwsIEZMb2dPcmlnaW4gfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuaW1wb3J0IHR5cGUgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5cbmV4cG9ydCB0eXBlIEZDaGFsa0JhY2tncm91bmQgPSBFeHRyYWN0PGtleW9mIHR5cGVvZiBjaGFsaywgYGJnJHsgc3RyaW5nIH1gPjtcblxuZXhwb3J0IHR5cGUgRkNoYWxrRm9yZWdyb3VuZCA9IEV4dHJhY3Q8a2V5b2YgdHlwZW9mIGNoYWxrLCBcImJsYWNrXCIgfCBcIndoaXRlQnJpZ2h0XCI+O1xuXG5leHBvcnQgdHlwZSBGTG9nRnVuY3Rpb24gPSAoLi4uU3RhdGVtZW50czogVEFycmF5PHVua25vd24+KSA9PiB2b2lkO1xuXG5leHBvcnQgdHlwZSBGTG9nRm9ybWF0RnVuY3Rpb24gPSAoU3RhdGVtZW50OiB1bmtub3duKSA9PiB1bmtub3duO1xuXG5leHBvcnQgdHlwZSBGTG9nZ2VyUmVjb3JkID0gUmVjb3JkPEV4Y2x1ZGU8RkxvZ0xldmVsLCBcIk5vcm1hbFwiPiwgRkxvZ0Z1bmN0aW9uPjtcblxuZXhwb3J0IHR5cGUgRkxvZ09yaWdpbkV4dGVuZGVkID0gRkxvZ09yaWdpbiB8IFwiKlwiO1xuXG5leHBvcnQgdHlwZSBGTG9nRGlnaXRTZXBhcmF0b3IgPVxuICAgIHwgXCJTcGFjZVwiXG4gICAgfCBcIkNvbW1hXCJcbiAgICB8IFwiVW5kZXJzY29yZVwiXG4gICAgfCBcIk5vbmVcIjtcblxuZXhwb3J0IHR5cGUgRkxvZ1F1b3RlU3R5bGUgPVxuICAgIHwgXCJEb3VibGVcIlxuICAgIHwgXCJTaW5nbGVcIlxuICAgIHwgXCJOb25lXCI7XG5cbmV4cG9ydCB0eXBlIEZMb2dTZXR0aW5ncyA9IFJlYWRvbmx5PHtcbiAgICBDYXRlZ29yeTpcbiAgICB7XG4gICAgICAgIERpc2FibGVkQ2F0ZWdvcmllczpcbiAgICAgICAge1xuICAgICAgICAgICAgWyBMb2dPcmlnaW4gaW4gRkxvZ09yaWdpbkV4dGVuZGVkIF06IFRBcnJheTxzdHJpbmc+O1xuICAgICAgICB9O1xuICAgICAgICBMb2dEaXNhYmxlZENhdGVnb3J5QXR0ZW1wdHM6IGJvb2xlYW47XG4gICAgfTtcbiAgICBGb3JtYXQ6XG4gICAge1xuICAgICAgICBBbHdheXNBcHBseUZvcm1hdDogYm9vbGVhbjtcbiAgICAgICAgQ29sb3JzOiBib29sZWFuO1xuICAgICAgICBEaWdpdFNlcGFyYXRvcjogRkxvZ0RpZ2l0U2VwYXJhdG9yO1xuICAgICAgICBRdW90ZVN0eWxlOiBGTG9nUXVvdGVTdHlsZTtcbiAgICAgICAgVHJ1bmNhdGVCYXNlNjRTdHJpbmdzOiBib29sZWFuO1xuICAgIH07XG4gICAgU2l6ZTpcbiAgICB7XG4gICAgICAgIExpbWl0U3RhdGVtZW50TGVuZ3RoOlxuICAgICAgICB7XG4gICAgICAgICAgICBFbmFibGVkOiBib29sZWFuO1xuICAgICAgICAgICAgTWF4TGVuZ3RoOiBudW1iZXI7XG4gICAgICAgIH07XG4gICAgICAgIE1heFRlcm1pbmFsV2lkdGg6IG51bWJlcjtcbiAgICAgICAgVGFiV2lkdGg6IG51bWJlcjtcbiAgICB9O1xufT47XG5cbmV4cG9ydCB0eXBlIEZMb2dnZXIgPSBGTG9nZ2VyUmVjb3JkICYgRkxvZ0Z1bmN0aW9uO1xuXG5leHBvcnQgdHlwZSBGTG9nZ2VySW50ZXJpbSA9IEZMb2dGdW5jdGlvbiAmIFBhcnRpYWw8RkxvZ2dlclJlY29yZD47XG5cbmV4cG9ydCB0eXBlIEZMb2cgPSAoLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIEZHZXRUaW1lVG9rZW4gPSBcIl9fR2V0VGltZV9fXCI7XG5cbmV4cG9ydCB0eXBlIEZMb2dGcm9udGVuZFRva2VucyA9XG4gICAgfCBGR2V0VGltZVRva2VuO1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIExvZy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkdldFRpbWVUb2tlbiB9IGZyb20gXCIuL0xvZy5UeXBlc1wiO1xuXG5leHBvcnQgY29uc3QgR2V0VGltZVRva2VuOiBGR2V0VGltZVRva2VuID0gXCJfX0dldFRpbWVfX1wiIGFzIGNvbnN0O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIEtleWJpbmQuVHlwZXMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZLZXlJZCB9IGZyb20gXCIuLi8uLi9TaGFyZWQvS2V5Ym9hcmQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgVEludGVncmFsUmFuZ2UgfSBmcm9tIFwiQHNvcnJlbGwvdXRpbGl0aWVzL21hdGhcIjtcbmltcG9ydCB0eXBlIHsgVFN0YXRpY0FycmF5IH0gZnJvbSBcIkBzb3JyZWxsL3V0aWxpdGllcy9hcnJheVwiO1xuaW1wb3J0IHR5cGUgeyBUUmVjdXJyZW5jZSB9IGZyb20gXCIuL0tleWJpbmQuSW50ZXJuYWwuVHlwZXNcIjtcblxuLyoqXG4gKiBTb21lIGtleWJpbmRzIGhhdmUgZGlyZWN0aW9ucywgd2hpY2ggaXMgb25lIG9mIGZvdXIgYmFzaWMgZGlyZWN0aW9ucyBpbiAkXFxtYXRoYmZ7Un1eMiQuXG4gKi9cbmV4cG9ydCB0eXBlIEZLZXliaW5kRGlyZWN0aW9uID1cbiAgICB8IFwiTGVmdFwiXG4gICAgfCBcIlVwXCJcbiAgICB8IFwiRG93blwiXG4gICAgfCBcIlJpZ2h0XCI7XG5cbi8qKlxuICogU29tZSBrZXliaW5kcyBoYXZlIFwibGV2ZWxzXCIsIHdoaWNoIGdyb3VwcyBzZXRzIG9mIGtleWJpbmRzLCBzdWNoIHRoYXQgZWFjaCBzZXRcbiAqIGlzIGlkZW50aWZpZWQgYnkgaXRzIFwibGV2ZWxcIiwgd2hpY2ggY2FuIGJlIHRob3VnaHQgb2YgYXMgdGhlICppbXBvcnRhbmNlKiBvZlxuICogdGhlIGFjdGlvbnMgdGhhdCBjYW4gYmUgcGVyZm9ybWVkIGJ5IHRoYXQgc2V0IG9mIGtleWJpbmRzLlxuICovXG5leHBvcnQgdHlwZSBGS2V5YmluZEFjdGlvbkxldmVsID1cbiAgICB8IFwiUHJpbWFyeVwiXG4gICAgfCBcIlNlY29uZGFyeVwiO1xuXG4vKipcbiAqIEEgZmluaXRlIHNlcXVlbmNlIG9mIHplcm8gdG8gdGhyZWUge0BsaW5rIEZLZXlJZCB8IGtleXN9LlxuICovXG5leHBvcnQgdHlwZSBGS2V5U2VxdWVuY2VTZXQgPSBSZWNvcmQ8VEludGVncmFsUmFuZ2U8MCwgMz4sIEFycmF5PEZLZXlJZD4+O1xuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgbWlzY2VsbGFuZW91cyBhY3Rpb25zIHRoYXQgaGF2ZSBhc3NpZ25hYmxlIGtleWJpbmRzLlxuICovXG5leHBvcnQgdHlwZSBGS2V5YmluZEFjdGlvbk1pc2NlbGxhbmVvdXMgPVxuICAgIHwgXCJQZWVrXCJcbiAgICB8IFwiRm9jdXNMaXN0XCJcbiAgICB8IFwiRm9jdXNUZXh0SW5wdXRcIlxuICAgIHwgXCJTZXR0aW5nc1wiO1xuXG4vKipcbiAqIFRoaXMge0BsaW5rIFJlY29yZH0gZGVzY3JpYmVzIGFsbCBhY3Rpb25zIHRoYXQgY2FuIGJlIHBlcmZvcm1lZFxuICogaW4gYFNvcnJlbGxXbWAgd2l0aCB0aGUga2V5Ym9hcmQsIGFuZCB0aGUga2V5Ym9hcmQga2V5cyAob3Igc2VxdWVuY2VcbiAqIG9mIGtleWJvYXJkIGtleXMpIHRoYXQgbXVzdCBiZSBwcmVzc2VkIHRvIHBlcmZvcm0gdGhhdCBhY3Rpb24gdmlhIHRoZVxuICoga2V5Ym9hcmQuXG4gKi9cbmV4cG9ydCB0eXBlIEZLZXliaW5kcyA9XG4gICAgUmVjb3JkPEZLZXliaW5kQWN0aW9uTGV2ZWwsIEZLZXlTZXF1ZW5jZVNldD4gJlxuICAgIHtcbiAgICAgICAgQWN0aXZhdGU6IEFycmF5PEZLZXlJZD47XG4gICAgICAgIENhbmNlbDogQXJyYXk8RktleUlkPjtcbiAgICAgICAgRGlyZWN0aW9uOiBSZWNvcmQ8RktleWJpbmREaXJlY3Rpb24sIEFycmF5PEZLZXlJZD4+O1xuICAgICAgICBNaXNjZWxsYW5lb3VzOiBSZWNvcmQ8RktleWJpbmRBY3Rpb25NaXNjZWxsYW5lb3VzLCBBcnJheTxGS2V5SWQ+PjtcbiAgICB9O1xuXG4vKipcbiAqIFRoZSB1c2VyLWZhY2luZyBuYW1lcyBvZiB0aGUga2V5YmluZCBhY3Rpb25zIGF2YWlsYWJsZSB0byB0aGUgdXNlciBpbiBgU29ycmVsbFdtYC5cbiAqL1xuZXhwb3J0IHR5cGUgRktleWJpbmREaXNwbGF5TmFtZXMgPSBUUmVjdXJyZW5jZTxGS2V5YmluZHM+O1xuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgYC5gLWRlbGltaXRlZCBgc3RyaW5nYHMgdGhhdCB1bmlxdWVseSBpZGVudGlmeSBldmVyeVxuICogYXNzaWduYWJsZSBhY3Rpb24gdGhhdCBjYW4gYmUgcGVyZm9ybWVkIHZpYSB0aGUga2V5Ym9hcmQgaW4gYFNvcnJlbGxXbWAuXG4gKi9cbmV4cG9ydCB0eXBlIEZBY3Rpb25LZXkgPVxuICAgIHwgYCR7IEZLZXliaW5kQWN0aW9uTGV2ZWwgfVskeyBrZXlvZiBGS2V5U2VxdWVuY2VTZXQgfV1gXG4gICAgfCBgRGlyZWN0aW9uLiR7IEZLZXliaW5kRGlyZWN0aW9uIH1gXG4gICAgfCBgTWlzY2VsbGFuZW91cy4keyBGS2V5YmluZEFjdGlvbk1pc2NlbGxhbmVvdXMgfWBcbiAgICB8IFwiQWN0aXZhdGVcIlxuICAgIHwgXCJDYW5jZWxcIjtcblxuLyoqXG4gKiBBbiB7QGxpbmsgRkFjdGlvbn0gaXNcbiAqL1xuZXhwb3J0IHR5cGUgRkFjdGlvbiA9IFRTdGF0aWNBcnJheTxGQWN0aW9uS2V5LCBUSW50ZWdyYWxSYW5nZTwxLCA0Pj47XG5cbmV4cG9ydCB0eXBlIEZLZXlTaWRlID1cbiAgICB8IFwiTFwiXG4gICAgfCBcIlJcIlxuICAgIHwgXCJFaXRoZXJcIlxuICAgIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBGS2V5ID1cbiAgICB7XG4gICAgICAgIC8qKiBUZXh0IHRvIGRpc3BsYXkgb24gdGhlIGtleSwgb3IgYSBzeW1ib2wgdGhhdCBpcyByZW5kZXJlZCBpbiB0aGUgY2VudGVyIG9mIHRoZSBrZXkuICovXG4gICAgICAgIERpc3BsYXk6IHN0cmluZztcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gYWRkaXRpb25hbCBkZXNjcmlwdG9yLCBzaG93biBpbiB0aGUgY29ybmVyLlxuICAgICAgICAgKiBTaG91bGQgYmUgYHVuZGVmaW5lZGAgd2hlbmV2ZXIgYFNpZGVgIGlzIGRlZmluZWQuXG4gICAgICAgICAqL1xuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkIHwgc3RyaW5nO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgXCJzaWRlXCIgb2YgdGhlIGtleSBpczpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBgXCJMZWZ0XCJgIG9yIGBcIlJpZ2h0XCJgIGluIHRoZSBjYXNlIG9mIGtleXMgbGlrZSBsZWZ0IHNoaWZ0XG4gICAgICAgICAqIC0gYFwiRWl0aGVyXCJgIGluIHRoZSBjYXNlIG9mIGtleXMgdGhhdCBkbyBub3QgaGF2ZSBhIHNpZGUsXG4gICAgICAgICAqICAgYnV0IGhhdmUgY29ycmVzcG9uZGluZyBrZXkgY29kZXMgdGhhdCAqZG8qIGhhdmUgc2lkZXMuXG4gICAgICAgICAqIC0gYHVuZGVmaW5lZGAgZm9yIFwibm9ybWFsXCIga2V5cywgc3VjaCBhcyBsZXR0ZXJzIGFuZCBudW1iZXJzXG4gICAgICAgICAqL1xuICAgICAgICBTaWRlOiBGS2V5U2lkZTtcbiAgICB9O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIEtleWJpbmQudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBzb3J0LWtleXMgKi9cblxuaW1wb3J0IHR5cGUgeyBGQWN0aW9uS2V5LCBGS2V5IH0gZnJvbSBcIi4vS2V5YmluZC5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGVmlydHVhbEtleSB9IGZyb20gXCIuLi8uLi9TaGFyZWQvS2V5Ym9hcmQuVHlwZXNcIjtcblxuY29uc3QgV2luZG93c0xvZ286IHN0cmluZyA9IFwiXFx1RTc4MlwiO1xuY29uc3QgR2xvYmVTeW1ib2w6IHN0cmluZyA9IFwiXFx1RTc3NFwiO1xuY29uc3QgTnVtTW9kaWZpZXI6IHN0cmluZyA9IFwiTlVNXCI7XG5jb25zdCBTaGlmdFN5bWJvbDogc3RyaW5nID0gXCJcXHVFNzUyXCI7XG5cbmV4cG9ydCBjb25zdCBLZXlzOiBSZWFkb25seTxSZWNvcmQ8RlZpcnR1YWxLZXksIEZLZXk+PiA9XG57XG4gICAgMHgwNTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTk2MlwiLFxuICAgICAgICBNb2RpZmllcjogXCIxXCIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgwNjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTk2MlwiLFxuICAgICAgICBNb2RpZmllcjogXCIyXCIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgwODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTc1MFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MDk6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3RkRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDBEOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzUxXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgxMDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTc1MlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIkVpdGhlclwiXG4gICAgfSxcbiAgICAweDExOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJDVFJMXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiRWl0aGVyXCJcbiAgICB9LFxuICAgIDB4MTI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkFMVFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIkVpdGhlclwiXG4gICAgfSxcbiAgICAweDEzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFODFBXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyMDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTc1RFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MjE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlBnVXBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDIyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJQZ0Rvd25cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDIzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJFbmRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDI0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJIb21lXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyNTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiTGVmdEFycm93XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyNjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiVXBBcnJvd1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Mjc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlJpZ2h0QXJyb3dcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDI4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJEb3duQXJyb3dcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDJEOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJJbnNcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDJFOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJEZWxcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDMwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIwXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzMTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiMVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MzI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjJcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDMzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIzXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzNDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiNFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MzU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDM2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI2XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzNzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiN1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Mzg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjhcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDM5OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI5XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0MTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkJcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJDXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0NDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQ2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0NzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiR1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkhcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQ5OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJJXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0QTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiSlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NEI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIktcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDRDOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJMXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0RDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiTVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NEU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIk5cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDRGOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJPXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1MDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiUFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDUyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJSXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1MzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiU1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDU1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJVXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1NjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiVlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIldcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDU4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJYXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1OTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiWVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NUE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlpcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDVCOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogV2luZG93c0xvZ28sXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiTFwiXG4gICAgfSxcbiAgICAweDVDOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogV2luZG93c0xvZ28sXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiUlwiXG4gICAgfSxcbiAgICAweDVEOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzAwXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2MDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiMFwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2MTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiMVwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2MjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiMlwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2MzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiM1wiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2NDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiNFwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2NTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiNVwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2NjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiNlwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2NzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiN1wiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2ODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiOFwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2OTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiOVwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2QTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiw5dcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NkI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIitcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NkQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIi1cIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NkU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIi5cIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NkY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIi9cIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NzA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3MTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjJcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDcyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGM1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NzM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkY0XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3NDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDc1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGNlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NzY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkY3XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3NzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjhcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDc4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGOVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Nzk6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxMFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4N0E6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxMVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4N0I6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxMlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4N0M6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxM1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4N0Q6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxNFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4N0U6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxNVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4N0Y6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxNlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxN1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxOFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYxOVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYyMFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYyMVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYyMlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYyM1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4ODc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYyNFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QTA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBTaGlmdFN5bWJvbCxcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJMXCJcbiAgICB9LFxuICAgIDB4QTE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBTaGlmdFN5bWJvbCxcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJSXCJcbiAgICB9LFxuICAgIDB4QTI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkNUUkxcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJMXCJcbiAgICB9LFxuICAgIDB4QTM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkNUUkxcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJSXCJcbiAgICB9LFxuICAgIDB4QTQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkFMVFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIkxcIlxuICAgIH0sXG4gICAgMHhBNTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQUxUXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiUlwiXG4gICAgfSxcbiAgICAweEE2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCImI0U3MkJcIixcbiAgICAgICAgTW9kaWZpZXI6IEdsb2JlU3ltYm9sLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QTc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MkFcIixcbiAgICAgICAgTW9kaWZpZXI6IEdsb2JlU3ltYm9sLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QTg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MkNcIixcbiAgICAgICAgTW9kaWZpZXI6IEdsb2JlU3ltYm9sLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QTk6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MzNcIixcbiAgICAgICAgTW9kaWZpZXI6IEdsb2JlU3ltYm9sLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QUE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MjFcIixcbiAgICAgICAgTW9kaWZpZXI6IEdsb2JlU3ltYm9sLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QUI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MjhcIixcbiAgICAgICAgTW9kaWZpZXI6IEdsb2JlU3ltYm9sLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QUM6XG4gICAge1xuICAgICAgICAvKiBAVE9ETyBDb25zaWRlciB1c2luZyBhIGRpZmZlcmVudCBpY29uLiAqL1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUY3MUNcIixcbiAgICAgICAgTW9kaWZpZXI6IEdsb2JlU3ltYm9sLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QjA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUVCOURcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEIxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFQjlFXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCMjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTcxQVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QjM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3NjhcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEI0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzE1XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCNTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RUE2OVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QjY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUVCM0JcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEI3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFRDM1XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCQTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiO1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QkI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIitcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEJDOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIsXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCRDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiLVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QkU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIi5cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEJGOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIvXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhDMDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiYFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4REI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIltcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweERDOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXFxcXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhERDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4REU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIidcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IEFjdGlvbktleXM6IFJlYWRvbmx5PEFycmF5PEZBY3Rpb25LZXk+PiA9XG5bXG4gICAgXCJBY3RpdmF0ZVwiLFxuICAgIFwiQ2FuY2VsXCIsXG4gICAgXCJEaXJlY3Rpb24uRG93blwiLFxuICAgIFwiRGlyZWN0aW9uLkxlZnRcIixcbiAgICBcIkRpcmVjdGlvbi5SaWdodFwiLFxuICAgIFwiRGlyZWN0aW9uLlVwXCIsXG4gICAgXCJNaXNjZWxsYW5lb3VzLkZvY3VzTGlzdFwiLFxuICAgIFwiTWlzY2VsbGFuZW91cy5Gb2N1c1RleHRJbnB1dFwiLFxuICAgIFwiTWlzY2VsbGFuZW91cy5QZWVrXCIsXG4gICAgXCJNaXNjZWxsYW5lb3VzLlNldHRpbmdzXCIsXG4gICAgXCJQcmltYXJ5WzBdXCIsXG4gICAgXCJQcmltYXJ5WzFdXCIsXG4gICAgXCJQcmltYXJ5WzJdXCIsXG4gICAgXCJQcmltYXJ5WzNdXCIsXG4gICAgXCJTZWNvbmRhcnlbMF1cIixcbiAgICBcIlNlY29uZGFyeVsxXVwiLFxuICAgIFwiU2Vjb25kYXJ5WzJdXCIsXG4gICAgXCJTZWNvbmRhcnlbM11cIlxuXSBhcyBjb25zdDtcbiIsIi8qKlxuICogQGZpbGUgICAgICBTZXR0aW5ncy5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRXh0ZXJuYWxTZXR0aW5ncyB9IGZyb20gXCIuL1NldHRpbmdzXCI7XG5pbXBvcnQgdHlwZSB7IEZLZXliaW5kcyB9IGZyb20gXCIuL0tleWJpbmQuVHlwZXNcIjtcblxuLyoqXG4gKiBTb21lIHNldHRpbmdzIHJlZ2FyZCBzdGF0ZSB0aGF0IGlzIG91dHNpZGUgb2YgU29ycmVsbFdtLFxuICovXG5leHBvcnQgdHlwZSBGRXh0ZXJuYWxTZXR0aW5nID0gdHlwZW9mIEV4dGVybmFsU2V0dGluZ3NbbnVtYmVyXTtcblxuLyoqXG4gKiBUaGUgc2V0dGluZ3Mgb2YgYFNvcnJlbGxXbWAuXG4gKi9cbmV4cG9ydCB0eXBlIEZTZXR0aW5ncyA9XG4gICAge1xuICAgICAgICAvKiogU2NhbGVzIHRoZSBzcGVlZCBvZiB0aGUgYW5pbWF0aW9ucyBpbiBgU29ycmVsbFdtYC4gKi9cbiAgICAgICAgQW5pbWF0aW9uU2NhbGFyOiBudW1iZXI7XG5cbiAgICAgICAgLyoqIEluIHBpeGVscywgdGhlIGdhcCBiZXR3ZWVuIHZlcnRpY2VzIGluIGEgZ2l2ZW4gcGFuZWwuICovXG4gICAgICAgIEdhcDogbnVtYmVyO1xuXG4gICAgICAgIC8qKiBXaGV0aGVyIGBTb3JyZWxsV21gIHNob3VsZCBsYXVuY2ggd2hlbiB0aGUgc3lzdGVtIHN0YXJ0cy4gKi9cbiAgICAgICAgUnVuT25TdGFydHVwOiBib29sZWFuO1xuXG4gICAgICAgIC8qKiBUaGUge0BsaW5rIEZLZXliaW5kc30sIGRlc2NyaWJpbmcgdGhlIGtleWJvYXJkIHNob3J0Y3V0cyBhdmFpbGFibGUgdG8gdGhlIHVzZXIuICovXG4gICAgICAgIEtleWJpbmRzOiBGS2V5YmluZHM7XG5cbiAgICAgICAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgc2hvdWxkIGJlIG5vdGlmaWVkIHdoZW4gYW4gdXBkYXRlIGlzIGF2YWlsYWJsZS4gKi9cbiAgICAgICAgU2hvd1VwZGF0ZU5vdGlmaWNhdGlvbnM6IGJvb2xlYW47XG4gICAgfTtcblxuLyoqXG4gKiBUaGUga2V5cyBvZiB7QGxpbmsgRlNldHRpbmdzfS5cbiAqL1xuZXhwb3J0IHR5cGUgRlNldHRpbmdzS2V5cyA9IGtleW9mIEZTZXR0aW5ncztcbiIsIi8qKlxuICogQGZpbGUgICAgICBTZXR0aW5ncy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRlNldHRpbmdzIH0gZnJvbSBcIi4vU2V0dGluZ3MuVHlwZXNcIjtcblxuZXhwb3J0LyoqXG4gICAgICAgKiBTb21lIHNldHRpbmdzIHJlZ2FyZCBzdGF0ZSB0aGF0IGlzIG91dHNpZGUgb2YgU29ycmVsbFdtLFxuICAgICAgICogZm9yIGV4YW1wbGUsIGZvciB0aGUgYFJ1bk9uU3RhcnR1cGAgc2V0dGluZyB0byBiZSBob25vcmVkLFxuICAgICAgICogYSB0YXNrIG11c3QgYmUgcmVnaXN0ZXJlZCB2aWEgdGhlIFRhc2sgU2NoZWR1bGVyLiAgSWYgdGhpc1xuICAgICAgICogZmFpbHMsIHRoZW4gdGhpcyBleHRlcm5hbCBzdGF0ZSAoKmkuZS4qLCB0aGUgVGFzayBTY2hlZHVsZXIpXG4gICAgICAgKiBpcyBpbmNvbnNpc3RlbnQgd2l0aCB0aGUgdmFsdWUgb2YgdGhlIHNldHRpbmcgYFJ1bk9uU3RhcnR1cGBcbiAgICAgICAqIGluIFNvcnJlbGxXbS5cbiAgICAgICAqL1xuY29uc3QgRXh0ZXJuYWxTZXR0aW5nczogcmVhZG9ubHkgWyBcIlJ1bk9uU3RhcnR1cFwiIF0gPSBbIFwiUnVuT25TdGFydHVwXCIgXSBhcyBjb25zdDtcblxuZXhwb3J0LyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCBzZXR0aW5ncyBvZiBgU29ycmVsbFdtYC5cbiAgICAgICAqL1xuY29uc3QgRGVmYXVsdFNldHRpbmdzOiBGU2V0dGluZ3MgPVxuICAgIHtcbiAgICAgICAgQW5pbWF0aW9uU2NhbGFyOiAxLFxuICAgICAgICBHYXA6IDQsXG4gICAgICAgIEtleWJpbmRzOlxuICAgICAgICB7XG4gICAgICAgICAgICBBY3RpdmF0ZTogWyBcIkYyMFwiIF0sXG4gICAgICAgICAgICBDYW5jZWw6IFsgXCJCYWNrc3BhY2VcIiBdLFxuICAgICAgICAgICAgRGlyZWN0aW9uOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuICAgICAgICAgICAgICAgIExlZnQ6IFsgXCJEXCIgXSxcbiAgICAgICAgICAgICAgICBVcDogWyBcIkhcIiBdLFxuICAgICAgICAgICAgICAgIERvd246IFsgXCJUXCIgXSxcbiAgICAgICAgICAgICAgICBSaWdodDogWyBcIk5cIiBdXG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBzb3J0LWtleXMgKi9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNaXNjZWxsYW5lb3VzOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEZvY3VzTGlzdDogWyBcImBcIiBdLFxuICAgICAgICAgICAgICAgIEZvY3VzVGV4dElucHV0OiBbIFwiVGFiXCIgXSxcbiAgICAgICAgICAgICAgICBQZWVrOiBbIFwiWlwiIF0sXG4gICAgICAgICAgICAgICAgU2V0dGluZ3M6IFsgXCIrXCIgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFByaW1hcnk6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgMDogWyBcIkZcIiBdLFxuICAgICAgICAgICAgICAgIDE6IFsgXCJHXCIgXSxcbiAgICAgICAgICAgICAgICAyOiBbIFwiVFwiIF0sXG4gICAgICAgICAgICAgICAgMzogWyBcIlJcIiBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2Vjb25kYXJ5OlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIDA6IFsgXCJDdHJsXCIsIFwiRlwiIF0sXG4gICAgICAgICAgICAgICAgMTogWyBcIkN0cmxcIiwgXCJHXCIgXSxcbiAgICAgICAgICAgICAgICAyOiBbIFwiQ3RybFwiLCBcIlRcIiBdLFxuICAgICAgICAgICAgICAgIDM6IFsgXCJDdHJsXCIsIFwiUlwiIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgUnVuT25TdGFydHVwOiBmYWxzZSxcbiAgICAgICAgU2hvd1VwZGF0ZU5vdGlmaWNhdGlvbnM6IHRydWVcbiAgICB9O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIGluZGV4LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vS2V5YmluZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vS2V5YmluZC5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vU2V0dGluZ3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzLlR5cGVzXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgU2hhcmVkLlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgRkNhcmRpbmFsRGlyZWN0aW9uID1cbiAgICB8IFwiVXBcIlxuICAgIHwgXCJEb3duXCJcbiAgICB8IFwiTGVmdFwiXG4gICAgfCBcIlJpZ2h0XCI7XG5cbmV4cG9ydCB0eXBlIFRGdW5jdGlvbjxQYXJhbWV0ZXJUeXBlcyBleHRlbmRzIFRBcnJheTx1bmtub3duPiwgUmV0dXJuVHlwZT4gPVxuICAgICguLi5Bcmd1bWVudHM6IFBhcmFtZXRlclR5cGVzKSA9PiBSZXR1cm5UeXBlO1xuXG5leHBvcnQgdHlwZSBGTm90RnVuY3Rpb24gPSBFeGNsdWRlPHVua25vd24sICguLi5Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT4gdW5rbm93bj47XG5cbmV4cG9ydCB0eXBlIEZBeGlzID0gXCJYXCIgfCBcIllcIjtcbiIsIi8qKlxuICogQGZpbGUgICAgICBTdG9yZS5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIEZTdG9yZSA9XG57XG4gICAgQXBwVmVyc2lvbjogc3RyaW5nO1xuICAgIFRpbWVMYXN0Q2hlY2tlZFVwZGF0ZTogbnVtYmVyIHwgbnVsbDtcbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgU3RvcmUudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZTdG9yZSB9IGZyb20gXCIuL1N0b3JlLlR5cGVzXCI7XG4vLyBpbXBvcnQgeyBhcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcblxuZXhwb3J0IGNvbnN0IEdldERlZmF1bHRTdG9yZSA9ICgpOiBGU3RvcmUgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICAvLyBBcHBWZXJzaW9uOiBhcHAuZ2V0VmVyc2lvbigpLFxuICAgICAgICBBcHBWZXJzaW9uOiBcIkBUT0RPXCIsXG4gICAgICAgIFRpbWVMYXN0Q2hlY2tlZFVwZGF0ZTogbnVsbFxuICAgIH07XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIFRva2Vucy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICogQ29tbWVudDogICBUaGlzIGhvc3RzIHNpbXBsZSB2YWx1ZXMgdXNlZCBieSBgbWFpbmAgYW5kIHRoZSBgcmVuZGVyZXJgLlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvdHlwZWRlZiAqL1xuZXhwb3J0IGNvbnN0IFRva2VucyA9XG57XG4gICAgVGl0bGViYXJIZWlnaHQ6IDQ4XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIFRyZWUuVHlwZXMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZCb3gsIEhNb25pdG9yLCBIV2luZG93IH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcblxuZXhwb3J0IHR5cGUgRlZlcnRleEJhc2UgPVxue1xuICAgIC8qKiBAVE9ETyBBZGQgYEdhcFNpemVgIG9yIGBHcmlkU2l6ZWAgKGlmIHlvdSBhZGQgYEdyaWRTaXplYCwgbWFrZSBgU2l6ZWAgYmUgdGhlIFwiR2FwU2l6ZVwiKS4gKi9cbiAgICAvLyBHYXBTaXplOiBGQm94O1xuICAgIFNpemU6IEZCb3g7XG4gICAgWk9yZGVyOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGQ2VsbCA9XG4gICAgRlZlcnRleEJhc2UgJlxuICAgIHtcbiAgICAgICAgSGFuZGxlOiBIV2luZG93O1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZWZXJ0ZXggPVxuICAgIHwgRkNlbGxcbiAgICB8IEZQYW5lbDtcblxuZXhwb3J0IHR5cGUgRlBhbmVsRGlyZWN0aW9uID1cbiAgICB8IFwiSG9yaXpvbnRhbFwiXG4gICAgfCBcIlZlcnRpY2FsXCJcblxuZXhwb3J0IHR5cGUgRlBhbmVsVHlwZSA9XG4gICAgfCBGUGFuZWxEaXJlY3Rpb25cbiAgICB8IFwiU3RhY2tcIjtcblxuZXhwb3J0IHR5cGUgRlBhbmVsQmFzZSA9XG4gICAgRlZlcnRleEJhc2UgJlxuICAgIHtcbiAgICAgICAgQ2hpbGRyZW46IFRBcnJheTxGVmVydGV4PjtcbiAgICAgICAgLyoqIFNob3VsZCBvbmx5IGJlIHNldCB3aGVuIHRoaXMgaXMgdGhlIHJvb3QgcGFuZWwgb2YgYSBtb25pdG9yLiAqL1xuICAgICAgICBNb25pdG9ySWQ/OiBITW9uaXRvcjtcbiAgICAgICAgVHlwZTogRlBhbmVsVHlwZTtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBGUGFuZWxIb3Jpem9udGFsID1cbiAgICBGUGFuZWxCYXNlICZcbiAgICB7XG4gICAgICAgIFR5cGU6IFwiSG9yaXpvbnRhbFwiO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZQYW5lbFZlcnRpY2FsID1cbiAgICBGUGFuZWxCYXNlICZcbiAgICB7XG4gICAgICAgIFR5cGU6IFwiVmVydGljYWxcIjtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBGUGFuZWxTdGFjayA9XG4gICAgRlBhbmVsQmFzZSAmXG4gICAge1xuICAgICAgICBUeXBlOiBcIlN0YWNrXCI7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRlBhbmVsID1cbiAgICB8IEZQYW5lbEhvcml6b250YWxcbiAgICB8IEZQYW5lbFZlcnRpY2FsO1xuICAgIC8vIHwgRlBhbmVsU3RhY2s7XG5cbmV4cG9ydCB0eXBlIEZGb3Jlc3QgPSBUQXJyYXk8RlBhbmVsPjtcblxuZXhwb3J0IHR5cGUgRkFubm90YXRlZFBhbmVsID1cbiAgICBGUGFuZWwgJlxuICAgIHtcbiAgICAgICAgQXBwbGljYXRpb25OYW1lczogVEFycmF5PHN0cmluZz47XG4gICAgICAgIE1vbml0b3JOYW1lOiBzdHJpbmc7XG4gICAgICAgIElzUm9vdDogYm9vbGVhbjtcbiAgICAgICAgU2NyZWVuc2hvdDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZGb2N1c0NoYW5nZSA9XG4gICAgfCBcIk5leHRcIlxuICAgIHwgXCJQcmV2aW91c1wiXG4gICAgfCBcIlVwXCJcbiAgICB8IFwiRG93blwiO1xuXG5leHBvcnQgdHlwZSBGTG9nVHJhbnNmb3JtZXIgPSAoVmVydGV4OiBGVmVydGV4LCBEZXB0aDogbnVtYmVyLCBEZWZhdWx0U3RyaW5nOiBzdHJpbmcpID0+IHN0cmluZztcblxuZXhwb3J0IHR5cGUgRkdhcERhdGEgPVxue1xuICAgIEFkanVzdGVkU2l6ZTogRkJveDtcbiAgICBQcmluY2lwYWxSYXRpbzogbnVtYmVyO1xufTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBGdW5jdGlvbmFsLlR5cGVzLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgRlNpbXBsZUNhbGxiYWNrID0gKCkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIEZTaW1wbGVDYWxsYmFja0FzeW5jID0gKCkgPT4gUHJvbWlzZTx2b2lkPjtcbmV4cG9ydCB0eXBlIEZTaW1wbGVDYWxsYmFja01heWJlQXN5bmMgPSBGU2ltcGxlQ2FsbGJhY2sgfCBGU2ltcGxlQ2FsbGJhY2tBc3luYztcblxuZXhwb3J0IHR5cGUgVFNpbXBsZUZ1bmN0aW9uPFBhcmFtZXRlclR5cGUsIFJldHVyblR5cGUgPSB2b2lkPiA9IChJbjogUGFyYW1ldGVyVHlwZSkgPT4gUmV0dXJuVHlwZTtcblxuZXhwb3J0IHR5cGUgVFJlc29sdmVGdW5jdGlvbjxUeXBlPiA9IChWYWx1ZTogVHlwZSB8IFByb21pc2VMaWtlPFR5cGU+KSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgRlJlamVjdEZ1bmN0aW9uID0gKFJlYXNvbj86IHVua25vd24pID0+IHZvaWQ7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgVXRpbGl0eS5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgVE5vbmVtcHR5QXJyYXkgfSBmcm9tIFwiQHNvcnJlbGwvdXRpbGl0aWVzL2FycmF5XCI7XG5cbmV4cG9ydCB0eXBlIFRNYXRyaXg8VHlwZT4gPSBUQXJyYXk8VEFycmF5PFR5cGU+PjtcbmV4cG9ydCB0eXBlIFRTYWZlTWF0cml4PFR5cGU+ID0gVE5vbmVtcHR5QXJyYXk8VE5vbmVtcHR5QXJyYXk8VHlwZT4+O1xuXG5leHBvcnQgdHlwZSBGUGF0aEtleSA9IG51bWJlciB8IHN0cmluZztcbmV4cG9ydCB0eXBlIEZQYXRoUmVjb3JkID0gUmVjb3JkPEZQYXRoS2V5LCB1bmtub3duPjtcblxudHlwZSBUUmVjb3JkUHJvcGVydHk8S2V5VHlwZSBleHRlbmRzIEZQYXRoS2V5PiA9IGAuJHsgS2V5VHlwZSB9YDtcblxudHlwZSBUUmVjb3JkUGF0aFBhcnQ8UHJvcGVydHlLZXlUeXBlIGV4dGVuZHMga2V5b2YgUGFyZW50VHlwZSwgUGFyZW50VHlwZSBleHRlbmRzIEZQYXRoUmVjb3JkPiA9XG4gICAgUHJvcGVydHlLZXlUeXBlIGV4dGVuZHMgRlBhdGhLZXlcbiAgICAgICAgPyBQYXJlbnRUeXBlW1Byb3BlcnR5S2V5VHlwZV0gZXh0ZW5kcyBGUGF0aFJlY29yZFxuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgPyBgJHsgVFJlY29yZFByb3BlcnR5PFByb3BlcnR5S2V5VHlwZT4gfSR7IFRSZWNvcmRQYXRoUGFydDxrZXlvZiBQYXJlbnRUeXBlW1Byb3BlcnR5S2V5VHlwZV0sIFBhcmVudFR5cGVbUHJvcGVydHlLZXlUeXBlXT4gfWBcbiAgICAgICAgICAgIDogYCR7IFRSZWNvcmRQcm9wZXJ0eTxQcm9wZXJ0eUtleVR5cGU+IH1gXG4gICAgICAgIDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIFRPYmplY3RQYXRoPFxuICAgIFJlY29yZFR5cGUgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICBPYmplY3ROYW1lVHlwZSBleHRlbmRzIHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuPiA9XG4gICAgT2JqZWN0TmFtZVR5cGUgZXh0ZW5kcyBzdHJpbmdcbiAgICAgICAgPyBgJHsgT2JqZWN0TmFtZVR5cGUgfSR7IFRSZWNvcmRQYXRoUGFydDxrZXlvZiBSZWNvcmRUeXBlLCBSZWNvcmRUeXBlPiB9YFxuICAgICAgICA6IFRSZWNvcmRQYXRoUGFydDxrZXlvZiBSZWNvcmRUeXBlLCBSZWNvcmRUeXBlPiBleHRlbmRzIGAuJHsgaW5mZXIgT3V0VHlwZSB9YFxuICAgICAgICAgICAgPyBPdXRUeXBlXG4gICAgICAgICAgICA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBGQ29sb3IgPSBgIyR7IHN0cmluZyB9YDtcbiIsIi8qKlxuICogQGZpbGUgICAgICBVdGlsaXR5LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGQm94LCBGUmVjb3JkIH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcbmltcG9ydCB0eXBlIHsgRkZ1bmN0aW9uQW55LCBURnVuY3Rpb24gfSBmcm9tIFwiQHNvcnJlbGwvZnVuY3Rpb25hbFwiO1xuaW1wb3J0IHR5cGUgeyBGUmVqZWN0RnVuY3Rpb24sIFRSZXNvbHZlRnVuY3Rpb24gfSBmcm9tIFwiLi9GdW5jdGlvbmFsLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dnZXIgfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiQC9Mb2dcIjtcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFycyAqL1xuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiVXRpbGl0eVwiKTtcblxudHlwZSBITW9uaXRvciA9IHtcbiAgICBIYW5kbGU6IG51bWJlcjtcbn07XG5cbnR5cGUgSFdpbmRvdyA9IHtcbiAgICBIYW5kbGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRFbXB0eU1vbml0b3IoKTogSE1vbml0b3JcbntcbiAgICByZXR1cm4ge1xuICAgICAgICBIYW5kbGU6IC0xXG4gICAgfTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRFbXB0eVdpbmRvdygpOiBIV2luZG93XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSGFuZGxlOiBcIlwiXG4gICAgfTtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWZ1bmN0aW9uLXR5cGUsIEBzdHlsaXN0aWMvYnJhY2Utc3R5bGUgKi9cbmNvbnN0IEFzeW5jRnVuY3Rpb246IEZ1bmN0aW9uID0gKGFzeW5jIGZ1bmN0aW9uICgpIHsgfSkuY29uc3RydWN0b3I7XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0FzeW5jRnVuY3Rpb24oXG4gICAgVmFsdWU6IHVua25vd25cbik6IFZhbHVlIGlzICguLi5Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT4gUHJvbWlzZTx1bmtub3duPlxue1xuICAgIHJldHVybiB0eXBlb2YgVmFsdWUgPT09IFwiZnVuY3Rpb25cIiAmJiBWYWx1ZS5jb25zdHJ1Y3RvciA9PT0gQXN5bmNGdW5jdGlvbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIENhbGxNYXliZUFzeW5jPFxuICAgIEluUmV0dXJuVHlwZSxcbiAgICBJblBhcmFtZXRlcnMgZXh0ZW5kcyBQYXJhbWV0ZXJzPEZGdW5jdGlvbkFueT4sXG4gICAgRnVuY3Rpb25UeXBlIGV4dGVuZHMgKCguLi5Bcmd1bWVudFZlY3RvcjogSW5QYXJhbWV0ZXJzKSA9PiBJblJldHVyblR5cGUpPihcbiAgICBGdW5jdGlvbjogRnVuY3Rpb25UeXBlLFxuICAgIC4uLkFyZ3VtZW50VmVjdG9yOiBJblBhcmFtZXRlcnNcbik6IFByb21pc2U8SW5SZXR1cm5UeXBlPlxue1xuICAgIGlmIChJc0FzeW5jRnVuY3Rpb24oRnVuY3Rpb24pKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IEZ1bmN0aW9uKC4uLkFyZ3VtZW50VmVjdG9yKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKC4uLkFyZ3VtZW50VmVjdG9yKTtcbiAgICB9XG59XG5cbmV4cG9ydC8qKlxuICAgICAgICogVGhlIHtAbGluayBGQm94fSBvZiB6ZXJvIHdpZHRoLCBoZWlnaHQsIHBvc2l0aW9uZWQgYXQgdGhlIG9yaWdpbi5cbiAgICAgICAqL1xuY29uc3QgWmVyb0JveDogRkJveCA9XG4gICAge1xuICAgICAgICBIZWlnaHQ6IDAsXG4gICAgICAgIFdpZHRoOiAwLFxuICAgICAgICBYOiAwLFxuICAgICAgICBZOiAwXG4gICAgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIEV4dHJhY3RGcm9tUmVjb3JkQXJyYXk8XG4gICAgS2V5VHlwZSBleHRlbmRzIFByb3BlcnR5S2V5ID0gUHJvcGVydHlLZXksXG4gICAgUmVjb3JkVHlwZSBleHRlbmRzIFJlY29yZDxLZXlUeXBlLCB1bmtub3duPiA9IFJlY29yZDxLZXlUeXBlLCB1bmtub3duPj4oXG4gICAgS2V5OiBLZXlUeXBlLFxuICAgIEluQXJyYXk6IFRBcnJheTxSZWNvcmRUeXBlPlxuKTogVEFycmF5PFJlY29yZFR5cGVbS2V5VHlwZV0+XG57XG4gICAgcmV0dXJuIEluQXJyYXkubWFwKChSZWNvcmQ6IFJlY29yZFR5cGUpOiBSZWNvcmRUeXBlW0tleVR5cGVdID0+XG4gICAge1xuICAgICAgICByZXR1cm4gUmVjb3JkW0tleV07XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0QnlLZXk8XG4gICAgUmVjb3JkVHlwZSBleHRlbmRzIEZSZWNvcmQsXG4gICAgS2V5VHlwZSBleHRlbmRzIGtleW9mIFJlY29yZFR5cGVcbj4oXG4gICAgS2V5OiBLZXlUeXBlXG4pOiBURnVuY3Rpb248WyBSZWNvcmRUeXBlIF0sIFJlY29yZFR5cGVbS2V5VHlwZV0+XG57XG4gICAgcmV0dXJuIChSZWNvcmQ6IFJlY29yZFR5cGUpOiBSZWNvcmRUeXBlW0tleVR5cGVdID0+XG4gICAge1xuICAgICAgICByZXR1cm4gUmVjb3JkW0tleV07XG4gICAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIERlbGF5KER1cmF0aW9uOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+XG57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChSZXNvbHZlOiBUUmVzb2x2ZUZ1bmN0aW9uPHZvaWQ+LCBfUmVqZWN0OiBGUmVqZWN0RnVuY3Rpb24pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBzZXRUaW1lb3V0KFJlc29sdmUsIER1cmF0aW9uKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFJldHJ5VW50aWxGdWxmaWxsZWQ8VHlwZT4oXG4gICAgSW46ICgoKSA9PiBQcm9taXNlPFR5cGU+KSxcbiAgICBOdW1UcmllczogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICAgIER1cmF0aW9uVG9Ucnk6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuKTogUHJvbWlzZTxUeXBlIHwgdW5kZWZpbmVkPlxue1xuICAgIGxldCBTdGFydFRpbWU6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGxldCBMYXN0Q29tcGxldGlvblRpbWU6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgTnVtQXR0ZW1wdHM6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdCBIYXNFeGNlZWRlZExpbWl0cyA9ICgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBjb25zdCBFeGNlZWRlZE51bUF0dGVtcHRzOiBib29sZWFuID0gKE51bVRyaWVzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICA/IE51bUF0dGVtcHRzID09PSBOdW1Ucmllc1xuICAgICAgICAgICAgOiBmYWxzZTtcblxuICAgICAgICBjb25zdCBBcmVEdXJhdGlvblZhcmlhYmxlc0luaXRpYWxpemVkOiBib29sZWFuID0gKFxuICAgICAgICAgICAgRHVyYXRpb25Ub1RyeSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBMYXN0Q29tcGxldGlvblRpbWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgU3RhcnRUaW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoU3RhcnRUaW1lICE9PSB1bmRlZmluZWQgJiYgTGFzdENvbXBsZXRpb25UaW1lICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFN0YXJ0VGltZSA9IExhc3RDb21wbGV0aW9uVGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEV4Y2VlZGVkRHVyYXRpb25Ub1RyeTogYm9vbGVhbiA9IEFyZUR1cmF0aW9uVmFyaWFibGVzSW5pdGlhbGl6ZWRcbiAgICAgICAgICAgID8gKChMYXN0Q29tcGxldGlvblRpbWUgYXMgbnVtYmVyKSAtIChTdGFydFRpbWUgYXMgbnVtYmVyKSkgPj0gKER1cmF0aW9uVG9UcnkgYXMgbnVtYmVyKVxuICAgICAgICAgICAgOiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gRXhjZWVkZWROdW1BdHRlbXB0cyB8fCBFeGNlZWRlZER1cmF0aW9uVG9Ucnk7XG4gICAgfTtcblxuICAgIHdoaWxlIChIYXNFeGNlZWRlZExpbWl0cygpKVxuICAgIHtcbiAgICAgICAgdHJ5XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IE91dDogVHlwZSA9IGF3YWl0IEluKCk7XG4gICAgICAgICAgICByZXR1cm4gT3V0O1xuICAgICAgICB9XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgICAgY2F0Y2ggKF9FcnJvcjogdW5rbm93bilcbiAgICAgICAge1xuICAgICAgICAgICAgTGFzdENvbXBsZXRpb25UaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoTnVtVHJpZXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOdW1BdHRlbXB0cysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG4iLCIvKipcbiAqIEBmaWxlICAgICAgaW5kZXgudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9GdW5jdGlvbmFsLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9VdGlsaXR5XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9VdGlsaXR5LlR5cGVzXCI7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgaW5kZXgudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9FdmVudFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vS2V5Ym9hcmRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Mb2cuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TaGFyZWQuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1N0b3JlXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TdG9yZS5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vVHJlZS5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vVG9rZW5zXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9VdGlsaXR5XCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=