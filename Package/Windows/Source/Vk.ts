/**
 *
 *
 * @module @sorrell/windows/Vk
 *
 * @file      Vk.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-jsdoc */

export const LBUTTON = 0x01 as const;
export const RBUTTON = 0x02 as const;
export const CANCEL = 0x03 as const;
export const MBUTTON = 0x04 as const;
export const XBUTTON1 = 0x05 as const;
export const XBUTTON2 = 0x06 as const;
export const BACK = 0x08 as const;
export const TAB = 0x09 as const;
export const CLEAR = 0x0C as const;
export const RETURN = 0x0D as const;
export const SHIFT = 0x10 as const;
export const CONTROL = 0x11 as const;
export const MENU = 0x12 as const;
export const PAUSE = 0x13 as const;
export const CAPITAL = 0x14 as const;
export const KANA = 0x15 as const;
export const HANGEUL = 0x15 as const;
export const HANGUL = 0x15 as const;
export const IME_ON = 0x16 as const;
export const JUNJA = 0x17 as const;
export const FINAL = 0x18 as const;
export const HANJA = 0x19 as const;
export const KANJI = 0x19 as const;
export const IME_OFF = 0x1A as const;
export const ESCAPE = 0x1B as const;
export const CONVERT = 0x1C as const;
export const NONCONVERT = 0x1D as const;
export const ACCEPT = 0x1E as const;
export const MODECHANGE = 0x1F as const;
export const SPACE = 0x20 as const;
export const PRIOR = 0x21 as const;
export const NEXT = 0x22 as const;
export const END = 0x23 as const;
export const HOME = 0x24 as const;
export const LEFT = 0x25 as const;
export const UP = 0x26 as const;
export const RIGHT = 0x27 as const;
export const DOWN = 0x28 as const;
export const SELECT = 0x29 as const;
export const PRINT = 0x2A as const;
export const EXECUTE = 0x2B as const;
export const SNAPSHOT = 0x2C as const;
export const INSERT = 0x2D as const;
export const DELETE = 0x2E as const;
export const HELP = 0x2F as const;
export const D0 = 0x30 as const;
export const D1 = 0x31 as const;
export const D2 = 0x32 as const;
export const D3 = 0x33 as const;
export const D4 = 0x34 as const;
export const D5 = 0x35 as const;
export const D6 = 0x36 as const;
export const D7 = 0x37 as const;
export const D8 = 0x38 as const;
export const D9 = 0x39 as const;
export const A = 0x41 as const;
export const B = 0x42 as const;
export const C = 0x43 as const;
export const D = 0x44 as const;
export const E = 0x45 as const;
export const F = 0x46 as const;
export const G = 0x47 as const;
export const H = 0x48 as const;
export const I = 0x49 as const;
export const J = 0x4A as const;
export const K = 0x4B as const;
export const L = 0x4C as const;
export const M = 0x4D as const;
export const N = 0x4E as const;
export const O = 0x4F as const;
export const P = 0x50 as const;
export const Q = 0x51 as const;
export const R = 0x52 as const;
export const S = 0x53 as const;
export const T = 0x54 as const;
export const U = 0x55 as const;
export const V = 0x56 as const;
export const W = 0x57 as const;
export const X = 0x58 as const;
export const Y = 0x59 as const;
export const Z = 0x5A as const;
export const LWIN = 0x5B as const;
export const RWIN = 0x5C as const;
export const APPS = 0x5D as const;
export const SLEEP = 0x5F as const;
export const NUMPAD0 = 0x60 as const;
export const NUMPAD1 = 0x61 as const;
export const NUMPAD2 = 0x62 as const;
export const NUMPAD3 = 0x63 as const;
export const NUMPAD4 = 0x64 as const;
export const NUMPAD5 = 0x65 as const;
export const NUMPAD6 = 0x66 as const;
export const NUMPAD7 = 0x67 as const;
export const NUMPAD8 = 0x68 as const;
export const NUMPAD9 = 0x69 as const;
export const MULTIPLY = 0x6A as const;
export const ADD = 0x6B as const;
export const SEPARATOR = 0x6C as const;
export const SUBTRACT = 0x6D as const;
export const DECIMAL = 0x6E as const;
export const DIVIDE = 0x6F as const;
export const F1 = 0x70 as const;
export const F2 = 0x71 as const;
export const F3 = 0x72 as const;
export const F4 = 0x73 as const;
export const F5 = 0x74 as const;
export const F6 = 0x75 as const;
export const F7 = 0x76 as const;
export const F8 = 0x77 as const;
export const F9 = 0x78 as const;
export const F10 = 0x79 as const;
export const F11 = 0x7A as const;
export const F12 = 0x7B as const;
export const F13 = 0x7C as const;
export const F14 = 0x7D as const;
export const F15 = 0x7E as const;
export const F16 = 0x7F as const;
export const F17 = 0x80 as const;
export const F18 = 0x81 as const;
export const F19 = 0x82 as const;
export const F20 = 0x83 as const;
export const F21 = 0x84 as const;
export const F22 = 0x85 as const;
export const F23 = 0x86 as const;
export const F24 = 0x87 as const;
export const NAVIGATION_VIEW = 0x88 as const;
export const NAVIGATION_MENU = 0x89 as const;
export const NAVIGATION_UP = 0x8A as const;
export const NAVIGATION_DOWN = 0x8B as const;
export const NAVIGATION_LEFT = 0x8C as const;
export const NAVIGATION_RIGHT = 0x8D as const;
export const NAVIGATION_ACCEPT = 0x8E as const;
export const NAVIGATION_CANCEL = 0x8F as const;
export const NUMLOCK = 0x90 as const;
export const SCROLL = 0x91 as const;
export const OEM_NEC_EQUAL = 0x92 as const;
export const OEM_FJ_JISHO = 0x92 as const;
export const OEM_FJ_MASSHOU = 0x93 as const;
export const OEM_FJ_TOUROKU = 0x94 as const;
export const OEM_FJ_LOYA = 0x95 as const;
export const OEM_FJ_ROYA = 0x96 as const;
export const LSHIFT = 0xA0 as const;
export const RSHIFT = 0xA1 as const;
export const LCONTROL = 0xA2 as const;
export const RCONTROL = 0xA3 as const;
export const LMENU = 0xA4 as const;
export const RMENU = 0xA5 as const;
export const BROWSER_BACK = 0xA6 as const;
export const BROWSER_FORWARD = 0xA7 as const;
export const BROWSER_REFRESH = 0xA8 as const;
export const BROWSER_STOP = 0xA9 as const;
export const BROWSER_SEARCH = 0xAA as const;
export const BROWSER_FAVORITES = 0xAB as const;
export const BROWSER_HOME = 0xAC as const;
export const VOLUME_MUTE = 0xAD as const;
export const VOLUME_DOWN = 0xAE as const;
export const VOLUME_UP = 0xAF as const;
export const MEDIA_NEXT_TRACK = 0xB0 as const;
export const MEDIA_PREV_TRACK = 0xB1 as const;
export const MEDIA_STOP = 0xB2 as const;
export const MEDIA_PLAY_PAUSE = 0xB3 as const;
export const LAUNCH_MAIL = 0xB4 as const;
export const LAUNCH_MEDIA_SELECT = 0xB5 as const;
export const LAUNCH_APP1 = 0xB6 as const;
export const LAUNCH_APP2 = 0xB7 as const;
export const OEM_1 = 0xBA as const;
export const OEM_PLUS = 0xBB as const;
export const OEM_COMMA = 0xBC as const;
export const OEM_MINUS = 0xBD as const;
export const OEM_PERIOD = 0xBE as const;
export const OEM_2 = 0xBF as const;
export const OEM_3 = 0xC0 as const;
export const GAMEPAD_A = 0xC3 as const;
export const GAMEPAD_B = 0xC4 as const;
export const GAMEPAD_X = 0xC5 as const;
export const GAMEPAD_Y = 0xC6 as const;
export const GAMEPAD_RIGHT_SHOULDER = 0xC7 as const;
export const GAMEPAD_LEFT_SHOULDER = 0xC8 as const;
export const GAMEPAD_LEFT_TRIGGER = 0xC9 as const;
export const GAMEPAD_RIGHT_TRIGGER = 0xCA as const;
export const GAMEPAD_DPAD_UP = 0xCB as const;
export const GAMEPAD_DPAD_DOWN = 0xCC as const;
export const GAMEPAD_DPAD_LEFT = 0xCD as const;
export const GAMEPAD_DPAD_RIGHT = 0xCE as const;
export const GAMEPAD_MENU = 0xCF as const;
export const GAMEPAD_VIEW = 0xD0 as const;
export const GAMEPAD_LEFT_THUMBSTICK_BUTTON = 0xD1 as const;
export const GAMEPAD_RIGHT_THUMBSTICK_BUTTON = 0xD2 as const;
export const GAMEPAD_LEFT_THUMBSTICK_UP = 0xD3 as const;
export const GAMEPAD_LEFT_THUMBSTICK_DOWN = 0xD4 as const;
export const GAMEPAD_LEFT_THUMBSTICK_RIGHT = 0xD5 as const;
export const GAMEPAD_LEFT_THUMBSTICK_LEFT = 0xD6 as const;
export const GAMEPAD_RIGHT_THUMBSTICK_UP = 0xD7 as const;
export const GAMEPAD_RIGHT_THUMBSTICK_DOWN = 0xD8 as const;
export const GAMEPAD_RIGHT_THUMBSTICK_RIGHT = 0xD9 as const;
export const GAMEPAD_RIGHT_THUMBSTICK_LEFT = 0xDA as const;
export const OEM_4 = 0xDB as const;
export const OEM_5 = 0xDC as const;
export const OEM_6 = 0xDD as const;
export const OEM_7 = 0xDE as const;
export const OEM_8 = 0xDF as const;
export const OEM_AX = 0xE1 as const;
export const OEM_102 = 0xE2 as const;
export const ICO_HELP = 0xE3 as const;
export const ICO_00 = 0xE4 as const;
export const PROCESSKEY = 0xE5 as const;
export const ICO_CLEAR = 0xE6 as const;
export const PACKET = 0xE7 as const;
export const OEM_RESET = 0xE9 as const;
export const OEM_JUMP = 0xEA as const;
export const OEM_PA1 = 0xEB as const;
export const OEM_PA2 = 0xEC as const;
export const OEM_PA3 = 0xED as const;
export const OEM_WSCTRL = 0xEE as const;
export const OEM_CUSEL = 0xEF as const;
export const OEM_ATTN = 0xF0 as const;
export const OEM_FINISH = 0xF1 as const;
export const OEM_COPY = 0xF2 as const;
export const OEM_AUTO = 0xF3 as const;
export const OEM_ENLW = 0xF4 as const;
export const OEM_BACKTAB = 0xF5 as const;
export const ATTN = 0xF6 as const;
export const CRSEL = 0xF7 as const;
export const EXSEL = 0xF8 as const;
export const EREOF = 0xF9 as const;
export const PLAY = 0xFA as const;
export const ZOOM = 0xFB as const;
export const NONAME = 0xFC as const;
export const PA1 = 0xFD as const;
export const OEM_CLEAR = 0xFE as const;

export type LBUTTON = typeof LBUTTON;
export type RBUTTON = typeof RBUTTON;
export type CANCEL = typeof CANCEL;
export type MBUTTON = typeof MBUTTON;
export type XBUTTON1 = typeof XBUTTON1;
export type XBUTTON2 = typeof XBUTTON2;
export type BACK = typeof BACK;
export type TAB = typeof TAB;
export type CLEAR = typeof CLEAR;
export type RETURN = typeof RETURN;
export type SHIFT = typeof SHIFT;
export type CONTROL = typeof CONTROL;
export type MENU = typeof MENU;
export type PAUSE = typeof PAUSE;
export type CAPITAL = typeof CAPITAL;
export type KANA = typeof KANA;
export type HANGEUL = typeof HANGEUL;
export type HANGUL = typeof HANGUL;
export type IME_ON = typeof IME_ON;
export type JUNJA = typeof JUNJA;
export type FINAL = typeof FINAL;
export type HANJA = typeof HANJA;
export type KANJI = typeof KANJI;
export type IME_OFF = typeof IME_OFF;
export type ESCAPE = typeof ESCAPE;
export type CONVERT = typeof CONVERT;
export type NONCONVERT = typeof NONCONVERT;
export type ACCEPT = typeof ACCEPT;
export type MODECHANGE = typeof MODECHANGE;
export type SPACE = typeof SPACE;
export type PRIOR = typeof PRIOR;
export type NEXT = typeof NEXT;
export type END = typeof END;
export type HOME = typeof HOME;
export type LEFT = typeof LEFT;
export type UP = typeof UP;
export type RIGHT = typeof RIGHT;
export type DOWN = typeof DOWN;
export type SELECT = typeof SELECT;
export type PRINT = typeof PRINT;
export type EXECUTE = typeof EXECUTE;
export type SNAPSHOT = typeof SNAPSHOT;
export type INSERT = typeof INSERT;
export type DELETE = typeof DELETE;
export type HELP = typeof HELP;
export type D0 = typeof D0;
export type D1 = typeof D1;
export type D2 = typeof D2;
export type D3 = typeof D3;
export type D4 = typeof D4;
export type D5 = typeof D5;
export type D6 = typeof D6;
export type D7 = typeof D7;
export type D8 = typeof D8;
export type D9 = typeof D9;
export type A = typeof A;
export type B = typeof B;
export type C = typeof C;
export type D = typeof D;
export type E = typeof E;
export type F = typeof F;
export type G = typeof G;
export type H = typeof H;
export type I = typeof I;
export type J = typeof J;
export type K = typeof K;
export type L = typeof L;
export type M = typeof M;
export type N = typeof N;
export type O = typeof O;
export type P = typeof P;
export type Q = typeof Q;
export type R = typeof R;
export type S = typeof S;
export type T = typeof T;
export type U = typeof U;
export type V = typeof V;
export type W = typeof W;
export type X = typeof X;
export type Y = typeof Y;
export type Z = typeof Z;
export type LWIN = typeof LWIN;
export type RWIN = typeof RWIN;
export type APPS = typeof APPS;
export type SLEEP = typeof SLEEP;
export type NUMPAD0 = typeof NUMPAD0;
export type NUMPAD1 = typeof NUMPAD1;
export type NUMPAD2 = typeof NUMPAD2;
export type NUMPAD3 = typeof NUMPAD3;
export type NUMPAD4 = typeof NUMPAD4;
export type NUMPAD5 = typeof NUMPAD5;
export type NUMPAD6 = typeof NUMPAD6;
export type NUMPAD7 = typeof NUMPAD7;
export type NUMPAD8 = typeof NUMPAD8;
export type NUMPAD9 = typeof NUMPAD9;
export type MULTIPLY = typeof MULTIPLY;
export type ADD = typeof ADD;
export type SEPARATOR = typeof SEPARATOR;
export type SUBTRACT = typeof SUBTRACT;
export type DECIMAL = typeof DECIMAL;
export type DIVIDE = typeof DIVIDE;
export type F1 = typeof F1;
export type F2 = typeof F2;
export type F3 = typeof F3;
export type F4 = typeof F4;
export type F5 = typeof F5;
export type F6 = typeof F6;
export type F7 = typeof F7;
export type F8 = typeof F8;
export type F9 = typeof F9;
export type F10 = typeof F10;
export type F11 = typeof F11;
export type F12 = typeof F12;
export type F13 = typeof F13;
export type F14 = typeof F14;
export type F15 = typeof F15;
export type F16 = typeof F16;
export type F17 = typeof F17;
export type F18 = typeof F18;
export type F19 = typeof F19;
export type F20 = typeof F20;
export type F21 = typeof F21;
export type F22 = typeof F22;
export type F23 = typeof F23;
export type F24 = typeof F24;
export type NAVIGATION_VIEW = typeof NAVIGATION_VIEW;
export type NAVIGATION_MENU = typeof NAVIGATION_MENU;
export type NAVIGATION_UP = typeof NAVIGATION_UP;
export type NAVIGATION_DOWN = typeof NAVIGATION_DOWN;
export type NAVIGATION_LEFT = typeof NAVIGATION_LEFT;
export type NAVIGATION_RIGHT = typeof NAVIGATION_RIGHT;
export type NAVIGATION_ACCEPT = typeof NAVIGATION_ACCEPT;
export type NAVIGATION_CANCEL = typeof NAVIGATION_CANCEL;
export type NUMLOCK = typeof NUMLOCK;
export type SCROLL = typeof SCROLL;
export type OEM_NEC_EQUAL = typeof OEM_NEC_EQUAL;
export type OEM_FJ_JISHO = typeof OEM_FJ_JISHO;
export type OEM_FJ_MASSHOU = typeof OEM_FJ_MASSHOU;
export type OEM_FJ_TOUROKU = typeof OEM_FJ_TOUROKU;
export type OEM_FJ_LOYA = typeof OEM_FJ_LOYA;
export type OEM_FJ_ROYA = typeof OEM_FJ_ROYA;
export type LSHIFT = typeof LSHIFT;
export type RSHIFT = typeof RSHIFT;
export type LCONTROL = typeof LCONTROL;
export type RCONTROL = typeof RCONTROL;
export type LMENU = typeof LMENU;
export type RMENU = typeof RMENU;
export type BROWSER_BACK = typeof BROWSER_BACK;
export type BROWSER_FORWARD = typeof BROWSER_FORWARD;
export type BROWSER_REFRESH = typeof BROWSER_REFRESH;
export type BROWSER_STOP = typeof BROWSER_STOP;
export type BROWSER_SEARCH = typeof BROWSER_SEARCH;
export type BROWSER_FAVORITES = typeof BROWSER_FAVORITES;
export type BROWSER_HOME = typeof BROWSER_HOME;
export type VOLUME_MUTE = typeof VOLUME_MUTE;
export type VOLUME_DOWN = typeof VOLUME_DOWN;
export type VOLUME_UP = typeof VOLUME_UP;
export type MEDIA_NEXT_TRACK = typeof MEDIA_NEXT_TRACK;
export type MEDIA_PREV_TRACK = typeof MEDIA_PREV_TRACK;
export type MEDIA_STOP = typeof MEDIA_STOP;
export type MEDIA_PLAY_PAUSE = typeof MEDIA_PLAY_PAUSE;
export type LAUNCH_MAIL = typeof LAUNCH_MAIL;
export type LAUNCH_MEDIA_SELECT = typeof LAUNCH_MEDIA_SELECT;
export type LAUNCH_APP1 = typeof LAUNCH_APP1;
export type LAUNCH_APP2 = typeof LAUNCH_APP2;
export type OEM_1 = typeof OEM_1;
export type OEM_PLUS = typeof OEM_PLUS;
export type OEM_COMMA = typeof OEM_COMMA;
export type OEM_MINUS = typeof OEM_MINUS;
export type OEM_PERIOD = typeof OEM_PERIOD;
export type OEM_2 = typeof OEM_2;
export type OEM_3 = typeof OEM_3;
export type GAMEPAD_A = typeof GAMEPAD_A;
export type GAMEPAD_B = typeof GAMEPAD_B;
export type GAMEPAD_X = typeof GAMEPAD_X;
export type GAMEPAD_Y = typeof GAMEPAD_Y;
export type GAMEPAD_RIGHT_SHOULDER = typeof GAMEPAD_RIGHT_SHOULDER;
export type GAMEPAD_LEFT_SHOULDER = typeof GAMEPAD_LEFT_SHOULDER;
export type GAMEPAD_LEFT_TRIGGER = typeof GAMEPAD_LEFT_TRIGGER;
export type GAMEPAD_RIGHT_TRIGGER = typeof GAMEPAD_RIGHT_TRIGGER;
export type GAMEPAD_DPAD_UP = typeof GAMEPAD_DPAD_UP;
export type GAMEPAD_DPAD_DOWN = typeof GAMEPAD_DPAD_DOWN;
export type GAMEPAD_DPAD_LEFT = typeof GAMEPAD_DPAD_LEFT;
export type GAMEPAD_DPAD_RIGHT = typeof GAMEPAD_DPAD_RIGHT;
export type GAMEPAD_MENU = typeof GAMEPAD_MENU;
export type GAMEPAD_VIEW = typeof GAMEPAD_VIEW;
export type GAMEPAD_LEFT_THUMBSTICK_BUTTON = typeof GAMEPAD_LEFT_THUMBSTICK_BUTTON;
export type GAMEPAD_RIGHT_THUMBSTICK_BUTTON = typeof GAMEPAD_RIGHT_THUMBSTICK_BUTTON;
export type GAMEPAD_LEFT_THUMBSTICK_UP = typeof GAMEPAD_LEFT_THUMBSTICK_UP;
export type GAMEPAD_LEFT_THUMBSTICK_DOWN = typeof GAMEPAD_LEFT_THUMBSTICK_DOWN;
export type GAMEPAD_LEFT_THUMBSTICK_RIGHT = typeof GAMEPAD_LEFT_THUMBSTICK_RIGHT;
export type GAMEPAD_LEFT_THUMBSTICK_LEFT = typeof GAMEPAD_LEFT_THUMBSTICK_LEFT;
export type GAMEPAD_RIGHT_THUMBSTICK_UP = typeof GAMEPAD_RIGHT_THUMBSTICK_UP;
export type GAMEPAD_RIGHT_THUMBSTICK_DOWN = typeof GAMEPAD_RIGHT_THUMBSTICK_DOWN;
export type GAMEPAD_RIGHT_THUMBSTICK_RIGHT = typeof GAMEPAD_RIGHT_THUMBSTICK_RIGHT;
export type GAMEPAD_RIGHT_THUMBSTICK_LEFT = typeof GAMEPAD_RIGHT_THUMBSTICK_LEFT;
export type OEM_4 = typeof OEM_4;
export type OEM_5 = typeof OEM_5;
export type OEM_6 = typeof OEM_6;
export type OEM_7 = typeof OEM_7;
export type OEM_8 = typeof OEM_8;
export type OEM_AX = typeof OEM_AX;
export type OEM_102 = typeof OEM_102;
export type ICO_HELP = typeof ICO_HELP;
export type ICO_00 = typeof ICO_00;
export type PROCESSKEY = typeof PROCESSKEY;
export type ICO_CLEAR = typeof ICO_CLEAR;
export type PACKET = typeof PACKET;
export type OEM_RESET = typeof OEM_RESET;
export type OEM_JUMP = typeof OEM_JUMP;
export type OEM_PA1 = typeof OEM_PA1;
export type OEM_PA2 = typeof OEM_PA2;
export type OEM_PA3 = typeof OEM_PA3;
export type OEM_WSCTRL = typeof OEM_WSCTRL;
export type OEM_CUSEL = typeof OEM_CUSEL;
export type OEM_ATTN = typeof OEM_ATTN;
export type OEM_FINISH = typeof OEM_FINISH;
export type OEM_COPY = typeof OEM_COPY;
export type OEM_AUTO = typeof OEM_AUTO;
export type OEM_ENLW = typeof OEM_ENLW;
export type OEM_BACKTAB = typeof OEM_BACKTAB;
export type ATTN = typeof ATTN;
export type CRSEL = typeof CRSEL;
export type EXSEL = typeof EXSEL;
export type EREOF = typeof EREOF;
export type PLAY = typeof PLAY;
export type ZOOM = typeof ZOOM;
export type NONAME = typeof NONAME;
export type PA1 = typeof PA1;
export type OEM_CLEAR = typeof OEM_CLEAR;

export const VK =
    [
        LBUTTON,
        RBUTTON,
        CANCEL,
        MBUTTON,
        XBUTTON1,
        XBUTTON2,
        BACK,
        TAB,
        CLEAR,
        RETURN,
        SHIFT,
        CONTROL,
        MENU,
        PAUSE,
        CAPITAL,
        KANA,
        HANGEUL,
        HANGUL,
        IME_ON,
        JUNJA,
        FINAL,
        HANJA,
        KANJI,
        IME_OFF,
        ESCAPE,
        CONVERT,
        NONCONVERT,
        ACCEPT,
        MODECHANGE,
        SPACE,
        PRIOR,
        NEXT,
        END,
        HOME,
        LEFT,
        UP,
        RIGHT,
        DOWN,
        SELECT,
        PRINT,
        EXECUTE,
        SNAPSHOT,
        INSERT,
        DELETE,
        HELP,
        D0,
        D1,
        D2,
        D3,
        D4,
        D5,
        D6,
        D7,
        D8,
        D9,
        A,
        B,
        C,
        D,
        E,
        F,
        G,
        H,
        I,
        J,
        K,
        L,
        M,
        N,
        O,
        P,
        Q,
        R,
        S,
        T,
        U,
        V,
        W,
        X,
        Y,
        Z,
        LWIN,
        RWIN,
        APPS,
        SLEEP,
        NUMPAD0,
        NUMPAD1,
        NUMPAD2,
        NUMPAD3,
        NUMPAD4,
        NUMPAD5,
        NUMPAD6,
        NUMPAD7,
        NUMPAD8,
        NUMPAD9,
        MULTIPLY,
        ADD,
        SEPARATOR,
        SUBTRACT,
        DECIMAL,
        DIVIDE,
        F1,
        F2,
        F3,
        F4,
        F5,
        F6,
        F7,
        F8,
        F9,
        F10,
        F11,
        F12,
        F13,
        F14,
        F15,
        F16,
        F17,
        F18,
        F19,
        F20,
        F21,
        F22,
        F23,
        F24,
        NAVIGATION_VIEW,
        NAVIGATION_MENU,
        NAVIGATION_UP,
        NAVIGATION_DOWN,
        NAVIGATION_LEFT,
        NAVIGATION_RIGHT,
        NAVIGATION_ACCEPT,
        NAVIGATION_CANCEL,
        NUMLOCK,
        SCROLL,
        OEM_NEC_EQUAL,
        OEM_FJ_JISHO,
        OEM_FJ_MASSHOU,
        OEM_FJ_TOUROKU,
        OEM_FJ_LOYA,
        OEM_FJ_ROYA,
        LSHIFT,
        RSHIFT,
        LCONTROL,
        RCONTROL,
        LMENU,
        RMENU,
        BROWSER_BACK,
        BROWSER_FORWARD,
        BROWSER_REFRESH,
        BROWSER_STOP,
        BROWSER_SEARCH,
        BROWSER_FAVORITES,
        BROWSER_HOME,
        VOLUME_MUTE,
        VOLUME_DOWN,
        VOLUME_UP,
        MEDIA_NEXT_TRACK,
        MEDIA_PREV_TRACK,
        MEDIA_STOP,
        MEDIA_PLAY_PAUSE,
        LAUNCH_MAIL,
        LAUNCH_MEDIA_SELECT,
        LAUNCH_APP1,
        LAUNCH_APP2,
        OEM_1,
        OEM_PLUS,
        OEM_COMMA,
        OEM_MINUS,
        OEM_PERIOD,
        OEM_2,
        OEM_3,
        GAMEPAD_A,
        GAMEPAD_B,
        GAMEPAD_X,
        GAMEPAD_Y,
        GAMEPAD_RIGHT_SHOULDER,
        GAMEPAD_LEFT_SHOULDER,
        GAMEPAD_LEFT_TRIGGER,
        GAMEPAD_RIGHT_TRIGGER,
        GAMEPAD_DPAD_UP,
        GAMEPAD_DPAD_DOWN,
        GAMEPAD_DPAD_LEFT,
        GAMEPAD_DPAD_RIGHT,
        GAMEPAD_MENU,
        GAMEPAD_VIEW,
        GAMEPAD_LEFT_THUMBSTICK_BUTTON,
        GAMEPAD_RIGHT_THUMBSTICK_BUTTON,
        GAMEPAD_LEFT_THUMBSTICK_UP,
        GAMEPAD_LEFT_THUMBSTICK_DOWN,
        GAMEPAD_LEFT_THUMBSTICK_RIGHT,
        GAMEPAD_LEFT_THUMBSTICK_LEFT,
        GAMEPAD_RIGHT_THUMBSTICK_UP,
        GAMEPAD_RIGHT_THUMBSTICK_DOWN,
        GAMEPAD_RIGHT_THUMBSTICK_RIGHT,
        GAMEPAD_RIGHT_THUMBSTICK_LEFT,
        OEM_4,
        OEM_5,
        OEM_6,
        OEM_7,
        OEM_8,
        OEM_AX,
        OEM_102,
        ICO_HELP,
        ICO_00,
        PROCESSKEY,
        ICO_CLEAR,
        PACKET,
        OEM_RESET,
        OEM_JUMP,
        OEM_PA1,
        OEM_PA2,
        OEM_PA3,
        OEM_WSCTRL,
        OEM_CUSEL,
        OEM_ATTN,
        OEM_FINISH,
        OEM_COPY,
        OEM_AUTO,
        OEM_ENLW,
        OEM_BACKTAB,
        ATTN,
        CRSEL,
        EXSEL,
        EREOF,
        PLAY,
        ZOOM,
        NONAME,
        PA1,
        OEM_CLEAR
    ] as const;

export type VK = typeof VK[number];
