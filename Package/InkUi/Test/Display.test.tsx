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

import { render } from "ink-testing-library";
import { describe, expect, it } from "vitest";
import {
    Display,
    DisplayFontFamilies,
    GetDisplayFont,
    RenderDisplayText
} from "../Source/Display/index.js";

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
});
