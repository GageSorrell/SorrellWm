/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type BrowserWindow, type IpcMainEvent, ipcMain } from "electron";
import type {
    FIpcBackendChannel,
    FIpcFrontendChannel,
    FIpcFrontendEvents,
    TEventCallback,
    TRequest,
    TResponse } from "?/Event";
import { type FLogger, GetLogger } from "./Development";
import type { FRejectFunction, TResolveFunction } from "?/Utility.Types";

const Log: FLogger = GetLogger("Event");

/**
 * Register callbacks to respond to events received from the Renderer.
 * All calls to this should be made as early as possible in the application's
 * lifetime.
 */
export const RegisterIpcCallback = <T extends FIpcFrontendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: T,
    Callback: TEventCallback<FIpcFrontendEvents[T]>
): void =>
{
    if (ipcMain.eventNames().includes(Channel))
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Warn(`Main attempted to register IPC callback for Event ${ Channel }, but a callback has already been registered.`);
        return;
    }

    const Wrapper = (_Event: IpcMainEvent, ...ArgumentVector: Array<unknown>): void =>
    {
        type FRequest = FIpcFrontendEvents[T]["Request"];
        // type FResponse = FIpcFrontendEvents[T]["Response"];
        type FResponse = ReturnType<TEventCallback<FIpcFrontendEvents[T]>>;
        const Request: FRequest = ArgumentVector[0] as FRequest;
        const Response: FResponse = Callback(Request);

        BrowserWindow.webContents.send(Channel, Response);
    };

    ipcMain.on(Channel, Wrapper);
};

/** Send an event to the Renderer, and receive a response. */
export const SendIpcEvent = <T extends FIpcBackendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: T,
    Request: TRequest<T>
): Promise<TResponse<T>> =>
{
    return new Promise<TResponse<T>>(
        (Resolve: TResolveFunction<TResponse<T>>, _Reject: FRejectFunction): void =>
        {
            ipcMain.once(Channel, (_Event: Electron.Event, ...ArgumentVector: Array<unknown>): void =>
            {
                const Response: TResponse<T> = ArgumentVector[0] as TResponse<T>;
                Resolve(Response);
            });

            BrowserWindow.webContents.send(Channel, Request);
        });
};
