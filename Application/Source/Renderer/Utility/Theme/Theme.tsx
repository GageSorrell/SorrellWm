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
import { type PropsWithChildren, type ReactNode, useEffect, useMemo, useState } from "react";
import { UseStore } from "@/Store";
import { getBrandTokensFromPalette } from "./FluentThemeDesigner";

const UseSystemTheme = (): Readonly<[ theme: Theme ]> =>
{
    const { ThemeColor } = UseStore();
    /* @TODO Replace this with the auto-generated hook once that feature has been written. */
    const [ IsLightMode, SetIsLightMode ] = useState<boolean>(false);
    useEffect((): void =>
    {
        window.electron.GetIsLightMode().then((InIsLightTheme: boolean): void =>
        {
            SetIsLightMode(InIsLightTheme);
        });
    }, [ ]);

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
