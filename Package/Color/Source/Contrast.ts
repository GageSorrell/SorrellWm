/**
 * WCAG relative luminance and contrast ratio, and adjusting a color's lightness to
 * guarantee a minimum contrast against a background.
 *
 * @module @sorrell/color/Contrast
 *
 * @file      Contrast.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Darken, Lighten, type RgbColor } from "./RgbColor.js";

export/**
       * The maximum number of lightness-search steps taken by {@link EnsureContrast}.
       *
       * @category Constant
       * @since 1.1.0
       */
const MaxSearchIterations = 24 as const;

export/**
       * The relative luminance at which black and white text reach equal WCAG contrast
       * against a background of that luminance. Backgrounds above this favor darkening a
       * foreground color for maximum contrast headroom; backgrounds below it favor
       * lightening.
       *
       * @category Constant
       * @since 1.1.0
       */
const EqualContrastLuminance = 0.1791 as const;

const Linearize = (Channel: number): number =>
{
    const Normalized = Channel / 255;
    return Normalized <= 0.04045
        ? Normalized / 12.92
        : ((Normalized + 0.055) / 1.055) ** 2.4;
};

export/**
       * The WCAG relative luminance of a color, from `0` (black) to `1` (white).
       *
       * @category Contrast
       * @since 1.1.0
       */
const RelativeLuminance = (Self: RgbColor): number =>
    0.2126 * Linearize(Self.R) +
    0.7152 * Linearize(Self.G) +
    0.0722 * Linearize(Self.B);

export/**
       * The WCAG contrast ratio between two colors, from `1` (no contrast) to `21`
       * (black against white).
       *
       * @category Contrast
       * @since 1.1.0
       */
const ContrastRatio = (Left: RgbColor, Right: RgbColor): number =>
{
    const LeftLuminance = RelativeLuminance(Left) + 0.05;
    const RightLuminance = RelativeLuminance(Right) + 0.05;
    return LeftLuminance > RightLuminance
        ? LeftLuminance / RightLuminance
        : RightLuminance / LeftLuminance;
};

export/**
       * Adjust a color's HSL lightness, moving it toward black or white (whichever
       * gives more contrast headroom against `Background`), until its WCAG contrast
       * ratio against `Background` reaches at least `MinimumRatio`. Returns `Self`
       * unchanged when it already meets `MinimumRatio`.
       *
       * @category Contrast
       * @since 1.1.0
       */
const EnsureContrast = (
    Self: RgbColor,
    Background: RgbColor,
    MinimumRatio: number
): RgbColor =>
{
    if (ContrastRatio(Self, Background) >= MinimumRatio)
    {
        return Self;
    }

    const Adjust = RelativeLuminance(Background) > EqualContrastLuminance
        ? Darken
        : Lighten;

    let Low = 0;
    let High = 1;
    let Best = Adjust(Self, High);

    if (ContrastRatio(Best, Background) < MinimumRatio)
    {
        return Best;
    }

    for (let Iteration = 0; Iteration < MaxSearchIterations; Iteration += 1)
    {
        const Mid = (Low + High) / 2;
        const Candidate = Adjust(Self, Mid);

        if (ContrastRatio(Candidate, Background) >= MinimumRatio)
        {
            Best = Candidate;
            High = Mid;
        }
        else
        {
            Low = Mid;
        }
    }

    return Best;
};
