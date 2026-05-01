/**
 * @file      Decl.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ErrorKey, RequestKey, ResponseKey } from "../Internal";
import type { EventOwner, MainOwner, Registrar, RendererOwner } from "../Registrar/Registrar.Types";
import type { Channel } from "../Channel";

export namespace Decl
{
    /**
     * The request type of a given event declaration.
     *
     * @template ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     */
    export type Request<
        ChannelType extends Channel.With.Request<OwnerType>,
        OwnerType extends EventOwner = EventOwner
    > = Registrar[ChannelType][RequestKey];

    /**
     * The response type of a given event declaration.
     *
     * @template ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     */
    export type Response<ChannelType extends Channel.Handler.With.Response> =
        Registrar[ChannelType][ResponseKey];

    /**
     * The error type of a given event declaration.
     *
     * @template ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     */
    export type Error<ChannelType extends Channel.Handler.With.Error> =
        Registrar[ChannelType][ErrorKey];
}

/* eslint-disable @stylistic/max-len */

/**
 * An {@link EventDecl | event declaration} with *no* response type *and* no error type.
 * This allows the event owner to be *either* one of `main` or the `renderer`
 * (identified as the type parameter {@link OwnerType} with the {@link MainOwner} and {@link RendererOwner}
 * types, respectively).
 *
 * @template OwnerType - From whom an event of this type is sent.
 * @template RequestType - The type of the request object that is sent when an event occurs.
 */
export type EventDeclListener<OwnerType extends EventOwner, RequestType> =
    EventDeclBase<OwnerType, RequestType, never, never>;

/* eslint-disable @stylistic/max-len */

/**
 * An {@link EventDecl | event declaration} with a response type.  Since responses can be
 * returned only by {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args | ipcRenderer.invoke},
 * event declarations of this type can only be `renderer` events (*i.e.*, *sent* by the `renderer`).
 *
 * @template RequestType - The type of the request object that is sent when an event occurs.
 * @template ResponseType - The type of the response object that is sent when an event succeeds.
 * @template ErrorType - The type of the response object that is sent when an event fails.
 */
export type EventDeclHandler<
    RequestType = never,
    ResponseType = never,
    ErrorType = never
> = EventDeclBase<RendererOwner, RequestType, ResponseType, ErrorType>;

type EventDeclBase<
    OwnerType extends EventOwner,
    RequestType = never,
    ResponseType = never,
    ErrorType = never
> =
    {
        OwnerType: OwnerType;
        RequestType: RequestType;
        ResponseType: ResponseType;
        ErrorType: ErrorType;
    };

/**
 * All events in `electron-reactive-event` are modeled with this type.
 *
 * @note One important distinction is that event declarations with a {@link ResponseType}
 * can only have `OwnerType === {@link RendererOwner}`.  This is a consequence of only
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args | ipcRenderer.invoke}
 * being able to send events *and* receive a response from the receiver (*i.e.*, from `main`).
 * Event declarations, depending upon whether `{@link ResponseType} === {@link EmptyEventParameter}`,
 * evaluate to one of the two internal types {@link EventDeclHandler} or {@link EventDeclListener}.
 *
 * @template OwnerType - From whom an event of this type is sent.
 * @template RequestType - The type of the request object that is sent when an event occurs.
 * @template ResponseType - The type of the response object that is sent when an event succeeds.
 * @template ErrorType - The type of the response object that is sent when an event fails.
 */
export type EventDecl<
    OwnerType extends EventOwner,
    RequestType = never,
    ResponseType = never,
    ErrorType = never
> =
    OwnerType extends MainOwner
        ? [ ResponseType ] extends [ never ]
            ? [ ErrorType ] extends [ never ]
                ? EventDeclListener<MainOwner, RequestType>
                : never
            : never
        : OwnerType extends RendererOwner
            ? [ ResponseType ] extends [ never ]
                ? [ ErrorType ] extends [ never ]
                    ? EventDeclListener<RendererOwner, RequestType>
                    : EventDeclHandler<RequestType, ResponseType, ErrorType>
                : EventDeclHandler<RequestType, ResponseType, ErrorType>
            : never;
