/**
 * Numeric coverage, depth, intensity, and color buffer for terminal rasterization.
 *
 * @module @sorrell/ink-ui/Three/CoverageBuffer
 *
 * @file      CoverageBuffer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as EffectFunction from "effect/Function";
import type { Color } from "./Terminal/Color.js";

/**
 * Mutable raster buffer that stores per-sample coverage, depth, brightness, and color.
 *
 * @category Frame
 * @since 1.0.0
 */
export interface CoverageBuffer
{
    readonly Height: number;
    readonly Width: number;
    readonly CoverageValues: Array<number>;
    readonly IntensityValues: Array<number>;
    readonly DepthValues: Array<number>;
    readonly ColorValues: Array<Color | undefined>;
}

/**
 * Creates a mutable raster coverage buffer.
 *
 * @category Constructor
 * @since 1.0.0
 */
export function MakeCoverageBuffer(Width: number, Height: number): CoverageBuffer
{
    const SafeWidth: number = Math.max(0, Math.floor(Width));
    const SafeHeight: number = Math.max(0, Math.floor(Height));
    const Size: number = SafeWidth * SafeHeight;

    return {
        ColorValues: new Array<Color | undefined>(Size).fill(undefined),
        CoverageValues: new Array<number>(Size).fill(0),
        DepthValues: new Array<number>(Size).fill(Number.POSITIVE_INFINITY),
        Height: SafeHeight,
        IntensityValues: new Array<number>(Size).fill(0),
        Width: SafeWidth
    };
}

export/**
       * Clears coverage, depth, intensity, and color samples.
       *
       * @category Frame
       * @since 1.0.0
       */
const ClearCoverageBuffer: {
    (): (Self: CoverageBuffer) => void;
    (Self: CoverageBuffer): void;
} = EffectFunction.dual(
    (Arguments: IArguments) => IsCoverageBuffer(Arguments[0]),
    (Self: CoverageBuffer): void =>
    {
        Self.CoverageValues.fill(0);
        Self.IntensityValues.fill(0);
        Self.DepthValues.fill(Number.POSITIVE_INFINITY);
        Self.ColorValues.fill(undefined);
    }
);

export/**
       * Adds coverage to one raster sample.
       *
       * @category Frame
       * @since 1.0.0
       */
const AddCoverage: {
    (
        X: number,
        Y: number,
        Amount?: number,
        Intensity?: number,
        Depth?: number,
        Color?: Color
    ): (Self: CoverageBuffer) => void;
    (
        Self: CoverageBuffer,
        X: number,
        Y: number,
        Amount?: number,
        Intensity?: number,
        Depth?: number,
        Color?: Color
    ): void;
} = EffectFunction.dual(
    (Arguments: IArguments) => IsCoverageBuffer(Arguments[0]),
    (
        Self: CoverageBuffer,
        X: number,
        Y: number,
        Amount: number = 1,
        Intensity: number = 1,
        Depth: number = Number.NEGATIVE_INFINITY,
        Color?: Color
    ): void =>
    {
        const CoverageX: number = Math.round(X);
        const CoverageY: number = Math.round(Y);

        if (CoverageX < 0 || CoverageX >= Self.Width || CoverageY < 0 || CoverageY >= Self.Height)
        {
            return;
        }

        const Index: number = CoverageY * Self.Width + CoverageX;

        if (Depth > Self.DepthValues[Index]!)
        {
            return;
        }

        Self.CoverageValues[Index] = Clamp01(Self.CoverageValues[Index]! + Amount);
        Self.IntensityValues[Index] = Clamp01(Intensity);
        Self.DepthValues[Index] = Depth;
        Self.ColorValues[Index] = Color;
    }
);

export/**
       * Returns coverage for one raster sample.
       *
       * @category Frame
       * @since 1.0.0
       */
const GetCoverage: {
    (X: number, Y: number): (Self: CoverageBuffer) => number;
    (Self: CoverageBuffer, X: number, Y: number): number;
} = EffectFunction.dual(
    3,
    (Self: CoverageBuffer, X: number, Y: number): number =>
    {
        const CoverageX: number = Math.round(X);
        const CoverageY: number = Math.round(Y);

        if (CoverageX < 0 || CoverageX >= Self.Width || CoverageY < 0 || CoverageY >= Self.Height)
        {
            return 0;
        }

        return Self.CoverageValues[CoverageY * Self.Width + CoverageX] ?? 0;
    }
);

export/**
       * Returns intensity for one raster sample.
       *
       * @category Frame
       * @since 1.0.0
       */
const GetIntensity: {
    (X: number, Y: number): (Self: CoverageBuffer) => number;
    (Self: CoverageBuffer, X: number, Y: number): number;
} = EffectFunction.dual(
    3,
    (Self: CoverageBuffer, X: number, Y: number): number =>
    {
        const CoverageX: number = Math.round(X);
        const CoverageY: number = Math.round(Y);

        if (CoverageX < 0 || CoverageX >= Self.Width || CoverageY < 0 || CoverageY >= Self.Height)
        {
            return 0;
        }

        return Self.IntensityValues[CoverageY * Self.Width + CoverageX] ?? 0;
    }
);

export/**
       * Returns color for one raster sample.
       *
       * @category Frame
       * @since 1.0.0
       */
const GetColor: {
    (X: number, Y: number): (Self: CoverageBuffer) => Color | undefined;
    (Self: CoverageBuffer, X: number, Y: number): Color | undefined;
} = EffectFunction.dual(
    3,
    (Self: CoverageBuffer, X: number, Y: number): Color | undefined =>
    {
        const CoverageX: number = Math.round(X);
        const CoverageY: number = Math.round(Y);

        if (CoverageX < 0 || CoverageX >= Self.Width || CoverageY < 0 || CoverageY >= Self.Height)
        {
            return undefined;
        }

        return Self.ColorValues[CoverageY * Self.Width + CoverageX];
    }
);

export/**
       * Draws a Bresenham line into a coverage buffer.
       *
       * @category Frame
       * @since 1.0.0
       */
const DrawCoverageLine: {
    (
        StartX: number,
        StartY: number,
        EndX: number,
        EndY: number,
        Amount?: number,
        Intensity?: number,
        StartDepth?: number,
        EndDepth?: number,
        Color?: Color
    ): (Self: CoverageBuffer) => void;
    (
        Self: CoverageBuffer,
        StartX: number,
        StartY: number,
        EndX: number,
        EndY: number,
        Amount?: number,
        Intensity?: number,
        StartDepth?: number,
        EndDepth?: number,
        Color?: Color
    ): void;
} = EffectFunction.dual(
    (Arguments: IArguments) => IsCoverageBuffer(Arguments[0]),
    (
        Self: CoverageBuffer,
        StartX: number,
        StartY: number,
        EndX: number,
        EndY: number,
        Amount: number = 1,
        Intensity: number = 1,
        StartDepth: number = Number.NEGATIVE_INFINITY,
        EndDepth: number = StartDepth,
        Color?: Color
    ): void =>
    {
        let CurrentX: number = Math.round(StartX);
        let CurrentY: number = Math.round(StartY);
        const TargetX: number = Math.round(EndX);
        const TargetY: number = Math.round(EndY);
        const DeltaX: number = Math.abs(TargetX - CurrentX);
        const DeltaY: number = Math.abs(TargetY - CurrentY);
        const StepX: number = CurrentX < TargetX ? 1 : -1;
        const StepY: number = CurrentY < TargetY ? 1 : -1;
        const TotalSteps: number = Math.max(DeltaX, DeltaY, 1);
        let CurrentStep: number = 0;
        let Error: number = DeltaX - DeltaY;

        while (true)
        {
            const T: number = CurrentStep / TotalSteps;
            const Depth: number = StartDepth + (EndDepth - StartDepth) * T;

            AddCoverage(Self, CurrentX, CurrentY, Amount, Intensity, Depth, Color);

            if (CurrentX === TargetX && CurrentY === TargetY)
            {
                break;
            }

            const DoubleError: number = Error * 2;

            if (DoubleError > -DeltaY)
            {
                Error -= DeltaY;
                CurrentX += StepX;
            }

            if (DoubleError < DeltaX)
            {
                Error += DeltaX;
                CurrentY += StepY;
            }

            CurrentStep += 1;
        }
    }
);

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

/* eslint-disable-next-line jsdoc/require-jsdoc */
function IsCoverageBuffer(Value: unknown): Value is CoverageBuffer
{
    return (
        typeof Value === "object" &&
        Value !== null &&
        "ColorValues" in Value &&
        "CoverageValues" in Value &&
        "DepthValues" in Value &&
        "Height" in Value &&
        "IntensityValues" in Value &&
        "Width" in Value
    );
}

