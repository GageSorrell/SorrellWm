/**
 * @file      Theme.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Dispatch, SetStateAction } from "react";
import type { SwitchOnThemeOnSystemEmptyArgument } from "./Theme.Internal.js";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { UseSwitchOnTheme } from "./Theme.js";

/** The possible themes to which the client can resolve. */
export type FTheme =
    | "Dark"
    | "Light";

/**
 * The possible themes, including the unresolved `"System"` theme.
 */
export type FThemeUnresolved =
    | FTheme
    | "System";

/**
 * Based on {@link UseThemeProps}, this makes some sensible changes, the most notable
 * being that {@link FThemeData!Theme} defaults to `"Dark"` iff {@link useTheme} returns
 * {@link UseThemeProps.theme} that is `undefined` (*i.e.*, the {@link UseTheme} hook
 * defaults to the `"Dark"` theme, and does so by replacing `undefined` in {@link FThemeData!Theme}
 * with `"Dark"`).
 *
 * @property {FTheme} Theme - The current {@link FTheme | theme}.
 *
 * @property {FTheme | undefined} ForcedTheme - Forced theme name for the current page.
 *
 * @property {Dispatch<SetStateAction<FTheme>>} SetTheme - Update the current theme.
 *
 * @property {FThemeUnresolved} UnresolvedTheme - If `enableSystem` is true and the active theme is "system",
 * this returns whether the system preference resolved to "dark" or "light".
 * Otherwise, this is identical to {@link Theme}.
 *
 * @property {FTheme | undefined} SystemTheme - If {@link ThemeProviderProps!enableSystem} is `true`, then
 * this is the System theme preference ("dark" or "light"), regardless what the active theme is.
 */
export type FThemeData =
    Readonly<{
        ForcedTheme: FTheme | undefined;
        Theme: FTheme;
        SetTheme: Dispatch<SetStateAction<FTheme>>;
        SystemTheme: FTheme | undefined;
        UnresolvedTheme: FThemeUnresolved;
    }>;

/* eslint-disable jsdoc/informative-docs */

/**
 * The return type of {@link UseSwitchOnTheme}.  If the arguments are functions,
 * then this is the `readonly` tuple-type containing the union of the respective
 * {@link ReturnType | ReturnTypes} of those functions.  Otherwise, it is the
 * `readonly` tuple-type containing the union of the argument types.
 *
 * @template OnDarkArgumentType - The type of the argument `OnDark`.
 * @template OnLightArgumentType - The type of the argument `OnLight`.
 */
export type TSwitchOnThemeReturnType<
    OnDarkArgumentType,
    OnLightArgumentType
> =
    OnDarkArgumentType extends () => infer OnDarkReturnType
        ? OnLightArgumentType extends () => infer OnLightReturnType
            ? readonly [
                | OnDarkReturnType
                | OnLightReturnType
            ]
            : never
        : OnLightArgumentType extends () => unknown
            ? never
            : readonly [
                | OnDarkArgumentType
                | OnLightArgumentType
            ];

/**
 * The return type of {@link UseSwitchOnTheme} when the given argument is a
 * {@link TSwitchOnUnresolvedThemeArgument} .  If the arguments are functions,
 * then this is the `readonly` tuple-type containing the union of the respective
 * {@link ReturnType | ReturnTypes} of those functions.  Otherwise, it is the
 * `readonly` tuple-type containing the union of the argument types.
 *
 * @template OnDarkArgumentType - The type of the argument `OnDark`.
 * @template OnLightArgumentType - The type of the argument `OnLight`.
 * @template OnSystemArgumentType - The type of the argument `OnSystem`.
 */
export type TSwitchOnUnresolvedThemeReturnType<
    OnDarkArgumentType,
    OnLightArgumentType,
    OnSystemArgumentType = typeof SwitchOnThemeOnSystemEmptyArgument
> =
    OnDarkArgumentType extends () => infer OnDarkReturnType
        ? OnLightArgumentType extends () => infer OnLightReturnType
            ? OnSystemArgumentType extends () => infer OnSystemReturnType
                ? readonly [
                    | OnDarkReturnType
                    | OnLightReturnType
                    | OnSystemReturnType
                ]
                : readonly [
                    | OnDarkReturnType
                    | OnLightReturnType
                ]
            : never
        : OnLightArgumentType extends () => unknown
            ? never
            : OnSystemArgumentType extends () => unknown
                ? never
                : OnSystemArgumentType extends typeof SwitchOnThemeOnSystemEmptyArgument
                    ? readonly [
                        | OnDarkArgumentType
                        | OnLightArgumentType
                    ]
                    : readonly [
                        | OnDarkArgumentType
                        | OnLightArgumentType
                        | OnSystemArgumentType
                    ];

/**
 * A {@link Record} that specifies, for each {@link FThemeUnresolved | possible current theme},
 * a value or parameter-less callback to retrieve a value for the current theme.
 *
 * @template OnDarkArgumentType - The type of the argument `OnDark`.
 * @template OnLightArgumentType - The type of the argument `OnLight`.
 */
export type TSwitchOnThemeArgument<
    OnDarkArgumentType,
    OnLightArgumentType
> =
    Readonly<{
        Dark: OnDarkArgumentType;
        Light: OnLightArgumentType;
    }>;

/**
 * A {@link Record} that specifies, for each {@link FThemeUnresolved | possible unresolved theme},
 * a value or parameter-less callback to retrieve a value for the current theme.
 *
 * @template OnDarkArgumentType - The type of the argument `OnDark`.
 * @template OnLightArgumentType - The type of the argument `OnLight`.
 * @template OnSystemArgumentType - The type of the argument `OnSystem`.
 */
export type TSwitchOnUnresolvedThemeArgument<
    OnDarkArgumentType,
    OnLightArgumentType,
    OnSystemArgumentType
> =
    TSwitchOnThemeArgument<OnDarkArgumentType, OnLightArgumentType> &
    Readonly<{
        System: OnSystemArgumentType;
    }>;

/* eslint-enable jsdoc/informative-docs */
