/* File:      Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    Handle,
    HandleOnce,
    IpcMainReactive,
    Off,
    On,
    Once,
    ReactiveIpcMainFunctions,
    RemoveAllListeners,
    RemoveHandler,
    Send } from "./Main.Types";
import {
    handle,
    handleOnce,
    off,
    on,
    once,
    removeAllListeners,
    removeHandler,
    send } from "./Main.Internal";

/**
 * This is the entrypoint of `electron-reactive-event` for `main`.
 *
 * @see {@link getReactiveIpcMain} for the same, but packaged with the
 * other event-emitter contents of {@link https://www.electronjs.org/docs/latest/api/ipc-main | IpcMain}.
 *
 *
 * @returns Type-safe IPC functions for sending events from `main`.
 */
export function getReactiveIpcFunctions(
): ReactiveIpcMainFunctions
{
    return {
        addListener: on as On,
        handle: handle as unknown as Handle,
        handleOnce: handleOnce as unknown as HandleOnce,
        off: off as Off,
        on: on as On,
        once: once as Once,
        removeAllListeners: removeAllListeners as RemoveAllListeners,
        removeHandler: removeHandler as RemoveHandler,
        removeListener: on as Off,
        send: send as Send
    };
}

/**
 * Get an object that replaces {@link https://www.electronjs.org/docs/latest/api/ipc-main | ipcMain's}
 * IPC functions with their respective `electron-reactive-event`, type-safe counterparts.
 *
 *
 * @returns An object that replaces {@link https://www.electronjs.org/docs/latest/api/ipc-main | ipcMain's}
 * IPC functions with their respective `electron-reactive-event`, type-safe counterparts.
 */
export function getReactiveIpcMain(): IpcMainReactive
{
    try
    {
        /* eslint-disable-next-line @typescript-eslint/no-require-imports */
        const { ipcMain } = require("electron/main");

        return {
            ...ipcMain,
            ...getReactiveIpcFunctions()
        };
    }
    catch
    {
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error("Could not import ipcMain from electron/main.  Make sure that electron is installed as a dependency.");
    }
}
