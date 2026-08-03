/**
 * The themed renderer root.
 *
 * @module @sorrell/wm/Renderer/Root
 *
 * @file      Root.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Logging.js";
import {
    FluentProvider,
    type Theme,
    makeStaticStyles,
    makeStyles
} from "@fluentui/react-components";
import { useEffect, useMemo, useState } from "react";
import { Application } from "./Application.js";
import { ColorScheme } from "../Shared/Theme.js";
import { CreateFluentTheme } from "./Theme.js";
import { RendererErrorBoundary } from "./RendererErrorBoundary.js";
import type { RendererTheme } from "../Shared/Theme.js";
import { Scrollbars } from "@sorrell/windows-ui";

const GetInitialRendererTheme = (): RendererTheme => ({
    AccentColor: null,
    ColorScheme: typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? ColorScheme.Dark
        : ColorScheme.Light
});

const UseGlobalStyles = makeStaticStyles({
    "#root":
    {
        minHeight: "100vh"
    },
    "*":
    {
        boxSizing: "border-box"
    },
    ":root":
    {
        fontFamily: "Inter, 'Segoe UI Variable', 'Segoe UI', sans-serif",
        fontSynthesis: "none",
        textRendering: "optimizeLegibility"
    },
    body:
    {
        margin: 0,
        minHeight: "100vh",
        minWidth: "320px"
    },
    button:
    {
        font: "inherit"
    }
});

const UseStyles = makeStyles({
    Provider:
    {
        backgroundColor: "transparent"
    },
    Scrollbars:
    {
        display: "contents"
    }
});

export/** Render the application inside a Fluent provider synchronized with the system theme. */
const Root = (): React.JSX.Element =>
{
    UseGlobalStyles();
    const Styles = UseStyles();
    const [ RendererThemeValue, SetRendererTheme ] =
        useState<RendererTheme>(GetInitialRendererTheme);

    useEffect(() =>
    {
        let IsMounted = true;
        const StopThemeChanges = window.sorrell.theme.onChanged((Value: RendererTheme): void =>
        {
            if (IsMounted)
            {
                SetRendererTheme(Value);
            }
        });

        void window.sorrell.theme.get().then((Value: RendererTheme): void =>
        {
            if (IsMounted)
            {
                SetRendererTheme(Value);
            }
        }).catch(Logging.ReportRejection(
            "Theme",
            "Could not retrieve the initial renderer theme."
        ));

        return (): void =>
        {
            IsMounted = false;
            StopThemeChanges();
        };
    }, [ ]);

    const FluentTheme: Theme = useMemo(
        () => CreateFluentTheme(RendererThemeValue),
        [ RendererThemeValue ]
    );

    return (
        <RendererErrorBoundary>
            <FluentProvider
                className={ Styles.Provider }
                theme={ FluentTheme }>
                <Scrollbars
                    className={ Styles.Scrollbars }
                    data-testid="window-scrollbars">
                    <Application />
                </Scrollbars>
            </FluentProvider>
        </RendererErrorBoundary>
    );
};
