/**
 *
 *
 * @module @sorrell/windows/Key
 *
 * @file      Key.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// export const Ctrl = "Ctrl" as const;
// export type Ctrl = typeof Ctrl;

// export const Shift = "Shift" as const;
// export type Shift = typeof Shift;

// export const Alt = "Alt" as const;
// export type Alt = typeof Alt;

// export const Super = "Super" as const;
// export type Super = typeof Super;

// export const Digit_0 = "0" as const;
// export type Digit_0 = typeof Digit_0;

// export const Digit_1 = "1" as const;
// export type Digit_1 = typeof Digit_1;

// export const Digit_2 = "2" as const;
// export type Digit_2 = typeof Digit_2;

// export const Digit_3 = "3" as const;
// export type Digit_3 = typeof Digit_3;

// export const Digit_4 = "4" as const;
// export type Digit_4 = typeof Digit_4;

// export const Digit_5 = "5" as const;
// export type Digit_5 = typeof Digit_5;

// export const Digit_6 = "6" as const;
// export type Digit_6 = typeof Digit_6;

// export const Digit_7 = "7" as const;
// export type Digit_7 = typeof Digit_7;

// export const Digit_8 = "8" as const;
// export type Digit_8 = typeof Digit_8;

// export const Digit_9 = "9" as const;
// export type Digit_9 = typeof Digit_9;

// export const A = "A" as const;
// export type A = typeof A;

// export const B = "B" as const;
// export type B = typeof B;

// export const C = "C" as const;
// export type C = typeof C;

// export const D = "D" as const;
// export type D = typeof D;

// export const E = "E" as const;
// export type E = typeof E;

// export const F = "F" as const;
// export type F = typeof F;

// export const G = "G" as const;
// export type G = typeof G;

// export const H = "H" as const;
// export type H = typeof H;

// export const I = "I" as const;
// export type I = typeof I;

// export const J = "J" as const;
// export type J = typeof J;

// export const K = "K" as const;
// export type K = typeof K;

// export const L = "L" as const;
// export type L = typeof L;

// export const M = "M" as const;
// export type M = typeof M;

// export const N = "N" as const;
// export type N = typeof N;

// export const O = "O" as const;
// export type O = typeof O;

// export const P = "P" as const;
// export type P = typeof P;

// export const Q = "Q" as const;
// export type Q = typeof Q;

// export const R = "R" as const;
// export type R = typeof R;

// export const S = "S" as const;
// export type S = typeof S;

// export const T = "T" as const;
// export type T = typeof T;

// export const U = "U" as const;
// export type U = typeof U;

// export const V = "V" as const;
// export type V = typeof V;

// export const W = "W" as const;
// export type W = typeof W;

// export const X = "X" as const;
// export type X = typeof X;

// export const Y = "Y" as const;
// export type Y = typeof Y;

// export const Z = "Z" as const;
// export type Z = typeof Z;

// export const Parenthesis_Open = "(" as const;
// export type Parenthesis_Open = typeof Parenthesis_Open;

// export const Parenthesis_Closed = ")" as const;
// export type Parenthesis_Closed = typeof Parenthesis_Closed;

// export const ExclamationPoint = "!" as const;
// export type ExclamationPoint = typeof ExclamationPoint;

// export const At = "@" as const;
// export type At = typeof At;

// export const Hash = "#" as const;
// export type Hash = typeof Hash;

// export const Dollar = "$" as const;
// export type Dollar = typeof Dollar;

// export const Percentage = "%" as const;
// export type Percentage = typeof Percentage;

// export const Caret = "^" as const;
// export type Caret = typeof Caret;

// export const Ampersand = "&" as const;
// export type Ampersand = typeof Ampersand;

// export const Colon = ":" as const;
// export type Colon = typeof Colon;

// export const Semicolon = ";" as const;
// export type Semicolon = typeof Semicolon;

// export const Plus = "+" as const;
// export type Plus = typeof Plus;

// export const Equal = "=" as const;
// export type Equal = typeof Equal;

// export const LessThan = "<" as const;
// export type LessThan = typeof LessThan;

// export const GreaterThan = ">" as const;
// export type GreaterThan = typeof GreaterThan;

// export const Comma = "," as const;
// export type Comma = typeof Comma;

// export const Period = "." as const;
// export type Period = typeof Period;

// export const Hyphen = "-" as const;
// export type Hyphen = typeof Hyphen;

// export const Underscore = "_" as const;
// export type Underscore = typeof Underscore;

// export const QuestionMark = "?" as const;
// export type QuestionMark = typeof QuestionMark;

// export const ForwardSlash = "/" as const;
// export type ForwardSlash = typeof ForwardSlash;

// export const Tilde = "~" as const;
// export type Tilde = typeof Tilde;

// export const Backtick = "`" as const;
// export type Backtick = typeof Backtick;

// export const CurlyBrace_Open = "{" as const;
// export type CurlyBrace_Open = typeof CurlyBrace_Open;

// export const CurlyBrace_Closed = "}" as const;
// export type CurlyBrace_Closed = typeof CurlyBrace_Closed;

// export const SquareBracket_Open = "[" as const;
// export type SquareBracket_Open = typeof SquareBracket_Open;

// export const SquareBracket_Closed = "]" as const;
// export type SquareBracket_Closed = typeof SquareBracket_Closed;

// export const Pipe = "|" as const;
// export type Pipe = typeof Pipe;

// export const Backslash = "\\" as const;
// export type Backslash = typeof Backslash;

// export const Quote = "\"" as const;
// export type Quote = typeof Quote;

// export const Space = " " as const;
// export type Space = typeof Space;

// export const Tab = "Tab" as const;
// export type Tab = typeof Tab;

// export const Capslock = "Capslock" as const;
// export type Capslock = typeof Capslock;

// export const Numlock = "Numlock" as const;
// export type Numlock = typeof Numlock;

// export const Scrolllock = "Scrolllock" as const;
// export type Scrolllock = typeof Scrolllock;

// export const Backspace = "Backspace" as const;
// export type Backspace = typeof Backspace;

// export const Delete = "Delete" as const;
// export type Delete = typeof Delete;

// export const Insert = "Insert" as const;
// export type Insert = typeof Insert;

// export const Return = "Return" as const;
// export type Return = typeof Return;

// export const Up = "Up" as const;
// export type Up = typeof Up;

// export const Down = "Down" as const;
// export type Down = typeof Down;

// export const Left = "Left" as const;
// export type Left = typeof Left;

// export const Right = "Right" as const;
// export type Right = typeof Right;

// export const Escape = "Escape" as const;
// export type Escape = typeof Escape;

// export const PageUp = "PageUp" as const;
// export type PageUp = typeof PageUp;

// export const PageDown = "PageDown" as const;
// export type PageDown = typeof PageDown;

// export const Home = "Home" as const;
// export type Home = typeof Home;

// export const End = "End" as const;
// export type End = typeof End;

// export const VolumeUp = "VolumeUp" as const;
// export type VolumeUp = typeof VolumeUp;

// export const VolumeDown = "VolumeDown" as const;
// export type VolumeDown = typeof VolumeDown;

// export const VolumeMute = "VolumeMute" as const;
// export type VolumeMute = typeof VolumeMute;

// export const MediaNextTrack = "MediaNextTrack" as const;
// export type MediaNextTrack = typeof MediaNextTrack;

// export const MediaPreviousTrack = "MediaPreviousTrack" as const;
// export type MediaPreviousTrack = typeof MediaPreviousTrack;

// export const MediaStop = "MediaStop" as const;
// export type MediaStop = typeof MediaStop;

// export const MediaPlayPause = "MediaPlayPause" as const;
// export type MediaPlayPause = typeof MediaPlayPause;

// export const PrintScreen = "PrintScreen" as const;
// export type PrintScreen = typeof PrintScreen;

// export const Num0 = "num0" as const;
// export type Num0 = typeof Num0;

// export const Num1 = "num1" as const;
// export type Num1 = typeof Num1;

// export const Num2 = "num2" as const;
// export type Num2 = typeof Num2;

// export const Num3 = "num3" as const;
// export type Num3 = typeof Num3;

// export const Num4 = "num4" as const;
// export type Num4 = typeof Num4;

// export const Num5 = "num5" as const;
// export type Num5 = typeof Num5;

// export const Num6 = "num6" as const;
// export type Num6 = typeof Num6;

// export const Num7 = "num7" as const;
// export type Num7 = typeof Num7;

// export const Num8 = "num8" as const;
// export type Num8 = typeof Num8;

// export const Num9 = "num9" as const;
// export type Num9 = typeof Num9;

// export const NumDec = "numdec" as const;
// export type NumDec = typeof NumDec;

// export const NumAdd = "numadd" as const;
// export type NumAdd = typeof NumAdd;

// export const NumSub = "numsub" as const;
// export type NumSub = typeof NumSub;

// export const NumMult = "nummult" as const;
// export type NumMult = typeof NumMult;

// export const NumDiv = "numdiv" as const;
// export type NumDiv = typeof NumDiv;

// export const F1 = "F1" as const;
// export type F1 = typeof F1;

// export const F2 = "F2" as const;
// export type F2 = typeof F2;

// export const F3 = "F3" as const;
// export type F3 = typeof F3;

// export const F4 = "F4" as const;
// export type F4 = typeof F4;

// export const F5 = "F5" as const;
// export type F5 = typeof F5;

// export const F6 = "F6" as const;
// export type F6 = typeof F6;

// export const F7 = "F7" as const;
// export type F7 = typeof F7;

// export const F8 = "F8" as const;
// export type F8 = typeof F8;

// export const F9 = "F9" as const;
// export type F9 = typeof F9;

// export const F10 = "F10" as const;
// export type F10 = typeof F10;

// export const F11 = "F11" as const;
// export type F11 = typeof F11;

// export const F12 = "F12" as const;
// export type F12 = typeof F12;

// export const F13 = "F13" as const;
// export type F13 = typeof F13;

// export const F14 = "F14" as const;
// export type F14 = typeof F14;

// export const F15 = "F15";
// export type F15 = typeof F15;

// export const F16 = "F16";
// export type F16 = typeof F16;

// export const F17 = "F17";
// export type F17 = typeof F17;

// export const F18 = "F18";
// export type F18 = typeof F18;

// export const F19 = "F19";
// export type F19 = typeof F19;

// export const F20 = "F20";
// export type F20 = typeof F20;

// export const F21 = "F21";
// export type F21 = typeof F21;

// export const F22 = "F22";
// export type F22 = typeof F22;

// export const F23 = "F23";
// export type F23 = typeof F23;

// export const F24 = "F24";
// export type F24 = typeof F24;

// export const Keys =
//     [
//         Ctrl,
//         Super,
//         Alt,
//         Shift,
//         Digit_0,
//         Digit_1,
//         Digit_2,
//         Digit_3,
//         Digit_4,
//         Digit_5,
//         Digit_6,
//         Digit_7,
//         Digit_8,
//         Digit_9,
//         A,
//         B,
//         C,
//         D,
//         E,
//         F,
//         G,
//         H,
//         I,
//         J,
//         K,
//         L,
//         M,
//         N,
//         O,
//         P,
//         Q,
//         R,
//         S,
//         T,
//         U,
//         V,
//         W,
//         X,
//         Y,
//         Z,
//         Parenthesis_Open,
//         Parenthesis_Closed,
//         ExclamationPoint,
//         At,
//         Hash,
//         Dollar,
//         Percentage,
//         Caret,
//         Ampersand,
//         Colon,
//         Semicolon,
//         Plus,
//         Equal,
//         LessThan,
//         GreaterThan,
//         Comma,
//         Period,
//         Hyphen,
//         Underscore,
//         QuestionMark,
//         ForwardSlash,
//         Tilde,
//         Backtick,
//         CurlyBrace_Open,
//         CurlyBrace_Closed,
//         SquareBracket_Open,
//         SquareBracket_Closed,
//         Pipe,
//         Backslash,
//         Quote,
//         Space,
//         Tab,
//         Capslock,
//         Numlock,
//         Scrolllock,
//         Backspace,
//         Delete,
//         Insert,
//         Return,
//         Up,
//         Down,
//         Left,
//         Right,
//         Escape,
//         PageUp,
//         PageDown,
//         Home,
//         End,
//         VolumeUp,
//         VolumeDown,
//         VolumeMute,
//         MediaNextTrack,
//         MediaPreviousTrack,
//         MediaStop,
//         MediaPlayPause,
//         PrintScreen,
//         Num0,
//         Num1,
//         Num2,
//         Num3,
//         Num4,
//         Num5,
//         Num6,
//         Num7,
//         Num8,
//         Num9,
//         NumDec,
//         NumAdd,
//         NumSub,
//         NumMult,
//         NumDiv,
//         F1,
//         F2,
//         F3,
//         F4,
//         F5,
//         F6,
//         F7,
//         F8,
//         F9,
//         F10,
//         F11,
//         F12,
//         F13,
//         F14,
//         F15,
//         F16,
//         F17,
//         F18,
//         F19,
//         F20,
//         F21,
//         F22,
//         F23,
//         F24
//     ] as const;

// export type Modifier =
//     | Ctrl
//     | Shift
//     | Alt
//     | Super;

// export type Key =
//     | Digit_0
//     | Digit_1
//     | Digit_2
//     | Digit_3
//     | Digit_4
//     | Digit_5
//     | Digit_6
//     | Digit_7
//     | Digit_8
//     | Digit_9
//     | A
//     | B
//     | C
//     | D
//     | E
//     | F
//     | G
//     | H
//     | I
//     | J
//     | K
//     | L
//     | M
//     | N
//     | O
//     | P
//     | Q
//     | R
//     | S
//     | T
//     | U
//     | V
//     | W
//     | X
//     | Y
//     | Z
//     | Parenthesis_Open
//     | Parenthesis_Closed
//     | ExclamationPoint
//     | At
//     | Hash
//     | Dollar
//     | Percentage
//     | Caret
//     | Ampersand
//     | Colon
//     | Semicolon
//     | Plus
//     | Equal
//     | LessThan
//     | GreaterThan
//     | Comma
//     | Period
//     | Hyphen
//     | Underscore
//     | QuestionMark
//     | ForwardSlash
//     | Tilde
//     | Backtick
//     | CurlyBrace_Open
//     | CurlyBrace_Closed
//     | SquareBracket_Open
//     | SquareBracket_Closed
//     | Pipe
//     | Backslash
//     | Quote
//     | Space
//     | Tab
//     | Capslock
//     | Numlock
//     | Scrolllock
//     | Backspace
//     | Delete
//     | Insert
//     | Return
//     | Up
//     | Down
//     | Left
//     | Right
//     | Escape
//     | PageUp
//     | PageDown
//     | Home
//     | End
//     | VolumeUp
//     | VolumeDown
//     | VolumeMute
//     | MediaNextTrack
//     | MediaPreviousTrack
//     | MediaStop
//     | MediaPlayPause
//     | PrintScreen
//     | Num0
//     | Num1
//     | Num2
//     | Num3
//     | Num4
//     | Num5
//     | Num6
//     | Num7
//     | Num8
//     | Num9
//     | NumDec
//     | NumAdd
//     | NumSub
//     | NumMult
//     | NumDiv
//     | F1
//     | F2
//     | F3
//     | F4
//     | F5
//     | F6
//     | F7
//     | F8
//     | F9
//     | F10
//     | F11
//     | F12
//     | F13
//     | F14
//     | F15
//     | F16
//     | F17
//     | F18
//     | F19
//     | F20
//     | F21
//     | F22
//     | F23
//     | F24;

// export type Any =
//     | Modifier
//     | Key;
