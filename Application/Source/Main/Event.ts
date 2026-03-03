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
    FPoorBackendEvents,
    FPoorResponseAsSuccess,
    TEventCallback,
    TGetErrorCode,
    TPoorResponseAsFailure,
    TRequest,
    TResponse } from "()/Event";
import { type FLogger, GetLogger } from "./Development";
import type { FRejectFunction, TResolveFunction } from "()/Utility";

const Log: FLogger = GetLogger("Event");

/**
 * Register callbacks to respond to events received from the Renderer.
 * All calls to this should be made as early as possible in the application's
 * lifetime.
 */
export const RegisterIpcCallback = <Type extends FIpcFrontendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: Type,
    Callback: TEventCallback<Type>
): void =>
{
    if (ipcMain.eventNames().includes(Channel))
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Warn(`Main attempted to register IPC callback for Event ${ Channel }, but a callback has already been registered.`);
        return;
    }

    const Wrapper = async (_Event: IpcMainEvent, ...ArgumentVector: Array<unknown>): Promise<void> =>
    {
        type FRequest = FIpcFrontendEvents[Type]["Request"];
        // type FResponse = FIpcFrontendEvents[T]["Response"];
        type FResponse = Awaited<ReturnType<TEventCallback<Type>>>;
        const Request: FRequest = ArgumentVector[0] as FRequest;
        const Response: FResponse = await Callback(Request) as FResponse;

        /* eslint-disable-next-line @stylistic/max-len */
        // Log(`Response inside Wrapper is going to be sent to the BrowserWindow.  The Response is ${ Response }.`);

        BrowserWindow.webContents.send(Channel, Response);
    };

    ipcMain.on(Channel, Wrapper);
};

/** Send an event to the Renderer, and receive a response. */
export const SendIpcEvent = <Type extends FIpcBackendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: Type,
    Request: TRequest<Type>
): Promise<TResponse<Type>> =>
{
    return new Promise<TResponse<Type>>(
        (Resolve: TResolveFunction<TResponse<Type>>, _Reject: FRejectFunction): void =>
        {
            ipcMain.once(Channel, (_Event: Electron.Event, ...ArgumentVector: Array<unknown>): void =>
            {
                const Response: TResponse<Type> = ArgumentVector[0] as TResponse<Type>;
                Resolve(Response);
            });

            BrowserWindow.webContents.send(Channel, Request);
            // BrowserWindow.webContents.send(Channel, JSON.stringify(Request));
        });
};

export const PoorEventSuccess = (): FPoorResponseAsSuccess =>
{
    return {
        Data: undefined,
        Error: undefined
    };
};

export const PoorEventFailure = <Type extends keyof FPoorBackendEvents>(
    Error: TGetErrorCode<Type>
): TPoorResponseAsFailure<Type> =>
{
    return {
        Data: undefined,
        Error
    };
};
