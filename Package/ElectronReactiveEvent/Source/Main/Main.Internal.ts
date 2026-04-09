/* File:      Main.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { BrowserWindow, type IpcMainEvent } from "electron";
import type { Handler, HandlerInternal, Listener, RawResponse, Request } from "../Listener/index.js";
import { type IpcMainInvokeEvent, ipcMain } from "electron/main";
import type { MainOwner, RendererOwner } from "../Decl/Decl.Types";
import type { Channel } from "../Channel";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";
import type { NativeEventListener } from "./Main.Internal.Types";
import type { PackageKeys } from "../Internal";
import { ReactiveEventErrorInternal } from "../Error/Error.Internal";

/**
 * @inheritdoc Handle:Signature
 * @group Internal
 */
export function handle<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    channel: ChannelType,
    handler: Handler<PackageKey, typeof channel>
): void
{
    HandleBase(ipcMain.handle, channel, handler);
}

/* eslint-disable @stylistic/max-len */

/**
 * An abstraction that simplifies the implementation of {@link handle} and {@link handleOnce}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param IpcFunction - The function (either
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener | ipcMain.handle}
 * or {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandleoncechannel-listener | ipcMain.handleOnce})
 * that this function will call.
 * @param Channel - The channel to which the {@link Handler} will be subscribed.
 * @param Handler - The callback function that will be subscribed to the event given by {@link Channel}.
 *
 * @group Internal
 */
function HandleBase<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    IpcFunction: typeof ipcMain.handle | typeof ipcMain.handleOnce,
    Channel: ChannelType,
    Handler: Handler<PackageKey, typeof Channel>
): void
{
    /* eslint-enable @stylistic/max-len */
    type WrapperReturnType = Awaited<ReturnType<typeof Handler>>;

    // eslint-disable-next-line jsdoc/require-jsdoc
    async function ListenerWrapper(
        Event: IpcMainInvokeEvent,
        ...ArgumentVector: Array<unknown>
    ): Promise<WrapperReturnType>
    {
        type ThisRequest = Request<PackageKey, RendererOwner, typeof Channel>;
        type ThisRawResponse = RawResponse<PackageKey, typeof Channel>;
        const RawResponse: ThisRawResponse =
            await (Handler as HandlerInternal<PackageKey, typeof Channel>)(
                Event,
                (ArgumentVector[0] as ThisRequest)
            );

        if (RawResponse instanceof ReactiveEventErrorInternal)
        {
            const error: unknown =
                RawResponse.Payload !== EmptyOverloadParameterValue
                    ? {
                        message: RawResponse.Message,
                        payload: RawResponse.Payload
                    }
                    : {
                        message: RawResponse.Message
                    };

            return {
                data: undefined,
                error
            } as WrapperReturnType;
        }
        else
        {
            return {
                data: RawResponse,
                error: undefined
            } as WrapperReturnType;
        }
    }

    IpcFunction(Channel, ListenerWrapper);
}

/**
 * @inheritdoc RemoveHandler:Signature
 * @group Internal
 */
export function removeHandler<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    channel: ChannelType
): void
{
    ipcMain.removeHandler(channel);
}

/* eslint-disable @stylistic/max-len */

/**
 * @inheritdoc HandleOnce:Signature
 * @group Internal
 */
export function handleOnce<
    /* eslint-enable @stylistic/max-len */
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    channel: ChannelType,
    listener: Handler<PackageKey, typeof channel>
): void
{
    HandleBase(ipcMain.handleOnce, channel, listener);
}

/**
 * @inheritdoc Off:Signature
 * @group Internal
 */
export function off<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, IpcMainEvent, typeof channel>
): void
{
    ipcMain.off(channel, listener as NativeEventListener);
}

/**
 * @inheritdoc RemoveAllListeners:Signature
 * @group Internal
 */
export function removeAllListeners<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>
>(
    channel?: ChannelType
): void
{
    ipcMain.removeAllListeners(channel);
}

/**
 * @inheritdoc On:Signature
 * @group Internal
 */
export function on<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, IpcMainEvent, typeof channel>
): void
{
    ipcMain.on(channel, listener as NativeEventListener);
}

/**
 * @inheritdoc Once:Signature
 * @group Internal
 */
export function once<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, IpcMainEvent, typeof channel>
): void
{
    ipcMain.once(channel, listener as NativeEventListener);
}

/**
 * @inheritdoc Send:NoRequestSingular
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
    browserWindow: BrowserWindow,
    channel: ChannelType
): void;
/**
 * @inheritdoc Send:RequestSingular
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Request<PackageKey, MainOwner>>(
    browserWindow: BrowserWindow,
    channel: ChannelType,
    request: Request<PackageKey, MainOwner, typeof channel>
): void;
/**
 * @inheritdoc Send:NoRequestPlural
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
    browserWindows: Array<BrowserWindow>,
    channel: ChannelType
): void;
/**
 * @inheritdoc Send:RequestPlural
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Request<PackageKey, MainOwner>>(
    browserWindows: Array<BrowserWindow>,
    channel: ChannelType,
    request: Request<PackageKey, MainOwner, typeof channel>
): void;
/**
 * @inheritdoc Send:NoRequestAllWindows
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
    browserWindows: undefined,
    channel: ChannelType
): void;
/**
 * @inheritdoc Send:RequestAllWindows
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Request<PackageKey, MainOwner>>(
    browserWindows: undefined,
    channel: ChannelType,
    request: Request<PackageKey, MainOwner, typeof channel>
): void;
/**
 * @inheritdoc Send
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Request<PackageKey, MainOwner>>(
    browserWindows: BrowserWindow | Array<BrowserWindow> | undefined,
    channel: ChannelType,
    request:
        | Request<PackageKey, MainOwner, typeof channel>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): void
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    function Send(BrowserWindow: BrowserWindow): void
    {
        if (request !== EmptyOverloadParameterValue)
        {
            BrowserWindow.webContents.send(channel, request);
        }
        else
        {
            BrowserWindow.webContents.send(channel);
        }
    }

    if (Array.isArray(browserWindows))
    {
        browserWindows.forEach(Send);
    }
    else if (browserWindows === undefined)
    {
        BrowserWindow.getAllWindows().forEach(Send);
    }
    else
    {
        Send(browserWindows);
    }
}
