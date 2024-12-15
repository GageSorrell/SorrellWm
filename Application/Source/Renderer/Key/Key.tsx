/* File:      Key.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import { useMemo, type FC, type ReactElement } from "react";
import type { FKey, FKeyId, FVirtualKey, PKey } from "./Key.Types";

/** @TODO */
const BackspaceKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserModifier = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserBackKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserRefreshKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserForwardKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserSearchKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserStopKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserFavoritesKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const BrowserStartKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const SpaceKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const TabKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const WindowsKeyBase = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const LeftWindowsKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const RightWindowsKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const EnterKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const ShiftKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const NextTrackKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const PreviousTrackKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const StopMediaKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const PlayPauseMediaKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const StartMailKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const SelectMediaKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const StartApplicationOneKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

/** @TODO */
const StartApplicationTwoKey = (): ReactElement =>
{
    return (
        <div>

        </div>
    );
};

const NumModifier = (): string => "NUM";

const LeftSide = (): string => "L";
const RightSide = (): string => "R";

const VkCodes: Readonly<Record<FVirtualKey, FKey>> =
{
    0x08:
    {
        Display: BackspaceKey,
        Modifier: undefined,
        Side: undefined
    },
    0x09:
    {
        Display: TabKey,
        Modifier: undefined,
        Side: undefined
    },
    0x0D:
    {
        Display: EnterKey,
        Modifier: undefined,
        Side: undefined
    },
    0x10:
    {
        Display: ShiftKey,
        Modifier: undefined,
        Side: "Either"
    },
    0x11:
    {
        Display: "Ctrl",
        Modifier: undefined,
        Side: "Either"
    },
    0x12:
    {
        Display: "Alt",
        Modifier: undefined,
        Side: "Either"
    },
    0x13:
    {
        Display: SpaceKey,
        Modifier: undefined,
        Side: undefined
    },
    0x21:
    {
        Display: "PgUp",
        Modifier: undefined,
        Side: undefined
    },
    0x22:
    {
        Display: "PgDown",
        Modifier: undefined,
        Side: undefined
    },
    0x23:
    {
        Display: "End",
        Modifier: undefined,
        Side: undefined
    },
    0x24:
    {
        Display: "Home",
        Modifier: undefined,
        Side: undefined
    },
    0x25:
    {
        Display: "LeftArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x26:
    {
        Display: "UpArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x27:
    {
        Display: "RightArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x28:
    {
        Display: "DownArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x2D:
    {
        Display: "Ins",
        Modifier: undefined,
        Side: undefined
    },
    0x2E:
    {
        Display: "Del",
        Modifier: undefined,
        Side: undefined
    },
    0x30:
    {
        Display: "0",
        Modifier: undefined,
        Side: undefined
    },
    0x31:
    {
        Display: "1",
        Modifier: undefined,
        Side: undefined
    },
    0x32:
    {
        Display: "2",
        Modifier: undefined,
        Side: undefined
    },
    0x33:
    {
        Display: "3",
        Modifier: undefined,
        Side: undefined
    },
    0x34:
    {
        Display: "4",
        Modifier: undefined,
        Side: undefined
    },
    0x35:
    {
        Display: "5",
        Modifier: undefined,
        Side: undefined
    },
    0x36:
    {
        Display: "6",
        Modifier: undefined,
        Side: undefined
    },
    0x37:
    {
        Display: "7",
        Modifier: undefined,
        Side: undefined
    },
    0x38:
    {
        Display: "8",
        Modifier: undefined,
        Side: undefined
    },
    0x39:
    {
        Display: "9",
        Modifier: undefined,
        Side: undefined
    },
    0x41:
    {
        Display: "A",
        Modifier: undefined,
        Side: undefined
    },
    0x42:
    {
        Display: "B",
        Modifier: undefined,
        Side: undefined
    },
    0x43:
    {
        Display: "C",
        Modifier: undefined,
        Side: undefined
    },
    0x44:
    {
        Display: "D",
        Modifier: undefined,
        Side: undefined
    },
    0x45:
    {
        Display: "E",
        Modifier: undefined,
        Side: undefined
    },
    0x46:
    {
        Display: "F",
        Modifier: undefined,
        Side: undefined
    },
    0x47:
    {
        Display: "G",
        Modifier: undefined,
        Side: undefined
    },
    0x48:
    {
        Display: "H",
        Modifier: undefined,
        Side: undefined
    },
    0x49:
    {
        Display: "I",
        Modifier: undefined,
        Side: undefined
    },
    0x4A:
    {
        Display: "J",
        Modifier: undefined,
        Side: undefined
    },
    0x4B:
    {
        Display: "K",
        Modifier: undefined,
        Side: undefined
    },
    0x4C:
    {
        Display: "L",
        Modifier: undefined,
        Side: undefined
    },
    0x4D:
    {
        Display: "M",
        Modifier: undefined,
        Side: undefined
    },
    0x4E:
    {
        Display: "N",
        Modifier: undefined,
        Side: undefined
    },
    0x4F:
    {
        Display: "O",
        Modifier: undefined,
        Side: undefined
    },
    0x50:
    {
        Display: "P",
        Modifier: undefined,
        Side: undefined
    },
    0x51:
    {
        Display: "Q",
        Modifier: undefined,
        Side: undefined
    },
    0x52:
    {
        Display: "R",
        Modifier: undefined,
        Side: undefined
    },
    0x53:
    {
        Display: "S",
        Modifier: undefined,
        Side: undefined
    },
    0x54:
    {
        Display: "T",
        Modifier: undefined,
        Side: undefined
    },
    0x55:
    {
        Display: "U",
        Modifier: undefined,
        Side: undefined
    },
    0x56:
    {
        Display: "V",
        Modifier: undefined,
        Side: undefined
    },
    0x57:
    {
        Display: "W",
        Modifier: undefined,
        Side: undefined
    },
    0x58:
    {
        Display: "X",
        Modifier: undefined,
        Side: undefined
    },
    0x59:
    {
        Display: "Y",
        Modifier: undefined,
        Side: undefined
    },
    0x5A:
    {
        Display: "Z",
        Modifier: undefined,
        Side: undefined
    },
    0x5B:
    {
        Display: LeftWindowsKey,
        Modifier: undefined,
        Side: undefined
    },
    0x5C:
    {
        Display: RightWindowsKey,
        Modifier: undefined,
        Side: undefined
    },
    0x60:
    {
        Display: "0",
        Modifier: NumModifier,
        Side: undefined
    },
    0x61:
    {
        Display: "1",
        Modifier: NumModifier,
        Side: undefined
    },
    0x62:
    {
        Display: "2",
        Modifier: NumModifier,
        Side: undefined
    },
    0x63:
    {
        Display: "3",
        Modifier: NumModifier,
        Side: undefined
    },
    0x64:
    {
        Display: "4",
        Modifier: NumModifier,
        Side: undefined
    },
    0x65:
    {
        Display: "5",
        Modifier: NumModifier,
        Side: undefined
    },
    0x66:
    {
        Display: "6",
        Modifier: NumModifier,
        Side: undefined
    },
    0x67:
    {
        Display: "7",
        Modifier: NumModifier,
        Side: undefined
    },
    0x68:
    {
        Display: "8",
        Modifier: NumModifier,
        Side: undefined
    },
    0x69:
    {
        Display: "9",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6A:
    {
        Display: "×",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6B:
    {
        Display: "+",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6D:
    {
        Display: "-",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6E:
    {
        Display: ".",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6F:
    {
        Display: "/",
        Modifier: NumModifier,
        Side: undefined
    },
    0x70:
    {
        Display: "F1",
        Modifier: undefined,
        Side: undefined
    },
    0x71:
    {
        Display: "F2",
        Modifier: undefined,
        Side: undefined
    },
    0x72:
    {
        Display: "F3",
        Modifier: undefined,
        Side: undefined
    },
    0x73:
    {
        Display: "F4",
        Modifier: undefined,
        Side: undefined
    },
    0x74:
    {
        Display: "F5",
        Modifier: undefined,
        Side: undefined
    },
    0x75:
    {
        Display: "F6",
        Modifier: undefined,
        Side: undefined
    },
    0x76:
    {
        Display: "F7",
        Modifier: undefined,
        Side: undefined
    },
    0x77:
    {
        Display: "F8",
        Modifier: undefined,
        Side: undefined
    },
    0x78:
    {
        Display: "F9",
        Modifier: undefined,
        Side: undefined
    },
    0x79:
    {
        Display: "F10",
        Modifier: undefined,
        Side: undefined
    },
    0x7A:
    {
        Display: "F11",
        Modifier: undefined,
        Side: undefined
    },
    0x7B:
    {
        Display: "F12",
        Modifier: undefined,
        Side: undefined
    },
    0x7C:
    {
        Display: "F13",
        Modifier: undefined,
        Side: undefined
    },
    0x7D:
    {
        Display: "F14",
        Modifier: undefined,
        Side: undefined
    },
    0x7E:
    {
        Display: "F15",
        Modifier: undefined,
        Side: undefined
    },
    0x7F:
    {
        Display: "F16",
        Modifier: undefined,
        Side: undefined
    },
    0x80:
    {
        Display: "F17",
        Modifier: undefined,
        Side: undefined
    },
    0x81:
    {
        Display: "F18",
        Modifier: undefined,
        Side: undefined
    },
    0x82:
    {
        Display: "F19",
        Modifier: undefined,
        Side: undefined
    },
    0x83:
    {
        Display: "F20",
        Modifier: undefined,
        Side: undefined
    },
    0x84:
    {
        Display: "F21",
        Modifier: undefined,
        Side: undefined
    },
    0x85:
    {
        Display: "F22",
        Modifier: undefined,
        Side: undefined
    },
    0x86:
    {
        Display: "F23",
        Modifier: undefined,
        Side: undefined
    },
    0x87:
    {
        Display: "F24",
        Modifier: undefined,
        Side: undefined
    },
    0xA0:
    {
        Display: ShiftKey,
        Modifier: undefined,
        Side: "Left"
    },
    0xA1:
    {
        Display: ShiftKey,
        Modifier: undefined,
        Side: "Right"
    },
    0xA2:
    {
        Display: "Ctrl",
        Modifier: undefined,
        Side: "Left"
    },
    0xA3:
    {
        Display: "Ctrl",
        Modifier: undefined,
        Side: "Right"
    },
    0xA4:
    {
        Display: "Alt",
        Modifier: undefined,
        Side: "Left"
    },
    0xA5:
    {
        Display: "Alt",
        Modifier: undefined,
        Side: "Right"
    },
    0xA6:
    {
        Display: BrowserBackKey,
        Modifier: BrowserModifier,
        Side: undefined
    },
    0xA7:
    {
        Display: BrowserForwardKey,
        Modifier: BrowserModifier,
        Side: undefined
    },
    0xA8:
    {
        Display: BrowserRefreshKey,
        Modifier: BrowserModifier,
        Side: undefined
    },
    0xA9:
    {
        Display: BrowserStopKey,
        Modifier: BrowserModifier,
        Side: undefined
    },
    0xAA:
    {
        Display: BrowserSearchKey,
        Modifier: BrowserModifier,
        Side: undefined
    },
    0xAB:
    {
        Display: BrowserFavoritesKey,
        Modifier: BrowserModifier,
        Side: undefined
    },
    0xAC:
    {
        Display: BrowserStartKey,
        Modifier: BrowserModifier,
        Side: undefined
    },
    0xB0:
    {
        Display: NextTrackKey,
        Modifier: undefined,
        Side: undefined
    },
    0xB1:
    {
        Display: PreviousTrackKey,
        Modifier: undefined,
        Side: undefined
    },
    0xB2:
    {
        Display: StopMediaKey,
        Modifier: undefined,
        Side: undefined
    },
    0xB3:
    {
        Display: PlayPauseMediaKey,
        Modifier: undefined,
        Side: undefined
    },
    0xB4:
    {
        Display: StartMailKey,
        Modifier: undefined,
        Side: undefined
    },
    0xB5:
    {
        Display: SelectMediaKey,
        Modifier: undefined,
        Side: undefined
    },
    0xB6:
    {
        Display: StartApplicationOneKey,
        Modifier: undefined,
        Side: undefined
    },
    0xB7:
    {
        Display: StartApplicationTwoKey,
        Modifier: undefined,
        Side: undefined
    },
    0xBA:
    {
        Display: ";",
        Modifier: undefined,
        Side: undefined
    },
    0xBB:
    {
        Display: "+",
        Modifier: undefined,
        Side: undefined
    },
    0xBC:
    {
        Display: ",",
        Modifier: undefined,
        Side: undefined
    },
    0xBD:
    {
        Display: "-",
        Modifier: undefined,
        Side: undefined
    },
    0xBE:
    {
        Display: ".",
        Modifier: undefined,
        Side: undefined
    },
    0xBF:
    {
        Display: "/",
        Modifier: undefined,
        Side: undefined
    },
    0xC0:
    {
        Display: "`",
        Modifier: undefined,
        Side: undefined
    },
    0xDB:
    {
        Display: "[",
        Modifier: undefined,
        Side: undefined
    },
    0xDC:
    {
        Display: "\\",
        Modifier: undefined,
        Side: undefined
    },
    0xDD:
    {
        Display: "]",
        Modifier: undefined,
        Side: undefined
    },
    0xDE:
    {
        Display: "'",
        Modifier: undefined,
        Side: undefined
    }
};

/** Developer-friendly names of key codes. */
export const KeyIds: Record<FVirtualKey, FKeyId> =
{
    0x08: "Backspace",
    0x09: "Tab",
    0x0D: "Enter",
    0x10: "Shift",
    0x11: "Ctrl",
    0x12: "Alt",
    0x13: "Pause",
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

export type PModifierKeyContainer =
{
    Child: FC;
};

const CornerContainer = ({ Child }: PModifierKeyContainer): ReactElement =>
{
    return (
        <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem" }}>
            <Child/>
        </div>
    );
};


export const Key = ({ IsSmall, Value }: PKey): ReactElement =>
{
    const { Display, Modifier, Side } = Value;
    const Child: FC | undefined = useMemo((): FC | undefined =>
    {
        if (Modifier !== undefined)
        {
            return Modifier;
        }
        else if (Side !== undefined && Side !== "Either")
        {
            return Side === "Left"
                ? LeftSide
                : RightSide;
        }
        else
        {
            return undefined;
        }
    }, [ Modifier, Side ]);

    const DisplayComponent: FC = useMemo((): FC =>
    {
        return typeof Display === "string"
            ? () => Display
            : Display;
    }, [ Display ]);

    return (
        <div style={{ backgroundColor: "#0078D7", borderRadius: 4, width: "4rem", height: "4rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span style={{ color: "white", fontSize: "2rem" }}>
                <DisplayComponent/>
            </span>
            {
                (Child !== undefined) && <CornerContainer { ...{ Child } }/>
            }
        </div>
    );
};

export type PKeyCombination =
{
    Keys: FVirtualKey | Array<FVirtualKey>;
};

export const KeyCombinationDisplay = ({ Keys }: PKeyCombination): ReactElement =>
{
    const KeyElements: Array<ReactElement> = useMemo((): Array<ReactElement> =>
    {
        const KeyArray: Array<FVirtualKey> = Array.isArray(Keys)
            ? Keys
            : [ Keys ];

        return KeyArray.map((VirtualKey: FVirtualKey): ReactElement =>
        {
            return (
                <Key
                    IsSmall
                    Value={ VkCodes[VirtualKey] }
                />
            );
        });
    }, [ Keys ]);

    return (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            {
                KeyElements
            }
        </div>
    );
};
