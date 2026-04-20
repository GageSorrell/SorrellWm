/**
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import {
    type BrandVariants,
    FluentProvider,
    type Theme,
    createDarkTheme,
    createLightTheme } from "@fluentui/react-components";
import { type CSSProperties, type PropsWithChildren, type ReactNode, useMemo } from "react";
import type { FHexColor } from "@sorrellwm/windows";
import type { FLogger } from "../../../Shared/Log.Types";
import { GetLogger } from "@/Log";
import { UseSendEvent } from "@/Event";
import { getBrandTokensFromPalette } from "./FluentThemeDesigner";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Theme");

export const UseThemeColor = (): Readonly<[ FHexColor ]> =>
{
    const DefaultThemeColor: FHexColor = "#0078D4";
    const { Data: ThemeColor } = UseSendEvent("GetThemeColor");

    Log(`ThemeColor is ${ ThemeColor }.`);

    return [ ThemeColor || DefaultThemeColor ] as const;
};

const UseIsLightMode = (): Readonly<[ boolean ]> =>
{
    const { Data: IsLightMode } = UseSendEvent("GetIsLightMode", undefined, true);

    return [ IsLightMode || false ] as const;
};

const UseSystemTheme = (): Readonly<[ theme: Theme ]> =>
{
    const [ ThemeColor ] = UseThemeColor();
    const [ IsLightMode ] = UseIsLightMode();

    const SystemTheme: Theme = useMemo((): Theme =>
    {
        const CreateTheme: (Brand: BrandVariants) => Theme = IsLightMode
            ? createLightTheme
            : createDarkTheme;

        const Brand: BrandVariants = getBrandTokensFromPalette(ThemeColor);

        const OutTheme: Theme = CreateTheme(Brand);

        /* Patch background color to have transparent background. */
        // OutTheme.colorNeutralBackground1 = "#00000000";
        OutTheme.colorCompoundBrandBackground = ThemeColor;

        return OutTheme;
    }, [ IsLightMode, ThemeColor ]);

    return [ SystemTheme ] as const;
};

/** Provide Fluent UI with a custom theme based on the system's theme color and light/dark mode. */
export const FluentThemeProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ theme ] = UseSystemTheme();

    const RootStyle: CSSProperties =
    {
        background: "none"
    };

    return (
        <FluentProvider
            style={ RootStyle }
            { ...{ theme } } >
            { children }
        </FluentProvider>
    );
};
