/**
 * @module @sorrell/wm/Test/DirectionalPad
 *
 * @file      DirectionalPad.Test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    AcrylicBaseColorHex,
    ContrastMargin,
    GetTintedFill,
    InactiveForegroundColorHex
} from "../../Source/Renderer/DirectionalPad.tsx";
import { Color, Contrast } from "@sorrell/color";
import { describe, expect, it } from "vitest";
import { ColorScheme } from "../../Source/Shared/Theme.ts";
import { Option } from "effect";

const Unwrap = Option.getOrThrow;

describe("DirectionalPad.GetTintedFill", () =>
{
    it.each([ ColorScheme.Dark, ColorScheme.Light ])(
        "leaves a tint unchanged when it already has enough contrast (%s)",
        (Scheme: ColorScheme) =>
        {
            const Background = Unwrap(Color.From.Hex(AcrylicBaseColorHex[ Scheme ]));
            const HighContrastTint = Scheme === ColorScheme.Dark
                ? "rgb(255, 255, 255)"
                : "rgb(0, 0, 0)";

            const Fill = GetTintedFill(HighContrastTint, 0, Scheme);
            const FillColor = Unwrap(Color.From.Hex(Fill));

            expect(Fill).toBe(HighContrastTint === "rgb(255, 255, 255)" ? "#ffffff" : "#000000");
            expect(Contrast.ContrastRatio(FillColor, Background)).toBeGreaterThan(4);
        }
    );

    it.each([ ColorScheme.Dark, ColorScheme.Light ])(
        "raises a low-contrast tint to at least the baseline contrast, with margin (%s)",
        (Scheme: ColorScheme) =>
        {
            const Background = Unwrap(Color.From.Hex(AcrylicBaseColorHex[ Scheme ]));
            const Inactive = Unwrap(Color.From.Hex(InactiveForegroundColorHex[ Scheme ]));
            const BaselineRatio = Contrast.ContrastRatio(Inactive, Background);

            // A tint nearly identical to the acrylic background has almost no
            // contrast against it before adjustment.
            const LowContrastTint = AcrylicBaseColorHex[ Scheme ];
            const RawFillColor = Unwrap(Color.From.Hex(LowContrastTint));
            expect(Contrast.ContrastRatio(RawFillColor, Background)).toBeLessThan(BaselineRatio);

            const Fill = GetTintedFill(LowContrastTint, 67, Scheme);
            const FillColor = Unwrap(Color.From.Hex(Fill));

            expect(Contrast.ContrastRatio(FillColor, Background))
                .toBeGreaterThanOrEqual(BaselineRatio * ContrastMargin - 0.001);
        }
    );

    it("falls back to the disabled-gray color when the tint cannot be parsed", () =>
    {
        const Fill = GetTintedFill("not-a-color", 0, ColorScheme.Dark);
        expect(Fill).toBe(InactiveForegroundColorHex[ ColorScheme.Dark ]);
    });
});
