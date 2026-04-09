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
    ReactiveEventFunctions,
    RemoveAllListeners,
    RemoveHandler,
    Send } from "./Main.Types";
import { handle, handleOnce, off, on, once, removeAllListeners, removeHandler, send } from "./Main.Internal";
import type { PackageKeys } from "../Internal";
import { ipcMain } from "electron/main";

/**
 * This is the entrypoint of `electron-reactive-event` for `main`.
 *
 * @see {@link getReactiveIpcMain} for the same, but packaged with the
 * other event-emitter contents of {@link https://www.electronjs.org/docs/latest/api/ipc-main | IpcMain}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 *
 * @returns Type-safe IPC functions for sending events from `main`.
 */
export function getReactiveIpcFunctions<PackageKey extends PackageKeys>(
): ReactiveEventFunctions<PackageKey>
{
    return {
        addListener: on as On<PackageKey>,
        handle: handle as Handle<PackageKey>,
        handleOnce: handleOnce as HandleOnce<PackageKey>,
        off: off as Off<PackageKey>,
        on: on as On<PackageKey>,
        once: once as Once<PackageKey>,
        removeAllListeners: removeAllListeners as RemoveAllListeners<PackageKey>,
        removeHandler: removeHandler as RemoveHandler<PackageKey>,
        removeListener: on as Off<PackageKey>,
        send: send as Send<PackageKey>
    };
}

/**
 * Get an object that replaces {@link https://www.electronjs.org/docs/latest/api/ipc-main | IpcMain's}
 * IPC functions with their respective `electron-reactive-event`, type-safe counterparts.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 *
 * @returns An object that replaces {@link https://www.electronjs.org/docs/latest/api/ipc-main | IpcMain's}
 * IPC functions with their respective `electron-reactive-event`, type-safe counterparts.
 */
export function getReactiveIpcMain<PackageKey extends PackageKeys>(): IpcMainReactive<PackageKey>
{
    return {
        ...ipcMain,
        ...getReactiveIpcFunctions<PackageKey>()
    };
}
