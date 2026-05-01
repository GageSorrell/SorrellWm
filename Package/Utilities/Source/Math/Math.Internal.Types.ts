/**
 * @file      Math.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * The symmetric group of the five given type parameters.
 *
 * @template OneType - The first specified type.
 * @template TwoType - The second specified type.
 * @template ThreeType - The third specified type.
 * @template FourType - The fourth specified type.
 * @template FiveType - The fifth specified type.
 */
export type Five<OneType, TwoType, ThreeType, FourType, FiveType> =
    | readonly [ OneType, TwoType, ThreeType, FourType, FiveType ]
    | readonly [ OneType, TwoType, ThreeType, FiveType, FourType ]
    | readonly [ OneType, TwoType, FourType, ThreeType, FiveType ]
    | readonly [ OneType, TwoType, FourType, FiveType, ThreeType ]
    | readonly [ OneType, TwoType, FiveType, ThreeType, FourType ]
    | readonly [ OneType, TwoType, FiveType, FourType, ThreeType ]
    | readonly [ OneType, ThreeType, TwoType, FourType, FiveType ]
    | readonly [ OneType, ThreeType, TwoType, FiveType, FourType ]
    | readonly [ OneType, ThreeType, FourType, TwoType, FiveType ]
    | readonly [ OneType, ThreeType, FourType, FiveType, TwoType ]
    | readonly [ OneType, ThreeType, FiveType, TwoType, FourType ]
    | readonly [ OneType, ThreeType, FiveType, FourType, TwoType ]
    | readonly [ OneType, FourType, TwoType, ThreeType, FiveType ]
    | readonly [ OneType, FourType, TwoType, FiveType, ThreeType ]
    | readonly [ OneType, FourType, ThreeType, TwoType, FiveType ]
    | readonly [ OneType, FourType, ThreeType, FiveType, TwoType ]
    | readonly [ OneType, FourType, FiveType, TwoType, ThreeType ]
    | readonly [ OneType, FourType, FiveType, ThreeType, TwoType ]
    | readonly [ OneType, FiveType, TwoType, ThreeType, FourType ]
    | readonly [ OneType, FiveType, TwoType, FourType, ThreeType ]
    | readonly [ OneType, FiveType, ThreeType, TwoType, FourType ]
    | readonly [ OneType, FiveType, ThreeType, FourType, TwoType ]
    | readonly [ OneType, FiveType, FourType, TwoType, ThreeType ]
    | readonly [ OneType, FiveType, FourType, ThreeType, TwoType ]
    | readonly [ TwoType, OneType, ThreeType, FourType, FiveType ]
    | readonly [ TwoType, OneType, ThreeType, FiveType, FourType ]
    | readonly [ TwoType, OneType, FourType, ThreeType, FiveType ]
    | readonly [ TwoType, OneType, FourType, FiveType, ThreeType ]
    | readonly [ TwoType, OneType, FiveType, ThreeType, FourType ]
    | readonly [ TwoType, OneType, FiveType, FourType, ThreeType ]
    | readonly [ TwoType, ThreeType, OneType, FourType, FiveType ]
    | readonly [ TwoType, ThreeType, OneType, FiveType, FourType ]
    | readonly [ TwoType, ThreeType, FourType, OneType, FiveType ]
    | readonly [ TwoType, ThreeType, FourType, FiveType, OneType ]
    | readonly [ TwoType, ThreeType, FiveType, OneType, FourType ]
    | readonly [ TwoType, ThreeType, FiveType, FourType, OneType ]
    | readonly [ TwoType, FourType, OneType, ThreeType, FiveType ]
    | readonly [ TwoType, FourType, OneType, FiveType, ThreeType ]
    | readonly [ TwoType, FourType, ThreeType, OneType, FiveType ]
    | readonly [ TwoType, FourType, ThreeType, FiveType, OneType ]
    | readonly [ TwoType, FourType, FiveType, OneType, ThreeType ]
    | readonly [ TwoType, FourType, FiveType, ThreeType, OneType ]
    | readonly [ TwoType, FiveType, OneType, ThreeType, FourType ]
    | readonly [ TwoType, FiveType, OneType, FourType, ThreeType ]
    | readonly [ TwoType, FiveType, ThreeType, OneType, FourType ]
    | readonly [ TwoType, FiveType, ThreeType, FourType, OneType ]
    | readonly [ TwoType, FiveType, FourType, OneType, ThreeType ]
    | readonly [ TwoType, FiveType, FourType, ThreeType, OneType ]
    | readonly [ ThreeType, OneType, TwoType, FourType, FiveType ]
    | readonly [ ThreeType, OneType, TwoType, FiveType, FourType ]
    | readonly [ ThreeType, OneType, FourType, TwoType, FiveType ]
    | readonly [ ThreeType, OneType, FourType, FiveType, TwoType ]
    | readonly [ ThreeType, OneType, FiveType, TwoType, FourType ]
    | readonly [ ThreeType, OneType, FiveType, FourType, TwoType ]
    | readonly [ ThreeType, TwoType, OneType, FourType, FiveType ]
    | readonly [ ThreeType, TwoType, OneType, FiveType, FourType ]
    | readonly [ ThreeType, TwoType, FourType, OneType, FiveType ]
    | readonly [ ThreeType, TwoType, FourType, FiveType, OneType ]
    | readonly [ ThreeType, TwoType, FiveType, OneType, FourType ]
    | readonly [ ThreeType, TwoType, FiveType, FourType, OneType ]
    | readonly [ ThreeType, FourType, OneType, TwoType, FiveType ]
    | readonly [ ThreeType, FourType, OneType, FiveType, TwoType ]
    | readonly [ ThreeType, FourType, TwoType, OneType, FiveType ]
    | readonly [ ThreeType, FourType, TwoType, FiveType, OneType ]
    | readonly [ ThreeType, FourType, FiveType, OneType, TwoType ]
    | readonly [ ThreeType, FourType, FiveType, TwoType, OneType ]
    | readonly [ ThreeType, FiveType, OneType, TwoType, FourType ]
    | readonly [ ThreeType, FiveType, OneType, FourType, TwoType ]
    | readonly [ ThreeType, FiveType, TwoType, OneType, FourType ]
    | readonly [ ThreeType, FiveType, TwoType, FourType, OneType ]
    | readonly [ ThreeType, FiveType, FourType, OneType, TwoType ]
    | readonly [ ThreeType, FiveType, FourType, TwoType, OneType ]
    | readonly [ FourType, OneType, TwoType, ThreeType, FiveType ]
    | readonly [ FourType, OneType, TwoType, FiveType, ThreeType ]
    | readonly [ FourType, OneType, ThreeType, TwoType, FiveType ]
    | readonly [ FourType, OneType, ThreeType, FiveType, TwoType ]
    | readonly [ FourType, OneType, FiveType, TwoType, ThreeType ]
    | readonly [ FourType, OneType, FiveType, ThreeType, TwoType ]
    | readonly [ FourType, TwoType, OneType, ThreeType, FiveType ]
    | readonly [ FourType, TwoType, OneType, FiveType, ThreeType ]
    | readonly [ FourType, TwoType, ThreeType, OneType, FiveType ]
    | readonly [ FourType, TwoType, ThreeType, FiveType, OneType ]
    | readonly [ FourType, TwoType, FiveType, OneType, ThreeType ]
    | readonly [ FourType, TwoType, FiveType, ThreeType, OneType ]
    | readonly [ FourType, ThreeType, OneType, TwoType, FiveType ]
    | readonly [ FourType, ThreeType, OneType, FiveType, TwoType ]
    | readonly [ FourType, ThreeType, TwoType, OneType, FiveType ]
    | readonly [ FourType, ThreeType, TwoType, FiveType, OneType ]
    | readonly [ FourType, ThreeType, FiveType, OneType, TwoType ]
    | readonly [ FourType, ThreeType, FiveType, TwoType, OneType ]
    | readonly [ FourType, FiveType, OneType, TwoType, ThreeType ]
    | readonly [ FourType, FiveType, OneType, ThreeType, TwoType ]
    | readonly [ FourType, FiveType, TwoType, OneType, ThreeType ]
    | readonly [ FourType, FiveType, TwoType, ThreeType, OneType ]
    | readonly [ FourType, FiveType, ThreeType, OneType, TwoType ]
    | readonly [ FourType, FiveType, ThreeType, TwoType, OneType ]
    | readonly [ FiveType, OneType, TwoType, ThreeType, FourType ]
    | readonly [ FiveType, OneType, TwoType, FourType, ThreeType ]
    | readonly [ FiveType, OneType, ThreeType, TwoType, FourType ]
    | readonly [ FiveType, OneType, ThreeType, FourType, TwoType ]
    | readonly [ FiveType, OneType, FourType, TwoType, ThreeType ]
    | readonly [ FiveType, OneType, FourType, ThreeType, TwoType ]
    | readonly [ FiveType, TwoType, OneType, ThreeType, FourType ]
    | readonly [ FiveType, TwoType, OneType, FourType, ThreeType ]
    | readonly [ FiveType, TwoType, ThreeType, OneType, FourType ]
    | readonly [ FiveType, TwoType, ThreeType, FourType, OneType ]
    | readonly [ FiveType, TwoType, FourType, OneType, ThreeType ]
    | readonly [ FiveType, TwoType, FourType, ThreeType, OneType ]
    | readonly [ FiveType, ThreeType, OneType, TwoType, FourType ]
    | readonly [ FiveType, ThreeType, OneType, FourType, TwoType ]
    | readonly [ FiveType, ThreeType, TwoType, OneType, FourType ]
    | readonly [ FiveType, ThreeType, TwoType, FourType, OneType ]
    | readonly [ FiveType, ThreeType, FourType, OneType, TwoType ]
    | readonly [ FiveType, ThreeType, FourType, TwoType, OneType ]
    | readonly [ FiveType, FourType, OneType, TwoType, ThreeType ]
    | readonly [ FiveType, FourType, OneType, ThreeType, TwoType ]
    | readonly [ FiveType, FourType, TwoType, OneType, ThreeType ]
    | readonly [ FiveType, FourType, TwoType, ThreeType, OneType ]
    | readonly [ FiveType, FourType, ThreeType, OneType, TwoType ]
    | readonly [ FiveType, FourType, ThreeType, TwoType, OneType ];

/**
 * The symmetric group of the four given type parameters.
 *
 * @template OneType - The first specified type.
 * @template TwoType - The second specified type.
 * @template ThreeType - The third specified type.
 * @template FourType - The fourth specified type.
 */
export type Four<OneType, TwoType, ThreeType, FourType> =
    | readonly [ OneType, TwoType, ThreeType, FourType ]
    | readonly [ OneType, TwoType, FourType, ThreeType ]
    | readonly [ OneType, ThreeType, TwoType, FourType ]
    | readonly [ OneType, ThreeType, FourType, TwoType ]
    | readonly [ OneType, FourType, TwoType, ThreeType ]
    | readonly [ OneType, FourType, ThreeType, TwoType ]
    | readonly [ TwoType, OneType, ThreeType, FourType ]
    | readonly [ TwoType, OneType, FourType, ThreeType ]
    | readonly [ TwoType, ThreeType, OneType, FourType ]
    | readonly [ TwoType, ThreeType, FourType, OneType ]
    | readonly [ TwoType, FourType, OneType, ThreeType ]
    | readonly [ TwoType, FourType, ThreeType, OneType ]
    | readonly [ ThreeType, OneType, TwoType, FourType ]
    | readonly [ ThreeType, OneType, FourType, TwoType ]
    | readonly [ ThreeType, TwoType, OneType, FourType ]
    | readonly [ ThreeType, TwoType, FourType, OneType ]
    | readonly [ ThreeType, FourType, OneType, TwoType ]
    | readonly [ ThreeType, FourType, TwoType, OneType ]
    | readonly [ FourType, OneType, TwoType, ThreeType ]
    | readonly [ FourType, OneType, ThreeType, TwoType ]
    | readonly [ FourType, TwoType, OneType, ThreeType ]
    | readonly [ FourType, TwoType, ThreeType, OneType ]
    | readonly [ FourType, ThreeType, OneType, TwoType ]
    | readonly [ FourType, ThreeType, TwoType, OneType ];

/**
 * The symmetric group of the three given type parameters.
 *
 * @template OneType - The first specified type.
 * @template TwoType - The second specified type.
 * @template ThreeType - The third specified type.
 */
export type Three<OneType, TwoType, ThreeType> =
    | readonly [ OneType, TwoType, ThreeType ]
    | readonly [ OneType, ThreeType, TwoType ]
    | readonly [ TwoType, OneType, ThreeType ]
    | readonly [ TwoType, ThreeType, OneType ]
    | readonly [ ThreeType, OneType, TwoType ]
    | readonly [ ThreeType, TwoType, OneType ];

/**
 * The symmetric group of the two given type parameters.
 *
 * @template OneType - The first specified type.
 * @template TwoType - The second specified type.
 */
export type Two<OneType, TwoType> =
    | readonly [ OneType, TwoType ]
    | readonly [ TwoType, OneType ];

export type TBuildTuple<
    Length extends number,
    Accumulator extends Array<unknown> = [ ]
> =
    Accumulator["length"] extends Length
        ? Accumulator
        : TBuildTuple<Length, [...Accumulator, unknown]>;

export type TIsLessThanOrEqual<
    Left extends number,
    Right extends number
> =
    TBuildTuple<Right> extends [...TBuildTuple<Left>, ...infer _ ]
        ? true
        : false;

export type TInclusiveRangeFromTuple<
    CurrentTuple extends Array<unknown>,
    EndValue extends number,
    Result extends number = never
> =
    CurrentTuple["length"] extends EndValue
        ? Result | EndValue
        : TInclusiveRangeFromTuple<
            [...CurrentTuple, unknown],
            EndValue,
            Result | CurrentTuple["length"]
        >;
