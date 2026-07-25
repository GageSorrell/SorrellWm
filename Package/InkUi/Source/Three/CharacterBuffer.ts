/**
 * Mutable fixed-size character grid for terminal cell output.
 *
 * @module @sorrell/ink-three/CharacterBuffer
 *
 * @file      CharacterBuffer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as EffectFunction from "effect/Function";

/**
 * Mutable fixed-size terminal character buffer state.
 *
 * @category Terminal
 * @since 1.0.0
 */
export interface CharacterBuffer
{
    readonly Width: number;
    readonly Height: number;
    readonly Cells: Array<Array<string>>;
    FillCharacter: string;
}

/**
 * Creates a mutable fixed-size terminal character buffer.
 *
 * @category Constructor
 * @since 1.0.0
 */
export function MakeCharacterBuffer(
    Width: number,
    Height: number,
    FillCharacter: string = " "
): CharacterBuffer
{
    const SafeWidth: number = Math.max(0, Math.floor(Width));
    const SafeHeight: number = Math.max(0, Math.floor(Height));
    const NormalizedFillCharacter: string = NormalizeCharacter(FillCharacter);
    const Cells: Array<Array<string>> = [ ];

    for (let Y: number = 0; Y < SafeHeight; Y += 1)
    {
        const Row: Array<string> = [ ];

        for (let X: number = 0; X < SafeWidth; X += 1)
        {
            Row.push(NormalizedFillCharacter);
        }

        Cells.push(Row);
    }

    return {
        Cells,
        FillCharacter: NormalizedFillCharacter,
        Height: SafeHeight,
        Width: SafeWidth
    };
}

export/**
       * Clears every cell in a character buffer.
       *
       * @category Terminal
       * @since 1.0.0
       */
const ClearCharacterBuffer: {
    (Character?: string): (Self: CharacterBuffer) => void;
    (Self: CharacterBuffer, Character?: string): void;
} = EffectFunction.dual(
    (Arguments: IArguments) => IsCharacterBuffer(Arguments[0]),
    (Self: CharacterBuffer, Character?: string): void =>
    {
        if (Character !== undefined)
        {
            Self.FillCharacter = NormalizeCharacter(Character);
        }

        for (let Y: number = 0; Y < Self.Height; Y += 1)
        {
            for (let X: number = 0; X < Self.Width; X += 1)
            {
                Self.Cells[Y]![X] = Self.FillCharacter;
            }
        }
    }
);

export/**
       * Sets one cell in a character buffer.
       *
       * @category Terminal
       * @since 1.0.0
       */
const SetCharacter: {
    (X: number, Y: number, Character: string): (Self: CharacterBuffer) => void;
    (Self: CharacterBuffer, X: number, Y: number, Character: string): void;
} = EffectFunction.dual(
    4,
    (Self: CharacterBuffer, X: number, Y: number, Character: string): void =>
    {
        const CellX: number = Math.round(X);
        const CellY: number = Math.round(Y);

        if (CellX < 0 || CellX >= Self.Width || CellY < 0 || CellY >= Self.Height)
        {
            return;
        }

        Self.Cells[CellY]![CellX] = NormalizeCharacter(Character);
    }
);

export/**
       * Draws a Bresenham line into a character buffer.
       *
       * @category Terminal
       * @since 1.0.0
       */
const DrawCharacterLine: {
    (
        StartX: number,
        StartY: number,
        EndX: number,
        EndY: number,
        Character: string
    ): (Self: CharacterBuffer) => void;
    (
        Self: CharacterBuffer,
        StartX: number,
        StartY: number,
        EndX: number,
        EndY: number,
        Character: string
    ): void;
} = EffectFunction.dual(
    6,
    (
        Self: CharacterBuffer,
        StartX: number,
        StartY: number,
        EndX: number,
        EndY: number,
        Character: string
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
        let Error: number = DeltaX - DeltaY;

        while (true)
        {
            SetCharacter(Self, CurrentX, CurrentY, Character);

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
        }
    }
);

export/**
       * Converts a character buffer into newline-delimited text.
       *
       * @category Conversion
       * @since 1.0.0
       */
const CharacterBufferToString: {
    (): (Self: CharacterBuffer) => string;
    (Self: CharacterBuffer): string;
} = EffectFunction.dual(
    (Arguments: IArguments) => IsCharacterBuffer(Arguments[0]),
    (Self: CharacterBuffer): string => Self.Cells.map((Row: Array<string>) => Row.join("")).join("\n")
);

/* eslint-disable-next-line jsdoc/require-jsdoc */
function NormalizeCharacter(Character: string): string
{
    return Character.length > 0 ? Character[0]! : " ";
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function IsCharacterBuffer(Value: unknown): Value is CharacterBuffer
{
    return (
        typeof Value === "object" &&
        Value !== null &&
        "Cells" in Value &&
        "FillCharacter" in Value &&
        "Height" in Value &&
        "Width" in Value
    );
}

