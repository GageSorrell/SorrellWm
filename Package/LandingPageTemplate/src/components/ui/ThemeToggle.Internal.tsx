/**
 * @file      ThemeToggle.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Monitor, Moon, Sun } from "lucide-react";
import type { FIcon } from "./ThemeToggle.Internal.Types";
import type { FTheme } from "./ThemeToggle.Types";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";

/* eslint-disable jsdoc/require-jsdoc */

export function GetPolygonCollapsed(
    DeltaX: number,
    DeltaY: number,
    VertexCount: number
): string
{
    const Pairs: string = Array.from(
        { length: VertexCount },
        () => `${ DeltaX }px ${ DeltaY }px`
    ).join(", ");
    return `polygon(${ Pairs })`;
}

export function GetThemeTransitionClipPaths(
    DeltaX: number,
    DeltaY: number,
    MaxRadius: number
): [ string, string ]
{
    const Radius: number = MaxRadius * Math.SQRT2;
    const End: string =
        [
            `${ DeltaX }px ${ DeltaY - Radius }px`,
            `${ DeltaX + Radius }px ${ DeltaY }px`,
            `${ DeltaX }px ${ DeltaY + Radius }px`,
            `${ DeltaX - Radius }px ${ DeltaY }px`
        ].join(", ");

    return [ GetPolygonCollapsed(DeltaX, DeltaY, 4), `polygon(${End})` ];
}

export function ThemeIcon(): ReactNode
{
    const { theme: Theme } = useTheme();

    const Out: FIcon =
        {
            dark: Moon,
            light: Sun,
            system: Monitor
        }[(Theme || "system") as FTheme];

    return <Out />;
};
