/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    EventDeclHandler,
    EventDeclListener,
    EventOwner,
    MainOwner,
    RendererOwner } from "../Internal";

/* eslint-disable @stylistic/max-len */

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
 * @typeParam OwnerType - From whom an event of this type is sent.
 * @typeParam RequestType - The type of the request object that is sent when an event occurs.
 * @typeParam ResponseType - The type of the response object that is sent when an event succeeds.
 * @typeParam ErrorType - The type of the response object that is sent when an event fails.
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
