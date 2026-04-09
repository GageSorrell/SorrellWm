/* File:      Listener.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventOwner, MainOwner, RendererOwner } from "../Decl/Decl.Types";
import type { ResponseKey as EventResponseKey, RequestKey } from "../Internal/Decl.Types";
import type {
    FilterByOwner,
    PackageKeys,
    Registrar } from "../Internal";
import type { IpcMainEvent, IpcMainInvokeEvent, IpcRendererEvent } from "electron";
import type { Channel } from "../Channel";
import type { ReactiveEventErrorDataInternal } from "../Error/Error.Internal.Types";

export type IpcEventFromOwner<OwnerType extends EventOwner> =
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
    ChannelType extends Channel.Handler.Any<PackageKey>
> = EventResponseKey extends keyof FilterByOwner<PackageKey, RendererOwner>[ChannelType]
    ? FilterByOwner<PackageKey, RendererOwner>[ChannelType][EventResponseKey] extends EmptyEventParameter
        ? never
        : FilterByOwner<PackageKey, RendererOwner>[ChannelType][EventResponseKey]
    : never;

export type RawResponseError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> = ReactiveEventErrorDataInternal<PackageKey, ChannelType>;

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
    ChannelType extends Channel.Handler.Any<PackageKey>
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

export type ResponseSuccess<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Response<PackageKey>
> = ResponseBase<ResponseDataKey, Registrar[PackageKey][ChannelType][EventResponseKey]>;

type IsPendingPart<IsPendingType extends boolean> =
    Readonly<{
        isPending: IsPendingType;
    }>;

type IpcEvent =
    | IpcMainEvent
    | IpcMainInvokeEvent
    | IpcRendererEvent;

type IpcEventPart<EventType extends IpcEvent> = Readonly<{
    Event: EventType;
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

export type ResponseError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Response<PackageKey>
> = ResponseBase<ResponseErrorKey, ReactiveEventErrorDataInternal<PackageKey, ChannelType>>;

export type ResponseSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Response<PackageKey>
> =
    IpcEventPart<IpcRendererEvent> &
    (
        | ResponseSuccess<PackageKey, ChannelType>
        | ResponseError<PackageKey, ChannelType>
    );

export type ResponseIndeterminate =
    {
        data: undefined;
        error: undefined;
        isPending: true;
    };

export type ResponseSyncIndeterminate = Omit<ResponseIndeterminate, "isPending">;

export type ResponseSettled<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    Exclude<
        Response<PackageKey, ChannelType>,
        ResponseIndeterminate
    >;

export type Response<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> = MakeIsPending<ResponseSync<PackageKey, ChannelType>>;

type HandlerRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Request<PackageKey>
> =
    {
        (
            event: IpcMainInvokeEvent,
            request: Request<PackageKey, RendererOwner, ChannelType>
        ): Promise<RawResponse<PackageKey, ChannelType>>;
    };

export type HandlerInternal<PackageKey extends PackageKeys> =
    HandlerRequest<PackageKey, Channel.Handler.Any<PackageKey>>;

type HandlerNoRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>
> =
    {
        (event: IpcMainInvokeEvent): Promise<RawResponse<PackageKey, ChannelType>>;
    };

export type Handler<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    ChannelType extends Channel.Handler.Request<PackageKey>
        ? HandlerRequest<PackageKey, ChannelType>
        : ChannelType extends Channel.Handler.NoRequest<PackageKey>
            ? HandlerNoRequest<PackageKey, ChannelType>
            : never;

type ListenerRequest<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    EventType extends IpcEvent,
    ChannelType extends Channel.Listener.Request<PackageKey, OwnerType>
> =
    {
        (
            event: EventType,
            request: Request<PackageKey, OwnerType, ChannelType>
        ): RawResponse<PackageKey, ChannelType>;
    };

type ListenerNoRequest<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    EventType extends IpcEvent,
    ChannelType extends Channel.Listener.NoRequest<PackageKey, OwnerType>
> =
    {
        (event: EventType): RawResponse<PackageKey, ChannelType>;
    };

export type Listener<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    EventType extends IpcEvent,
    ChannelType extends Channel.Listener.Any<PackageKey, OwnerType>
> =
    ChannelType extends Channel.Listener.Request<PackageKey, OwnerType>
        ? ListenerRequest<PackageKey, OwnerType, EventType, ChannelType>
        : ChannelType extends Channel.Listener.NoRequest<PackageKey, OwnerType>
            ? ListenerNoRequest<PackageKey, OwnerType, EventType, ChannelType>
            : never;

export type AnyCallback<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner = EventOwner,
    EventType extends IpcEvent = IpcEvent,
    ChannelType extends Channel.Any<PackageKey, OwnerType> =
        Channel.Any<PackageKey, OwnerType>
> =
    ChannelType extends Channel.Handler.Any<PackageKey>
        ? Handler<PackageKey, ChannelType>
        : ChannelType extends Channel.Listener.Any<PackageKey, OwnerType>
            ? Listener<
                PackageKey,
                OwnerType,
                EventType,
                ChannelType
            >
            : never;
