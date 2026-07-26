/**
 * Theme primitives for Ink UI components.
 *
 * @module @sorrell/ink-ui/Theme
 *
 * @file      Theme.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import type * as Ink from "ink";
import type { ButtonAppearance } from "./Button/Button.js";

export type ButtonStyleState = "Default" | "Disabled" | "Focused" | "Hovered" | "Pressed";

/** Visual properties a theme can assign to one Button state. */
export interface ButtonVisualStyle
{
    readonly BackgroundColor?: string | undefined;
    readonly Bold?: boolean | undefined;
    readonly BorderColor?: string | undefined;
    readonly BorderStyle?: Ink.BoxProps["borderStyle"] | "compact" | undefined;
    readonly Color?: string | undefined;
    readonly DimColor?: boolean | undefined;
    readonly PaddingX?: number | undefined;
    readonly PaddingY?: number | undefined;
}

/** State styles for one Button appearance. Unspecified fields inherit from Default. */
export type ButtonAppearanceTheme = {
    readonly [State in ButtonStyleState]?: ButtonVisualStyle
};

/** Appearance-specific Button styles supplied by a theme. */
export type ButtonTheme = {
    readonly [Appearance in ButtonAppearance]?: ButtonAppearanceTheme
};

/** Colors used consistently by every Ink UI component. */
export interface Theme
{
    readonly Background: string;
    readonly BackgroundElement: string;
    readonly BackgroundPanel: string;
    readonly Border: string;
    readonly BorderActive: string;
    readonly Button?: ButtonTheme | undefined;
    readonly Error: string;
    readonly Info: string;
    readonly Name: string;
    readonly Primary: string;
    readonly Secondary: string;
    readonly Success: string;
    readonly Text: string;
    readonly TextMuted: string;
    readonly Warning: string;
}

type ThemeColors = Omit<Theme, "Button">;

function CompleteTheme(Colors: ThemeColors): Theme
{
    return Object.freeze({
        ...Colors,
        Button: CreateButtonTheme(Colors)
    });
}

/** Create palette-derived defaults for every Button appearance and state. */
export function CreateButtonTheme(ThemeValue: ThemeColors): Required<ButtonTheme>
{
    const Disabled: ButtonVisualStyle = {
        BackgroundColor: ThemeValue.BackgroundElement,
        BorderColor: ThemeValue.Border,
        Color: ThemeValue.TextMuted,
        DimColor: true
    };
    const Base: ButtonVisualStyle = {
        BorderStyle: "round",
        PaddingX: 1,
        PaddingY: 0
    };

    return {
        outline: {
            Default: { ...Base, BorderColor: ThemeValue.Border, Color: ThemeValue.Text },
            Disabled: { ...Disabled, BackgroundColor: undefined },
            Focused: { BorderColor: ThemeValue.Primary, Color: ThemeValue.Primary },
            Hovered: { BorderColor: ThemeValue.BorderActive, Color: ThemeValue.Info },
            Pressed: { BorderColor: ThemeValue.Secondary, Color: ThemeValue.Secondary }
        },
        primary: {
            Default: {
                ...Base,
                BackgroundColor: ThemeValue.Primary,
                Bold: true,
                BorderColor: ThemeValue.Primary,
                Color: ThemeValue.Background
            },
            Disabled,
            Focused: {
                BackgroundColor: ThemeValue.Secondary,
                BorderColor: ThemeValue.Info,
                Color: ThemeValue.Background
            },
            Hovered: {
                BackgroundColor: ThemeValue.Info,
                BorderColor: ThemeValue.Info,
                Color: ThemeValue.Background
            },
            Pressed: {
                BackgroundColor: ThemeValue.Success,
                BorderColor: ThemeValue.Success,
                Color: ThemeValue.Background
            }
        },
        secondary: {
            Default: {
                ...Base,
                BackgroundColor: ThemeValue.BackgroundElement,
                BorderColor: ThemeValue.Border,
                Color: ThemeValue.Text
            },
            Disabled,
            Focused: { BorderColor: ThemeValue.Primary, Color: ThemeValue.Primary },
            Hovered: {
                BackgroundColor: ThemeValue.BackgroundPanel,
                BorderColor: ThemeValue.BorderActive,
                Color: ThemeValue.Info
            },
            Pressed: {
                BackgroundColor: ThemeValue.Primary,
                BorderColor: ThemeValue.Primary,
                Color: ThemeValue.Background
            }
        },
        subtle: {
            Default: { ...Base, BorderStyle: undefined, Color: ThemeValue.TextMuted },
            Disabled: { Color: ThemeValue.TextMuted, DimColor: true },
            Focused: { BackgroundColor: ThemeValue.BackgroundElement, Color: ThemeValue.Primary },
            Hovered: { BackgroundColor: ThemeValue.BackgroundPanel, Color: ThemeValue.Text },
            Pressed: { BackgroundColor: ThemeValue.BackgroundElement, Color: ThemeValue.Secondary }
        },
        transparent: {
            Default: { ...Base, BorderStyle: undefined, Color: ThemeValue.Text },
            Disabled: { Color: ThemeValue.TextMuted, DimColor: true },
            Focused: { Color: ThemeValue.Primary },
            Hovered: { Color: ThemeValue.Secondary },
            Pressed: { Color: ThemeValue.Info }
        }
    };
}

/** Resolve a Button style, including partial theme overrides and state inheritance. */
export function ResolveButtonStyle(
    ThemeValue: Theme,
    Appearance: ButtonAppearance,
    State: ButtonStyleState
): ButtonVisualStyle
{
    const Defaults: ButtonAppearanceTheme = CreateButtonTheme(ThemeValue)[Appearance];
    const Overrides: ButtonAppearanceTheme | undefined = ThemeValue.Button?.[Appearance];
    return {
        ...Defaults.Default,
        ...Defaults[State],
        ...Overrides?.Default,
        ...Overrides?.[State]
    };
}

/** The default dark theme. */
export const DefaultTheme: Theme = CompleteTheme({
    Background: "#1f2335",
    BackgroundElement: "#292e42",
    BackgroundPanel: "#24283b",
    Border: "#3b4261",
    BorderActive: "#7aa2f7",
    Error: "#f7768e",
    Info: "#7dcfff",
    Name: "Tokyo Night",
    Primary: "#7aa2f7",
    Secondary: "#bb9af7",
    Success: "#9ece6a",
    Text: "#c0caf5",
    TextMuted: "#565f89",
    Warning: "#e0af68"
});

export/**
       * Curated themes.
       *
       * @see {@link https://github.com/wilfredinni/noodle} Themes are lifted from `noodle`.
       */
const Themes: ReadonlyArray<Theme> = Object.freeze([
    DefaultTheme,
    CompleteTheme({
        Background: "#303446",
        BackgroundElement: "#414559",
        BackgroundPanel: "#363A4F",
        Border: "#51576D",
        BorderActive: "#8CAAEE",
        Error: "#E78284",
        Info: "#85C1DC",
        Name: "Catppuccin Frappé",
        Primary: "#8CAAEE",
        Secondary: "#CA9EE6",
        Success: "#A6D189",
        Text: "#C6D0F5",
        TextMuted: "#838BA7",
        Warning: "#E5C890"
    }),
    CompleteTheme({
        Background: "#2d353b",
        BackgroundElement: "#3d484d",
        BackgroundPanel: "#343f44",
        Border: "#475258",
        BorderActive: "#a7c080",
        Error: "#e67e80",
        Info: "#7fbbb3",
        Name: "Everforest",
        Primary: "#a7c080",
        Secondary: "#d699b6",
        Success: "#83c092",
        Text: "#d3c6aa",
        TextMuted: "#859289",
        Warning: "#dbbc7f"
    }),
    CompleteTheme({
        Background: "#15141b",
        BackgroundElement: "#29263c",
        BackgroundPanel: "#1f1d2e",
        Border: "#403d52",
        BorderActive: "#a277ff",
        Error: "#ff6767",
        Info: "#61ffca",
        Name: "Aura",
        Primary: "#a277ff",
        Secondary: "#f694ff",
        Success: "#61ffca",
        Text: "#edecee",
        TextMuted: "#6d6d6d",
        Warning: "#ffca85"
    }),
    CompleteTheme({
        Background: "#0d1117",
        BackgroundElement: "#21262d",
        BackgroundPanel: "#161b22",
        Border: "#30363d",
        BorderActive: "#58a6ff",
        Error: "#f85149",
        Info: "#79c0ff",
        Name: "GitHub Dark",
        Primary: "#58a6ff",
        Secondary: "#bc8cff",
        Success: "#3fb950",
        Text: "#c9d1d9",
        TextMuted: "#8b949e",
        Warning: "#d29922"
    })
]);

const Context = React.createContext<Theme>(DefaultTheme);

/** {@inheritDoc ThemeProvider} */
export interface ThemeProviderProps extends React.PropsWithChildren
{
    readonly Theme?: Theme;
}

export/**
       * Provides a consistent color theme to descendant terminal components.
       *
       * @category Theme
       * @since 1.0.0
       */
const ThemeProvider = ({
    children,
    Theme: ThemeValue = DefaultTheme
}: ThemeProviderProps): React.ReactNode => (
    <Context.Provider value={ ThemeValue }>{ children }</Context.Provider>
);

export/**
       * Reads the nearest Ink UI theme.
       *
       * @category Theme
       * @since 1.0.0
       */
const useTheme = (): Theme => React.useContext(Context);
