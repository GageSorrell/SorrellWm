/**
 * @file      Main.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IpcMain } from "electron";

/**
 * The type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener | IpcMain.handle}
 * *et al.*
 */
export type NativeHandlerListener = Parameters<IpcMain["handle"]>[1];
