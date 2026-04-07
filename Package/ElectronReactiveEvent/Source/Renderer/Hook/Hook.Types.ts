/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Listener, Request, Response, ResponseSync } from "../../Listener";
import type { MainOwner, RendererOwner } from "../../Decl/Decl.Types";
import type {
    UseInvokeEvent,
    UseInvokeEventDeferred,
    UseOffEventDeferred,
    UseOnEvent,
    UseOnEventDeferred,
    UseOnceEvent,
    UseOnceEventDeferred,
    UseSendEvent,
    UseSendEventDeferred } from "./Hook.Internal.Types";
import type { Channel } from "../../Channel";
import type { IpcRendererEvent } from "electron";
import type { PackageKeys } from "../../Internal";

export type RendererListener<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>
> = Listener<PackageKey, MainOwner, IpcRendererEvent, ChannelType>;

export type InvokeOptions<SuspendsType extends boolean = boolean> =
    {
        suspend: SuspendsType;
    };

export type InvokeResponse<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>,
    OptionsType extends InvokeOptions | undefined
> = OptionsType extends InvokeOptions<infer SuspendsType>
    ? SuspendsType extends true
        ? ResponseSync<PackageKey, ChannelType>
        : Response<PackageKey, ChannelType>
    : never;

export type InvokeEventDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
            channel: ChannelType
        ): Promise<ResponseSync<PackageKey, typeof channel>>;

        <ChannelType extends Channel.Handler.Request<PackageKey>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): Promise<ResponseSync<PackageKey, typeof channel>>;
    };

export type OnEventDeferred<PackageKey extends PackageKeys> = UseOnEvent<PackageKey>;

export type OffEventDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): void;
    };

export type OnceEventDeferred<PackageKey extends PackageKeys> = UseOnceEvent<PackageKey>;

export type SendEventDeferred<PackageKey extends PackageKeys> = UseSendEvent<PackageKey>;

export type ReactiveEventHooks<PackageKey extends PackageKeys> = Readonly<{
    useInvokeEvent: UseInvokeEvent<PackageKey>;
    useInvokeEventDeferred: UseInvokeEventDeferred<PackageKey>;

    useOnEvent: UseOnEvent<PackageKey>;
    useOnEventDeferred: UseOnEventDeferred<PackageKey>;

    useOnceEvent: UseOnceEvent<PackageKey>;
    useOnceEventDeferred: UseOnceEventDeferred<PackageKey>;

    useOffEventDeferred: UseOffEventDeferred<PackageKey>;

    useSendEvent: UseSendEvent<PackageKey>;
    useSendEventDeferred: UseSendEventDeferred<PackageKey>;
}>;
