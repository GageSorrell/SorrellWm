/**
 * The context used to access the {@link \@sorrell/effect-ink/Theme | theme} provided by
 * the {@link \@sorrell/effect-ink/Runtime}.
 *
 * @module @sorrell/effect-ink/Component/Theme
 * @internal
 *
 * @file      Theme.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import type * as Theme from "../Theme.ts";

export * from "../Theme.ts";

export interface ThemeContext
{
    readonly Theme: Theme.Theme;
}

const EmptyContext: ThemeContext = { Theme: undefined as unknown as Theme.Theme } as const;

const ThemeContext: React.Context<ThemeContext> = React.createContext<ThemeContext>(EmptyContext);

export const UseTheme = (): Theme.Theme =>
{
    const { Theme } = React.useContext(ThemeContext);
    return Theme;
};

export type ThemeProviderProps = React.PropsWithChildren<ThemeContext>;

export const ThemeProvider = ({ Theme, children }: ThemeProviderProps): React.ReactNode =>
{
    const value: ThemeContext = { Theme } as const;

    return (
        <ThemeContext.Provider { ...{ value } }>
            { children }
        </ThemeContext.Provider>
    );
};
