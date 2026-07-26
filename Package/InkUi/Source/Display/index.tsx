/**
 * ASCII-art display text rendered with bit's bitmap font catalog.
 *
 * @module @sorrell/ink-ui/Display
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import {
    DefaultDisplayFontFamily,
    type DisplayFontFamily
} from "./Fonts.generated.js";
import {
    type DisplayFontScale,
    type DisplayShadowOffset,
    type DisplayShadowStyle,
    type DisplayTextAlign,
    RenderDisplayText
} from "./Render.js";

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

type DisplayLayoutProps = {
    readonly [Key in LayoutPropKeys]?: Ink.BoxProps[Key] | undefined
};

type DisplayInkTextProps = Omit<Ink.TextProps, "children">;

/** Props for {@link Display}. */
export type DisplayProps = DisplayInkTextProps & DisplayLayoutProps & {
    /** Text rendered through the selected bitmap font. */
    readonly children: string;
    /** Additional blank cells between glyphs. Matches bit's 0–10 range. */
    readonly characterSpacing?: number;
    /** One of the 125 bitmap fonts bundled by bit. */
    readonly fontFamily?: DisplayFontFamily;
    /** Bitmap scale offered by bit: half, normal, double, or quadruple. */
    readonly fontScale?: DisplayFontScale;
    /** Additional blank rows between explicit input lines. Matches bit's 0–10 range. */
    readonly lineSpacing?: number;
    /** Enable bit's shaded-cell drop shadow. */
    readonly shadow?: boolean;
    /** Horizontal shadow offset, from -5 through 5 cells. */
    readonly shadowHorizontalOffset?: DisplayShadowOffset;
    /** Light, medium, or dark shaded-cell shadow. Numeric bit values are also accepted. */
    readonly shadowStyle?: DisplayShadowStyle;
    /** Vertical shadow offset, from -5 through 5 cells. */
    readonly shadowVerticalOffset?: DisplayShadowOffset;
    /** Align separate input lines to the widest rendered line. */
    readonly textAlign?: DisplayTextAlign;
    /** Additional cells at word boundaries. Matches bit's 0–20 range. */
    readonly wordSpacing?: number;
};

/**
 * Render a string as terminal-native bitmap display text.
 *
 * The font and scale establish intrinsic dimensions. As with preformatted web
 * content, explicit CSS-like size props constrain the outer box rather than
 * mutating the font scale. Overflow remains visible unless hidden explicitly.
 */
export function Display(Props: DisplayProps): React.ReactElement | null
{
    const FontFamily: DisplayFontFamily = Props.fontFamily ?? DefaultDisplayFontFamily;
    const Lines: ReadonlyArray<string> = React.useMemo(() => RenderDisplayText(
        Props.children,
        {
            CharacterSpacing: Props.characterSpacing,
            FontFamily,
            FontScale: Props.fontScale,
            LineSpacing: Props.lineSpacing,
            Shadow: Props.shadow,
            ShadowHorizontalOffset: Props.shadowHorizontalOffset,
            ShadowStyle: Props.shadowStyle,
            ShadowVerticalOffset: Props.shadowVerticalOffset,
            TextAlign: Props.textAlign,
            WordSpacing: Props.wordSpacing
        }
    ), [
        FontFamily,
        Props.characterSpacing,
        Props.children,
        Props.fontScale,
        Props.lineSpacing,
        Props.shadow,
        Props.shadowHorizontalOffset,
        Props.shadowStyle,
        Props.shadowVerticalOffset,
        Props.textAlign,
        Props.wordSpacing
    ]);
    const Width: number = Math.max(0, ...Lines.map((Line: string) => Array.from(Line).length));
    const Height: number = Lines.length;
    const Content: string = Lines.join("\n");

    if (Props.children.length === 0 || Lines.length === 0) {return null;}

    return (
        <Ink.Box
            { ...GetLayoutProps(Props) }
            aria-label={ Props["aria-label"] ?? Props.children }
            { ...(Props["aria-hidden"] === undefined
                ? { }
                : { "aria-hidden": Props["aria-hidden"] }) }>
            <Ink.Box
                flexShrink={ 0 }
                height={ Height }
                width={ Width }>
                <Ink.Text
                    aria-hidden={ true }
                    { ...(Props.backgroundColor === undefined
                        ? { }
                        : { backgroundColor: Props.backgroundColor }) }
                    bold={ Props.bold ?? false }
                    { ...(Props.color === undefined ? { } : { color: Props.color }) }
                    dimColor={ Props.dimColor ?? false }
                    inverse={ Props.inverse ?? false }
                    italic={ Props.italic ?? false }
                    strikethrough={ Props.strikethrough ?? false }
                    underline={ Props.underline ?? false }
                    wrap={ Props.wrap ?? "hard" }>
                    { Content }
                </Ink.Text>
            </Ink.Box>
        </Ink.Box>
    );
}

function GetLayoutProps(Props: DisplayProps): DisplayLayoutProps
{
    const Values: DisplayLayoutProps = {
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
    return Object.fromEntries(Object.entries(Values)
        .filter((Entry: [string, unknown]) => Entry[1] !== undefined)) as DisplayLayoutProps;
}

export {
    DefaultDisplayFontFamily,
    DisplayFontFamilies,
    GetDisplayFont,
    type DisplayFont,
    type DisplayFontFamily
} from "./Fonts.generated.js";
export {
    type DisplayFontScale,
    type DisplayShadowOffset,
    type DisplayShadowStyle,
    type DisplayTextAlign,
    RenderDisplayText,
    type RenderDisplayOptions
} from "./Render.js";
