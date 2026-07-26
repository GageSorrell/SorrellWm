/**
 * Text component tests.
 *
 * @module @sorrell/ink-ui/Test/Text
 *
 * @file      Text.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import { GetDefaultFontFamily, Text } from "../Source/Text.js";
import {
    LayoutTextSvg,
    ParseFontSize,
    ParseLineHeight,
    type TextSvgStyle
} from "../Source/Text/Layout.js";

const Style: TextSvgStyle = {
    Color: "#ffffff",
    FontFamily: "monospace",
    FontSize: 16,
    FontWeight: "normal",
    LetterSpacing: 0,
    LineHeight: 20,
    Opacity: 1,
    TextAlign: "left",
    TextIndent: 0,
    WordSpacing: 0
};

describe("Text", () =>
{
    it("renders ordinary text through Ink", () =>
    {
        expect(render(<Text>Hello</Text>).lastFrame()).toBe("Hello");
    });

    it("falls back to readable Ink text when Sixel is unavailable", () =>
    {
        expect(render(
            <Text fontFamily="Georgia"
                fontSize="2em"
                letterSpacing="0.1em">
                Enlarged
            </Text>
        ).lastFrame()).toBe("Enlarged");
    });

    it("uses sensible platform font fallbacks", () =>
    {
        expect(GetDefaultFontFamily("win32")).toContain("Cascadia Mono");
        expect(GetDefaultFontFamily("darwin")).toContain("Menlo");
        expect(GetDefaultFontFamily("linux")).toContain("DejaVu Sans Mono");
    });
});

describe("Text CSS sizing", () =>
{
    it("parses web font-size keywords, relative lengths, and points", () =>
    {
        expect(ParseFontSize("medium", 16)).toBe(16);
        expect(ParseFontSize("2em", 16)).toBe(32);
        expect(ParseFontSize("150%", 16)).toBe(24);
        expect(ParseFontSize("12pt", 16)).toBe(16);
        expect(ParseFontSize(24, 16)).toBe(24);
    });

    it("treats unitless line-height as a font-size multiplier", () =>
    {
        expect(ParseLineHeight(1.5, {
            FontSize: 20,
            RootFontSize: 16,
            ViewportHeight: 800,
            ViewportWidth: 1200
        })).toBe(30);
    });
});

describe("Text SVG layout", () =>
{
    it("wraps words to the available pixel width", () =>
    {
        const Natural = LayoutTextSvg({
            Style,
            Text: "alpha bravo charlie",
            Wrap: {
                Hyphens: undefined,
                LineBreak: undefined,
                OverflowWrap: undefined,
                TabSize: undefined,
                WhiteSpace: undefined,
                WordBreak: undefined
            }
        });
        const Wrapped = LayoutTextSvg({
            MaxWidth: Natural.Width / 2,
            Style,
            Text: "alpha bravo charlie",
            Wrap: {
                Hyphens: undefined,
                LineBreak: undefined,
                OverflowWrap: undefined,
                TabSize: undefined,
                WhiteSpace: undefined,
                WordBreak: undefined
            }
        });

        expect(Wrapped.Lines.length).toBeGreaterThan(1);
        expect(Wrapped.Width).toBeLessThan(Natural.Width);
        expect(Wrapped.Svg).toContain("<text");
    });

    it("honors preformatted newlines and break-all", () =>
    {
        const Preformatted = LayoutTextSvg({
            Style,
            Text: "one\n  two",
            Wrap: {
                Hyphens: undefined,
                LineBreak: undefined,
                OverflowWrap: undefined,
                TabSize: undefined,
                WhiteSpace: "pre",
                WordBreak: undefined
            }
        });
        const Broken = LayoutTextSvg({
            MaxWidth: 24,
            Style,
            Text: "abcdefgh",
            Wrap: {
                Hyphens: undefined,
                LineBreak: undefined,
                OverflowWrap: undefined,
                TabSize: undefined,
                WhiteSpace: "normal",
                WordBreak: "break-all"
            }
        });

        expect(Preformatted.Lines).toEqual([ "one", "  two" ]);
        expect(Broken.Lines.length).toBeGreaterThan(1);
    });

    it("rounds intrinsic image dimensions to whole terminal cells", () =>
    {
        const Layout = LayoutTextSvg({
            CellHeight: 20,
            CellWidth: 10,
            Style,
            Text: "cell aligned",
            Wrap: {
                Hyphens: undefined,
                LineBreak: undefined,
                OverflowWrap: undefined,
                TabSize: undefined,
                WhiteSpace: undefined,
                WordBreak: undefined
            }
        });

        expect(Layout.Width % 10).toBe(0);
        expect(Layout.Height % 20).toBe(0);
    });
});
