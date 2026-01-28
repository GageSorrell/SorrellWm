/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FNotFunction } from "../Shared.Types";

export type FIpcEventInitiator =
    | "Backend"
    | "Frontend";

/** "Rich" refers to responses that return data if there is no error. */
export type TRichResponse<TResponsePayload, TErrorString extends string> =
    {
        Data: TResponsePayload;
        Error: undefined;
    } |
    {
        Data: undefined;
        Error: TErrorString;
    };

export type TPoorResponse<TErrorString extends string> =
{
    Error: TErrorString | undefined;
};

export type FNoResponsePayload = undefined;

export type TEventResponse<TResponsePayload, TErrorString extends string> =
    FNoResponsePayload extends TResponsePayload
        ? TPoorResponse<TErrorString>
        : TRichResponse<TResponsePayload, TErrorString>;

export type TIpcEvent<
    TInitiator extends FIpcEventInitiator,
    TRequest extends FNotFunction,
    TResponsePayload extends FNotFunction,
    TErrorString extends string
> =
{
    Initiator: TInitiator;
    Request: TRequest;
    Response: TEventResponse<TResponsePayload, TErrorString>;
};

export type FUnknownIpcEvent = TIpcEvent<FIpcEventInitiator, FNotFunction, FNotFunction, string>;

export type TIpcEventsBase<T = Record<string, FUnknownIpcEvent>> = T extends Record<string, FUnknownIpcEvent>
    ? T
    : never;

export type TIpcFrontendEvent<
    TRequest extends FNotFunction = FNotFunction,
    TResponse extends FNotFunction = FNotFunction,
    TErrorString extends string = string> =
        TIpcEvent<
            "Frontend",
            TRequest,
            TResponse,
            TErrorString
        >;

export type TEventName<TEvents extends TIpcEventsBase> = keyof TEvents;

export type TIpcBackendEvent<
    TRequest extends FNotFunction,
    TResponse extends FNotFunction,
    TErrorString extends string> =
        TIpcEvent<
            "Backend",
            TRequest,
            TResponse,
            TErrorString
        >;
