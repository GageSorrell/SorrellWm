/* File:      Key.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type ReactElement, useMemo } from "react";
import type { FKey, PKey } from "./Key.Types";
import type { FVirtualKey } from "../Keyboard.Types";
import { UseThemeColors } from "@/Utility";
import { tokens } from "@fluentui/react-components";

const WindowsLogo: string = "\uE782";
const GlobeSymbol: string = "\uE774";
const NumModifier: string = "NUM";
const ShiftSymbol: string = "\uE752";

/* eslint-disable sort-keys */

export const Keys: Readonly<Record<FVirtualKey, FKey>> =
{
    0x05:
    {
        Display: "\uE962",
        Modifier: "1",
        Side: undefined
    },
    0x06:
    {
        Display: "\uE962",
        Modifier: "2",
        Side: undefined
    },
    0x08:
    {
        Display: "\uE750",
        Modifier: undefined,
        Side: undefined
    },
    0x09:
    {
        Display: "\uE7FD",
        Modifier: undefined,
        Side: undefined
    },
    0x0D:
    {
        Display: "\uE751",
        Modifier: undefined,
        Side: undefined
    },
    0x10:
    {
        Display: "\uE752",
        Modifier: undefined,
        Side: "Either"
    },
    0x11:
    {
        Display: "CTRL",
        Modifier: undefined,
        Side: "Either"
    },
    0x12:
    {
        Display: "ALT",
        Modifier: undefined,
        Side: "Either"
    },
    0x13:
    {
        Display: "\uE81A",
        Modifier: undefined,
        Side: undefined
    },
    0x20:
    {
        Display: "\uE75D",
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
        Display: WindowsLogo,
        Modifier: undefined,
        Side: "L"
    },
    0x5C:
    {
        Display: WindowsLogo,
        Modifier: undefined,
        Side: "R"
    },
    0x5D:
    {
        Display: "\uE700",
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
        Display: ShiftSymbol,
        Modifier: undefined,
        Side: "L"
    },
    0xA1:
    {
        Display: ShiftSymbol,
        Modifier: undefined,
        Side: "R"
    },
    0xA2:
    {
        Display: "CTRL",
        Modifier: undefined,
        Side: "L"
    },
    0xA3:
    {
        Display: "CTRL",
        Modifier: undefined,
        Side: "R"
    },
    0xA4:
    {
        Display: "ALT",
        Modifier: undefined,
        Side: "L"
    },
    0xA5:
    {
        Display: "ALT",
        Modifier: undefined,
        Side: "R"
    },
    0xA6:
    {
        Display: "&#E72B",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA7:
    {
        Display: "\uE72A",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA8:
    {
        Display: "\uE72C",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA9:
    {
        Display: "\uE733",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAA:
    {
        Display: "\uE721",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAB:
    {
        Display: "\uE728",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAC:
    {
        /* @TODO Consider using a different icon. */
        Display: "\uF71C",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xB0:
    {
        Display: "\uEB9D",
        Modifier: undefined,
        Side: undefined
    },
    0xB1:
    {
        Display: "\uEB9E",
        Modifier: undefined,
        Side: undefined
    },
    0xB2:
    {
        Display: "\uE71A",
        Modifier: undefined,
        Side: undefined
    },
    0xB3:
    {
        Display: "\uE768",
        Modifier: undefined,
        Side: undefined
    },
    0xB4:
    {
        Display: "\uE715",
        Modifier: undefined,
        Side: undefined
    },
    0xB5:
    {
        Display: "\uEA69",
        Modifier: undefined,
        Side: undefined
    },
    0xB6:
    {
        Display: "\uEB3B",
        Modifier: undefined,
        Side: undefined
    },
    0xB7:
    {
        Display: "\uED35",
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

const IsUnicodeCharacter = (Input: string): boolean =>
{
    if (typeof Input !== "string" || Input.length > 1)
    {
        return false;
    }
    else
    {
        const CodePoint: number = Input.codePointAt(0) as number;
        return CodePoint >= 0xE700 && CodePoint <= 0xF800;
    }
};

export const Key = ({ Value }: PKey): ReactElement =>
{
    // const { Display, Modifier, Side } = Keys[Value];
    // const CornerDisplay: string | undefined = useMemo((): string | undefined =>
    // {
    //     if (Modifier !== undefined)
    //     {
    //         return Modifier;
    //     }
    //     else if (Side !== undefined && Side !== "Either")
    //     {
    //         return Side;
    //     }
    //     else
    //     {
    //         return undefined;
    //     }
    // }, [ Modifier, Side ]);

    const [ backgroundColor, color ] = UseThemeColors();

    const DisplayStyle: CSSProperties = useMemo((): CSSProperties =>
    {
        const IsFluentIcon: boolean = IsUnicodeCharacter(Value);
        const fontSize: string = Value.length > 1
            ? "2rem"
            : "1rem";

        const marginBottom: number = IsFluentIcon
            ? 0
            : 4;

        return {
            color,
            fontFamily: "Segoe Fluent Icons, Segoe UI",
            fontSize,
            marginBottom,
            textWrap: "nowrap"
        };
    }, [ color, Value ]);

    const maxWidth: string | undefined = Value.length === 1
        ? "2rem"
        : undefined;

    const RootStyle: CSSProperties = useMemo((): CSSProperties =>
    {
        return {
            alignItems: "center",
            backgroundColor,
            borderRadius: tokens.borderRadiusMedium,
            paddingLeft: tokens.spacingHorizontalXS,
            paddingRight: tokens.spacingHorizontalXS,
            display: "flex",
            height: "2rem",
            justifyContent: "center",
            maxHeight: "2rem",
            maxWidth,
            minWidth: "2rem"
        };
    }, [ backgroundColor, maxWidth ]);

    return (
        <div style={ RootStyle }>
            <span style={ DisplayStyle }>
                { Value }
            </span>
        </div>
    );
};
