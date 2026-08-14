/**
 * An immutable RGB color with normalized decimal channels.
 *
 * @module @sorrell/color/LinearColor
 *
 * @file      LinearColor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BigDecimal, Function, Option, Predicate } from "effect";
import Convert from "color-convert";

export/**
       * The type identifier for this module.
       *
       * @category Identifier
       * @since 1.0.0
       */
const TypeId = "~sorrell/color/LinearColor" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * An RGB color whose channels, including alpha, are decimals in the inclusive range
 * `[0, 1]`.
 *
 * @category Color
 * @since 1.0.0
 */
export interface LinearColor
{
    readonly [ TypeId ]: TypeId;
    readonly R: BigDecimal.BigDecimal;
    readonly G: BigDecimal.BigDecimal;
    readonly B: BigDecimal.BigDecimal;
    readonly A: BigDecimal.BigDecimal;
}

/**
 * Values accepted by a linear color channel.
 *
 * @category Color
 * @since 1.0.0
 */
export type ChannelArgument =
    | number
    | bigint
    | BigDecimal.BigDecimal;

export/**
       * Whether a value is a `LinearColor`.
       *
       * @category Guard
       * @since 1.0.0
       */
const IsLinearColor: { (Value: unknown): Value is LinearColor; } = Predicate.hasProperty(TypeId) as any;

const Zero = BigDecimal.fromNumberUnsafe(0);
const One = BigDecimal.fromNumberUnsafe(1);

const ToBigDecimal = (Self: ChannelArgument): BigDecimal.BigDecimal =>
{
    if (typeof Self === "number")
    {
        if (Number.isNaN(Self))
        {
            throw new RangeError("A color channel cannot be NaN.");
        }
        return BigDecimal.fromNumberUnsafe(Self);
    }
    return typeof Self === "bigint"
        ? BigDecimal.fromBigInt(Self)
        : Self;
};

const ToChannel = (Self: ChannelArgument): BigDecimal.BigDecimal =>
{
    const Value = ToBigDecimal(Self);
    if (BigDecimal.isLessThan(Value, Zero))
    {
        return Zero;
    }
    if (BigDecimal.isGreaterThan(Value, One))
    {
        return One;
    }
    return Value;
};

export/**
       * Construct a normalized RGB color, clamping each channel. `Alpha` defaults to
       * `1` (fully opaque) when not specified.
       *
       * @category Constructor
       * @since 1.0.0
       */
const LinearColor = (
    Red: ChannelArgument,
    Green: ChannelArgument,
    Blue: ChannelArgument,
    Alpha: ChannelArgument = One
): LinearColor => ({
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
       * @since 1.0.0
       */
const SetRed: {
    (Red: ChannelArgument): (Self: LinearColor) => LinearColor;
    (Self: LinearColor, Red: ChannelArgument): LinearColor;
} = Function.dual(2, (Self: LinearColor, Red: ChannelArgument): LinearColor =>
    LinearColor(Red, Self.G, Self.B, Self.A)
);

export/**
       * Set the green channel.
       *
       * @category Mutator
       * @since 1.0.0
       */
const SetGreen: {
    (Green: ChannelArgument): (Self: LinearColor) => LinearColor;
    (Self: LinearColor, Green: ChannelArgument): LinearColor;
} = Function.dual(2, (Self: LinearColor, Green: ChannelArgument): LinearColor =>
    LinearColor(Self.R, Green, Self.B, Self.A)
);

export/**
       * Set the blue channel.
       *
       * @category Mutator
       * @since 1.0.0
       */
const SetBlue: {
    (Blue: ChannelArgument): (Self: LinearColor) => LinearColor;
    (Self: LinearColor, Blue: ChannelArgument): LinearColor;
} = Function.dual(2, (Self: LinearColor, Blue: ChannelArgument): LinearColor =>
    LinearColor(Self.R, Self.G, Blue, Self.A)
);

export/**
       * Set the alpha channel.
       *
       * @category Mutator
       * @since 2.0.0
       */
const SetAlpha: {
    (Alpha: ChannelArgument): (Self: LinearColor) => LinearColor;
    (Self: LinearColor, Alpha: ChannelArgument): LinearColor;
} = Function.dual(2, (Self: LinearColor, Alpha: ChannelArgument): LinearColor =>
    LinearColor(Self.R, Self.G, Self.B, Alpha)
);

const ToRgb = (Self: LinearColor): [ number, number, number ] => [
    BigDecimal.toNumberUnsafe(Self.R) * 255,
    BigDecimal.toNumberUnsafe(Self.G) * 255,
    BigDecimal.toNumberUnsafe(Self.B) * 255
];

const FromRgb = (
    Value: readonly [ number, number, number ],
    Alpha: ChannelArgument = One
): LinearColor => LinearColor(Value[0] / 255, Value[1] / 255, Value[2] / 255, Alpha);

export/**
       * Make a color lighter by adding to its HSL lightness. Alpha is unaffected.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Lighten: {
    (Amount: number): (Self: LinearColor) => LinearColor;
    (Self: LinearColor, Amount: number): LinearColor;
} = Function.dual(2, (Self: LinearColor, Amount: number): LinearColor =>
{
    const [ Hue, Saturation, Lightness ] = Convert.rgb.hsl.raw(ToRgb(Self));
    return FromRgb(Convert.hsl.rgb.raw([
        Hue,
        Saturation,
        Math.min(100, Math.max(0, Lightness + Amount * 100))
    ]), Self.A);
});

export/**
       * Make a color darker by subtracting from its HSL lightness. Alpha is
       * unaffected.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Darken: {
    (Amount: number): (Self: LinearColor) => LinearColor;
    (Self: LinearColor, Amount: number): LinearColor;
} = Function.dual(2, (Self: LinearColor, Amount: number): LinearColor =>
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

export namespace From
{
    export/**
           * Parse three- or six-digit hexadecimal RGB.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hex = (Self: string): Option.Option<LinearColor> =>
    {
        const Match = Self.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i);
        return Match
            ? Option.some(FromRgb(Convert.hex.rgb.raw(Match[1]!)))
            : Option.none();
    };

    export/**
           * Parse CSS-style `rgb(r, g, b)` integer channels.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Rgb = (Self: string): Option.Option<LinearColor> =>
    {
        const Parts = ParseFunctional(Self, "rgb");
        return Parts && Parts.every((Part: number) =>
            Number.isInteger(Part) && Part >= 0 && Part <= 255)
            ? Option.some(LinearColor(
                Parts[0] / 255,
                Parts[1] / 255,
                Parts[2] / 255
            ))
            : Option.none();
    };

    export/**
           * Parse CSS-style HSL.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsl = (Self: string): Option.Option<LinearColor> =>
    {
        const Parts = ParseFunctional(Self, "hsl");
        return Parts && Parts[1] >= 0 && Parts[1] <= 100
            && Parts[2] >= 0 && Parts[2] <= 100
            ? Option.some(FromRgb(Convert.hsl.rgb.raw([
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
    const Keyword = (Self: string): Option.Option<LinearColor> =>
    {
        const Keyword = Self.trim().toLowerCase() as
            Parameters<typeof Convert.keyword.rgb.raw>[0];
        const Value = Convert.keyword.rgb.raw(Keyword);
        return Value === undefined
            ? Option.none()
            : Option.some(FromRgb(Value));
    };

    export/**
           * Parse `hsv(h, s%, v%)`.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsv = (Self: string): Option.Option<LinearColor> =>
    {
        const Parts = ParseFunctional(Self, "hsv");
        return Parts && Parts[1] >= 0 && Parts[1] <= 100
            && Parts[2] >= 0 && Parts[2] <= 100
            ? Option.some(FromRgb(Convert.hsv.rgb.raw([
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
    const Hwb = (Self: string): Option.Option<LinearColor> =>
    {
        const Parts = ParseFunctional(Self, "hwb");
        return Parts && Parts[1] >= 0 && Parts[1] <= 100
            && Parts[2] >= 0 && Parts[2] <= 100
            ? Option.some(FromRgb(Convert.hwb.rgb.raw([
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
    const Ansi16 = (Self: string): Option.Option<LinearColor> =>
    {
        const Value = ParseAnsi(Self, "ansi16", 107);
        return Value === undefined
            ? Option.none()
            : Option.some(FromRgb(Convert.ansi16.rgb.raw(Value)));
    };

    export/**
           * Parse an ANSI-256 index, with or without an `ansi256(...)` wrapper.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi256 = (Self: string): Option.Option<LinearColor> =>
    {
        const Value = ParseAnsi(Self, "ansi256", 255);
        return Value === undefined
            ? Option.none()
            : Option.some(FromRgb(Convert.ansi256.rgb.raw(Value)));
    };

    export/**
           * Construct a color from a `readonly` tuple of channels. `Alpha` defaults
           * to `1` (fully opaque) when the tuple has no fourth element.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Tuple = (Self: readonly [
        Red: ChannelArgument,
        Green: ChannelArgument,
        Blue: ChannelArgument,
        Alpha?: ChannelArgument
    ]): LinearColor => LinearColor(Self[0], Self[1], Self[2], Self[3]);

    export/**
           * Construct a color from a `Record` of channels. `A` defaults to `1`
           * (fully opaque) when not specified.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Record = (Self: {
        readonly R: ChannelArgument;
        readonly G: ChannelArgument;
        readonly B: ChannelArgument;
        readonly A?: ChannelArgument;
    }): LinearColor => LinearColor(Self.R, Self.G, Self.B, Self.A);
}

export namespace Format
{
    export/**
           * Format as lowercase six-digit hexadecimal RGB. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hex = (Self: LinearColor): string =>
        `#${ Convert.rgb.hex.raw(ToRgb(Self)).toLowerCase() }`;

    export/**
           * Format as a CSS `rgb()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Rgb = (Self: LinearColor): string =>
    {
        const [ Red, Green, Blue ] = ToRgb(Self).map(Math.round);
        return `rgb(${ Red }, ${ Green }, ${ Blue })`;
    };

    export/**
           * Format as a CSS `hsl()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsl = (Self: LinearColor): string =>
    {
        const [ Hue, Saturation, Lightness ] = Convert.rgb.hsl.raw(ToRgb(Self));
        return `hsl(${ Math.round(Hue) }, ${ Math.round(Saturation) }%, ${ Math.round(Lightness) }%)`;
    };

    export/**
           * Format as the nearest CSS named color. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Keyword = (Self: LinearColor): string =>
        Convert.rgb.keyword.raw(ToRgb(Self).map(Math.round) as [ number, number, number ]);

    export/**
           * Format as a CSS `hsv()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hsv = (Self: LinearColor): string =>
    {
        const [ Hue, Saturation, Value ] = Convert.rgb.hsv.raw(ToRgb(Self));
        return `hsv(${ Math.round(Hue) }, ${ Math.round(Saturation) }%, ${ Math.round(Value) }%)`;
    };

    export/**
           * Format as a CSS `hwb()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Hwb = (Self: LinearColor): string =>
    {
        const [ Hue, Whiteness, Blackness ] = Convert.rgb.hwb.raw(ToRgb(Self));
        return `hwb(${ Math.round(Hue) }, ${ Math.round(Whiteness) }%, ${ Math.round(Blackness) }%)`;
    };

    export/**
           * Format as an `ansi16()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi16 = (Self: LinearColor): string =>
        `ansi16(${ Convert.rgb.ansi16.raw(ToRgb(Self)) })`;

    export/**
           * Format as an `ansi256()` `string`. Alpha is not represented.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Ansi256 = (Self: LinearColor): string =>
        `ansi256(${ Convert.rgb.ansi256.raw(ToRgb(Self)) })`;

    export/**
           * Format as a `readonly` tuple of channels, including alpha.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Tuple = (Self: LinearColor): readonly [
        Red: BigDecimal.BigDecimal,
        Green: BigDecimal.BigDecimal,
        Blue: BigDecimal.BigDecimal,
        Alpha: BigDecimal.BigDecimal
    ] => [ Self.R, Self.G, Self.B, Self.A ];

    export/**
           * Format as a `Record` of channels, including alpha.
           *
           * @category Constructor
           * @since 1.0.0
           */
    const Record = (Self: LinearColor): {
        readonly R: BigDecimal.BigDecimal;
        readonly G: BigDecimal.BigDecimal;
        readonly B: BigDecimal.BigDecimal;
        readonly A: BigDecimal.BigDecimal;
    } => ({ A: Self.A, B: Self.B, G: Self.G, R: Self.R });
}
