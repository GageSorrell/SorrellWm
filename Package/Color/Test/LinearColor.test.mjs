/**
 * @file      LinearColor.test.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as LinearColor from "../Distribution/LinearColor.js";
import { BigDecimal, Option } from "effect";
import { describe, it } from "node:test";
import Assert from "node:assert/strict";

const Unwrap = Option.getOrThrow;

describe("LinearColor", () =>
{
    it("constructs, clamps, and identifies normalized colors", () =>
    {
        const Value = LinearColor.LinearColor(-1, 0.5, 2n);
        Assert.deepEqual(
            LinearColor.Format.Tuple(Value).map(BigDecimal.toNumberUnsafe),
            [ 0, 0.5, 1, 1 ]
        );
        Assert.equal(LinearColor.IsLinearColor(Value), true);
    });

    it("defaults alpha to fully opaque when not specified", () =>
    {
        const Value = LinearColor.LinearColor(0.5, 0.5, 0.5);
        Assert.equal(BigDecimal.toNumberUnsafe(Value.A), 1);
    });

    it("accepts and clamps an explicit alpha channel", () =>
    {
        const Value = LinearColor.LinearColor(0, 0, 0, 1.5);
        Assert.equal(BigDecimal.toNumberUnsafe(Value.A), 1);
        Assert.equal(BigDecimal.toNumberUnsafe(LinearColor.LinearColor(0, 0, 0, -1).A), 0);
    });

    it("supports data-first and data-last alpha updates", () =>
    {
        const Opaque = LinearColor.LinearColor(0, 0, 0);
        Assert.equal(BigDecimal.toNumberUnsafe(LinearColor.SetAlpha(Opaque, 0.25).A), 0.25);
        Assert.equal(BigDecimal.toNumberUnsafe(LinearColor.SetAlpha(0.5)(Opaque).A), 0.5);
    });

    it("preserves alpha when lightening and darkening", () =>
    {
        const HalfAlpha = LinearColor.LinearColor(0, 0, 0, 0.5);
        Assert.equal(BigDecimal.toNumberUnsafe(LinearColor.Lighten(HalfAlpha, 0.5).A), 0.5);
        Assert.equal(BigDecimal.toNumberUnsafe(LinearColor.Darken(HalfAlpha, 0.1).A), 0.5);
    });

    it("round-trips all string representations, defaulting to fully opaque", () =>
    {
        const Red = Unwrap(LinearColor.From.Keyword("red"));
        Assert.equal(LinearColor.Format.Hex(Red), "#ff0000");
        Assert.equal(LinearColor.Format.Rgb(Red), "rgb(255, 0, 0)");
        Assert.equal(LinearColor.Format.Hsl(Red), "hsl(0, 100%, 50%)");
        Assert.equal(LinearColor.Format.Hsv(Red), "hsv(0, 100%, 100%)");
        Assert.equal(LinearColor.Format.Hwb(Red), "hwb(0, 0%, 0%)");
        Assert.equal(LinearColor.Format.Keyword(Red), "red");
        Assert.equal(BigDecimal.toNumberUnsafe(Red.A), 1);
        Assert.equal(
            LinearColor.Format.Hex(Unwrap(LinearColor.From.Ansi256("ansi256(196)"))),
            "#ff0000"
        );
    });

    it("constructs from a tuple or record, with an optional alpha", () =>
    {
        Assert.equal(
            BigDecimal.toNumberUnsafe(LinearColor.From.Tuple([ 1, 1, 1 ]).A),
            1
        );
        Assert.equal(
            BigDecimal.toNumberUnsafe(LinearColor.From.Tuple([ 1, 1, 1, 0.5 ]).A),
            0.5
        );
        Assert.equal(
            BigDecimal.toNumberUnsafe(LinearColor.From.Record({ R: 1, G: 1, B: 1 }).A),
            1
        );
        Assert.equal(
            BigDecimal.toNumberUnsafe(LinearColor.From.Record({ R: 1, G: 1, B: 1, A: 0.25 }).A),
            0.25
        );
    });
});
