/* File:      Theme.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import {
    type BrandVariants,
    FluentProvider,
    type Theme,
    createDarkTheme,
    createLightTheme } from "@fluentui/react-components";
import { type PropsWithChildren, type ReactNode, useMemo } from "react";
import type { FHexColor } from "Windows";
import { UseSendIpcEvent, UseSendIpcEventStrict } from "@/Event";
import { getBrandTokensFromPalette } from "./FluentThemeDesigner";

const UseThemeColor = (): Readonly<[ FHexColor ]> =>
{
    const DefaultThemeColor: FHexColor = "#FF00FF";
    const { Data: ThemeColorData } = UseSendIpcEventStrict(
        "GetThemeColor",
        undefined,
        { ThemeColor: DefaultThemeColor }
    );

    return [ ThemeColorData.ThemeColor ] as const;
};

const UseSystemTheme = (): Readonly<[ theme: Theme ]> =>
{
    const { Data: IsLightModeData } = UseSendIpcEvent("GetIsLightMode", undefined);
    const IsLightMode: boolean = IsLightModeData !== undefined
        ? IsLightModeData.IsLightMode
        : true;

    const SystemTheme: Theme = useMemo((): Theme =>
    {
        const CreateTheme: (Brand: BrandVariants) => Theme = IsLightMode
            ? createLightTheme
            : createDarkTheme;

        const Brand: BrandVariants = getBrandTokensFromPalette(ThemeColor);

        const OutTheme: Theme = CreateTheme(Brand);

        /* Patch background color to have transparent background. */
        OutTheme.colorNeutralBackground1 = "#00000000";

        return OutTheme;
    }, [ IsLightMode, ThemeColor ]);

    return [ SystemTheme ] as const;
};

/** Provide Fluent UI with a custom theme based on the system's theme color and light/dark mode. */
export const FluentThemeProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ theme ] = UseSystemTheme();
    return (
        <FluentProvider { ...{ theme } }>
            { children }
        </FluentProvider>
    );
};
