/**
 * @file      HigherKind.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Registrar from "./HigherKind.Registrar.Types.ts";
import type { Keyof } from "./HigherKind.Internal.Types.ts";

/**
 * Apply a higher-kind type of one type parameter.
 *
 * @template ParameterOneType - The first type parameter.
 */
export type OneParam<
    HigherKindType extends Keyof.OneParam,
    ParameterOneType
> = Registrar.OneParam<ParameterOneType>[HigherKindType];

/**
 * Apply a higher-kind type of two type parameters.
 *
 * @template ParameterOneType - The first type parameter.
 * @template ParameterTwoType - The second type parameter.
 */
export type TwoParams<
    HigherKindType extends Keyof.TwoParams,
    ParameterOneType,
    ParameterTwoType
> =
    Registrar.TwoParams<
        ParameterOneType,
        ParameterTwoType
    >[HigherKindType];

/**
 * Apply a higher-kind type of three type parameters.
 *
 * @template ParameterOneType - The first type parameter.
 * @template ParameterTwoType - The second type parameter.
 * @template ParameterThreeType - The third type parameter.
 */
export type ThreeParams<
    HigherKindType extends Keyof.ThreeParams,
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType
> =
    Registrar.ThreeParams<
        ParameterOneType,
        ParameterTwoType,
        ParameterThreeType
    >[HigherKindType];

/**
 * Apply a higher-kind type of four type parameters.
 *
 * @template ParameterOneType - The first type parameter.
 * @template ParameterTwoType - The second type parameter.
 * @template ParameterThreeType - The third type parameter.
 * @template ParameterFourType - The fourth type parameter.
 */
export type FourParams<
    HigherKindType extends Keyof.FourParams,
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType
> =
    Registrar.FourParams<
        ParameterOneType,
        ParameterTwoType,
        ParameterThreeType,
        ParameterFourType
    >[HigherKindType];

/**
 * Apply a higher-kind type of five type parameters.
 *
 * @template ParameterOneType - The first type parameter.
 * @template ParameterTwoType - The second type parameter.
 * @template ParameterThreeType - The third type parameter.
 * @template ParameterFourType - The fourth type parameter.
 * @template ParameterFiveType - The fifth type parameter.
 */
export type FiveParams<
    HigherKindType extends Keyof.FiveParams,
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType
> =
    Registrar.FiveParams<
        ParameterOneType,
        ParameterTwoType,
        ParameterThreeType,
        ParameterFourType,
        ParameterFiveType
    >[HigherKindType];

/**
 * Apply a higher-kind type of six type parameters.
 *
 * @template ParameterOneType - The first type parameter.
 * @template ParameterTwoType - The second type parameter.
 * @template ParameterThreeType - The third type parameter.
 * @template ParameterFourType - The fourth type parameter.
 * @template ParameterFiveType - The fifth type parameter.
 * @template ParameterSixType - The sixth type parameter.
 */
export type SixParams<
    HigherKindType extends Keyof.SixParams,
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType,
    ParameterSixType
> =
    Registrar.SixParams<
        ParameterOneType,
        ParameterTwoType,
        ParameterThreeType,
        ParameterFourType,
        ParameterFiveType,
        ParameterSixType
    >[HigherKindType];

/**
 * Apply a higher-kind type of seven type parameters.
 *
 * @template ParameterOneType - The first type parameter.
 * @template ParameterTwoType - The second type parameter.
 * @template ParameterThreeType - The third type parameter.
 * @template ParameterFourType - The fourth type parameter.
 * @template ParameterFiveType - The fifth type parameter.
 * @template ParameterSixType - The sixth type parameter.
 * @template ParameterSevenType - The seventh type parameter.
 */
export type SevenParams<
    HigherKindType extends Keyof.SevenParams,
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType,
    ParameterSixType,
    ParameterSevenType
> =
    Registrar.SevenParams<
        ParameterOneType,
        ParameterTwoType,
        ParameterThreeType,
        ParameterFourType,
        ParameterFiveType,
        ParameterSixType,
        ParameterSevenType
    >[HigherKindType];

/**
 * Apply a higher-kind type of eight type parameters.
 *
 * @template ParameterOneType - The first type parameter.
 * @template ParameterTwoType - The second type parameter.
 * @template ParameterThreeType - The third type parameter.
 * @template ParameterFourType - The fourth type parameter.
 * @template ParameterFiveType - The fifth type parameter.
 * @template ParameterSixType - The sixth type parameter.
 * @template ParameterSevenType - The seventh type parameter.
 * @template ParameterEightType - The eighth type parameter.
 */
export type EightParams<
    HigherKindType extends Keyof.EightParams,
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType,
    ParameterSixType,
    ParameterSevenType,
    ParameterEightType
> =
    Registrar.EightParams<
        ParameterOneType,
        ParameterTwoType,
        ParameterThreeType,
        ParameterFourType,
        ParameterFiveType,
        ParameterSixType,
        ParameterSevenType,
        ParameterEightType
    >[HigherKindType];
