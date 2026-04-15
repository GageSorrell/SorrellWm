/* File:      Renderer.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type EmptyOverloadParameter,
    EmptyOverloadParameterValue,
    type Listener,
    type ListenerRequest } from "../Listener";
import type { PackageKeys, RendererOwner } from "../Registrar";
import type { Channel } from "../Channel";
import type { IpcRenderer } from "electron/renderer";
import type { NativeEventListener } from "../Shared/Shared.Internal.Types";

let __IpcRenderer: IpcRenderer | undefined = undefined;

/** @returns Electron's `ipcRenderer` module. */
function GetIpcRenderer(): IpcRenderer
{
    try
    {
        if (__IpcRenderer === undefined)
        {
            /* eslint-disable-next-line @typescript-eslint/no-require-imports */
            __IpcRenderer = require("electron/renderer").ipcRenderer;
        }

        return __IpcRenderer as IpcRenderer;
    }
    catch
    {
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error("Could not import ipcRenderer from electron/renderer.  Make sure that electron is installed as a dependency.");
    }
}

/**
 * @inheritdoc Off:Signature
 * @group Internal
 */
export function off<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, typeof channel>
): void
{
    GetIpcRenderer().off(channel, listener as NativeEventListener<RendererOwner>);
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
    GetIpcRenderer().removeAllListeners(channel);
}

/**
 * Subscribe a {@link listener} to an event declaration given by {@link channel},
 * which does *not* return a response to the `renderer`.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the sendable event to which the {@link listener} will be subscribed.
 * @param listener - The {@link MainListener} which will be subscribed to the given {@link channel}.
 *
 * @group Internal
 */
export function on<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, typeof channel>
): void
{
    GetIpcRenderer().on(channel, listener as NativeEventListener<RendererOwner>);
}

/**
 * Subscribe a {@link listener} to an event declaration given by {@link channel},
 * which does *not* return a response to the `renderer`.  The {@link listener}
 * will be unsubscribed after it is called once.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the sendable event to which the {@link listener} will be subscribed.
 * @param listener - The {@link MainListener} which will be subscribed to the given {@link channel}.
 *
 * @group Internal
 */
export function once<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, typeof channel>
): void
{
    GetIpcRenderer().once(channel, listener as NativeEventListener<RendererOwner>);
}

/* eslint-disable @stylistic/max-len */

/**
 * Send an event to the `renderer`, whose event declaration does *not* define
 * a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the event declaration.
 *
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.NoRequest<PackageKey, RendererOwner>>(
    channel: ChannelType
): void;
/**
 * Send an event to the `renderer`, whose event declaration defines a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the event declaration.
 * @param request - The request of the given event.
 *
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Request<PackageKey, RendererOwner>>(
    channel: ChannelType,
    request: ListenerRequest<PackageKey, RendererOwner, typeof channel>
): void;
/**
 * Send an event to `main` that has no response type or error type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 * @param request - The overloaded request argument; it is {@link EmptyOverloadParameterValue} if
 * the event declaration has no request type.
 *
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
    channel: ChannelType,
    request:
        | ListenerRequest<PackageKey, RendererOwner, typeof channel>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): void
{
    if (request === EmptyOverloadParameterValue)
    {
        GetIpcRenderer().send(channel);
    }
    else
    {
        GetIpcRenderer().send(channel, request);
    }
}
