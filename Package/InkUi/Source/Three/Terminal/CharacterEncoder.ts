/**
 * Terminal character encoders for converting coverage buffers into frame cells.
 *
 * @module @sorrell/ink-ui/Three/Terminal/CharacterEncoder
 *
 * @file      CharacterEncoder.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as RenderMode from "./RenderMode.js";
import { AverageColors, type Color } from "./Color.js";
import {
    type CoverageBuffer,
    GetColor,
    GetCoverage,
    GetIntensity
} from "../CoverageBuffer.js";
import { type Frame, type FrameCell, ToString } from "./Frame.js";
import { Function } from "effect";

/**
 * Options passed to terminal character encoders.
 *
 * @category Glyph
 * @since 1.0.0
 */
export interface Options
{
    readonly Width: number;
    readonly Height: number;
    readonly Character?: string | undefined;
    readonly CharacterRamp?: string | undefined;
}

/**
 * Encoder that converts raster coverage into terminal frame cells and text.
 *
 * @category Glyph
 * @since 1.0.0
 */
export interface CharacterEncoder
{
    readonly SubcellWidth: number;
    readonly SubcellHeight: number;

    EncodeFrame(CoverageBuffer: CoverageBuffer, Options: Options): Frame;

    Encode(CoverageBuffer: CoverageBuffer, Options: Options): string;
}

const CoverageThreshold: number = 0;

const FixedCharacterEncoder: CharacterEncoder =
    {
        SubcellHeight: 1,
        SubcellWidth: 1,

        EncodeFrame(CoverageBuffer: CoverageBuffer, Options: Options): Frame
        {
            const Character: string = GetFirstCharacter(Options.Character, RenderMode.Default.FixedCharacter);
            const Lines: Array<Array<FrameCell>> = [ ];

            for (let CellY: number = 0; CellY < Options.Height; CellY += 1)
            {
                const Line: Array<FrameCell> = [ ];

                for (let CellX: number = 0; CellX < Options.Width; CellX += 1)
                {
                    const HasCoverage: boolean =
                        GetCoverage(CoverageBuffer, CellX, CellY) > CoverageThreshold;

                    Line.push(
                        HasCoverage
                            ? {
                                Brightness: GetIntensity(CoverageBuffer, CellX, CellY),
                                Character,
                                Color: GetColor(CoverageBuffer, CellX, CellY)
                            }
                            : {
                                Brightness: 0,
                                Character: " ",
                                Color: undefined
                            }
                    );
                }

                Lines.push(Line);
            }

            return { Lines };
        },

        Encode(CoverageBuffer: CoverageBuffer, Options: Options): string
        {
            return ToString(this.EncodeFrame(CoverageBuffer, Options));
        }
    };

const ShadeRampEncoder: CharacterEncoder =
    {
        SubcellHeight: 4,
        SubcellWidth: 2,

        EncodeFrame(CoverageBuffer: CoverageBuffer, Options: Options): Frame
        {
            const Ramp: Array<string> =
                GetCharacterArray(Options.CharacterRamp, RenderMode.Default.ShadeRamp);
            const Lines: Array<Array<FrameCell>> = [ ];

            for (let CellY: number = 0; CellY < Options.Height; CellY += 1)
            {
                const Line: Array<FrameCell> = [ ];

                for (let CellX: number = 0; CellX < Options.Width; CellX += 1)
                {
                    const CellArguments: Parameters<typeof GetCellIntensityDensity> =
                        [
                            CoverageBuffer,
                            CellX,
                            CellY,
                            this.SubcellWidth,
                            this.SubcellHeight
                        ] as const;

                    const Density: number = Function.tupled(GetCellIntensityDensity)(CellArguments);
                    const RampIndex: number = Math.round(Density * (Ramp.length - 1));
                    const Brightness: number = Function.tupled(GetCellCoveredIntensity)(CellArguments);

                    Line.push({
                        Brightness,
                        Character: Ramp[RampIndex] ?? " ",
                        Color: Function.tupled(GetCellCoveredColor)(CellArguments)
                    });
                }

                Lines.push(Line);
            }

            return { Lines };
        },

        Encode(CoverageBuffer: CoverageBuffer, Options: Options): string
        {
            return ToString(this.EncodeFrame(CoverageBuffer, Options));
        }
    };

const BrailleDotMasks: ReadonlyArray<ReadonlyArray<number>> =
    [
        [ 0x01, 0x08 ],
        [ 0x02, 0x10 ],
        [ 0x04, 0x20 ],
        [ 0x40, 0x80 ]
    ];

const BrailleCharacterEncoder: CharacterEncoder =
    {
        SubcellHeight: 4,
        SubcellWidth: 2,

        EncodeFrame(CoverageBuffer: CoverageBuffer, Options: Options): Frame
        {
            const Lines: Array<Array<FrameCell>> = [ ];

            for (let CellY: number = 0; CellY < Options.Height; CellY += 1)
            {
                const Line: Array<FrameCell> = [ ];

                for (let CellX: number = 0; CellX < Options.Width; CellX += 1)
                {
                    let Mask: number = 0;

                    for (let SubcellY: number = 0; SubcellY < this.SubcellHeight; SubcellY += 1)
                    {
                        for (let SubcellX: number = 0; SubcellX < this.SubcellWidth; SubcellX += 1)
                        {
                            const CoverageX: number = CellX * this.SubcellWidth + SubcellX;
                            const CoverageY: number = CellY * this.SubcellHeight + SubcellY;

                            if (GetCoverage(CoverageBuffer, CoverageX, CoverageY) > CoverageThreshold)
                            {
                                Mask |= BrailleDotMasks[SubcellY]![SubcellX]!;
                            }
                        }
                    }

                    const CellArguments: Parameters<typeof GetCellIntensityDensity> =
                        [
                            CoverageBuffer,
                            CellX,
                            CellY,
                            this.SubcellWidth,
                            this.SubcellHeight
                        ] as const;

                    Line.push({
                        Brightness: Function.tupled(GetCellCoveredIntensity)(CellArguments),
                        Character: Mask === 0 ? " " : String.fromCharCode(0x2800 + Mask),
                        Color: Function.tupled(GetCellCoveredColor)(CellArguments)!
                    });
                }

                Lines.push(Line);
            }

            return { Lines };
        },

        Encode(CoverageBuffer: CoverageBuffer, Options: Options): string
        {
            return ToString(this.EncodeFrame(CoverageBuffer, Options));
        }
    };

const QuadrantCharacters: Readonly<Record<number, string>> =
    {
        0b0000: " ",
        0b0001: "▘",
        0b0010: "▝",
        0b0011: "▀",
        0b0100: "▖",
        0b0101: "▌",
        0b0110: "▞",
        0b0111: "▛",
        0b1000: "▗",
        0b1001: "▚",

        0b1010: "▐",
        0b1011: "▜",
        0b1100: "▄",
        0b1101: "▙",
        0b1110: "▟",
        0b1111: "█"
    };

const QuadrantCharacterEncoder: CharacterEncoder =
    {
        SubcellHeight: 2,
        SubcellWidth: 2,

        EncodeFrame(CoverageBuffer: CoverageBuffer, Options: Options): Frame
        {
            const Lines: Array<Array<FrameCell>> = [ ];

            for (let CellY: number = 0; CellY < Options.Height; CellY += 1)
            {
                const Line: Array<FrameCell> = [ ];

                for (let CellX: number = 0; CellX < Options.Width; CellX += 1)
                {
                    let Mask: number = 0;

                    if (GetCoverage(CoverageBuffer, CellX * 2, CellY * 2) > CoverageThreshold)
                    {
                        Mask |= 0b0001;
                    }

                    if (GetCoverage(CoverageBuffer, CellX * 2 + 1, CellY * 2) > CoverageThreshold)
                    {
                        Mask |= 0b0010;
                    }

                    if (GetCoverage(CoverageBuffer, CellX * 2, CellY * 2 + 1) > CoverageThreshold)
                    {
                        Mask |= 0b0100;
                    }

                    if (GetCoverage(CoverageBuffer, CellX * 2 + 1, CellY * 2 + 1) > CoverageThreshold)
                    {
                        Mask |= 0b1000;
                    }

                    const CellArguments: Parameters<typeof GetCellIntensityDensity> =
                        [
                            CoverageBuffer,
                            CellX,
                            CellY,
                            this.SubcellWidth,
                            this.SubcellHeight
                        ] as const;

                    Line.push({
                        Brightness: Function.tupled(GetCellCoveredIntensity)(CellArguments),
                        Character: QuadrantCharacters[Mask] ?? " ",
                        Color: Function.tupled(GetCellCoveredColor)(CellArguments)!
                    });
                }

                Lines.push(Line);
            }

            return { Lines };
        },

        Encode(CoverageBuffer: CoverageBuffer, Options: Options): string
        {
            return ToString(this.EncodeFrame(CoverageBuffer, Options));
        }
    };

const HalfBlockCharacters: Readonly<Record<number, string>> =
    {
        0b00: " ",
        0b01: "▀",
        0b10: "▄",
        0b11: "█"
    };

const HalfBlockCharacterEncoder: CharacterEncoder =
    {
        SubcellHeight: 2,
        SubcellWidth: 1,

        EncodeFrame(CoverageBuffer: CoverageBuffer, Options: Options): Frame
        {
            const Lines: Array<Array<FrameCell>> = [ ];

            for (let CellY: number = 0; CellY < Options.Height; CellY += 1)
            {
                const Line: Array<FrameCell> = [ ];

                for (let CellX: number = 0; CellX < Options.Width; CellX += 1)
                {
                    let Mask: number = 0;

                    if (GetCoverage(CoverageBuffer, CellX, CellY * 2) > CoverageThreshold)
                    {
                        Mask |= 0b01;
                    }

                    if (GetCoverage(CoverageBuffer, CellX, CellY * 2 + 1) > CoverageThreshold)
                    {
                        Mask |= 0b10;
                    }

                    const CellArguments: Parameters<typeof GetCellIntensityDensity> =
                        [
                            CoverageBuffer,
                            CellX,
                            CellY,
                            this.SubcellWidth,
                            this.SubcellHeight
                        ] as const;

                    const Brightness = Function.tupled(GetCellCoveredIntensity)(CellArguments);

                    Line.push({
                        Brightness,
                        Character: HalfBlockCharacters[Mask] ?? " ",
                        Color: Function.tupled(GetCellCoveredColor)(CellArguments)!
                    });
                }

                Lines.push(Line);
            }

            return { Lines };
        },

        Encode(CoverageBuffer: CoverageBuffer, Options: Options): string
        {
            return ToString(this.EncodeFrame(CoverageBuffer, Options));
        }
    };

/**
 * Returns the terminal character encoder for a render mode.
 *
 * @category Glyph
 * @since 1.0.0
 */
export function GetCharacterEncoder(
    Value: RenderMode.RenderMode | undefined
): CharacterEncoder
{
    return RenderMode.RenderMode.$match(
        Value ?? RenderMode.Default.RenderMode,
        {
            Braille: () => BrailleCharacterEncoder,
            Fixed: () => FixedCharacterEncoder,
            HalfBlock: () => HalfBlockCharacterEncoder,
            Quadrant: () => QuadrantCharacterEncoder,
            Shade: () => ShadeRampEncoder
        }
    );
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function GetCellIntensityDensity(
    CoverageBuffer: CoverageBuffer,
    CellX: number,
    CellY: number,
    SubcellWidth: number,
    SubcellHeight: number
): number
{
    let CoverageSum: number = 0;

    for (let SubcellY: number = 0; SubcellY < SubcellHeight; SubcellY += 1)
    {
        for (let SubcellX: number = 0; SubcellX < SubcellWidth; SubcellX += 1)
        {
            const CoverageX: number = CellX * SubcellWidth + SubcellX;
            const CoverageY: number = CellY * SubcellHeight + SubcellY;
            CoverageSum +=
                GetCoverage(CoverageBuffer, CoverageX, CoverageY) *
                GetIntensity(CoverageBuffer, CoverageX, CoverageY);
        }
    }

    return CoverageSum / (SubcellWidth * SubcellHeight);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function GetCellCoveredIntensity(
    CoverageBuffer: CoverageBuffer,
    CellX: number,
    CellY: number,
    SubcellWidth: number,
    SubcellHeight: number
): number
{
    let IntensitySum: number = 0;
    let CoverageSum: number = 0;

    for (let SubcellY: number = 0; SubcellY < SubcellHeight; SubcellY += 1)
    {
        for (let SubcellX: number = 0; SubcellX < SubcellWidth; SubcellX += 1)
        {
            const CoverageX: number = CellX * SubcellWidth + SubcellX;
            const CoverageY: number = CellY * SubcellHeight + SubcellY;
            const Coverage: number = GetCoverage(CoverageBuffer, CoverageX, CoverageY);

            if (Coverage > CoverageThreshold)
            {
                IntensitySum += GetIntensity(CoverageBuffer, CoverageX, CoverageY) * Coverage;
                CoverageSum += Coverage;
            }
        }
    }

    return CoverageSum > 0 ? IntensitySum / CoverageSum : 0;
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function GetCellCoveredColor(
    CoverageBuffer: CoverageBuffer,
    CellX: number,
    CellY: number,
    SubcellWidth: number,
    SubcellHeight: number
): Color | undefined
{
    const WeightedColors: Array<{ Color: Color; Weight: number }> = [ ];

    for (let SubcellY: number = 0; SubcellY < SubcellHeight; SubcellY += 1)
    {
        for (let SubcellX: number = 0; SubcellX < SubcellWidth; SubcellX += 1)
        {
            const CoverageX: number = CellX * SubcellWidth + SubcellX;
            const CoverageY: number = CellY * SubcellHeight + SubcellY;
            const Coverage: number = GetCoverage(CoverageBuffer, CoverageX, CoverageY);
            const Color: Color | undefined = GetColor(CoverageBuffer, CoverageX, CoverageY);

            if (Coverage > CoverageThreshold && Color !== undefined)
            {
                WeightedColors.push({
                    Color,
                    Weight: Coverage
                });
            }
        }
    }

    return AverageColors(WeightedColors);
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function GetFirstCharacter(Value: string | undefined, Fallback: string): string
{
    return GetCharacterArray(Value, Fallback)[0] ?? " ";
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
function GetCharacterArray(Value: string | undefined, Fallback: string): Array<string>
{
    const Characters: Array<string> = Array.from(Value && Value.length > 0 ? Value : Fallback);

    return Characters.length > 0 ? Characters : [ " " ];
}

