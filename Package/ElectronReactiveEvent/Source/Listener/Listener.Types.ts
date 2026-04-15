/* File:      Listener.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ErrorKey, ResponseKey as EventResponseKey, RequestKey } from "../Internal/Decl.Types";
import type {
    EventOwner,
    FilterByOwner,
    MainOwner,
    PackageKeys,
    Registrar,
    RendererOwner} from "../Internal";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron/main";
import type { ListenerNoRequest, ResponseIndeterminate } from "./Listener.Unscoped.Types";
import type { Channel } from "../Channel";
import type { IpcRendererEvent } from "electron/renderer";
import type { Reactive } from "../Reactive";

/**
 * The request type of a given event declaration, identified by its {@link PackageKey},
 * {@link OwnerType}, and {@link ChannelType}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type EventRequest<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Request<PackageKey, OwnerType>
> = RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>[ChannelType]
    ? [ FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey] ] extends [ never ]
        ? never
        : FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey]
    : never;

/**
 * The request type of a given {@link EventDeclListener | sendable event declaration}, identifie
 * by its {@link PackageKey}, {@link OwnerType}, and {@link ChannelType}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ListenerRequest<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Request<PackageKey, OwnerType>
> = EventRequest<PackageKey, OwnerType, ChannelType>;

type ResultDataKey = "data";
type ResultErrorKey = "error";
type ResultKey =
    | ResultDataKey
    | ResultErrorKey;

type ResponseOtherKey<KeyType extends ResultKey> =
    KeyType extends ResultDataKey
        ? ResultErrorKey
        : ResultDataKey;

type ResponseBase<KeyType extends ResultKey, ValueType> =
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
 * so that it receives data in a homogenous structure: the {@link InvokeResultAsync} type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ResultSuccess<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    IsPendingPart<false> &
    (ChannelType extends Channel.Handler.Request<PackageKey>
        ? {
            data: Registrar[PackageKey][ChannelType][EventResponseKey];
            error: undefined;
        }
        : ChannelType extends Channel.Handler.NoRequest<PackageKey>
            ? {
                data: undefined;
                error: undefined;
            }
            : never
        );

type IsPendingPart<IsPendingType extends boolean> =
    Readonly<{
        isPending: IsPendingType;
    }>;

/** The possible types for the `Event` parameter of a {@link Listener} callback. */
export type IpcEvent =
    | IpcMainEvent
    | IpcMainInvokeEvent
    | IpcRendererEvent;

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
export type ResultError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Error<PackageKey>
> =
    ErrorKey extends keyof Registrar[PackageKey][ChannelType]
        ? ResponseBase<ResultErrorKey, Registrar[PackageKey][ChannelType][ErrorKey]>
        : never;

/**
 * The type returned to the `renderer` by a {@link Handler} when the
 * {@link InvokeOptions.suspend | suspend} option is passed via {@link InvokeOptions},
 * or when {@link InvokeEventDeferred} is called.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type InvokeResultSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    ChannelType extends Channel.Handler.Response<PackageKey>
        ? ChannelType extends Channel.Handler.Error<PackageKey>
            ? (
                | ResultSuccess<PackageKey, ChannelType>
                | ResultError<PackageKey, ChannelType>
            )
            : ResultSuccess<PackageKey, ChannelType>
        : ChannelType extends Channel.Handler.Error<PackageKey>
            ? ResultError<PackageKey, ChannelType>
            : never;

/**
 * A {@link InvokeResultAsync} returned by {@link UseInvokeEvent} when {@link InvokeOptions.suspend}
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
        InvokeResultAsync<PackageKey, ChannelType>,
        ResponseIndeterminate
    >;

/**
 * A {@link InvokeResultAsync} returned by {@link UseInvokeEvent} when {@link InvokeOptions.suspend}
 * is not `true`, possibly before `main` has sent a value to the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type InvokeResultAsync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> = MakeIsPending<InvokeResultSync<PackageKey, ChannelType>>;

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
        (event: IpcMainInvokeEvent): Promise<Reactive.Result<PackageKey, ChannelType>>;
    };

/**
 * The request sent to a {@link Handler} via {@link UseInvoke}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type HandlerRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Request<PackageKey>
> = EventRequest<PackageKey, RendererOwner, ChannelType>;

/**
 * A {@link Handler} that subscribes to an event whose declaration has a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type HandlerWithRequest<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Request<PackageKey>
> =
    {
        (
            event: IpcMainInvokeEvent,
            request: HandlerRequest<PackageKey, ChannelType>
        ): Promise<Reactive.Result<PackageKey, ChannelType>>
    };

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
        ? HandlerWithRequest<PackageKey, ChannelType>
        : ChannelType extends Channel.Handler.NoRequest<PackageKey>
            ? HandlerNoRequest<PackageKey, ChannelType>
            : never;

/**
 * A {@link Listener} that is subscribable to a {@link Channel.Listener.Request | listener channel }
 * whose event declaration has a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ListenerWithRequest<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Listener.Request<PackageKey, OwnerType>,
    EventType extends IpcEvent | undefined = undefined
> =
    EventType extends undefined
        ? OwnerType extends RendererOwner
            ? {
                (
                    event: IpcMainEvent,
                    request: ListenerRequest<PackageKey, RendererOwner, ChannelType>
                ): void;
            }
            : {
                (
                    event: IpcRendererEvent,
                    request: ListenerRequest<PackageKey, MainOwner, ChannelType>
                ): void;
            }
        : {
            (
                event: EventType,
                request: ListenerRequest<PackageKey, RendererOwner, ChannelType>
            ): void;
        };
/**
 * A callback function that can be registered for sendable events, *i.e.*, the
 * {@link ChannelType} is of type {@link Channel.Listener.Any}, and is sent via
 * {@link UseSendEvent}, {@link SendEventDeferred}, or {@link Send}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Listener<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Listener.Any<PackageKey, OwnerType>,
    EventType extends IpcEvent | undefined = undefined
> =
    ChannelType extends Channel.Listener.Request<PackageKey, OwnerType>
        ? ListenerWithRequest<PackageKey, OwnerType, ChannelType, EventType>
        : ChannelType extends Channel.Listener.NoRequest<PackageKey, OwnerType>
            ? ListenerNoRequest<OwnerType, EventType>
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
    ChannelType extends Channel.Any<PackageKey, OwnerType> =
        Channel.Any<PackageKey, OwnerType>
> =
    ChannelType extends Channel.Handler.Any<PackageKey>
        ? Handler<PackageKey, ChannelType>
        : ChannelType extends Channel.Listener.Any<PackageKey, OwnerType>
            ? Listener<
                PackageKey,
                OwnerType,
                ChannelType
            >
            : never;
