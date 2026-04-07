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
    RemoveHandler,
    Send } from "./Main.Types";
import { handle, handleOnce, off, on, once, removeHandler, send } from "./Main.Internal";
import type { PackageKeys } from "../Internal";
import { ipcMain } from "electron/main";

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
        removeHandler: removeHandler as RemoveHandler<PackageKey>,
        removeListener: on as Off<PackageKey>,
        send: send as Send<PackageKey>
    };
}

export function getReactiveIpcMain<PackageKey extends PackageKeys>(): IpcMainReactive<PackageKey>
{
    return {
        ...ipcMain,
        ...getReactiveIpcFunctions<PackageKey>()
    };
}
