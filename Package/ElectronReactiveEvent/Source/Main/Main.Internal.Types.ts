/* File:      Main.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Handler, Request } from "../Listener";
import type { Channel } from "../Channel";
import type { BrowserView, BrowserWindow, IpcMain } from "electron";
import type { PackageKeys } from "../Internal";
import type { MainOwner, RendererOwner } from "../Decl/Decl.Types";

export type SendableEventHandler<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Listener.NoRequest<PackageKey, RendererOwner>>(
            channel: ChannelType
        ): void;

        <ChannelType extends Channel.Listener.Request<PackageKey, RendererOwner>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): void;
    };

export type InvokableEventHandler<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Handler.Any<PackageKey>>(
            channel: ChannelType,
            listener: Handler<PackageKey, typeof channel>
        ): void;
    };

export type Send<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
            browserWindow: BrowserWindow,
            channel: ChannelType
        ): void;

        <ChannelType extends Channel.Listener.Request<PackageKey, MainOwner>>(
            browserWindow: BrowserWindow,
            channel: ChannelType,
            request: Request<PackageKey, MainOwner, typeof channel>
        ): void;

        <ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
            browserWindows: Array<BrowserWindow>,
            channel: ChannelType
        ): void;

        <ChannelType extends Channel.Listener.Request<PackageKey, MainOwner>>(
            browserWindows: Array<BrowserWindow>,
            channel: ChannelType,
            request: Request<PackageKey, MainOwner, typeof channel>
        ): void;
    };

export type On<PackageKey extends PackageKeys> = SendableEventHandler<PackageKey>;

export type Once<PackageKey extends PackageKeys> = SendableEventHandler<PackageKey>;

export type Off<PackageKey extends PackageKeys> = SendableEventHandler<PackageKey>;

export type Handle<PackageKey extends PackageKeys> = InvokableEventHandler<PackageKey>;

export type HandleOnce<PackageKey extends PackageKeys> = Handle<PackageKey>;

export type RemoveHandler<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Handler.Any<PackageKey>>(
            channel: ChannelType
        ): void;
    };

export type NativeHandlerListener = Parameters<IpcMain["handle"]>[1];
export type NativeEventListener = Parameters<IpcMain["on"]>[1];
