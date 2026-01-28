/* File:      EventUtility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FIpcBackendEvents, FIpcFrontendEvents } from "./Event.Types";
import type { FUnknownIpcEvent, TIpcEventsBase } from "./EventBase.Types";

export type FIpcBackendChannel = keyof FIpcBackendEvents;

export type FIpcEvents = FIpcFrontendEvents & FIpcBackendEvents;

export type FIpcChannel = keyof FIpcEvents;

export type FIpcFrontendChannel = keyof FIpcFrontendEvents;

export type TRequest<T extends FIpcChannel> = FIpcEvents[T]["Request"];
export type TResponse<T extends FIpcChannel> = FIpcEvents[T]["Response"];

/** Maps events that do *not* have responses to `never`. */
export type TEventHasResponse<T extends FUnknownIpcEvent> = "Data" extends keyof T["Response"]
    ? T
    : never;

/** Filters out events that do not have a response. */
export type TRichEvents<T extends TIpcEventsBase> =
{
    [ Key in keyof T as "Data" extends keyof T[Key]["Response"] ? Key : never ]: T[Key];
};

export type TPoorEvents<T extends TIpcEventsBase> =
{
    [ Key in keyof T as "Data" extends keyof T[Key]["Response"] ? never : Key ]: T[Key];
};

export type TRichEvent<T extends FUnknownIpcEvent> =
    "Data" extends keyof T["Response"]
        ? T
        : never;

export type TPoorEvent<T extends FUnknownIpcEvent> =
    "Data" extends keyof T["Response"]
        ? never
        : T;

export type FRichBackendEvents = TRichEvents<FIpcBackendEvents>;
export type FRichFrontendEvents = TRichEvents<FIpcFrontendEvents>;

export type FPoorBackendEvents = TPoorEvents<FIpcBackendEvents>;
export type FPoorFrontendEvents = TPoorEvents<FIpcFrontendEvents>;

type TEventCallbackReturnType<TEvent extends FUnknownIpcEvent> =
    TRichEvent<TEvent> extends TEvent
        ? TEvent["Response"]
        : void;

/** A callback to respond to a received event. */
export type TEventCallback<TEvent extends FUnknownIpcEvent> = (
    Response: TEvent["Request"]
) => Promise<TEventCallbackReturnType<TEvent>>;
