/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EventOwner, RendererOwner } from "../Registrar";

/** The key of the request type in an event declaration. */
export type RequestKey = "RequestType";

/** The key of the response type in an event declaration. */
export type ResponseKey = "ResponseType";

/** The key of the error type in an event declaration. */
export type ErrorKey = "ErrorType";

/** The key of the owner type in an event declaration. */
export type OwnerKey = "OwnerType";

/**
 * An {@link EventDecl | event declaration} with *no* response type *and* no error type.
 * This allows the event owner to be *either* one of `main` or the `renderer`
 * (identified as the type parameter {@link OwnerType} with the {@link MainOwner} and {@link RendererOwner}
 * types, respectively).
 *
 * @typeParam OwnerType - From whom an event of this type is sent.
 * @typeParam RequestType - The type of the request object that is sent when an event occurs.
 */
export type EventDeclListener<
    OwnerType extends EventOwner,
    RequestType
> = EventDeclBase<OwnerType, RequestType, never, never>;

/* eslint-disable @stylistic/max-len */

/**
 * An {@link EventDecl | event declaration} with a response type.  Since responses can be
 * returned only by {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args | ipcRenderer.invoke},
 * event declarations of this type can only be `renderer` events (*i.e.*, *sent* by the `renderer`).
 *
 * @typeParam RequestType - The type of the request object that is sent when an event occurs.
 * @typeParam ResponseType - The type of the response object that is sent when an event succeeds.
 * @typeParam ErrorType - The type of the response object that is sent when an event fails.
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
