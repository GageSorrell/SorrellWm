/**
 * Build Fluent UI themes from renderer-safe application theme data.
 *
 * @module @sorrell/wm/Renderer/Theme
 *
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { AccentColor, RendererTheme } from "../../Shared/Theme.js";
import {
    type BrandVariants,
    type Theme,
    createDarkTheme,
    createLightTheme,
    webDarkTheme,
    webLightTheme
} from "@fluentui/react-components";
import { ColorScheme } from "../../Shared/Theme.js";

interface RgbColor
{
    readonly Blue: number;
    readonly Green: number;
    readonly Red: number;
}

const ParseHexColor = (Value: AccentColor): RgbColor => ({
    Blue: Number.parseInt(Value.slice(5, 7), 16),
    Green: Number.parseInt(Value.slice(3, 5), 16),
    Red: Number.parseInt(Value.slice(1, 3), 16)
});

const FormatChannel = (Value: number): string =>
    Math.round(Value).toString(16).padStart(2, "0");

const MixColor = (Color: RgbColor, Target: number, TargetWeight: number): string =>
{
    const MixChannel = (Value: number): number =>
        Value + ((Target - Value) * TargetWeight);

    return `#${ FormatChannel(MixChannel(Color.Red)) }${
        FormatChannel(MixChannel(Color.Green)) }${
        FormatChannel(MixChannel(Color.Blue)) }`;
};

export/** Create the sixteen Fluent UI brand variants centered on a Windows accent color. */
const CreateBrandVariants = (AccentColorValue: AccentColor): BrandVariants =>
{
    const Color: RgbColor = ParseHexColor(AccentColorValue);

    /* The numeric brand steps are deliberately presented in their visual order. */
    const Brand: BrandVariants =
        {
            10: MixColor(Color, 0, 0.84),
            20: MixColor(Color, 0, 0.72),
            30: MixColor(Color, 0, 0.60),
            40: MixColor(Color, 0, 0.48),
            50: MixColor(Color, 0, 0.36),
            60: MixColor(Color, 0, 0.24),
            70: MixColor(Color, 0, 0.12),
            80: MixColor(Color, 0, 0),
            90: MixColor(Color, 255, 0.12),

            100: MixColor(Color, 255, 0.24),
            110: MixColor(Color, 255, 0.36),
            120: MixColor(Color, 255, 0.48),
            130: MixColor(Color, 255, 0.60),
            140: MixColor(Color, 255, 0.70),
            150: MixColor(Color, 255, 0.80),
            160: MixColor(Color, 255, 0.90)
        };

    return Brand;
};

export/** Create the Fluent UI theme represented by a renderer theme snapshot. */
const CreateFluentTheme = (RendererThemeValue: RendererTheme): Theme =>
{
    if (RendererThemeValue.AccentColor === null)
    {
        return RendererThemeValue.ColorScheme === ColorScheme.Dark
            ? webDarkTheme
            : webLightTheme;
    }

    const Brand: BrandVariants = CreateBrandVariants(RendererThemeValue.AccentColor);

    return RendererThemeValue.ColorScheme === ColorScheme.Dark
        ? createDarkTheme(Brand)
        : createLightTheme(Brand);
};
