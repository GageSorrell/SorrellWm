/**
 * @file      Event.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { FNotFunction } from "../../Shared.Types";
import type { FUnknownErrorCode } from "../ErrorCodes.Types";

export type FIpcEventInitiator =
    | "Backend"
    | "Frontend";

export type FRichResponseData = Record<string, unknown>;

export type TRichResponseSuccess<ResponseData extends FRichResponseData> =
{
    Data: ResponseData;
    Error: undefined;
};

export type TRichResponseFailure<ErrorCode extends FUnknownErrorCode> =
{
    Data: undefined;
    Error: ErrorCode;
};

export type TRichResponseDecl<
    ResponsePayload extends FRichResponseData,
    ErrorCode extends FUnknownErrorCode
> =
{
    Data: ResponsePayload;
    Error: ErrorCode;
};

export type FUnknownRichResponseDecl = TRichResponseDecl<FRichResponseData, FUnknownErrorCode>;

/** "Rich" refers to responses that return data if there is no error. */
export type TRichResponse<
    ResponsePayload extends FRichResponseData,
    ErrorCode extends FUnknownErrorCode
> =
    | TRichResponseSuccess<ResponsePayload>
    | TRichResponseFailure<ErrorCode>;

export type TPoorResponse<ErrorCode extends FUnknownErrorCode> =
{
    Data: undefined;
    Error: ErrorCode | undefined;
};

export type TPoorResponseDecl<ErrorCode extends FUnknownErrorCode> =
{
    Error: ErrorCode;
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

export type TResponseDecl<
    ResponsePayload extends FResponseData,
    ErrorCode extends FUnknownErrorCode
> =
    ResponsePayload extends FRichResponseData
        ? TRichResponseDecl<ResponsePayload, ErrorCode>
        : TPoorResponseDecl<ErrorCode>;

export type TIpcEvent<
    Initiator extends FIpcEventInitiator,
    Request extends FNotFunction,
    ResponsePayload extends FResponseData,
    ErrorString extends string
> =
{
    Initiator: Initiator;
    Request: Request;
    Response: TResponseDecl<ResponsePayload, ErrorString>;
};

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

export type TIpcEventsBase<RegistrarType = unknown> =
{
    [ Key in keyof RegistrarType as RegistrarType[Key] extends FUnknownIpcEvent ? Key : never ]:
    RegistrarType[Key];
};

/** @deprecated Use `TEventDecl` from `electron-reactive-event`. */
export type TIpcFrontendEvent<
    Request extends FNotFunction = FNotFunction,
    Response extends FResponseData = FResponseData,
    ErrorString extends string = string> =
        TIpcEvent<
            "Frontend",
            Request,
            Response,
            ErrorString
        >;

/** @deprecated Use `TEventDecl` from `electron-reactive-event`. */
export type TIpcBackendEvent<
    Request extends FNotFunction,
    Response extends FResponseData,
    ErrorCode extends FUnknownErrorCode> =
        TIpcEvent<
            "Backend",
            Request,
            Response,
            ErrorCode
        >;
