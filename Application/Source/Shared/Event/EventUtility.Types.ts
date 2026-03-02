/* File:      EventUtility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FIpcBackendEvents, FIpcFrontendEvents } from "./Event.Types";
import type {
    FRichResponseData,
    FUnknownIpcEvent,
    FUnknownRichResponseDecl,
    TIpcEventsBase,
    TPoorResponse,
    TPoorResponseDecl,
    TRichResponse,
    TRichResponseDecl,
    TRichResponseFailure,
    TRichResponseSuccess } from "./EventBase.Types";
import type { FUnknownErrorCode } from "./ErrorCodes.Types";

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

// /** Filters out events that do not have a response. */
// export type TRichEvents<T extends TIpcEventsBase> =
// {
//     [ Key in keyof T as undefined extends T[Key]["Response"]["Data"] ? Key : never ]: T[Key];
// };

// export type TRichEvents<T extends TIpcEventsBase> =
// {
//     [ Key in keyof T as "Data" extends keyof T[Key]["Response"] ? Key : never ]: T[Key];
// };

// export type TRichEvents<T extends TIpcEventsBase> =
// {
//     /* eslint-disable @stylistic/indent */
//     [
//         Key in keyof T as
//             "Data" extends keyof T[Key]["Response"]
//                 ? ( [ T[Key]["Response"]["Data"] ] extends [ undefined ] ? never : Key )
//                 : never
//     ]: T[Key];
//     /* eslint-enable @stylistic/indent */
// };

export type TPoorEvents<T extends TIpcEventsBase> =
{
    [ Key in keyof T as "Data" extends keyof T[Key]["Response"] ? never : Key ]: T[Key];
};

export type TRichEventDecl<T extends FUnknownIpcEvent> =
    T["Response"] extends FUnknownRichResponseDecl
        ? T
        : never;

export type TRichFrontendEventResponseData<T extends keyof FRichFrontendEvents> =
    Exclude<FIpcFrontendEvents[T]["Response"]["Data"], undefined>;

export type TRichEventDataOrUndefined<T extends FUnknownIpcEvent> =
    "Data" extends keyof T["Response"]
        ? T["Response"]["Data"]
        : undefined;

export type TPoorEvent<T extends FUnknownIpcEvent> =
    "Data" extends keyof T["Response"]
        ? never
        : T;

type TRichEventsIntermediate<T extends TIpcEventsBase> =
{
    [ Key in keyof T ]: TRichEventDecl<T[Key]>;
};

export type TRichEvents<T extends TIpcEventsBase> =
{
    /* eslint-disable @stylistic/indent */
    [
        Key in keyof TRichEventsIntermediate<T> as
        TRichEventsIntermediate<T>[Key] extends never
            ? never
            : Key
    ]: T[Key];
    /* eslint-ensable @stylistic/indent */
};
//     [ Key in keyof T as undefined extends T[Key]["Response"]["Data"] ? Key : never ]: T[Key];

export type FRichBackendEvents = TRichEvents<FIpcBackendEvents>;
export type FRichFrontendEvents = TRichEvents<FIpcFrontendEvents>;
export type FRichEvents = FRichBackendEvents & FRichFrontendEvents;

export type TGetRichResponse<
    T extends TRichResponseDecl<FRichResponseData, FUnknownErrorCode>
> = TRichResponse<T["Data"], T["Error"]>;

export type TGetRichResponseFromKey<T extends keyof FRichEvents> =
    TGetRichResponse<FRichEvents[T]["Response"]>;

export type TGetRichResponseAsSuccess<T extends keyof FRichEvents> =
    TRichResponseSuccess<NonNullable<FRichEvents[T]["Response"]["Data"]>>;

export type TGetDefaultRichResponseData<T extends keyof FRichEvents> = TGetRichResponseAsSuccess<T>["Data"];

export type TGetRichResponseAsFailure<T extends keyof FRichEvents> =
    TRichResponseFailure<NonNullable<FRichEvents[T]["Response"]["Error"]>>;

export type FPoorEvents = FPoorBackendEvents & FPoorFrontendEvents;

// export type TGetPoorResponse<T extends TPoorResponseDecl<FUnknownErrorCode>> = TPoorResponse<T["Error"]>;
export type FPoorResponseAsSuccess =
{
    Data: undefined;
    Error: undefined;
};

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export type TPoorResponseAsSuccess<T extends keyof FPoorEvents> =
{
    Data: undefined;
    Error: undefined;
};

export type TPoorResponseAsFailure<T extends keyof FPoorEvents> =
{
    Data: undefined;
    Error: TGetErrorCode<T>;
};

export type TGetPoorResponse<T extends TPoorResponseDecl<FUnknownErrorCode>> = TPoorResponse<T["Error"]>;
export type TGetPoorResponseFromKey<T extends keyof FPoorEvents> =
    TGetPoorResponse<FPoorEvents[T]["Response"]>;

export type TGetErrorCode<T extends keyof FIpcEvents> = FIpcEvents[T]["Response"]["Error"];

export type TGetResponse<
    T extends TRichResponseDecl<FRichResponseData, FUnknownErrorCode> | TPoorResponseDecl<FUnknownErrorCode>
> =
    T extends TRichResponseDecl<FRichResponseData, FUnknownErrorCode>
        ? TGetRichResponse<T>
        : T extends TPoorResponseDecl<FUnknownErrorCode>
            ? TGetPoorResponse<T>
            : never;

export type TGetResponseFromKey<T extends keyof FIpcEvents> =
    T extends keyof FRichEvents
        ? TGetRichResponse<FIpcEvents[T]["Response"]>
        : T extends keyof FPoorEvents
            ? TGetPoorResponse<FIpcEvents[T]["Response"]>
            : never;

export type FPoorBackendEvents = TPoorEvents<FIpcBackendEvents>;
export type FPoorFrontendEvents = TPoorEvents<FIpcFrontendEvents>;

/** A callback to respond to a received event. */
export type TEventCallback<T extends keyof FIpcEvents> = (
    Response: FIpcEvents[T]["Request"]
) => Promise<TGetResponse<FIpcEvents[T]["Response"]>>;

type TIsUnion<Type, Original = Type> =
    Type extends unknown
        ? ([ Original ] extends [ Type ] ? false : true)
        : false;

type THasExactlyOneKey<Type> =
    Type extends Record<PropertyKey, unknown>
        ? ([ keyof Type ] extends [ never ]
            ? false
            : ( TIsUnion<keyof Type> extends true ? false : true )
        )
        : false;

/** The rich frontend events whose respective `Data` properties have exactly one property. */
export type FSingleRichFrontendChannels =
{
    [ Key in keyof FRichFrontendEvents ]-?:
        THasExactlyOneKey<FRichFrontendEvents[Key]["Response"]["Data"]> extends true
            ? Key
            : never
}[keyof FRichFrontendEvents];

type TGetValueOfSinglePropertyRecord<T extends Record<PropertyKey, unknown>> =
    keyof T extends infer Key
        ? Key extends PropertyKey
            ? T[Key]
            : never
        : never;

export type FSingleRichFrontendEvents = Pick<FRichFrontendEvents, FSingleRichFrontendChannels>;

export type TGetSingleRichResponseData<T extends FSingleRichFrontendChannels> =
    TGetValueOfSinglePropertyRecord<FSingleRichFrontendEvents[T]["Response"]["Data"]>;
