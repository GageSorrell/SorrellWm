/**
 * @file      RgbaColor.test.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as LinearColor from "../Distribution/LinearColor.js";
import * as RgbaColor from "../Distribution/RgbaColor.js";
import * as RgbColor from "../Distribution/RgbColor.js";
import { BigDecimal, Option } from "effect";
import { describe, it } from "node:test";
import Assert from "node:assert/strict";

const Unwrap = Option.getOrThrow;

describe("RgbaColor", () =>
{
    it("constructs, clamps, truncates, and identifies colors", () =>
    {
        const Value = RgbaColor.RgbaColor(-1, 127.9, 300n, 128);
        Assert.deepEqual(RgbaColor.Format.Tuple(Value), [ 0, 127, 255, 128 ]);
        Assert.equal(RgbaColor.IsRgbaColor(Value), true);
        Assert.equal(RgbaColor.IsRgbaColor({ A: 0, B: 0, G: 0, R: 0 }), false);
        Assert.throws(() => RgbaColor.RgbaColor(Number.NaN, 0, 0, 0), RangeError);
    });

    it("supports data-first and data-last channel updates", () =>
    {
        const Black = RgbaColor.RgbaColor(0, 0, 0, 255);
        Assert.equal(RgbaColor.SetRed(Black, 12).R, 12);
        Assert.equal(RgbaColor.SetGreen(13)(Black).G, 13);
        Assert.equal(RgbaColor.SetBlue(14)(Black).B, 14);
        Assert.equal(RgbaColor.SetAlpha(Black, 200).A, 200);
        Assert.equal(RgbaColor.SetAlpha(64)(Black).A, 64);
    });

    it("parses string representations as fully opaque", () =>
    {
        const Value = Unwrap(RgbaColor.From.Hex("#f00"));
        Assert.equal(Value.A, 255);
        Assert.equal(RgbaColor.Format.Hex(Value), "#ff0000");
        Assert.equal(Unwrap(RgbaColor.From.Rgb("rgb(255, 0, 0)")).A, 255);
        Assert.equal(Unwrap(RgbaColor.From.Keyword("rebeccapurple")).A, 255);
    });

    it("returns None for malformed or out-of-range input", () =>
    {
        Assert.equal(Option.isNone(RgbaColor.From.Hex("#xyz")), true);
        Assert.equal(Option.isNone(RgbaColor.From.Rgb("rgb(256, 0, 0)")), true);
    });

    it("preserves alpha when lightening and darkening", () =>
    {
        const HalfAlpha = RgbaColor.RgbaColor(0, 0, 0, 128);
        Assert.equal(RgbaColor.Lighten(HalfAlpha, 0.5).A, 128);
        Assert.equal(RgbaColor.Darken(HalfAlpha, 0.1).A, 128);
    });

    it("converts to and from an opaque RgbColor", () =>
    {
        const Rgb = RgbColor.RgbColor(10, 20, 30);
        const DefaultAlpha = RgbaColor.From.RgbColor(Rgb);
        Assert.deepEqual(RgbaColor.Format.Tuple(DefaultAlpha), [ 10, 20, 30, 255 ]);

        const ExplicitAlpha = RgbaColor.From.RgbColor(Rgb, 128);
        Assert.equal(ExplicitAlpha.A, 128);

        Assert.deepEqual(RgbColor.Format.Tuple(RgbaColor.To.RgbColor(ExplicitAlpha)), [ 10, 20, 30 ]);
    });

    it("converts to and from a LinearColor", () =>
    {
        const Linear = LinearColor.LinearColor(1, 0, 0.5, 0.5);
        const Rgba = RgbaColor.From.LinearColor(Linear);
        Assert.deepEqual(RgbaColor.Format.Tuple(Rgba), [ 255, 0, 127, 127 ]);

        const RoundTripped = RgbaColor.To.LinearColor(Rgba);
        Assert.equal(BigDecimal.toNumberUnsafe(RoundTripped.R), 1);
        Assert.equal(BigDecimal.toNumberUnsafe(RoundTripped.G), 0);
        Assert.ok(Math.abs(BigDecimal.toNumberUnsafe(RoundTripped.A) - 127 / 255) < 0.01);
    });
});
