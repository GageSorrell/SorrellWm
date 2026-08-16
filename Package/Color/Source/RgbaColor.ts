/**
 * An immutable, 8-bit RGB color with an alpha channel.
 *
 * @module @sorrell/color/RgbaColor
 *
 * @file      RgbaColor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BigDecimal, Function, Option, Predicate, Struct } from "effect";
import { LinearColor as ConstructLinearColor, type LinearColor as LinearColorRecord } from "./LinearColor.js";
import { RgbColor as ConstructRgbColor, type RgbColor as RgbColorRecord } from "./RgbColor.js";
import Convert from "color-convert";
import { Int } from "@sorrell/math";

export/**
       * The type identifier for this module.
       *
       * @category Constant
       * @since 2.0.0
       */
const TypeId = "~sorrell/color/RgbaColor" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * An RGB color, including alpha, whose channels are integers in the inclusive range
 * `{0..255}`.
 *
 * @category Color
 * @since 2.0.0
 */
export interface RgbaColor
{
    readonly [ TypeId ]: TypeId;

    readonly R: Int.Int;
    readonly G: Int.Int;
    readonly B: Int.Int;
    readonly A: Int.Int;
}

/**
 * Values accepted by an 8-bit color channel.
 *
 * @category Color
 * @since 2.0.0
 */
export type ChannelArgument =
    | number
    | bigint
    | BigDecimal.BigDecimal;

export/**
       * Whether a value is an `RgbaColor`.
       *
       * @category Guard
       * @since 2.0.0
       */
const IsRgbaColor: { (Value: unknown): Value is RgbaColor; } = Predicate.hasProperty(TypeId) as any;

const FullAlpha = 255;

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
       * Patch some channels of a given `RgbaColor`.
       *
       * @category Mutator
       * @since 2.0.0
       */
const Assign: {
    (That: Partial<RgbaColor>): (Self: RgbaColor) => RgbaColor;
    (Self: RgbaColor, That: Partial<RgbaColor>): RgbaColor;
} = Function.dual(2, Struct.assign);

export/** {@inheritDoc Assign} */
const Patch = Assign;

export/**
       * Construct an 8-bit RGBA color, truncating and clamping each channel.
       *
       * @category Constructor
       * @since 2.0.0
       */
const RgbaColor = (
    Red: ChannelArgument,
    Green: ChannelArgument,
    Blue: ChannelArgument,
    Alpha: ChannelArgument
): RgbaColor => ({
    [ TypeId ]: TypeId,

    A: ToChannel(Alpha),
    B: ToChannel(Blue),
    G: ToChannel(Green),
    R: ToChannel(Red)
});

export/**
       * Set the red channel.
       *
       * @category Mutator
       * @since 2.0.0
       */
const SetRed: {
    (Red: ChannelArgument): (Self: RgbaColor) => RgbaColor;
    (Self: RgbaColor, Red: ChannelArgument): RgbaColor;
} = Function.dual(2, (Self: RgbaColor, Red: ChannelArgument): RgbaColor =>
    RgbaColor(Red, Self.G, Self.B, Self.A)
);

export/**
       * Set the green channel.
       *
       * @category Mutator
       * @since 2.0.0
       */
const SetGreen: {
    (Green: ChannelArgument): (Self: RgbaColor) => RgbaColor;
    (Self: RgbaColor, Green: ChannelArgument): RgbaColor;
} = Function.dual(2, (Self: RgbaColor, Green: ChannelArgument): RgbaColor =>
    RgbaColor(Self.R, Green, Self.B, Self.A)
);

export/**
       * Set the blue channel.
       *
       * @category Mutator
       * @since 2.0.0
       */
const SetBlue: {
    (Blue: ChannelArgument): (Self: RgbaColor) => RgbaColor;
    (Self: RgbaColor, Blue: ChannelArgument): RgbaColor;
} = Function.dual(2, (Self: RgbaColor, Blue: ChannelArgument): RgbaColor =>
    RgbaColor(Self.R, Self.G, Blue, Self.A)
);

export/**
       * Set the alpha channel.
       *
       * @category Mutator
       * @since 2.0.0
       */
const SetAlpha: {
    (Alpha: ChannelArgument): (Self: RgbaColor) => RgbaColor;
    (Self: RgbaColor, Alpha: ChannelArgument): RgbaColor;
} = Function.dual(2, (Self: RgbaColor, Alpha: ChannelArgument): RgbaColor =>
    RgbaColor(Self.R, Self.G, Self.B, Alpha)
);

const ToRgb = (Self: RgbaColor): [ number, number, number ] => [ Self.R, Self.G, Self.B ] as const;

export/**
       * Make a color lighter by adding to its HSL lightness. Alpha is unaffected.
       *
       * @category Mutator
       * @since 2.0.0
       */
const Lighten: {
    (Amount: number): (Self: RgbaColor) => RgbaColor;
    (Self: RgbaColor, Amount: number): RgbaColor;
} = Function.dual(2, (Self: RgbaColor, Amount: number): RgbaColor =>
{
    const [ Hue, Saturation, Lightness ] = Convert.rgb.hsl.raw(ToRgb(Self));
    const NewLightness = Math.min(100, Math.max(0, Lightness + Amount * 100));
    const [ Red, Green, Blue ] = Convert.hsl.rgb.raw([
        Hue,
        Saturation,
        NewLightness
    ]);
    return RgbaColor(Math.round(Red), Math.round(Green), Math.round(Blue), Self.A);
});

export/**
       * Make a color darker by subtracting from its HSL lightness. Alpha is
       * unaffected.
       *
       * @category Mutator
       * @since 2.0.0
       */
const Darken: {
    (Amount: number): (Self: RgbaColor) => RgbaColor;
    (Self: RgbaColor, Amount: number): RgbaColor;
} = Function.dual(2, (Self: RgbaColor, Amount: number): RgbaColor =>
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
): RgbaColor => RgbaColor(
    Math.round(Value[0]),
    Math.round(Value[1]),
    Math.round(Value[2]),
    FullAlpha
);

export namespace From
{
    export/**
           * Parse three- or six-digit hexadecimal RGB. The result is fully opaque,
           * since this format carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hex = (Self: string): Option.Option<RgbaColor> =>
    {
        const Match = Self.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i);
        return Match
            ? Option.some(FromConverted(Convert.hex.rgb.raw(Match[1]!)))
            : Option.none();
    };

    export/**
           * Parse CSS-style `rgb(r, g, b)` integer channels. The result is fully
           * opaque, since this format carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Rgb = (Self: string): Option.Option<RgbaColor> =>
    {
        const Parts = ParseFunctional(Self, "rgb");
        return Parts && Parts.every((Part: number) =>
            Number.isInteger(Part) && Part >= 0 && Part <= 255)
            ? Option.some(RgbaColor(Parts[0], Parts[1], Parts[2], FullAlpha))
            : Option.none();
    };

    export/**
           * Parse CSS-style HSL. The result is fully opaque, since this format
           * carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hsl = (Self: string): Option.Option<RgbaColor> =>
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
           * Parse a CSS named color. The result is fully opaque, since this format
           * carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Keyword = (Self: string): Option.Option<RgbaColor> =>
    {
        const Keyword = Self.trim().toLowerCase() as
            Parameters<typeof Convert.keyword.rgb.raw>[0];
        const Value = Convert.keyword.rgb.raw(Keyword);
        return Value === undefined
            ? Option.none()
            : Option.some(FromConverted(Value));
    };

    export/**
           * Parse `hsv(h, s%, v%)`. The result is fully opaque, since this format
           * carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hsv = (Self: string): Option.Option<RgbaColor> =>
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
           * Parse `hwb(h, w%, b%)`. The result is fully opaque, since this format
           * carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hwb = (Self: string): Option.Option<RgbaColor> =>
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
           * Parse an ANSI-16 code, with or without an `ansi16(...)` wrapper. The
           * result is fully opaque, since this format carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Ansi16 = (Self: string): Option.Option<RgbaColor> =>
    {
        const Value = ParseAnsi(Self, "ansi16", 107);
        return Value === undefined
            ? Option.none()
            : Option.some(FromConverted(Convert.ansi16.rgb.raw(Value)));
    };

    export/**
           * Parse an ANSI-256 index, with or without an `ansi256(...)` wrapper. The
           * result is fully opaque, since this format carries no alpha component.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Ansi256 = (Self: string): Option.Option<RgbaColor> =>
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
           * @since 2.0.0
           */
    const Tuple = (Self: readonly [
        Red: ChannelArgument,
        Green: ChannelArgument,
        Blue: ChannelArgument,
        Alpha: ChannelArgument
    ]): RgbaColor => RgbaColor(Self[0], Self[1], Self[2], Self[3]);

    export/**
           * Construct a color from a `Record` of channels.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Record = (Self: {
        readonly R: ChannelArgument;
        readonly G: ChannelArgument;
        readonly B: ChannelArgument;
        readonly A: ChannelArgument;
    }): RgbaColor => RgbaColor(Self.R, Self.G, Self.B, Self.A);

    export/**
           * Convert an opaque `RgbColor`. `Alpha` defaults to `255` (fully opaque)
           * when not specified, since an `RgbColor` carries no alpha of its own.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const RgbColor = (
        Self: RgbColorRecord,
        Alpha: ChannelArgument = FullAlpha
    ): RgbaColor => RgbaColor(Self.R, Self.G, Self.B, Alpha);

    export/**
           * Convert a `LinearColor`, scaling its normalized `[0, 1]` channels,
           * including alpha, up to `{0..255}`.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const LinearColor = (Self: LinearColorRecord): RgbaColor => RgbaColor(
        BigDecimal.toNumberUnsafe(Self.R) * 255,
        BigDecimal.toNumberUnsafe(Self.G) * 255,
        BigDecimal.toNumberUnsafe(Self.B) * 255,
        BigDecimal.toNumberUnsafe(Self.A) * 255
    );
}

export namespace To
{
    export/**
           * Discard the alpha channel, yielding an opaque `RgbColor`.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const RgbColor = (Self: RgbaColor): RgbColorRecord =>
        ConstructRgbColor(Self.R, Self.G, Self.B);

    export/**
           * Convert to a `LinearColor`, scaling `{0..255}` channels, including
           * alpha, down to normalized `[0, 1]`.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const LinearColor = (Self: RgbaColor): LinearColorRecord =>
        ConstructLinearColor(Self.R / 255, Self.G / 255, Self.B / 255, Self.A / 255);
}

export namespace Format
{
    export/**
           * Format as lowercase six-digit hexadecimal RGB. Alpha is not
           * represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hex = (Self: RgbaColor): string =>
        `#${ Convert.rgb.hex.raw(ToRgb(Self)).toLowerCase() }`;

    export/**
           * Format as a CSS `rgb()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Rgb = (Self: RgbaColor): string =>
        `rgb(${ Self.R }, ${ Self.G }, ${ Self.B })`;

    export/**
           * Format as a CSS `hsl()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hsl = (Self: RgbaColor): string =>
    {
        const [ Hue, Saturation, Lightness ] = Convert.rgb.hsl.raw(ToRgb(Self));
        return `hsl(${ Math.round(Hue) }, ${ Math.round(Saturation) }%, ${ Math.round(Lightness) }%)`;
    };

    export/**
           * Format as the nearest CSS named color. Alpha is not represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Keyword = (Self: RgbaColor): string =>
        Convert.rgb.keyword.raw(ToRgb(Self));

    export/**
           * Format as a CSS `hsv()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hsv = (Self: RgbaColor): string =>
    {
        const [ Hue, Saturation, Value ] = Convert.rgb.hsv.raw(ToRgb(Self));
        return `hsv(${ Math.round(Hue) }, ${ Math.round(Saturation) }%, ${ Math.round(Value) }%)`;
    };

    export/**
           * Format as a CSS `hwb()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Hwb = (Self: RgbaColor): string =>
    {
        const [ Hue, Whiteness, Blackness ] = Convert.rgb.hwb.raw(ToRgb(Self));
        return `hwb(${ Math.round(Hue) }, ${ Math.round(Whiteness) }%, ${ Math.round(Blackness) }%)`;
    };

    export/**
           * Format as an `ansi16()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Ansi16 = (Self: RgbaColor): string =>
        `ansi16(${ Convert.rgb.ansi16.raw(ToRgb(Self)) })`;

    export/**
           * Format as an `ansi256()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Ansi256 = (Self: RgbaColor): string =>
        `ansi256(${ Convert.rgb.ansi256.raw(ToRgb(Self)) })`;

    export/**
           * Format as a `readonly` tuple of channels, including alpha.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Tuple = (Self: RgbaColor): readonly [
        Red: Int.Int,
        Green: Int.Int,
        Blue: Int.Int,
        Alpha: Int.Int
    ] => [ Self.R, Self.G, Self.B, Self.A ];

    export/**
           * Format as a `Record` of channels, including alpha.
           *
           * @category Constructor
           * @since 2.0.0
           */
    const Record = (Self: RgbaColor): {
        readonly R: Int.Int;
        readonly G: Int.Int;
        readonly B: Int.Int;
        readonly A: Int.Int;
    } => ({ A: Self.A, B: Self.B, G: Self.G, R: Self.R });
}
