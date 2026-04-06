/* File:      Listener.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { EmptyEventParameter, EventOwner, MainOwner, RendererOwner } from "../Decl.Types";
import type {
    ResponseKey as EventResponseKey,
    FilterByOwner,
    PackageKeys,
    RecordEntry,
    Registrar,
    RequestKey } from "../Internal";
import type { IpcMainEvent, IpcMainInvokeEvent, IpcRendererEvent } from "electron";
import type { Channel } from "../Channel";
import type { ReactiveEventError } from "../Error/Error.Types";
import type { ResponseIndeterminate } from "../Renderer/Hook/Hook.Internal.Types";
import type { executionAsyncId } from "node:async_hooks";

export type EventTypesFromOwner<OwnerType extends EventOwner> =
    OwnerType extends MainOwner
        ? IpcRendererEvent
        : OwnerType extends RendererOwner
            ? (IpcMainEvent | IpcMainInvokeEvent)
            : never;

export type Request<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Request<PackageKey, OwnerType>
> = RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>[ChannelType]
    ? FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey] extends EmptyEventParameter
        ? never
        : FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey]
    : never;

export type RawResponseSuccess<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> = EventResponseKey extends keyof FilterByOwner<PackageKey, RendererOwner>[ChannelType]
    ? FilterByOwner<PackageKey, RendererOwner>[ChannelType][EventResponseKey] extends EmptyEventParameter
        ? never
        : FilterByOwner<PackageKey, RendererOwner>[ChannelType][EventResponseKey]
    : never;

export type RawResponseError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> = ReactiveEventError<PackageKey, ChannelType>;

/**
 * Your listeners can return values directly using the types in your event declarations,
 * *i.e.*, return your `ResponseType` when your event succeeds, and the `ErrorType` when
 * your event fails.
 *
 * `electron-reactive-event` transforms your return value before sending it to the `renderer`
 * so that it receives data in a homogenous structure: the {@link Response} type.
 */
export type RawResponse<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> =
    | RawResponseSuccess<PackageKey, ChannelType>
    | RawResponseError<PackageKey, ChannelType>;

type ResponseDataKey = "data";
type ResponseErrorKey = "error";
type ResponseKey =
    | ResponseDataKey
    | ResponseErrorKey;

type ResponseOtherKey<KeyType extends ResponseKey> =
    KeyType extends ResponseDataKey
        ? ResponseErrorKey
        : ResponseDataKey;

type ResponseBase<KeyType extends ResponseKey, ValueType> =
    Readonly<
        {
            [ Key in KeyType ]: ValueType;
        } &
        {
            [ Key in ResponseOtherKey<KeyType> ]: undefined;
        }
    >;

export type ResponseSuccessSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Response<PackageKey>
> = ResponseBase<ResponseDataKey, Registrar[PackageKey][ChannelType][EventResponseKey]>;

export type ResponsesSuccessSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Response<PackageKey>
> =
    ResponseBase<
        ResponseDataKey,
        ResponsesPart<
            ChannelType,
            Registrar[PackageKey][ChannelType][EventResponseKey]
        >
    >;

type IsPendingPart<IsPendingType extends boolean> =
    Readonly<{
        isPending: IsPendingType;
    }>;

type MakeIsPending<RecordType extends Record<PropertyKey, unknown>> =
    | (
        Readonly<{
            [ Key in keyof RecordType ]: undefined;
        }> &
        IsPendingPart<true>
    )
    | (
        RecordType &
        IsPendingPart<false>
    );

export type ResponseErrorSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Response<PackageKey>
> = ResponseBase<ResponseErrorKey, ReactiveEventError<PackageKey, ChannelType>>;

export type ResponsesErrorSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Response<PackageKey>
> =
    ResponseBase<
        ResponseErrorKey,
        ResponsesPart<
            ChannelType,
            ReactiveEventError<PackageKey, ChannelType>
        >
    >;

export type ResponseFulfilled<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Response<PackageKey>
> =
    | ResponseSuccess<PackageKey, ChannelType>
    | ResponseError<PackageKey, ChannelType>;

export type ResponsesFulfilled<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Response<PackageKey>
> =
    | ResponsesSuccess<PackageKey, ChannelType>
    | ResponsesError<PackageKey, ChannelType>;

export type Response<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> =
    | ResponseFulfilled<PackageKey, ChannelType>
    | ResponseIndeterminate;

export type ResponseSuccess<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> = MakeIsPending<ResponseSuccessSync<PackageKey, ChannelType>>;

export type ResponsesSuccess<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> = MakeIsPending<ResponsesSuccessSync<PackageKey, ChannelType>>;

export type ResponseError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> = MakeIsPending<ResponseErrorSync<PackageKey, ChannelType>>;

export type ResponsesError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> = MakeIsPending<ResponsesErrorSync<PackageKey, ChannelType>>;

export type ResponseSyncFulfilled<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> =
    | ResponseSuccessSync<PackageKey, ChannelType>
    | ResponseErrorSync<PackageKey, ChannelType>;

export type ResponsesSyncFulfilled<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> =
    | ResponsesSuccessSync<PackageKey, ChannelType>
    | ResponsesErrorSync<PackageKey, ChannelType>;

export type ResponseSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> =
    | ResponseSyncFulfilled<PackageKey, ChannelType>
    | ResponseIndeterminate;

export type ResponsesSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> =
    | ResponsesSyncFulfilled<PackageKey, ChannelType>
    | ResponsesIndeterminate<PackageKey, ChannelType>;

export type InvokableListener<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
            channel: ChannelType
        ): RawResponse<PackageKey, typeof channel>;

        <ChannelType extends Channel.Invokable.Request<PackageKey>>(
            channel: ChannelType,
            request: Request<PackageKey, MainOwner, typeof channel>
        ): RawResponse<PackageKey, typeof channel>;
    };

export type SendableListener<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelTypeOuter extends Channel.Sendable.Any<PackageKey, OwnerType> =
        Channel.Sendable.Any<PackageKey, OwnerType>
> =
    {
        <ChannelType extends Extract<ChannelTypeOuter, Channel.Sendable.NoRequest<PackageKey, OwnerType>>>(
            channel: ChannelType
        ): void;

        <ChannelType extends Extract<ChannelTypeOuter, Channel.Sendable.Request<PackageKey, OwnerType>>>(
            channel: ChannelType,
            request: Request<PackageKey, MainOwner, typeof channel>
        ): void;
    };

export type AnyListener<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner = EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType> =
        Channel.Any<PackageKey, OwnerType>
> =
    | InvokableListener<PackageKey>
    | SendableListener<
        PackageKey,
        OwnerType,
        Extract<
            ChannelType,
            Channel.Sendable.Any<PackageKey, OwnerType>
        >
    >;

export type EventArray<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelTypeOuter extends Channel.NoRequest<PackageKey, OwnerType>
> = Array<ChannelTypeOuter>;

export type EventArraySafe<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = Array<Extract<ChannelType, Channel.NoRequest<PackageKey, OwnerType>>>;

export type EventRecordStrict<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelTypeOuter extends Channel.Request<PackageKey, OwnerType>
> =
    {
        [ ChannelType in ChannelTypeOuter ]: Request<PackageKey, OwnerType, ChannelType>;
    };

export type EventRecord<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> =
    EventRecordStrict<
        PackageKey,
        OwnerType,
        Extract<ChannelType, Channel.Request<PackageKey, OwnerType>>
    > &
    EventRecordNoRequest<
        PackageKey,
        OwnerType,
        Extract<ChannelType, Channel.NoRequest<PackageKey, OwnerType>>
    >;

export type EventRecordNoRequest<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelTypeOuter extends Channel.NoRequest<PackageKey, OwnerType>
> =
    {
        [ ChannelType in ChannelTypeOuter ]: undefined;
    };

export type EventCollection<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> =
    ChannelType extends Channel.NoRequest<PackageKey, OwnerType>
        ? EventArray<PackageKey, OwnerType, ChannelType>
        : ChannelType extends Channel.Request<PackageKey, OwnerType>
            ? EventRecordStrict<PackageKey, OwnerType, ChannelType>
            : EventRecord<PackageKey, OwnerType, ChannelType>;

export type EventRecordEntry<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = RecordEntry<EventRecordStrict<PackageKey, OwnerType, ChannelType>>;

export type EventListenerRecord<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelTypeOuter extends Channel.Any<PackageKey, OwnerType>
> =
    {
        [ ChannelType in ChannelTypeOuter ]: SendableListener<PackageKey, OwnerType, ChannelType>;
    };

export type ResponsesPart<
    ChannelTypeOuter extends string,
    ValueType
> =
    {
        [ ChannelType in ChannelTypeOuter ]: ValueType;
    };

export type ResponsesIndeterminate<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, EventOwner>
> =
    Readonly<{
        data: ResponsesPart<ChannelType, undefined>;
        error: ResponsesPart<ChannelType, undefined>;
    }> &
    IsPendingPart<true>;

export type EventListenerEntry<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>,
    ListenerType extends AnyListener<PackageKey, OwnerType, ChannelType>
> = [ Channel: ChannelType, Listener: ListenerType ];

export type Responses<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
> =
    | ResponsesFulfilled<PackageKey, ChannelType>
    | ResponsesIndeterminate<PackageKey, ChannelType>;
