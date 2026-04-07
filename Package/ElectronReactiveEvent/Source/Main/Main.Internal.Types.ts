/* File:      Main.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcMain } from "electron";

export type NativeHandlerListener = Parameters<IpcMain["handle"]>[1];

export type NativeEventListener = Parameters<IpcMain["on"]>[1];
