/**
 * @file      Event.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// @TODO Temporary
/* eslint-disable jsdoc/require-jsdoc */

import { type BrowserWindow, type IpcMainInvokeEvent, ipcMain } from "electron";
import type {
    FLogger,
    FRejectFunction,
    TResolveFunction
} from "../../Shared";
import { GetLogger } from "#/Development";

// @TODO Temporary.
type TEventCallback<Type> = (...Arguments: Array<unknown>) => Promise<any>;
type TRequest<Type> = any;
type TResponse<Type> = any;
type TGetErrorCode<Type> = any;

type FPoorResponseAsSuccess = any;
type TPoorResponseAsFailure<Type> = any;
type FPoorBackendEvents = any;
type TPoorEventResponse<Type> = any;
type FIpcBackendChannel = string;
type FIpcFrontendEvents = any;
type FIpcFrontendChannel = string;

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
    // const ChannelTagged: FFrontendChannelTagged | undefined = MakeTagFrontend(BrowserWindow.id)(Channel);

    // Log(`RegisterIpcCallback: ChannelTagged == ${ ChannelTagged }`);

    // if (ChannelTagged === undefined)
    // {
    //     return;
    // }

    if (ipcMain.eventNames().includes(Channel))
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Warn(`Main attempted to register IPC callback for Event ${ Channel } on window with ID ${ BrowserWindow.id }, but a callback has already been registered.`);
        return;
    }

    const Wrapper = async (
        Event: IpcMainInvokeEvent,
        ...ArgumentVector: TArray<unknown>
    ): ReturnType<TEventCallback<ChannelType>> =>
    {
        type FRequest = FIpcFrontendEvents[ChannelType]["Request"];
        // type FResponse = FIpcFrontendEvents[T]["Response"];
        type FResponse = Awaited<ReturnType<TEventCallback<ChannelType>>>;
        const Request: FRequest = ArgumentVector[0] as FRequest;
        return Callback(Request) as FResponse;

        /* eslint-disable-next-line @stylistic/max-len */
        // Log(`Response inside Wrapper is going to be sent to the BrowserWindow.  The Response is ${ Response }.`);

        // BrowserWindow.webContents.send(ChannelTagged, Response);
    };

    ipcMain.handle(Channel, Wrapper);
};

export const RegisterIpcCallbacks = (
    BrowserWindow: BrowserWindow,
    IpcCallbacks: Array<any> | Readonly<Array<any>>
): void =>
{
    const Register = ({ Callback, Channel }: { Callback: any; Channel: any; }): void =>
    {
        RegisterIpcCallback(BrowserWindow, Channel, Callback);
    };

    IpcCallbacks.forEach(Register);
};

/** Send an event to the Renderer, and receive a response. */
export const SendIpcEvent = <ChannelType extends FIpcBackendChannel>(
    BrowserWindow: BrowserWindow,
    Channel: ChannelType,
    _Request: TRequest<ChannelType>
): Promise<TResponse<ChannelType>> =>
{
    return new Promise<TResponse<ChannelType>>(
        (Resolve: TResolveFunction<TResponse<ChannelType>>, Reject: FRejectFunction): void =>
        {
            // const ChannelTagged: FChannelTagged | undefined = MakeTagBackend(BrowserWindow.id)(Channel);

            // Log(`SendIpcEvent: Attempting to fulfill message having channel ${ ChannelTagged }.`);
            Log(`SendIpcEvent: Attempting to fulfill message having channel ${ Channel }.`);

            // if (ChannelTagged === undefined)
            // {
            //     Reject("Channel was not tagged.");
            // }

            // const ChannelTaggedSafe: FChannelTagged = ChannelTagged as FChannelTagged;

            const RequestId: string = crypto.randomUUID();
            const ResponseChannel: string = `${ RequestId }:Response`;

            /**
             * Where to pick up:
             *   * main --> renderer --> main ==> requires `Window.webContents.send` *and* registering
             *     a callback via `ipcMain.on` to get the reply, with custom response channel.
             *
             *   * renderer --> main --> renderer ==> simple: use `ipcMain.handle` (with return value)
             *     and `ipcRenderer.invoke` with this, the Id / GetId code can be removed, and the
             *     `UseTaggers` hook.
             */
            const Listener = (_Event: Electron.IpcMainEvent, Response: any): void =>
            {
                if (Response.RequestId !== RequestId)
                {
                    return;
                }

                ipcMain.removeListener(ResponseChannel, Listener);

                if (Response.Error !== undefined)
                {
                    Reject(new Error(Response.Error));
                    return;
                }

                Resolve(Response.Result);
            };

            ipcMain.on(ResponseChannel, Listener);

            const Request: any =
                {
                    Payload: undefined as any,
                    RequestId
                };

            BrowserWindow.webContents.send(Channel, Request);

            // BrowserWindow.webContents.send(Channel, );
            // ipcRenderer. (
            //     Channel,
            //     (_Event: Electron.Event, ...ArgumentVector: TArray<unknown>): void =>
            //     {
            //         const Response: TResponse<ChannelType> = ArgumentVector[0] as TResponse<ChannelType>;
            //         Resolve(Response);
            //     }
            // );

            // Log(`SendIpcEvent: ${ ChannelTagged }.`);

            // BrowserWindow.webContents.send(ChannelTaggedSafe, Request);
            // // BrowserWindow.webContents.send(Channel, JSON.stringify(Request));
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
