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

export type TRequest<Type extends FIpcChannel> = FIpcEvents[Type]["Request"];
export type TResponse<Type extends FIpcChannel> = FIpcEvents[Type]["Response"];

/** Maps events that do *not* have responses to `never`. */
export type TEventHasResponse<Type extends FUnknownIpcEvent> = "Data" extends keyof Type["Response"]
    ? Type
    : never;

// /** Filters out events that do not have a response. */
// export type TRichEvents<Type extends TIpcEventsBase> =
// {
//     [ Key in keyof T as undefined extends Type[Key]["Response"]["Data"] ? Key : never ]: Type[Key];
// };

// export type TRichEvents<Type extends TIpcEventsBase> =
// {
//     [ Key in keyof T as "Data" extends keyof Type[Key]["Response"] ? Key : never ]: Type[Key];
// };

// export type TRichEvents<Type extends TIpcEventsBase> =
// {
//     /* eslint-disable @stylistic/indent */
//     [
//         Key in keyof T as
//             "Data" extends keyof Type[Key]["Response"]
//                 ? ( [ Type[Key]["Response"]["Data"] ] extends [ undefined ] ? never : Key )
//                 : never
//     ]: Type[Key];
//     /* eslint-enable @stylistic/indent */
// };

export type TPoorEvents<Type extends TIpcEventsBase> =
{
    [ Key in keyof Type as "Data" extends keyof Type[Key]["Response"] ? never : Key ]: Type[Key];
};

export type TRichEventDecl<Type extends FUnknownIpcEvent> =
    Type["Response"] extends FUnknownRichResponseDecl
        ? Type
        : never;

export type TRichFrontendEventResponseData<Type extends keyof FRichFrontendEvents> =
    Exclude<FIpcFrontendEvents[Type]["Response"]["Data"], undefined>;

export type TRichEventDataOrUndefined<Type extends FUnknownIpcEvent> =
    "Data" extends keyof Type["Response"]
        ? Type["Response"]["Data"]
        : undefined;

export type TPoorEvent<Type extends FUnknownIpcEvent> =
    "Data" extends keyof Type["Response"]
        ? never
        : Type;

type TRichEventsIntermediate<Type extends TIpcEventsBase> =
{
    [ Key in keyof Type ]: TRichEventDecl<Type[Key]>;
};

export type TRichEvents<Type extends TIpcEventsBase> =
{
    /* eslint-disable @stylistic/indent */
    [
        Key in keyof TRichEventsIntermediate<Type> as
        TRichEventsIntermediate<Type>[Key] extends never
            ? never
            : Key
    ]: Type[Key];
    /* eslint-enable @stylistic/indent */
};
//     [ Key in keyof T as undefined extends Type[Key]["Response"]["Data"] ? Key : never ]: Type[Key];

export type FRichBackendEvents = TRichEvents<FIpcBackendEvents>;
export type FRichFrontendEvents = TRichEvents<FIpcFrontendEvents>;
export type FRichEvents = FRichBackendEvents & FRichFrontendEvents;

export type TGetRichResponse<
    Type extends TRichResponseDecl<FRichResponseData, FUnknownErrorCode>
> = TRichResponse<Type["Data"], Type["Error"]>;

export type TGetRichResponseFromKey<Type extends keyof FRichEvents> =
    TGetRichResponse<FRichEvents[Type]["Response"]>;

export type TGetRichResponseAsSuccess<Type extends keyof FRichEvents> =
    TRichResponseSuccess<NonNullable<FRichEvents[Type]["Response"]["Data"]>>;

export type TGetDefaultRichResponseData<Type extends keyof FRichEvents> =
    TGetRichResponseAsSuccess<Type>["Data"];

export type TGetRichResponseAsFailure<Type extends keyof FRichEvents> =
    TRichResponseFailure<NonNullable<FRichEvents[Type]["Response"]["Error"]>>;

export type FPoorEvents = FPoorBackendEvents & FPoorFrontendEvents;

// export type TGetPoorResponse<Type extends TPoorResponseDecl<FUnknownErrorCode>> =
//     TPoorResponse<Type["Error"]>;
export type FPoorResponseAsSuccess =
{
    Data: undefined;
    Error: undefined;
};

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export type TPoorResponseAsSuccess<Type extends keyof FPoorEvents> =
{
    Data: undefined;
    Error: undefined;
};

export type TPoorResponseAsFailure<Type extends keyof FPoorEvents> =
{
    Data: undefined;
    Error: TGetErrorCode<Type>;
};

export type TGetPoorResponse<Type extends TPoorResponseDecl<FUnknownErrorCode>> =
    TPoorResponse<Type["Error"]>;

export type TGetPoorResponseFromKey<Type extends keyof FPoorEvents> =
    TGetPoorResponse<FPoorEvents[Type]["Response"]>;

export type TGetErrorCode<Type extends keyof FIpcEvents> = FIpcEvents[Type]["Response"]["Error"] | "";

export type TGetResponse<
    Type extends
        | TRichResponseDecl<FRichResponseData, FUnknownErrorCode>
        | TPoorResponseDecl<FUnknownErrorCode>
> =
    Type extends TRichResponseDecl<FRichResponseData, FUnknownErrorCode>
        ? TGetRichResponse<Type>
        : Type extends TPoorResponseDecl<FUnknownErrorCode>
            ? TGetPoorResponse<Type>
            : never;

export type TGetResponseFromKey<Type extends keyof FIpcEvents> =
    Type extends keyof FRichEvents
        ? TGetRichResponse<FIpcEvents[Type]["Response"]>
        : Type extends keyof FPoorEvents
            ? TGetPoorResponse<FIpcEvents[Type]["Response"]>
            : never;

export type FPoorBackendEvents = TPoorEvents<FIpcBackendEvents>;
export type FPoorFrontendEvents = TPoorEvents<FIpcFrontendEvents>;

/** A callback to respond to a received event. */
export type TEventCallback<Type extends keyof FIpcEvents> = (
    Response: FIpcEvents[Type]["Request"]
) => Promise<TGetResponse<FIpcEvents[Type]["Response"]>>;

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

type TGetValueOfSinglePropertyRecord<Type extends Record<PropertyKey, unknown>> =
    keyof Type extends infer Key
        ? Key extends PropertyKey
            ? Type[Key]
            : never
        : never;

export type FSingleRichFrontendEvents = Pick<FRichFrontendEvents, FSingleRichFrontendChannels>;

export type TGetSingleRichResponseData<Type extends FSingleRichFrontendChannels> =
    TGetValueOfSinglePropertyRecord<FSingleRichFrontendEvents[Type]["Response"]["Data"]>;

type TChannelTaggedBase<ChannelType extends string = string> = `${ number }-${ ChannelType }`;

export type TBackendChannelTagged<ChannelType extends FIpcBackendChannel> = TChannelTaggedBase<ChannelType>;
export type TFrontendChannelTagged<ChannelType extends FIpcFrontendChannel> = TChannelTaggedBase<ChannelType>;
export type TChannelTagged<ChannelType extends FIpcChannel> =
    ChannelType extends FIpcBackendChannel
        ? TBackendChannelTagged<ChannelType>
        : ChannelType extends FIpcFrontendChannel
            ? TFrontendChannelTagged<ChannelType>
            : never;

export type FBackendChannelTagged = TBackendChannelTagged<FIpcBackendChannel>;
export type FFrontendChannelTagged = TFrontendChannelTagged<FIpcFrontendChannel>;
export type FChannelTagged = TChannelTagged<FIpcChannel>;

export type FBackendChannelTagger = (Channel: FIpcBackendChannel) => FBackendChannelTagged | undefined;
export type FFrontendChannelTagger = (Channel: FIpcFrontendChannel) => FFrontendChannelTagged | undefined;
