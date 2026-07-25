/**
 * Terminal RGB color helpers for renderer output and Ink views.
 *
 * @module @sorrell/ink-three/Terminal/Color
 *
 * @file      Color.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as THREE from "three";

/**
 * RGB terminal color using integer red, green, and blue channels.
 *
 * @category Color
 * @since 1.0.0
 */
export interface Color
{
    readonly Red: number;
    readonly Green: number;
    readonly Blue: number;
}

export/**
       * Default cyan-like terminal color used when no mesh or renderer color is available.
       * @since 1.0.0
       */
const DefaultColor: Color =
    {
        Blue: 255,
        Green: 204,
        Red: 102
    };

/**
 * Parses a six-digit hex color into a terminal color.
 *
 * @category Color
 * @since 1.0.0
 */
export function ParseColor(Color: string | undefined): Color | undefined
{
    if (Color === undefined)
    {
        return undefined;
    }

    const Match: RegExpExecArray | null = /^#?([0-9a-fA-F]{6})$/.exec(Color);

    if (Match === null)
    {
        return undefined;
    }

    const Hex: string = Match[1]!;

    return {
        Blue: Number.parseInt(Hex.slice(4, 6), 16),
        Green: Number.parseInt(Hex.slice(2, 4), 16),
        Red: Number.parseInt(Hex.slice(0, 2), 16)
    };
}

/**
 * Converts a ThreeJS color into an integer terminal color.
 *
 * @category Color
 * @since 1.0.0
 */
export function ColorFromThreeColor(Color: THREE.Color): Color
{
    return {
        Blue: Math.round(Color.b * 255),
        Green: Math.round(Color.g * 255),
        Red: Math.round(Color.r * 255)
    };
}

/**
 * Scales a terminal color by a brightness factor.
 *
 * @category Color
 * @since 1.0.0
 */
export function ScaleColor(Color: Color, Brightness: number): Color
{
    const ClampedBrightness: number = Clamp01(Brightness);

    return {
        Blue: Math.round(Color.Blue * ClampedBrightness),
        Green: Math.round(Color.Green * ClampedBrightness),
        Red: Math.round(Color.Red * ClampedBrightness)
    };
}

/**
 * Formats a terminal color as a six-digit hex color string.
 *
 * @category Conversion
 * @since 1.0.0
 */
export function ColorToHex(Color: Color): string
{
    return `#${ ToHexPair(Color.Red) }${ ToHexPair(Color.Green) }${ ToHexPair(Color.Blue) }`;
}

/**
 * Averages weighted terminal colors.
 *
 * @category Color
 * @since 1.0.0
 */
export function AverageColors(
    WeightedColors: ReadonlyArray<{ Color: Color; Weight: number }>
): Color | undefined
{
    let Red: number = 0;
    let Green: number = 0;
    let Blue: number = 0;
    let TotalWeight: number = 0;

    for (const WeightedColor of WeightedColors)
    {
        Red += WeightedColor.Color.Red * WeightedColor.Weight;
        Green += WeightedColor.Color.Green * WeightedColor.Weight;
        Blue += WeightedColor.Color.Blue * WeightedColor.Weight;
        TotalWeight += WeightedColor.Weight;
    }

    if (TotalWeight <= 0)
    {
        return undefined;
    }

    return {
        Blue: Math.round(Blue / TotalWeight),
        Green: Math.round(Green / TotalWeight),
        Red: Math.round(Red / TotalWeight)
    };
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function ToHexPair(Value: number): string
{
    return Math.max(0, Math.min(255, Value)).toString(16).padStart(2, "0");
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function Clamp01(Value: number): number
{
    if (Value <= 0)
    {
        return 0;
    }

    if (Value >= 1)
    {
        return 1;
    }

    return Value;
}

