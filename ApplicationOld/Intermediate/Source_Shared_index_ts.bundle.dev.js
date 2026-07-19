"use strict";
exports.id = "Source_Shared_index_ts";
exports.ids = ["Source_Shared_index_ts"];
exports.modules = {

/***/ "./Source/Renderer/Log.ts"
/*!********************************!*\
  !*** ./Source/Renderer/Log.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
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

/***/ "./Source/Shared/Event/Common.Types.ts"
/*!*********************************************!*\
  !*** ./Source/Shared/Event/Common.Types.ts ***!
  \*********************************************/
(__unused_webpack_module, exports) {


/* File:      Common.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Event.Types.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Event/Event.Types.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;
;


/***/ },

/***/ "./Source/Shared/Event/Event.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Event/Event.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MakeTagBackend = exports.MakeTagFrontend = exports.Tag = exports.GetUntagged = exports.IsTagged = void 0;
const IsTagged = (Channel) => {
    const Split = Channel.split("-");
    if (Split.length === 2) {
        const Tag = Split[0] || "";
        const ChannelName = Split[1] || "";
        return /\d/.test(Tag) && !(/\d/.test(ChannelName));
    }
    else {
        return false;
    }
};
exports.IsTagged = IsTagged;
const GetUntagged = (Channel) => {
    if (typeof Channel === "string") {
        if ((0, exports.IsTagged)(Channel)) {
            return Channel.split("-")[1] || "";
        }
        else {
            return Channel;
        }
    }
    else {
        return "";
    }
};
exports.GetUntagged = GetUntagged;
const Tag = (WindowId, Channel) => {
    return `${WindowId}-${Channel}`;
};
exports.Tag = Tag;
const MakeTagFrontend = (Id) => {
    return (Channel) => {
        if (Id === undefined) {
            return undefined;
        }
        else {
            return `${Id}-${Channel}`;
        }
    };
};
exports.MakeTagFrontend = MakeTagFrontend;
const MakeTagBackend = (Id) => {
    return (Channel) => {
        if (Id === undefined) {
            return undefined;
        }
        else {
            return `${Id}-${Channel}`;
        }
    };
};
exports.MakeTagBackend = MakeTagBackend;


/***/ },

/***/ "./Source/Shared/Event/EventBase.Types.ts"
/*!************************************************!*\
  !*** ./Source/Shared/Event/EventBase.Types.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/EventUtility.Types.ts"
/*!***************************************************!*\
  !*** ./Source/Shared/Event/EventUtility.Types.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


/* File:      EventUtility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/Focus.Types.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Event/Focus.Types.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/* File:      Transactions.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
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


/* File:      InsertEvent.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/Move.Types.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Event/Move.Types.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/* File:      Move.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Navigate.Types.ts"
/*!***********************************************!*\
  !*** ./Source/Shared/Event/Navigate.Types.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


/* File:      Navigate.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Settings.Types.ts"
/*!***********************************************!*\
  !*** ./Source/Shared/Event/Settings.Types.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Tile.Types.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Event/Tile.Types.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/* File:      Tile.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/index.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Event/index.ts ***!
  \**************************************/
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
__exportStar(__webpack_require__(/*! ./Event */ "./Source/Shared/Event/Event.ts"), exports);
__exportStar(__webpack_require__(/*! ./Event.Types */ "./Source/Shared/Event/Event.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./EventBase.Types */ "./Source/Shared/Event/EventBase.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./EventUtility.Types */ "./Source/Shared/Event/EventUtility.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Common.Types */ "./Source/Shared/Event/Common.Types.ts"), exports);
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


/* File:      Keyboard.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Keyboard.ts"
/*!***********************************!*\
  !*** ./Source/Shared/Keyboard.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {


/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsVirtualKey = exports.VirtualKeys = exports.Vk = exports.GetKeyName = exports.IsKeyId = exports.KeyIds = exports.KeyIdsById = void 0;
/* eslint-disable sort-keys */
/** Developer-friendly names of key codes. */
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
const IsKeyId = (In) => {
    return exports.KeyIds.includes(In);
};
exports.IsKeyId = IsKeyId;
const GetKeyName = (VkCode) => {
    return exports.KeyIdsById[VkCode];
};
exports.GetKeyName = GetKeyName;
/** Developer-friendly names of key codes. */
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
/** Is the `KeyCode` a VK Code **that this app uses?** */
const IsVirtualKey = (KeyCode) => {
    return exports.VirtualKeys.includes(KeyCode);
};
exports.IsVirtualKey = IsVirtualKey;


/***/ },

/***/ "./Source/Shared/Log.Types.ts"
/*!************************************!*\
  !*** ./Source/Shared/Log.Types.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Log.ts"
/*!******************************!*\
  !*** ./Source/Shared/Log.ts ***!
  \******************************/
(__unused_webpack_module, exports) {


/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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


/* File:      Keybind.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Settings/Keybind.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Settings/Keybind.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/* File:      Keybind.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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


/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExternalSettings = void 0;
/**
 * Some settings regard state that is outside of SorrellWm,
 * for example, for the `RunOnStartup` setting to be honored,
 * a task must be registered via the Task Scheduler.  If this
 * fails, then this external state (*i.e.*, the Task Scheduler)
 * is inconsistent with the value of the setting `RunOnStartup`
 * in SorrellWm.
 */
/* eslint-disable-next-line @typescript-eslint/typedef */
exports.ExternalSettings = ["RunOnStartup"];


/***/ },

/***/ "./Source/Shared/Settings/Settings.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Settings/Settings.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultSettings = void 0;
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


/* File:      Shared.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Store.Types.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Store.Types.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


/* File:      Store.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Store.ts"
/*!********************************!*\
  !*** ./Source/Shared/Store.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


/* File:      Store.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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


/* File:      Tokens.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
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


/* File:      Tree.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Array.ts"
/*!****************************************!*\
  !*** ./Source/Shared/Utility/Array.ts ***!
  \****************************************/
(__unused_webpack_module, exports) {


/* File:      Array.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Functional.Types.ts"
/*!***************************************************!*\
  !*** ./Source/Shared/Utility/Functional.Types.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


/* File:      Functional.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Utility.Types.ts"
/*!************************************************!*\
  !*** ./Source/Shared/Utility/Utility.Types.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Utility.ts"
/*!******************************************!*\
  !*** ./Source/Shared/Utility/Utility.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlatMapRecord = exports.MapRecord = exports.Identity = exports.MakeRef = exports.GetPropertyFromPath = exports.SetPropertyFromPath = exports.RetryUntilFulfilled = exports.Delay = exports.GetByKey = exports.ExtractFromRecordArray = exports.ZeroBox = exports.CallMaybeAsync = exports.GetEmptyWindow = exports.GetEmptyMonitor = void 0;
exports.IsAsyncFunction = IsAsyncFunction;
const Log_1 = __webpack_require__(/*! @/Log */ "./Source/Renderer/Log.ts");
const Log = (0, Log_1.GetLogger)("Utility");
const GetEmptyMonitor = () => {
    return {
        Handle: -1
    };
};
exports.GetEmptyMonitor = GetEmptyMonitor;
const GetEmptyWindow = () => {
    return {
        Handle: ""
    };
};
exports.GetEmptyWindow = GetEmptyWindow;
/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @stylistic/brace-style */
const AsyncFunction = (async function () { }).constructor;
function IsAsyncFunction(Value) {
    return typeof Value === "function" && Value.constructor === AsyncFunction;
}
const CallMaybeAsync = async (Function, ...ArgumentVector) => {
    if (IsAsyncFunction(Function)) {
        return await Function(...ArgumentVector);
    }
    else {
        return Function(...ArgumentVector);
    }
};
exports.CallMaybeAsync = CallMaybeAsync;
exports.ZeroBox = {
    Height: 0,
    Width: 0,
    X: 0,
    Y: 0
};
const ExtractFromRecordArray = (Key, InArray) => {
    return InArray.map((Record) => {
        return Record[Key];
    });
};
exports.ExtractFromRecordArray = ExtractFromRecordArray;
const GetByKey = (Key) => {
    return (Record) => {
        return Record[Key];
    };
};
exports.GetByKey = GetByKey;
const Delay = async (Duration) => {
    return new Promise((Resolve, _Reject) => {
        setTimeout(Resolve, Duration);
    });
};
exports.Delay = Delay;
const RetryUntilFulfilled = async (In, NumTries = undefined, DurationToTry = undefined) => {
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
};
exports.RetryUntilFulfilled = RetryUntilFulfilled;
const SetPropertyFromPath = (ObjectRef, Path, Value) => {
    if (Array.isArray(Path)) {
        throw new Error("SetPropertyFromPath does not support Array-based paths yet.");
    }
    const PathSplit = Path.split(".");
    const Last = PathSplit.pop();
    if (Last === undefined) {
        return;
    }
    if (PathSplit.length === 0) {
        if (!Array.isArray(Path)) {
            (ObjectRef.Ref[Path]) = Value;
        }
    }
    const Recurrence = (In) => {
        const NextPropertyNameBase = PathSplit.shift();
        Log("NextPropertyNameBase", NextPropertyNameBase);
        if (NextPropertyNameBase !== undefined) {
            const NextPropertyName = isNaN(parseInt(NextPropertyNameBase))
                ? NextPropertyNameBase
                : parseInt(NextPropertyNameBase);
            Log("NextPropertyName", NextPropertyName);
            const Out = (0, exports.MakeRef)();
            Out.Ref = In.Ref[NextPropertyName];
            return Recurrence(Out);
        }
        else {
            return In;
        }
    };
    const PropertyRef = Recurrence(ObjectRef);
    const LastTyped = isNaN(parseInt(Last))
        ? Last
        : parseInt(Last);
    PropertyRef.Ref[LastTyped] = Value;
};
exports.SetPropertyFromPath = SetPropertyFromPath;
const GetPropertyFromPath = (Record, Path) => {
    if (Array.isArray(Path)) {
        throw new Error("SetPropertyFromPath does not support Array-based paths yet.");
    }
    const PathSplit = Path.split(".");
    const Recurrence = (In, Index = 0) => {
        const Key = isNaN(parseInt(PathSplit[Index] || ""))
            ? PathSplit[Index]
            : parseInt(PathSplit[Index] || "");
        if (Key !== undefined) {
            const Next = In[Key];
            if (Index !== PathSplit.length - 1) {
                return Recurrence(Next, Index + 1);
            }
            else {
                return Next;
            }
        }
        else {
            return undefined;
        }
    };
    return Recurrence(Record);
};
exports.GetPropertyFromPath = GetPropertyFromPath;
const MakeRef = () => {
    return {
        Ref: undefined
    };
};
exports.MakeRef = MakeRef;
const Identity = (...Arguments) => Arguments;
exports.Identity = Identity;
const MapRecord = (In, Function) => {
    return Object.keys(In).map((InKey, Index) => {
        const Key = InKey;
        return Function(Key, In[Key], Index);
    });
};
exports.MapRecord = MapRecord;
const FlatMapRecord = (In, Function) => {
    return Object.keys(In).flatMap((InKey, Index) => {
        const Key = InKey;
        const Transform = Function(Key, In[Key], Index);
        return Array.isArray(Transform)
            ? Transform
            : [Transform];
    });
};
exports.FlatMapRecord = FlatMapRecord;


/***/ },

/***/ "./Source/Shared/Utility/index.ts"
/*!****************************************!*\
  !*** ./Source/Shared/Utility/index.ts ***!
  \****************************************/
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
__exportStar(__webpack_require__(/*! ./Array */ "./Source/Shared/Utility/Array.ts"), exports);
__exportStar(__webpack_require__(/*! ./Functional.Types */ "./Source/Shared/Utility/Functional.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility */ "./Source/Shared/Utility/Utility.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility.Types */ "./Source/Shared/Utility/Utility.Types.ts"), exports);


/***/ },

/***/ "./Source/Shared/index.ts"
/*!********************************!*\
  !*** ./Source/Shared/index.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX1NoYXJlZF9pbmRleF90cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7OztBQUlILGlGQUE2QztBQUV0QyxNQUFNLE9BQU8sR0FBRyxHQUFrQixFQUFFO0lBRXZDLE9BQU8sa0JBQVksQ0FBQztBQUN4QixDQUFDLENBQUM7QUFIVyxlQUFPLFdBR2xCO0FBRUYseUdBQXlHO0FBQ2xHLE1BQU0sU0FBUyxHQUFHLENBQUMsUUFBZ0IsRUFBVyxFQUFFO0lBRW5ELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxLQUFnQixFQUFnQixFQUFFO1FBRTFELE9BQU8sQ0FBQyxHQUFHLFVBQTJCLEVBQVEsRUFBRTtZQUU1QyxNQUFNLGtCQUFrQixHQUFvQixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBa0IsRUFBVyxFQUFFO2dCQUV2RixJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFDakMsQ0FBQztvQkFDRyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztxQkFFRCxDQUFDO29CQUNHLE9BQU8sU0FBUyxDQUFDO2dCQUNyQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BGLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFtQixrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxNQUFNLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0MsTUFBTSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV6QyxPQUFPLE1BQWlCLENBQUM7QUFDN0IsQ0FBQyxDQUFDO0FBNUJXLGlCQUFTLGFBNEJwQjs7Ozs7Ozs7Ozs7O0FDNUNGOzs7O0dBSUc7O0FBc05GLENBQUM7Ozs7Ozs7Ozs7OztBQzFORjs7OztHQUlHOztBQU15QyxDQUFDO0FBSUYsQ0FBQzs7Ozs7Ozs7Ozs7O0FDZDVDOzs7O0dBSUc7OztBQVlJLE1BQU0sUUFBUSxHQUFHLENBQUMsT0FBZSxFQUE2QixFQUFFO0lBRW5FLE1BQU0sS0FBSyxHQUFrQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQ3RCLENBQUM7UUFDRyxNQUFNLEdBQUcsR0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLE1BQU0sV0FBVyxHQUFXLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFM0MsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztTQUVELENBQUM7UUFDRyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBZFcsZ0JBQVEsWUFjbkI7QUFFSyxNQUFNLFdBQVcsR0FBRyxDQUFDLE9BQXdCLEVBQVUsRUFBRTtJQUU1RCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFDL0IsQ0FBQztRQUNHLElBQUksb0JBQVEsRUFBQyxPQUFPLENBQUMsRUFDckIsQ0FBQztZQUNHLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsQ0FBQzthQUVELENBQUM7WUFDRyxPQUFPLE9BQU8sQ0FBQztRQUNuQixDQUFDO0lBQ0wsQ0FBQztTQUVELENBQUM7UUFDRyxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7QUFDTCxDQUFDLENBQUM7QUFqQlcsbUJBQVcsZUFpQnRCO0FBRUssTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFnQixFQUFFLE9BQW9CLEVBQWtCLEVBQUU7SUFFMUUsT0FBTyxHQUFJLFFBQVMsSUFBSyxPQUFRLEVBQUUsQ0FBQztBQUN4QyxDQUFDLENBQUM7QUFIVyxXQUFHLE9BR2Q7QUFFSyxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQXNCLEVBQTBCLEVBQUU7SUFFOUUsT0FBTyxDQUFDLE9BQTRCLEVBQXNDLEVBQUU7UUFFeEUsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUNwQixDQUFDO1lBQ0csT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQzthQUVELENBQUM7WUFDRyxPQUFPLEdBQUksRUFBRyxJQUFLLE9BQVEsRUFBRSxDQUFDO1FBQ2xDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFiVyx1QkFBZSxtQkFhMUI7QUFFSyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQXNCLEVBQXlCLEVBQUU7SUFFNUUsT0FBTyxDQUFDLE9BQTJCLEVBQXFDLEVBQUU7UUFFdEUsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUNwQixDQUFDO1lBQ0csT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQzthQUVELENBQUM7WUFDRyxPQUFPLEdBQUksRUFBRyxJQUFLLE9BQVEsRUFBRSxDQUFDO1FBQ2xDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFiVyxzQkFBYyxrQkFhekI7Ozs7Ozs7Ozs7OztBQ3BGRjs7OztHQUlHOzs7Ozs7Ozs7Ozs7O0FDSkg7Ozs7R0FJRzs7Ozs7Ozs7Ozs7OztBQ0pIOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztBQ05IOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7QUNKSDs7OztHQUlHOztBQWdERixDQUFDOzs7Ozs7Ozs7Ozs7QUNwREY7Ozs7R0FJRzs7QUF3QkYsQ0FBQzs7Ozs7Ozs7Ozs7O0FDNUJGOzs7O0dBSUc7O0FBK0NGLENBQUM7Ozs7Ozs7Ozs7OztBQ25ERjs7OztHQUlHOztBQWtCRixDQUFDOzs7Ozs7Ozs7Ozs7QUN0QkY7Ozs7R0FJRzs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDRGQUF3QjtBQUN4Qix3R0FBOEI7QUFDOUIsZ0hBQWtDO0FBQ2xDLHNIQUFxQztBQUVyQywwR0FBK0I7QUFDL0Isd0dBQThCO0FBQzlCLDBHQUErQjtBQUMvQixzR0FBNkI7QUFDN0IsOEdBQWlDO0FBQ2pDLDhHQUFpQztBQUNqQyxzR0FBNkI7Ozs7Ozs7Ozs7OztBQ2pCN0I7Ozs7R0FJRzs7Ozs7Ozs7Ozs7OztBQ0pIOzs7O0dBSUc7OztBQUlILDhCQUE4QjtBQUU5Qiw2Q0FBNkM7QUFDaEMsa0JBQVUsR0FDdkI7SUFDSSxJQUFJLEVBQUUsU0FBUztJQUNmLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsY0FBYztJQUNwQixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxVQUFVO0lBQ2hCLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLFdBQVc7SUFD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Q1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixZQUFZLEVBQUUsSUFBSTtJQUNsQixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFFBQVEsRUFBRSxJQUFJO0lBQ2QsR0FBRyxFQUFFLElBQUk7SUFDVCxRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsSUFBSTtJQUNaLEtBQUssRUFBRSxJQUFJO0lBQ1gsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsV0FBVyxFQUFFLElBQUk7SUFDakIsY0FBYyxFQUFFLElBQUk7SUFDcEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsV0FBVyxFQUFFLElBQUk7SUFDakIsYUFBYSxFQUFFLElBQUk7SUFDbkIsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixZQUFZLEVBQUUsSUFBSTtJQUNsQixTQUFTLEVBQUUsSUFBSTtJQUNmLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFNBQVMsRUFBRSxJQUFJO0lBQ2YsY0FBYyxFQUFFLElBQUk7SUFDcEIsU0FBUyxFQUFFLElBQUk7SUFDZixXQUFXLEVBQUUsSUFBSTtJQUNqQixtQkFBbUIsRUFBRSxJQUFJO0lBQ3pCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtDQUNILENBQUM7QUFFRSxtQkFBVyxHQUN4QjtJQUNJLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0os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RkFBNEI7QUFDNUIsa0dBQTJCO0FBQzNCLG9HQUErQjtBQUMvQixzRkFBd0I7QUFDeEIsa0dBQThCO0FBQzlCLGdHQUE2QjtBQUM3Qix3RkFBeUI7QUFDekIsZ0dBQTBCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1JlbmRlcmVyL0xvZy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L0NvbW1vbi5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L0V2ZW50LlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvRXZlbnQvRXZlbnQudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9FdmVudEJhc2UuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9FdmVudFV0aWxpdHkuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9Gb2N1cy5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L0luc2VydC5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L01vdmUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9OYXZpZ2F0ZS5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L1NldHRpbmdzLlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvRXZlbnQvVGlsZS5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L2luZGV4LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvS2V5Ym9hcmQuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9LZXlib2FyZC50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0xvZy5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0xvZy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1NldHRpbmdzL0tleWJpbmQuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9TZXR0aW5ncy9LZXliaW5kLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvU2V0dGluZ3MvU2V0dGluZ3MuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9TZXR0aW5ncy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1NldHRpbmdzL2luZGV4LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvU2hhcmVkLlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvU3RvcmUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9TdG9yZS50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1Rva2Vucy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1RyZWUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9VdGlsaXR5L0FycmF5LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9GdW5jdGlvbmFsLlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9VdGlsaXR5LlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9VdGlsaXR5LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgICAgTG9nLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGR2V0VGltZVRva2VuLCBGTG9nRnVuY3Rpb24sIEZMb2dnZXIsIEZMb2dnZXJJbnRlcmltIH0gZnJvbSBcIi4uL1NoYXJlZC9Mb2cuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkxvZ0xldmVsIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHsgR2V0VGltZVRva2VuIH0gZnJvbSBcIi4uL1NoYXJlZC9Mb2dcIjtcblxuZXhwb3J0IGNvbnN0IEdldFRpbWUgPSAoKTogRkdldFRpbWVUb2tlbiA9Plxue1xuICAgIHJldHVybiBHZXRUaW1lVG9rZW47XG59O1xuXG4vKiogVXNlIHRoaXMgdG8gY3JlYXRlIGEgbG9nZ2VyIHdpdGhpbiBhIGdpdmVuIG1vZHVsZSBzbyB0aGF0IHRoZSBsb2cgY2F0ZWdvcnkgaXMgc2V0IGZvciB0aGF0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBHZXRMb2dnZXIgPSAoQ2F0ZWdvcnk6IHN0cmluZyk6IEZMb2dnZXIgPT5cbntcbiAgICBjb25zdCBNYWtlTG9nZ2VySW50ZXJuYWwgPSAoTGV2ZWw6IEZMb2dMZXZlbCk6IEZMb2dGdW5jdGlvbiA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuICguLi5TdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IEZpbHRlcmVkU3RhdGVtZW50czogVEFycmF5PHVua25vd24+ID0gU3RhdGVtZW50cy5tYXAoKFN0YXRlbWVudDogdW5rbm93bik6IHVua25vd24gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFN0YXRlbWVudCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShTdGF0ZW1lbnQsIG51bGwsIDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3aW5kb3cuZWxlY3Ryb24uaXBjUmVuZGVyZXIuU2VuZChcIkxvZ1wiLCBDYXRlZ29yeSwgTGV2ZWwsIC4uLkZpbHRlcmVkU3RhdGVtZW50cyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IExvZ2dlcjogRkxvZ2dlckludGVyaW0gPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJOb3JtYWxcIik7XG4gICAgTG9nZ2VyLkVycm9yID0gTWFrZUxvZ2dlckludGVybmFsKFwiRXJyb3JcIik7XG4gICAgTG9nZ2VyLlZlcmJvc2UgPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJWZXJib3NlXCIpO1xuICAgIExvZ2dlci5XYXJuID0gTWFrZUxvZ2dlckludGVybmFsKFwiV2FyblwiKTtcblxuICAgIHJldHVybiBMb2dnZXIgYXMgRkxvZ2dlcjtcbn07XG4iLCIvKiBGaWxlOiAgICAgIENvbW1vbi5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkFubm90YXRlZFBhbmVsLCBGUGFuZWwgfSBmcm9tIFwiLi4vVHJlZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGSGV4Q29sb3IsIEhNb25pdG9yIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHR5cGUgeyBUSXBjQmFja2VuZEV2ZW50LCBUSXBjRnJvbnRlbmRFdmVudCB9IGZyb20gXCIuL0V2ZW50QmFzZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGRXh0ZXJuYWxXaW5kb3cgfSBmcm9tIFwiLi4vV2luZG93L0V4dGVybmFsV2luZG93LlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZGbG9hdGluZ1dpbmRvdyB9IGZyb20gXCIuLi9XaW5kb3cvRmxvYXRpbmdXaW5kb3cuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkluc2VydGFibGVXaW5kb3dEYXRhIH0gZnJvbSBcIi4vSW5zZXJ0LlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZTdG9yZSB9IGZyb20gXCIuLi9TdG9yZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZBY3RpdmF0ZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRlRlYXJEb3duRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGR2V0SWRFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRNb25pdG9yRnJvbUZvY3VzZWRXaW5kb3dFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJBY3RpdmVXaW5kb3dVbmRlZmluZWRcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRBbm5vdGF0ZWRQYW5lbHNFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRDdXJyZW50UGFuZWxFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRJc0xpZ2h0TW9kZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldFRoZW1lQ29sb3JFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRQYW5lbFNjcmVlbnNob3RzRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGR2V0SW5zZXJ0YWJsZVdpbmRvd0RhdGFFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZMb2dFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZNYXhpbWl6ZUZsb2F0aW5nV2luZG93RXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGTWluaW1pemVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRk5vdGlmeVJlYWR5RXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGUmVhZHlGb3JSb3V0ZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRlJlc3RvcmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRlJlcXVlc3RUZWFyRG93bkVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldEV4dGVybmFsV2luZG93U3RhdGVFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRGbG9hdGluZ1dpbmRvd1N0YXRlRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGR2V0U3RvcmVFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZVcGRhdGVFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZTZXRTdG9yZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRlJlcXVlc3RSZXN0YXJ0RXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGQWxsb3dBY3RpdmF0aW9uRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGUHJldmVudEFjdGl2YXRpb25FcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRJc0VsZXZhdGVkRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGT3BlbldlYlBhZ2VFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9FdmVudC5UeXBlc1wiXG57XG4gICAgaW50ZXJmYWNlIElGcm9udGVuZEV2ZW50UmVnaXN0cmFyXG4gICAge1xuICAgICAgICBHZXRJZDogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB7IElkOiBudW1iZXIgfCB1bmRlZmluZWQ7IH0sXG4gICAgICAgICAgICBGR2V0SWRFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0TW9uaXRvckZyb21Gb2N1c2VkV2luZG93OiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHsgTW9uaXRvcjogSE1vbml0b3I7IH0sXG4gICAgICAgICAgICBGR2V0TW9uaXRvckZyb21Gb2N1c2VkV2luZG93RXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldEFubm90YXRlZFBhbmVsczogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB7IEFubm90YXRlZFBhbmVsczogVEFycmF5PEZBbm5vdGF0ZWRQYW5lbD4gfSxcbiAgICAgICAgICAgIEZHZXRBbm5vdGF0ZWRQYW5lbHNFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0Q3VycmVudFBhbmVsOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZQYW5lbCxcbiAgICAgICAgICAgIEZHZXRDdXJyZW50UGFuZWxFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0SXNBY3RpdmVXaW5kb3dUaWxlZDogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB7IElzVGlsZWQ6IGJvb2xlYW47IH0sXG4gICAgICAgICAgICBGR2V0Q3VycmVudFBhbmVsRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldElzTGlnaHRNb2RlOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHsgSXNMaWdodE1vZGU6IGJvb2xlYW47IH0sXG4gICAgICAgICAgICBGR2V0SXNMaWdodE1vZGVFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgVXBkYXRlOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZVcGRhdGVFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgT3BlbldlYlBhZ2U6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgc3RyaW5nLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRk9wZW5XZWJQYWdlRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldElzRWxldmF0ZWQ6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgeyBJc0VsZXZhdGVkOiBib29sZWFuOyB9LFxuICAgICAgICAgICAgRkdldElzRWxldmF0ZWRFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgQWxsb3dBY3RpdmF0aW9uOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZBbGxvd0FjdGl2YXRpb25FcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgUHJldmVudEFjdGl2YXRpb246IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlByZXZlbnRBY3RpdmF0aW9uRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldFN0b3JlOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZTdG9yZSxcbiAgICAgICAgICAgIEZHZXRTdG9yZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBTZXRTdG9yZTogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBGU3RvcmUsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGU2V0U3RvcmVFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0VGhlbWVDb2xvcjogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB7IFRoZW1lQ29sb3I6IEZIZXhDb2xvcjsgfSxcbiAgICAgICAgICAgIEZHZXRUaGVtZUNvbG9yRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldFBhbmVsU2NyZWVuc2hvdHM6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgeyBTY3JlZW5zaG90czogVEFycmF5PHN0cmluZz47IH0sXG4gICAgICAgICAgICBGR2V0UGFuZWxTY3JlZW5zaG90c0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRFeHRlcm5hbFdpbmRvd1N0YXRlOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZFeHRlcm5hbFdpbmRvdyxcbiAgICAgICAgICAgIEZHZXRFeHRlcm5hbFdpbmRvd1N0YXRlRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldEZsb2F0aW5nV2luZG93U3RhdGU6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRkZsb2F0aW5nV2luZG93LFxuICAgICAgICAgICAgRkdldEZsb2F0aW5nV2luZG93U3RhdGVFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0SW5zZXJ0YWJsZVdpbmRvd0RhdGE6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgeyBJbnNlcnRhYmxlV2luZG93RGF0YTogVEFycmF5PEZJbnNlcnRhYmxlV2luZG93RGF0YT4gfSxcbiAgICAgICAgICAgIEZHZXRJbnNlcnRhYmxlV2luZG93RGF0YUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBMb2c6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgVEFycmF5PHVua25vd24+LFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRkxvZ0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBNYXhpbWl6ZUZsb2F0aW5nV2luZG93OiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZNYXhpbWl6ZUZsb2F0aW5nV2luZG93RXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIE1pbmltaXplRmxvYXRpbmdXaW5kb3c6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRk1pbmltaXplRmxvYXRpbmdXaW5kb3dFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgTm90aWZ5UmVhZHk6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRk5vdGlmeVJlYWR5RXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIFJlYWR5Rm9yUm91dGU6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlJlYWR5Rm9yUm91dGVFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgUmVzdG9yZUZsb2F0aW5nV2luZG93OiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZSZXN0b3JlRmxvYXRpbmdXaW5kb3dFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgUmVxdWVzdFJlc3RhcnQ6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlJlcXVlc3RSZXN0YXJ0RXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIFJlcXVlc3RUZWFyRG93bjogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGUmVxdWVzdFRlYXJEb3duRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgfVxuXG4gICAgaW50ZXJmYWNlIElCYWNrZW5kRXZlbnRSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIEFjdGl2YXRlOiBUSXBjQmFja2VuZEV2ZW50PFxuICAgICAgICAgICAgYm9vbGVhbixcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZBY3RpdmF0ZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBUZWFyRG93bjogVElwY0JhY2tlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZUZWFyRG93bkVycm9yQ29kZVxuICAgICAgICA+O1xuICAgIH1cbn07XG4iLCIvKiBGaWxlOiAgICAgIEV2ZW50LlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBUSXBjRXZlbnRzQmFzZSB9IGZyb20gXCIuL0V2ZW50QmFzZS5UeXBlc1wiO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL2JyYWNlLXN0eWxlLCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktb2JqZWN0LXR5cGUgKi9cblxuZXhwb3J0IGludGVyZmFjZSBJRnJvbnRlbmRFdmVudFJlZ2lzdHJhciB7IH07XG5cbmV4cG9ydCB0eXBlIEZJcGNGcm9udGVuZEV2ZW50cyA9IFRJcGNFdmVudHNCYXNlPElGcm9udGVuZEV2ZW50UmVnaXN0cmFyPjtcblxuZXhwb3J0IGludGVyZmFjZSBJQmFja2VuZEV2ZW50UmVnaXN0cmFyIHsgfTtcblxuZXhwb3J0IHR5cGUgRklwY0JhY2tlbmRFdmVudHMgPSBUSXBjRXZlbnRzQmFzZTxJQmFja2VuZEV2ZW50UmVnaXN0cmFyPjtcbiIsIi8qIEZpbGU6ICAgICAgRXZlbnQudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gICAgRkJhY2tlbmRDaGFubmVsVGFnZ2VkLFxuICAgIEZCYWNrZW5kQ2hhbm5lbFRhZ2dlcixcbiAgICBGQ2hhbm5lbFRhZ2dlZCxcbiAgICBGRnJvbnRlbmRDaGFubmVsVGFnZ2VkLFxuICAgIEZGcm9udGVuZENoYW5uZWxUYWdnZXIsXG4gICAgRklwY0JhY2tlbmRDaGFubmVsLFxuICAgIEZJcGNDaGFubmVsLFxuICAgIEZJcGNGcm9udGVuZENoYW5uZWwgfSBmcm9tIFwiLi9FdmVudFV0aWxpdHkuVHlwZXNcIjtcblxuZXhwb3J0IGNvbnN0IElzVGFnZ2VkID0gKENoYW5uZWw6IHN0cmluZyk6IENoYW5uZWwgaXMgRkNoYW5uZWxUYWdnZWQgPT5cbntcbiAgICBjb25zdCBTcGxpdDogQXJyYXk8c3RyaW5nPiA9IENoYW5uZWwuc3BsaXQoXCItXCIpO1xuICAgIGlmIChTcGxpdC5sZW5ndGggPT09IDIpXG4gICAge1xuICAgICAgICBjb25zdCBUYWc6IHN0cmluZyA9IFNwbGl0WzBdIHx8IFwiXCI7XG4gICAgICAgIGNvbnN0IENoYW5uZWxOYW1lOiBzdHJpbmcgPSBTcGxpdFsxXSB8fCBcIlwiO1xuXG4gICAgICAgIHJldHVybiAvXFxkLy50ZXN0KFRhZykgJiYgISgvXFxkLy50ZXN0KENoYW5uZWxOYW1lKSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgR2V0VW50YWdnZWQgPSAoQ2hhbm5lbDogc3RyaW5nIHwgc3ltYm9sKTogc3RyaW5nID0+XG57XG4gICAgaWYgKHR5cGVvZiBDaGFubmVsID09PSBcInN0cmluZ1wiKVxuICAgIHtcbiAgICAgICAgaWYgKElzVGFnZ2VkKENoYW5uZWwpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gQ2hhbm5lbC5zcGxpdChcIi1cIilbMV0gfHwgXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBDaGFubmVsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBUYWcgPSAoV2luZG93SWQ6IG51bWJlciwgQ2hhbm5lbDogRklwY0NoYW5uZWwpOiBGQ2hhbm5lbFRhZ2dlZCA9Plxue1xuICAgIHJldHVybiBgJHsgV2luZG93SWQgfS0keyBDaGFubmVsIH1gO1xufTtcblxuZXhwb3J0IGNvbnN0IE1ha2VUYWdGcm9udGVuZCA9IChJZDogbnVtYmVyIHwgdW5kZWZpbmVkKTogRkZyb250ZW5kQ2hhbm5lbFRhZ2dlciA9Plxue1xuICAgIHJldHVybiAoQ2hhbm5lbDogRklwY0Zyb250ZW5kQ2hhbm5lbCk6IEZGcm9udGVuZENoYW5uZWxUYWdnZWQgfCB1bmRlZmluZWQgPT5cbiAgICB7XG4gICAgICAgIGlmIChJZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGAkeyBJZCB9LSR7IENoYW5uZWwgfWA7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IE1ha2VUYWdCYWNrZW5kID0gKElkOiBudW1iZXIgfCB1bmRlZmluZWQpOiBGQmFja2VuZENoYW5uZWxUYWdnZXIgPT5cbntcbiAgICByZXR1cm4gKENoYW5uZWw6IEZJcGNCYWNrZW5kQ2hhbm5lbCk6IEZCYWNrZW5kQ2hhbm5lbFRhZ2dlZCB8IHVuZGVmaW5lZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKElkID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gYCR7IElkIH0tJHsgQ2hhbm5lbCB9YDtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiLyogRmlsZTogICAgICBFdmVudC5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRk5vdEZ1bmN0aW9uIH0gZnJvbSBcIi4uLy4uL1NoYXJlZC9TaGFyZWQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRlVua25vd25FcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZJcGNFdmVudEluaXRpYXRvciA9XG4gICAgfCBcIkJhY2tlbmRcIlxuICAgIHwgXCJGcm9udGVuZFwiO1xuXG5leHBvcnQgdHlwZSBGUmljaFJlc3BvbnNlRGF0YSA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXG5leHBvcnQgdHlwZSBUUmljaFJlc3BvbnNlU3VjY2VzczxSZXNwb25zZURhdGEgZXh0ZW5kcyBGUmljaFJlc3BvbnNlRGF0YT4gPVxue1xuICAgIERhdGE6IFJlc3BvbnNlRGF0YTtcbiAgICBFcnJvcjogdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IHR5cGUgVFJpY2hSZXNwb25zZUZhaWx1cmU8RXJyb3JDb2RlIGV4dGVuZHMgRlVua25vd25FcnJvckNvZGU+ID1cbntcbiAgICBEYXRhOiB1bmRlZmluZWQ7XG4gICAgRXJyb3I6IEVycm9yQ29kZTtcbn07XG5cbmV4cG9ydCB0eXBlIFRSaWNoUmVzcG9uc2VEZWNsPFxuICAgIFJlc3BvbnNlUGF5bG9hZCBleHRlbmRzIEZSaWNoUmVzcG9uc2VEYXRhLFxuICAgIEVycm9yQ29kZSBleHRlbmRzIEZVbmtub3duRXJyb3JDb2RlXG4+ID1cbntcbiAgICBEYXRhOiBSZXNwb25zZVBheWxvYWQ7XG4gICAgRXJyb3I6IEVycm9yQ29kZTtcbn07XG5cbmV4cG9ydCB0eXBlIEZVbmtub3duUmljaFJlc3BvbnNlRGVjbCA9IFRSaWNoUmVzcG9uc2VEZWNsPEZSaWNoUmVzcG9uc2VEYXRhLCBGVW5rbm93bkVycm9yQ29kZT47XG5cbi8qKiBcIlJpY2hcIiByZWZlcnMgdG8gcmVzcG9uc2VzIHRoYXQgcmV0dXJuIGRhdGEgaWYgdGhlcmUgaXMgbm8gZXJyb3IuICovXG5leHBvcnQgdHlwZSBUUmljaFJlc3BvbnNlPFxuICAgIFJlc3BvbnNlUGF5bG9hZCBleHRlbmRzIEZSaWNoUmVzcG9uc2VEYXRhLFxuICAgIEVycm9yQ29kZSBleHRlbmRzIEZVbmtub3duRXJyb3JDb2RlXG4+ID1cbiAgICB8IFRSaWNoUmVzcG9uc2VTdWNjZXNzPFJlc3BvbnNlUGF5bG9hZD5cbiAgICB8IFRSaWNoUmVzcG9uc2VGYWlsdXJlPEVycm9yQ29kZT47XG5cbmV4cG9ydCB0eXBlIFRQb29yUmVzcG9uc2U8RXJyb3JDb2RlIGV4dGVuZHMgRlVua25vd25FcnJvckNvZGU+ID1cbntcbiAgICBEYXRhOiB1bmRlZmluZWQ7XG4gICAgRXJyb3I6IEVycm9yQ29kZSB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCB0eXBlIFRQb29yUmVzcG9uc2VEZWNsPEVycm9yQ29kZSBleHRlbmRzIEZVbmtub3duRXJyb3JDb2RlPiA9XG57XG4gICAgRXJyb3I6IEVycm9yQ29kZTtcbn07XG5cbmV4cG9ydCB0eXBlIEZOb1Jlc3BvbnNlRGF0YSA9IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgRlJlc3BvbnNlRGF0YSA9XG4gICAgfCBGTm9SZXNwb25zZURhdGFcbiAgICB8IEZSaWNoUmVzcG9uc2VEYXRhO1xuXG5leHBvcnQgdHlwZSBGVW5rbm93blJpY2hSZXNwb25zZURhdGEgPSBUUmljaFJlc3BvbnNlPEZSaWNoUmVzcG9uc2VEYXRhLCBGVW5rbm93bkVycm9yQ29kZT47XG5leHBvcnQgdHlwZSBGVW5rbm93blJpY2hSZXNwb25zZVN1Y2Nlc3MgPSBUUmljaFJlc3BvbnNlU3VjY2VzczxGUmljaFJlc3BvbnNlRGF0YT47XG5leHBvcnQgdHlwZSBGVW5rbm93blJpY2hSZXNwb25zZUZhaWx1cmUgPSBUUmljaFJlc3BvbnNlRmFpbHVyZTxGVW5rbm93bkVycm9yQ29kZT47XG5leHBvcnQgdHlwZSBGVW5rbm93blJpY2hSZXNwb25zZSA9XG4gICAgfCBGVW5rbm93blJpY2hSZXNwb25zZVN1Y2Nlc3NcbiAgICB8IEZVbmtub3duUmljaFJlc3BvbnNlRmFpbHVyZTtcblxuZXhwb3J0IHR5cGUgVFJlc3BvbnNlRGVjbDxcbiAgICBSZXNwb25zZVBheWxvYWQgZXh0ZW5kcyBGUmVzcG9uc2VEYXRhLFxuICAgIEVycm9yQ29kZSBleHRlbmRzIEZVbmtub3duRXJyb3JDb2RlXG4+ID1cbiAgICBSZXNwb25zZVBheWxvYWQgZXh0ZW5kcyBGUmljaFJlc3BvbnNlRGF0YVxuICAgICAgICA/IFRSaWNoUmVzcG9uc2VEZWNsPFJlc3BvbnNlUGF5bG9hZCwgRXJyb3JDb2RlPlxuICAgICAgICA6IFRQb29yUmVzcG9uc2VEZWNsPEVycm9yQ29kZT47XG5cbmV4cG9ydCB0eXBlIFRJcGNFdmVudDxcbiAgICBJbml0aWF0b3IgZXh0ZW5kcyBGSXBjRXZlbnRJbml0aWF0b3IsXG4gICAgUmVxdWVzdCBleHRlbmRzIEZOb3RGdW5jdGlvbixcbiAgICBSZXNwb25zZVBheWxvYWQgZXh0ZW5kcyBGUmVzcG9uc2VEYXRhLFxuICAgIEVycm9yU3RyaW5nIGV4dGVuZHMgc3RyaW5nXG4+ID1cbntcbiAgICBJbml0aWF0b3I6IEluaXRpYXRvcjtcbiAgICBSZXF1ZXN0OiBSZXF1ZXN0O1xuICAgIFJlc3BvbnNlOiBUUmVzcG9uc2VEZWNsPFJlc3BvbnNlUGF5bG9hZCwgRXJyb3JTdHJpbmc+O1xufTtcblxuZXhwb3J0IHR5cGUgRlVua25vd25SaWNoRXZlbnQgPSBUSXBjRXZlbnQ8XG4gICAgRklwY0V2ZW50SW5pdGlhdG9yLFxuICAgIEZOb3RGdW5jdGlvbixcbiAgICBGUmljaFJlc3BvbnNlRGF0YSxcbiAgICBGVW5rbm93bkVycm9yQ29kZVxuPjtcblxuZXhwb3J0IHR5cGUgRlVua25vd25Qb29yRXZlbnQgPSBUSXBjRXZlbnQ8XG4gICAgRklwY0V2ZW50SW5pdGlhdG9yLFxuICAgIEZOb3RGdW5jdGlvbixcbiAgICBGTm9SZXNwb25zZURhdGEsXG4gICAgRlVua25vd25FcnJvckNvZGVcbj47XG5cbmV4cG9ydCB0eXBlIEZVbmtub3duSXBjRXZlbnQgPVxuICAgIHwgRlVua25vd25SaWNoRXZlbnRcbiAgICB8IEZVbmtub3duUG9vckV2ZW50O1xuXG5leHBvcnQgdHlwZSBUSXBjRXZlbnRzQmFzZTxSZWdpc3RyYXJUeXBlID0gdW5rbm93bj4gPVxue1xuICAgIFsgS2V5IGluIGtleW9mIFJlZ2lzdHJhclR5cGUgYXMgUmVnaXN0cmFyVHlwZVtLZXldIGV4dGVuZHMgRlVua25vd25JcGNFdmVudCA/IEtleSA6IG5ldmVyIF06IFJlZ2lzdHJhclR5cGVbS2V5XTtcbn07XG5cbmV4cG9ydCB0eXBlIFRJcGNGcm9udGVuZEV2ZW50PFxuICAgIFJlcXVlc3QgZXh0ZW5kcyBGTm90RnVuY3Rpb24gPSBGTm90RnVuY3Rpb24sXG4gICAgUmVzcG9uc2UgZXh0ZW5kcyBGUmVzcG9uc2VEYXRhID0gRlJlc3BvbnNlRGF0YSxcbiAgICBFcnJvclN0cmluZyBleHRlbmRzIHN0cmluZyA9IHN0cmluZz4gPVxuICAgICAgICBUSXBjRXZlbnQ8XG4gICAgICAgICAgICBcIkZyb250ZW5kXCIsXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICBFcnJvclN0cmluZ1xuICAgICAgICA+O1xuXG5leHBvcnQgdHlwZSBUSXBjQmFja2VuZEV2ZW50PFxuICAgIFJlcXVlc3QgZXh0ZW5kcyBGTm90RnVuY3Rpb24sXG4gICAgUmVzcG9uc2UgZXh0ZW5kcyBGUmVzcG9uc2VEYXRhLFxuICAgIEVycm9yQ29kZSBleHRlbmRzIEZVbmtub3duRXJyb3JDb2RlPiA9XG4gICAgICAgIFRJcGNFdmVudDxcbiAgICAgICAgICAgIFwiQmFja2VuZFwiLFxuICAgICAgICAgICAgUmVxdWVzdCxcbiAgICAgICAgICAgIFJlc3BvbnNlLFxuICAgICAgICAgICAgRXJyb3JDb2RlXG4gICAgICAgID47XG4iLCIvKiBGaWxlOiAgICAgIEV2ZW50VXRpbGl0eS5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRklwY0JhY2tlbmRFdmVudHMsIEZJcGNGcm9udGVuZEV2ZW50cyB9IGZyb20gXCIuL0V2ZW50LlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgRlJpY2hSZXNwb25zZURhdGEsXG4gICAgRlVua25vd25JcGNFdmVudCxcbiAgICBGVW5rbm93blJpY2hSZXNwb25zZURlY2wsXG4gICAgVElwY0V2ZW50c0Jhc2UsXG4gICAgVFBvb3JSZXNwb25zZSxcbiAgICBUUG9vclJlc3BvbnNlRGVjbCxcbiAgICBUUmljaFJlc3BvbnNlLFxuICAgIFRSaWNoUmVzcG9uc2VEZWNsLFxuICAgIFRSaWNoUmVzcG9uc2VGYWlsdXJlLFxuICAgIFRSaWNoUmVzcG9uc2VTdWNjZXNzIH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZVbmtub3duRXJyb3JDb2RlIH0gZnJvbSBcIi4vRXJyb3JDb2Rlcy5UeXBlc1wiO1xuXG5leHBvcnQgdHlwZSBGSXBjQmFja2VuZENoYW5uZWwgPSBrZXlvZiBGSXBjQmFja2VuZEV2ZW50cztcblxuZXhwb3J0IHR5cGUgRklwY0V2ZW50cyA9IEZJcGNGcm9udGVuZEV2ZW50cyAmIEZJcGNCYWNrZW5kRXZlbnRzO1xuXG5leHBvcnQgdHlwZSBGSXBjQ2hhbm5lbCA9IGtleW9mIEZJcGNFdmVudHM7XG5cbmV4cG9ydCB0eXBlIEZJcGNGcm9udGVuZENoYW5uZWwgPSBrZXlvZiBGSXBjRnJvbnRlbmRFdmVudHM7XG5cbmV4cG9ydCB0eXBlIFRSZXF1ZXN0PFR5cGUgZXh0ZW5kcyBGSXBjQ2hhbm5lbD4gPSBGSXBjRXZlbnRzW1R5cGVdW1wiUmVxdWVzdFwiXTtcbmV4cG9ydCB0eXBlIFRSZXNwb25zZTxUeXBlIGV4dGVuZHMgRklwY0NoYW5uZWw+ID0gRklwY0V2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdO1xuXG4vKiogTWFwcyBldmVudHMgdGhhdCBkbyAqbm90KiBoYXZlIHJlc3BvbnNlcyB0byBgbmV2ZXJgLiAqL1xuZXhwb3J0IHR5cGUgVEV2ZW50SGFzUmVzcG9uc2U8VHlwZSBleHRlbmRzIEZVbmtub3duSXBjRXZlbnQ+ID0gXCJEYXRhXCIgZXh0ZW5kcyBrZXlvZiBUeXBlW1wiUmVzcG9uc2VcIl1cbiAgICA/IFR5cGVcbiAgICA6IG5ldmVyO1xuXG4vLyAvKiogRmlsdGVycyBvdXQgZXZlbnRzIHRoYXQgZG8gbm90IGhhdmUgYSByZXNwb25zZS4gKi9cbi8vIGV4cG9ydCB0eXBlIFRSaWNoRXZlbnRzPFR5cGUgZXh0ZW5kcyBUSXBjRXZlbnRzQmFzZT4gPVxuLy8ge1xuLy8gICAgIFsgS2V5IGluIGtleW9mIFQgYXMgdW5kZWZpbmVkIGV4dGVuZHMgVHlwZVtLZXldW1wiUmVzcG9uc2VcIl1bXCJEYXRhXCJdID8gS2V5IDogbmV2ZXIgXTogVHlwZVtLZXldO1xuLy8gfTtcblxuLy8gZXhwb3J0IHR5cGUgVFJpY2hFdmVudHM8VHlwZSBleHRlbmRzIFRJcGNFdmVudHNCYXNlPiA9XG4vLyB7XG4vLyAgICAgWyBLZXkgaW4ga2V5b2YgVCBhcyBcIkRhdGFcIiBleHRlbmRzIGtleW9mIFR5cGVbS2V5XVtcIlJlc3BvbnNlXCJdID8gS2V5IDogbmV2ZXIgXTogVHlwZVtLZXldO1xuLy8gfTtcblxuLy8gZXhwb3J0IHR5cGUgVFJpY2hFdmVudHM8VHlwZSBleHRlbmRzIFRJcGNFdmVudHNCYXNlPiA9XG4vLyB7XG4vLyAgICAgLyogZXNsaW50LWRpc2FibGUgQHN0eWxpc3RpYy9pbmRlbnQgKi9cbi8vICAgICBbXG4vLyAgICAgICAgIEtleSBpbiBrZXlvZiBUIGFzXG4vLyAgICAgICAgICAgICBcIkRhdGFcIiBleHRlbmRzIGtleW9mIFR5cGVbS2V5XVtcIlJlc3BvbnNlXCJdXG4vLyAgICAgICAgICAgICAgICAgPyAoIFsgVHlwZVtLZXldW1wiUmVzcG9uc2VcIl1bXCJEYXRhXCJdIF0gZXh0ZW5kcyBbIHVuZGVmaW5lZCBdID8gbmV2ZXIgOiBLZXkgKVxuLy8gICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICBdOiBUeXBlW0tleV07XG4vLyAgICAgLyogZXNsaW50LWVuYWJsZSBAc3R5bGlzdGljL2luZGVudCAqL1xuLy8gfTtcblxuaW50ZXJmYWNlIElIYXNSZXNwb25zZVxue1xuICAgIFJlc3BvbnNlOiB1bmtub3duO1xufVxuXG5leHBvcnQgdHlwZSBUUG9vckV2ZW50czxUeXBlIGV4dGVuZHMgVElwY0V2ZW50c0Jhc2U+ID1cbntcbiAgICBbIEtleSBpbiBrZXlvZiBUeXBlIGFzIFwiRGF0YVwiIGV4dGVuZHMga2V5b2YgRXh0cmFjdDxUeXBlW0tleV0sIElIYXNSZXNwb25zZT5bXCJSZXNwb25zZVwiXVxuICAgICAgICA/IG5ldmVyXG4gICAgICAgIDogS2V5XG4gICAgXTogVHlwZVtLZXldO1xufTtcblxuZXhwb3J0IHR5cGUgVFJpY2hFdmVudERlY2w8VHlwZSBleHRlbmRzIEZVbmtub3duSXBjRXZlbnQ+ID1cbiAgICBUeXBlW1wiUmVzcG9uc2VcIl0gZXh0ZW5kcyBGVW5rbm93blJpY2hSZXNwb25zZURlY2xcbiAgICAgICAgPyBUeXBlXG4gICAgICAgIDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIFRSaWNoRnJvbnRlbmRFdmVudFJlc3BvbnNlRGF0YTxUeXBlIGV4dGVuZHMga2V5b2YgRlJpY2hGcm9udGVuZEV2ZW50cz4gPVxuICAgIEV4Y2x1ZGU8RklwY0Zyb250ZW5kRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl1bXCJEYXRhXCJdLCB1bmRlZmluZWQ+O1xuXG5leHBvcnQgdHlwZSBUUmljaEV2ZW50RGF0YU9yVW5kZWZpbmVkPFR5cGUgZXh0ZW5kcyBGVW5rbm93bklwY0V2ZW50PiA9XG4gICAgXCJEYXRhXCIgZXh0ZW5kcyBrZXlvZiBUeXBlW1wiUmVzcG9uc2VcIl1cbiAgICAgICAgPyBUeXBlW1wiUmVzcG9uc2VcIl1bXCJEYXRhXCJdXG4gICAgICAgIDogdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBUUG9vckV2ZW50PFR5cGUgZXh0ZW5kcyBGVW5rbm93bklwY0V2ZW50PiA9XG4gICAgXCJEYXRhXCIgZXh0ZW5kcyBrZXlvZiBUeXBlW1wiUmVzcG9uc2VcIl1cbiAgICAgICAgPyBuZXZlclxuICAgICAgICA6IFR5cGU7XG5cbnR5cGUgVFJpY2hFdmVudHNJbnRlcm1lZGlhdGU8VHlwZSBleHRlbmRzIFRJcGNFdmVudHNCYXNlPiA9XG57XG4gICAgWyBLZXkgaW4ga2V5b2YgVHlwZSBdOiBUUmljaEV2ZW50RGVjbDxFeHRyYWN0PFR5cGVbS2V5XSwgRlVua25vd25JcGNFdmVudD4+O1xufTtcblxuZXhwb3J0IHR5cGUgVFJpY2hFdmVudHM8VHlwZSBleHRlbmRzIFRJcGNFdmVudHNCYXNlPiA9XG57XG4gICAgLyogZXNsaW50LWRpc2FibGUgQHN0eWxpc3RpYy9pbmRlbnQgKi9cbiAgICBbXG4gICAgICAgIEtleSBpbiBrZXlvZiBUUmljaEV2ZW50c0ludGVybWVkaWF0ZTxUeXBlPiBhc1xuICAgICAgICBUUmljaEV2ZW50c0ludGVybWVkaWF0ZTxUeXBlPltLZXldIGV4dGVuZHMgbmV2ZXJcbiAgICAgICAgICAgID8gbmV2ZXJcbiAgICAgICAgICAgIDogS2V5XG4gICAgXTogVHlwZVtLZXldO1xuICAgIC8qIGVzbGludC1lbmFibGUgQHN0eWxpc3RpYy9pbmRlbnQgKi9cbn07XG4vLyAgICAgWyBLZXkgaW4ga2V5b2YgVCBhcyB1bmRlZmluZWQgZXh0ZW5kcyBUeXBlW0tleV1bXCJSZXNwb25zZVwiXVtcIkRhdGFcIl0gPyBLZXkgOiBuZXZlciBdOiBUeXBlW0tleV07XG5cbmV4cG9ydCB0eXBlIEZSaWNoQmFja2VuZEV2ZW50cyA9IFRSaWNoRXZlbnRzPEZJcGNCYWNrZW5kRXZlbnRzPjtcbmV4cG9ydCB0eXBlIEZSaWNoRnJvbnRlbmRFdmVudHMgPSBUUmljaEV2ZW50czxGSXBjRnJvbnRlbmRFdmVudHM+O1xuZXhwb3J0IHR5cGUgRlJpY2hFdmVudHMgPSBGUmljaEJhY2tlbmRFdmVudHMgJiBGUmljaEZyb250ZW5kRXZlbnRzO1xuXG5leHBvcnQgdHlwZSBUR2V0UmljaFJlc3BvbnNlPFxuICAgIFR5cGUgZXh0ZW5kcyBUUmljaFJlc3BvbnNlRGVjbDxGUmljaFJlc3BvbnNlRGF0YSwgRlVua25vd25FcnJvckNvZGU+XG4+ID0gVFJpY2hSZXNwb25zZTxUeXBlW1wiRGF0YVwiXSwgVHlwZVtcIkVycm9yXCJdPjtcblxuZXhwb3J0IHR5cGUgVEdldFJpY2hSZXNwb25zZUZyb21LZXk8VHlwZSBleHRlbmRzIGtleW9mIEZSaWNoRXZlbnRzPiA9XG4gICAgVEdldFJpY2hSZXNwb25zZTxGUmljaEV2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdPjtcblxuZXhwb3J0IHR5cGUgVEdldFJpY2hSZXNwb25zZUFzU3VjY2VzczxUeXBlIGV4dGVuZHMga2V5b2YgRlJpY2hFdmVudHM+ID1cbiAgICBUUmljaFJlc3BvbnNlU3VjY2VzczxOb25OdWxsYWJsZTxGUmljaEV2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdW1wiRGF0YVwiXT4+O1xuXG5leHBvcnQgdHlwZSBUR2V0RGVmYXVsdFJpY2hSZXNwb25zZURhdGE8VHlwZSBleHRlbmRzIGtleW9mIEZSaWNoRXZlbnRzPiA9XG4gICAgVEdldFJpY2hSZXNwb25zZUFzU3VjY2VzczxUeXBlPltcIkRhdGFcIl07XG5cbmV4cG9ydCB0eXBlIFRHZXRSaWNoUmVzcG9uc2VBc0ZhaWx1cmU8VHlwZSBleHRlbmRzIGtleW9mIEZSaWNoRXZlbnRzPiA9XG4gICAgVFJpY2hSZXNwb25zZUZhaWx1cmU8Tm9uTnVsbGFibGU8RlJpY2hFdmVudHNbVHlwZV1bXCJSZXNwb25zZVwiXVtcIkVycm9yXCJdPj47XG5cbmV4cG9ydCB0eXBlIEZQb29yRXZlbnRzID0gRlBvb3JCYWNrZW5kRXZlbnRzICYgRlBvb3JGcm9udGVuZEV2ZW50cztcblxuLy8gZXhwb3J0IHR5cGUgVEdldFBvb3JSZXNwb25zZTxUeXBlIGV4dGVuZHMgVFBvb3JSZXNwb25zZURlY2w8RlVua25vd25FcnJvckNvZGU+PiA9XG4vLyAgICAgVFBvb3JSZXNwb25zZTxUeXBlW1wiRXJyb3JcIl0+O1xuZXhwb3J0IHR5cGUgRlBvb3JSZXNwb25zZUFzU3VjY2VzcyA9XG57XG4gICAgRGF0YTogdW5kZWZpbmVkO1xuICAgIEVycm9yOiB1bmRlZmluZWQ7XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG5leHBvcnQgdHlwZSBUUG9vclJlc3BvbnNlQXNTdWNjZXNzPFR5cGUgZXh0ZW5kcyBrZXlvZiBGUG9vckV2ZW50cz4gPVxue1xuICAgIERhdGE6IHVuZGVmaW5lZDtcbiAgICBFcnJvcjogdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IHR5cGUgVFBvb3JSZXNwb25zZUFzRmFpbHVyZTxUeXBlIGV4dGVuZHMga2V5b2YgRlBvb3JFdmVudHM+ID1cbntcbiAgICBEYXRhOiB1bmRlZmluZWQ7XG4gICAgRXJyb3I6IFRHZXRFcnJvckNvZGU8VHlwZT47XG59O1xuXG5leHBvcnQgdHlwZSBUR2V0UG9vclJlc3BvbnNlPFR5cGUgZXh0ZW5kcyBUUG9vclJlc3BvbnNlRGVjbDxGVW5rbm93bkVycm9yQ29kZT4+ID1cbiAgICBUUG9vclJlc3BvbnNlPFR5cGVbXCJFcnJvclwiXT47XG5cbmV4cG9ydCB0eXBlIFRHZXRQb29yUmVzcG9uc2VGcm9tS2V5PFR5cGUgZXh0ZW5kcyBrZXlvZiBGUG9vckV2ZW50cz4gPVxuICAgIFRHZXRQb29yUmVzcG9uc2U8RlBvb3JFdmVudHNbVHlwZV1bXCJSZXNwb25zZVwiXT47XG5cbmV4cG9ydCB0eXBlIFRHZXRFcnJvckNvZGU8VHlwZSBleHRlbmRzIGtleW9mIEZJcGNFdmVudHM+ID0gRklwY0V2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdW1wiRXJyb3JcIl0gfCBcIlwiO1xuXG5leHBvcnQgdHlwZSBUR2V0UmVzcG9uc2U8XG4gICAgVHlwZSBleHRlbmRzXG4gICAgICAgIHwgVFJpY2hSZXNwb25zZURlY2w8RlJpY2hSZXNwb25zZURhdGEsIEZVbmtub3duRXJyb3JDb2RlPlxuICAgICAgICB8IFRQb29yUmVzcG9uc2VEZWNsPEZVbmtub3duRXJyb3JDb2RlPlxuPiA9XG4gICAgVHlwZSBleHRlbmRzIFRSaWNoUmVzcG9uc2VEZWNsPEZSaWNoUmVzcG9uc2VEYXRhLCBGVW5rbm93bkVycm9yQ29kZT5cbiAgICAgICAgPyBUR2V0UmljaFJlc3BvbnNlPFR5cGU+XG4gICAgICAgIDogVHlwZSBleHRlbmRzIFRQb29yUmVzcG9uc2VEZWNsPEZVbmtub3duRXJyb3JDb2RlPlxuICAgICAgICAgICAgPyBUR2V0UG9vclJlc3BvbnNlPFR5cGU+XG4gICAgICAgICAgICA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBUR2V0UmVzcG9uc2VGcm9tS2V5PFR5cGUgZXh0ZW5kcyBrZXlvZiBGSXBjRXZlbnRzPiA9XG4gICAgVHlwZSBleHRlbmRzIGtleW9mIEZSaWNoRXZlbnRzXG4gICAgICAgID8gVEdldFJpY2hSZXNwb25zZTxGSXBjRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl0+XG4gICAgICAgIDogVHlwZSBleHRlbmRzIGtleW9mIEZQb29yRXZlbnRzXG4gICAgICAgICAgICA/IFRHZXRQb29yUmVzcG9uc2U8RklwY0V2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdPlxuICAgICAgICAgICAgOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgRlBvb3JCYWNrZW5kRXZlbnRzID0gVFBvb3JFdmVudHM8RklwY0JhY2tlbmRFdmVudHM+O1xuZXhwb3J0IHR5cGUgRlBvb3JGcm9udGVuZEV2ZW50cyA9IFRQb29yRXZlbnRzPEZJcGNGcm9udGVuZEV2ZW50cz47XG5cbi8qKiBBIGNhbGxiYWNrIHRvIHJlc3BvbmQgdG8gYSByZWNlaXZlZCBldmVudC4gKi9cbmV4cG9ydCB0eXBlIFRFdmVudENhbGxiYWNrPFR5cGUgZXh0ZW5kcyBrZXlvZiBGSXBjRXZlbnRzPiA9IChcbiAgICBSZXNwb25zZTogRklwY0V2ZW50c1tUeXBlXVtcIlJlcXVlc3RcIl1cbikgPT4gUHJvbWlzZTxUR2V0UmVzcG9uc2U8RklwY0V2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdPj47XG5cbnR5cGUgVElzVW5pb248VHlwZSwgT3JpZ2luYWwgPSBUeXBlPiA9XG4gICAgVHlwZSBleHRlbmRzIHVua25vd25cbiAgICAgICAgPyAoWyBPcmlnaW5hbCBdIGV4dGVuZHMgWyBUeXBlIF0gPyBmYWxzZSA6IHRydWUpXG4gICAgICAgIDogZmFsc2U7XG5cbnR5cGUgVEhhc0V4YWN0bHlPbmVLZXk8VHlwZT4gPVxuICAgIFR5cGUgZXh0ZW5kcyBSZWNvcmQ8UHJvcGVydHlLZXksIHVua25vd24+XG4gICAgICAgID8gKFsga2V5b2YgVHlwZSBdIGV4dGVuZHMgWyBuZXZlciBdXG4gICAgICAgICAgICA/IGZhbHNlXG4gICAgICAgICAgICA6ICggVElzVW5pb248a2V5b2YgVHlwZT4gZXh0ZW5kcyB0cnVlID8gZmFsc2UgOiB0cnVlIClcbiAgICAgICAgKVxuICAgICAgICA6IGZhbHNlO1xuXG4vKiogVGhlIHJpY2ggZnJvbnRlbmQgZXZlbnRzIHdob3NlIHJlc3BlY3RpdmUgYERhdGFgIHByb3BlcnRpZXMgaGF2ZSBleGFjdGx5IG9uZSBwcm9wZXJ0eS4gKi9cbmV4cG9ydCB0eXBlIEZTaW5nbGVSaWNoRnJvbnRlbmRDaGFubmVscyA9XG57XG4gICAgWyBLZXkgaW4ga2V5b2YgRlJpY2hGcm9udGVuZEV2ZW50cyBdLT86XG4gICAgVEhhc0V4YWN0bHlPbmVLZXk8RlJpY2hGcm9udGVuZEV2ZW50c1tLZXldW1wiUmVzcG9uc2VcIl1bXCJEYXRhXCJdPiBleHRlbmRzIHRydWVcbiAgICAgICAgPyBLZXlcbiAgICAgICAgOiBuZXZlclxufVtrZXlvZiBGUmljaEZyb250ZW5kRXZlbnRzXTtcblxudHlwZSBUR2V0VmFsdWVPZlNpbmdsZVByb3BlcnR5UmVjb3JkPFR5cGUgZXh0ZW5kcyBSZWNvcmQ8UHJvcGVydHlLZXksIHVua25vd24+PiA9XG4gICAga2V5b2YgVHlwZSBleHRlbmRzIGluZmVyIEtleVxuICAgICAgICA/IEtleSBleHRlbmRzIFByb3BlcnR5S2V5XG4gICAgICAgICAgICA/IFR5cGVbS2V5XVxuICAgICAgICAgICAgOiBuZXZlclxuICAgICAgICA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBGU2luZ2xlUmljaEZyb250ZW5kRXZlbnRzID0gUGljazxGUmljaEZyb250ZW5kRXZlbnRzLCBGU2luZ2xlUmljaEZyb250ZW5kQ2hhbm5lbHM+O1xuXG5leHBvcnQgdHlwZSBUR2V0U2luZ2xlUmljaFJlc3BvbnNlRGF0YTxUeXBlIGV4dGVuZHMgRlNpbmdsZVJpY2hGcm9udGVuZENoYW5uZWxzPiA9XG4gICAgVEdldFZhbHVlT2ZTaW5nbGVQcm9wZXJ0eVJlY29yZDxGU2luZ2xlUmljaEZyb250ZW5kRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl1bXCJEYXRhXCJdPjtcblxudHlwZSBUQ2hhbm5lbFRhZ2dlZEJhc2U8Q2hhbm5lbFR5cGUgZXh0ZW5kcyBzdHJpbmcgPSBzdHJpbmc+ID0gYCR7IG51bWJlciB9LSR7IENoYW5uZWxUeXBlIH1gO1xuXG5leHBvcnQgdHlwZSBUQmFja2VuZENoYW5uZWxUYWdnZWQ8Q2hhbm5lbFR5cGUgZXh0ZW5kcyBGSXBjQmFja2VuZENoYW5uZWw+ID0gVENoYW5uZWxUYWdnZWRCYXNlPENoYW5uZWxUeXBlPjtcbmV4cG9ydCB0eXBlIFRGcm9udGVuZENoYW5uZWxUYWdnZWQ8Q2hhbm5lbFR5cGUgZXh0ZW5kcyBGSXBjRnJvbnRlbmRDaGFubmVsPiA9IFRDaGFubmVsVGFnZ2VkQmFzZTxDaGFubmVsVHlwZT47XG5leHBvcnQgdHlwZSBUQ2hhbm5lbFRhZ2dlZDxDaGFubmVsVHlwZSBleHRlbmRzIEZJcGNDaGFubmVsPiA9XG4gICAgQ2hhbm5lbFR5cGUgZXh0ZW5kcyBGSXBjQmFja2VuZENoYW5uZWxcbiAgICAgICAgPyBUQmFja2VuZENoYW5uZWxUYWdnZWQ8Q2hhbm5lbFR5cGU+XG4gICAgICAgIDogQ2hhbm5lbFR5cGUgZXh0ZW5kcyBGSXBjRnJvbnRlbmRDaGFubmVsXG4gICAgICAgICAgICA/IFRGcm9udGVuZENoYW5uZWxUYWdnZWQ8Q2hhbm5lbFR5cGU+XG4gICAgICAgICAgICA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBGQmFja2VuZENoYW5uZWxUYWdnZWQgPSBUQmFja2VuZENoYW5uZWxUYWdnZWQ8RklwY0JhY2tlbmRDaGFubmVsPjtcbmV4cG9ydCB0eXBlIEZGcm9udGVuZENoYW5uZWxUYWdnZWQgPSBURnJvbnRlbmRDaGFubmVsVGFnZ2VkPEZJcGNGcm9udGVuZENoYW5uZWw+O1xuZXhwb3J0IHR5cGUgRkNoYW5uZWxUYWdnZWQgPSBUQ2hhbm5lbFRhZ2dlZDxGSXBjQ2hhbm5lbD47XG5cbmV4cG9ydCB0eXBlIEZCYWNrZW5kQ2hhbm5lbFRhZ2dlciA9IChDaGFubmVsOiBGSXBjQmFja2VuZENoYW5uZWwpID0+IEZCYWNrZW5kQ2hhbm5lbFRhZ2dlZCB8IHVuZGVmaW5lZDtcbmV4cG9ydCB0eXBlIEZGcm9udGVuZENoYW5uZWxUYWdnZXIgPSAoQ2hhbm5lbDogRklwY0Zyb250ZW5kQ2hhbm5lbCkgPT4gRkZyb250ZW5kQ2hhbm5lbFRhZ2dlZCB8IHVuZGVmaW5lZDtcbiIsIi8qIEZpbGU6ICAgICAgVHJhbnNhY3Rpb25zLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKiBDb21tZW50OiAgIERlZmluZSB0eXBlcyB1c2VkIGluIGBFdmVudC5UeXBlcy50c2AgdGhhdFxuICogICAgICAgICAgICBkbyBub3Qgb3RoZXJ3aXNlIGhhdmUgYSBnb29kIHBsYWNlIHRvIGdvLlxuICovXG5cbmltcG9ydCB0eXBlIHsgRkZvY3VzQ2hhbmdlIH0gZnJvbSBcIi4uL1RyZWUuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgVEV2ZW50RXJyb3JDb2RlIH0gZnJvbSBcIi4vRXJyb3JDb2Rlcy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBUSXBjRnJvbnRlbmRFdmVudCB9IGZyb20gXCIuL0V2ZW50QmFzZS5UeXBlc1wiO1xuXG5leHBvcnQgdHlwZSBGV2luZG93Rm9jdXNEYXRhID1cbntcbiAgICBGb2N1c2VkV2luZG93VGl0bGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEZQYW5lbEZvY3VzRGF0YSA9XG57XG4gICAgTnVtVmVydGljZXM6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZGb2N1c0RhdGFCYXNlID1cbntcbiAgICBDYW5Nb3ZlV2l0aGluUGFuZWw6IGJvb2xlYW47XG4gICAgQ2FuU3RlcFVwOiBib29sZWFuO1xuICAgIENhblN0ZXBEb3duOiBib29sZWFuO1xuICAgIERpcmVjdGlvbjogXCJIb3Jpem9udGFsXCIgfCBcIlZlcnRpY2FsXCI7XG59O1xuXG5leHBvcnQgdHlwZSBGRm9jdXNEYXRhID1cbiAgICBGRm9jdXNEYXRhQmFzZSAmXG4gICAgKFxuICAgICAgICB8IEZXaW5kb3dGb2N1c0RhdGFcbiAgICAgICAgfCBGUGFuZWxGb2N1c0RhdGFcbiAgICApO1xuXG5leHBvcnQgdHlwZSBGT25DaGFuZ2VGb2N1c0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldEZvY3VzRGF0YUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcbiAgICB8IFwiQ3VycmVudFBhbmVsVW5kZWZpbmVkXCJcbiAgICB8IFwiRm9jdXNlZFZlcnRleFVuZGVmaW5lZFwiXG4+O1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4vRXZlbnQuVHlwZXNcIlxue1xuICAgIGludGVyZmFjZSBJRnJvbnRlbmRFdmVudFJlZ2lzdHJhclxuICAgIHtcbiAgICAgICAgR2V0Rm9jdXNEYXRhOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZGb2N1c0RhdGEsXG4gICAgICAgICAgICBGR2V0Rm9jdXNEYXRhRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIE9uQ2hhbmdlRm9jdXM6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgRkZvY3VzQ2hhbmdlLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRk9uQ2hhbmdlRm9jdXNFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICB9XG59XG4iLCIvKiBGaWxlOiAgICAgIEluc2VydEV2ZW50LlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBIV2luZG93IH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG4vKipcbiAqIFdoZW4gYSBuZXcgdmVydGV4IGlzIGNyZWF0ZWQgd2l0aGluIGEgcGFuZWwsIGhvdyBzaG91bGQgaXRzIHNpemVcbiAqIGJlIGRldGVybWluZWQsIGFzIHdlbGwgYXMgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnQgdmVydGljZXM/XG4gKi9cbmV4cG9ydCB0eXBlIEZJbnNlcnRTaXppbmdNZXRob2QgPVxuICAgIHwgXCJCaXNlY3Rpb25cIlxuICAgIHwgXCJVbmlmb3JtUmVzaXplXCI7XG5cbmV4cG9ydCB0eXBlIEZJbnNlcnRhYmxlV2luZG93RGF0YSA9XG57XG4gICAgSGFuZGxlOiBIV2luZG93O1xuICAgIEljb246IHN0cmluZztcbiAgICBUaXRsZTogc3RyaW5nO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgTW92ZS5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkF4aXMgfSBmcm9tIFwiLi4vLi4vU2hhcmVkL1NoYXJlZC5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRJcGNGcm9udGVuZEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZGb2N1c0RhdGFCYXNlIH0gZnJvbSBcIi4vRm9jdXMuVHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRlRyYW5zbGF0aW9uID1cbntcbiAgICBEaXJlY3Rpb246IEZBeGlzO1xuICAgIERpc3RhbmNlOiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBGUGFuZWxTdGVwID1cbiAgICB8IFwiVXBcIlxuICAgIHwgXCJEb3duXCJcbiAgICB8IFwiTmV4dFwiXG4gICAgfCBcIlByZXZpb3VzXCI7XG5cbmV4cG9ydCB0eXBlIEZUaWxlZE1vdmVEYXRhID0gT21pdDxGRm9jdXNEYXRhQmFzZSwgXCJDYW5Nb3ZlV2l0aGluUGFuZWxcIj47XG5cbmV4cG9ydCB0eXBlIEZUaWxlZE1vdmVUcmFuc2FjdGlvbiA9XG57XG4gICAgU3RlcDogRlBhbmVsU3RlcDtcbn07XG5cbmV4cG9ydCB0eXBlIEZUaWxlZE1vdmVSZXN1bHQgPVxue1xuICAgIElzT25QYW5lbDogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIEZNb3ZlRmxvYXRpbmdXaW5kb3dFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9FdmVudC5UeXBlc1wiXG57XG4gICAgaW50ZXJmYWNlIElGcm9udGVuZEV2ZW50UmVnaXN0cmFyXG4gICAge1xuICAgICAgICBNb3ZlRmxvYXRpbmdXaW5kb3c6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgRlRyYW5zbGF0aW9uLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRk1vdmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBNb3ZlVGlsZWRXaW5kb3c6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgRlRpbGVkTW92ZVRyYW5zYWN0aW9uLFxuICAgICAgICAgICAgRlRpbGVkTW92ZVJlc3VsdCxcbiAgICAgICAgICAgIEZNb3ZlRmxvYXRpbmdXaW5kb3dFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICB9XG59O1xuIiwiLyogRmlsZTogICAgICBOYXZpZ2F0ZS5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgVEV2ZW50RXJyb3JDb2RlIH0gZnJvbSBcIi4vRXJyb3JDb2Rlcy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBUSXBjQmFja2VuZEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZOYXZpZ2F0ZVJlcXVlc3QgPVxue1xuICAgIFJvdXRlOiBzdHJpbmc7XG4gICAgU3RhdGU/OiBSZWNvcmQ8UHJvcGVydHlLZXksIHVua25vd24+O1xufTtcblxuZXhwb3J0IHR5cGUgRk5hdmlnYXRlRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5kZWNsYXJlIG1vZHVsZSBcIi4vRXZlbnQuVHlwZXNcIlxue1xuICAgIGludGVyZmFjZSBJQmFja2VuZEV2ZW50UmVnaXN0cmFyXG4gICAge1xuICAgICAgICBOYXZpZ2F0ZTogVElwY0JhY2tlbmRFdmVudDxcbiAgICAgICAgICAgIEZOYXZpZ2F0ZVJlcXVlc3QsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGTmF2aWdhdGVFcnJvckNvZGVcbiAgICAgICAgPjtcblxuICAgIH1cbn07XG4iLCIvKiBGaWxlOiAgICAgIFNldHRpbmdzLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGRXh0ZXJuYWxTZXR0aW5nLCBGU2V0dGluZ3MgfSBmcm9tIFwiLi4vU2V0dGluZ3NcIjtcbmltcG9ydCB0eXBlIHsgVEV2ZW50RXJyb3JDb2RlIH0gZnJvbSBcIi4vRXJyb3JDb2Rlcy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBUSXBjRnJvbnRlbmRFdmVudCB9IGZyb20gXCIuL0V2ZW50QmFzZS5UeXBlc1wiO1xuXG5leHBvcnQgdHlwZSBGVXBkYXRlU3RhdHVzID1cbntcbiAgICBBdmFpbGFibGVWZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgdHlwZSBGVXBkYXRlU2V0dGluZ3NFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5leHBvcnQgdHlwZSBGR2V0U2V0dGluZ3NFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5leHBvcnQgdHlwZSBGR2V0U2V0dGluZ0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcbmV4cG9ydCB0eXBlIEZDaGVja0ZvclVwZGF0ZXNFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5leHBvcnQgdHlwZSBGR2V0RXh0ZXJuYWxTZXR0aW5nU3RhdGVFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9FdmVudC5UeXBlc1wiXG57XG4gICAgaW50ZXJmYWNlIElGcm9udGVuZEV2ZW50UmVnaXN0cmFyXG4gICAge1xuICAgICAgICBHZXRFeHRlcm5hbFNldHRpbmdTdGF0ZTogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBGRXh0ZXJuYWxTZXR0aW5nLFxuICAgICAgICAgICAgeyBTZXR0aW5nOiBGU2V0dGluZ3NbRkV4dGVybmFsU2V0dGluZ10gfSxcbiAgICAgICAgICAgIEZHZXRFeHRlcm5hbFNldHRpbmdTdGF0ZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRTZXR0aW5nOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIGtleW9mIEZTZXR0aW5ncyxcbiAgICAgICAgICAgIHsgU2V0dGluZzogRlNldHRpbmdzW2tleW9mIEZTZXR0aW5nc10gfSxcbiAgICAgICAgICAgIEZHZXRTZXR0aW5nRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldFNldHRpbmdzOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZTZXR0aW5ncyxcbiAgICAgICAgICAgIEZHZXRTZXR0aW5nc0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBDaGVja0ZvclVwZGF0ZXM6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlVwZGF0ZVN0YXR1cyxcbiAgICAgICAgICAgIEZDaGVja0ZvclVwZGF0ZXNFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgVXBkYXRlU2V0dGluZ3M6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgRlNldHRpbmdzLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlVwZGF0ZVNldHRpbmdzRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgfVxufTtcbiIsIi8qIEZpbGU6ICAgICAgVGlsZS5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkFubm90YXRlZFBhbmVsIH0gZnJvbSBcIi4uL1RyZWUuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgVEV2ZW50RXJyb3JDb2RlIH0gZnJvbSBcIi4vRXJyb3JDb2Rlcy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBUSXBjRnJvbnRlbmRFdmVudCB9IGZyb20gXCIuL0V2ZW50QmFzZS5UeXBlc1wiO1xuXG5leHBvcnQgdHlwZSBGQnJpbmdJbnRvUGFuZWxFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9FdmVudC5UeXBlc1wiXG57XG4gICAgaW50ZXJmYWNlIElGcm9udGVuZEV2ZW50UmVnaXN0cmFyXG4gICAge1xuICAgICAgICBCcmluZ0ludG9QYW5lbDogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBGQW5ub3RhdGVkUGFuZWwsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGQnJpbmdJbnRvUGFuZWxFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICB9XG59O1xuIiwiLyogRmlsZTogICAgICBpbmRleC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0V2ZW50XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9FdmVudC5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9FdmVudFV0aWxpdHkuVHlwZXNcIjtcblxuZXhwb3J0ICogZnJvbSBcIi4vQ29tbW9uLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Gb2N1cy5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vSW5zZXJ0LlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Nb3ZlLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9OYXZpZ2F0ZS5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vU2V0dGluZ3MuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1RpbGUuVHlwZXNcIjtcbiIsIi8qIEZpbGU6ICAgICAgS2V5Ym9hcmQuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBGVmlydHVhbEtleSA9XG4gICAgfCAweDA1XG4gICAgfCAweDA2XG4gICAgfCAweDA4XG4gICAgfCAweDA5XG4gICAgfCAweDBEXG4gICAgfCAweDEwXG4gICAgfCAweDExXG4gICAgfCAweDEyXG4gICAgfCAweDEzXG4gICAgfCAweDIwXG4gICAgfCAweDIxXG4gICAgfCAweDIyXG4gICAgfCAweDIzXG4gICAgfCAweDI0XG4gICAgfCAweDI1XG4gICAgfCAweDI2XG4gICAgfCAweDI3XG4gICAgfCAweDI4XG4gICAgfCAweDJEXG4gICAgfCAweDJFXG4gICAgfCAweDMwXG4gICAgfCAweDMxXG4gICAgfCAweDMyXG4gICAgfCAweDMzXG4gICAgfCAweDM0XG4gICAgfCAweDM1XG4gICAgfCAweDM2XG4gICAgfCAweDM3XG4gICAgfCAweDM4XG4gICAgfCAweDM5XG4gICAgfCAweDQxXG4gICAgfCAweDQyXG4gICAgfCAweDQzXG4gICAgfCAweDQ0XG4gICAgfCAweDQ1XG4gICAgfCAweDQ2XG4gICAgfCAweDQ3XG4gICAgfCAweDQ4XG4gICAgfCAweDQ5XG4gICAgfCAweDRBXG4gICAgfCAweDRCXG4gICAgfCAweDRDXG4gICAgfCAweDREXG4gICAgfCAweDRFXG4gICAgfCAweDRGXG4gICAgfCAweDUwXG4gICAgfCAweDUxXG4gICAgfCAweDUyXG4gICAgfCAweDUzXG4gICAgfCAweDU0XG4gICAgfCAweDU1XG4gICAgfCAweDU2XG4gICAgfCAweDU3XG4gICAgfCAweDU4XG4gICAgfCAweDU5XG4gICAgfCAweDVBXG4gICAgfCAweDVCXG4gICAgfCAweDVDXG4gICAgfCAweDVEXG4gICAgfCAweDYwXG4gICAgfCAweDYxXG4gICAgfCAweDYyXG4gICAgfCAweDYzXG4gICAgfCAweDY0XG4gICAgfCAweDY1XG4gICAgfCAweDY2XG4gICAgfCAweDY3XG4gICAgfCAweDY4XG4gICAgfCAweDY5XG4gICAgfCAweDZBXG4gICAgfCAweDZCXG4gICAgfCAweDZEXG4gICAgfCAweDZFXG4gICAgfCAweDZGXG4gICAgfCAweDcwXG4gICAgfCAweDcxXG4gICAgfCAweDcyXG4gICAgfCAweDczXG4gICAgfCAweDc0XG4gICAgfCAweDc1XG4gICAgfCAweDc2XG4gICAgfCAweDc3XG4gICAgfCAweDc4XG4gICAgfCAweDc5XG4gICAgfCAweDdBXG4gICAgfCAweDdCXG4gICAgfCAweDdDXG4gICAgfCAweDdEXG4gICAgfCAweDdFXG4gICAgfCAweDdGXG4gICAgfCAweDgwXG4gICAgfCAweDgxXG4gICAgfCAweDgyXG4gICAgfCAweDgzXG4gICAgfCAweDg0XG4gICAgfCAweDg1XG4gICAgfCAweDg2XG4gICAgfCAweDg3XG4gICAgfCAweEEwXG4gICAgfCAweEExXG4gICAgfCAweEEyXG4gICAgfCAweEEzXG4gICAgfCAweEE0XG4gICAgfCAweEE1XG4gICAgfCAweEE2XG4gICAgfCAweEE3XG4gICAgfCAweEE4XG4gICAgfCAweEE5XG4gICAgfCAweEFBXG4gICAgfCAweEFCXG4gICAgfCAweEFDXG4gICAgfCAweEIwXG4gICAgfCAweEIxXG4gICAgfCAweEIyXG4gICAgfCAweEIzXG4gICAgfCAweEI0XG4gICAgfCAweEI1XG4gICAgfCAweEI2XG4gICAgfCAweEI3XG4gICAgfCAweEJBXG4gICAgfCAweEJCXG4gICAgfCAweEJDXG4gICAgfCAweEJEXG4gICAgfCAweEJFXG4gICAgfCAweEJGXG4gICAgfCAweEMwXG4gICAgfCAweERCXG4gICAgfCAweERDXG4gICAgfCAweEREXG4gICAgfCAweERFO1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIGZvciBrZXlzLCBhc3NpZ25lZCBpbiBgS2V5LnRzeGAuICovXG5leHBvcnQgdHlwZSBGS2V5SWQgPVxuICAgIHwgXCJNb3VzZVgxXCJcbiAgICB8IFwiTW91c2VYMlwiXG4gICAgfCBcIkJhY2tzcGFjZVwiXG4gICAgfCBcIlRhYlwiXG4gICAgfCBcIkVudGVyXCJcbiAgICB8IFwiU2hpZnRcIlxuICAgIHwgXCJDdHJsXCJcbiAgICB8IFwiQWx0XCJcbiAgICB8IFwiU3BhY2VcIlxuICAgIHwgXCJQZ1VwXCJcbiAgICB8IFwiUGdEb3duXCJcbiAgICB8IFwiRW5kXCJcbiAgICB8IFwiSG9tZVwiXG4gICAgfCBcIkxlZnRBcnJvd1wiXG4gICAgfCBcIlVwQXJyb3dcIlxuICAgIHwgXCJSaWdodEFycm93XCJcbiAgICB8IFwiRG93bkFycm93XCJcbiAgICB8IFwiSW5zXCJcbiAgICB8IFwiRGVsXCJcbiAgICB8IFwiMFwiXG4gICAgfCBcIjFcIlxuICAgIHwgXCIyXCJcbiAgICB8IFwiM1wiXG4gICAgfCBcIjRcIlxuICAgIHwgXCI1XCJcbiAgICB8IFwiNlwiXG4gICAgfCBcIjdcIlxuICAgIHwgXCI4XCJcbiAgICB8IFwiOVwiXG4gICAgfCBcIkFcIlxuICAgIHwgXCJCXCJcbiAgICB8IFwiQ1wiXG4gICAgfCBcIkRcIlxuICAgIHwgXCJFXCJcbiAgICB8IFwiRlwiXG4gICAgfCBcIkdcIlxuICAgIHwgXCJIXCJcbiAgICB8IFwiSVwiXG4gICAgfCBcIkpcIlxuICAgIHwgXCJLXCJcbiAgICB8IFwiTFwiXG4gICAgfCBcIk1cIlxuICAgIHwgXCJOXCJcbiAgICB8IFwiT1wiXG4gICAgfCBcIlBcIlxuICAgIHwgXCJRXCJcbiAgICB8IFwiUlwiXG4gICAgfCBcIlNcIlxuICAgIHwgXCJUXCJcbiAgICB8IFwiVVwiXG4gICAgfCBcIlZcIlxuICAgIHwgXCJXXCJcbiAgICB8IFwiWFwiXG4gICAgfCBcIllcIlxuICAgIHwgXCJaXCJcbiAgICB8IFwiTFdpblwiXG4gICAgfCBcIlJXaW5cIlxuICAgIHwgXCJOdW0wXCJcbiAgICB8IFwiTnVtMVwiXG4gICAgfCBcIk51bTJcIlxuICAgIHwgXCJOdW0zXCJcbiAgICB8IFwiTnVtNFwiXG4gICAgfCBcIk51bTVcIlxuICAgIHwgXCJOdW02XCJcbiAgICB8IFwiTnVtN1wiXG4gICAgfCBcIk51bThcIlxuICAgIHwgXCJOdW05XCJcbiAgICB8IFwiTXVsdGlwbHlcIlxuICAgIHwgXCJBZGRcIlxuICAgIHwgXCJTdWJ0cmFjdFwiXG4gICAgfCBcIk51bURlY2ltYWxcIlxuICAgIHwgXCJOdW1EaXZpZGVcIlxuICAgIHwgXCJGMVwiXG4gICAgfCBcIkYyXCJcbiAgICB8IFwiRjNcIlxuICAgIHwgXCJGNFwiXG4gICAgfCBcIkY1XCJcbiAgICB8IFwiRjZcIlxuICAgIHwgXCJGN1wiXG4gICAgfCBcIkY4XCJcbiAgICB8IFwiRjlcIlxuICAgIHwgXCJGMTBcIlxuICAgIHwgXCJGMTFcIlxuICAgIHwgXCJGMTJcIlxuICAgIHwgXCJGMTNcIlxuICAgIHwgXCJQYXVzZVwiXG4gICAgfCBcIkYxNFwiXG4gICAgfCBcIkYxNVwiXG4gICAgfCBcIkYxNlwiXG4gICAgfCBcIkYxN1wiXG4gICAgfCBcIkYxOFwiXG4gICAgfCBcIkYxOVwiXG4gICAgfCBcIkYyMFwiXG4gICAgfCBcIkYyMVwiXG4gICAgfCBcIkYyMlwiXG4gICAgfCBcIkYyM1wiXG4gICAgfCBcIkYyNFwiXG4gICAgfCBcIkxTaGlmdFwiXG4gICAgfCBcIlJTaGlmdFwiXG4gICAgfCBcIkxDdHJsXCJcbiAgICB8IFwiUkN0cmxcIlxuICAgIHwgXCJMQWx0XCJcbiAgICB8IFwiUkFsdFwiXG4gICAgfCBcIkJyb3dzZXJCYWNrXCJcbiAgICB8IFwiQnJvd3NlckZvcndhcmRcIlxuICAgIHwgXCJCcm93c2VyUmVmcmVzaFwiXG4gICAgfCBcIkJyb3dzZXJTdG9wXCJcbiAgICB8IFwiQnJvd3NlclNlYXJjaFwiXG4gICAgfCBcIkJyb3dzZXJGYXZvcml0ZXNcIlxuICAgIHwgXCJCcm93c2VyU3RhcnRcIlxuICAgIHwgXCJOZXh0VHJhY2tcIlxuICAgIHwgXCJQcmV2aW91c1RyYWNrXCJcbiAgICB8IFwiU3RvcE1lZGlhXCJcbiAgICB8IFwiUGF1c2VcIlxuICAgIHwgXCJQbGF5UGF1c2VNZWRpYVwiXG4gICAgfCBcIlN0YXJ0TWFpbFwiXG4gICAgfCBcIlNlbGVjdE1lZGlhXCJcbiAgICB8IFwiQXBwbGljYXRpb25zXCJcbiAgICB8IFwiU3RhcnRBcHBsaWNhdGlvbk9uZVwiXG4gICAgfCBcIlN0YXJ0QXBwbGljYXRpb25Ud29cIlxuICAgIHwgXCI7XCJcbiAgICB8IFwiK1wiXG4gICAgfCBcIixcIlxuICAgIHwgXCItXCJcbiAgICB8IFwiLlwiXG4gICAgfCBcIi9cIlxuICAgIHwgXCJgXCJcbiAgICB8IFwiW1wiXG4gICAgfCBcIlxcXFxcIlxuICAgIHwgXCJdXCJcbiAgICB8IFwiJ1wiO1xuIiwiLyogRmlsZTogICAgICBLZXlib2FyZC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleUlkLCBGVmlydHVhbEtleSB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIG9mIGtleSBjb2Rlcy4gKi9cbmV4cG9ydCBjb25zdCBLZXlJZHNCeUlkOiBSZWFkb25seTxSZWNvcmQ8RlZpcnR1YWxLZXksIEZLZXlJZD4+ID1cbntcbiAgICAweDA1OiBcIk1vdXNlWDFcIixcbiAgICAweDA2OiBcIk1vdXNlWDJcIixcbiAgICAweDA4OiBcIkJhY2tzcGFjZVwiLFxuICAgIDB4MDk6IFwiVGFiXCIsXG4gICAgMHgwRDogXCJFbnRlclwiLFxuICAgIDB4MTA6IFwiU2hpZnRcIixcbiAgICAweDExOiBcIkN0cmxcIixcbiAgICAweDEyOiBcIkFsdFwiLFxuICAgIDB4MTM6IFwiUGF1c2VcIixcbiAgICAweDIwOiBcIlNwYWNlXCIsXG4gICAgMHgyMTogXCJQZ1VwXCIsXG4gICAgMHgyMjogXCJQZ0Rvd25cIixcbiAgICAweDIzOiBcIkVuZFwiLFxuICAgIDB4MjQ6IFwiSG9tZVwiLFxuICAgIDB4MjU6IFwiTGVmdEFycm93XCIsXG4gICAgMHgyNjogXCJVcEFycm93XCIsXG4gICAgMHgyNzogXCJSaWdodEFycm93XCIsXG4gICAgMHgyODogXCJEb3duQXJyb3dcIixcbiAgICAweDJEOiBcIkluc1wiLFxuICAgIDB4MkU6IFwiRGVsXCIsXG4gICAgMHgzMDogXCIwXCIsXG4gICAgMHgzMTogXCIxXCIsXG4gICAgMHgzMjogXCIyXCIsXG4gICAgMHgzMzogXCIzXCIsXG4gICAgMHgzNDogXCI0XCIsXG4gICAgMHgzNTogXCI1XCIsXG4gICAgMHgzNjogXCI2XCIsXG4gICAgMHgzNzogXCI3XCIsXG4gICAgMHgzODogXCI4XCIsXG4gICAgMHgzOTogXCI5XCIsXG4gICAgMHg0MTogXCJBXCIsXG4gICAgMHg0MjogXCJCXCIsXG4gICAgMHg0MzogXCJDXCIsXG4gICAgMHg0NDogXCJEXCIsXG4gICAgMHg0NTogXCJFXCIsXG4gICAgMHg0NjogXCJGXCIsXG4gICAgMHg0NzogXCJHXCIsXG4gICAgMHg0ODogXCJIXCIsXG4gICAgMHg0OTogXCJJXCIsXG4gICAgMHg0QTogXCJKXCIsXG4gICAgMHg0QjogXCJLXCIsXG4gICAgMHg0QzogXCJMXCIsXG4gICAgMHg0RDogXCJNXCIsXG4gICAgMHg0RTogXCJOXCIsXG4gICAgMHg0RjogXCJPXCIsXG4gICAgMHg1MDogXCJQXCIsXG4gICAgMHg1MTogXCJRXCIsXG4gICAgMHg1MjogXCJSXCIsXG4gICAgMHg1MzogXCJTXCIsXG4gICAgMHg1NDogXCJUXCIsXG4gICAgMHg1NTogXCJVXCIsXG4gICAgMHg1NjogXCJWXCIsXG4gICAgMHg1NzogXCJXXCIsXG4gICAgMHg1ODogXCJYXCIsXG4gICAgMHg1OTogXCJZXCIsXG4gICAgMHg1QTogXCJaXCIsXG4gICAgMHg1QjogXCJMV2luXCIsXG4gICAgMHg1QzogXCJSV2luXCIsXG4gICAgMHg1RDogXCJBcHBsaWNhdGlvbnNcIixcbiAgICAweDYwOiBcIk51bTBcIixcbiAgICAweDYxOiBcIk51bTFcIixcbiAgICAweDYyOiBcIk51bTJcIixcbiAgICAweDYzOiBcIk51bTNcIixcbiAgICAweDY0OiBcIk51bTRcIixcbiAgICAweDY1OiBcIk51bTVcIixcbiAgICAweDY2OiBcIk51bTZcIixcbiAgICAweDY3OiBcIk51bTdcIixcbiAgICAweDY4OiBcIk51bThcIixcbiAgICAweDY5OiBcIk51bTlcIixcbiAgICAweDZBOiBcIk11bHRpcGx5XCIsXG4gICAgMHg2QjogXCJBZGRcIixcbiAgICAweDZEOiBcIlN1YnRyYWN0XCIsXG4gICAgMHg2RTogXCJOdW1EZWNpbWFsXCIsXG4gICAgMHg2RjogXCJOdW1EaXZpZGVcIixcbiAgICAweDcwOiBcIkYxXCIsXG4gICAgMHg3MTogXCJGMlwiLFxuICAgIDB4NzI6IFwiRjNcIixcbiAgICAweDczOiBcIkY0XCIsXG4gICAgMHg3NDogXCJGNVwiLFxuICAgIDB4NzU6IFwiRjZcIixcbiAgICAweDc2OiBcIkY3XCIsXG4gICAgMHg3NzogXCJGOFwiLFxuICAgIDB4Nzg6IFwiRjlcIixcbiAgICAweDc5OiBcIkYxMFwiLFxuICAgIDB4N0E6IFwiRjExXCIsXG4gICAgMHg3QjogXCJGMTJcIixcbiAgICAweDdDOiBcIkYxM1wiLFxuICAgIDB4N0Q6IFwiRjE0XCIsXG4gICAgMHg3RTogXCJGMTVcIixcbiAgICAweDdGOiBcIkYxNlwiLFxuICAgIDB4ODA6IFwiRjE3XCIsXG4gICAgMHg4MTogXCJGMThcIixcbiAgICAweDgyOiBcIkYxOVwiLFxuICAgIDB4ODM6IFwiRjIwXCIsXG4gICAgMHg4NDogXCJGMjFcIixcbiAgICAweDg1OiBcIkYyMlwiLFxuICAgIDB4ODY6IFwiRjIzXCIsXG4gICAgMHg4NzogXCJGMjRcIixcbiAgICAweEEwOiBcIkxTaGlmdFwiLFxuICAgIDB4QTE6IFwiUlNoaWZ0XCIsXG4gICAgMHhBMjogXCJMQ3RybFwiLFxuICAgIDB4QTM6IFwiUkN0cmxcIixcbiAgICAweEE0OiBcIkxBbHRcIixcbiAgICAweEE1OiBcIlJBbHRcIixcbiAgICAweEE2OiBcIkJyb3dzZXJCYWNrXCIsXG4gICAgMHhBNzogXCJCcm93c2VyRm9yd2FyZFwiLFxuICAgIDB4QTg6IFwiQnJvd3NlclJlZnJlc2hcIixcbiAgICAweEE5OiBcIkJyb3dzZXJTdG9wXCIsXG4gICAgMHhBQTogXCJCcm93c2VyU2VhcmNoXCIsXG4gICAgMHhBQjogXCJCcm93c2VyRmF2b3JpdGVzXCIsXG4gICAgMHhBQzogXCJCcm93c2VyU3RhcnRcIixcbiAgICAweEIwOiBcIk5leHRUcmFja1wiLFxuICAgIDB4QjE6IFwiUHJldmlvdXNUcmFja1wiLFxuICAgIDB4QjI6IFwiU3RvcE1lZGlhXCIsXG4gICAgMHhCMzogXCJQbGF5UGF1c2VNZWRpYVwiLFxuICAgIDB4QjQ6IFwiU3RhcnRNYWlsXCIsXG4gICAgMHhCNTogXCJTZWxlY3RNZWRpYVwiLFxuICAgIDB4QjY6IFwiU3RhcnRBcHBsaWNhdGlvbk9uZVwiLFxuICAgIDB4Qjc6IFwiU3RhcnRBcHBsaWNhdGlvblR3b1wiLFxuICAgIDB4QkE6IFwiO1wiLFxuICAgIDB4QkI6IFwiK1wiLFxuICAgIDB4QkM6IFwiLFwiLFxuICAgIDB4QkQ6IFwiLVwiLFxuICAgIDB4QkU6IFwiLlwiLFxuICAgIDB4QkY6IFwiL1wiLFxuICAgIDB4QzA6IFwiYFwiLFxuICAgIDB4REI6IFwiW1wiLFxuICAgIDB4REM6IFwiXFxcXFwiLFxuICAgIDB4REQ6IFwiXVwiLFxuICAgIDB4REU6IFwiJ1wiXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgS2V5SWRzOiBSZWFkb25seTxBcnJheTxGS2V5SWQ+PiA9XG5bXG4gICAgXCJNb3VzZVgxXCIsXG4gICAgXCJNb3VzZVgyXCIsXG4gICAgXCJCYWNrc3BhY2VcIixcbiAgICBcIlRhYlwiLFxuICAgIFwiRW50ZXJcIixcbiAgICBcIlNoaWZ0XCIsXG4gICAgXCJDdHJsXCIsXG4gICAgXCJBbHRcIixcbiAgICBcIlBhdXNlXCIsXG4gICAgXCJTcGFjZVwiLFxuICAgIFwiUGdVcFwiLFxuICAgIFwiUGdEb3duXCIsXG4gICAgXCJFbmRcIixcbiAgICBcIkhvbWVcIixcbiAgICBcIkxlZnRBcnJvd1wiLFxuICAgIFwiVXBBcnJvd1wiLFxuICAgIFwiUmlnaHRBcnJvd1wiLFxuICAgIFwiRG93bkFycm93XCIsXG4gICAgXCJJbnNcIixcbiAgICBcIkRlbFwiLFxuICAgIFwiMFwiLFxuICAgIFwiMVwiLFxuICAgIFwiMlwiLFxuICAgIFwiM1wiLFxuICAgIFwiNFwiLFxuICAgIFwiNVwiLFxuICAgIFwiNlwiLFxuICAgIFwiN1wiLFxuICAgIFwiOFwiLFxuICAgIFwiOVwiLFxuICAgIFwiQVwiLFxuICAgIFwiQlwiLFxuICAgIFwiQ1wiLFxuICAgIFwiRFwiLFxuICAgIFwiRVwiLFxuICAgIFwiRlwiLFxuICAgIFwiR1wiLFxuICAgIFwiSFwiLFxuICAgIFwiSVwiLFxuICAgIFwiSlwiLFxuICAgIFwiS1wiLFxuICAgIFwiTFwiLFxuICAgIFwiTVwiLFxuICAgIFwiTlwiLFxuICAgIFwiT1wiLFxuICAgIFwiUFwiLFxuICAgIFwiUVwiLFxuICAgIFwiUlwiLFxuICAgIFwiU1wiLFxuICAgIFwiVFwiLFxuICAgIFwiVVwiLFxuICAgIFwiVlwiLFxuICAgIFwiV1wiLFxuICAgIFwiWFwiLFxuICAgIFwiWVwiLFxuICAgIFwiWlwiLFxuICAgIFwiTFdpblwiLFxuICAgIFwiUldpblwiLFxuICAgIFwiQXBwbGljYXRpb25zXCIsXG4gICAgXCJOdW0wXCIsXG4gICAgXCJOdW0xXCIsXG4gICAgXCJOdW0yXCIsXG4gICAgXCJOdW0zXCIsXG4gICAgXCJOdW00XCIsXG4gICAgXCJOdW01XCIsXG4gICAgXCJOdW02XCIsXG4gICAgXCJOdW03XCIsXG4gICAgXCJOdW04XCIsXG4gICAgXCJOdW05XCIsXG4gICAgXCJNdWx0aXBseVwiLFxuICAgIFwiQWRkXCIsXG4gICAgXCJTdWJ0cmFjdFwiLFxuICAgIFwiTnVtRGVjaW1hbFwiLFxuICAgIFwiTnVtRGl2aWRlXCIsXG4gICAgXCJGMVwiLFxuICAgIFwiRjJcIixcbiAgICBcIkYzXCIsXG4gICAgXCJGNFwiLFxuICAgIFwiRjVcIixcbiAgICBcIkY2XCIsXG4gICAgXCJGN1wiLFxuICAgIFwiRjhcIixcbiAgICBcIkY5XCIsXG4gICAgXCJGMTBcIixcbiAgICBcIkYxMVwiLFxuICAgIFwiRjEyXCIsXG4gICAgXCJGMTNcIixcbiAgICBcIkYxNFwiLFxuICAgIFwiRjE1XCIsXG4gICAgXCJGMTZcIixcbiAgICBcIkYxN1wiLFxuICAgIFwiRjE4XCIsXG4gICAgXCJGMTlcIixcbiAgICBcIkYyMFwiLFxuICAgIFwiRjIxXCIsXG4gICAgXCJGMjJcIixcbiAgICBcIkYyM1wiLFxuICAgIFwiRjI0XCIsXG4gICAgXCJMU2hpZnRcIixcbiAgICBcIlJTaGlmdFwiLFxuICAgIFwiTEN0cmxcIixcbiAgICBcIlJDdHJsXCIsXG4gICAgXCJMQWx0XCIsXG4gICAgXCJSQWx0XCIsXG4gICAgXCJCcm93c2VyQmFja1wiLFxuICAgIFwiQnJvd3NlckZvcndhcmRcIixcbiAgICBcIkJyb3dzZXJSZWZyZXNoXCIsXG4gICAgXCJCcm93c2VyU3RvcFwiLFxuICAgIFwiQnJvd3NlclNlYXJjaFwiLFxuICAgIFwiQnJvd3NlckZhdm9yaXRlc1wiLFxuICAgIFwiQnJvd3NlclN0YXJ0XCIsXG4gICAgXCJOZXh0VHJhY2tcIixcbiAgICBcIlByZXZpb3VzVHJhY2tcIixcbiAgICBcIlN0b3BNZWRpYVwiLFxuICAgIFwiUGxheVBhdXNlTWVkaWFcIixcbiAgICBcIlN0YXJ0TWFpbFwiLFxuICAgIFwiU2VsZWN0TWVkaWFcIixcbiAgICBcIlN0YXJ0QXBwbGljYXRpb25PbmVcIixcbiAgICBcIlN0YXJ0QXBwbGljYXRpb25Ud29cIixcbiAgICBcIjtcIixcbiAgICBcIitcIixcbiAgICBcIixcIixcbiAgICBcIi1cIixcbiAgICBcIi5cIixcbiAgICBcIi9cIixcbiAgICBcImBcIixcbiAgICBcIltcIixcbiAgICBcIlxcXFxcIixcbiAgICBcIl1cIixcbiAgICBcIidcIlxuXSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IElzS2V5SWQgPSAoSW46IHN0cmluZyk6IEluIGlzIEZLZXlJZCA9Plxue1xuICAgIHJldHVybiBLZXlJZHMuaW5jbHVkZXMoSW4gYXMgRktleUlkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRLZXlOYW1lID0gKFZrQ29kZTogRlZpcnR1YWxLZXkpOiBGS2V5SWQgPT5cbntcbiAgICByZXR1cm4gS2V5SWRzQnlJZFtWa0NvZGVdO1xufTtcblxuLyoqIERldmVsb3Blci1mcmllbmRseSBuYW1lcyBvZiBrZXkgY29kZXMuICovXG5leHBvcnQgY29uc3QgVms6IFJlYWRvbmx5PFJlY29yZDxGS2V5SWQsIEZWaXJ0dWFsS2V5Pj4gPVxue1xuICAgIE1vdXNlWDE6IDB4MDUsXG4gICAgTW91c2VYMjogMHgwNixcbiAgICBCYWNrc3BhY2U6IDB4MDgsXG4gICAgVGFiOiAweDA5LFxuICAgIEVudGVyOiAweDBELFxuICAgIFNoaWZ0OiAweDEwLFxuICAgIEN0cmw6IDB4MTEsXG4gICAgQWx0OiAweDEyLFxuICAgIFBhdXNlOiAweDEzLFxuICAgIFNwYWNlOiAweDIwLFxuICAgIFBnVXA6IDB4MjEsXG4gICAgUGdEb3duOiAweDIyLFxuICAgIEVuZDogMHgyMyxcbiAgICBIb21lOiAweDI0LFxuICAgIExlZnRBcnJvdzogMHgyNSxcbiAgICBVcEFycm93OiAweDI2LFxuICAgIFJpZ2h0QXJyb3c6IDB4MjcsXG4gICAgRG93bkFycm93OiAweDI4LFxuICAgIEluczogMHgyRCxcbiAgICBEZWw6IDB4MkUsXG4gICAgMDogMHgzMCxcbiAgICAxOiAweDMxLFxuICAgIDI6IDB4MzIsXG4gICAgMzogMHgzMyxcbiAgICA0OiAweDM0LFxuICAgIDU6IDB4MzUsXG4gICAgNjogMHgzNixcbiAgICA3OiAweDM3LFxuICAgIDg6IDB4MzgsXG4gICAgOTogMHgzOSxcbiAgICBBOiAweDQxLFxuICAgIEI6IDB4NDIsXG4gICAgQzogMHg0MyxcbiAgICBEOiAweDQ0LFxuICAgIEU6IDB4NDUsXG4gICAgRjogMHg0NixcbiAgICBHOiAweDQ3LFxuICAgIEg6IDB4NDgsXG4gICAgSTogMHg0OSxcbiAgICBKOiAweDRBLFxuICAgIEs6IDB4NEIsXG4gICAgTDogMHg0QyxcbiAgICBNOiAweDRELFxuICAgIE46IDB4NEUsXG4gICAgTzogMHg0RixcbiAgICBQOiAweDUwLFxuICAgIFE6IDB4NTEsXG4gICAgUjogMHg1MixcbiAgICBTOiAweDUzLFxuICAgIFQ6IDB4NTQsXG4gICAgVTogMHg1NSxcbiAgICBWOiAweDU2LFxuICAgIFc6IDB4NTcsXG4gICAgWDogMHg1OCxcbiAgICBZOiAweDU5LFxuICAgIFo6IDB4NUEsXG4gICAgTFdpbjogMHg1QixcbiAgICBSV2luOiAweDVDLFxuICAgIEFwcGxpY2F0aW9uczogMHg1RCxcbiAgICBOdW0wOiAweDYwLFxuICAgIE51bTE6IDB4NjEsXG4gICAgTnVtMjogMHg2MixcbiAgICBOdW0zOiAweDYzLFxuICAgIE51bTQ6IDB4NjQsXG4gICAgTnVtNTogMHg2NSxcbiAgICBOdW02OiAweDY2LFxuICAgIE51bTc6IDB4NjcsXG4gICAgTnVtODogMHg2OCxcbiAgICBOdW05OiAweDY5LFxuICAgIE11bHRpcGx5OiAweDZBLFxuICAgIEFkZDogMHg2QixcbiAgICBTdWJ0cmFjdDogMHg2RCxcbiAgICBOdW1EZWNpbWFsOiAweDZFLFxuICAgIE51bURpdmlkZTogMHg2RixcbiAgICBGMTogMHg3MCxcbiAgICBGMjogMHg3MSxcbiAgICBGMzogMHg3MixcbiAgICBGNDogMHg3MyxcbiAgICBGNTogMHg3NCxcbiAgICBGNjogMHg3NSxcbiAgICBGNzogMHg3NixcbiAgICBGODogMHg3NyxcbiAgICBGOTogMHg3OCxcbiAgICBGMTA6IDB4NzksXG4gICAgRjExOiAweDdBLFxuICAgIEYxMjogMHg3QixcbiAgICBGMTM6IDB4N0MsXG4gICAgRjE0OiAweDdELFxuICAgIEYxNTogMHg3RSxcbiAgICBGMTY6IDB4N0YsXG4gICAgRjE3OiAweDgwLFxuICAgIEYxODogMHg4MSxcbiAgICBGMTk6IDB4ODIsXG4gICAgRjIwOiAweDgzLFxuICAgIEYyMTogMHg4NCxcbiAgICBGMjI6IDB4ODUsXG4gICAgRjIzOiAweDg2LFxuICAgIEYyNDogMHg4NyxcbiAgICBMU2hpZnQ6IDB4QTAsXG4gICAgUlNoaWZ0OiAweEExLFxuICAgIExDdHJsOiAweEEyLFxuICAgIFJDdHJsOiAweEEzLFxuICAgIExBbHQ6IDB4QTQsXG4gICAgUkFsdDogMHhBNSxcbiAgICBCcm93c2VyQmFjazogMHhBNixcbiAgICBCcm93c2VyRm9yd2FyZDogMHhBNyxcbiAgICBCcm93c2VyUmVmcmVzaDogMHhBOCxcbiAgICBCcm93c2VyU3RvcDogMHhBOSxcbiAgICBCcm93c2VyU2VhcmNoOiAweEFBLFxuICAgIEJyb3dzZXJGYXZvcml0ZXM6IDB4QUIsXG4gICAgQnJvd3NlclN0YXJ0OiAweEFDLFxuICAgIE5leHRUcmFjazogMHhCMCxcbiAgICBQcmV2aW91c1RyYWNrOiAweEIxLFxuICAgIFN0b3BNZWRpYTogMHhCMixcbiAgICBQbGF5UGF1c2VNZWRpYTogMHhCMyxcbiAgICBTdGFydE1haWw6IDB4QjQsXG4gICAgU2VsZWN0TWVkaWE6IDB4QjUsXG4gICAgU3RhcnRBcHBsaWNhdGlvbk9uZTogMHhCNixcbiAgICBTdGFydEFwcGxpY2F0aW9uVHdvOiAweEI3LFxuICAgIFwiO1wiOiAweEJBLFxuICAgIFwiK1wiOiAweEJCLFxuICAgIFwiLFwiOiAweEJDLFxuICAgIFwiLVwiOiAweEJELFxuICAgIFwiLlwiOiAweEJFLFxuICAgIFwiL1wiOiAweEJGLFxuICAgIFwiYFwiOiAweEMwLFxuICAgIFwiW1wiOiAweERCLFxuICAgIFwiXFxcXFwiOiAweERDLFxuICAgIFwiXVwiOiAweERELFxuICAgIFwiJ1wiOiAweERFXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgVmlydHVhbEtleXM6IFJlYWRvbmx5PFRBcnJheTxGVmlydHVhbEtleT4+ID1cbltcbiAgICAweDA1LFxuICAgIDB4MDYsXG4gICAgMHgwOCxcbiAgICAweDA5LFxuICAgIDB4MEQsXG4gICAgMHgxMCxcbiAgICAweDExLFxuICAgIDB4MTIsXG4gICAgMHgxMyxcbiAgICAweDIwLFxuICAgIDB4MjEsXG4gICAgMHgyMixcbiAgICAweDIzLFxuICAgIDB4MjQsXG4gICAgMHgyNSxcbiAgICAweDI2LFxuICAgIDB4MjcsXG4gICAgMHgyOCxcbiAgICAweDJELFxuICAgIDB4MkUsXG4gICAgMHgzMCxcbiAgICAweDMxLFxuICAgIDB4MzIsXG4gICAgMHgzMyxcbiAgICAweDM0LFxuICAgIDB4MzUsXG4gICAgMHgzNixcbiAgICAweDM3LFxuICAgIDB4MzgsXG4gICAgMHgzOSxcbiAgICAweDQxLFxuICAgIDB4NDIsXG4gICAgMHg0MyxcbiAgICAweDQ0LFxuICAgIDB4NDUsXG4gICAgMHg0NixcbiAgICAweDQ3LFxuICAgIDB4NDgsXG4gICAgMHg0OSxcbiAgICAweDRBLFxuICAgIDB4NEIsXG4gICAgMHg0QyxcbiAgICAweDRELFxuICAgIDB4NEUsXG4gICAgMHg0RixcbiAgICAweDUwLFxuICAgIDB4NTEsXG4gICAgMHg1MixcbiAgICAweDUzLFxuICAgIDB4NTQsXG4gICAgMHg1NSxcbiAgICAweDU2LFxuICAgIDB4NTcsXG4gICAgMHg1OCxcbiAgICAweDU5LFxuICAgIDB4NUEsXG4gICAgMHg1QixcbiAgICAweDVDLFxuICAgIDB4NUQsXG4gICAgMHg2MCxcbiAgICAweDYxLFxuICAgIDB4NjIsXG4gICAgMHg2MyxcbiAgICAweDY0LFxuICAgIDB4NjUsXG4gICAgMHg2NixcbiAgICAweDY3LFxuICAgIDB4NjgsXG4gICAgMHg2OSxcbiAgICAweDZBLFxuICAgIDB4NkIsXG4gICAgMHg2RCxcbiAgICAweDZFLFxuICAgIDB4NkYsXG4gICAgMHg3MCxcbiAgICAweDcxLFxuICAgIDB4NzIsXG4gICAgMHg3MyxcbiAgICAweDc0LFxuICAgIDB4NzUsXG4gICAgMHg3NixcbiAgICAweDc3LFxuICAgIDB4NzgsXG4gICAgMHg3OSxcbiAgICAweDdBLFxuICAgIDB4N0IsXG4gICAgMHg3QyxcbiAgICAweDdELFxuICAgIDB4N0UsXG4gICAgMHg3RixcbiAgICAweDgwLFxuICAgIDB4ODEsXG4gICAgMHg4MixcbiAgICAweDgzLFxuICAgIDB4ODQsXG4gICAgMHg4NSxcbiAgICAweDg2LFxuICAgIDB4ODcsXG4gICAgMHhBMCxcbiAgICAweEExLFxuICAgIDB4QTIsXG4gICAgMHhBMyxcbiAgICAweEE0LFxuICAgIDB4QTUsXG4gICAgMHhBNixcbiAgICAweEE3LFxuICAgIDB4QTgsXG4gICAgMHhBOSxcbiAgICAweEFBLFxuICAgIDB4QUIsXG4gICAgMHhBQyxcbiAgICAweEIwLFxuICAgIDB4QjEsXG4gICAgMHhCMixcbiAgICAweEIzLFxuICAgIDB4QjQsXG4gICAgMHhCNSxcbiAgICAweEI2LFxuICAgIDB4QjcsXG4gICAgMHhCQSxcbiAgICAweEJCLFxuICAgIDB4QkMsXG4gICAgMHhCRCxcbiAgICAweEJFLFxuICAgIDB4QkYsXG4gICAgMHhDMCxcbiAgICAweERCLFxuICAgIDB4REMsXG4gICAgMHhERCxcbiAgICAweERFXG5dIGFzIGNvbnN0O1xuXG4vKiBlc2xpbnQtZW5hYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogSXMgdGhlIGBLZXlDb2RlYCBhIFZLIENvZGUgKip0aGF0IHRoaXMgYXBwIHVzZXM/KiogKi9cbmV4cG9ydCBjb25zdCBJc1ZpcnR1YWxLZXkgPSAoS2V5Q29kZTogbnVtYmVyKTogS2V5Q29kZSBpcyBGVmlydHVhbEtleSA9Plxue1xuICAgIHJldHVybiBWaXJ0dWFsS2V5cy5pbmNsdWRlcyhLZXlDb2RlIGFzIEZWaXJ0dWFsS2V5KTtcbn07XG4iLCIvKiBGaWxlOiAgICAgIExvZy5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkxvZ0xldmVsLCBGTG9nT3JpZ2luIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHR5cGUgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5cbmV4cG9ydCB0eXBlIEZDaGFsa0JhY2tncm91bmQgPSBFeHRyYWN0PGtleW9mIHR5cGVvZiBjaGFsaywgYGJnJHsgc3RyaW5nIH1gPjtcblxuZXhwb3J0IHR5cGUgRkNoYWxrRm9yZWdyb3VuZCA9IEV4dHJhY3Q8a2V5b2YgdHlwZW9mIGNoYWxrLCBcImJsYWNrXCIgfCBcIndoaXRlQnJpZ2h0XCI+O1xuXG5leHBvcnQgdHlwZSBGTG9nRnVuY3Rpb24gPSAoLi4uU3RhdGVtZW50czogVEFycmF5PHVua25vd24+KSA9PiB2b2lkO1xuXG5leHBvcnQgdHlwZSBGTG9nRm9ybWF0RnVuY3Rpb24gPSAoU3RhdGVtZW50OiB1bmtub3duKSA9PiB1bmtub3duO1xuXG5leHBvcnQgdHlwZSBGTG9nZ2VyUmVjb3JkID0gUmVjb3JkPEV4Y2x1ZGU8RkxvZ0xldmVsLCBcIk5vcm1hbFwiPiwgRkxvZ0Z1bmN0aW9uPjtcblxuZXhwb3J0IHR5cGUgRkxvZ09yaWdpbkV4dGVuZGVkID0gRkxvZ09yaWdpbiB8IFwiKlwiO1xuXG5leHBvcnQgdHlwZSBGTG9nRGlnaXRTZXBhcmF0b3IgPVxuICAgIHwgXCJTcGFjZVwiXG4gICAgfCBcIkNvbW1hXCJcbiAgICB8IFwiVW5kZXJzY29yZVwiXG4gICAgfCBcIk5vbmVcIjtcblxuZXhwb3J0IHR5cGUgRkxvZ1F1b3RlU3R5bGUgPVxuICAgIHwgXCJEb3VibGVcIlxuICAgIHwgXCJTaW5nbGVcIlxuICAgIHwgXCJOb25lXCI7XG5cbmV4cG9ydCB0eXBlIEZMb2dTZXR0aW5ncyA9IFJlYWRvbmx5PHtcbiAgICBDYXRlZ29yeTpcbiAgICB7XG4gICAgICAgIERpc2FibGVkQ2F0ZWdvcmllczpcbiAgICAgICAge1xuICAgICAgICAgICAgWyBMb2dPcmlnaW4gaW4gRkxvZ09yaWdpbkV4dGVuZGVkIF06IFRBcnJheTxzdHJpbmc+O1xuICAgICAgICB9O1xuICAgICAgICBMb2dEaXNhYmxlZENhdGVnb3J5QXR0ZW1wdHM6IGJvb2xlYW47XG4gICAgfTtcbiAgICBGb3JtYXQ6XG4gICAge1xuICAgICAgICBBbHdheXNBcHBseUZvcm1hdDogYm9vbGVhbjtcbiAgICAgICAgQ29sb3JzOiBib29sZWFuO1xuICAgICAgICBEaWdpdFNlcGFyYXRvcjogRkxvZ0RpZ2l0U2VwYXJhdG9yO1xuICAgICAgICBRdW90ZVN0eWxlOiBGTG9nUXVvdGVTdHlsZTtcbiAgICAgICAgVHJ1bmNhdGVCYXNlNjRTdHJpbmdzOiBib29sZWFuO1xuICAgIH07XG4gICAgU2l6ZTpcbiAgICB7XG4gICAgICAgIExpbWl0U3RhdGVtZW50TGVuZ3RoOlxuICAgICAgICB7XG4gICAgICAgICAgICBFbmFibGVkOiBib29sZWFuO1xuICAgICAgICAgICAgTWF4TGVuZ3RoOiBudW1iZXI7XG4gICAgICAgIH07XG4gICAgICAgIE1heFRlcm1pbmFsV2lkdGg6IG51bWJlcjtcbiAgICAgICAgVGFiV2lkdGg6IG51bWJlcjtcbiAgICB9O1xufT47XG5cbmV4cG9ydCB0eXBlIEZMb2dnZXIgPSBGTG9nZ2VyUmVjb3JkICYgRkxvZ0Z1bmN0aW9uO1xuXG5leHBvcnQgdHlwZSBGTG9nZ2VySW50ZXJpbSA9IEZMb2dGdW5jdGlvbiAmIFBhcnRpYWw8RkxvZ2dlclJlY29yZD47XG5cbmV4cG9ydCB0eXBlIEZMb2cgPSAoLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIEZHZXRUaW1lVG9rZW4gPSBcIl9fR2V0VGltZV9fXCI7XG5cbmV4cG9ydCB0eXBlIEZMb2dGcm9udGVuZFRva2VucyA9XG4gICAgfCBGR2V0VGltZVRva2VuO1xuIiwiLyogRmlsZTogICAgICBMb2cudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZHZXRUaW1lVG9rZW4gfSBmcm9tIFwiLi9Mb2cuVHlwZXNcIjtcblxuZXhwb3J0IGNvbnN0IEdldFRpbWVUb2tlbjogRkdldFRpbWVUb2tlbiA9IFwiX19HZXRUaW1lX19cIiBhcyBjb25zdDtcbiIsIi8qIEZpbGU6ICAgICAgS2V5YmluZC5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgVEludGVncmFsUmFuZ2UsIFRTdGF0aWNBcnJheSB9IGZyb20gXCIuLi8uLi9TaGFyZWQvVXRpbGl0eVwiO1xuaW1wb3J0IHR5cGUgeyBGS2V5SWQgfSBmcm9tIFwiLi4vLi4vU2hhcmVkL0tleWJvYXJkLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZLZXliaW5kRGlyZWN0aW9uID1cbiAgICB8IFwiTGVmdFwiXG4gICAgfCBcIlVwXCJcbiAgICB8IFwiRG93blwiXG4gICAgfCBcIlJpZ2h0XCI7XG5cbmV4cG9ydCB0eXBlIEZLZXliaW5kQWN0aW9uTGV2ZWwgPVxuICAgIHwgXCJQcmltYXJ5XCJcbiAgICB8IFwiU2Vjb25kYXJ5XCI7XG5cbmV4cG9ydCB0eXBlIEZLZXlTZXF1ZW5jZVNldCA9IFJlY29yZDxUSW50ZWdyYWxSYW5nZTwwLCAzPiwgQXJyYXk8RktleUlkPj47XG5cbmV4cG9ydCB0eXBlIEZLZXliaW5kQWN0aW9uTWlzY2VsbGFuZW91cyA9XG4gICAgfCBcIlBlZWtcIlxuICAgIHwgXCJGb2N1c0xpc3RcIlxuICAgIHwgXCJGb2N1c1RleHRJbnB1dFwiXG4gICAgfCBcIlNldHRpbmdzXCI7XG5cbmV4cG9ydCB0eXBlIEZLZXliaW5kcyA9XG4gICAgUmVjb3JkPEZLZXliaW5kQWN0aW9uTGV2ZWwsIEZLZXlTZXF1ZW5jZVNldD4gJlxuICAgIHtcbiAgICAgICAgQWN0aXZhdGU6IEFycmF5PEZLZXlJZD47XG4gICAgICAgIENhbmNlbDogQXJyYXk8RktleUlkPjtcbiAgICAgICAgRGlyZWN0aW9uOiBSZWNvcmQ8RktleWJpbmREaXJlY3Rpb24sIEFycmF5PEZLZXlJZD4+O1xuICAgICAgICBNaXNjZWxsYW5lb3VzOiBSZWNvcmQ8RktleWJpbmRBY3Rpb25NaXNjZWxsYW5lb3VzLCBBcnJheTxGS2V5SWQ+PjtcbiAgICB9O1xuXG50eXBlIFRSZWN1cnJlbmNlPFR5cGU+ID0gVHlwZSBleHRlbmRzIFJlY29yZDxQcm9wZXJ0eUtleSwgUmVjb3JkPFByb3BlcnR5S2V5LCB1bmtub3duPj5cbiAgICA/IHtcbiAgICAgICAgWyBLZXkgaW4ga2V5b2YgVHlwZSBdOiBUUmVjdXJyZW5jZTxUeXBlW0tleV0+O1xuICAgIH1cbiAgICA6IFR5cGUgZXh0ZW5kcyBSZWNvcmQ8UHJvcGVydHlLZXksIHVua25vd24+XG4gICAgICAgID8ge1xuICAgICAgICAgICAgWyBLZXkgaW4ga2V5b2YgVHlwZSBdOiBzdHJpbmc7XG4gICAgICAgIH1cbiAgICAgICAgOiBzdHJpbmc7XG5cbmV4cG9ydCB0eXBlIEZLZXliaW5kRGlzcGxheU5hbWVzID0gVFJlY3VycmVuY2U8RktleWJpbmRzPjtcblxuZXhwb3J0IHR5cGUgRkFjdGlvbktleSA9XG4gICAgfCBgJHsgRktleWJpbmRBY3Rpb25MZXZlbCB9WyR7IGtleW9mIEZLZXlTZXF1ZW5jZVNldCB9XWBcbiAgICB8IGBEaXJlY3Rpb24uJHsgRktleWJpbmREaXJlY3Rpb24gfWBcbiAgICB8IGBNaXNjZWxsYW5lb3VzLiR7IEZLZXliaW5kQWN0aW9uTWlzY2VsbGFuZW91cyB9YFxuICAgIHwgXCJBY3RpdmF0ZVwiXG4gICAgfCBcIkNhbmNlbFwiO1xuXG5leHBvcnQgdHlwZSBGQWN0aW9uID0gVFN0YXRpY0FycmF5PEZBY3Rpb25LZXksIFRJbnRlZ3JhbFJhbmdlPDEsIDQ+PjtcblxuZXhwb3J0IHR5cGUgRktleVNpZGUgPVxuICAgIHwgXCJMXCJcbiAgICB8IFwiUlwiXG4gICAgfCBcIkVpdGhlclwiXG4gICAgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIEZLZXkgPVxue1xuICAgIC8qKiBUZXh0IHRvIGRpc3BsYXkgb24gdGhlIGtleSwgb3IgYSBzeW1ib2wgdGhhdCBpcyByZW5kZXJlZCBpbiB0aGUgY2VudGVyIG9mIHRoZSBrZXkuICovXG4gICAgRGlzcGxheTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gYWRkaXRpb25hbCBkZXNjcmlwdG9yLCBzaG93biBpbiB0aGUgY29ybmVyLlxuICAgICAqIFNob3VsZCBiZSBgdW5kZWZpbmVkYCB3aGVuZXZlciBgU2lkZWAgaXMgZGVmaW5lZC5cbiAgICAgKi9cbiAgICBNb2RpZmllcjogdW5kZWZpbmVkIHwgc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFwic2lkZVwiIG9mIHRoZSBrZXkgaXM6XG4gICAgICogICAgICogYFwiTGVmdFwiYCBvciBgXCJSaWdodFwiYCBpbiB0aGUgY2FzZSBvZiBrZXlzIGxpa2UgbGVmdCBzaGlmdFxuICAgICAqICAgICAqIGBcIkVpdGhlclwiYCBpbiB0aGUgY2FzZSBvZiBrZXlzIHRoYXQgZG8gbm90IGhhdmUgYSBzaWRlLFxuICAgICAqICAgICAgIGJ1dCBoYXZlIGNvcnJlc3BvbmRpbmcga2V5IGNvZGVzIHRoYXQgKmRvKiBoYXZlIHNpZGVzLlxuICAgICAqICAgICAqIGB1bmRlZmluZWRgIGZvciBcIm5vcm1hbFwiIGtleXMsIHN1Y2ggYXMgbGV0dGVycyBhbmQgbnVtYmVyc1xuICAgICAqL1xuICAgIFNpZGU6IEZLZXlTaWRlO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgS2V5YmluZC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG5pbXBvcnQgdHlwZSB7IEZBY3Rpb25LZXksIEZLZXkgfSBmcm9tIFwiLi9LZXliaW5kLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZWaXJ0dWFsS2V5IH0gZnJvbSBcIi4uLy4uL1NoYXJlZC9LZXlib2FyZC5UeXBlc1wiO1xuXG5jb25zdCBXaW5kb3dzTG9nbzogc3RyaW5nID0gXCJcXHVFNzgyXCI7XG5jb25zdCBHbG9iZVN5bWJvbDogc3RyaW5nID0gXCJcXHVFNzc0XCI7XG5jb25zdCBOdW1Nb2RpZmllcjogc3RyaW5nID0gXCJOVU1cIjtcbmNvbnN0IFNoaWZ0U3ltYm9sOiBzdHJpbmcgPSBcIlxcdUU3NTJcIjtcblxuZXhwb3J0IGNvbnN0IEtleXM6IFJlYWRvbmx5PFJlY29yZDxGVmlydHVhbEtleSwgRktleT4+ID1cbntcbiAgICAweDA1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFOTYyXCIsXG4gICAgICAgIE1vZGlmaWVyOiBcIjFcIixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDA2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFOTYyXCIsXG4gICAgICAgIE1vZGlmaWVyOiBcIjJcIixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDA4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzUwXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgwOTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTdGRFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MEQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3NTFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDEwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzUyXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiRWl0aGVyXCJcbiAgICB9LFxuICAgIDB4MTE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkNUUkxcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJFaXRoZXJcIlxuICAgIH0sXG4gICAgMHgxMjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQUxUXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiRWl0aGVyXCJcbiAgICB9LFxuICAgIDB4MTM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU4MUFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDIwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzVEXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyMTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiUGdVcFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MjI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlBnRG93blwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MjM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkVuZFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MjQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkhvbWVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDI1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJMZWZ0QXJyb3dcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDI2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJVcEFycm93XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyNzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiUmlnaHRBcnJvd1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Mjg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkRvd25BcnJvd1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MkQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkluc1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MkU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkRlbFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MzA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDMxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIxXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzMjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiMlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MzM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjNcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDM0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI0XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzNTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiNVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MzY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjZcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDM3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI3XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiOFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Mzk6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjlcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJBXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0MjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkNcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQ0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJEXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0NTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkZcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQ3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJHXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0ODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiSFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDk6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIklcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDRBOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJKXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0QjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiS1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NEM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkxcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDREOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJNXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0RTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiTlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NEY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIk9cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDUwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJQXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1MTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiUVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlJcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDUzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJTXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1NDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiVFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDU2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJWXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1NzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiV1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlhcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDU5OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJZXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1QTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiWlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NUI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBXaW5kb3dzTG9nbyxcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJMXCJcbiAgICB9LFxuICAgIDB4NUM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBXaW5kb3dzTG9nbyxcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJSXCJcbiAgICB9LFxuICAgIDB4NUQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MDBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDYwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIwXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDYxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIxXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDYyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIyXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDYzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIzXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDY0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI0XCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDY1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI1XCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDY2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI2XCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDY3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI3XCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDY4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI4XCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDY5OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI5XCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDZBOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCLDl1wiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2QjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiK1wiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2RDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiLVwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2RTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiLlwiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg2RjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiL1wiLFxuICAgICAgICBNb2RpZmllcjogTnVtTW9kaWZpZXIsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3MDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDcxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NzI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYzXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3MzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDc0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGNVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NzU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkY2XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3NjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjdcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDc3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGOFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Nzg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkY5XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3OTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjEwXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3QTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjExXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3QjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjEyXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3QzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjEzXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3RDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjE0XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3RTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjE1XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3RjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjE2XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4MDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjE3XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4MTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjE4XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4MjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjE5XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4MzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjIwXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4NDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjIxXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4NTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjIyXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4NjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjIzXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg4NzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjI0XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhBMDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFNoaWZ0U3ltYm9sLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIkxcIlxuICAgIH0sXG4gICAgMHhBMTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFNoaWZ0U3ltYm9sLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIlJcIlxuICAgIH0sXG4gICAgMHhBMjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQ1RSTFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIkxcIlxuICAgIH0sXG4gICAgMHhBMzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQ1RSTFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIlJcIlxuICAgIH0sXG4gICAgMHhBNDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQUxUXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiTFwiXG4gICAgfSxcbiAgICAweEE1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJBTFRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJSXCJcbiAgICB9LFxuICAgIDB4QTY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIiYjRTcyQlwiLFxuICAgICAgICBNb2RpZmllcjogR2xvYmVTeW1ib2wsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhBNzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTcyQVwiLFxuICAgICAgICBNb2RpZmllcjogR2xvYmVTeW1ib2wsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhBODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTcyQ1wiLFxuICAgICAgICBNb2RpZmllcjogR2xvYmVTeW1ib2wsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhBOTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTczM1wiLFxuICAgICAgICBNb2RpZmllcjogR2xvYmVTeW1ib2wsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhBQTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTcyMVwiLFxuICAgICAgICBNb2RpZmllcjogR2xvYmVTeW1ib2wsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhBQjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTcyOFwiLFxuICAgICAgICBNb2RpZmllcjogR2xvYmVTeW1ib2wsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhBQzpcbiAgICB7XG4gICAgICAgIC8qIEBUT0RPIENvbnNpZGVyIHVzaW5nIGEgZGlmZmVyZW50IGljb24uICovXG4gICAgICAgIERpc3BsYXk6IFwiXFx1RjcxQ1wiLFxuICAgICAgICBNb2RpZmllcjogR2xvYmVTeW1ib2wsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCMDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RUI5RFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QjE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUVCOUVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEIyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzFBXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCMzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTc2OFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QjQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MTVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEI1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFQTY5XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCNjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RUIzQlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Qjc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUVEMzVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEJBOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI7XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCQjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiK1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QkM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIixcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEJEOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCItXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCRTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiLlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QkY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIi9cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEMwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJgXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhEQjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiW1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4REM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcXFxcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEREOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJdXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhERTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiJ1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9XG59O1xuXG5leHBvcnQgY29uc3QgQWN0aW9uS2V5czogUmVhZG9ubHk8QXJyYXk8RkFjdGlvbktleT4+ID1cbltcbiAgICBcIkFjdGl2YXRlXCIsXG4gICAgXCJDYW5jZWxcIixcbiAgICBcIkRpcmVjdGlvbi5Eb3duXCIsXG4gICAgXCJEaXJlY3Rpb24uTGVmdFwiLFxuICAgIFwiRGlyZWN0aW9uLlJpZ2h0XCIsXG4gICAgXCJEaXJlY3Rpb24uVXBcIixcbiAgICBcIk1pc2NlbGxhbmVvdXMuRm9jdXNMaXN0XCIsXG4gICAgXCJNaXNjZWxsYW5lb3VzLkZvY3VzVGV4dElucHV0XCIsXG4gICAgXCJNaXNjZWxsYW5lb3VzLlBlZWtcIixcbiAgICBcIk1pc2NlbGxhbmVvdXMuU2V0dGluZ3NcIixcbiAgICBcIlByaW1hcnlbMF1cIixcbiAgICBcIlByaW1hcnlbMV1cIixcbiAgICBcIlByaW1hcnlbMl1cIixcbiAgICBcIlByaW1hcnlbM11cIixcbiAgICBcIlNlY29uZGFyeVswXVwiLFxuICAgIFwiU2Vjb25kYXJ5WzFdXCIsXG4gICAgXCJTZWNvbmRhcnlbMl1cIixcbiAgICBcIlNlY29uZGFyeVszXVwiXG5dIGFzIGNvbnN0O1xuIiwiLyogRmlsZTogICAgICBTZXR0aW5ncy5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleWJpbmRzIH0gZnJvbSBcIi4vS2V5YmluZC5UeXBlc1wiO1xuXG4vKipcbiAqIFNvbWUgc2V0dGluZ3MgcmVnYXJkIHN0YXRlIHRoYXQgaXMgb3V0c2lkZSBvZiBTb3JyZWxsV20sXG4gKiBmb3IgZXhhbXBsZSwgZm9yIHRoZSBgUnVuT25TdGFydHVwYCBzZXR0aW5nIHRvIGJlIGhvbm9yZWQsXG4gKiBhIHRhc2sgbXVzdCBiZSByZWdpc3RlcmVkIHZpYSB0aGUgVGFzayBTY2hlZHVsZXIuICBJZiB0aGlzXG4gKiBmYWlscywgdGhlbiB0aGlzIGV4dGVybmFsIHN0YXRlICgqaS5lLiosIHRoZSBUYXNrIFNjaGVkdWxlcilcbiAqIGlzIGluY29uc2lzdGVudCB3aXRoIHRoZSB2YWx1ZSBvZiB0aGUgc2V0dGluZyBgUnVuT25TdGFydHVwYFxuICogaW4gU29ycmVsbFdtLlxuICovXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3R5cGVkZWYgKi9cbmV4cG9ydCBjb25zdCBFeHRlcm5hbFNldHRpbmdzID0gWyBcIlJ1bk9uU3RhcnR1cFwiIF0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIEZFeHRlcm5hbFNldHRpbmcgPSB0eXBlb2YgRXh0ZXJuYWxTZXR0aW5nc1tudW1iZXJdO1xuXG5leHBvcnQgdHlwZSBGU2V0dGluZ3MgPVxue1xuICAgIEFuaW1hdGlvblNjYWxhcjogbnVtYmVyO1xuICAgIEdhcDogbnVtYmVyO1xuICAgIFJ1bk9uU3RhcnR1cDogYm9vbGVhbjtcbiAgICBLZXliaW5kczogRktleWJpbmRzO1xuICAgIFNob3dVcGRhdGVOb3RpZmljYXRpb25zOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgRlNldHRpbmdzS2V5cyA9IGtleW9mIEZTZXR0aW5ncztcbiIsIi8qIEZpbGU6ICAgICAgU2V0dGluZ3MudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZTZXR0aW5ncyB9IGZyb20gXCIuL1NldHRpbmdzLlR5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0U2V0dGluZ3M6IEZTZXR0aW5ncyA9XG57XG4gICAgQW5pbWF0aW9uU2NhbGFyOiAxLFxuICAgIEdhcDogNCxcbiAgICBLZXliaW5kczpcbiAgICB7XG4gICAgICAgIEFjdGl2YXRlOiBbIFwiRjIwXCIgXSxcbiAgICAgICAgQ2FuY2VsOiBbIFwiQmFja3NwYWNlXCIgXSxcbiAgICAgICAgRGlyZWN0aW9uOlxuICAgICAgICB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBzb3J0LWtleXMgKi9cbiAgICAgICAgICAgIExlZnQ6IFsgXCJEXCIgXSxcbiAgICAgICAgICAgIFVwOiBbIFwiSFwiIF0sXG4gICAgICAgICAgICBEb3duOiBbIFwiVFwiIF0sXG4gICAgICAgICAgICBSaWdodDogWyBcIk5cIiBdXG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIHNvcnQta2V5cyAqL1xuICAgICAgICB9LFxuICAgICAgICBNaXNjZWxsYW5lb3VzOlxuICAgICAgICB7XG4gICAgICAgICAgICBGb2N1c0xpc3Q6IFsgXCJgXCIgXSxcbiAgICAgICAgICAgIEZvY3VzVGV4dElucHV0OiBbIFwiVGFiXCIgXSxcbiAgICAgICAgICAgIFBlZWs6IFsgXCJaXCIgXSxcbiAgICAgICAgICAgIFNldHRpbmdzOiBbIFwiK1wiIF1cbiAgICAgICAgfSxcbiAgICAgICAgUHJpbWFyeTpcbiAgICAgICAge1xuICAgICAgICAgICAgMDogWyBcIkZcIiBdLFxuICAgICAgICAgICAgMTogWyBcIkdcIiBdLFxuICAgICAgICAgICAgMjogWyBcIlRcIiBdLFxuICAgICAgICAgICAgMzogWyBcIlJcIiBdXG4gICAgICAgIH0sXG4gICAgICAgIFNlY29uZGFyeTpcbiAgICAgICAge1xuICAgICAgICAgICAgMDogWyBcIkN0cmxcIiwgXCJGXCIgXSxcbiAgICAgICAgICAgIDE6IFsgXCJDdHJsXCIsIFwiR1wiIF0sXG4gICAgICAgICAgICAyOiBbIFwiQ3RybFwiLCBcIlRcIiBdLFxuICAgICAgICAgICAgMzogWyBcIkN0cmxcIiwgXCJSXCIgXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBSdW5PblN0YXJ0dXA6IGZhbHNlLFxuICAgIFNob3dVcGRhdGVOb3RpZmljYXRpb25zOiB0cnVlXG59O1xuIiwiLyogRmlsZTogICAgICBpbmRleC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0tleWJpbmRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0tleWJpbmQuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TZXR0aW5ncy5UeXBlc1wiO1xuIiwiLyogRmlsZTogICAgICBTaGFyZWQuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBGQ2FyZGluYWxEaXJlY3Rpb24gPVxuICAgIHwgXCJVcFwiXG4gICAgfCBcIkRvd25cIlxuICAgIHwgXCJMZWZ0XCJcbiAgICB8IFwiUmlnaHRcIjtcblxuZXhwb3J0IHR5cGUgVEZ1bmN0aW9uPFBhcmFtZXRlclR5cGVzIGV4dGVuZHMgVEFycmF5PHVua25vd24+LCBSZXR1cm5UeXBlPiA9XG4gICAgKC4uLkFyZ3VtZW50czogUGFyYW1ldGVyVHlwZXMpID0+IFJldHVyblR5cGU7XG5cbmV4cG9ydCB0eXBlIEZOb3RGdW5jdGlvbiA9IEV4Y2x1ZGU8dW5rbm93biwgKC4uLkFyZ3VtZW50czogVEFycmF5PHVua25vd24+KSA9PiB1bmtub3duPjtcblxuZXhwb3J0IHR5cGUgRkF4aXMgPSBcIlhcIiB8IFwiWVwiO1xuIiwiLyogRmlsZTogICAgICBTdG9yZS5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIEZTdG9yZSA9XG57XG4gICAgQXBwVmVyc2lvbjogc3RyaW5nO1xuICAgIFRpbWVMYXN0Q2hlY2tlZFVwZGF0ZTogbnVtYmVyIHwgbnVsbDtcbn07XG4iLCIvKiBGaWxlOiAgICAgIFN0b3JlLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGU3RvcmUgfSBmcm9tIFwiLi9TdG9yZS5UeXBlc1wiO1xuLy8gaW1wb3J0IHsgYXBwIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5cbmV4cG9ydCBjb25zdCBHZXREZWZhdWx0U3RvcmUgPSAoKTogRlN0b3JlID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy8gQXBwVmVyc2lvbjogYXBwLmdldFZlcnNpb24oKSxcbiAgICAgICAgQXBwVmVyc2lvbjogXCJAVE9ET1wiLFxuICAgICAgICBUaW1lTGFzdENoZWNrZWRVcGRhdGU6IG51bGxcbiAgICB9O1xufTtcbiIsIi8qIEZpbGU6ICAgICAgVG9rZW5zLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKiBDb21tZW50OiAgIFRoaXMgaG9zdHMgc2ltcGxlIHZhbHVlcyB1c2VkIGJ5IGBtYWluYCBhbmQgdGhlIGByZW5kZXJlcmAuXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC90eXBlZGVmICovXG5leHBvcnQgY29uc3QgVG9rZW5zID1cbntcbiAgICBUaXRsZWJhckhlaWdodDogNDhcbn07XG4iLCIvKiBGaWxlOiAgICAgIFRyZWUuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZCb3gsIEhNb25pdG9yLCBIV2luZG93IH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5leHBvcnQgdHlwZSBGVmVydGV4QmFzZSA9XG57XG4gICAgU2l6ZTogRkJveDtcbiAgICBaT3JkZXI6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZDZWxsID1cbiAgICBGVmVydGV4QmFzZSAmXG4gICAge1xuICAgICAgICBIYW5kbGU6IEhXaW5kb3c7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRlZlcnRleCA9XG4gICAgfCBGQ2VsbFxuICAgIHwgRlBhbmVsO1xuXG5leHBvcnQgdHlwZSBGUGFuZWxEaXJlY3Rpb24gPVxuICAgIHwgXCJIb3Jpem9udGFsXCJcbiAgICB8IFwiVmVydGljYWxcIlxuXG5leHBvcnQgdHlwZSBGUGFuZWxUeXBlID1cbiAgICB8IEZQYW5lbERpcmVjdGlvblxuICAgIHwgXCJTdGFja1wiO1xuXG5leHBvcnQgdHlwZSBGUGFuZWxCYXNlID1cbiAgICBGVmVydGV4QmFzZSAmXG4gICAge1xuICAgICAgICBDaGlsZHJlbjogVEFycmF5PEZWZXJ0ZXg+O1xuICAgICAgICAvKiogU2hvdWxkIG9ubHkgYmUgc2V0IHdoZW4gdGhpcyBpcyB0aGUgcm9vdCBwYW5lbCBvZiBhIG1vbml0b3IuICovXG4gICAgICAgIE1vbml0b3JJZD86IEhNb25pdG9yO1xuICAgICAgICBUeXBlOiBGUGFuZWxUeXBlO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZQYW5lbEhvcml6b250YWwgPVxuICAgIEZQYW5lbEJhc2UgJlxuICAgIHtcbiAgICAgICAgVHlwZTogXCJIb3Jpem9udGFsXCI7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRlBhbmVsVmVydGljYWwgPVxuICAgIEZQYW5lbEJhc2UgJlxuICAgIHtcbiAgICAgICAgVHlwZTogXCJWZXJ0aWNhbFwiO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZQYW5lbFN0YWNrID1cbiAgICBGUGFuZWxCYXNlICZcbiAgICB7XG4gICAgICAgIFR5cGU6IFwiU3RhY2tcIjtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBGUGFuZWwgPVxuICAgIHwgRlBhbmVsSG9yaXpvbnRhbFxuICAgIHwgRlBhbmVsVmVydGljYWw7XG4gICAgLy8gfCBGUGFuZWxTdGFjaztcblxuZXhwb3J0IHR5cGUgRkZvcmVzdCA9IFRBcnJheTxGUGFuZWw+O1xuXG5leHBvcnQgdHlwZSBGQW5ub3RhdGVkUGFuZWwgPVxuICAgIEZQYW5lbCAmXG4gICAge1xuICAgICAgICBBcHBsaWNhdGlvbk5hbWVzOiBUQXJyYXk8c3RyaW5nPjtcbiAgICAgICAgTW9uaXRvck5hbWU6IHN0cmluZztcbiAgICAgICAgSXNSb290OiBib29sZWFuO1xuICAgICAgICBTY3JlZW5zaG90OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRkZvY3VzQ2hhbmdlID1cbiAgICB8IFwiTmV4dFwiXG4gICAgfCBcIlByZXZpb3VzXCJcbiAgICB8IFwiVXBcIlxuICAgIHwgXCJEb3duXCI7XG5cbmV4cG9ydCB0eXBlIEZMb2dUcmFuc2Zvcm1lciA9IChWZXJ0ZXg6IEZWZXJ0ZXgsIERlcHRoOiBudW1iZXIsIERlZmF1bHRTdHJpbmc6IHN0cmluZykgPT4gc3RyaW5nO1xuXG5leHBvcnQgdHlwZSBGR2FwRGF0YSA9XG57XG4gICAgQWRqdXN0ZWRTaXplOiBGQm94O1xuICAgIFByaW5jaXBhbFJhdGlvOiBudW1iZXI7XG59O1xuIiwiLyogRmlsZTogICAgICBBcnJheS50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgVElzTm9uTmVnYXRpdmVJbnRlZ2VyIH0gZnJvbSBcIi4vVXRpbGl0eS5UeXBlc1wiO1xuXG5leHBvcnQgdHlwZSBUTWF5YmVBcnJheTxUeXBlPiA9IFR5cGUgfCBUQXJyYXk8VHlwZT47XG5cbnR5cGUgVEJ1aWxkU3RhdGljVEFycmF5PFxuICAgIEVsZW1lbnRUeXBlLFxuICAgIEFycmF5U2l6ZSBleHRlbmRzIG51bWJlcixcbiAgICBBY2N1bXVsYXRvciBleHRlbmRzIFRBcnJheTxFbGVtZW50VHlwZT4gPSBbIF1cbj4gPVxuICAgIEFjY3VtdWxhdG9yW1wibGVuZ3RoXCJdIGV4dGVuZHMgQXJyYXlTaXplXG4gICAgICAgID8gQWNjdW11bGF0b3JcbiAgICAgICAgOiBUQnVpbGRTdGF0aWNUQXJyYXk8RWxlbWVudFR5cGUsIEFycmF5U2l6ZSwgWyAuLi5BY2N1bXVsYXRvciwgRWxlbWVudFR5cGUgXT47XG5cbmV4cG9ydCB0eXBlIFRTdGF0aWNBcnJheTxFbGVtZW50VHlwZSwgQXJyYXlTaXplIGV4dGVuZHMgbnVtYmVyPiA9XG4gICAgQXJyYXlTaXplIGV4dGVuZHMgQXJyYXlTaXplXG4gICAgICAgID8gbnVtYmVyIGV4dGVuZHMgQXJyYXlTaXplXG4gICAgICAgICAgICA/IFRBcnJheTxFbGVtZW50VHlwZT5cbiAgICAgICAgICAgIDogVElzTm9uTmVnYXRpdmVJbnRlZ2VyPEFycmF5U2l6ZT4gZXh0ZW5kcyB0cnVlXG4gICAgICAgICAgICAgICAgPyBUQnVpbGRTdGF0aWNUQXJyYXk8RWxlbWVudFR5cGUsIEFycmF5U2l6ZT5cbiAgICAgICAgICAgICAgICA6IG5ldmVyXG4gICAgICAgIDogbmV2ZXI7XG4iLCIvKiBGaWxlOiAgICAgIEZ1bmN0aW9uYWwuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgdHlwZSBGU2ltcGxlQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgRlNpbXBsZUNhbGxiYWNrQXN5bmMgPSAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuZXhwb3J0IHR5cGUgRlNpbXBsZUNhbGxiYWNrTWF5YmVBc3luYyA9IEZTaW1wbGVDYWxsYmFjayB8IEZTaW1wbGVDYWxsYmFja0FzeW5jO1xuXG5leHBvcnQgdHlwZSBUU2ltcGxlRnVuY3Rpb248UGFyYW1ldGVyVHlwZSwgUmV0dXJuVHlwZSA9IHZvaWQ+ID0gKEluOiBQYXJhbWV0ZXJUeXBlKSA9PiBSZXR1cm5UeXBlO1xuXG5leHBvcnQgdHlwZSBUUmVzb2x2ZUZ1bmN0aW9uPFR5cGU+ID0gKFZhbHVlOiBUeXBlIHwgUHJvbWlzZUxpa2U8VHlwZT4pID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBGUmVqZWN0RnVuY3Rpb24gPSAoUmVhc29uPzogdW5rbm93bikgPT4gdm9pZDtcbiIsIi8qIEZpbGU6ICAgICAgVXRpbGl0eS5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRlJlY29yZCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbi8vIGltcG9ydCB0eXBlIHsgVEVpdGhlclJlY29yZCB9IGZyb20gXCIuL1JlY29yZC5UeXBlc1wiO1xuXG5leHBvcnQgdHlwZSBUSXNOb25OZWdhdGl2ZUludGVnZXI8QXJyYXlTaXplIGV4dGVuZHMgbnVtYmVyPiA9XG4gICAgYCR7IEFycmF5U2l6ZSB9YCBleHRlbmRzIGAtJHsgc3RyaW5nIH1gXG4gICAgICAgID8gZmFsc2VcbiAgICAgICAgOiBgJHsgQXJyYXlTaXplIH1gIGV4dGVuZHMgYCR7IGJpZ2ludCB9YFxuICAgICAgICAgICAgPyB0cnVlXG4gICAgICAgICAgICA6IGZhbHNlO1xuXG50eXBlIFRCdWlsZFR1cGxlPFxuICAgIExlbmd0aCBleHRlbmRzIG51bWJlcixcbiAgICBBY2N1bXVsYXRvciBleHRlbmRzIFRBcnJheTx1bmtub3duPiA9IFtdXG4+ID1cbiAgICBBY2N1bXVsYXRvcltcImxlbmd0aFwiXSBleHRlbmRzIExlbmd0aFxuICAgICAgICA/IEFjY3VtdWxhdG9yXG4gICAgICAgIDogVEJ1aWxkVHVwbGU8TGVuZ3RoLCBbLi4uQWNjdW11bGF0b3IsIHVua25vd25dPjtcblxudHlwZSBUSXNMZXNzVGhhbk9yRXF1YWw8XG4gICAgTGVmdCBleHRlbmRzIG51bWJlcixcbiAgICBSaWdodCBleHRlbmRzIG51bWJlclxuPiA9XG4gICAgVEJ1aWxkVHVwbGU8UmlnaHQ+IGV4dGVuZHMgWy4uLlRCdWlsZFR1cGxlPExlZnQ+LCAuLi5pbmZlciBfIF1cbiAgICAgICAgPyB0cnVlXG4gICAgICAgIDogZmFsc2U7XG5cbnR5cGUgVEluY2x1c2l2ZVJhbmdlRnJvbVR1cGxlPFxuICAgIEN1cnJlbnRUdXBsZSBleHRlbmRzIFRBcnJheTx1bmtub3duPixcbiAgICBFbmRWYWx1ZSBleHRlbmRzIG51bWJlcixcbiAgICBSZXN1bHQgZXh0ZW5kcyBudW1iZXIgPSBuZXZlclxuPiA9XG4gICAgQ3VycmVudFR1cGxlW1wibGVuZ3RoXCJdIGV4dGVuZHMgRW5kVmFsdWVcbiAgICAgICAgPyBSZXN1bHQgfCBFbmRWYWx1ZVxuICAgICAgICA6IFRJbmNsdXNpdmVSYW5nZUZyb21UdXBsZTxcbiAgICAgICAgICAgIFsuLi5DdXJyZW50VHVwbGUsIHVua25vd25dLFxuICAgICAgICAgICAgRW5kVmFsdWUsXG4gICAgICAgICAgICBSZXN1bHQgfCBDdXJyZW50VHVwbGVbXCJsZW5ndGhcIl1cbiAgICAgICAgPjtcblxuZXhwb3J0IHR5cGUgVEludGVncmFsUmFuZ2U8XG4gICAgU3RhcnRWYWx1ZSBleHRlbmRzIG51bWJlcixcbiAgICBFbmRWYWx1ZSBleHRlbmRzIG51bWJlclxuPiA9XG4gICAgbnVtYmVyIGV4dGVuZHMgU3RhcnRWYWx1ZVxuICAgICAgICA/IG5ldmVyXG4gICAgICAgIDogbnVtYmVyIGV4dGVuZHMgRW5kVmFsdWVcbiAgICAgICAgICAgID8gbmV2ZXJcbiAgICAgICAgICAgIDogVElzTm9uTmVnYXRpdmVJbnRlZ2VyPFN0YXJ0VmFsdWU+IGV4dGVuZHMgdHJ1ZVxuICAgICAgICAgICAgICAgID8gVElzTm9uTmVnYXRpdmVJbnRlZ2VyPEVuZFZhbHVlPiBleHRlbmRzIHRydWVcbiAgICAgICAgICAgICAgICAgICAgPyBUSXNMZXNzVGhhbk9yRXF1YWw8U3RhcnRWYWx1ZSwgRW5kVmFsdWU+IGV4dGVuZHMgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBUSW5jbHVzaXZlUmFuZ2VGcm9tVHVwbGU8VEJ1aWxkVHVwbGU8U3RhcnRWYWx1ZT4sIEVuZFZhbHVlPlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4gICAgICAgICAgICAgICAgOiBuZXZlcjtcblxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmV4cG9ydCB0eXBlIEZBbnlGdW5jdGlvbiA9ICguLi5Bcmd1bWVudHM6IGFueSkgPT4gYW55O1xuXG5leHBvcnQgdHlwZSBUUmVjb3JkTm9uTnVsbGFibGU8UmVjb3JkVHlwZSBleHRlbmRzIEZSZWNvcmQ+ID1cbntcbiAgICBbIEtleSBpbiBrZXlvZiBSZWNvcmRUeXBlIF06IE5vbk51bGxhYmxlPFJlY29yZFR5cGVbS2V5XT47XG59O1xuXG5leHBvcnQgdHlwZSBUQXJyYXlOb25lbXB0eTxUeXBlID0gdW5rbm93bj4gPSBbIFR5cGUsIC4uLlRBcnJheTxUeXBlPiBdO1xuXG5leHBvcnQgdHlwZSBUTWF0cml4PFR5cGU+ID0gVEFycmF5PFRBcnJheTxUeXBlPj47XG5leHBvcnQgdHlwZSBUU2FmZU1hdHJpeDxUeXBlPiA9IFRBcnJheU5vbmVtcHR5PFRBcnJheU5vbmVtcHR5PFR5cGU+PjtcblxuZXhwb3J0IHR5cGUgVEV4dHJhY3RGdW5jdGlvbjxUeXBlPiA9XG4gICAgVHlwZSBleHRlbmRzIHsgKC4uLkFyZ3VtZW50czogaW5mZXIgQXJndW1lbnRWZWN0b3JUeXBlKTogaW5mZXIgUmV0dXJuVHlwZSB9XG4gICAgICAgID8gKC4uLkFyZ3VtZW50czogQXJndW1lbnRWZWN0b3JUeXBlKSA9PiBSZXR1cm5UeXBlXG4gICAgICAgIDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIFRQcm9taXNlVGhlbkZ1bmN0aW9uPFBhcmFtZXRlclR5cGUgPSB1bmtub3duLCBSZXR1cm5UeXBlID0gdW5rbm93bj4gPVxuICAgIChWYWx1ZTogUGFyYW1ldGVyVHlwZSkgPT4gUmV0dXJuVHlwZTtcblxuZXhwb3J0IHR5cGUgVFByb21pc2VDYXRjaEZ1bmN0aW9uPFR5cGUgPSB1bmtub3duPiA9XG4gICAgUGFyYW1ldGVyczxURXh0cmFjdEZ1bmN0aW9uPFByb21pc2U8VHlwZT5bXCJjYXRjaFwiXT4+WzBdO1xuXG5leHBvcnQgdHlwZSBGUGF0aEtleSA9IG51bWJlciB8IHN0cmluZztcbmV4cG9ydCB0eXBlIEZQYXRoUmVjb3JkID0gUmVjb3JkPEZQYXRoS2V5LCB1bmtub3duPjtcblxudHlwZSBUUmVjb3JkUHJvcGVydHk8S2V5VHlwZSBleHRlbmRzIEZQYXRoS2V5PiA9IGAuJHsgS2V5VHlwZSB9YDtcblxudHlwZSBUUmVjb3JkUGF0aFBhcnQ8UHJvcGVydHlLZXlUeXBlIGV4dGVuZHMga2V5b2YgUGFyZW50VHlwZSwgUGFyZW50VHlwZSBleHRlbmRzIEZQYXRoUmVjb3JkPiA9XG4gICAgUHJvcGVydHlLZXlUeXBlIGV4dGVuZHMgRlBhdGhLZXlcbiAgICAgICAgPyBQYXJlbnRUeXBlW1Byb3BlcnR5S2V5VHlwZV0gZXh0ZW5kcyBGUGF0aFJlY29yZFxuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBzdHlsaXN0aWMvbWF4LWxlbiAqL1xuICAgICAgICAgICAgPyBgJHsgVFJlY29yZFByb3BlcnR5PFByb3BlcnR5S2V5VHlwZT4gfSR7IFRSZWNvcmRQYXRoUGFydDxrZXlvZiBQYXJlbnRUeXBlW1Byb3BlcnR5S2V5VHlwZV0sIFBhcmVudFR5cGVbUHJvcGVydHlLZXlUeXBlXT4gfWBcbiAgICAgICAgICAgIDogYCR7IFRSZWNvcmRQcm9wZXJ0eTxQcm9wZXJ0eUtleVR5cGU+IH1gXG4gICAgICAgIDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIFRPYmplY3RQYXRoPFxuICAgIFJlY29yZFR5cGUgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICBPYmplY3ROYW1lVHlwZSBleHRlbmRzIHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZD4gPVxuICAgICAgICBPYmplY3ROYW1lVHlwZSBleHRlbmRzIHN0cmluZ1xuICAgICAgICAgICAgPyBgJHsgT2JqZWN0TmFtZVR5cGUgfSR7IFRSZWNvcmRQYXRoUGFydDxrZXlvZiBSZWNvcmRUeXBlLCBSZWNvcmRUeXBlPiB9YFxuICAgICAgICAgICAgOiBUUmVjb3JkUGF0aFBhcnQ8a2V5b2YgUmVjb3JkVHlwZSwgUmVjb3JkVHlwZT4gZXh0ZW5kcyBgLiR7IGluZmVyIE91dFR5cGUgfWBcbiAgICAgICAgICAgICAgICA/IE91dFR5cGVcbiAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG50eXBlIEZTdHJpbmdOdW1NYXAgPVxue1xuICAgIFwiMFwiOiAwO1xuICAgIFwiMVwiOiAxO1xuICAgIFwiMlwiOiAyO1xuICAgIFwiM1wiOiAzO1xuICAgIFwiNFwiOiA0O1xuICAgIFwiNVwiOiA1O1xuICAgIFwiNlwiOiA2O1xuICAgIFwiN1wiOiA3O1xuICAgIFwiOFwiOiA4O1xuICAgIFwiOVwiOiA5O1xufTtcblxudHlwZSBUU3RyaW5nVG9OdW08VHlwZT4gPSBUeXBlIGV4dGVuZHMga2V5b2YgRlN0cmluZ051bU1hcFxuICAgID8gRlN0cmluZ051bU1hcFtUeXBlXVxuICAgIDogVHlwZTtcblxuLy8gLyogZXNsaW50LWRpc2FibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4vLyBleHBvcnQgdHlwZSBUVHlwZUZyb21QYXRoPFxuLy8gICAgIFBhdGhUeXBlIGV4dGVuZHMgc3RyaW5nLFxuLy8gICAgIFR5cGUgZXh0ZW5kcyBGUGF0aFJlY29yZD4gPVxuLy8gICAgIFBhdGhUeXBlIGV4dGVuZHMgYCR7IGluZmVyIEtleVR5cGVPbmUgfS4keyBpbmZlciBLZXlUeXBlVHdvIH0uJHsgaW5mZXIgS2V5VHlwZVRocmVlIH0uJHsgaW5mZXIgS2V5VHlwZUZvdXIgfS4keyBpbmZlciBLZXlUeXBlRml2ZSB9YFxuLy8gICAgICAgICAvLyA/IEtleVR5cGVPbmUgZXh0ZW5kcyBgJHsgRXhjbHVkZTxrZXlvZiBUeXBlLCBzeW1ib2w+IH1gXG4vLyAgICAgICAgIC8vICAgICA/IEtleVR5cGVUd28gZXh0ZW5kcyBgJHsgRXhjbHVkZTxrZXlvZiBUeXBlW0tleVR5cGVPbmVdLCBzeW1ib2w+IH1gXG4vLyAgICAgICAgIC8vICAgICAgICAgPyBLZXlUeXBlVHdvIGV4dGVuZHMga2V5b2YgVHlwZVtLZXlUeXBlT25lXVxuLy8gICAgICAgICAvLyAgICAgICAgICAgICA/IEtleVR5cGVUaHJlZSBleHRlbmRzIGAkeyBFeGNsdWRlPGtleW9mIFR5cGVbS2V5VHlwZU9uZV1bS2V5VHlwZVR3b10sIHN5bWJvbD4gfWBcbi8vICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT4gZXh0ZW5kcyBrZXlvZiBUeXBlXG4vLyAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlVHdvPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVxuLy8gICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVUaHJlZT4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+XVxuLy8gICAgICAgICAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlRm91cj4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVRocmVlPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVGaXZlPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz5dW1RTdHJpbmdUb051bTxLZXlUeXBlVGhyZWU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZUZvdXI+XVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlVHdvPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUaHJlZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlRm91cj5dW1RTdHJpbmdUb051bTxLZXlUeXBlRml2ZT5dXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICA6IFBhdGhUeXBlIGV4dGVuZHMgYCR7IGluZmVyIEtleVR5cGVPbmUgfS4keyBpbmZlciBLZXlUeXBlVHdvIH0uJHsgaW5mZXIgS2V5VHlwZVRocmVlIH0uJHsgaW5mZXIgS2V5VHlwZUZvdXIgfWBcbi8vICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+IGV4dGVuZHMga2V5b2YgVHlwZVxuLy8gICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+IGV4dGVuZHMga2V5b2YgVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dXG4vLyAgICAgICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+IGV4dGVuZHMga2V5b2YgVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlVGhyZWU+IGV4dGVuZHMga2V5b2YgVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlVHdvPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlRm91cj4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVRocmVlPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVRocmVlPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVGb3VyPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgIDogUGF0aFR5cGUgZXh0ZW5kcyBgJHsgaW5mZXIgS2V5VHlwZU9uZSB9LiR7IGluZmVyIEtleVR5cGVUd28gfS4keyBpbmZlciBLZXlUeXBlVGhyZWUgfWBcbi8vICAgICAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlT25lPiBleHRlbmRzIGtleW9mIFR5cGVcbi8vICAgICAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+IGV4dGVuZHMga2V5b2YgVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZVRocmVlPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz5dXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlVHdvPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUaHJlZT5dXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgICAgICA6IFBhdGhUeXBlIGV4dGVuZHMgYCR7IGluZmVyIEtleVR5cGVPbmUgfS4keyBpbmZlciBLZXlUeXBlVHdvIH1gXG4vLyAgICAgICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+IGV4dGVuZHMga2V5b2YgVHlwZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz5dXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICA6IFBhdGhUeXBlIGV4dGVuZHMga2V5b2YgVHlwZVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgPyBUeXBlW1BhdGhUeXBlXVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlcjtcbi8vIC8qIGVzbGludC1lbmFibGUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG5cbmV4cG9ydCB0eXBlIEZDb2xvciA9IGAjJHsgc3RyaW5nIH1gO1xuZXhwb3J0IHR5cGUgVFJlZjxUeXBlPiA9IHsgUmVmOiBUeXBlIHwgdW5kZWZpbmVkIH07XG5cbmV4cG9ydCB0eXBlIEZUeXBlb2YgPVxuICAgIHwgXCJvYmplY3RcIlxuICAgIHwgXCJzdHJpbmdcIlxuICAgIHwgXCJudW1iZXJcIlxuICAgIHwgXCJiaWdpbnRcIlxuICAgIHwgXCJib29sZWFuXCJcbiAgICB8IFwiZnVuY3Rpb25cIlxuICAgIHwgXCJzeW1ib2xcIlxuICAgIHwgXCJ1bmRlZmluZWRcIjtcblxuZXhwb3J0IHR5cGUgVE1hcFJlY29yZFRyYW5zZm9ybWVyPEtleVR5cGUgZXh0ZW5kcyBQcm9wZXJ0eUtleSwgUHJvcGVydHlUeXBlLCBFbGVtZW50VHlwZT4gPVxuICAgIChLZXk6IEtleVR5cGUsIFByb3BlcnR5OiBQcm9wZXJ0eVR5cGUsIEluZGV4OiBudW1iZXIpID0+IEVsZW1lbnRUeXBlO1xuXG5leHBvcnQgdHlwZSBURmxhdE1hcFJlY29yZFRyYW5zZm9ybWVyPEtleVR5cGUgZXh0ZW5kcyBQcm9wZXJ0eUtleSwgUHJvcGVydHlUeXBlLCBFbGVtZW50VHlwZT4gPVxuICAgIChLZXk6IEtleVR5cGUsIFByb3BlcnR5OiBQcm9wZXJ0eVR5cGUsIEluZGV4OiBudW1iZXIpID0+IEVsZW1lbnRUeXBlIHwgQXJyYXk8RWxlbWVudFR5cGU+O1xuIiwiLyogRmlsZTogICAgICBVdGlsaXR5LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUge1xuICAgIEZBbnlGdW5jdGlvbixcbiAgICBGUGF0aFJlY29yZCxcbiAgICBURmxhdE1hcFJlY29yZFRyYW5zZm9ybWVyLFxuICAgIFRNYXBSZWNvcmRUcmFuc2Zvcm1lcixcbiAgICBUUmVmIH0gZnJvbSBcIi4vVXRpbGl0eS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGQm94LCBGUmVjb3JkLCBUUmVjb3JkIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHR5cGUgeyBGUmVqZWN0RnVuY3Rpb24sIFRSZXNvbHZlRnVuY3Rpb24gfSBmcm9tIFwiLi9GdW5jdGlvbmFsLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dnZXIgfSBmcm9tIFwiLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgeyBHZXRMb2dnZXIgfSBmcm9tIFwiQC9Mb2dcIjtcbmltcG9ydCB0eXBlIHsgVFBhdGgsIFRHZXRUeXBlIH0gZnJvbSBcIi4vT2JqZWN0LlR5cGVzXCI7XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIlV0aWxpdHlcIik7XG5cbnR5cGUgSE1vbml0b3IgPSB7XG4gICAgSGFuZGxlOiBudW1iZXI7XG59O1xuXG50eXBlIEhXaW5kb3cgPSB7XG4gICAgSGFuZGxlOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgY29uc3QgR2V0RW1wdHlNb25pdG9yID0gKCk6IEhNb25pdG9yID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSGFuZGxlOiAtMVxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgR2V0RW1wdHlXaW5kb3cgPSAoKTogSFdpbmRvdyA9Plxue1xuICAgIHJldHVybiB7XG4gICAgICAgIEhhbmRsZTogXCJcIlxuICAgIH07XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1mdW5jdGlvbi10eXBlLCBAc3R5bGlzdGljL2JyYWNlLXN0eWxlICovXG5jb25zdCBBc3luY0Z1bmN0aW9uOiBGdW5jdGlvbiA9IChhc3luYyBmdW5jdGlvbiAoKSB7IH0pLmNvbnN0cnVjdG9yO1xuXG5leHBvcnQgZnVuY3Rpb24gSXNBc3luY0Z1bmN0aW9uKFZhbHVlOiB1bmtub3duKTogVmFsdWUgaXMgKC4uLkFyZ3VtZW50czogVEFycmF5PHVua25vd24+KSA9PiBQcm9taXNlPHVua25vd24+XG57XG4gICAgcmV0dXJuIHR5cGVvZiBWYWx1ZSA9PT0gXCJmdW5jdGlvblwiICYmIFZhbHVlLmNvbnN0cnVjdG9yID09PSBBc3luY0Z1bmN0aW9uO1xufVxuXG5leHBvcnQgY29uc3QgQ2FsbE1heWJlQXN5bmMgPSBhc3luYyA8XG4gICAgSW5SZXR1cm5UeXBlLFxuICAgIEluUGFyYW1ldGVycyBleHRlbmRzIFBhcmFtZXRlcnM8RkFueUZ1bmN0aW9uPixcbiAgICBGdW5jdGlvblR5cGUgZXh0ZW5kcyAoKC4uLkFyZ3VtZW50VmVjdG9yOiBJblBhcmFtZXRlcnMpID0+IEluUmV0dXJuVHlwZSk+KFxuICAgIEZ1bmN0aW9uOiBGdW5jdGlvblR5cGUsXG4gICAgLi4uQXJndW1lbnRWZWN0b3I6IEluUGFyYW1ldGVyc1xuKTogUHJvbWlzZTxJblJldHVyblR5cGU+ID0+XG57XG4gICAgaWYgKElzQXN5bmNGdW5jdGlvbihGdW5jdGlvbikpXG4gICAge1xuICAgICAgICByZXR1cm4gYXdhaXQgRnVuY3Rpb24oLi4uQXJndW1lbnRWZWN0b3IpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gRnVuY3Rpb24oLi4uQXJndW1lbnRWZWN0b3IpO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBaZXJvQm94OiBGQm94ID1cbntcbiAgICBIZWlnaHQ6IDAsXG4gICAgV2lkdGg6IDAsXG4gICAgWDogMCxcbiAgICBZOiAwXG59O1xuXG5leHBvcnQgY29uc3QgRXh0cmFjdEZyb21SZWNvcmRBcnJheSA9IDxcbiAgICBLZXlUeXBlIGV4dGVuZHMgUHJvcGVydHlLZXkgPSBQcm9wZXJ0eUtleSxcbiAgICBSZWNvcmRUeXBlIGV4dGVuZHMgUmVjb3JkPEtleVR5cGUsIHVua25vd24+ID0gUmVjb3JkPEtleVR5cGUsIHVua25vd24+PihcbiAgICBLZXk6IEtleVR5cGUsXG4gICAgSW5BcnJheTogVEFycmF5PFJlY29yZFR5cGU+XG4pOiBUQXJyYXk8UmVjb3JkVHlwZVtLZXlUeXBlXT4gPT5cbntcbiAgICByZXR1cm4gSW5BcnJheS5tYXAoKFJlY29yZDogUmVjb3JkVHlwZSk6IFJlY29yZFR5cGVbS2V5VHlwZV0gPT5cbiAgICB7XG4gICAgICAgIHJldHVybiBSZWNvcmRbS2V5XTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRCeUtleSA9IDxSZWNvcmRUeXBlIGV4dGVuZHMgRlJlY29yZCwgS2V5VHlwZSBleHRlbmRzIGtleW9mIFJlY29yZFR5cGU+KFxuICAgIEtleTogS2V5VHlwZVxuKTogKChJbjogUmVjb3JkVHlwZSkgPT4gUmVjb3JkVHlwZVtLZXlUeXBlXSkgPT5cbntcbiAgICByZXR1cm4gKFJlY29yZDogUmVjb3JkVHlwZSk6IFJlY29yZFR5cGVbS2V5VHlwZV0gPT5cbiAgICB7XG4gICAgICAgIHJldHVybiBSZWNvcmRbS2V5XTtcbiAgICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IERlbGF5ID0gYXN5bmMgKER1cmF0aW9uOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+XG57XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChSZXNvbHZlOiBUUmVzb2x2ZUZ1bmN0aW9uPHZvaWQ+LCBfUmVqZWN0OiBGUmVqZWN0RnVuY3Rpb24pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBzZXRUaW1lb3V0KFJlc29sdmUsIER1cmF0aW9uKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBSZXRyeVVudGlsRnVsZmlsbGVkID0gYXN5bmMgPFR5cGU+KFxuICAgIEluOiAoKCkgPT4gUHJvbWlzZTxUeXBlPiksXG4gICAgTnVtVHJpZXM6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZCxcbiAgICBEdXJhdGlvblRvVHJ5OiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbik6IFByb21pc2U8VHlwZSB8IHVuZGVmaW5lZD4gPT5cbntcbiAgICBsZXQgU3RhcnRUaW1lOiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBsZXQgTGFzdENvbXBsZXRpb25UaW1lOiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgbGV0IE51bUF0dGVtcHRzOiBudW1iZXIgPSAwO1xuXG4gICAgY29uc3QgSGFzRXhjZWVkZWRMaW1pdHMgPSAoKTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgRXhjZWVkZWROdW1BdHRlbXB0czogYm9vbGVhbiA9IChOdW1UcmllcyAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgPyBOdW1BdHRlbXB0cyA9PT0gTnVtVHJpZXNcbiAgICAgICAgICAgIDogZmFsc2U7XG5cbiAgICAgICAgY29uc3QgQXJlRHVyYXRpb25WYXJpYWJsZXNJbml0aWFsaXplZDogYm9vbGVhbiA9IChcbiAgICAgICAgICAgIER1cmF0aW9uVG9UcnkgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgTGFzdENvbXBsZXRpb25UaW1lICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIFN0YXJ0VGltZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKFN0YXJ0VGltZSAhPT0gdW5kZWZpbmVkICYmIExhc3RDb21wbGV0aW9uVGltZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBTdGFydFRpbWUgPSBMYXN0Q29tcGxldGlvblRpbWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBFeGNlZWRlZER1cmF0aW9uVG9Ucnk6IGJvb2xlYW4gPSBBcmVEdXJhdGlvblZhcmlhYmxlc0luaXRpYWxpemVkXG4gICAgICAgICAgICA/ICgoTGFzdENvbXBsZXRpb25UaW1lIGFzIG51bWJlcikgLSAoU3RhcnRUaW1lIGFzIG51bWJlcikpID49IChEdXJhdGlvblRvVHJ5IGFzIG51bWJlcilcbiAgICAgICAgICAgIDogZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIEV4Y2VlZGVkTnVtQXR0ZW1wdHMgfHwgRXhjZWVkZWREdXJhdGlvblRvVHJ5O1xuICAgIH07XG5cbiAgICB3aGlsZSAoSGFzRXhjZWVkZWRMaW1pdHMoKSlcbiAgICB7XG4gICAgICAgIHRyeVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBPdXQ6IFR5cGUgPSBhd2FpdCBJbigpO1xuICAgICAgICAgICAgcmV0dXJuIE91dDtcbiAgICAgICAgfVxuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG4gICAgICAgIGNhdGNoIChfRXJyb3I6IHVua25vd24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIExhc3RDb21wbGV0aW9uVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKE51bVRyaWVzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTnVtQXR0ZW1wdHMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgU2V0UHJvcGVydHlGcm9tUGF0aCA9IDxcbiAgICBSZWNvcmRUeXBlIGV4dGVuZHMgRlBhdGhSZWNvcmQsXG4gICAgUGF0aFR5cGUgZXh0ZW5kcyBUUGF0aDxSZWNvcmRUeXBlPlxuPihcbiAgICBPYmplY3RSZWY6IFRSZWY8UmVjb3JkVHlwZT4sXG4gICAgUGF0aDogUGF0aFR5cGUsXG4gICAgVmFsdWU6IFRHZXRUeXBlPFJlY29yZFR5cGUsIFBhdGhUeXBlPlxuKTogdm9pZCA9Plxue1xuICAgIHR5cGUgRlByb3BlcnR5ID0gVEdldFR5cGU8UmVjb3JkVHlwZSwgUGF0aFR5cGU+O1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoUGF0aCkpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXRQcm9wZXJ0eUZyb21QYXRoIGRvZXMgbm90IHN1cHBvcnQgQXJyYXktYmFzZWQgcGF0aHMgeWV0LlwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBQYXRoU3BsaXQ6IEFycmF5PHN0cmluZz4gPSBQYXRoLnNwbGl0KFwiLlwiKTtcblxuICAgIGNvbnN0IExhc3Q6IHN0cmluZyB8IHVuZGVmaW5lZCA9IFBhdGhTcGxpdC5wb3AoKTtcbiAgICBpZiAoTGFzdCA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChQYXRoU3BsaXQubGVuZ3RoID09PSAwKVxuICAgIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KFBhdGgpKVxuICAgICAgICB7XG4gICAgICAgICAgICAoKE9iamVjdFJlZi5SZWYgYXMgVFJlY29yZDxzdHJpbmcsIHVua25vd24+KVsoUGF0aCBhcyBzdHJpbmcpXSkgPSBWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IFJlY3VycmVuY2UgPSAoSW46IFRSZWY8dW5rbm93bj4pOiBUUmVmPHVua25vd24+IHwgdW5kZWZpbmVkID0+XG4gICAge1xuICAgICAgICBjb25zdCBOZXh0UHJvcGVydHlOYW1lQmFzZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gUGF0aFNwbGl0LnNoaWZ0KCk7XG5cbiAgICAgICAgTG9nKFwiTmV4dFByb3BlcnR5TmFtZUJhc2VcIiwgTmV4dFByb3BlcnR5TmFtZUJhc2UpO1xuXG4gICAgICAgIGlmIChOZXh0UHJvcGVydHlOYW1lQmFzZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBOZXh0UHJvcGVydHlOYW1lOiBzdHJpbmcgfCBudW1iZXIgPSBpc05hTihwYXJzZUludChOZXh0UHJvcGVydHlOYW1lQmFzZSkpXG4gICAgICAgICAgICAgICAgPyBOZXh0UHJvcGVydHlOYW1lQmFzZVxuICAgICAgICAgICAgICAgIDogcGFyc2VJbnQoTmV4dFByb3BlcnR5TmFtZUJhc2UpO1xuXG4gICAgICAgICAgICBMb2coXCJOZXh0UHJvcGVydHlOYW1lXCIsIE5leHRQcm9wZXJ0eU5hbWUpO1xuXG4gICAgICAgICAgICBjb25zdCBPdXQ6IFRSZWY8dW5rbm93bj4gPSBNYWtlUmVmPHVua25vd24+KCk7XG4gICAgICAgICAgICBPdXQuUmVmID0gKEluLlJlZiBhcyBUUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW05leHRQcm9wZXJ0eU5hbWVdIGFzIHVua25vd247XG4gICAgICAgICAgICByZXR1cm4gUmVjdXJyZW5jZShPdXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEluO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IFByb3BlcnR5UmVmOiBUUmVmPEZQcm9wZXJ0eT4gPSBSZWN1cnJlbmNlKE9iamVjdFJlZikgYXMgVFJlZjxGUHJvcGVydHk+O1xuICAgIGNvbnN0IExhc3RUeXBlZDogc3RyaW5nIHwgbnVtYmVyID0gaXNOYU4ocGFyc2VJbnQoTGFzdCkpXG4gICAgICAgID8gTGFzdFxuICAgICAgICA6IHBhcnNlSW50KExhc3QpO1xuXG4gICAgKFByb3BlcnR5UmVmLlJlZiBhcyBUUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW0xhc3RUeXBlZF0gPSBWYWx1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRQcm9wZXJ0eUZyb21QYXRoID0gPFxuICAgIFJlY29yZFR5cGUgZXh0ZW5kcyBUUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgUGF0aFR5cGUgZXh0ZW5kcyBUUGF0aDxSZWNvcmRUeXBlPlxuPihcbiAgICBSZWNvcmQ6IFJlY29yZFR5cGUsXG4gICAgUGF0aDogUGF0aFR5cGVcbik6IFRHZXRUeXBlPFJlY29yZFR5cGUsIFBhdGhUeXBlPiA9Plxue1xuICAgIGlmIChBcnJheS5pc0FycmF5KFBhdGgpKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2V0UHJvcGVydHlGcm9tUGF0aCBkb2VzIG5vdCBzdXBwb3J0IEFycmF5LWJhc2VkIHBhdGhzIHlldC5cIik7XG4gICAgfVxuXG4gICAgY29uc3QgUGF0aFNwbGl0OiBBcnJheTxzdHJpbmc+ID0gUGF0aC5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgUmVjdXJyZW5jZSA9IChJbjogdW5rbm93biwgSW5kZXg6IG51bWJlciA9IDApOiB1bmtub3duID0+XG4gICAge1xuICAgICAgICBjb25zdCBLZXk6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCA9IGlzTmFOKHBhcnNlSW50KFBhdGhTcGxpdFtJbmRleF0gfHwgXCJcIikpXG4gICAgICAgICAgICA/IFBhdGhTcGxpdFtJbmRleF1cbiAgICAgICAgICAgIDogcGFyc2VJbnQoUGF0aFNwbGl0W0luZGV4XSB8fCBcIlwiKTtcblxuICAgICAgICBpZiAoS2V5ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IE5leHQ6IHVua25vd24gPSAoSW4gYXMgVFJlY29yZDxzdHJpbmcsIHVua25vd24+KVtLZXldO1xuICAgICAgICAgICAgaWYgKEluZGV4ICE9PSBQYXRoU3BsaXQubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVjdXJyZW5jZShOZXh0LCBJbmRleCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBOZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gUmVjdXJyZW5jZShSZWNvcmQpIGFzIFRHZXRUeXBlPFJlY29yZFR5cGUsIFBhdGhUeXBlPjtcbn07XG5cbmV4cG9ydCBjb25zdCBNYWtlUmVmID0gPFR5cGU+KCk6IFRSZWY8VHlwZT4gPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBSZWY6IHVuZGVmaW5lZFxuICAgIH0gYXMgVFJlZjxUeXBlPjtcbn07XG5cbmV4cG9ydCBjb25zdCBJZGVudGl0eSA9IDxUeXBlPiguLi5Bcmd1bWVudHM6IFRBcnJheTxUeXBlPikgPT4gQXJndW1lbnRzO1xuXG5leHBvcnQgY29uc3QgTWFwUmVjb3JkID0gPEtleVR5cGUgZXh0ZW5kcyBQcm9wZXJ0eUtleSwgUHJvcGVydHlUeXBlLCBFbGVtZW50VHlwZT4oXG4gICAgSW46IFJlY29yZDxLZXlUeXBlLCBQcm9wZXJ0eVR5cGU+LFxuICAgIEZ1bmN0aW9uOiBUTWFwUmVjb3JkVHJhbnNmb3JtZXI8S2V5VHlwZSwgUHJvcGVydHlUeXBlLCBFbGVtZW50VHlwZT5cbik6IEFycmF5PEVsZW1lbnRUeXBlPiA9Plxue1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhJbikubWFwKChJbktleTogc3RyaW5nLCBJbmRleDogbnVtYmVyKTogRWxlbWVudFR5cGUgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEtleTogS2V5VHlwZSA9IEluS2V5IGFzIEtleVR5cGU7XG4gICAgICAgIHJldHVybiBGdW5jdGlvbihLZXksIEluW0tleV0sIEluZGV4KTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBGbGF0TWFwUmVjb3JkID0gPEtleVR5cGUgZXh0ZW5kcyBQcm9wZXJ0eUtleSwgUHJvcGVydHlUeXBlLCBFbGVtZW50VHlwZT4oXG4gICAgSW46IFJlY29yZDxLZXlUeXBlLCBQcm9wZXJ0eVR5cGU+LFxuICAgIEZ1bmN0aW9uOiBURmxhdE1hcFJlY29yZFRyYW5zZm9ybWVyPEtleVR5cGUsIFByb3BlcnR5VHlwZSwgRWxlbWVudFR5cGU+XG4pOiBBcnJheTxFbGVtZW50VHlwZT4gPT5cbntcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoSW4pLmZsYXRNYXAoKEluS2V5OiBzdHJpbmcsIEluZGV4OiBudW1iZXIpOiBBcnJheTxFbGVtZW50VHlwZT4gPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEtleTogS2V5VHlwZSA9IEluS2V5IGFzIEtleVR5cGU7XG4gICAgICAgIGNvbnN0IFRyYW5zZm9ybTogRWxlbWVudFR5cGUgfCBBcnJheTxFbGVtZW50VHlwZT4gPSBGdW5jdGlvbihLZXksIEluW0tleV0sIEluZGV4KTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoVHJhbnNmb3JtKVxuICAgICAgICAgICAgPyBUcmFuc2Zvcm1cbiAgICAgICAgICAgIDogWyBUcmFuc2Zvcm0gXTtcbiAgICB9KTtcbn07XG4iLCIvKiBGaWxlOiAgICAgIGluZGV4LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vQXJyYXlcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0Z1bmN0aW9uYWwuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1V0aWxpdHlcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1V0aWxpdHkuVHlwZXNcIjtcbiIsIi8qIEZpbGU6ICAgICAgaW5kZXgudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9FdmVudFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vS2V5Ym9hcmRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Mb2cuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TaGFyZWQuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1N0b3JlXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TdG9yZS5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vVHJlZS5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vVG9rZW5zXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9VdGlsaXR5XCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=