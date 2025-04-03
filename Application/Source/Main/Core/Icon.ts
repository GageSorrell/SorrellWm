/* File:      Icon.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import type { FIcon } from "./Icon.Types";
import { GetPaths } from "./Paths";
import { nativeTheme } from "electron";

export const GetIconPath = async (Icon: FIcon): Promise<string> =>
{
    const LightDarkMode: "Light" | "Dark" = nativeTheme.shouldUseDarkColors
        ? "Dark"
        : "Light";

    const Extension: ".png" | ".ico" = Icon === "Brand"
        ? ".ico"
        : ".png";

    const IconFileName: string = Icon + LightDarkMode + Extension;

    return Path.join(GetPaths().Resource, "Icon", Icon, IconFileName);
};
