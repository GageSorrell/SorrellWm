/* File:      Factory.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FErrorMessageDeclTypeKey,
    FErrorPayloadDeclTypeKey,
    FRequestDeclTypeKey,
    FResponseDeclTypeKey } from "./Event.Types.ts";
import type { FRequestDeclNone, FResponseDeclNone } from "../Event.Types.ts";
import type { BrowserWindow } from "electron";
import type { TCallbackRecord } from "../Factory.Types.ts";
import type { TChannel } from "./Registrar.Types.ts";
import type { TIsValid } from "./Utility.Types.ts";

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
            ? FRequestDeclNone extends EventRegistrarType[ChannelType][FRequestDeclTypeKey]
                ? never
                : EventRegistrarType[ChannelType][FRequestDeclTypeKey]
            : never
        : never;

export type FResponseInternal =
{
    Data?: unknown;
    Error: unknown;
};

export type FRendererResponseInternal =
{
    Data?: unknown;
    Error: unknown;
    IsPending: boolean;
};

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
    FErrorPayloadDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? FErrorPayloadDeclTypeKey extends keyof EventRegistrarType[ChannelType]
            ? [ EventRegistrarType[ChannelType][FErrorPayloadDeclTypeKey] ] extends [ never ]
                ? Promise<{
                    Error: string;
                }>
                : Promise<{
                    Error:
                    {
                        Message: string;
                        Payload: EventRegistrarType[ChannelType][FErrorPayloadDeclTypeKey];
                    }
                }>
            : never
        : never;
// Error: TEventError<ChannelType, EventRegistrarType>;

export type TCallbackSuccessReturnType<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    TEventDeclHasResponseType<ChannelType, EventRegistrarType> extends true
        ? FResponseDeclTypeKey extends keyof EventRegistrarType[ChannelType]
            ? Promise<{
                Data: TResponse<ChannelType, EventRegistrarType>;
            }>
            : Promise<never>
        : Promise<void>;

export type TCallbackReturnType<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    | TCallbackSuccessReturnType<ChannelType, EventRegistrarType>
    | TCallbackErrorReturnType<ChannelType, EventRegistrarType>;

export type TAwaitedCallback<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    Awaited<TCallbackReturnType<ChannelType, EventRegistrarType>>;

export type TCallback<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
    FRequestDeclTypeKey extends keyof EventRegistrarType[ChannelType]
        ? FRequestDeclNone extends EventRegistrarType[ChannelType][FRequestDeclTypeKey]
            ? () => TCallbackReturnType<ChannelType, EventRegistrarType>
            : (
                (Request: TRequest<ChannelType, EventRegistrarType>) =>
                TCallbackReturnType<ChannelType, EventRegistrarType>
            )
        : never;
// TEventDeclHasRequestType<ChannelType, EventRegistrarType> extends true
//     ? FRequestDeclTypeKey extends keyof EventRegistrarType[ChannelType]
//         ? (
//             (Request: TRequest<ChannelType, EventRegistrarType>) =>
//             TCallbackReturnType<ChannelType, EventRegistrarType>
//         )
//         : never
//     : () => TCallbackReturnType<ChannelType, EventRegistrarType>;

export type TRegisterCallback<EventRegistrarType> = <ChannelType extends TChannel<EventRegistrarType>>(
    Channel: ChannelType,
    Callback: TCallback<ChannelType, EventRegistrarType>
) => void;

export type TRegisterCallbacks<EventRegistrarType> = <ChannelType extends TChannel<EventRegistrarType>>(
    Record: TCallbackRecord<ChannelType, EventRegistrarType>
) => void;

export type TUseRegisterCallbackDeferred<EventRegistrarType> =
    () => Readonly<[ TRegisterCallback<EventRegistrarType> ]>;

export type TUseRegisterCallbacksDeferred<EventRegistrarType> =
    () => Readonly<[ TRegisterCallbacks<EventRegistrarType> ]>;

export type TUseUnregisterCallbackDeferred<MainEventRegistrarType> =
    () => Readonly<[ UnregisterCallback: TUnregisterCallback<MainEventRegistrarType> ]>;

export type TUseUnregisterCallbacksDeferred<MainEventRegistrarType> =
    () => Readonly<[ UnregisterCallbacks: TUnregisterCallbacks<MainEventRegistrarType> ]>;

export type TUnregisterCallback<EventRegistrarType> =
    <ChannelType extends TChannel<EventRegistrarType>>(
        Channel: ChannelType,
        Callback: TCallback<ChannelType, EventRegistrarType>
    ) => void;

export type TUnregisterCallbacks<EventRegistrarType> =
    <ChannelType extends TChannel<EventRegistrarType>>(
        Record: TCallbackRecord<ChannelType, EventRegistrarType>
    ) => void;

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

// interface IEventDeclNoRequest
// {
//     RequestDeclType: FRequestDeclNone;
// }

// export type TChannelsWithRequestHelper<EventRegistrarType> =
//     Exclude<
//         TRegistrarWithNames<EventRegistrarType>,
//         IEventDeclNoRequest
//     >;

// type TNew<EventRegistrarType> =
// {
//     [ Key in TRegistrarWithNames<EventRegistrarType>["Name"] ]:
//     FRequestDeclTypeKey extends keyof TRegistrarWithNames<EventRegistrarType>
//         ? TRegistr
// };
// {
//     [ Key in keyof TRegistrarWithNames<EventRegistrarType> ]:
//     FRequestDeclTypeKey extends keyof TRegistrarWithNames<Key>
//         ? FRequestDeclNone extends TRegistrarWithNames<Key>[FRequestDeclTypeKey]
//             ? undefined
//             : never
//         : never;
// };

type TChannelsWithRequestHelper<EventRegistrarType> =
{
    [ Key in keyof EventRegistrarType ]:
    FRequestDeclTypeKey extends keyof EventRegistrarType[Key]
        ? FRequestDeclNone extends EventRegistrarType[Key][FRequestDeclTypeKey]
            ? undefined
            : Key
        : never
};

export type TChannelsWithRequest<EventRegistrarType> =
    Extract<
        TChannelsWithRequestHelper<EventRegistrarType>[keyof TChannelsWithRequestHelper<EventRegistrarType>],
        string
    >;

export type TChannelsNoRequest<EventRegistrarType> =
    Extract<
        Exclude<
            keyof EventRegistrarType,
            TChannelsWithRequestHelper<EventRegistrarType>
        >,
        string
    >;

// export type TChannelsWithRequest<EventRegistrarType> =
//     Extract<Extract<FRequestDeclTypeKey extends keyof TChannelsWithRequestHelper<EventRegistrarType>
//         ? TChannelsWithRequestHelper<EventRegistrarType>["Name"]
//         : undefined, string>, keyof EventRegistrarType>;

//     keyof EventRegistrarType;

// export type TChannelsNoRequest<EventRegistrarType> =
//     Extract<Exclude<keyof EventRegistrarType, TChannelsWithRequest<EventRegistrarType>>, string>;

//     keyof EventRegistrarType;

export type TNonemptyArray<ElementType> =
    | [ ElementType ]
    | [ ElementType, ...Array<ElementType> ];

export type TSendEventReturnType<
    ChannelType extends TChannelsWithRequest<EventRegistrarType> | TChannelsNoRequest<EventRegistrarType>,
    WindowType extends BrowserWindow | Array<BrowserWindow>,
    EventRegistrarType
> =
    WindowType extends Array<BrowserWindow>
        ? Array<TResponse<ChannelType, EventRegistrarType>>
        : TResponse<ChannelType, EventRegistrarType>;

export type TSendEvent<EventRegistrarType> =
{
    <ChannelType extends TChannelsWithRequest<EventRegistrarType>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        Request: TRequest<typeof Channel, EventRegistrarType>,
        BrowserWindows: WindowType
    ): Promise<TSendEventReturnType<ChannelType, WindowType, EventRegistrarType>>;

    <ChannelType extends TChannelsNoRequest<EventRegistrarType>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        BrowserWindows: WindowType
    ): Promise<TSendEventReturnType<ChannelType, WindowType, EventRegistrarType>>;
};
