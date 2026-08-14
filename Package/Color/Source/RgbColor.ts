/**
 * An immutable, 8-bit RGB color.
 *
 * @module @sorrell/color/RgbColor
 *
 * @file      RgbColor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BigDecimal, Function, Option, Predicate, Struct } from "effect";
import Convert from "color-convert";
import { Int } from "@sorrell/math";

export/**
       * The type identifier for this module.
       *
       * @category Constant
       * @since 1.0.0
       */
const TypeId = "~sorrell/color/RgbColor" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * An RGB color whose channels are integers in the inclusive range `{0..255}`.
 *
 * @category Color
 * @since 1.0.0
 */
export interface RgbColor
{
    readonly [ TypeId ]: TypeId;

    readonly R: Int.Int;
    readonly G: Int.Int;
    readonly B: Int.Int;
}

/**
 * Values accepted by an 8-bit color channel.
 *
 * @category Color
 * @since 1.0.0
 */
export type ChannelArgument =
    | number
    | bigint
    | BigDecimal.BigDecimal;

export/**
       * Whether a value is an `RgbColor`.
       *
       * @category Guard
       * @since 1.0.0
       */
const IsRgbColor: { (Value: unknown): Value is RgbColor; } = Predicate.hasProperty(TypeId) as any;

const ToChannel = (Self: ChannelArgument): Int.Int =>
{
    let Value: number;

    if (typeof Self === "bigint")
    {
        if (Self <= 0n)
        {
            return Int.Zero;
        }
        if (Self >= 255n)
        {
            return Int.IntUnsafe(255);
        }
        Value = Number(Self);
    }
    else if (BigDecimal.isBigDecimal(Self))
    {
        Value = BigDecimal.toNumberUnsafe(Self);
    }
    else
    {
        Value = Self;
    }

    if (Number.isNaN(Value))
    {
        throw new RangeError("A color channel cannot be NaN.");
    }

    return Int.IntUnsafe(Math.trunc(Math.min(255, Math.max(0, Value))));
};

export/**
       * Patch some channels of a given `RgbColor`.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Assign: {
    (That: Partial<RgbColor>): (Self: RgbColor) => RgbColor;
    (Self: RgbColor, That: Partial<RgbColor>): RgbColor;
} = Function.dual(2, Struct.assign);

export/** {@inheritDoc Assign} */
const Patch = Assign;

export/**
       * Construct an 8-bit RGB color, truncating and clamping each channel.
       *
       * @category Constructor
       * @since 1.0.0
       */
const RgbColor = (
    Red: ChannelArgument,
    Green: ChannelArgument,
    Blue: ChannelArgument
): RgbColor => ({
    [ TypeId ]: TypeId,

    B: ToChannel(Blue),
    G: ToChannel(Green),
    R: ToChannel(Red)
});

export/**
       * Set the red channel.
       *
       * @category Mutator
       * @since 1.0.0
       */
const SetRed: {
    (Red: ChannelArgument): (Self: RgbColor) => RgbColor;
    (Self: RgbColor, Red: ChannelArgument): RgbColor;
} = Function.dual(2, (Self: RgbColor, Red: ChannelArgument): RgbColor =>
    RgbColor(Red, Self.G, Self.B)
);

export/**
       * Set the green channel.
       *
       * @category Mutator
       * @since 1.0.0
       */
const SetGreen: {
    (Green: ChannelArgument): (Self: RgbColor) => RgbColor;
    (Self: RgbColor, Green: ChannelArgument): RgbColor;
} = Function.dual(2, (Self: RgbColor, Green: ChannelArgument): RgbColor =>
    RgbColor(Self.R, Green, Self.B)
);

export/**
       * Set the blue channel.
       *
       * @category Mutator
       * @since 1.0.0
       */
const SetBlue: {
    (Blue: ChannelArgument): (Self: RgbColor) => RgbColor;
    (Self: RgbColor, Blue: ChannelArgument): RgbColor;
} = Function.dual(2, (Self: RgbColor, Blue: ChannelArgument): RgbColor =>
    RgbColor(Self.R, Self.G, Blue)
);

const ToRgb = (Self: RgbColor): [ number, number, number ] => [ Self.R, Self.G, Self.B ] as const;

export/**
       * Make a color lighter by adding to its HSL lightness.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Lighten: {
    (Amount: number): (Self: RgbColor) => RgbColor;
    (Self: RgbColor, Amount: number): RgbColor;
} = Function.dual(2, (Self: RgbColor, Amount: number): RgbColor =>
{
    const [ Hue, Saturation, Lightness ] = Convert.rgb.hsl.raw(ToRgb(Self));
    const NewLightness = Math.min(100, Math.max(0, Lightness + Amount * 100));
    const [ Red, Green, Blue ] = Convert.hsl.rgb.raw([
        Hue,
        Saturation,
        NewLightness
    ]);
    return RgbColor(Math.round(Red), Math.round(Green), Math.round(Blue));
});

export/**
       * Make a color darker by subtracting from its HSL lightness.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Darken: {
    (Amount: number): (Self: RgbColor) => RgbColor;
    (Self: RgbColor, Amount: number): RgbColor;
} = Function.dual(2, (Self: RgbColor, Amount: number): RgbColor =>
    Lighten(Self, -Amount)
);

const ParseFunctional = (
    Self: string,
    Name: string
): readonly [ number, number, number ] | undefined =>
{
    const Match = Self.trim().match(
        /* eslint-disable-next-line @stylistic/max-len */
        new RegExp(`^${ Name }\\(\\s*([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))(?:deg)?\\s*,?\\s*([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))%?\\s*,?\\s*([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))%?\\s*\\)$`, "i")
    );
    return Match
        ? [ Number(Match[1]), Number(Match[2]), Number(Match[3]) ]
        : undefined;
};

const ParseAnsi = (Self: string, Name: string, Max: number): number | undefined =>
{
    const Match = Self.trim().match(
        new RegExp(`^(?:${ Name }\\(\\s*)?(\\d+)(?:\\s*\\))?$`, "i")
    );
    if (!Match)
    {
        return undefined;
    }
    const Value = Number(Match[1]);
    return Number.isInteger(Value) && Value >= 0 && Value <= Max
        ? Value
        : undefined;
};

const FromConverted = (
    Value: readonly [ number, number, number ]
): RgbColor => RgbColor(Math.round(Value[0]), Math.round(Value[1]), Math.round(Value[2]));

export namespace From
{
    export/**
           * Parse three- or six-digit hexadecimal RGB.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hex = (Self: string): Option.Option<RgbColor> =>
    {
        const Match = Self.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i);
        return Match
            ? Option.some(FromConverted(Convert.hex.rgb.raw(Match[1]!)))
            : Option.none();
    };

    export/**
           * Parse CSS-style `rgb(r, g, b)` integer channels.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Rgb = (Self: string): Option.Option<RgbColor> =>
    {
        const Parts = ParseFunctional(Self, "rgb");
        return Parts && Parts.every((Part: number) =>
            Number.isInteger(Part) && Part >= 0 && Part <= 255)
            ? Option.some(RgbColor(Parts[0], Parts[1], Parts[2]))
            : Option.none();
    };

    export/**
           * Parse CSS-style HSL.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsl = (Self: string): Option.Option<RgbColor> =>
    {
        const Parts = ParseFunctional(Self, "hsl");
        return Parts && Parts[1] >= 0 && Parts[1] <= 100
            && Parts[2] >= 0 && Parts[2] <= 100
            ? Option.some(FromConverted(Convert.hsl.rgb.raw([
                ((Parts[0] % 360) + 360) % 360,
                Parts[1],
                Parts[2]
            ])))
            : Option.none();
    };

    export/**
           * Parse a CSS named color.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Keyword = (Self: string): Option.Option<RgbColor> =>
    {
        const Keyword = Self.trim().toLowerCase() as
            Parameters<typeof Convert.keyword.rgb.raw>[0];
        const Value = Convert.keyword.rgb.raw(Keyword);
        return Value === undefined
            ? Option.none()
            : Option.some(FromConverted(Value));
    };

    export/**
           * Parse `hsv(h, s%, v%)`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsv = (Self: string): Option.Option<RgbColor> =>
    {
        const Parts = ParseFunctional(Self, "hsv");
        return Parts && Parts[1] >= 0 && Parts[1] <= 100
            && Parts[2] >= 0 && Parts[2] <= 100
            ? Option.some(FromConverted(Convert.hsv.rgb.raw([
                ((Parts[0] % 360) + 360) % 360,
                Parts[1],
                Parts[2]
            ])))
            : Option.none();
    };

    export/**
           * Parse `hwb(h, w%, b%)`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hwb = (Self: string): Option.Option<RgbColor> =>
    {
        const Parts = ParseFunctional(Self, "hwb");
        return Parts && Parts[1] >= 0 && Parts[1] <= 100
            && Parts[2] >= 0 && Parts[2] <= 100
            ? Option.some(FromConverted(Convert.hwb.rgb.raw([
                ((Parts[0] % 360) + 360) % 360,
                Parts[1],
                Parts[2]
            ])))
            : Option.none();
    };

    export/**
           * Parse an ANSI-16 code, with or without an `ansi16(...)` wrapper.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi16 = (Self: string): Option.Option<RgbColor> =>
    {
        const Value = ParseAnsi(Self, "ansi16", 107);
        return Value === undefined
            ? Option.none()
            : Option.some(FromConverted(Convert.ansi16.rgb.raw(Value)));
    };

    export/**
           * Parse an ANSI-256 index, with or without an `ansi256(...)` wrapper.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi256 = (Self: string): Option.Option<RgbColor> =>
    {
        const Value = ParseAnsi(Self, "ansi256", 255);
        return Value === undefined
            ? Option.none()
            : Option.some(FromConverted(Convert.ansi256.rgb.raw(Value)));
    };

    export/**
           * Construct a color from a `readonly` tuple of channels.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Tuple = (Self: readonly [
        Red: ChannelArgument,
        Green: ChannelArgument,
        Blue: ChannelArgument
    ]): RgbColor => RgbColor(Self[0], Self[1], Self[2]);

    export/**
           * Construct a color from a `Record` of channels.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Record = (Self: {
        readonly R: ChannelArgument;
        readonly G: ChannelArgument;
        readonly B: ChannelArgument;
    }): RgbColor => RgbColor(Self.R, Self.G, Self.B);
}

export namespace Format
{
    export/**
           * Format as lowercase six-digit hexadecimal RGB.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hex = (Self: RgbColor): string =>
        `#${ Convert.rgb.hex.raw(ToRgb(Self)).toLowerCase() }`;

    export/**
           * Format as a CSS `rgb()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Rgb = (Self: RgbColor): string =>
        `rgb(${ Self.R }, ${ Self.G }, ${ Self.B })`;

    export/**
           * Format as a CSS `hsl()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsl = (Self: RgbColor): string =>
    {
        const [ Hue, Saturation, Lightness ] = Convert.rgb.hsl.raw(ToRgb(Self));
        return `hsl(${ Math.round(Hue) }, ${ Math.round(Saturation) }%, ${ Math.round(Lightness) }%)`;
    };

    export/**
           * Format as the nearest CSS named color.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Keyword = (Self: RgbColor): string =>
        Convert.rgb.keyword.raw(ToRgb(Self));

    export/**
           * Format as a CSS `hsv()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsv = (Self: RgbColor): string =>
    {
        const [ Hue, Saturation, Value ] = Convert.rgb.hsv.raw(ToRgb(Self));
        return `hsv(${ Math.round(Hue) }, ${ Math.round(Saturation) }%, ${ Math.round(Value) }%)`;
    };

    export/**
           * Format as a CSS `hwb()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hwb = (Self: RgbColor): string =>
    {
        const [ Hue, Whiteness, Blackness ] = Convert.rgb.hwb.raw(ToRgb(Self));
        return `hwb(${ Math.round(Hue) }, ${ Math.round(Whiteness) }%, ${ Math.round(Blackness) }%)`;
    };

    export/**
           * Format as an `ansi16()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi16 = (Self: RgbColor): string =>
        `ansi16(${ Convert.rgb.ansi16.raw(ToRgb(Self)) })`;

    export/**
           * Format as an `ansi256()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi256 = (Self: RgbColor): string =>
        `ansi256(${ Convert.rgb.ansi256.raw(ToRgb(Self)) })`;

    export/**
           * Format as a `readonly` tuple of channels.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Tuple = (Self: RgbColor): readonly [
        Red: Int.Int,
        Green: Int.Int,
        Blue: Int.Int
    ] => [ Self.R, Self.G, Self.B ];

    export/**
           * Format as a `Record` of channels.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Record = (Self: RgbColor): {
        readonly R: Int.Int;
        readonly G: Int.Int;
        readonly B: Int.Int;
    } => ({ B: Self.B, G: Self.G, R: Self.R });
}
