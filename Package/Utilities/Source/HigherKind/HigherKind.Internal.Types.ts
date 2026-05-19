/**
 * @file      HigherKind.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-explicit-any, jsdoc/require-jsdoc */

import type * as Registrar from "./HigherKind.Registrar.Types.ts";

export namespace Keyof
{
    export type OneParam = keyof Registrar.OneParam<any>;
    export type TwoParams = keyof Registrar.TwoParams<any, any>;
    export type ThreeParams = keyof Registrar.ThreeParams<any, any, any>;
    export type FourParams = keyof Registrar.FourParams<any, any, any, any>;
    export type FiveParams = keyof Registrar.FiveParams<any, any, any, any, any>;
    export type SixParams = keyof Registrar.SixParams<any, any, any, any, any, any>;
    export type SevenParams = keyof Registrar.SevenParams<any, any, any, any, any, any, any>;
    export type EightParams = keyof Registrar.EightParams<any, any, any, any, any, any, any, any>;
}

export type Keyof =
    | Keyof.OneParam
    | Keyof.TwoParams
    | Keyof.ThreeParams
    | Keyof.FourParams
    | Keyof.FiveParams
    | Keyof.SixParams
    | Keyof.SevenParams
    | Keyof.EightParams;

export namespace ParameterVector
{
    export type OneParam = [ unknown ];
    export type TwoParams = [ unknown, unknown ];
    export type ThreeParams = [ unknown, unknown, unknown ];
    export type FourParams = [ unknown, unknown, unknown, unknown ];
    export type FiveParams = [ unknown, unknown, unknown, unknown, unknown ];
    export type SixParams = [ unknown, unknown, unknown, unknown, unknown, unknown ];
    export type SevenParams = [ unknown, unknown, unknown, unknown, unknown, unknown, unknown ];
    export type EightParams = [ unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown ];
}

export type ParameterVector =
    | ParameterVector.OneParam
    | ParameterVector.TwoParams
    | ParameterVector.ThreeParams
    | ParameterVector.FourParams
    | ParameterVector.FiveParams
    | ParameterVector.SixParams
    | ParameterVector.SevenParams
    | ParameterVector.EightParams;
