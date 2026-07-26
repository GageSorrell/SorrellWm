/**
 * Pixel shadow rendering for Box.
 *
 * @module @sorrell/ink-ui/Box/Shadow
 *
 * @file      Shadow.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Rgba } from "./CompactBorder.js";

/** Supported Box elevation levels. */
export type BoxElevation = 0 | 1 | 2 | 3 | 4 | 5;

/** Pixel padding occupied by a shadow around its source rectangle. */
export interface ShadowInsets
{
    readonly Bottom: number;
    readonly Left: number;
    readonly Right: number;
    readonly Top: number;
}

/** Input for {@link RenderBoxShadow}. */
export interface BoxShadowOptions
{
    readonly BackgroundColor: Rgba;
    readonly BoxHeight: number;
    readonly BoxWidth: number;
    readonly CellHeight: number;
    readonly CellWidth: number;
    readonly Elevation: Exclude<BoxElevation, 0>;
    readonly Lofi: boolean;
    readonly ShadowColor: Rgba;
}

/** A rendered shadow canvas and the source Box's offset within it. */
export interface RenderedBoxShadow
{
    readonly Height: number;
    readonly Insets: ShadowInsets;
    readonly Pixels: Buffer;
    readonly Width: number;
}

const Bayer4 = [
    0, 8, 2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5
] as const;

/** Determine cell-aligned shadow padding for an elevation. */
export function GetShadowInsets(
    Elevation: Exclude<BoxElevation, 0>,
    CellWidth: number,
    CellHeight: number
): ShadowInsets
{
    const MinimumCellDimension: number = Math.max(1, Math.min(CellWidth, CellHeight));
    const Blur: number = Math.max(1, Elevation * MinimumCellDimension * 0.16);
    const Reach: number = Blur * 1.8 + Elevation * 0.35;
    const DownwardOffset: number = Blur * 0.45;

    return {
        Bottom: AlignUp(Reach + DownwardOffset, CellHeight),
        Left: AlignUp(Reach, CellWidth),
        Right: AlignUp(Reach, CellWidth),
        Top: AlignUp(Math.max(0, Reach - DownwardOffset), CellHeight)
    };
}

/** Render a background-composited, transparent-center Box shadow. */
export function RenderBoxShadow(Options: BoxShadowOptions): RenderedBoxShadow
{
    const Insets: ShadowInsets = GetShadowInsets(
        Options.Elevation,
        Options.CellWidth,
        Options.CellHeight
    );
    const Width: number = Insets.Left + Options.BoxWidth + Insets.Right;
    const Height: number = Insets.Top + Options.BoxHeight + Insets.Bottom;
    const Pixels: Buffer = Buffer.alloc(Width * Height * 4);
    const MinimumCellDimension: number = Math.max(1, Math.min(
        Options.CellWidth,
        Options.CellHeight
    ));
    const Blur: number = Math.max(1, Options.Elevation * MinimumCellDimension * 0.16);
    const Reach: number = Blur * 1.8 + Options.Elevation * 0.35;
    const DownwardOffset: number = Blur * 0.45;
    const MaximumOpacity: number = Math.min(0.42, 0.18 + Options.Elevation * 0.04)
        * (Options.ShadowColor[3] / 255);
    const SourceLeft: number = Insets.Left;
    const SourceTop: number = Insets.Top;
    const SourceRight: number = SourceLeft + Options.BoxWidth;
    const SourceBottom: number = SourceTop + Options.BoxHeight;
    const ShadowTop: number = SourceTop + DownwardOffset;
    const ShadowBottom: number = SourceBottom + DownwardOffset;

    for (let Y: number = 0; Y < Height; Y += 1)
    {
        for (let X: number = 0; X < Width; X += 1)
        {
            if (X >= SourceLeft && X < SourceRight && Y >= SourceTop && Y < SourceBottom)
            {
                continue;
            }

            const DeltaX: number = X < SourceLeft
                ? SourceLeft - X
                : X >= SourceRight ? X - SourceRight + 1 : 0;
            const DeltaY: number = Y < ShadowTop
                ? ShadowTop - Y
                : Y >= ShadowBottom ? Y - ShadowBottom + 1 : 0;
            const Distance: number = Math.hypot(DeltaX, DeltaY);
            if (Distance > Reach)
            {
                continue;
            }

            const Proximity: number = Math.max(0, 1 - Distance / Reach);
            let Opacity: number = MaximumOpacity * Proximity ** 1.65;
            if (Options.Lofi)
            {
                Opacity = DitherOpacity(Opacity, MaximumOpacity, X, Y);
            }
            if (Opacity <= 0)
            {
                continue;
            }

            const Offset: number = (Y * Width + X) * 4;
            Pixels[Offset] = Blend(
                Options.BackgroundColor[0],
                Options.ShadowColor[0],
                Opacity
            );
            Pixels[Offset + 1] = Blend(
                Options.BackgroundColor[1],
                Options.ShadowColor[1],
                Opacity
            );
            Pixels[Offset + 2] = Blend(
                Options.BackgroundColor[2],
                Options.ShadowColor[2],
                Opacity
            );
            Pixels[Offset + 3] = 255;
        }
    }

    return { Height, Insets, Pixels, Width };
}

const AlignUp = (Value: number, Quantum: number): number =>
{
    const SafeQuantum: number = Math.max(1, Math.round(Quantum));
    return Math.ceil(Math.max(0, Value) / SafeQuantum) * SafeQuantum;
};

const Blend = (Background: number, Shadow: number, Opacity: number): number =>
{
    return Math.round(Background * (1 - Opacity) + Shadow * Opacity);
};

const DitherOpacity = (
    Opacity: number,
    MaximumOpacity: number,
    X: number,
    Y: number
): number =>
{
    if (MaximumOpacity <= 0)
    {
        return 0;
    }

    const Coverage: number = Math.max(0, Math.min(1, Opacity / MaximumOpacity));
    const Threshold: number = ((Bayer4[(Y % 4) * 4 + X % 4] ?? 0) + 0.5) / 16;

    if (Coverage <= Threshold)
    {
        return 0;
    }

    return MaximumOpacity * Math.ceil(Coverage * 3) / 3;
};
