/* File:      Hook.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    InvokeDeferred,
    MainResponse,
    OffEventDeferred,
    OnEventDeferred,
    OnceEventDeferred,
    RendererRequest,
    UseInvokeOptions } from "./Hook.Types";
import type { MainOwner, RendererOwner } from "../Decl.Types";
import type { Callback } from "../Callback";
import type { Channel } from "../Channel.Types";
import type { IpcRendererEvent } from "electron/renderer";
import type { PackageKeys } from "../Internal";

export type RendererChannel<PackageKey extends PackageKeys> =
    Channel.Any<PackageKey, RendererOwner>;

export type MainChannel<PackageKey extends PackageKeys> =
    Channel.Any<PackageKey, MainOwner>;

export type MainChannelRequest<PackageKey extends PackageKeys> =
    Channel.Request<PackageKey, MainOwner>;

export type MainChannelNoRequest<PackageKey extends PackageKeys> =
    Channel.NoRequest<PackageKey, MainOwner>;

export type UseInvoke<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
            channel: ChannelType,
            options?: UseInvokeOptions | undefined
        ): MainResponse<PackageKey, ChannelType>;

        <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
            channel: ChannelType,
            request: RendererRequest<PackageKey, ChannelType>,
            options?: UseInvokeOptions
        ): MainResponse<PackageKey, ChannelType>;
    };

export type UseInvokeDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ invokeDeferred: InvokeDeferred<PackageKey> ]>;
    };

export type UseOnEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends MainChannel<PackageKey>>(
            channel: ChannelType,
            listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
        ): void;
    };

export type UseOnEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ onEventDeferred: OnEventDeferred<PackageKey> ]>;
    };

export type UseOnceEvent<PackageKey extends PackageKeys> = UseOnEvent<PackageKey>;

export type UseOnceEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ onceEventDeferred: OnceEventDeferred<PackageKey> ]>;
    };

export type UseOffEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

export type UseSendEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
            channel: ChannelType
        ): void;

        <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
            channel: ChannelType,
            request: RendererRequest<PackageKey, ChannelType>
        ): void;
    };

export type SendEventDeferred<PackageKey extends PackageKeys> = UseSendEvent<PackageKey>;

export type UseSendEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ sendEventDeferred: SendEventDeferred<PackageKey> ]>;
    };

export type UseSendSync<PackageKey extends PackageKeys> = UseInvokeDeferred<PackageKey>;

export type SendSyncDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
            channel: ChannelType,
            request: RendererRequest<PackageKey, ChannelType>
        ): MainResponse<PackageKey, ChannelType>;

        <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
            channel: ChannelType
        ): MainResponse<PackageKey, ChannelType>;
    };

export type UseSendSyncDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ sendSyncDeferred: SendSyncDeferred<PackageKey> ]>;
    };
