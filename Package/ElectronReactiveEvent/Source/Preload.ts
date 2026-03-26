/* File:      Preload.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererFunctions } from "./index.js";

/**
 * Exposes the necessary `ipcRenderer` functions to the `renderer`.
 *
 * @param ipcRendererFunctions *(Optional)* Provide wrappers for the necessary `ipcRenderer` functions.
 */
export function preloadElectronReactiveEvent(ipcRendererFunctions?: IpcRendererFunctions)
{
    ipcRendererFunctions = (ipcRendererFunctions !== undefined)
        ? ipcRendererFunctions
        : {
            invoke: ipcRenderer.invoke,
            off: ipcRenderer.off,
            on: ipcRenderer.on,
            once: ipcRenderer.once,
            send: ipcRenderer.send
        };

    contextBridge.exposeInMainWorld("electronReactiveEvent", ipcRendererFunctions);
}
