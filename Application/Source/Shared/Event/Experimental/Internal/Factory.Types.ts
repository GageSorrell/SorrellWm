/* File:      Factory.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FErrorMessageDeclTypeKey,
    FErrorPayloadDeclTypeKey,
    FRequestDeclTypeKey,
    FResponseDeclTypeKey } from "./Event.Types";
import type { FRequestDeclNone, FResponseDeclNone } from "../Event.Types";
import type { TChannel } from "./Registrar.Types";
import type { TEventCallbackRecord } from "../Factory.Types";
import type { TIsValid } from "./Utility.Types";

type TEventErrorBase<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    FErrorMessageDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? {
            Message: EventRegistrarType[ChannelType][FErrorMessageDeclTypeKey];
        }
        : never;

/** Simple <=> no payload type. */
type TEventErrorSimple<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    TEventErrorBase<ChannelType, EventRegistrarType>;

type TEventErrorPayload<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    FErrorPayloadDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? {
            Payload: EventRegistrarType[ChannelType][FErrorPayloadDeclTypeKey];
        }
        : never;

type TEventErrorRich<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
        TEventErrorSimple<ChannelType, EventRegistrarType> &
        TEventErrorPayload<ChannelType, EventRegistrarType>;

export type TEventError<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    FErrorPayloadDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? TIsValid<EventRegistrarType[ChannelType][FErrorPayloadDeclTypeKey]> extends true
            ? TEventErrorRich<ChannelType, EventRegistrarType>
            : TEventErrorSimple<ChannelType, EventRegistrarType>
        : never;

/**
 * This is the type that the developer will return in their callbacks.
 * It varies from the type that is sent via IPC.
 */
export type TResponse<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    FResponseDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? EventRegistrarType[ChannelType][FResponseDeclTypeKey]
        : never;

/**
 * This is the type that the developer will provide when firing events.
 * It varies from the type that is sent via IPC.
 */
export type TRequest<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    ChannelType extends keyof EventRegistrarType
        ? FRequestDeclTypeKey extends keyof EventRegistrarType[ChannelType]
            ? EventRegistrarType[ChannelType][FRequestDeclTypeKey]
            : never
        : never;

/** The response type that is sent and received via IPC. */
export type TResponseInternal<ChannelType extends TChannel<EventRegistrarType>, EventRegistrarType> =
    TEventDeclHasResponseType<ChannelType, EventRegistrarType> extends true
        ? FResponseDeclTypeKey extends keyof EventRegistrarType[ChannelType]
            ? (
                | {
                    Data: EventRegistrarType[ChannelType][FResponseDeclTypeKey];
                    Error: undefined;
                }
                | {
                    Data: undefined;
                    Error: TEventError<ChannelType, EventRegistrarType>;
                }
            )
            : never
        : (
            | {
                Data: undefined;
                Error: undefined;
            }
            | {
                Data: undefined;
                Error: TEventError<ChannelType, EventRegistrarType>;
            }
        );

export type TResponseInternalStored<ChannelType extends TChannel<EventRegistrarType>, EventRegistrarType> =
    TEventDeclHasResponseType<ChannelType, EventRegistrarType> extends true
        ? FResponseDeclTypeKey extends keyof EventRegistrarType[ChannelType]
            ? (
                | {
                    Data: EventRegistrarType[ChannelType][FResponseDeclTypeKey];
                    Error: undefined;
                    IsPending: false;
                }
                | {
                    Data: undefined;
                    Error: TEventError<ChannelType, EventRegistrarType>;
                    IsPending: false;
                }
                | {
                    Data: undefined;
                    Error: undefined;
                    IsPending: true;
                }
            )
            : {
                Data: undefined;
                Error: undefined;
                IsPending: true;
            }
        : (
            | {
                Data: undefined;
                Error: undefined;
                IsPending: boolean;
            }
            | {
                Data: undefined;
                Error: TEventError<ChannelType, EventRegistrarType>;
                IsPending: false;
            }
        );

export type TEventDeclHasResponseType<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    FResponseDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? EventRegistrarType[ChannelType][FResponseDeclTypeKey] extends FResponseDeclNone
            ? false
            : true
        : never;

export type TEventDeclHasRequestType<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    FRequestDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? EventRegistrarType[ChannelType][FRequestDeclTypeKey] extends FRequestDeclNone
            ? false
            : true
        : never;

export type TCallbackErrorReturnType<
    ChannelType extends keyof EventRegistrarType,
    EventRegistrarType
> =
    Promise<{
        Error: TEventError<ChannelType, EventRegistrarType>;
    }>;

export type TCallbackSuccessReturnType<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    TEventDeclHasResponseType<ChannelType, EventRegistrarType> extends true
        ? FResponseDeclTypeKey extends keyof EventRegistrarType[ChannelType]
            ? Promise<{
                Data: TEventError<ChannelType, EventRegistrarType>;
            }>
            : never
        : Promise<void>;

export type TCallbackReturnType<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    | TCallbackSuccessReturnType<ChannelType, EventRegistrarType>
    | TCallbackErrorReturnType<ChannelType, EventRegistrarType>;

export type TCallback<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    TEventDeclHasRequestType<ChannelType, EventRegistrarType> extends true
        ? FRequestDeclTypeKey extends keyof EventRegistrarType[ChannelType]
            ? (
                (Request: TRequest<ChannelType, EventRegistrarType>) =>
                TCallbackReturnType<ChannelType, EventRegistrarType>
            )
            : never
        : () => TCallbackReturnType<ChannelType, EventRegistrarType>;

export type TRegisterCallback<EventRegistrarType> = <ChannelType extends TChannel<EventRegistrarType>>(
    Channel: ChannelType,
    Callback: TCallback<ChannelType, EventRegistrarType>
) => void;

export type TRegisterCallbacks<EventRegistrarType> = <ChannelType extends TChannel<EventRegistrarType>>(
    Record: TEventCallbackRecord<ChannelType, EventRegistrarType>
) => void;

export type TUseRegisterCallbackDeferred<EventRegistrarType> =
    () => Readonly<[ TRegisterCallback<EventRegistrarType> ]>;

export type TUseRegisterCallbacksDeferred<EventRegistrarType> =
    () => Readonly<[ TRegisterCallbacks<EventRegistrarType> ]>;

export type TUnregisterCallback<EventRegistrarType> = TRegisterCallback<EventRegistrarType>;
export type TUnregisterCallbacks<EventRegistrarType> = TRegisterCallbacks<EventRegistrarType>;
export type TUnregisterAll<EventRegistrarType> =
    <ChannelType extends TChannel<EventRegistrarType>>(Channel: ChannelType) => void;

// type TEventsWithRequest<EventRegistrarType> =
// {
//     [ Key in keyof EventRegistrarType as
//     TEventDeclHasRequestType<Key, EventRegistrarType> extends true
//         ? Key
//         : never
//     ]: EventRegistrarType[Key];
// };

// export type TChannelsWithRequest<EventRegistrarType> =
//     Extract<
//         keyof TEventsWithRequest<EventRegistrarType>,
//         string
//     >;

// export type TChannelsNoRequest<EventRegistrarType> = Extract<Exclude<
//     keyof TEventsWithRequest<EventRegistrarType>,
//     TChannelsWithRequest<EventRegistrarType>
// >, string>;

type TEquipEventDeclWithName<EventRegistrarType> =
{
    [ Key in keyof EventRegistrarType as Extract<Key, string> ]:
        EventRegistrarType[keyof EventRegistrarType] &
        {
            Name: Extract<Key, string>;
        }
};

type TRegistrarWithNames<EventRegistrarType> =
    TEquipEventDeclWithName<EventRegistrarType>[keyof TEquipEventDeclWithName<EventRegistrarType>];

interface IEventDeclNoResponse
{
    ResponseDeclType: FResponseDeclNone;
}

export type TChannelsWithResponse<EventRegistrarType> =
    Exclude<
        TRegistrarWithNames<EventRegistrarType>,
        IEventDeclNoResponse
    >;

export type TChannelsNoResponse<EventRegistrarType> =
    Extract<
        TRegistrarWithNames<EventRegistrarType>,
        IEventDeclNoResponse
    >;

interface IEventDeclNoRequest
{
    RequestDeclType: FRequestDeclNone;
}

type TChannelsWithRequestHelper<EventRegistrarType> =
    Exclude<
        TRegistrarWithNames<EventRegistrarType>,
        IEventDeclNoRequest
    >;

export type TChannelsWithRequest<EventRegistrarType> =
    Extract<FRequestDeclTypeKey extends keyof TChannelsWithRequestHelper<EventRegistrarType>
        ? TChannelsWithRequestHelper<EventRegistrarType>["Name"]
        : undefined, string> &
    keyof EventRegistrarType;

export type TChannelsNoRequest<EventRegistrarType> =
    Extract<Exclude<keyof EventRegistrarType, TChannelsWithRequest<EventRegistrarType>>, string> &
    keyof EventRegistrarType;

// type TChannelsWithRequestHelper<EventRegistrarType> =
// {
//     [ Key in keyof EventRegistrarType as
//     TEventDeclHasRequestType<Key, EventRegistrarType> extends true
//         ? Key
//         : never
//     ]: unknown;
// };

// export type TChannelsWithRequest<EventRegistrarType> = keyof TChannelsWithRequestHelper<EventRegistrarType>;

// export type TChannelsNoRequest<EventRegistrarType> =
//     Exclude<keyof EventRegistrarType, TChannelsWithRequest<EventRegistrarType>> extends string
//         ? Exclude<keyof EventRegistrarType, TChannelsWithRequest<EventRegistrarType>>
//         : never;

export type TSendEvent<
    EventRegistrarType
> =
{
    <ChannelType extends TChannelsWithRequest<EventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<typeof Channel, EventRegistrarType>
    ): Promise<void>;

    <ChannelType extends TChannelsNoRequest<EventRegistrarType>>(Channel: ChannelType): Promise<void>;
};
