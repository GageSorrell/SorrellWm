/**
 * @file      Math.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as InternalTypes from "./Number.Internal.Types.ts";

/**
 * Determines whether a given {@link NumberType} is a nonnegative integer.
 *
 * @template NumberType - The number type to check.  This is expected,
 * but not required, to be a single number literal.
 *
 * @returns `true` iff the given {@link NumberType} is a numeric type,
 * and `false` otherwise.
 */
export type TIsNonNegativeInteger<NumberType extends number> =
    `${ NumberType }` extends `-${ string }`
        ? false
        : `${ NumberType }` extends `${ bigint }`
            ? true
            : false;

export namespace Symmetry
{
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
        InternalTypes.Five<OneType, TwoType, ThreeType, FourType, FiveType>;

    /**
     * The symmetric group of the four given type parameters.
     *
     * @template OneType - The first specified type.
     * @template TwoType - The second specified type.
     * @template ThreeType - The third specified type.
     * @template FourType - The fourth specified type.
     */
    export type Four<OneType, TwoType, ThreeType, FourType> =
        InternalTypes.Four<OneType, TwoType, ThreeType, FourType>;

    /**
     * The symmetric group of the three given type parameters.
     *
     * @template OneType - The first specified type.
     * @template TwoType - The second specified type.
     * @template ThreeType - The third specified type.
     */
    export type Three<OneType, TwoType, ThreeType> =
        InternalTypes.Three<OneType, TwoType, ThreeType>;

    /**
     * The symmetric group of the two given type parameters.
     *
     * @template OneType - The first specified type.
     * @template TwoType - The second specified type.
     */
    export type Two<OneType, TwoType> =
        InternalTypes.Two<OneType, TwoType>;
}

export namespace Permutations
{
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
        InternalTypes.Five<OneType, TwoType, ThreeType, FourType, FiveType>;

    /**
     * The symmetric group of the four given type parameters.
     *
     * @template OneType - The first specified type.
     * @template TwoType - The second specified type.
     * @template ThreeType - The third specified type.
     * @template FourType - The fourth specified type.
     */
    export type Four<OneType, TwoType, ThreeType, FourType> =
        InternalTypes.Four<OneType, TwoType, ThreeType, FourType>;

    /**
     * The symmetric group of the three given type parameters.
     *
     * @template OneType - The first specified type.
     * @template TwoType - The second specified type.
     * @template ThreeType - The third specified type.
     */
    export type Three<OneType, TwoType, ThreeType> =
        InternalTypes.Three<OneType, TwoType, ThreeType>;

    /**
     * The symmetric group of the two given type parameters.
     *
     * @template OneType - The first specified type.
     * @template TwoType - The second specified type.
     */
    export type Two<OneType, TwoType> =
        InternalTypes.Two<OneType, TwoType>;
}
