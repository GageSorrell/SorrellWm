/**
 * @file      RgbColor.test.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as RgbColor from "../Distribution/RgbColor.js";
import { Option } from "effect";
import { describe, it } from "node:test";
import Assert from "node:assert/strict";

const Unwrap = Option.getOrThrow;

describe("RgbColor", () =>
{
    it("constructs, clamps, truncates, and identifies colors", () =>
    {
        const Value = RgbColor.RgbColor(-1, 127.9, 300n);
        Assert.deepEqual(RgbColor.Format.Tuple(Value), [ 0, 127, 255 ]);
        Assert.equal(RgbColor.IsRgbColor(Value), true);
        Assert.equal(RgbColor.IsRgbColor({ B: 0, G: 0, R: 0 }), false);
        Assert.throws(() => RgbColor.RgbColor(Number.NaN, 0, 0), RangeError);
    });

    it("supports data-first and data-last channel updates", () =>
    {
        const Black = RgbColor.RgbColor(0, 0, 0);
        Assert.equal(RgbColor.SetRed(Black, 12).R, 12);
        Assert.equal(RgbColor.SetGreen(13)(Black).G, 13);
        Assert.equal(RgbColor.SetBlue(14)(Black).B, 14);
    });

    it("parses and formats every supported representation", () =>
    {
        Assert.equal(RgbColor.Format.Hex(Unwrap(RgbColor.From.Hex("#f00"))), "#ff0000");
        Assert.equal(RgbColor.Format.Hex(Unwrap(RgbColor.From.Rgb("rgb(255, 0, 0)"))), "#ff0000");
        Assert.equal(RgbColor.Format.Hex(Unwrap(RgbColor.From.Hsl("hsl(120, 100%, 50%)"))), "#00ff00");
        Assert.equal(RgbColor.Format.Hex(Unwrap(RgbColor.From.Hsv("hsv(240, 100%, 100%)"))), "#0000ff");
        Assert.equal(RgbColor.Format.Hex(Unwrap(RgbColor.From.Hwb("hwb(120, 0%, 0%)"))), "#00ff00");
        Assert.equal(RgbColor.Format.Hex(Unwrap(RgbColor.From.Keyword("rebeccapurple"))), "#663399");
        Assert.equal(RgbColor.Format.Hex(Unwrap(RgbColor.From.Ansi16("ansi16(31)"))), "#800000");
        Assert.equal(RgbColor.Format.Ansi256(Unwrap(RgbColor.From.Ansi256("196"))), "ansi256(196)");
        Assert.equal(RgbColor.Format.Keyword(RgbColor.RgbColor(255, 0, 0)), "red");
        Assert.equal(RgbColor.Format.Hsv(RgbColor.RgbColor(255, 0, 0)), "hsv(0, 100%, 100%)");
        Assert.equal(RgbColor.Format.Hwb(RgbColor.RgbColor(255, 0, 0)), "hwb(0, 0%, 0%)");
    });

    it("returns None for malformed or out-of-range input", () =>
    {
        Assert.equal(Option.isNone(RgbColor.From.Hex("#xyz")), true);
        Assert.equal(Option.isNone(RgbColor.From.Rgb("rgb(256, 0, 0)")), true);
        Assert.equal(Option.isNone(RgbColor.From.Hsl("hsl(0, 101%, 50%)")), true);
        Assert.equal(Option.isNone(RgbColor.From.Keyword("not-a-color")), true);
        Assert.equal(Option.isNone(RgbColor.From.Ansi256("256")), true);
    });

    it("lightens and darkens without exceeding the channel range", () =>
    {
        Assert.equal(RgbColor.Format.Hex(RgbColor.Lighten(RgbColor.RgbColor(0, 0, 0), 0.5)), "#808080");
        Assert.equal(RgbColor.Format.Hex(RgbColor.Darken(0.5)(RgbColor.RgbColor(255, 255, 255))), "#808080");
        Assert.equal(RgbColor.Format.Hex(RgbColor.Lighten(RgbColor.RgbColor(255, 255, 255), 1)), "#ffffff");
    });
});
