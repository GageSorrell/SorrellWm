/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    Callback,
    ResponseData as ResponseDataBase,
    InvokeResponseFailure as ResponseFailureBase,
    InvokeResponseSuccessBase as ResponseSuccessBase } from "../Callback/Callback.Types.js";
import type {
    MainChannel,
    RendererChannel,
    UseInvoke,
    UseInvokeDeferred,
    UseOffEventDeferred,
    UseOnEvent,
    UseOnEventDeferred,
    UseOnceEvent,
    UseOnceEventDeferred,
    UseSendEvent,
    UseSendEventDeferred,
    UseSendSync,
    UseSendSyncDeferred} from "./Hook.Internal.Types.js";
import type { MainOwner, RendererOwner } from "../Decl.Types";
import type { Channel } from "../Channel.Types";
import type { IpcRendererEvent } from "electron";
import type { PackageKeys } from "../Internal/index.js";
import type { Request as RequestBase } from "../Callback/Callback.Types.js";

type CompletedResponsePart =
    {
        IsPending: false;
    };

type IncompleteResponsePart =
    {
        IsPending: true;
    };

export type ResponseSuccess<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, RendererOwner>
> = (
    ResponseSuccessBase<PackageKey, RendererOwner, ChannelType> &
    CompletedResponsePart
);

export type ResponseErrorProp<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, RendererOwner>
> = ResponseFailureBase<PackageKey, RendererOwner, ChannelType>["Error"];

export type ResponseFailure<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, RendererOwner>
> = (
    ResponseFailureBase<PackageKey, RendererOwner, ChannelType> &
    CompletedResponsePart
);

type ResponseIndeterminate =
    {
        Data: undefined;
        Error: undefined;
    };

export type ResponseIncomplete =
    ResponseIndeterminate &
    IncompleteResponsePart;

export type MainResponse<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, RendererOwner>
> =
    | ResponseSuccess<PackageKey, ChannelType>
    | ResponseFailure<PackageKey, ChannelType>
    | ResponseIncomplete;

export type MainResponseDeferred<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, RendererOwner>
> = Omit<MainResponse<PackageKey, ChannelType>, "IsPending">;

export type RendererRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Request<PackageKey, RendererOwner>
> =
    RequestBase<PackageKey, RendererOwner, ChannelType>;

export type MainRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Request<PackageKey, MainOwner>
> =
    RequestBase<PackageKey, MainOwner, ChannelType>;

export type PendingInvokeState = Readonly<{
    Data: undefined;
    Error: undefined;
    IsPending: true;
}>;

type ResponseData<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>
> = ResponseDataBase<PackageKey, RendererOwner, ChannelType>;

export type SuccessfulInvokeState<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>
> = Readonly<{
    Data: ResponseData<PackageKey, ChannelType>;
    Error: undefined;
    IsPending: false;
}>;

export type FailedInvokeState<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>
> = Readonly<{
    Data: undefined;
    Error: ResponseFailure<PackageKey, ChannelType>;
    IsPending: false;
}>;

export type SettledInvokeState<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>
> =
    | SuccessfulInvokeState<PackageKey, ChannelType>
    | FailedInvokeState<PackageKey, ChannelType>;

export type InvokeState<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>
> =
    | PendingInvokeState
    | SettledInvokeState<PackageKey, ChannelType>;

export type UseInvokeOptions =
    Partial<{
        suspends: boolean;
    }>;

export type UseSendSyncOptions = UseInvokeOptions;

export type InvokeDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
            channel: ChannelType,
            request: RendererRequest<PackageKey, ChannelType>
        ): Promise<MainResponse<PackageKey, ChannelType>>;

        <ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
            channel: ChannelType
        ): Promise<MainResponse<PackageKey, ChannelType>>;
    };

export type OnEventDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends MainChannel<PackageKey>>(
            channel: ChannelType,
            listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
        ): void;
    };

export type OnceEventDeferred<PackageKey extends PackageKeys> = OnEventDeferred<PackageKey>;

export type OffEventDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends MainChannel<PackageKey>>(
            channel: ChannelType,
            listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
        ): void;
    };

export type ReactiveEventHooks<PackageKey extends PackageKeys> =
    Readonly<{
        useInvoke: UseInvoke<PackageKey>;
        useInvokeDeferred: UseInvokeDeferred<PackageKey>;
        useOnEvent: UseOnEvent<PackageKey>;
        useOnEventDeferred: UseOnEventDeferred<PackageKey>;
        useOffEventDeferred: UseOffEventDeferred<PackageKey>;
        useSendEvent: UseSendEvent<PackageKey>;
        useSendEventDeferred: UseSendEventDeferred<PackageKey>;
        useSendSync: UseSendSync<PackageKey>;
        useSendSyncDeferred: UseSendSyncDeferred<PackageKey>;
        useOnceEvent: UseOnceEvent<PackageKey>;
        useOnceEventDeferred: UseOnceEventDeferred<PackageKey>;
    }>;
