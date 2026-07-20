/**
 *
 *
 * @module @sorrell/math/RealPlane
 *
 * @file      RealPlane.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";

export type Dimension = Data.TaggedEnum<{
    readonly X: { };
    readonly Y: { };
}>;

const { $is: IsDimension, $match: MatchDimension } = Data.taggedEnum<Dimension>();

export const Dimension =
    {
        X: { _tag: "X" as const },
        Y: { _tag: "Y" as const },
        $is: IsDimension,
        $match: MatchDimension
    } as const;

export type Quadrant = Data.TaggedEnum<{
    readonly I: { };
    readonly II: { };
    readonly III: { };
    readonly IIIV: { };
}>;

const { $is: IsQuadrant, $match: MatchQuadrant } = Data.taggedEnum<Quadrant>();

export const Quadrant =
    {
        I: { _tag: "I" as const },
        II: { _tag: "II" as const },
        III: { _tag: "III" as const },
        IV: { _tag: "IV" as const },
        $is: IsQuadrant,
        $match: MatchQuadrant
    } as const;

export type HalfPlane = Data.TaggedEnum<{
    readonly XPos: { };
    readonly XNeg: { };
    readonly YPos: { };
    readonly YNeg: { };
}>;

const { $is: IsHalfPlane, $match: MatchHalfPlane } = Data.taggedEnum<HalfPlane>();

export const HalfPlane =
    {
        XPos: { _tag: "XPos" as const },
        XNeg: { _tag: "XNeg" as const },
        YPos: { _tag: "YPos" as const },
        YNeg: { _tag: "YNeg" as const },
        $is: IsHalfPlane,
        $match: MatchHalfPlane,
        $isAxis: (Axis: Dimension): (Self: HalfPlane) => boolean =>
            Dimension.$match(Axis, {
                X: () => (Self: HalfPlane): boolean => [ "XPos", "XNeg" ].includes(Self._tag),
                Y: () => (Self: HalfPlane): boolean => [ "YPos", "YNeg" ].includes(Self._tag)
            }),
        $isSign: (Sign: "Pos" | "Neg"): (Self: HalfPlane) => boolean =>
            ({
                Pos: (Self: HalfPlane): boolean => [ "XPos", "YPos" ].includes(Self._tag),
                Neg: (Self: HalfPlane): boolean => [ "XNeg", "YNeg" ].includes(Self._tag)
            }[Sign])
    } as const;
