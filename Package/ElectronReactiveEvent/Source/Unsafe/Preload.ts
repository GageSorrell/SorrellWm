/**
 * @file      Preload.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactiveEventContext } from "../Renderer/Provider/Provider.Types";

/**
 * Run this in your preload script to expose the IPC functions used by this package.
 * This is intended for prototyping; see the note below for more details.
 *
 * @note This exposes the raw IPC functions from
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer}.
 * Thus, this is **not** recommended for production use, as it may allow users to send events
 * that your application does not expect, which may cause unintended consequences. Instead,
 * consider exposing functions that *wrap* the IPC functions, which do not forward calls
 * that seem unusual.
 *
 */
export function exposeReactiveIpcUnsafe(): void
{
    try
    {
        /* eslint-disable-next-line @typescript-eslint/no-require-imports */
        const { contextBridge, ipcRenderer } = require("electron/renderer");

        const {
            invoke,
            off,
            on,
            once,
            send
        } = ipcRenderer;

        const Context: ReactiveEventContext["ipcRenderer"] =
            {
                invoke,
                off,
                on,
                once,
                send
            };

        contextBridge.exposeInMainWorld("ElectronReactiveEventContextUnsafe", Context);
    }
    catch
    {
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error("Could not import contextBridge, ipcRenderer from electron/renderer.  Make sure that electron is installed as a dependency.");
    }
}
