/* File:      Shared.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EventOwner, MainOwner, RendererOwner } from "../Registrar";
import type { IpcMain, IpcRenderer } from "electron";

/* eslint-disable @stylistic/max-len */

/**
 * The type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on}
 * or {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereronchannel-listener | IpcRenderer.on}
 * *et al.*
 */
export type NativeEventListener<OwnerType extends EventOwner> =
    OwnerType extends MainOwner
        ? Parameters<IpcMain["on"]>[1]
        : OwnerType extends RendererOwner
            ? Parameters<IpcRenderer["on"]>[1]
            : never;
