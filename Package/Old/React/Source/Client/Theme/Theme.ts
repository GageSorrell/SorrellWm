/**
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

"use client";

import type {
    FThemeData,
    FThemeUnresolved,
    TSwitchOnThemeArgument,
    TSwitchOnThemeReturnType,
    TSwitchOnUnresolvedThemeArgument,
    TSwitchOnUnresolvedThemeReturnType
} from "./Theme.Types.js";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import { type UseThemeProps, useTheme } from "next-themes";
import type { SwitchOnThemeOnSystemEmptyArgument } from "./Theme.Internal.js";
import type { TSwitchOnThemeReturnTypeOverloaded } from "./Theme.Internal.Types.js";
import { useMemo, useRef, type RefObject } from "react";

/**
 * A simple wrapper around {@link useTheme} that only considers dark, light, and system themes.
 * The {@link UseThemeProps!resolvedTheme} is renamed to {@link FThemeData!Theme}, since this
 * property is often more useful than {@link UseThemeProps!theme}, which is renamed to
 * {@link FThemeData!UnresolvedTheme}.
 *
 * @returns {FThemeData} A {@link Record} of type {@link FThemeData} containing details
 * regarding the current and supported themes.
 */
export function UseTheme(): FThemeData
{
    const {
        forcedTheme,
        resolvedTheme,
        setTheme,
        systemTheme,
        theme
    } = useTheme();

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function FormatTheme<
        InType extends string = string,
        OutType extends string = string
    >(In: InType | undefined): OutType
    {
        if (In === undefined)
        {
            return "Dark" as OutType;
        }
        else
        {
            const Conversions: Readonly<Record<Lowercase<FThemeUnresolved>, FThemeUnresolved>> =
                {
                    dark: "Dark",
                    light: "Light",
                    system: "System"
                } as const;

            return Conversions[In as keyof typeof Conversions] as OutType;
        }
    };

    return {
        ForcedTheme: forcedTheme === undefined ? undefined : FormatTheme(forcedTheme),
        SetTheme: setTheme as FThemeData["SetTheme"],
        SystemTheme: FormatTheme(systemTheme),
        Theme: FormatTheme(resolvedTheme),
        UnresolvedTheme: FormatTheme(theme)
    } as const;
}

/**
 * Define a value, conditioned on the current theme.
 *
 * @param Values - The values to return, condition on the current theme.
 *
 * @template OnDarkType - The type of the value to return iff the current theme is `"Dark"`.
 * @template OnLightType - The type of the value to return iff the current theme is `"Light"`.
 *
 * @returns {TSwitchOnThemeReturnType<typeof Values.Dark, typeof Values.Light>} The argument that
 * is selected based on the current theme.
 */
export function UseSwitchOnTheme<OnDarkType, OnLightType>(
    Values: TSwitchOnThemeArgument<OnDarkType, OnLightType>
): TSwitchOnThemeReturnType<typeof Values.Dark, typeof Values.Light>;

/**
 * Define a value, conditioned on the current theme, by providing two callbacks that give
 * the returned value.
 *
 * @param Values - The parameter-less callbacks that give the value to return,
 * conditioned on the current theme.
 *
 * @template OnDarkType - The type of the value to return iff the current theme is `"Dark"`.
 * @template OnLightType - The type of the value to return iff the current theme is `"Light"`.
 *
 * @returns {TSwitchOnThemeReturnType<typeof Values.Dark, typeof Values.Light>} The argument that
 * is selected based on the current theme.
 */
export function UseSwitchOnTheme<OnDarkType, OnLightType>(
    Values: TSwitchOnThemeArgument<OnDarkType, OnLightType>
): TSwitchOnThemeReturnType<typeof Values.Dark, typeof Values.Light>;

/**
 * Define a value, conditioned on the current {@link FThemeUnresolved | unresolved theme}.
 *
 * @param Values - The values to return, condition on the current theme.
 *
 * @template OnDarkType - The type of the value to return iff the current theme is `"Dark"`.
 * @template OnLightType - The type of the value to return iff the current theme is `"Light"`.
 * @template OnSystemType - The type of the value to return iff the current theme is `"System"`.
 *
 * @returns {
 *     TSwitchOnUnresolvedThemeReturnType<typeof Values.Dark, typeof Values.Light, typeof Values.System>
 * } The
 * argument that is selected based on the current theme.
 */
export function UseSwitchOnTheme<OnDarkType, OnLightType, OnSystemType>(
    Values: TSwitchOnUnresolvedThemeArgument<OnDarkType, OnLightType, OnSystemType>
): TSwitchOnUnresolvedThemeReturnType<typeof Values.Dark, typeof Values.Light, typeof Values.System>;

/**
 * Define a value, conditioned on the current theme, by providing a callback for each
 * of the {@link FThemeUnresolved | possible unresolved themes}.
 *
 * @param Values - The parameter-less callbacks that give the value to return,
 * conditioned on the current theme.
 *
 * @template OnDarkType - The type of the value to return iff the current theme is `"Dark"`.
 * @template OnLightType - The type of the value to return iff the current theme is `"Light"`.
 * @template OnSystemType - The type of the value to return iff the current theme is `"System"`.
 *
 * @returns {
 *     TSwitchOnUnresolvedThemeReturnType<typeof Values.Dark, typeof Values.Light, typeof Values.System>
 * } The argument that is selected based on the current theme.
 */
export function UseSwitchOnTheme<OnDarkType, OnLightType, OnSystemType>(
    Values: TSwitchOnUnresolvedThemeArgument<OnDarkType, OnLightType, OnSystemType>
): TSwitchOnUnresolvedThemeReturnType<typeof Values.Dark, typeof Values.Light, typeof Values.System>;

export function UseSwitchOnTheme<
    OnDarkType,
    OnLightType,
    OnSystemType = typeof SwitchOnThemeOnSystemEmptyArgument
>(
    Values:
        | TSwitchOnThemeArgument<OnDarkType, OnLightType>
        | TSwitchOnUnresolvedThemeArgument<OnDarkType, OnLightType, OnSystemType>
): TSwitchOnThemeReturnTypeOverloaded<typeof Values>
{
    type ThisReturnType = TSwitchOnThemeReturnTypeOverloaded<typeof Values>;

    // const { Theme: ResolvedTheme, UnresolvedTheme } = UseTheme();
    const MyTheme = UseTheme();
    const { Theme: ResolvedTheme, UnresolvedTheme } = MyTheme;

    const Logged: RefObject<number> = useRef<number>(0);

    if (Logged.current < 2)
    {
        Logged.current += 1;
        console.log(`UseSwitchOnTheme: ${ Logged.current }th Time Logged:`);
        console.dir(MyTheme);
    }

    const Theme: FThemeUnresolved = "System" in Values
        ? UnresolvedTheme
        : ResolvedTheme;

    return useMemo((): ThisReturnType =>
    {
        /* eslint-disable @typescript-eslint/no-unsafe-function-type */

        if (typeof Values.Dark === "function")
        {
            /* Then all properties of `Values` are functions as well,       *
             * which is guaranteed by the typed signature of this function. */

            if (Theme === "Dark")
            {
                return [ (Values.Dark as Function)() ] as const as ThisReturnType;
            }
            else if (Theme === "Light")
            {
                return [ (Values.Light as Function)() ] as const as ThisReturnType;
            }
            {
                return [ (Values as { System: Function; }).System() ] as const as ThisReturnType;
            }
        }
        else
        {
            if (Theme === "Dark")
            {
                return [ Values.Dark ] as const as ThisReturnType;
            }
            else if (Theme === "Light")
            {
                return [ Values.Light ] as const as ThisReturnType;
            }
            else
            {
                return [ (Values as { System: unknown; }).System ] as const as ThisReturnType;
            }
        }

        /* eslint-enable @typescript-eslint/no-unsafe-function-type */
    }, [ Theme, Values ]);
}

