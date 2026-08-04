/**
 * Track the application's current resolved color scheme.
 *
 * @module @sorrell/wm/Renderer/UseColorScheme
 *
 * @file      UseColorScheme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "../Logging.js";
import { useEffect, useState } from "react";
import { ColorScheme } from "../../Shared/Theme.js";
import type { RendererTheme } from "../../Shared/Theme.js";

const GetInitialColorScheme = (): ColorScheme =>
    typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? ColorScheme.Dark
        : ColorScheme.Light;

export/** Track the color scheme (light/dark) currently resolved by Electron and Windows. */
const UseColorScheme = (): ColorScheme =>
{
    const [ Scheme, SetScheme ] = useState<ColorScheme>(GetInitialColorScheme);

    useEffect(() =>
    {
        let IsMounted = true;
        const StopThemeChanges = window.sorrell.theme.onChanged((Value: RendererTheme): void =>
        {
            if (IsMounted)
            {
                SetScheme(Value.ColorScheme);
            }
        });

        void window.sorrell.theme.get().then((Value: RendererTheme): void =>
        {
            if (IsMounted)
            {
                SetScheme(Value.ColorScheme);
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

    return Scheme;
};
