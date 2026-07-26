/**
 * Display component tests.
 *
 * @module @sorrell/ink-ui/Test/Display
 *
 * @file      Display.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Display,
    DisplayFontFamilies,
    GetDisplayFont,
    RenderDisplayText
} from "../Source/Display/index.js";
import * as Ink from "ink";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "ink-testing-library";

describe("Display font catalog", () =>
{
    it("embeds every font offered by bit with its metadata", () =>
    {
        expect(DisplayFontFamilies).toHaveLength(125);
        expect(DisplayFontFamilies).toContain("ithaca");
        expect(DisplayFontFamilies).toContain("unsciithin");
        expect(GetDisplayFont("ithaca")).toMatchObject({
            Author: "GGBotNet",
            License: "OFL-1.1",
            Name: "ithaca"
        });
    });
});

describe("Display renderer", () =>
{
    it("matches bit's normal-scale ithaca rendering", () =>
    {
        expect(RenderDisplayText("Hi", { FontFamily: "ithaca" })).toEqual([
            "████  ████    ████  ",
            "████  ████          ",
            "████  ████  ██████  ",
            "████  ████    ████  ",
            "██████████    ████  ",
            "████  ████    ████  ",
            "████  ████    ████  ",
            "████  ████    ████  ",
            "████  ████  ████████"
        ]);
    });

    it("supports bit's scale and shadow values", () =>
    {
        const Normal = RenderDisplayText("A", { FontFamily: "ithaca" });
        const Double = RenderDisplayText("A", { FontFamily: "ithaca", FontScale: 2 });
        const Shadowed = RenderDisplayText("A", {
            FontFamily: "ithaca",
            Shadow: true,
            ShadowHorizontalOffset: 2,
            ShadowStyle: "dark",
            ShadowVerticalOffset: 1
        });

        expect(Double.length).toBeGreaterThan(Normal.length);
        expect(Math.max(...Double.map((Line) => Line.length)))
            .toBeGreaterThan(Math.max(...Normal.map((Line) => Line.length)));
        expect(Shadowed.join("\n")).toContain("▓");
        expect(Shadowed.length).toBe(Normal.length + 1);
    });
});

describe("Display component", () =>
{
    it("renders bitmap text through Ink", () =>
    {
        const Frame: string = render(
            <Display fontFamily="ithaca">Hi</Display>
        ).lastFrame() ?? "";

        expect(Frame).toContain("████  ████    ████");
        expect(Frame.split("\n")).toHaveLength(9);
    });

    it("lets an explicit box clip intrinsic art without changing font scale", () =>
    {
        const Natural: string = render(
            <Display fontFamily="ithaca">Hi</Display>
        ).lastFrame() ?? "";
        const Clipped: string = render(
            <Display fontFamily="ithaca"
                overflowX="hidden"
                width={ 10 }>
                Hi
            </Display>
        ).lastFrame() ?? "";

        expect(Natural.split("\n")[0]?.length).toBe(18);
        expect(Clipped.split("\n").every((Line) => Line.length <= 10)).toBe(true);
        expect(Clipped).toContain("████  ████");
    });

    it("keeps every bitmap row in layout instead of reflowing terminal glyphs", () =>
    {
        const Art: ReadonlyArray<string> = RenderDisplayText("Hi", { FontFamily: "ithaca" });
        const Frame: string = render(
            <Ink.Box flexDirection="column">
                <Ink.Text>before</Ink.Text>
                <Display fontFamily="ithaca">Hi</Display>
                <Ink.Text>after</Ink.Text>
            </Ink.Box>
        ).lastFrame() ?? "";
        const Rows: ReadonlyArray<string> = Frame.split("\n");

        expect(Rows).toHaveLength(Art.length + 2);
        expect(Rows[0]).toBe("before");
        expect(Rows.at(-1)).toBe("after");
        expect(Rows.slice(1, -1)).toEqual(Art.map((Line: string) => Line.trimEnd()));
    });

    it("preserves intrinsic height when a flex parent is shorter", () =>
    {
        const Art: ReadonlyArray<string> = RenderDisplayText(
            "INK UI",
            { FontFamily: "tinyunicode" }
        );
        const Reference = React.createRef<Ink.DOMElement>();
        const Frame: string = render(
            <Ink.Box height={ 3 }>
                <Display fontFamily="tinyunicode"
                    ref={ Reference }>INK UI</Display>
            </Ink.Box>
        ).lastFrame() ?? "";

        expect(Art.length).toBeGreaterThan(3);
        expect(Frame.split("\n")).toHaveLength(3);
        expect(Reference.current).not.toBeNull();
        expect(Ink.measureElement(Reference.current!).height).toBe(Art.length);
    });

    it("clips wide art before the physical terminal can wrap it", () =>
    {
        const Frame: string = render(
            <Display fontFamily="8bitfortress">
                THIS DISPLAY IS WIDER THAN THE TEST TERMINAL
            </Display>
        ).lastFrame() ?? "";

        expect(Frame.split("\n").every((Line: string) => Array.from(Line).length <= 100)).toBe(true);
        expect(Frame.split("\n")).toHaveLength(6);
    });
});
