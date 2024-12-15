/* File:      Key.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FC } from "react";

export type FKeySide =
    | "Left"
    | "Right"
    | "Either"
    | undefined;

export type FVirtualKey =
    | 0x08
    | 0x09
    | 0x0D
    | 0x10
    | 0x11
    | 0x12
    | 0x13
    | 0x21
    | 0x22
    | 0x23
    | 0x24
    | 0x25
    | 0x26
    | 0x27
    | 0x28
    | 0x2D
    | 0x2E
    | 0x30
    | 0x31
    | 0x32
    | 0x33
    | 0x34
    | 0x35
    | 0x36
    | 0x37
    | 0x38
    | 0x39
    | 0x41
    | 0x42
    | 0x43
    | 0x44
    | 0x45
    | 0x46
    | 0x47
    | 0x48
    | 0x49
    | 0x4A
    | 0x4B
    | 0x4C
    | 0x4D
    | 0x4E
    | 0x4F
    | 0x50
    | 0x51
    | 0x52
    | 0x53
    | 0x54
    | 0x55
    | 0x56
    | 0x57
    | 0x58
    | 0x59
    | 0x5A
    | 0x5B
    | 0x5C
    | 0x60
    | 0x61
    | 0x62
    | 0x63
    | 0x64
    | 0x65
    | 0x66
    | 0x67
    | 0x68
    | 0x69
    | 0x6A
    | 0x6B
    | 0x6D
    | 0x6E
    | 0x6F
    | 0x70
    | 0x71
    | 0x72
    | 0x73
    | 0x74
    | 0x75
    | 0x76
    | 0x77
    | 0x78
    | 0x79
    | 0x7A
    | 0x7B
    | 0x7C
    | 0x7D
    | 0x7E
    | 0x7F
    | 0x80
    | 0x81
    | 0x82
    | 0x83
    | 0x84
    | 0x85
    | 0x86
    | 0x87
    | 0xA0
    | 0xA1
    | 0xA2
    | 0xA3
    | 0xA4
    | 0xA5
    | 0xA6
    | 0xA7
    | 0xA8
    | 0xA9
    | 0xAA
    | 0xAB
    | 0xAC
    | 0xB0
    | 0xB1
    | 0xB2
    | 0xB3
    | 0xB4
    | 0xB5
    | 0xB6
    | 0xB7
    | 0xBA
    | 0xBB
    | 0xBC
    | 0xBD
    | 0xBE
    | 0xBF
    | 0xC0
    | 0xDB
    | 0xDC
    | 0xDD
    | 0xDE;

export type FKey =
{
    /** Text to display on the key, or a symbol that is rendered in the center of the key. */
    Display: string | FC;

    /** An additional descriptor, shown in the corner.  Should be undefined whenever `Side` is not undefined. */
    Modifier: undefined | FC;

    /**
     * The "side" of the key is:
     *     `"Left"` or `"Right"` in the case of keys like left shift
     *     `"Either"` in the case of keys that do not have a side, but have corresponding key codes that *do* have sides.
     *     `undefined` for "normal" keys, such as letters and numbers
     */
    Side: FKeySide;
};

export type FKeyId =
    | "Backspace"
    | "Tab"
    | "Enter"
    | "Shift"
    | "Ctrl"
    | "Alt"
    | "Space"
    | "PgUp"
    | "PgDown"
    | "End"
    | "Home"
    | "LeftArrow"
    | "UpArrow"
    | "RightArrow"
    | "DownArrow"
    | "Ins"
    | "Del"
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "Q"
    | "R"
    | "S"
    | "T"
    | "U"
    | "V"
    | "W"
    | "X"
    | "Y"
    | "Z"
    | "LWin"
    | "RWin"
    | "Num0"
    | "Num1"
    | "Num2"
    | "Num3"
    | "Num4"
    | "Num5"
    | "Num6"
    | "Num7"
    | "Num8"
    | "Num9"
    | "Multiply"
    | "Add"
    | "Subtract"
    | "NumDecimal"
    | "NumDivide"
    | "F1"
    | "F2"
    | "F3"
    | "F4"
    | "F5"
    | "F6"
    | "F7"
    | "F8"
    | "F9"
    | "F10"
    | "F11"
    | "F12"
    | "F13"
    | "F14"
    | "F15"
    | "F16"
    | "F17"
    | "F18"
    | "F19"
    | "F20"
    | "F21"
    | "F22"
    | "F23"
    | "F24"
    | "LShift"
    | "RShift"
    | "LCtrl"
    | "RCtrl"
    | "LAlt"
    | "RAlt"
    | "BrowserBack"
    | "BrowserForward"
    | "BrowserRefresh"
    | "BrowserStop"
    | "BrowserSearch"
    | "BrowserFavorites"
    | "BrowserStart"
    | "NextTrack"
    | "PreviousTrack"
    | "StopMedia"
    | "Pause"
    | "PlayPauseMedia"
    | "StartMail"
    | "SelectMedia"
    | "StartApplicationOne"
    | "StartApplicationTwo"
    | ";"
    | "+"
    | ","
    | "-"
    | "."
    | "/"
    | "`"
    | "["
    | "\\"
    | "]"
    | "'";

// /**
//  * The non-modifier keys that can be used for combinations.
//  */
// export type FBaseKeyId =
//     /**
//      * Typically we think of the Windows key as a modifier,
//      * but the VK codes do not have a non-directional code
//      * for the windows key, so we just
//      */
//     | "LWin"
//     | "RWin"
//     | "A"
//     | "B"
//     | "C"
//     | "D"
//     | "E"
//     | "F"
//     | "G"
//     | "H"
//     | "I"
//     | "J"
//     | "K"
//     | "L"
//     | "M"
//     | "N"
//     | "O"
//     | "P"
//     | "Q"
//     | "R"
//     | "S"
//     | "T"
//     | "U"
//     | "V"
//     | "W"
//     | "X"
//     | "Y"
//     | "Z"
//     | "0"
//     | "1"
//     | "2"
//     | "3"
//     | "4"
//     | "5"
//     | "6"
//     | "7"
//     | "8"
//     | "9"
//     | "."
//     | ","
//     | ";"
//     | "'"
//     | "NumDecimal"
//     | "Num0"
//     | "Num1"
//     | "Num2"
//     | "Num3"
//     | "Num4"
//     | "Num5"
//     | "Num6"
//     | "Num7"
//     | "Num8"
//     | "Num9"
//     | "LeftArrow"
//     | "RightArrow"
//     | "UpArrow"
//     | "DownArrow"
//     | "Space"
//     | "="
//     | "+"
//     | "-"
//     | "*"
//     | "/"
//     | "\\"
//     | "Enter"
//     | "Del"
//     | "Ins"
//     | "PgUp"
//     | "PgDown"
//     | "Home"
//     | "End"
//     | "["
//     | "]"
//     | "Backspace"
//     | "Tab"
//     | "`"
//     | "F1"
//     | "F2"
//     | "F3"
//     | "F4"
//     | "F5"
//     | "F6"
//     | "F7"
//     | "F8"
//     | "F9"
//     | "F10"
//     | "F11"
//     | "F12"
//     | "F13"
//     | "F14"
//     | "F15"
//     | "F16"
//     | "F17"
//     | "F18"
//     | "F19"
//     | "F20"
//     | "F21"
//     | "F22"
//     | "F23"
//     | "F24";

export type PKey =
{
    Value: FKey;
    IsSmall: boolean;
};
