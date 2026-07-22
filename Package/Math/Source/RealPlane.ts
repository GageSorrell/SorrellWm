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

/** One Cartesian coordinate dimension. */
export type Dimension = Data.TaggedEnum<{
    readonly X: { };
    readonly Y: { };
}>;

const { $is: IsDimension, $match: MatchDimension } = Data.taggedEnum<Dimension>();

export/** Constructors, guards, and matching utilities for coordinate dimensions. */
const Dimension =
    {
        $is: IsDimension,
        $match: MatchDimension,
        X: { _tag: "X" as const },
        Y: { _tag: "Y" as const }
    } as const;

/** One of the four Cartesian quadrants. */
export type Quadrant = Data.TaggedEnum<{
    readonly I: { };
    readonly II: { };
    readonly III: { };
    readonly IIIV: { };
}>;

const { $is: IsQuadrant, $match: MatchQuadrant } = Data.taggedEnum<Quadrant>();

export/** Constructors, guards, and matching utilities for Cartesian quadrants. */
const Quadrant =
    {
        $is: IsQuadrant,
        $match: MatchQuadrant,
        I: { _tag: "I" as const },
        II: { _tag: "II" as const },
        III: { _tag: "III" as const },
        IV: { _tag: "IV" as const }
    } as const;

/** A signed half of the Cartesian plane along either axis. */
export type HalfPlane = Data.TaggedEnum<{
    readonly XPos: { };
    readonly XNeg: { };
    readonly YPos: { };
    readonly YNeg: { };
}>;

const { $is: IsHalfPlane, $match: MatchHalfPlane } = Data.taggedEnum<HalfPlane>();

export/** Constructors, guards, matching, and classification utilities for half-planes. */
const HalfPlane =
    {
        $is: IsHalfPlane,
        $isAxis: (Axis: Dimension): (Self: HalfPlane) => boolean =>
            Dimension.$match(Axis, {
                X: () => (Self: HalfPlane): boolean => [ "XPos", "XNeg" ].includes(Self._tag),
                Y: () => (Self: HalfPlane): boolean => [ "YPos", "YNeg" ].includes(Self._tag)
            }),
        $isSign: (Sign: "Pos" | "Neg"): (Self: HalfPlane) => boolean =>
            ({
                Neg: (Self: HalfPlane): boolean => [ "XNeg", "YNeg" ].includes(Self._tag),
                Pos: (Self: HalfPlane): boolean => [ "XPos", "YPos" ].includes(Self._tag)
            }[Sign]),
        $match: MatchHalfPlane,
        XNeg: { _tag: "XNeg" as const },
        XPos: { _tag: "XPos" as const },
        YNeg: { _tag: "YNeg" as const },
        YPos: { _tag: "YPos" as const }
    } as const;
