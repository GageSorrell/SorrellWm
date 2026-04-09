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
import type { HandlerInternal } from "./Listener.Internal.Types";
import type { ReactiveEventErrorDataInternal } from "../Error/Error.Internal.Types";

/**
 * The possible `Event` types, given the owner of the event declaration.
 *
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 */
export type IpcEventFromOwner<OwnerType extends EventOwner> =
    OwnerType extends MainOwner
        ? IpcRendererEvent
        : OwnerType extends RendererOwner
            ? (IpcMainEvent | IpcMainInvokeEvent)
            : never;

/**
 * The request type of a given event declaration, identified by its {@link PackageKey},
 * {@link OwnerType}, and {@link ChannelType}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Request<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Request<PackageKey, OwnerType>
> = RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>[ChannelType]
    ? FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey] extends EmptyEventParameter
        ? never
        : FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey]
    : never;

/**
 * The type returned by a handler when the given invokable event succeeds.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type RawResponseSuccess<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> = EventResponseKey extends keyof FilterByOwner<PackageKey, RendererOwner>[ChannelType]
    ? FilterByOwner<PackageKey, RendererOwner>[ChannelType][EventResponseKey] extends EmptyEventParameter
        ? never
        : FilterByOwner<PackageKey, RendererOwner>[ChannelType][EventResponseKey]
    : never;

/**
 * The type returned by a handler when the given invokable event fails.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type RawResponseError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> = ReactiveEventErrorDataInternal<PackageKey, ChannelType>;

/**
 * Your {@link Handler | handlers} can return values directly using the types in your event declarations,
 * *i.e.*, return your `ResponseType` when your event succeeds, and the `ErrorType` when
 * your event fails.
 *
 * `electron-reactive-event` transforms your return value before sending it to the `renderer`
 * so that it receives data in a homogenous structure: the {@link Response} type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
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

/**
 * Your {@link Handler | handlers } can return values directly using the types in your event declarations,
 * *i.e.*, return your `ResponseType` when your event succeeds, and the `ErrorType` when
 * your event fails.
 *
 * `electron-reactive-event` transforms your return value before sending it to the `renderer`
 * so that it receives data in a homogenous structure: the {@link Response} type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
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

/**
 * The type returned to the `renderer` when a {@link Handler} fails.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ResponseError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Response<PackageKey>
> = ResponseBase<ResponseErrorKey, ReactiveEventErrorDataInternal<PackageKey, ChannelType>>;

/**
 * The type returned to the `renderer` by a {@link Handler} when the
 * {@link InvokeOptions.suspend | suspend} option is passed via {@link InvokeOptions},
 * or when {@link InvokeEventDeferred} is called.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ResponseSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Response<PackageKey>
> =
    IpcEventPart<IpcRendererEvent> &
    (
        | ResponseSuccess<PackageKey, ChannelType>
        | ResponseError<PackageKey, ChannelType>
    );

/**
 * The type of the value returned by {@link UseInvokeEvent} when {@link InvokeOptions.suspend}
 * is passed and before a {@link Handler} registered in `main` has returned a {@link Response}.
 */
export type ResponseIndeterminate =
    {
        data: undefined;
        error: undefined;
        isPending: true;
    };

/**
 * A {@link Response} returned by {@link UseInvokeEvent} when {@link InvokeOptions.suspend}
 * is not `true`, and `main` has returned a response.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ResponseSettled<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    Exclude<
        Response<PackageKey, ChannelType>,
        ResponseIndeterminate
    >;

/**
 * A {@link Response} returned by {@link UseInvokeEvent} when {@link InvokeOptions.suspend}
 * is not `true`, possibly before `main` has sent a value to the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Response<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> = MakeIsPending<ResponseSync<PackageKey, ChannelType>>;

/**
 * A {@link Handler} that subscribes to an event whose declaration does
 * *not* have a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type HandlerNoRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>
> =
    {
        (event: IpcMainInvokeEvent): Promise<RawResponse<PackageKey, ChannelType>>;
    };

/**
 * A {@link Handler} that subscribes to an event whose declaration has a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type HandlerRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Request<PackageKey>
> = HandlerInternal<PackageKey, ChannelType>;

/**
 * A callback function that can be registered for invokable events, *i.e.*, the
 * {@link ChannelType} is of type {@link Channel.Handler.Any}, and is invoked via
 * {@link UseInvokeEvent} or {@link InvokeEventDeferred}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
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

/**
 * A callback function that can be registered for sendable events, *i.e.*, the
 * {@link ChannelType} is of type {@link Channel.Listener.Any}, and is sent via
 * {@link UseSendEvent}, {@link SendEventDeferred}, or {@link Send}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
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

/**
 * This is the union of {@link Handler} and {@link Listener}, with safety-checks
 * via `extends`, so that the given {@link ChannelType} narrows the type of this
 * to the exact callback type that corresponds to the given {@link ChannelType}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
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
