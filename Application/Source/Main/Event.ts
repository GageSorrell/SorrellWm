/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type BrowserWindow, type IpcMainEvent, ipcMain } from "electron";
import type {
    FChannelTagged,
    FFrontendChannelTagged,
    FIpcBackendChannel,
    FIpcFrontendChannel,
    FIpcFrontendEvents,
    FPoorBackendEvents,
    FPoorResponseAsSuccess,
    TEventCallback,
    TGetErrorCode,
    TPoorResponseAsFailure,
    TRequest,
    TResponse } from "../Shared/Event";
import type { FRejectFunction, TResolveFunction } from "../Shared/Utility";
import { MakeTagBackend, MakeTagFrontend } from "../Shared/Event/Event";
import type { TIpcCallback, TPoorEventResponse } from "./Event.Types";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Development";

const Log: FLogger = GetLogger("Event");

/**
 * Register callbacks to respond to events received from the Renderer.
 * All calls to this should be made as early as possible in the application's
 * lifetime.
 */
export const RegisterIpcCallback = <ChannelType extends FIpcFrontendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: ChannelType,
    Callback: TEventCallback<ChannelType>
): void =>
{
    const ChannelTagged: FFrontendChannelTagged | undefined = MakeTagFrontend(BrowserWindow.id)(Channel);

    // Log(`RegisterIpcCallback: ChannelTagged == ${ ChannelTagged }`);

    if (ChannelTagged === undefined)
    {
        return;
    }

    if (ipcMain.eventNames().includes(ChannelTagged))
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Warn(`Main attempted to register IPC callback for Event ${ Channel } on window with ID ${ BrowserWindow.id }, but a callback has already been registered.`);
        return;
    }

    const Wrapper = async (_Event: IpcMainEvent, ...ArgumentVector: TArray<unknown>): Promise<void> =>
    {
        type FRequest = FIpcFrontendEvents[ChannelType]["Request"];
        // type FResponse = FIpcFrontendEvents[T]["Response"];
        type FResponse = Awaited<ReturnType<TEventCallback<ChannelType>>>;
        const Request: FRequest = ArgumentVector[0] as FRequest;
        const Response: FResponse = await Callback(Request) as FResponse;

        /* eslint-disable-next-line @stylistic/max-len */
        // Log(`Response inside Wrapper is going to be sent to the BrowserWindow.  The Response is ${ Response }.`);

        BrowserWindow.webContents.send(ChannelTagged, Response);
    };

    ipcMain.on(ChannelTagged, Wrapper);
};

export const RegisterIpcCallbacks = (
    BrowserWindow: BrowserWindow,
    IpcCallbacks: Array<TIpcCallback>
): void =>
{
    const Register = ({ Callback, Channel }: TIpcCallback): void =>
    {
        RegisterIpcCallback(BrowserWindow, Channel, Callback);
    };

    IpcCallbacks.forEach(Register);
};

/** Send an event to the Renderer, and receive a response. */
export const SendIpcEvent = <ChannelType extends FIpcBackendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: ChannelType,
    Request: TRequest<ChannelType>
): Promise<TResponse<ChannelType>> =>
{
    return new Promise<TResponse<ChannelType>>(
        (Resolve: TResolveFunction<TResponse<ChannelType>>, Reject: FRejectFunction): void =>
        {
            const ChannelTagged: FChannelTagged | undefined = MakeTagBackend(BrowserWindow.id)(Channel);

            Log(`SendIpcEvent: Attempting to fulfill message having channel ${ ChannelTagged }.`);

            if (ChannelTagged === undefined)
            {
                Reject("Channel was not tagged.");
            }

            const ChannelTaggedSafe: FChannelTagged = ChannelTagged as FChannelTagged;

            ipcMain.once(
                ChannelTaggedSafe,
                (_Event: Electron.Event, ...ArgumentVector: TArray<unknown>): void =>
                {
                    const Response: TResponse<ChannelType> = ArgumentVector[0] as TResponse<ChannelType>;
                    Resolve(Response);
                }
            );

            Log(`SendIpcEvent: ${ ChannelTagged }.`);

            BrowserWindow.webContents.send(ChannelTaggedSafe, Request);
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

export const PoorEventFailureSimple =
    <Type extends keyof FPoorBackendEvents>(): TPoorResponseAsFailure<Type> =>
    {
        return {
            Data: undefined,
            Error: ""
        };
    };

export const GetPoorResponse = <Type extends keyof FPoorBackendEvents>(
    Success: boolean
): TPoorEventResponse<Type> =>
{
    return Success
        ? PoorEventSuccess()
        : PoorEventFailureSimple();
};
