/* File:      Factory.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import type {
    FResponseDeclTypeKey,
    TCallback,
    TChannel,
    TChannelsNoRequest,
    TChannelsWithRequest,
    TEventDeclHasResponseType,
    TEventError,
    TRegisterCallback,
    TRegisterCallbacks,
    TRequest,
    TResponse,
    TSendEvent,
    TUnregisterAll,
    TUnregisterCallback,
    TUnregisterCallbacks,
    TUseRegisterCallbackDeferred,
    TUseRegisterCallbacksDeferred} from "./Internal";
import type { ipcRenderer } from "electron";

/**
 * Use this to define your event callbacks as a record.
 */
export type TEventCallbackRecord<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
{
    [ Key in ChannelType ]: TCallback<Key, EventRegistrarType>;
};

export type TEventCallbackRecordInternal<EventRegistrarType> = Partial<{
    [ Key in keyof EventRegistrarType ]: Array<TCallback<Key, EventRegistrarType>>;
}>;

// export type TBaseEventFactoryReturnType<FirstEventRegistrarType, SecondEventRegistrarType> =
export type TMainEventFactoryReturnType<FirstEventRegistrarType, SecondEventRegistrarType> =
{
    RegisterCallback: TRegisterCallback<SecondEventRegistrarType>;
    RegisterCallbacks: TRegisterCallbacks<SecondEventRegistrarType>;
    UnregisterCallback: TUnregisterCallback<SecondEventRegistrarType>;
    UnregisterCallbacks: TUnregisterCallbacks<SecondEventRegistrarType>;
    UnregisterAll: TUnregisterAll<SecondEventRegistrarType>;
    SendEvent: TSendEvent<FirstEventRegistrarType>;
};

// export type TMainEventFactoryReturnType<MainEventRegistrarType, RendererEventRegistrarType> =
//     TBaseEventFactoryReturnType<MainEventRegistrarType, RendererEventRegistrarType>;

// In React, the developer should be able to:
//
//     * Send events at mount via a hook (where channel and request are both given).
//           * option to suspend until received
//     * Send events from within memoized functions (where channel and request are
//       specified in the memoized function).
//     * Send an event at mount, *and* resend the event within a memoized function, such that the value
//       returned by the hook is updated when resending
//     * Register a callback at mount, unregister at unmount
//     * Register **and** unregister a callback from within a memoized function
//     * Register a callback from within a memoized function, unregister at unmount
//

export type TUseSendEventReturnType<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType
> =
    TEventDeclHasResponseType<ChannelType, RendererEventRegistrarType> extends true
        ? FResponseDeclTypeKey extends keyof RendererEventRegistrarType[ChannelType]
            ? (
                | Readonly<[
                    Data: undefined,
                    Error: undefined,
                    IsPending: true
                ]>
                | Readonly<[
                    Data: TResponse<ChannelType, RendererEventRegistrarType>,
                    Error: undefined,
                    IsPending: false
                ]>
                | Readonly<[
                    Data: undefined,
                    Error: TEventError<ChannelType, RendererEventRegistrarType>,
                    IsPending: false
                ]>
            )
            : never
        : (
            | Readonly<[
                Error: undefined,
                IsPending: true
            ]>
            | Readonly<[
                Error: TEventError<ChannelType, RendererEventRegistrarType>,
                IsPending: false
            ]>
        );

export type TUseSendEvent<RendererEventRegistrarType> =
{
    <ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<ChannelType, RendererEventRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<
        Extract<ChannelType, keyof RendererEventRegistrarType>,
        RendererEventRegistrarType>;

    <ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): TUseSendEventReturnType<
        Extract<ChannelType, keyof RendererEventRegistrarType>,
        RendererEventRegistrarType>;

    <ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): TUseSendEventReturnType<
        Extract<ChannelType, keyof RendererEventRegistrarType>,
        RendererEventRegistrarType>;

    <ChannelType extends TChannel<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request?: TRequest<ChannelType, RendererEventRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<
        Extract<ChannelType, keyof RendererEventRegistrarType
        >, RendererEventRegistrarType>;
};

export type TSendEventDeferred<RendererEventRegistrarType> =
{
    <ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): Promise<TResponse<ChannelType, RendererEventRegistrarType> | undefined>;

    <ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<ChannelType, RendererEventRegistrarType>
    ): Promise<TResponse<ChannelType, RendererEventRegistrarType> | undefined>;
};

export type TUseSendEventDeferred<RendererEventRegistrarType> = () => Readonly<[
    SendEvent: TSendEventDeferred<RendererEventRegistrarType>,
    IsPending: boolean
]>;

export type FEventProvider = ({ children }: PropsWithChildren) => ReactNode;

export type TEventContext<MainEventRegistrarType, RendererEventRegistrarType> =
Partial<{
    /** Send an event when the component mounts. */
    UseSendEvent: TUseSendEvent<RendererEventRegistrarType>;

    /** The returned callback returns `undefined` if a re-render is triggered before it fulfills. */
    UseSendEventDeferred: TUseSendEventDeferred<RendererEventRegistrarType>;

    UseRegisterCallback: TRegisterCallback<MainEventRegistrarType>;

    UseRegisterCallbackDeferred: TUseRegisterCallbackDeferred<MainEventRegistrarType>;

    UseRegisterCallbacks: TRegisterCallbacks<MainEventRegistrarType>;

    UseRegisterCallbacksDeferred: TUseRegisterCallbacksDeferred<MainEventRegistrarType>;
}>;

export type FEventContext = TEventContext<Record<string, unknown>, Record<string, unknown>>;

export type FIpcRendererFunctions =
{
    invoke: typeof ipcRenderer.invoke;
    on: typeof ipcRenderer.on;
    off: typeof ipcRenderer.off;
    once: typeof ipcRenderer.once;
    send: typeof ipcRenderer.send;
};

export type CEventProvider =
{
    IpcRendererFunctions: FIpcRendererFunctions;
};

export type PEventProvider =
    PropsWithChildren &
    {
        value: FIpcRendererFunctions;
    };
