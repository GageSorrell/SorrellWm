/**
 *
 *
 * @module @sorrell/effect-ink/Color
 *
 * @file      Color.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import type * as Record from "effect/Record";
import { Brand, Function, Predicate, String } from "effect";
import ChalkPkg from "chalk";
import type { TextProps } from "ink";

type Refinement<A> = (Value: unknown) => Value is A;

export const Undefined: unique symbol = Symbol.for("~sorrell/effect-ink/Theme/Color!Undefined");
export type Undefined = typeof Undefined;
export const IsUndefinedRaw = (Value: unknown): Value is Undefined =>
{
    return Value === Undefined;
};

/** The named colors provided by {@link https://www.npmjs.com/package/chalk | chalk}. */
export type ChalkRaw =
    | Undefined
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "blackBright"
    | "gray"
    | "grey"
    | "redBright"
    | "greenBright"
    | "yellowBright"
    | "blueBright"
    | "magentaBright"
    | "cyanBright"
    | "whiteBright";

export type Chalk = Brand.Branded<ChalkRaw, "Chalk">;

export const ChalkColors: ReadonlyArray<ChalkRaw> =
    [
        Undefined,
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "magenta",
        "cyan",
        "white",
        "blackBright",
        "gray",
        "grey",
        "redBright",
        "greenBright",
        "yellowBright",
        "blueBright",
        "magentaBright",
        "cyanBright",
        "whiteBright"
    ] as const;

export const IsChalkRaw = (Value: unknown): Value is ChalkRaw =>
{
    return ChalkColors.includes(Value as ChalkRaw);
};

type ChalkRecord = Record.ReadonlyRecord<ChalkRaw, Chalk>;

const ChalkConstructor: Brand.Constructor<Chalk> = Brand.nominal<Chalk>();

export const Chalk: Brand.Constructor<Chalk> & ChalkRecord = Object.assign(
    Brand.nominal<Chalk>(),
    {
        [ Undefined ]: Brand.nominal<Chalk>()(Undefined),

        black: ChalkConstructor("black"),
        blue: ChalkConstructor("blue"),
        cyan: ChalkConstructor("cyan"),
        gray: ChalkConstructor("gray"),
        green: ChalkConstructor("green"),
        grey: ChalkConstructor("grey"),
        magenta: ChalkConstructor("magenta"),
        red: ChalkConstructor("red"),
        white: ChalkConstructor("white"),
        yellow: ChalkConstructor("yellow"),

        blackBright: ChalkConstructor("blackBright"),
        blueBright: ChalkConstructor("blueBright"),
        cyanBright: ChalkConstructor("cyanBright"),
        greenBright: ChalkConstructor("greenBright"),
        magentaBright: ChalkConstructor("magentaBright"),
        redBright: ChalkConstructor("redBright"),
        whiteBright: ChalkConstructor("whiteBright"),
        yellowBright: ChalkConstructor("yellowBright")
    }
);

export const IsChalk: Refinement<Chalk> = IsChalkRaw as Refinement<Chalk>;

/**
 * A color defined as a hex `string`.
 *
 * @remarks
 * Due to performance issues *wrt* the transpiler and LSP, this type
 * does not impose constraints regarding the number or values of the characters
 * that follow the `#` prefix.
 */
export type HexRaw = `#${ string }`;

export type Hex = Brand.Branded<HexRaw, "Hex">;

export const IsHexRaw = (Value: unknown): Value is HexRaw =>
{
    return (
        Predicate.isString(Value) &&
        Value.length === 7 &&
        Value.startsWith("#") &&
        IsHexPart(Value.slice(1, 3)) &&
        IsHexPart(Value.slice(3, 5)) &&
        IsHexPart(Value.slice(5, 7))
    );
};

export const IsHex: Refinement<Hex> = IsHexRaw as Refinement<Hex>;

export const Hex: Brand.Constructor<Hex> = Brand.make<Hex>(IsHexRaw);

/** A color defined via the `rgb()` CSS format. */
export type RgbRaw = `rgb(${ number }, ${ number }, ${ number })`;

export type Rgb = Brand.Branded<RgbRaw, "Rgb">;

const HexPartToNumber = (In: HexPart): number =>  Number.parseInt(In, 16);

export const IsRgbRaw = (Value: unknown): Value is RgbRaw =>
{
    return (
        Predicate.isString(Value) &&
        Value.startsWith("rgb(") &&
        Value.endsWith(")") &&
        Value.includes(", ")
    );
};

export const IsRgb: Refinement<Rgb> = IsRgbRaw as Refinement<Rgb>;

export const Rgb: {
    (R: number, G: number, B: number): Rgb;

    (R: HexPart, G: HexPart, B: HexPart): Rgb;
} = (R: number | HexPart, G: number | HexPart, B: number | HexPart): Rgb =>
{
    const RawR: number = Predicate.isNumber(R)
        ? R
        : HexPartToNumber(R);

    const RawG: number = Predicate.isNumber(G)
        ? G
        : HexPartToNumber(G);

    const RawB: number = Predicate.isNumber(B)
        ? B
        : HexPartToNumber(B);

    const Raw: RgbRaw = `rgb(${ RawR }, ${ RawG }, ${ RawB })`;

    return Brand.nominal<Rgb>()(Raw);
};

type Ansi256Raw = number;

export type Ansi256 = Brand.Branded<Ansi256Raw, "Ansi256">;

export const IsAnsi256Raw: Refinement<Ansi256Raw> = Predicate.isNumber;

export const IsAnsi256: Refinement<Ansi256> = IsAnsi256Raw as Refinement<Ansi256>;

export const Ansi256: Brand.Constructor<Ansi256> = Brand.make<Ansi256>(IsAnsi256Raw);

export type HexChar =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f";

export const HexChar: ReadonlyArray<HexChar> =
    [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
    ] as const;

export type HexPart = `${ HexChar }${ HexChar }`;

/**
 * A color defined as a record of color components.
 *
 * @property {number | HexPart} R - The red component of this color.
 * @property {number | HexPart} G - The green component of this color.
 * @property {number | HexPart} B - The blue component of this color.
 */
export interface RgbRecordRaw
{
    readonly R: number | HexPart;
    readonly G: number | HexPart;
    readonly B: number | HexPart;
};

export type RgbRecord = Brand.Branded<RgbRecordRaw, "RgbRecord">;

export const IsRgbRecordRaw = (Value: unknown): Value is RgbRecord =>
{
    return (
        Predicate.isObject(Value) &&
        Predicate.hasProperty(Value, "R") &&
        Predicate.hasProperty(Value, "G") &&
        Predicate.hasProperty(Value, "B") &&
        (
            IsHexChar(Value.R) ||
            Predicate.isNumber(Value.R)
        ) &&
        (
            IsHexChar(Value.G) ||
            Predicate.isNumber(Value.G)
        ) &&
        (
            IsHexChar(Value.B) ||
            Predicate.isNumber(Value.B)
        )
    );
};

export const RgbRecord: Brand.Constructor<RgbRecord> = Brand.make<RgbRecord>(IsRgbRecordRaw);

export const IsRgbRecord: Refinement<RgbRecord> = IsRgbRecordRaw as Refinement<RgbRecord>;

export const IsHexPart = (Value: unknown): Value is HexPart =>
{
    return (
        (
            Predicate.isString(Value) &&
            Value.length === 2 &&
            IsHexChar(Value[0]) &&
            IsHexChar(Value[1])
        )
    );
};

export const IsHexChar = (Value: unknown): Value is HexChar =>
{
    return HexChar.includes(Value as HexChar);
};

export type InkRaw = NonNullable<TextProps["color"]>;

const RgbRecordPartToHexPart = (In: number | HexPart): HexPart =>
{
    return Predicate.isNumber(In)
        ? FormatHexChannel(In)
        : In;
};

/**
 * The types accepted by the `color` prop of {@link https://www.npmjs.com/package/ink | ink} components.
 *
 * @remarks
 * {@link Color | All color types} can be used by the components provided by this package.
 * It is unlikely that dependents should have a use for this type.
 */
export type Ink = Brand.Branded<InkRaw, "InkColor">;

export const Ink: {
    (Value: HexRaw): Ink;

    (Value: RgbRaw): Ink;

    (Value: Ansi256Raw): Ink;

    (Value: RgbRecordRaw): Ink;

    (Value: ChalkRaw): Ink;

    (Value: Hex): Ink;

    (Value: Rgb): Ink;

    (Value: Ansi256): Ink;

    (Value: RgbRecord): Ink;

    (Value: Chalk): Ink;

    (Value: Any): Ink;
} = (Value: Any): Ink =>
{
    const InkRaw: InkRaw | undefined = (IsHexRaw(Value) || (IsChalkRaw(Value) && !Predicate.isSymbol(Value)))
        ? Value
        : (IsAnsi256Raw(Value) || IsRgbRaw(Value))
            ? RawToHex(Value)
            : IsRgbRecordRaw(Value)
                ? ((): InkRaw =>
                {
                    const R: HexPart = RgbRecordPartToHexPart(Value.R);
                    const G: HexPart = RgbRecordPartToHexPart(Value.G);
                    const B: HexPart = RgbRecordPartToHexPart(Value.B);

                    // @ts-expect-error Union complexity.
                    return `#${ R }${ G }${ B }`;
                })()
                : undefined;

    return InkRaw !== undefined
        ? Brand.nominal<Ink>()(InkRaw)
        : Value as Ink;
};

// export const ToInk = (In: Color): Ink =>
// {
//     if (IsChalk(In) || IsHex())
//     {

//     }
//     else if ()
//     const InCulori: Culori.Color = IsRgbRecord(In)
//         ? {

//         }
//         :

//     return Brand.nominal<Ink>()(formatHex(In));
// };

const Ansi16Colors: ReadonlyArray<readonly [ number, number, number ]> =
    [
        [ 0, 0, 0 ],
        [ 128, 0, 0 ],
        [ 0, 128, 0 ],
        [ 128, 128, 0 ],
        [ 0, 0, 128 ],
        [ 128, 0, 128 ],
        [ 0, 128, 128 ],
        [ 192, 192, 192 ],
        [ 128, 128, 128 ],
        [ 255, 0, 0 ],
        [ 0, 255, 0 ],
        [ 255, 255, 0 ],
        [ 0, 0, 255 ],
        [ 255, 0, 255 ],
        [ 0, 255, 255 ],
        [ 255, 255, 255 ]
    ];

const RgbColorPattern: RegExp = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const Ansi256ColorPattern: RegExp = /^ansi256\(\s*(\d{1,3})\s*\)$/;

function RawToHex(Value: RgbRaw | Ansi256Raw): HexRaw
{
    const RgbMatch: RegExpExecArray | null = RgbColorPattern.exec(`ansi256(${ Value })`);

    if (RgbMatch !== null)
    {
        const Red: number = Number(RgbMatch[1]);
        const Green: number = Number(RgbMatch[2]);
        const Blue: number = Number(RgbMatch[3]);

        AssertRgbChannel(Red, "red");
        AssertRgbChannel(Green, "green");
        AssertRgbChannel(Blue, "blue");

        return FormatRgbToHex(Red, Green, Blue);
    }

    const Ansi256Match: RegExpExecArray | null = Ansi256ColorPattern.exec(`ansi256(${ Value })`);

    if (Ansi256Match !== null)
    {
        const Index: number = Number(Ansi256Match[1]);

        AssertAnsi256Index(Index);

        const [ Red, Green, Blue ] = ConvertAnsi256ToRgb(Index);

        return FormatRgbToHex(Red, Green, Blue);
    }

    throw new Error(`Unsupported color string: ${Value}`);
}

function ConvertAnsi256ToRgb(Index: number): readonly [number, number, number]
{
    if (Index < 16)
    {
        return Ansi16Colors[Index];
    }

    if (Index <= 231)
    {
        const CubeIndex: number = Index - 16;

        const RedIndex: number = Math.floor(CubeIndex / 36);
        const GreenIndex: number = Math.floor((CubeIndex % 36) / 6);
        const BlueIndex: number = CubeIndex % 6;

        return [
            ConvertAnsiCubeChannelToRgbChannel(RedIndex),
            ConvertAnsiCubeChannelToRgbChannel(GreenIndex),
            ConvertAnsiCubeChannelToRgbChannel(BlueIndex)
        ];
    }

    const Gray: number = 8 + ((Index - 232) * 10);

    return [ Gray, Gray, Gray ];
}

function ConvertAnsiCubeChannelToRgbChannel(Value: number): number
{
    if (Value === 0)
    {
        return 0;
    }

    return 55 + (Value * 40);
}

function FormatRgbToHex(Red: number, Green: number, Blue: number): HexRaw
{
    // @ts-expect-error Union complexity.
    return `#${ FormatHexChannel(Red) }${ FormatHexChannel(Green) }${ FormatHexChannel(Blue) }`;
}

function FormatHexChannel(Value: number): HexPart
{
    return Value.toString(16).padStart(2, "0") as HexPart;
}

function AssertRgbChannel(Value: number, ChannelName: string): void
{
    if (!Number.isInteger(Value) || Value < 0 || Value > 255)
    {
        throw new Error(`Invalid ${ ChannelName } channel: ${ Value }`);
    }
}

function AssertAnsi256Index(Value: number): void
{
    if (!Number.isInteger(Value) || Value < 0 || Value > 255)
    {
        throw new Error(`Invalid ANSI 256 color index: ${Value}`);
    }
}

/** All colors provided by this module. */
export type Raw =
    | HexRaw
    | RgbRaw
    | RgbRecordRaw
    | Ansi256Raw
    | ChalkRaw;

export type Color =
    | Ink
    | Hex
    | Rgb
    | RgbRecord
    | Ansi256
    | Chalk;

export type Any =
    | Raw
    | Color;

export const Apply: {
    (Arg: Color, Self: string): string;

    (Arg: Color): ChalkPkg.ChalkFunction;
} = Function.dual(2, (Self: string, Arg: Color): string =>
{
    const ChalkFunction: ChalkPkg.ChalkFunction = ((): ChalkPkg.ChalkFunction =>
    {
        if (IsUndefinedRaw(Arg))
        {
            return Function.identity;
        }
        else if (IsChalk(Arg))
        {
            return ChalkPkg[Arg as Exclude<ChalkRaw, Undefined>];
        }
        else if (IsHex(Arg))
        {
            return ChalkPkg.hex(Arg);
        }
        else if (IsRgb(Arg))
        {
            return ChalkPkg.hex(RawToHex(Arg as RgbRaw));
        }
        else if (IsAnsi256(Arg))
        {
            return ChalkPkg.ansi256(Arg);
        }
        else
        {
            const Out: HexRaw = Ink(Arg) as HexRaw;
            return ChalkPkg.hex(Out);
        }
    })();

    return ChalkFunction(Self);
});

export const ApplyBackground: {
    (Arg: Color, Self: React.ReactNode): string;

    (Arg: Color): ChalkPkg.ChalkFunction;
} = Function.dual(2, (Arg: Color, Self: React.ReactNode): string =>
{
    const ChalkFunction: ChalkPkg.ChalkFunction = ((): ChalkPkg.ChalkFunction =>
    {
        if (IsUndefinedRaw(Arg))
        {
            return Function.identity;
        }
        else if (IsChalk(Arg))
        {
            const BgArg: string = "bg" + String.capitalize(Arg);
            return ChalkPkg[BgArg as keyof ChalkPkg.Chalk] as ChalkPkg.ChalkFunction;
        }
        else if (IsHex(Arg))
        {
            return ChalkPkg.bgHex(Arg);
        }
        else if (IsRgb(Arg))
        {
            return ChalkPkg.bgHex(RawToHex(Arg as RgbRaw));
        }
        else if (IsAnsi256(Arg))
        {
            return ChalkPkg.bgAnsi256(Arg);
        }
        else
        {
            const Out: HexRaw = Ink(Arg) as HexRaw;
            return ChalkPkg.bgHex(Out);
        }
    })();

    return ChalkFunction(Self);
});

const GetLinearColorChannel = (Channel: number): number =>
{
    const ScaledChannel: number = Channel / 255;

    return ScaledChannel <= 0.03928
        ? ScaledChannel / 12.92
        : ((ScaledChannel + 0.055) / 1.055) ** 2.4;
};

const GetRelativeLuminance = (Color: Hex): number =>
{
    return 0.2126 * GetLinearColorChannel(HexPartToNumber(Color.slice(1, 3) as HexPart))
        + 0.7152 * GetLinearColorChannel(HexPartToNumber(Color.slice(3, 5) as HexPart))
        + 0.0722 * GetLinearColorChannel(HexPartToNumber(Color.slice(5, 7) as HexPart));
};

const GetContrastRatio = (
    FirstLuminance: number,
    SecondLuminance: number
): number =>
{
    const LighterLuminance: number = Math.max(FirstLuminance, SecondLuminance);
    const DarkerLuminance: number = Math.min(FirstLuminance, SecondLuminance);

    return (LighterLuminance + 0.05) / (DarkerLuminance + 0.05);
};

interface TerminalColorQueryOptions
{
    readonly TimeoutMilliseconds?: number;
}

/* eslint-disable-next-line @typescript-eslint/typedef */
const ChalkColorNameToPaletteIndex =
{
    /* eslint-disable sort-keys */
    black: 0,
    red: 1,
    green: 2,
    yellow: 3,
    blue: 4,
    magenta: 5,
    cyan: 6,
    white: 7,

    blackBright: 8,
    gray: 8,
    grey: 8,
    redBright: 9,
    greenBright: 10,
    yellowBright: 11,
    blueBright: 12,
    magentaBright: 13,
    cyanBright: 14,
    whiteBright: 15,

    bgBlack: 0,
    bgRed: 1,
    bgGreen: 2,
    bgYellow: 3,
    bgBlue: 4,
    bgMagenta: 5,
    bgCyan: 6,
    bgWhite: 7,

    bgBlackBright: 8,
    bgGray: 8,
    bgGrey: 8,
    bgRedBright: 9,
    bgGreenBright: 10,
    bgYellowBright: 11,
    bgBlueBright: 12,
    bgMagentaBright: 13,
    bgCyanBright: 14,
    bgWhiteBright: 15
    /* eslint-enable sort-keys */
} as const satisfies Record<string, number>;

const GetOsc4QuerySequence = (PaletteIndex: number): string =>
{
    return `\x1b]4;${PaletteIndex};?\x1b\\`;
};

/* eslint-disable-next-line @typescript-eslint/typedef */
const TerminalColorResponsePattern =
    /* eslint-disable-next-line no-control-regex */
    /\x1b\]4;(-?\d+);rgb:([0-9a-fA-F]{1,4})\/([0-9a-fA-F]{1,4})\/([0-9a-fA-F]{1,4})(?:\x07|\x1b\\)/;

const ConvertColorComponentToByte = (ColorComponent: string): number =>
{
    const MaximumValue: number = 16 ** ColorComponent.length - 1;
    const Value: number = Number.parseInt(ColorComponent, 16);

    return Math.round((Value / MaximumValue) * 255);
};

const ConvertByteToHexComponent = (Value: number): string =>
{
    return Value.toString(16).padStart(2, "0");
};

const ParseTerminalColorResponse = (
    Response: string,
    ExpectedPaletteIndex: number
): string | undefined =>
{
    const Match: RegExpMatchArray | null = Response.match(TerminalColorResponsePattern);

    if (Match === null)
    {
        return undefined;
    }

    const PaletteIndex: number = Number(Match[1]);

    if (PaletteIndex !== ExpectedPaletteIndex)
    {
        return undefined;
    }

    const Red: number = ConvertColorComponentToByte(Match[2]!);
    const Green: number = ConvertColorComponentToByte(Match[3]!);
    const Blue: number = ConvertColorComponentToByte(Match[4]!);

    /* eslint-disable-next-line @stylistic/max-len */
    return `#${ ConvertByteToHexComponent(Red) }${ ConvertByteToHexComponent(Green) }${ ConvertByteToHexComponent(Blue) }`;
};

export const GetTerminalChalkColorHex = async (
    ColorName: string,
    Options: TerminalColorQueryOptions = { }
): Promise<Hex> =>
{
    if (!IsChalkRaw(ColorName))
    {
        throw new Error(`Expected a Chalk color name, but received: ${ColorName}`);
    }

    if (!process.stdin.isTTY || !process.stdout.isTTY)
    {
        throw new Error("Cannot query terminal color because stdin or stdout is not a TTY.");
    }

    if (typeof process.stdin.setRawMode !== "function")
    {
        throw new Error("Cannot query terminal color because stdin does not support raw mode.");
    }

    const TimeoutMilliseconds: number = Options.TimeoutMilliseconds ?? 150;
    /* eslint-disable-next-line @typescript-eslint/typedef */
    const PaletteIndex = ChalkColorNameToPaletteIndex[ColorName];
    const QuerySequence: string = GetOsc4QuerySequence(PaletteIndex);

    const WasRaw: boolean = process.stdin.isRaw;
    let Response: string = "";

    /* eslint-disable-next-line @typescript-eslint/typedef */
    return await new Promise<Hex>((Resolve, Reject) =>
    {
        const Cleanup = (): void =>
        {
            clearTimeout(Timeout);
            process.stdin.off("data", OnData);

            if (!WasRaw)
            {
                process.stdin.setRawMode(false);
            }
        };

        const Fail = (ErrorValue: Error): void =>
        {
            Cleanup();
            Reject(ErrorValue);
        };

        const Succeed = (HexColor: string): void =>
        {
            Cleanup();
            Resolve(Hex(HexColor as HexRaw));
        };

        const OnData = (Data: Buffer): void =>
        {
            Response += Data.toString("utf8");

            const HexColor: string | undefined = ParseTerminalColorResponse(Response, PaletteIndex);

            if (HexColor !== undefined)
            {
                Succeed(HexColor);
            }
        };

        const Timeout: NodeJS.Timeout = setTimeout(() =>
        {
            Fail(new Error(`Timed out while querying terminal color: ${ ColorName }`));
        }, TimeoutMilliseconds);

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on("data", OnData);

        process.stdout.write(QuerySequence);
    });
};

// export const GetTerminalColor = (In: Chalk): Hex =>
// {
//     return GetTerminalChalkColorHex(ToHex(In));
// };

export const ToHex = (Value: Color): Hex =>
{
    if (IsHex(Value))
    {
        return Value;
    }
    else if (IsAnsi256(Value) || IsRgb(Value))
    {
        return Hex(RawToHex(Value as Ansi256Raw | RgbRaw));
    }
    else if (IsChalk(Value))
    {
        // @TODO
        return Hex("#FF0000");
        // return GetTerminalColor(Value);
    }
    else
    {
        const ValueCast: RgbRecord = Value as RgbRecord;

        const R: HexPart = RgbRecordPartToHexPart(ValueCast.R);
        const G: HexPart = RgbRecordPartToHexPart(ValueCast.G);
        const B: HexPart = RgbRecordPartToHexPart(ValueCast.B);

        // @ts-expect-error Union complexity.
        return Hex(`#${ R }${ G }${ B }`);
    }
};

export const GetForegroundFromBackground = (BackgroundColor: Color): Chalk =>
{
    const BackgroundHex: Hex = ToHex(BackgroundColor);
    const BackgroundLum: number = GetRelativeLuminance(BackgroundHex);

    const WhiteTextContrastRatio: number = GetContrastRatio(1, BackgroundLum);
    const BlackTextContrastRatio: number = GetContrastRatio(0, BackgroundLum);

    return WhiteTextContrastRatio > BlackTextContrastRatio
        ? Chalk.whiteBright
        : Chalk.black;
};
