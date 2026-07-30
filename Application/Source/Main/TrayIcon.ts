/**
 * Resolves the on-disk path to SorrellWm's tray/taskbar icon, choosing between the
 * default colorful icon and a simplified glyph rendered for the current Windows theme.
 *
 * @module @sorrell/wm/Main/TrayIcon
 *
 * @file      TrayIcon.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { app } from "electron";
import { join } from "node:path";

export/** The available tray/taskbar icon presentations. */
const TrayIconVariant = Object.freeze({
    Color: "Color",
    SimplifiedDark: "SimplifiedDark",
    SimplifiedLight: "SimplifiedLight"
} as const);

/** One presentation of the tray/taskbar icon. */
export type TrayIconVariant = typeof TrayIconVariant[keyof typeof TrayIconVariant];

const TrayIconFileName: Readonly<Record<TrayIconVariant, string>> = {
    Color: "TrayIconColor.ico",
    SimplifiedDark: "TrayIconSimplifiedDark.ico",
    SimplifiedLight: "TrayIconSimplifiedLight.ico"
};

export/** Choose the icon variant for the current settings and Windows theme. */
const ResolveTrayIconVariant = (
    UseSimplifiedTrayIcon: boolean,
    IsDarkMode: boolean
): TrayIconVariant =>
{
    if (!UseSimplifiedTrayIcon)
    {
        return TrayIconVariant.Color;
    }

    return IsDarkMode ? TrayIconVariant.SimplifiedDark : TrayIconVariant.SimplifiedLight;
};

const GetResourceDirectory = (): string =>
    app.isPackaged
        ? join(process.resourcesPath, "Resource")
        : join(app.getAppPath(), "Resource");

export/** Get the on-disk `.ico` path for a tray/taskbar icon variant. */
const GetTrayIconPath = (Variant: TrayIconVariant): string =>
    join(GetResourceDirectory(), TrayIconFileName[Variant]);
