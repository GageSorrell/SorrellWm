/**
 * @file      Icon.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import * as Path from "path";
import type { FIcon, FIconExtension } from "./Icon.Types";
import { type NativeImage, nativeImage, nativeTheme } from "electron";
import { GetPath } from "./Path";

export const GetIconPath = (Icon: FIcon, Extension: FIconExtension = "PNG"): string =>
{
    const LightDarkMode: "Light" | "Dark" = nativeTheme.shouldUseDarkColors
        ? "Dark"
        : "Light";

    const IconFileName: string = Icon + LightDarkMode + "." + Extension.toLowerCase();

    return Path.resolve(GetPath("Resource"), "Icon", Icon, IconFileName);
};

export const GetIcon = (Icon: FIcon, Extension: FIconExtension = "PNG"): NativeImage =>
{
    return nativeImage.createFromPath(GetIconPath(Icon, Extension));
};

