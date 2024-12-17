/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import { ipcMain } from "electron"
import { GetFocusedWindow, GetIsLightMode, GetThemeColor, type HWindow, type FHexColor } from "@sorrellwm/windows";

ipcMain.handle("GetFocusedWindow", (): Promise<HWindow> =>
{
    return Promise.resolve(GetFocusedWindow());
});

ipcMain.handle("GetIsLightMode", (): Promise<boolean> =>
{
    return Promise.resolve(GetIsLightMode());
});

ipcMain.handle("GetThemeColor", (): Promise<FHexColor> =>
{
    return Promise.resolve(GetThemeColor());
});
