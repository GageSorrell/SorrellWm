/**
 * @file      Theme.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/no-explicit-any, jsdoc/require-jsdoc */

import type {
    TSwitchOnThemeArgument,
    TSwitchOnThemeReturnType,
    TSwitchOnUnresolvedThemeArgument,
    TSwitchOnUnresolvedThemeReturnType
} from "./Theme.Types.js";

export type TSwitchOnThemeReturnTypeOverloaded<
    ValuesType extends
        | TSwitchOnThemeArgument<any, any>
        | TSwitchOnUnresolvedThemeArgument<any, any, any>
> =
    ValuesType extends TSwitchOnUnresolvedThemeArgument<infer DarkType, infer LightType, infer SystemType>
        ? TSwitchOnUnresolvedThemeReturnType<DarkType, LightType, SystemType>
        : ValuesType extends TSwitchOnThemeArgument<infer DarkType, infer LightType>
            ? TSwitchOnThemeReturnType<DarkType, LightType>
            : never;

