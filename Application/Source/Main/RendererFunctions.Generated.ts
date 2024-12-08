/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import { ipcMain } from "electron"
import { GetFocusedWindow, type HWindow } from "@sorrellwm/windows";

ipcMain.handle("GetFocusedWindow", (): Promise<HWindow> =>
{
    return Promise.resolve(GetFocusedWindow());
});
