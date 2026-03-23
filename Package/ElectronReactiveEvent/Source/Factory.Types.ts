/* File:      Factory.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FResponseDeclTypeKey,
    TCallback,
    TChannelsNoRequest,
    TChannelsWithRequest,
    TEventDeclHasResponseType,
    TEventError,
    TRegisterCallback,
    TRegisterCallbacks,
    TRequest,
    TResponse,
    TSendEvent,
    TUnregisterCallback,
    TUnregisterCallbacks,
    TUseRegisterCallbackDeferred,
    TUseRegisterCallbacksDeferred,
    TUseUnregisterCallbackDeferred,
    TUseUnregisterCallbacksDeferred} from "./Internal/index.js";
import type { PropsWithChildren, ReactNode } from "react";
import type { FResponseDeclNone } from "./Event.Types.js";
import type { ipcRenderer } from "electron";

/** Use this to define your event callbacks as a record. */
export type TCallbackRecord<ChannelType extends keyof EventRegistrarType, EventRegistrarType> =
{
    [ Key in ChannelType ]: TCallback<Key, EventRegistrarType>;
};

export type TMainEventFactoryReturnType<FirstEventRegistrarType, SecondEventRegistrarType> =
{
    RegisterCallback: TRegisterCallback<SecondEventRegistrarType>;
    RegisterCallbacks: TRegisterCallbacks<SecondEventRegistrarType>;
    UnregisterCallback: TUnregisterCallback<SecondEventRegistrarType>;
    UnregisterCallbacks: TUnregisterCallbacks<SecondEventRegistrarType>;
    UnregisterAll: () => void;
    SendEvent: TSendEvent<FirstEventRegistrarType>;
};

/**
 * The result returned from `UseSendEvent` or `SendEventDeferred`.
 */
export type TRendererEventResponse<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType
> =
    TEventDeclHasResponseType<ChannelType, RendererEventRegistrarType> extends true
        ? FResponseDeclTypeKey extends keyof RendererEventRegistrarType[ChannelType]
            ? (
                | Readonly<{
                    Data: undefined;
                    Error: undefined;
                    IsPending: true;
                }>
                | Readonly<{
                    Data: TResponse<ChannelType, RendererEventRegistrarType>;
                    Error: undefined;
                    IsPending: false;
                }>
                | Readonly<{
                    Data: undefined;
                    Error: TEventError<ChannelType, RendererEventRegistrarType>;
                    IsPending: false;
                }>
            )
            : never
        : (
            | Readonly<{
                Error: undefined;
                IsPending: true;
            }>
            | Readonly<{
                Error: TEventError<ChannelType, RendererEventRegistrarType>;
                IsPending: false;
            }>
        );

export type TUseSendEventReturnType<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType
> =
    FResponseDeclTypeKey extends keyof RendererEventRegistrarType[ChannelType]
        ? FResponseDeclNone extends RendererEventRegistrarType[ChannelType][FResponseDeclTypeKey]
            ? (
                TRendererEventResponse<ChannelType, RendererEventRegistrarType> &
                {
                    ResendEvent: (
                        Request?: TRequest<ChannelType, RendererEventRegistrarType>
                    ) => Promise<void>;
                }
            )
            : (
                TRendererEventResponse<ChannelType, RendererEventRegistrarType> &
                {
                    ResendEvent: () => Promise<void>;
                }
            )
        : never;

export type TUseSendEvent<RendererEventRegistrarType> =
{
    <ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<typeof Channel, RendererEventRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<typeof Channel, RendererEventRegistrarType>;

    <ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): TUseSendEventReturnType<typeof Channel, RendererEventRegistrarType>;

    <ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): TUseSendEventReturnType<typeof Channel, RendererEventRegistrarType>;
};

export type TSendEventDeferredReturnType<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType
> =
    Omit<TRendererEventResponse<ChannelType, RendererEventRegistrarType>, "IsPending">;

export type TSendEventDeferred<RendererEventRegistrarType> =
{
    <ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): Promise<TSendEventDeferredReturnType<ChannelType, RendererEventRegistrarType>>;

    <ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<ChannelType, RendererEventRegistrarType>
    ): Promise<TSendEventDeferredReturnType<ChannelType, RendererEventRegistrarType>>;
};

export type TUseSendEventDeferred<RendererEventRegistrarType> = () => Readonly<[
    SendEvent: TSendEventDeferred<RendererEventRegistrarType>
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

    UseUnregisterCallbackDeferred: TUseUnregisterCallbackDeferred<MainEventRegistrarType>;

    UseUnregisterCallbacksDeferred: TUseUnregisterCallbacksDeferred<MainEventRegistrarType>;
}>;

export type FEventContext = TEventContext<Record<string, unknown>, Record<string, unknown>>;

export type FIpcRendererFunctions =
{
    Invoke: typeof ipcRenderer.invoke;
    On: typeof ipcRenderer.on;
    Off: typeof ipcRenderer.off;
    Once: typeof ipcRenderer.once;
    Send: typeof ipcRenderer.send;
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

export type TEventHooks<MainEventRegistrarType, RendererEventRegistrarType> =
    Readonly<Required<TEventContext<MainEventRegistrarType, RendererEventRegistrarType>>>;

export type FGetPreload =
{
    EventPreload: FIpcRendererFunctions;
};

export type TSendEventDeferredBase<RendererEventRegistrarType> =
{
    <ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): ReturnType<TSendEventDeferred<RendererEventRegistrarType>>;

    <ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<ChannelType, RendererEventRegistrarType>
    ): ReturnType<TSendEventDeferred<RendererEventRegistrarType>>;
};
