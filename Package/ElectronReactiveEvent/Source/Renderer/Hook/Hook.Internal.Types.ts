/* File:      Hook.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

/* eslint-disable @typescript-eslint/no-namespace */

import type {
    AnyListener,
    EventArray,
    EventCollection,
    EventRecordStrict,
    Request,
    Response,
    ResponseFulfilled,
    ResponseSync,
    ResponseSyncFulfilled,
    Responses,
    ResponsesSync,
    SendableListener } from "../../Listener/index.js";
import type { MainOwner, RendererOwner } from "../../Decl.Types.js";
import type { Channel } from "../../Channel/index.js";
import type { EmptyOverloadParameter } from "../../Listener/Listener.Internal.Types.js";
import type { PackageKeys } from "../../Internal/index.js";

export type RequestSerializer<RequestType = unknown> =
    {
        (request: RequestType): string;
    };

type UseInvokeEventOptionsBase<SuspendsType extends boolean = boolean> =
    {
        suspend: SuspendsType;
    };

export type MainEventListenerRecord<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner> =
        Channel.Sendable.Any<PackageKey, MainOwner>
> = EventRecordStrict<PackageKey, MainOwner, ChannelType>;

export type MainEventListenerRecordEntry<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, MainOwner>,
    ListenerType extends AnyListener<PackageKey, MainOwner, ChannelType>
> = [ Channel: ChannelType, Listener: ListenerType ];

export type MainEventRecordSendable<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner> =
        Channel.Sendable.Any<PackageKey, MainOwner>
> = EventRecordStrict<PackageKey, MainOwner, ChannelType>;

export type MainEventRecord<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner> =
        Channel.Sendable.Any<PackageKey, MainOwner>
> = EventRecordStrict<PackageKey, MainOwner, ChannelType>;

export type MainEventRecordEntry<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, MainOwner>,
    ListenerType extends AnyListener<PackageKey, MainOwner, ChannelType>
> = [ Channel: ChannelType, Listener: ListenerType ];

/**
 * @Todo Write note about `RequestType` needing to be serializable and that we don't try
 * to enforce that via types, which is why `RequestType` here does not `extend` anything.
 */
export type UseInvokeEventOptions<
    SuspendsType extends boolean = boolean,
    RequestType = unknown
> =
    Partial<
        UseInvokeEventOptionsBase<SuspendsType> &
        UseSendEventOptions<RequestType>
    >;

export type UseSendEventOptionsRequest<RequestType = unknown> =
    {
        requestSerializer: RequestSerializer<RequestType>;
    };

export type UseSendEventOptions<RequestType = unknown> =
    RequestType extends EmptyOverloadParameter
        /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
        ? { }
        : UseSendEventOptionsRequest<RequestType>;

export type InvokeResponse<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>,
    OptionsType extends UseInvokeEventOptions<boolean> | undefined = undefined
> = OptionsType extends undefined
    ? Response<PackageKey, ChannelType>
    : OptionsType extends UseInvokeEventOptions<true>
        ? ResponseSync<PackageKey, ChannelType>
        : Response<PackageKey, ChannelType>;

export type InvokeResponseFulfilled<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>,
    OptionsType extends UseInvokeEventOptions<boolean> | undefined = undefined
> = OptionsType extends undefined
    ? Response<PackageKey, ChannelType>
    : OptionsType extends UseInvokeEventOptions<true>
        ? ResponseSyncFulfilled<PackageKey, ChannelType>
        : ResponseFulfilled<PackageKey, ChannelType>;

export type InvokeResponses<
    PackageKey extends PackageKeys,
    EventsType extends EventCollection<PackageKey, RendererOwner, ChannelType>,
    OptionsType extends UseInvokeEventOptions<boolean> | undefined = undefined,
    ChannelType extends Channel.Invokable.Any<PackageKey> =
        Channel.Invokable.Any<PackageKey>
> = OptionsType extends undefined
    ? Responses<PackageKey, Extract<keyof EventsType, ChannelType>>
    : OptionsType extends UseInvokeEventOptions<true>
        ? ResponsesSync<PackageKey, Extract<keyof EventsType, ChannelType>>
        : Responses<PackageKey, Extract<keyof EventsType, ChannelType>>;

export type InvokeResponsesInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>,
    OptionsType extends UseInvokeEventOptions<boolean> | undefined | EmptyOverloadParameter
> = OptionsType extends EmptyOverloadParameter
    ? InvokeResponses<PackageKey, ChannelType, undefined>
    : InvokeResponses<
        PackageKey,
        ChannelType,
        Extract<OptionsType, UseInvokeEventOptions<boolean> | undefined>
    >;

export type InvokeResponseInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>,
    OptionsType extends UseInvokeEventOptions<boolean> | undefined | EmptyOverloadParameter
> = OptionsType extends EmptyOverloadParameter
    ? InvokeResponseFulfilled<PackageKey, ChannelType, undefined>
    : InvokeResponseFulfilled<
        PackageKey,
        ChannelType,
        Extract<OptionsType, UseInvokeEventOptions<boolean> | undefined>
    >;

export type UseInvokeEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
            channel: ChannelType
        ): InvokeResponse<PackageKey, typeof channel, undefined>;

        <ChannelType extends Channel.Invokable.NoRequest<PackageKey>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            options: UseInvokeEventOptions<SuspendsType>
        ): InvokeResponse<PackageKey, typeof channel, typeof options>;

        <ChannelType extends Channel.Invokable.Request<PackageKey>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): InvokeResponse<PackageKey, typeof channel, undefined>;

        <ChannelType extends Channel.Invokable.Request<PackageKey>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>,
            options: UseInvokeEventOptions<SuspendsType>
        ): InvokeResponse<PackageKey, typeof channel, typeof options>;
    };

export type InvokeEventDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
            channel: ChannelType
        ): Promise<ResponseSync<PackageKey, typeof channel>>;

        <ChannelType extends Channel.Invokable.Request<PackageKey>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): Promise<ResponseSync<PackageKey, typeof channel>>;
    };

export type UseInvokeEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ invokeEventDeferred: InvokeEventDeferred<PackageKey> ]>;
    };

export type UseOnEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: SendableListener<PackageKey, MainOwner, typeof channel>
        ): Readonly<[ offEventDeferred: (() => void) ]>;
    };

export type UseOnEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ onEventDeferred: OnEventDeferred<PackageKey> ]>;
    };

export type UseOnEvents<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            events: MainEventListenerRecord<PackageKey, ChannelType>
        ): Readonly<[ offEventsDeferred: OffEventsDeferredFromRecord<PackageKey, typeof events> ]>;
    };

export type UseOnceEvents<PackageKey extends PackageKeys> = UseOnEvents<PackageKey>;

export type OnEventsDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            events: MainEventListenerRecord<PackageKey, ChannelType>
        ): Readonly<[ OffEventsDeferred: OffEventsDeferredFromRecord<PackageKey, typeof events> ]>;
    };

export type UseOnEventsDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ onEventsDeferred: OnEventsDeferred<PackageKey> ]>;
    };

export type UseOnceEventsDeferred<PackageKey extends PackageKeys> = UseOnEventsDeferred<PackageKey>;

export type OnEventDeferred<PackageKey extends PackageKeys> = UseOnEvent<PackageKey>;

export type OffEventDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: SendableListener<PackageKey, MainOwner, typeof channel>
        ): void;
    };

export type OffEventsDeferredFromRecord<
    PackageKey extends PackageKeys,
    EventRecordType extends MainEventListenerRecord<PackageKey>
> =
    {
        (events:
        MainEventListenerRecord<PackageKey, Extract<
            keyof EventRecordType,
            Channel.Sendable.Any<PackageKey, MainOwner>>
        >): void;
    };

export type OffEventsDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            events: MainEventListenerRecord<PackageKey, ChannelType>
        ): void;
    };

export type UseOnceEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: SendableListener<PackageKey, MainOwner, typeof channel>
        ): Readonly<[ offEventDeferred: (() => void) ]>;
    };

export type UseOnceEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ onceEventDeferred: OnceEventDeferred<PackageKey> ]>;
    };

export type OnceEventDeferred<PackageKey extends PackageKeys> = UseOnceEvent<PackageKey>;

export type UseOffEventsDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ offEventsDeferred: OffEventsDeferred<PackageKey> ]>;
    };

export type UseOffEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

export type ResponseIndeterminate = Readonly<{
    data: undefined;
    error: undefined;
    isPending: true;
}>;

export type UseSendEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.NoRequest<PackageKey, MainOwner>>(
            channel: ChannelType
        ): void;

        <ChannelType extends Channel.Sendable.NoRequest<PackageKey, MainOwner>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            options: UseSendEventOptions<SuspendsType>
        ): void;

        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>,
            options: UseSendEventOptions<SuspendsType>
        ): void;
    };

export type SendEventDeferred<PackageKey extends PackageKeys> = UseSendEvent<PackageKey>;

export type UseSendEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ sendEventDeferred: SendEventDeferred<PackageKey> ]>;
    };

export type UseSendEvents<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            events: EventCollection<PackageKey, MainOwner, ChannelType>
        ): void;

        <ChannelType extends Channel.Sendable.Request<PackageKey, MainOwner>>(
            events: EventRecordStrict<PackageKey, MainOwner, ChannelType>
        ): void;

        <ChannelType extends Channel.Sendable.Request<PackageKey, MainOwner>>(
            events: EventRecordStrict<PackageKey, MainOwner, ChannelType>
        ): void;
    };

export type SendEventsDeferred<PackageKey extends PackageKeys> = UseSendEvents<PackageKey>;

export type UseSendEventsDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ invokeEventsDeferred: InvokeEventsDeferred<PackageKey> ]>;
    };

export type UseInvokeEvents<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
            events: EventArray<PackageKey, MainOwner, ChannelType>
        ): InvokeResponses<PackageKey, ChannelType>;

        <ChannelType extends Channel.Invokable.Request<PackageKey>>(
            events: EventRecordStrict<PackageKey, MainOwner, ChannelType>
        ): InvokeResponses<PackageKey, ChannelType>;

        <ChannelType extends Channel.Invokable.Any<PackageKey>>(
            events: EventCollection<PackageKey, MainOwner, ChannelType>
        ): InvokeResponses<PackageKey, ChannelType>;

        <ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
            events: EventArray<PackageKey, MainOwner, ChannelType>,
            options: UseInvokeEventOptions
        ): InvokeResponses<PackageKey, ChannelType, typeof options>;

        <ChannelType extends Channel.Invokable.Request<PackageKey>>(
            events: EventRecordStrict<PackageKey, MainOwner, ChannelType>,
            options: UseInvokeEventOptions
        ): InvokeResponses<PackageKey, ChannelType, typeof options>;

        <ChannelType extends Channel.Invokable.Any<PackageKey>>(
            events: EventCollection<PackageKey, MainOwner, ChannelType>,
            options: UseInvokeEventOptions
        ): InvokeResponses<PackageKey, ChannelType, typeof options>;
    };

export type InvokeEventsDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Sendable.NoRequest<PackageKey, MainOwner>>(
            events: EventArray<PackageKey, MainOwner, ChannelType>
        ): Promise<ResponseSync<PackageKey, ChannelType>>;

        <ChannelType extends Channel.Sendable.Request<PackageKey, MainOwner>>(
            events: EventRecordStrict<PackageKey, MainOwner, ChannelType>
        ): Promise<ResponseSync<PackageKey, ChannelType>>;

        <ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>>(
            events: EventCollection<PackageKey, MainOwner, ChannelType>
        ): Promise<ResponseSync<PackageKey, ChannelType>>;
    };

export type UseInvokeEventsDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ invokeEventsDeferred: InvokeEventsDeferred<PackageKey> ]>;
    };
