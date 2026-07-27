/**
 * An immutable, 8-bit RGB color.
 *
 * @module @sorrell/color/Color
 *
 * @file      Color.ts
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
       * @category Identifier
       * @since 1.0.0
       */
const TypeId = "~sorrell/color/Color" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/** An RGB color whose channels are integers in the inclusive range 0–255. */
export interface Color
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
       * Whether a value is a `Color`.
       *
       * @category Guard
       * @since 1.0.0
       */
const IsColor: { (Value: unknown): Value is Color; } = Predicate.hasProperty(TypeId) as any;

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
       * Patch some channels of a given `Color`.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Assign: {
    (That: Partial<Color>): (Self: Color) => Color;
    (Self: Color, That: Partial<Color>): Color;
} = Function.dual(2, Struct.assign);

export/** {@inheritDoc Assign} */
const Patch = Assign;

export/**
       * Construct an 8-bit RGB color, truncating and clamping each channel.
       *
       * @category Constructor
       * @since 1.0.0
       */
const Color = (
    Red: ChannelArgument,
    Green: ChannelArgument,
    Blue: ChannelArgument
): Color => ({
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
    (Red: ChannelArgument): (Self: Color) => Color;
    (Self: Color, Red: ChannelArgument): Color;
} = Function.dual(2, (Self: Color, Red: ChannelArgument): Color =>
    Color(Red, Self.G, Self.B)
);

export/**
       * Set the green channel.
       *
       * @category Mutator
       * @since 1.0.0
       */
const SetGreen: {
    (Green: ChannelArgument): (Self: Color) => Color;
    (Self: Color, Green: ChannelArgument): Color;
} = Function.dual(2, (Self: Color, Green: ChannelArgument): Color =>
    Color(Self.R, Green, Self.B)
);

export/**
       * Set the blue channel.
       *
       * @category Mutator
       * @since 1.0.0
       */
const SetBlue: {
    (Blue: ChannelArgument): (Self: Color) => Color;
    (Self: Color, Blue: ChannelArgument): Color;
} = Function.dual(2, (Self: Color, Blue: ChannelArgument): Color =>
    Color(Self.R, Self.G, Blue)
);

const ToRgb = (Self: Color): [ number, number, number ] => [ Self.R, Self.G, Self.B ] as const;

export/**
       * Make a color lighter by adding to its HSL lightness.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Lighten: {
    (Amount: number): (Self: Color) => Color;
    (Self: Color, Amount: number): Color;
} = Function.dual(2, (Self: Color, Amount: number): Color =>
{
    const [ Hue, Saturation, Lightness ] = Convert.rgb.hsl.raw(ToRgb(Self));
    const NewLightness = Math.min(100, Math.max(0, Lightness + Amount * 100));
    const [ Red, Green, Blue ] = Convert.hsl.rgb.raw([
        Hue,
        Saturation,
        NewLightness
    ]);
    return Color(Math.round(Red), Math.round(Green), Math.round(Blue));
});

export/**
       * Make a color darker by subtracting from its HSL lightness.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Darken: {
    (Amount: number): (Self: Color) => Color;
    (Self: Color, Amount: number): Color;
} = Function.dual(2, (Self: Color, Amount: number): Color =>
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
): Color => Color(Math.round(Value[0]), Math.round(Value[1]), Math.round(Value[2]));

export namespace From
{
    export/**
           * Parse three- or six-digit hexadecimal RGB.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hex = (Self: string): Option.Option<Color> =>
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
    const Rgb = (Self: string): Option.Option<Color> =>
    {
        const Parts = ParseFunctional(Self, "rgb");
        return Parts && Parts.every((Part: number) =>
            Number.isInteger(Part) && Part >= 0 && Part <= 255)
            ? Option.some(Color(Parts[0], Parts[1], Parts[2]))
            : Option.none();
    };

    export/**
           * Parse CSS-style HSL.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsl = (Self: string): Option.Option<Color> =>
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
    const Keyword = (Self: string): Option.Option<Color> =>
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
    const Hsv = (Self: string): Option.Option<Color> =>
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
    const Hwb = (Self: string): Option.Option<Color> =>
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
    const Ansi16 = (Self: string): Option.Option<Color> =>
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
    const Ansi256 = (Self: string): Option.Option<Color> =>
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
    ]): Color => Color(Self[0], Self[1], Self[2]);

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
    }): Color => Color(Self.R, Self.G, Self.B);
}

export namespace Format
{
    export/**
           * Format as lowercase six-digit hexadecimal RGB.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hex = (Self: Color): string =>
        `#${ Convert.rgb.hex.raw(ToRgb(Self)).toLowerCase() }`;

    export/**
           * Format as a CSS `rgb()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Rgb = (Self: Color): string =>
        `rgb(${ Self.R }, ${ Self.G }, ${ Self.B })`;

    export/**
           * Format as a CSS `hsl()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsl = (Self: Color): string =>
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
    const Keyword = (Self: Color): string =>
        Convert.rgb.keyword.raw(ToRgb(Self));

    export/**
           * Format as a CSS `hsv()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsv = (Self: Color): string =>
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
    const Hwb = (Self: Color): string =>
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
    const Ansi16 = (Self: Color): string =>
        `ansi16(${ Convert.rgb.ansi16.raw(ToRgb(Self)) })`;

    export/**
           * Format as an `ansi256()` `string`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi256 = (Self: Color): string =>
        `ansi256(${ Convert.rgb.ansi256.raw(ToRgb(Self)) })`;

    export/**
           * Format as a `readonly` tuple of channels.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Tuple = (Self: Color): readonly [
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
    const Record = (Self: Color): {
        readonly R: Int.Int;
        readonly G: Int.Int;
        readonly B: Int.Int;
    } => ({ B: Self.B, G: Self.G, R: Self.R });
}
