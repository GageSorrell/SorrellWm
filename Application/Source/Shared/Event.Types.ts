/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FAnnotatedPanel, FFocusChange, FPanel } from "#/Tree.Types";
import type {
    FBringIntoPanelErrorCode,
    FGetAnnotatedPanelsErrorCode,
    FGetCurrentPanelErrorCode,
    FGetFocusDataErrorCode,
    FGetInsertableWindowDataErrorCode,
    FGetPanelScreenshotsErrorCode,
    FLogErrorCode,
    FOnChangeFocusErrorCode,
    FReadyForRouteErrorCode } from "./EventErrorCodes.Types";
import type { FFocusData, FInsertableWindowData } from "./Transaction.Types";
import type { FNotFunction } from "./Shared.Types";

export type FIpcEventInitiator =
    | "Backend"
    | "Frontend";

export type TResponseDataWrapper<TDataType, TErrorString extends string> =
    | {
        Data: TDataType;
        Error: undefined;
    }
    | {
        Data: undefined;
        Error: TErrorString;
    };

export type TIpcEvent<
    TInitiator extends FIpcEventInitiator,
    TRequestData extends FNotFunction,
    TResponseData extends FNotFunction,
    TErrorString extends string
> =
{
    Initiator: TInitiator;
    RequestData: TRequestData;
    ResponseData: TResponseDataWrapper<TResponseData, TErrorString>;
};

type FUnknownIpcEvent = TIpcEvent<FIpcEventInitiator, FNotFunction, FNotFunction, string>;

export type TIpcEventsBase<T> = T extends Record<string, FUnknownIpcEvent>
    ? T
    : never;

export type TIpcFrontendEvent<
    TRequestData extends FNotFunction,
    TResponseData extends FNotFunction,
    TErrorString extends string> =
        TIpcEvent<
            "Frontend",
            TRequestData,
            TResponseData,
            TErrorString
        >;

// @TODO Create proper string unions for the error codes for each event.
export type FIpcFrontendEvents = TIpcEventsBase<{
    BringIntoPanel: TIpcFrontendEvent<
        FAnnotatedPanel,
        undefined,
        FBringIntoPanelErrorCode
    >;
    GetAnnotatedPanels: TIpcFrontendEvent<
        undefined,
        Array<FAnnotatedPanel>,
        FGetAnnotatedPanelsErrorCode
    >;
    GetCurrentPanel: TIpcFrontendEvent<
        undefined,
        FPanel,
        FGetCurrentPanelErrorCode
    >;
    GetFocusData: TIpcFrontendEvent<
        undefined,
        FFocusData,
        FGetFocusDataErrorCode
    >;
    GetPanelScreenshots: TIpcFrontendEvent<
        undefined,
        Array<string>,
        FGetPanelScreenshotsErrorCode
    >;
    GetInsertableWindowData: TIpcFrontendEvent<
        undefined,
        Array<FInsertableWindowData>,
        FGetInsertableWindowDataErrorCode
    >;
    Log: TIpcFrontendEvent<
        Array<unknown>,
        undefined,
        FLogErrorCode
    >;
    OnChangeFocus: TIpcFrontendEvent<
        FFocusChange,
        undefined,
        FOnChangeFocusErrorCode
    >;
    ReadyForRoute: TIpcFrontendEvent<
        undefined,
        undefined,
        FReadyForRouteErrorCode
    >;
}>;

export type TIpcBackendEvent<
    TRequestData extends FNotFunction,
    TResponseData extends FNotFunction,
    TErrorString extends string> =
        TIpcEvent<
            "Backend",
            TRequestData,
            TResponseData,
            TErrorString
        >;

export type FIpcBackendEvents = TIpcEventsBase<{
    Activate: TIpcBackendEvent<
        boolean,
        undefined,
        string
    >;
    TearDown: TIpcBackendEvent<
        undefined,
        undefined,
        string
    >;
}>;

export type FIpcEvents = FIpcFrontendEvents & FIpcBackendEvents;

export type FIpcChannel = keyof FIpcEvents;

export type FIpcFrontendChannel = keyof FIpcFrontendEvents;
// export type FIpcFrontendChannel = keyof
// {
//     [ Channel in FIpcChannel as FIpcEvents[Channel]["Initiator"] extends "Frontend"
//         ? Channel
//         : never
//     ]: unknown;
// };

export type FIpcBackendChannel = keyof FIpcBackendEvents;
// export type FIpcBackendChannel = keyof
// {
//     [ Channel in FIpcChannel as FIpcEvents[Channel]["Initiator"] extends "Backend"
//         ? Channel
//         : never
//     ]: unknown;
// };

export type TRequestData<T extends FIpcChannel> = FIpcEvents[T]["RequestData"];
export type TResponseDataBase<T extends FIpcChannel> = FIpcEvents[T]["ResponseData"] | undefined;
export type TResponseData<T extends FIpcChannel> =
{
    RemoveListener: () => void;
    Response: TResponseDataBase<T>;
};

export type TIpcHandler<T extends FIpcChannel> =
    (RequestData: TRequestData<T> | undefined) => Promise<TResponseData<T>>;

export type TIpcHandlerReturnType<T extends FIpcChannel> = ReturnType<TIpcHandler<T>>;

export type TIpcCallback<T extends FIpcChannel> =
    (ResponseData: TResponseData<T> | undefined) => Promise<void>;
