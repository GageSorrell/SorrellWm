/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FNotFunction } from "../Shared.Types";
import type { FUnknownErrorCode } from "./ErrorCodes.Types";

export type FIpcEventInitiator =
    | "Backend"
    | "Frontend";

export type FRichResponseData = Record<string, unknown>;

export type TRichResponseSuccess<TResponseData extends FRichResponseData> =
{
    Data: TResponseData;
    Error: undefined;
};

export type TRichResponseFailure<TErrorCode extends FUnknownErrorCode> =
{
    Data: undefined;
    Error: TErrorCode;
};

export type TRichResponseDecl<
    TResponsePayload extends FRichResponseData,
    TErrorCode extends FUnknownErrorCode
> =
{
    Data: TResponsePayload;
    Error: TErrorCode;
};

export type FUnknownRichResponseDecl = TRichResponseDecl<FRichResponseData, FUnknownErrorCode>;

/** "Rich" refers to responses that return data if there is no error. */
export type TRichResponse<
    TResponsePayload extends FRichResponseData,
    TErrorCode extends FUnknownErrorCode
> =
    | TRichResponseSuccess<TResponsePayload>
    | TRichResponseFailure<TErrorCode>;
// export type TRichResponse<TResponsePayload, TErrorString extends string> =
//     {
//         Data: TResponsePayload;
//         Error: undefined;
//     } |
//     {
//         Data: undefined;
//         Error: TErrorString;
//     };

export type TPoorResponse<TErrorCode extends FUnknownErrorCode> =
{
    Data: undefined;
    Error: TErrorCode | undefined;
};

export type TPoorResponseDecl<TErrorCode extends FUnknownErrorCode> =
{
    Error: TErrorCode;
};

export type FNoResponseData = undefined;

export type FResponseData =
    | FNoResponseData
    | FRichResponseData;

export type FUnknownRichResponseData = TRichResponse<FRichResponseData, FUnknownErrorCode>;
export type FUnknownRichResponseSuccess = TRichResponseSuccess<FRichResponseData>;
export type FUnknownRichResponseFailure = TRichResponseFailure<FUnknownErrorCode>;
export type FUnknownRichResponse =
    | FUnknownRichResponseSuccess
    | FUnknownRichResponseFailure;

export type TResponseDecl<TResponsePayload extends FResponseData, TErrorCode extends FUnknownErrorCode> =
    TResponsePayload extends FRichResponseData
        ? TRichResponseDecl<TResponsePayload, TErrorCode>
        : TPoorResponseDecl<TErrorCode>;

export type TIpcEvent<
    TInitiator extends FIpcEventInitiator,
    TRequest extends FNotFunction,
    TResponsePayload extends FResponseData,
    TErrorString extends string
> =
{
    Initiator: TInitiator;
    Request: TRequest;
    Response: TResponseDecl<TResponsePayload, TErrorString>;
};

// export type FUnknownIpcEvent = TIpcEvent<
//     FIpcEventInitiator,
//     FNotFunction,
//     FResponseData,
//     FUnknownErrorCode
// >;

export type FUnknownRichEvent = TIpcEvent<
    FIpcEventInitiator,
    FNotFunction,
    FRichResponseData,
    FUnknownErrorCode
>;

export type FUnknownPoorEvent = TIpcEvent<
    FIpcEventInitiator,
    FNotFunction,
    FNoResponseData,
    FUnknownErrorCode
>;

export type FUnknownIpcEvent =
    | FUnknownRichEvent
    | FUnknownPoorEvent;

export type TIpcEventsBase<T = Record<string, FUnknownIpcEvent>> = T extends Record<string, FUnknownIpcEvent>
    ? T
    : never;

export type TIpcFrontendEvent<
    TRequest extends FNotFunction = FNotFunction,
    TResponse extends FResponseData = FResponseData,
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
    TResponse extends FResponseData,
    TErrorCode extends FUnknownErrorCode> =
        TIpcEvent<
            "Backend",
            TRequest,
            TResponse,
            TErrorCode
        >;
