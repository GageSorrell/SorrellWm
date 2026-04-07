/* File:      Main.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { Handler, HandlerInternal, Listener, RawResponse, Request } from "../Listener";
import { type IpcMainInvokeEvent, ipcMain } from "electron/main";
import type { Channel } from "../Channel";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";
import type { IpcMainEvent } from "electron";
import type { NativeEventListener } from "./Main.Internal.Types";
import type { PackageKeys } from "../Internal";
import { ReactiveEventErrorInternal } from "../Error/index.js";
import type { RendererOwner } from "../Decl/Decl.Types";

export function handle<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Request<PackageKey>>(
    channel: ChannelType,
    handler: Handler<PackageKey, typeof channel>
): void;
export function handle<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
    channel: ChannelType,
    handler: Handler<PackageKey, typeof channel>
): void;
export function handle<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    channel: ChannelType,
    handler: Handler<PackageKey, typeof channel>
): void
{
    HandleBase(ipcMain.handle, channel, handler);
}

function HandleBase<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    IpcFunction: typeof ipcMain.handle | typeof ipcMain.handleOnce,
    Channel: ChannelType,
    Handler: Handler<PackageKey, typeof Channel>
): void
{
    type WrapperReturnType = Awaited<ReturnType<typeof Handler>>;
    async function ListenerWrapper(
        Event: IpcMainInvokeEvent,
        ...ArgumentVector: Array<unknown>
    ): Promise<WrapperReturnType>
    {
        type ThisRequest = Request<PackageKey, RendererOwner, typeof Channel>;
        type ThisRawResponse = RawResponse<PackageKey, typeof Channel>;
        const RawResponse: ThisRawResponse =
            await (Handler as HandlerInternal<PackageKey>)(Event, (ArgumentVector[0] as ThisRequest));

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

export function removeHandler<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    channel: ChannelType
): void
{
    ipcMain.removeHandler(channel);
}

export function handleOnce<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>>(
    channel: ChannelType,
    listener: Handler<PackageKey, typeof channel>
): void
{
    HandleBase(ipcMain.handleOnce, channel, listener);
}

export function off<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, IpcMainEvent, typeof channel>
): void
{
    ipcMain.off(channel, listener as NativeEventListener);
}

export function on<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, IpcMainEvent, typeof channel>
): void
{
    ipcMain.on(channel, listener as NativeEventListener);
}

export function once<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, IpcMainEvent, typeof channel>
): void
{
    ipcMain.once(channel, listener as NativeEventListener);
}
