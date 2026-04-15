/* File:      Renderer.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcRendererReactive, ReactiveIpcRendererFunctions } from "./Renderer.Types";
import type { PackageKeys } from "../Registrar";
import type { ReactiveEventContext } from "./Provider";

/**
 * Get an object that replaces {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | ipcRenderer's}
 * IPC functions with their respective `electron-reactive-event`, type-safe counterparts.
 * If you are using `react` in the `renderer` then do *not* use this, and instead use
 * {@link ReactiveEventProvider} *et al.*
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 *
 * @param ipcFunctions - The exposed (preferably *wrapped*) functions from
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | ipcRenderer}, exposed
 * via a `preload` script.
 *
 * @returns An object that replaces
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | ipcRenderer's} IPC functions with their
 * respective `electron-reactive-event`, type-safe counterparts.
 */
export function getReactiveIpcRenderer<PackageKey extends PackageKeys>(
    ipcFunctions: ReactiveEventContext["ipcRenderer"]
): IpcRendererReactive<PackageKey>
{
    try
    {
        /* eslint-disable-next-line @typescript-eslint/no-require-imports */
        const { ipcRenderer } = require("electron/renderer");

        return {
            ...ipcRenderer,
            ...(ipcFunctions as ReactiveIpcRendererFunctions<PackageKey>)
        };
    }
    catch
    {
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error("Could not import ipcMain from electron/main.  Make sure that electron is installed as a dependency.");
    }
}
