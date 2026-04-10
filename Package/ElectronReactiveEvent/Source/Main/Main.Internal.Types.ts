/* File:      Main.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcMain } from "electron";

/**
 * The type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener | IpcMain.handle}
 * *et al.*
 */
export type NativeHandlerListener = Parameters<IpcMain["handle"]>[1];

/**
 * The type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on}
 * *et al.*
 */
export type NativeEventListener = Parameters<IpcMain["on"]>[1];
