/* File:      Api.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { FColor } from "../Main/Core.Types";

export const GetThemeColor = async (): Promise<FColor> =>
{
    let Cleanup: (() => void) = () => { };
    const ThemeColor: FColor = await new Promise<FColor>((Resolve, Reject): void =>
    {
        window.electron.ipcRenderer.sendMessage("GetThemeColor");
        window.electron.ipcRenderer.once("GetThemeColor", (ThemeColor: FColor): void =>
        {
            console.log(`Got theme color!, ${ ThemeColor }`);
            Resolve(ThemeColor);
        });
        console.log("Sent message for GetThemeColor");
        Cleanup = window.electron.ipcRenderer.on("GetThemeColor", (ThemeColor: FColor) =>
        {
            console.log(`Got theme color!, ${ ThemeColor }`);
            Resolve(ThemeColor);
        });
    });

    Cleanup();

    console.log("ThemeColor is", ThemeColor);

    return ThemeColor;
};
