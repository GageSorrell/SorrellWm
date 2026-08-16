/**
 * @file      Contrast.test.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Contrast from "../Distribution/Contrast.js";
import * as RgbColor from "../Distribution/RgbColor.js";
import { describe, it } from "node:test";
import Assert from "node:assert/strict";

describe("Contrast", () =>
{
    it("computes relative luminance for black and white", () =>
    {
        Assert.equal(Contrast.RelativeLuminance(RgbColor.RgbColor(0, 0, 0)), 0);
        Assert.equal(Contrast.RelativeLuminance(RgbColor.RgbColor(255, 255, 255)), 1);
    });

    it("computes the maximum WCAG contrast ratio between black and white", () =>
    {
        const Ratio = Contrast.ContrastRatio(
            RgbColor.RgbColor(0, 0, 0),
            RgbColor.RgbColor(255, 255, 255)
        );
        Assert.ok(Math.abs(Ratio - 21) < 0.001);
    });

    it("is symmetric and returns 1 for identical colors", () =>
    {
        const Gray = RgbColor.RgbColor(128, 128, 128);
        const White = RgbColor.RgbColor(255, 255, 255);
        Assert.equal(Contrast.ContrastRatio(Gray, Gray), 1);
        Assert.equal(
            Contrast.ContrastRatio(Gray, White),
            Contrast.ContrastRatio(White, Gray)
        );
    });

    it("leaves a color unchanged when it already meets the minimum ratio", () =>
    {
        const Black = RgbColor.RgbColor(0, 0, 0);
        const White = RgbColor.RgbColor(255, 255, 255);
        const Result = Contrast.EnsureContrast(Black, White, 10);
        Assert.deepEqual(RgbColor.Format.Tuple(Result), RgbColor.Format.Tuple(Black));
    });

    it("darkens a color against a light background to reach the minimum ratio", () =>
    {
        const White = RgbColor.RgbColor(255, 255, 255);
        const LightGray = RgbColor.RgbColor(220, 220, 220);
        Assert.ok(Contrast.ContrastRatio(LightGray, White) < 4);

        const Result = Contrast.EnsureContrast(LightGray, White, 4);
        Assert.ok(Contrast.ContrastRatio(Result, White) >= 4);
    });

    it("lightens a color against a dark background to reach the minimum ratio", () =>
    {
        const Black = RgbColor.RgbColor(0, 0, 0);
        const DarkGray = RgbColor.RgbColor(30, 30, 30);
        Assert.ok(Contrast.ContrastRatio(DarkGray, Black) < 4);

        const Result = Contrast.EnsureContrast(DarkGray, Black, 4);
        Assert.ok(Contrast.ContrastRatio(Result, Black) >= 4);
    });
});
