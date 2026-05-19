/**
 * @file      HigherKind.Registrar.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */

/** The registry for higher-kind types of exactly one parameter. */
export interface OneParam<ParameterOneType> { }

/** The registry for higher-kind types of exactly two parameters. */
export interface TwoParams<
    ParameterOneType,
    ParameterTwoType
> { }

/** The registry for higher-kind types of exactly three parameters. */
export interface ThreeParams<
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType
> { }

/** The registry for higher-kind types of exactly four parameters. */
export interface FourParams<
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType
> { }

/** The registry for higher-kind types of exactly five parameters. */
export interface FiveParams<
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType
> { }

/** The registry for higher-kind types of exactly six parameters. */
export interface SixParams<
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType,
    ParameterSixType
> { }

/** The registry for higher-kind types of exactly seven parameters. */
export interface SevenParams<
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType,
    ParameterSixType,
    ParameterSevenType
> { }

/** The registry for higher-kind types of exactly eight parameters. */
export interface EightParams<
    ParameterOneType,
    ParameterTwoType,
    ParameterThreeType,
    ParameterFourType,
    ParameterFiveType,
    ParameterSixType,
    ParameterSevenType,
    ParameterEightType
> { }
