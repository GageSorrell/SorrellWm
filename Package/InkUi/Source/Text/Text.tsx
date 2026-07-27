/**
 * Ink text with CSS-like font sizing and Sixel rendering.
 *
 * @module @sorrell/ink-ui/Text/Text
 *
 * @file      Text.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    type CssLength,
    LayoutTextSvg,
    ParseCssLength,
    ParseFontSize,
    ParseLineHeight,
    type TextSvgLayout,
    type TextSvgStyle
} from "./Layout.ts";
import type { RgbColor, TerminalFont, TerminalSupport } from "../Support/Types.ts";
import { useTerminalFont, useTerminalSupport } from "../Support/Hook.tsx";
import { Svg } from "../Svg/Svg.tsx";

type LayoutPropKeys =
    | "alignContent"
    | "alignItems"
    | "alignSelf"
    | "aspectRatio"
    | "bottom"
    | "columnGap"
    | "display"
    | "flexBasis"
    | "flexDirection"
    | "flexGrow"
    | "flexShrink"
    | "flexWrap"
    | "gap"
    | "height"
    | "justifyContent"
    | "left"
    | "margin"
    | "marginBottom"
    | "marginLeft"
    | "marginRight"
    | "marginTop"
    | "marginX"
    | "marginY"
    | "maxHeight"
    | "maxWidth"
    | "minHeight"
    | "minWidth"
    | "overflow"
    | "overflowX"
    | "overflowY"
    | "padding"
    | "paddingBottom"
    | "paddingLeft"
    | "paddingRight"
    | "paddingTop"
    | "paddingX"
    | "paddingY"
    | "position"
    | "right"
    | "rowGap"
    | "top"
    | "width";

type LayoutProps =
    {
        readonly [Key in LayoutPropKeys]?: Ink.BoxProps[Key] | undefined
    };

type CssTextProps = Pick<React.CSSProperties,
    | "fontFamily"
    | "fontFeatureSettings"
    | "fontKerning"
    | "fontOpticalSizing"
    | "fontSize"
    | "fontSizeAdjust"
    | "fontStretch"
    | "fontStyle"
    | "fontVariant"
    | "fontVariationSettings"
    | "fontWeight"
    | "hyphens"
    | "letterSpacing"
    | "lineBreak"
    | "lineHeight"
    | "overflowWrap"
    | "tabSize"
    | "textAlign"
    | "textDecorationLine"
    | "textIndent"
    | "textTransform"
    | "whiteSpace"
    | "wordBreak"
    | "wordSpacing">;

/** Props for {@link Text}. CSS typography properties are provided directly. */
export type TextProps =
    Ink.TextProps &
    LayoutProps &
    CssTextProps;

export/**
       * Ink's `Text`, extended with web-style typography.
       *
       * Text that the terminal can represent natively remains ordinary Ink text.
       * A different font or pixel geometry is laid out as SVG and rendered through
       * Sixel at the required number of terminal cells.
       *
       * @category Component
       * @since 1.0.0
       */
const Text = (Props: TextProps): React.ReactNode =>
{
    return MayRequireSvg(Props)
        ? <EnhancedText { ...Props } />
        : <PlainText { ...Props } />;
};

export/**
       * Return a platform-appropriate CSS monospace fallback list.
       *
       * @category Render
       * @since 1.0.0
       */
const GetDefaultFontFamily = (
    Platform: NodeJS.Platform = process.platform
): string =>
{
    switch (Platform)
    {
        case "win32": return "\"Cascadia Mono\", Consolas, monospace";
        case "darwin": return "Menlo, Monaco, monospace";
        default: return "\"DejaVu Sans Mono\", \"Liberation Mono\", monospace";
    }
};

const EnhancedText = (Props: TextProps): React.ReactElement | null =>
{
    const Support: TerminalSupport | undefined = useTerminalSupport();
    const Font: TerminalFont | undefined = useTerminalFont();
    const { stdout } = Ink.useStdout();
    const BoxReference = React.useRef<Ink.DOMElement>(null);
    const Metrics: Ink.UseBoxMetricsResult = Ink.useBoxMetrics(BoxReference);
    const TextValue: string | undefined = ToText(Props.children);
    const CellHeight: number = Support?.CellSizePixels?.Y ?? 16;
    const CellWidth: number = Support?.CellSizePixels?.X ?? CellHeight * 0.5;
    const FontSize: number = ParseFontSize(ToCssLength(Props.fontSize), CellHeight);
    const Context =
        {
            FontSize,
            RootFontSize: CellHeight,
            ViewportHeight: (stdout.rows ?? 24) * CellHeight,
            ViewportWidth: (stdout.columns ?? 80) * CellWidth
        } as const;
    const LetterSpacing: number = Props.letterSpacing === "normal"
        ? 0
        : (ParseCssLength(ToCssLength(Props.letterSpacing), Context) ?? 0);
    const WordSpacing: number = Props.wordSpacing === "normal"
        ? 0
        : (ParseCssLength(ToCssLength(Props.wordSpacing), Context) ?? 0);
    const LineHeight: number = ParseLineHeight(ToLineHeight(Props.lineHeight), Context);
    const TextIndent: number = ParseCssLength(ToCssLength(Props.textIndent), Context) ?? 0;
    const FontFamily: string = String(Props.fontFamily ?? Font?.Family
        ?? GetDefaultFontFamily());
    const RequiresSvg: boolean = TextValue !== undefined && ShouldRenderSvg(
        Props,
        Font,
        FontSize,
        CellHeight,
        LetterSpacing,
        WordSpacing,
        LineHeight,
        TextIndent
    );
    const InitialWidthCells: number | undefined = NumericDimension(Props.width)
        ?? NumericDimension(Props.maxWidth);
    const OuterConstraintCells: number | undefined = Metrics.hasMeasured && Metrics.width > 0
        ? Metrics.width
        : InitialWidthCells;
    const HorizontalPadding: number = GetHorizontalPadding(Props);
    const ConstraintCells: number | undefined = OuterConstraintCells === undefined
        ? undefined
        : Math.max(1, OuterConstraintCells - HorizontalPadding);
    const MaximumWidth: number | undefined = ConstraintCells === undefined
        ? undefined
        : Math.max(1, ConstraintCells * CellWidth);
    const SvgStyle: TextSvgStyle = React.useMemo(() => MakeSvgStyle(
        Props, Support, FontFamily, FontSize, LetterSpacing,
        WordSpacing, LineHeight, TextIndent
    ), [
        FontFamily,
        FontSize,
        LetterSpacing,
        LineHeight,
        Props,
        Support,
        TextIndent,
        WordSpacing
    ]);
    const Layout: TextSvgLayout | undefined = React.useMemo(() =>
        RequiresSvg && TextValue !== undefined
            ? LayoutTextSvg({
                CellHeight,
                CellWidth,
                MaxWidth: MaximumWidth,
                Style: SvgStyle,
                Text: TextValue,
                Wrap: {
                    Hyphens: Props.hyphens,
                    LineBreak: Props.lineBreak,
                    OverflowWrap: Props.overflowWrap,
                    TabSize: ResolveTabSize(Props.tabSize),
                    WhiteSpace: Props.whiteSpace,
                    WordBreak: Props.wordBreak ?? (Props.wrap === "hard" ? "break-all" : undefined)
                }
            })
            : undefined,
    [
        MaximumWidth,
        CellHeight,
        CellWidth,
        Props.hyphens,
        Props.lineBreak,
        Props.overflowWrap,
        Props.tabSize,
        Props.whiteSpace,
        Props.wordBreak,
        Props.wrap,
        RequiresSvg,
        SvgStyle,
        TextValue
    ]);

    if (!RequiresSvg || Layout === undefined || Support?.Sixel !== true
        || Support.CellSizePixels === undefined)
    {
        // return <><Ink.Text>RequiresSvg: { RequiresSvg }</Ink.Text><PlainText { ...Props } /></>;
        return <PlainText { ...Props } />;
    }

    const LayoutValues: LayoutProps = GetLayoutProps(Props);
    const NaturalWidth: number = Math.max(1, Math.ceil(Layout.Width / CellWidth) + HorizontalPadding);
    const NaturalHeight: number = Math.max(1, Math.ceil(Layout.Height / CellHeight));

    return (
        <Ink.Box
            { ...LayoutValues }
            aria-label={ Props["aria-label"] ?? TextValue ?? "" }
            { ...(Props["aria-hidden"] === undefined
                ? { }
                : { "aria-hidden": Props["aria-hidden"] }) }
            ref={ BoxReference }
            width={ Props.width ?? NaturalWidth }>
            <Svg
                height={ NaturalHeight }
                rasterization="crisp"
                width="100%">
                { Layout.Svg }
            </Svg>
            {/* <Svg fallback={ <PlainText { ...Props } /> }
                width="100%">
                { Layout.Svg }
            </Svg> */}
        </Ink.Box>
    );
};

const PlainText = (Props: TextProps): React.ReactElement | null =>
{
    const LayoutValues: LayoutProps = GetLayoutProps(Props);
    const HasLayout: boolean = Object.values(LayoutValues)
        .some((Value: unknown) => Value !== undefined);
    const Children: React.ReactNode = TransformPlainText(Props.children, Props.textTransform);
    const Value = (
        <Ink.Text
            { ...(Props["aria-hidden"] === undefined
                ? { }
                : { "aria-hidden": Props["aria-hidden"] }) }
            { ...(Props["aria-label"] === undefined
                ? { }
                : { "aria-label": Props["aria-label"] }) }
            { ...(Props.backgroundColor === undefined
                ? { }
                : { backgroundColor: Props.backgroundColor }) }
            bold={ Props.bold || IsBold(Props.fontWeight) }
            { ...(Props.color === undefined ? { } : { color: Props.color }) }
            dimColor={ Props.dimColor ?? false }
            inverse={ Props.inverse ?? false }
            italic={ Props.italic || Props.fontStyle === "italic" || Props.fontStyle === "oblique" }
            strikethrough={ Props.strikethrough || HasDecoration(Props, "line-through") }
            underline={ Props.underline || HasDecoration(Props, "underline") }
            { ...(ResolveInkWrap(Props) === undefined
                ? { }
                : { wrap: ResolveInkWrap(Props) }) }>
            { Children }
        </Ink.Text>
    );

    return HasLayout ? <Ink.Box { ...LayoutValues }>{ Value }</Ink.Box> : Value;
};

const MakeSvgStyle = (
    Props: TextProps,
    Support: TerminalSupport | undefined,
    FontFamily: string,
    FontSize: number,
    LetterSpacing: number,
    WordSpacing: number,
    LineHeight: number,
    TextIndent: number
): TextSvgStyle =>
{
    const TerminalForeground: string = RgbToCss(Support?.ForegroundColor)
        ?? ContrastColor(Support?.BackgroundColor);
    const TerminalBackground: string | undefined = RgbToCss(Support?.BackgroundColor);
    let Color: string = ResolveSvgColor(Props.color) ?? TerminalForeground;
    let BackgroundColor: string | undefined = ResolveSvgColor(Props.backgroundColor);

    if (Props.inverse === true)
    {
        const PreviousColor: string = Color;
        Color = BackgroundColor ?? TerminalBackground ?? "#000000";
        BackgroundColor = PreviousColor;
    }

    return {
        ...(BackgroundColor === undefined ? { } : { BackgroundColor }),
        Color,
        FontFamily,
        ...(Props.fontFeatureSettings === undefined
            ? { }
            : { FontFeatureSettings: String(Props.fontFeatureSettings) }),
        ...(Props.fontKerning === undefined ? { } : { FontKerning: String(Props.fontKerning) }),
        ...(Props.fontOpticalSizing === undefined
            ? { }
            : { FontOpticalSizing: String(Props.fontOpticalSizing) }),
        FontSize,
        ...(Props.fontSizeAdjust === undefined
            ? { }
            : { FontSizeAdjust: Props.fontSizeAdjust }),
        ...(Props.fontStyle === undefined ? { } : { FontStyle: String(Props.fontStyle) }),
        ...(Props.fontStretch === undefined ? { } : { FontStretch: String(Props.fontStretch) }),
        ...(Props.fontVariant === undefined ? { } : { FontVariant: String(Props.fontVariant) }),
        ...(Props.fontVariationSettings === undefined
            ? { }
            : { FontVariationSettings: String(Props.fontVariationSettings) }),
        FontWeight: Props.fontWeight ?? (Props.bold ? "bold" : "normal"),
        LetterSpacing,
        LineHeight,
        Opacity: Props.dimColor ? 0.5 : 1,
        TextAlign: String(Props.textAlign ?? "left"),
        ...(TextDecoration(Props) === undefined ? { } : { TextDecoration: TextDecoration(Props) }),
        TextIndent,
        ...(Props.textTransform === undefined ? { } : { TextTransform: String(Props.textTransform) }),
        WordSpacing
    };
};

const ShouldRenderSvg = (
    Props: TextProps,
    Font: TerminalFont | undefined,
    FontSize: number,
    NormalSize: number,
    LetterSpacing: number,
    WordSpacing: number,
    LineHeight: number,
    TextIndent: number
): boolean =>
{
    const RequestedFamily: string | undefined = Props.fontFamily === undefined
        ? undefined
        : String(Props.fontFamily);
    const FamilyDiffers: boolean = RequestedFamily !== undefined
        && !IsTerminalFamily(RequestedFamily, Font?.Family);
    const UnsupportedFontWeight: boolean = Props.fontWeight !== undefined
        && ![ "normal", "bold", 400, 700, "400", "700" ].includes(Props.fontWeight);
    const UnsupportedFontStyle: boolean = Props.fontStyle !== undefined
        && ![ "normal", "italic", "oblique" ].includes(String(Props.fontStyle));

    return Math.abs(FontSize - NormalSize) > 0.01
        || FamilyDiffers
        || Math.abs(LetterSpacing) > 0.01
        || Math.abs(WordSpacing) > 0.01
        || (Props.lineHeight !== undefined && Math.abs(LineHeight - NormalSize) > 0.01)
        || Math.abs(TextIndent) > 0.01
        || UnsupportedFontWeight
        || UnsupportedFontStyle
        || Props.fontFeatureSettings !== undefined
        || Props.fontKerning !== undefined
        || Props.fontOpticalSizing !== undefined
        || Props.fontSizeAdjust !== undefined
        || Props.fontStretch !== undefined
        || Props.fontVariant !== undefined
        || Props.fontVariationSettings !== undefined
        || Props.hyphens !== undefined
        || Props.lineBreak !== undefined
        || Props.overflowWrap !== undefined
        || Props.tabSize !== undefined
        || (Props.textAlign !== undefined && ![ "left", "start" ].includes(String(Props.textAlign)))
        || Props.textTransform !== undefined
        || Props.whiteSpace !== undefined
        || Props.wordBreak !== undefined;
};

const MayRequireSvg = (Props: TextProps): boolean =>
{
    return Props.fontFamily !== undefined
        || Props.fontSize !== undefined
        || Props.letterSpacing !== undefined
        || Props.lineHeight !== undefined
        || Props.wordSpacing !== undefined
        || Props.textIndent !== undefined
        || Props.fontFeatureSettings !== undefined
        || Props.fontKerning !== undefined
        || Props.fontOpticalSizing !== undefined
        || Props.fontSizeAdjust !== undefined
        || Props.fontStretch !== undefined
        || Props.fontVariant !== undefined
        || Props.fontVariationSettings !== undefined
        || Props.hyphens !== undefined
        || Props.lineBreak !== undefined
        || Props.overflowWrap !== undefined
        || Props.tabSize !== undefined
        || Props.textAlign !== undefined
        || Props.textTransform !== undefined
        || Props.whiteSpace !== undefined
        || Props.wordBreak !== undefined;
};

const GetLayoutProps = (Props: TextProps): LayoutProps =>
{
    const Values: LayoutProps = {
        alignContent: Props.alignContent,
        alignItems: Props.alignItems,
        alignSelf: Props.alignSelf,
        aspectRatio: Props.aspectRatio,
        bottom: Props.bottom,
        columnGap: Props.columnGap,
        display: Props.display,
        flexBasis: Props.flexBasis,
        flexDirection: Props.flexDirection,
        flexGrow: Props.flexGrow,
        flexShrink: Props.flexShrink,
        flexWrap: Props.flexWrap,
        gap: Props.gap,
        height: Props.height,
        justifyContent: Props.justifyContent,
        left: Props.left,
        margin: Props.margin,
        marginBottom: Props.marginBottom,
        marginLeft: Props.marginLeft,
        marginRight: Props.marginRight,
        marginTop: Props.marginTop,
        marginX: Props.marginX,
        marginY: Props.marginY,
        maxHeight: Props.maxHeight,
        maxWidth: Props.maxWidth,
        minHeight: Props.minHeight,
        minWidth: Props.minWidth,
        overflow: Props.overflow,
        overflowX: Props.overflowX,
        overflowY: Props.overflowY,
        padding: Props.padding,
        paddingBottom: Props.paddingBottom,
        paddingLeft: Props.paddingLeft,
        paddingRight: Props.paddingRight,
        paddingTop: Props.paddingTop,
        paddingX: Props.paddingX,
        paddingY: Props.paddingY,
        position: Props.position,
        right: Props.right,
        rowGap: Props.rowGap,
        top: Props.top,
        width: Props.width
    };
    return Object.fromEntries(
        Object.entries(Values).filter((Entry: [ string, unknown ]) => Entry[1] !== undefined)
    ) as LayoutProps;
};

const ToText = (Value: React.ReactNode): string | undefined =>
{
    if (Value === null || Value === undefined || typeof Value === "boolean")
    {
        return "";
    }
    if ([ "string", "number", "bigint" ].includes(typeof Value))
    {
        return String(Value);
    }
    if (Array.isArray(Value))
    {
        const Values: ReadonlyArray<string | undefined> = Value.map(ToText);
        return Values.includes(undefined) ? undefined : Values.join("");
    }
    if (React.isValidElement<{ readonly children?: React.ReactNode }>(Value)
        && Value.type === React.Fragment)
    {
        return ToText(Value.props.children);
    }
    return undefined;
};

const TransformPlainText = (
    Value: React.ReactNode,
    Transform: React.CSSProperties["textTransform"]
): React.ReactNode =>
{
    const TextValue: string | undefined = ToText(Value);
    if (TextValue === undefined || Transform === undefined)
    {
        return Value;
    }
    switch (Transform)
    {
        case "uppercase": return TextValue.toLocaleUpperCase();
        case "lowercase": return TextValue.toLocaleLowerCase();
        case "capitalize": return TextValue.replace(/\b\p{L}/gu, (Character: string) =>
            Character.toLocaleUpperCase());
        default: return Value;
    }
};

const ResolveInkWrap = (Props: TextProps): Ink.TextProps["wrap"] =>
{
    if (Props.wordBreak === "break-all" || Props.overflowWrap === "anywhere")
    {
        return "hard";
    }
    return Props.wrap;
};

const IsTerminalFamily = (Requested: string, Detected: string | undefined): boolean =>
{
    const Families: ReadonlyArray<string> = Requested.split(",").map(NormalizeFamily);
    const Preferred: string | undefined = Families[0];
    return Preferred === "monospace"
        || (Detected !== undefined && Preferred === NormalizeFamily(Detected));
};

const NormalizeFamily = (Value: string): string =>
{
    return Value.trim().replace(/^(["'])(.*)\1$/u, "$2").toLowerCase();
};

const IsBold = (Value: React.CSSProperties["fontWeight"]): boolean =>
{
    return Value === "bold" || Value === "bolder"
        || (typeof Value === "number" && Value >= 600)
        || (typeof Value === "string" && /^\d+$/u.test(Value) && Number(Value) >= 600);
};

const HasDecoration = (Props: TextProps, Value: string): boolean =>
{
    return String(Props.textDecorationLine ?? "").split(/\s+/u).includes(Value);
};

const TextDecoration = (Props: TextProps): string | undefined =>
{
    const Values: Array<string> = String(Props.textDecorationLine ?? "")
        .split(/\s+/u)
        .filter((Value: string) => Value.length > 0 && Value !== "none");
    if (Props.underline && !Values.includes("underline"))
    {
        Values.push("underline");
    }
    if (Props.strikethrough && !Values.includes("line-through"))
    {
        Values.push("line-through");
    }
    return Values.length === 0 ? undefined : Values.join(" ");
};

const NumericDimension = (Value: number | string | undefined): number | undefined =>
{
    return typeof Value === "number" && Number.isFinite(Value) && Value > 0 ? Value : undefined;
};

const GetHorizontalPadding = (Props: TextProps): number =>
{
    const Left: number = Props.paddingLeft ?? Props.paddingX ?? Props.padding ?? 0;
    const Right: number = Props.paddingRight ?? Props.paddingX ?? Props.padding ?? 0;
    return Math.max(0, Left) + Math.max(0, Right);
};

const ResolveTabSize = (Value: React.CSSProperties["tabSize"]): number | undefined =>
{
    if (typeof Value === "number")
    {
        return Number.isFinite(Value) ? Math.max(0, Value) : undefined;
    }
    if (typeof Value === "string" && /^\d+(?:\.\d+)?$/u.test(Value.trim()))
    {
        return Math.max(0, Number(Value));
    }
    return undefined;
};

const ToCssLength = (Value: unknown): CssLength | undefined =>
{
    return typeof Value === "number" || typeof Value === "string" ? Value : undefined;
};

const ToLineHeight = (Value: unknown): CssLength | "normal" | undefined =>
{
    return Value === "normal" || typeof Value === "number" || typeof Value === "string"
        ? Value
        : undefined;
};

const RgbToCss = (Value: RgbColor | undefined): string | undefined =>
{
    return Value === undefined ? undefined : `rgb(${ Value.Red }, ${ Value.Green }, ${ Value.Blue })`;
};

const ContrastColor = (Background: RgbColor | undefined): string =>
{
    if (Background === undefined)
    {
        return "#ffffff";
    }
    const Luminance: number = (Background.Red * 299 + Background.Green * 587
        + Background.Blue * 114) / 255_000;
    return Luminance > 0.5 ? "#000000" : "#ffffff";
};

const ResolveSvgColor = (Value: string | undefined): string | undefined =>
{
    if (Value === undefined)
    {
        return undefined;
    }
    const BrightColors: Readonly<Record<string, string>> = {
        blackBright: "#666666",
        blueBright: "#3b8eea",
        cyanBright: "#29b8db",
        greenBright: "#23d18b",
        magentaBright: "#d670d6",
        redBright: "#f14c4c",
        whiteBright: "#ffffff",
        yellowBright: "#f5f543"
    };
    const Bright: string | undefined = BrightColors[Value];
    if (Bright !== undefined)
    {
        return Bright;
    }
    const AnsiMatch: RegExpMatchArray | null = Value.match(/^ansi256\(\s*(\d+)\s*\)$/u);
    return AnsiMatch?.[1] === undefined ? Value : Ansi256Css(Number(AnsiMatch[1]));
};

const Ansi256Css = (Value: number): string =>
{
    const Levels: ReadonlyArray<number> = [ 0, 95, 135, 175, 215, 255 ];
    let Red: number;
    let Green: number;
    let Blue: number;

    if (Value >= 232)
    {
        Red = Green = Blue = 8 + (Math.min(255, Value) - 232) * 10;
    }
    else
    {
        const Index: number = Math.max(0, Value - 16);
        Red = Levels[Math.floor(Index / 36)] ?? 0;
        Green = Levels[Math.floor(Index % 36 / 6)] ?? 0;
        Blue = Levels[Index % 6] ?? 0;
    }
    return `rgb(${ Red }, ${ Green }, ${ Blue })`;
};
