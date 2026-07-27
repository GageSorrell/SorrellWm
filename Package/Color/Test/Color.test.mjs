/**
 * @file      Color.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Color from "../Distribution/Color.js";
import * as LinearColor from "../Distribution/LinearColor.js";
import { BigDecimal, Option } from "effect";
import { describe, it } from "node:test";
import Assert from "node:assert/strict";

const Unwrap = Option.getOrThrow;

describe("Color", () =>
{
    it("constructs, clamps, truncates, and identifies colors", () =>
    {
        const Value = Color.Color(-1, 127.9, 300n);
        Assert.deepEqual(Color.Format.Tuple(Value), [ 0, 127, 255 ]);
        Assert.equal(Color.IsColor(Value), true);
        Assert.equal(Color.IsColor({ B: 0, G: 0, R: 0 }), false);
        Assert.throws(() => Color.Color(Number.NaN, 0, 0), RangeError);
    });

    it("supports data-first and data-last channel updates", () =>
    {
        const Black = Color.Color(0, 0, 0);
        Assert.equal(Color.SetRed(Black, 12).R, 12);
        Assert.equal(Color.SetGreen(13)(Black).G, 13);
        Assert.equal(Color.SetBlue(14)(Black).B, 14);
    });

    it("parses and formats every supported representation", () =>
    {
        Assert.equal(Color.Format.Hex(Unwrap(Color.From.Hex("#f00"))), "#ff0000");
        Assert.equal(Color.Format.Hex(Unwrap(Color.From.Rgb("rgb(255, 0, 0)"))), "#ff0000");
        Assert.equal(Color.Format.Hex(Unwrap(Color.From.Hsl("hsl(120, 100%, 50%)"))), "#00ff00");
        Assert.equal(Color.Format.Hex(Unwrap(Color.From.Hsv("hsv(240, 100%, 100%)"))), "#0000ff");
        Assert.equal(Color.Format.Hex(Unwrap(Color.From.Hwb("hwb(120, 0%, 0%)"))), "#00ff00");
        Assert.equal(Color.Format.Hex(Unwrap(Color.From.Keyword("rebeccapurple"))), "#663399");
        Assert.equal(Color.Format.Hex(Unwrap(Color.From.Ansi16("ansi16(31)"))), "#800000");
        Assert.equal(Color.Format.Ansi256(Unwrap(Color.From.Ansi256("196"))), "ansi256(196)");
        Assert.equal(Color.Format.Keyword(Color.Color(255, 0, 0)), "red");
        Assert.equal(Color.Format.Hsv(Color.Color(255, 0, 0)), "hsv(0, 100%, 100%)");
        Assert.equal(Color.Format.Hwb(Color.Color(255, 0, 0)), "hwb(0, 0%, 0%)");
    });

    it("returns None for malformed or out-of-range input", () =>
    {
        Assert.equal(Option.isNone(Color.From.Hex("#xyz")), true);
        Assert.equal(Option.isNone(Color.From.Rgb("rgb(256, 0, 0)")), true);
        Assert.equal(Option.isNone(Color.From.Hsl("hsl(0, 101%, 50%)")), true);
        Assert.equal(Option.isNone(Color.From.Keyword("not-a-color")), true);
        Assert.equal(Option.isNone(Color.From.Ansi256("256")), true);
    });

    it("lightens and darkens without exceeding the channel range", () =>
    {
        Assert.equal(Color.Format.Hex(Color.Lighten(Color.Color(0, 0, 0), 0.5)), "#808080");
        Assert.equal(Color.Format.Hex(Color.Darken(0.5)(Color.Color(255, 255, 255))), "#808080");
        Assert.equal(Color.Format.Hex(Color.Lighten(Color.Color(255, 255, 255), 1)), "#ffffff");
    });
});

describe("LinearColor", () =>
{
    it("constructs, clamps, and identifies normalized colors", () =>
    {
        const Value = LinearColor.LinearColor(-1, 0.5, 2n);
        Assert.deepEqual(
            LinearColor.Format.Tuple(Value).map(BigDecimal.toNumberUnsafe),
            [ 0, 0.5, 1 ]
        );
        Assert.equal(LinearColor.IsLinearColor(Value), true);
    });

    it("round-trips all string representations", () =>
    {
        const Red = Unwrap(LinearColor.From.Keyword("red"));
        Assert.equal(LinearColor.Format.Hex(Red), "#ff0000");
        Assert.equal(LinearColor.Format.Rgb(Red), "rgb(255, 0, 0)");
        Assert.equal(LinearColor.Format.Hsl(Red), "hsl(0, 100%, 50%)");
        Assert.equal(LinearColor.Format.Hsv(Red), "hsv(0, 100%, 100%)");
        Assert.equal(LinearColor.Format.Hwb(Red), "hwb(0, 0%, 0%)");
        Assert.equal(LinearColor.Format.Keyword(Red), "red");
        Assert.equal(
            LinearColor.Format.Hex(Unwrap(LinearColor.From.Ansi256("ansi256(196)"))),
            "#ff0000"
        );
    });
});
