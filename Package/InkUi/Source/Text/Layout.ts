/**
 * CSS-like text sizing, wrapping, and SVG generation.
 *
 * @module @sorrell/ink-ui/Text/Layout
 *
 * @file      Layout.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Array, String, pipe } from "effect";
import { type BBox, Resvg } from "@resvg/resvg-js";

/**
 * The primitives that can be used to define length in a CSS format.
 *
 * @category Render
 * @since 1.0.0
 */
export type CssLength = number | string;

/**
 * The props that are used to render SVG text.
 *
 * @category Render
 * @since 1.0.0
 */
export interface TextSvgStyle
{
    readonly BackgroundColor?: string | undefined;
    readonly Color: string;
    readonly FontFamily: string;
    readonly FontFeatureSettings?: string | undefined;
    readonly FontKerning?: string | undefined;
    readonly FontOpticalSizing?: string | undefined;
    readonly FontSize: number;
    readonly FontSizeAdjust?: string | number | undefined;
    readonly FontStyle?: string | undefined;
    readonly FontStretch?: string | undefined;
    readonly FontVariant?: string | undefined;
    readonly FontVariationSettings?: string | undefined;
    readonly FontWeight?: number | string | undefined;
    readonly LetterSpacing: number;
    readonly LineHeight: number;
    readonly Opacity: number;
    readonly TextAlign: string;
    readonly TextDecoration?: string | undefined;
    readonly TextIndent: number;
    readonly TextTransform?: string | undefined;
    readonly WordSpacing: number;
}

/**
 * The props that determine how text is wrapped when rendered as SVG.
 *
 * @category Render
 * @since 1.0.0
 */
export interface TextWrapStyle
{
    readonly Hyphens: string | undefined;
    readonly LineBreak: string | undefined;
    readonly OverflowWrap: string | undefined;
    readonly TabSize: number | undefined;
    readonly WhiteSpace: string | undefined;
    readonly WordBreak: string | undefined;
}

/**
 * The props that determine how the layout of text is determined when rendering SVG.
 *
 * @category Render
 * @since 1.0.0
 */
export interface TextSvgLayoutOptions
{
    readonly CellHeight?: number | undefined;
    readonly CellWidth?: number | undefined;
    readonly MaxWidth?: number | undefined;
    readonly Style: TextSvgStyle;
    readonly Text: string;
    readonly Wrap: TextWrapStyle;
}

/**
 * The layout of text in rendered SVG.
 *
 * @category Render
 * @since 1.0.0
 */
export interface TextSvgLayout
{
    readonly Height: number;
    readonly Lines: ReadonlyArray<string>;
    readonly Svg: string;
    readonly Width: number;
}

/**
 * The CSS values that are used to render text in SVG.
 *
 * @category Render
 * @since 1.0.0
 */
export interface CssLengthContext
{
    readonly FontSize: number;
    readonly RootFontSize: number;
    readonly ViewportHeight: number;
    readonly ViewportWidth: number;
}

const LengthPattern: RegExp = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
const FontSizeFactors: Readonly<Record<string, number>> =
    {
        /* eslint-disable sort-keys */
        "xx-small": 0.6,
        "x-small": 0.75,
        small: 0.89,
        medium: 1,
        large: 1.2,
        "x-large": 1.5,
        "xx-large": 2,
        "xxx-large": 3,
        smaller: 0.8,
        larger: 1.2
        /* eslint-enable sort-keys */
    } as const;

const MeasurementCache = new Map<string, number>();

/** Resolve a web-style `font-size` against the terminal's usual size. */
export function ParseFontSize(Value: CssLength | undefined, NormalSize: number): number
{
    if (Value === undefined)
    {
        return NormalSize;
    }
    if (typeof Value === "string")
    {
        const Factor: number | undefined = FontSizeFactors[Value.trim().toLowerCase()];
        if (Factor !== undefined)
        {
            return NormalSize * Factor;
        }
    }

    return ParseCssLength(Value, {
        FontSize: NormalSize,
        RootFontSize: NormalSize,
        ViewportHeight: NormalSize,
        ViewportWidth: NormalSize
    }, NormalSize) ?? NormalSize;
}

/** Resolve a CSS length used by text metrics. */
export function ParseCssLength(
    Value: CssLength | undefined,
    Context: CssLengthContext,
    PercentageBase: number = Context.FontSize
): number | undefined
{
    if (Value === undefined)
    {
        return undefined;
    }
    if (typeof Value === "number")
    {
        return Number.isFinite(Value) ? Value : undefined;
    }

    const Match: RegExpExecArray | null = LengthPattern.exec(Value.trim());
    if (Match?.[1] === undefined)
    {
        return undefined;
    }

    const Quantity: number = Number(Match[1]);
    const Unit: string = Match[2]?.toLowerCase() ?? "";
    const UnitSize: number | undefined = (() =>
    {
        switch (Unit)
        {
            case "":
            case "px": return 1;
            case "%": return PercentageBase / 100;
            case "em": return Context.FontSize;
            case "rem": return Context.RootFontSize;
            case "ex": return Context.FontSize / 2;
            case "cap": return Context.FontSize * 0.7;
            case "ch":
            case "ic": return Context.FontSize * 0.6;
            case "lh": return Context.FontSize * 1.2;
            case "rlh": return Context.RootFontSize * 1.2;
            case "vw": return Context.ViewportWidth / 100;
            case "vh": return Context.ViewportHeight / 100;
            case "vmin": return Math.min(Context.ViewportWidth, Context.ViewportHeight) / 100;
            case "vmax": return Math.max(Context.ViewportWidth, Context.ViewportHeight) / 100;
            case "in": return 96;
            case "cm": return 96 / 2.54;
            case "mm": return 96 / 25.4;
            case "q": return 96 / 101.6;
            case "pt": return 96 / 72;
            case "pc": return 16;
            default: return undefined;
        }
    })();

    return UnitSize === undefined || !Number.isFinite(Quantity)
        ? undefined
        : Quantity * UnitSize;
}

/** Resolve CSS `line-height`, including unitless multipliers. */
export function ParseLineHeight(
    Value: CssLength | "normal" | undefined,
    Context: CssLengthContext
): number
{
    if (Value === undefined || Value === "normal")
    {
        return Context.FontSize * 1.2;
    }
    if (typeof Value === "number")
    {
        return Math.max(0, Value * Context.FontSize);
    }

    return Math.max(0, ParseCssLength(Value, Context, Context.FontSize) ?? Context.FontSize * 1.2);
}

/** Lay out text and produce an intrinsically-sized SVG. */
export function LayoutTextSvg(Options: TextSvgLayoutOptions): TextSvgLayout
{
    const Style: TextSvgStyle = Options.Style;
    const Measurer: (Value: string) => number = MakeTextMeasurer(Style);
    const Text: string = TransformText(Options.Text, Style.TextTransform);
    const MaximumWidth: number | undefined = Options.MaxWidth === undefined
        ? undefined
        : Math.max(1, Options.MaxWidth);
    const Lines: ReadonlyArray<string> = WrapText(Text, MaximumWidth, Measurer, Options.Wrap, Style);
    const MeasuredWidth: number = Math.max(1, ...Lines.map((Line: string) => Measurer(Line)));
    const ContentWidth: number = Math.max(1, Math.ceil(MaximumWidth ?? MeasuredWidth));
    const ContentHeight: number = Math.max(1, Math.ceil(Math.max(1, Lines.length) * Style.LineHeight));
    const Width: number = RoundToCell(ContentWidth, Options.CellWidth);
    const Height: number = RoundToCell(ContentHeight, Options.CellHeight);
    const Svg: string = MakeSvg(Lines, Width, Height, Style, Measurer);

    return { Height, Lines, Svg, Width };
}

const MakeTextMeasurer = (Style: TextSvgStyle): (Value: string) => number =>
{
    const Cache = new Map<string, number>();
    const StyleKey: string = JSON.stringify(Style);
    const MarkerRight: number = MeasureMarkerRight("", Style, StyleKey);

    return (Value: string): number =>
    {
        const Cached: number | undefined = Cache.get(Value);
        if (Cached !== undefined)
        {
            return Cached;
        }

        const Right: number = MeasureMarkerRight(Value, Style, StyleKey);
        const Width: number = Math.max(0, Right - MarkerRight);
        Cache.set(Value, Width);
        return Width;
    };
};

const MeasureMarkerRight = (Value: string, Style: TextSvgStyle, StyleKey: string): number =>
{
    const CacheKey: string = `${ StyleKey }\u0000${ Value }`;
    const Cached: number | undefined = MeasurementCache.get(CacheKey);
    if (Cached !== undefined)
    {
        return Cached;
    }

    const Padding: number = 8;
    const EstimatedWidth: number = Math.max(64, Math.ceil(
        Padding * 2 + (Array.Array.from(Value).length + 2)
            * (Style.FontSize * 2 + Math.abs(Style.LetterSpacing) + Math.abs(Style.WordSpacing))
    ));
    const Height: number = Math.max(8, Math.ceil(Style.LineHeight * 2));
    const Svg: string = `<svg xmlns="http://www.w3.org/2000/svg" width="${ EstimatedWidth }" ` +
        `height="${ Height }"><text x="${ Padding }" y="${ Style.FontSize }" ` +
        `${ FontAttributes(Style) } xml:space="preserve">${ EscapeText(Value) }` +
        "<tspan fill=\"#ff00ff\">|</tspan></text></svg>";
    const Bounds: BBox | undefined = new Resvg(Svg, {
        font: { defaultFontFamily: FirstFontFamily(Style.FontFamily), loadSystemFonts: true },
        logLevel: "off"
    }).getBBox();

    const Result: number = Bounds === undefined ? Padding : Bounds.x + Bounds.width;
    MeasurementCache.set(CacheKey, Result);
    return Result;
};

const RoundToCell = (Value: number, CellSize: number | undefined): number =>
    CellSize === undefined || !Number.isFinite(CellSize) || CellSize <= 0
        ? Value
        : Math.max(CellSize, Math.ceil(Value / CellSize) * CellSize);

const WrapText = (
    Text: string,
    MaximumWidth: number | undefined,
    Measure: (Value: string) => number,
    Wrap: TextWrapStyle,
    Style: TextSvgStyle
): ReadonlyArray<string> =>
{
    const WhiteSpace: string = Wrap.WhiteSpace ?? "normal";
    const PreserveNewlines: boolean = [ "pre", "pre-line", "pre-wrap", "break-spaces" ]
        .includes(WhiteSpace);
    const PreserveSpaces: boolean = [ "pre", "pre-wrap", "break-spaces" ].includes(WhiteSpace);
    const AllowsWrapping: boolean = ![ "nowrap", "pre" ].includes(WhiteSpace);
    const Tab: string = " ".repeat(Math.max(0, Math.round(Wrap.TabSize ?? 8)));
    const Normalized: string = PreserveSpaces
        ? Text.replace(/\t/gu, Tab)
        : (PreserveNewlines
            ? Text.split("\n").map((Line: string) => Line.replace(/[\t\f\r ]+/gu, " ")).join("\n")
            : Text.replace(/\s+/gu, " "));
    const LogicalLines: ReadonlyArray<string> = PreserveNewlines
        ? Normalized.split("\n")
        : [ Normalized.replace(/\n+/gu, " ") ];

    if (MaximumWidth === undefined || !AllowsWrapping)
    {
        return LogicalLines.length === 0 ? [ "" ] : LogicalLines;
    }

    const Result: Array<string> = [ ];
    for (const LogicalLine of LogicalLines)
    {
        Result.push(...WrapLine(
            PreserveSpaces ? LogicalLine : LogicalLine.trim(),
            MaximumWidth,
            Measure,
            Wrap,
            Style.TextIndent,
            Result.length === 0
        ));
    }
    return Result.length === 0 ? [ "" ] : Result;
};

const WrapLine = (
    Value: string,
    MaximumWidth: number,
    Measure: (Value: string) => number,
    Wrap: TextWrapStyle,
    TextIndent: number,
    IsFirstVisualLine: boolean
): ReadonlyArray<string> =>
{
    const BreakEverywhere: boolean = Wrap.WordBreak === "break-all"
        || Wrap.WordBreak === "break-word"
        || Wrap.OverflowWrap === "anywhere"
        || Wrap.LineBreak === "anywhere"
        || Wrap.WhiteSpace === "break-spaces";
    const BreakLongWords: boolean = BreakEverywhere
        || Wrap.OverflowWrap === "break-word"
        || Wrap.Hyphens === "auto";
    const Tokens: ReadonlyArray<string> = BreakEverywhere
        ? Array.Array.from(Value)
        : SegmentWords(Value, Wrap.WordBreak === "keep-all");
    const Lines: Array<string> = [ ];
    let Current: string = "";

    for (const Token of Tokens)
    {
        const Limit: number = Math.max(1, MaximumWidth
            - (IsFirstVisualLine && Lines.length === 0 ? TextIndent : 0));
        const Candidate: string = Current + Token;

        if (Current.length === 0 || Measure(Candidate) <= Limit)
        {
            Current = Candidate;
            continue;
        }

        Lines.push(Wrap.WhiteSpace === "break-spaces" ? Current : Current.trimEnd());
        Current = Wrap.WhiteSpace === "break-spaces" ? Token : Token.trimStart();

        if (BreakLongWords && Measure(Current) > MaximumWidth)
        {
            const Broken = BreakToken(Current, MaximumWidth, Measure);
            Lines.push(...Broken.slice(0, -1));
            Current = Broken.at(-1) ?? "";
        }
    }

    Lines.push(Wrap.WhiteSpace === "break-spaces" ? Current : Current.trimEnd());

    return Lines;
};

const SegmentWords = (Value: string, KeepAll: boolean): ReadonlyArray<string> =>
{
    if (KeepAll)
    {
        return Value.match(/\s+|\S+/gu) ?? [ "" ];
    }

    const Segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
    return [ ...Segmenter.segment(Value) ].map((Value: Intl.SegmentData) => Value.segment);
};

const BreakToken = (
    Value: string,
    MaximumWidth: number,
    Measure: (Value: string) => number
): ReadonlyArray<string> =>
{
    const Lines: Array<string> = [ ];
    let Current: string = "";

    for (const Character of Array.Array.from(Value))
    {
        if (Current.length > 0 && Measure(Current + Character) > MaximumWidth)
        {
            Lines.push(Current);
            Current = Character;
        }
        else
        {
            Current += Character;
        }
    }
    Lines.push(Current);
    return Lines;
};

const MakeSvg = (
    Lines: ReadonlyArray<string>,
    Width: number,
    Height: number,
    Style: TextSvgStyle,
    Measure: (Value: string) => number
): string =>
{
    const Background: string = Style.BackgroundColor === undefined
        ? ""
        : `<rect width="100%" height="100%" fill="${ EscapeAttribute(Style.BackgroundColor) }"/>`;
    const TextLines: string = Lines.map((Line: string, Index: number) =>
    {
        const LineWidth: number = Measure(Line);
        const Indent: number = Index === 0 ? Style.TextIndent : 0;
        const X: number = AlignLine(Style.TextAlign, Width, LineWidth, Indent);
        const Y: number = Index * Style.LineHeight
            + (Style.LineHeight - Style.FontSize) / 2
            + Style.FontSize * 0.82;

        return `<text x="${ X }" y="${ Y }" ${ FontAttributes(Style) } ` +
            `fill="${ EscapeAttribute(Style.Color) }" fill-opacity="${ Style.Opacity }" ` +
            `xml:space="preserve">${ EscapeText(Line) }</text>`;
    }).join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${ Width }" height="${ Height }" ` +
        `viewBox="0 0 ${ Width } ${ Height }">${ Background }${ TextLines }</svg>`;
};

const FontAttributes = (Style: TextSvgStyle): string =>
{
    const SyntheticBold: boolean = IsBoldWeight(Style.FontWeight);
    const SyntheticBoldWidth: number = Math.max(0.5, Style.FontSize * 0.04);
    const Attributes =
        [
            `font-family="${ EscapeAttribute(Style.FontFamily) }"`,
            Style.FontFeatureSettings === undefined
                ? ""
                : `font-feature-settings="${ EscapeAttribute(Style.FontFeatureSettings) }"`,
            Style.FontKerning === undefined
                ? ""
                : `font-kerning="${ EscapeAttribute(Style.FontKerning) }"`,
            Style.FontOpticalSizing === undefined
                ? ""
                : `font-optical-sizing="${ EscapeAttribute(Style.FontOpticalSizing) }"`,
            `font-size="${ Style.FontSize }px"`,
            Style.FontSizeAdjust === undefined
                ? ""
                : `font-size-adjust="${ Style.FontSizeAdjust }"`,
            Style.FontStyle === undefined ? "" : `font-style="${ EscapeAttribute(Style.FontStyle) }"`,
            Style.FontStretch === undefined ? "" : `font-stretch="${ EscapeAttribute(Style.FontStretch) }"`,
            Style.FontVariant === undefined ? "" : `font-variant="${ EscapeAttribute(Style.FontVariant) }"`,
            Style.FontWeight === undefined ? "" : `font-weight="${ Style.FontWeight }"`,
            Style.FontVariationSettings === undefined
                ? ""
                : `font-variation-settings="${ EscapeAttribute(Style.FontVariationSettings) }"`,
            SyntheticBold ? `stroke="${ EscapeAttribute(Style.Color) }"` : "",
            SyntheticBold ? `stroke-width="${ SyntheticBoldWidth }"` : "",
            SyntheticBold ? "stroke-linejoin=\"round\"" : "",
            SyntheticBold ? "paint-order=\"stroke fill\"" : "",
            `letter-spacing="${ Style.LetterSpacing }px"`,
            `word-spacing="${ Style.WordSpacing }px"`,
            Style.TextDecoration === undefined
                ? ""
                : `text-decoration="${ EscapeAttribute(Style.TextDecoration) }"`
        ] as const;

    return pipe(Attributes, Array.filter(String.isNonEmpty), Array.join(" "));
};

const IsBoldWeight = (Value: number | string | undefined): boolean =>
{
    if (typeof Value === "number")
    {
        return Value >= 600;
    }
    if (Value === undefined)
    {
        return false;
    }
    const Normalized: string = Value.trim().toLowerCase();
    if (Normalized === "bold" || Normalized === "bolder")
    {
        return true;
    }
    const Numeric: number = Number(Normalized);
    return Number.isFinite(Numeric) && Numeric >= 600;
};

const AlignLine = (
    TextAlign: string,
    Width: number,
    LineWidth: number,
    Indent: number
): number =>
{
    switch (TextAlign)
    {
        case "center": return Math.max(0, (Width - LineWidth) / 2);
        case "right":
        case "end": return Math.max(0, Width - LineWidth);
        default: return Math.max(0, Indent);
    }
};

const TransformText = (Value: string, Transform: string | undefined): string =>
{
    switch (Transform)
    {
        case "uppercase": return Value.toLocaleUpperCase();
        case "lowercase": return Value.toLocaleLowerCase();
        case "capitalize": return Value.replace(/\b\p{L}/gu, (Character: string) =>
            Character.toLocaleUpperCase());
        default: return Value;
    }
};

const FirstFontFamily = (Value: string): string =>
    Value.split(",")[0]?.trim().replace(/^(["'])(.*)\1$/u, "$2") || "monospace";

const EscapeText = (Value: string): string =>
{
    return Value
        .replace(/&/gu, "&amp;")
        .replace(/</gu, "&lt;")
        .replace(/>/gu, "&gt;");
};

const EscapeAttribute = (Value: string): string =>
    EscapeText(Value).replace(/"/gu, "&quot;");
