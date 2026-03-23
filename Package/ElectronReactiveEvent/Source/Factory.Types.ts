/* File:      Factory.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type {
    DeclHasResponseType,
    ErrorPayloadDeclKey,
    RequestDeclKey,
    ResponseDeclKey,
    Values } from "./Internal/index.js";
import type {
    EmptyEventParameter,
    Error,
    RegisterCallback,
    RegisterCallbacks,
    Request,
    Response,
    Send,
    UnregisterCallback,
    UnregisterCallbacks,
    UseEventCallbackDeferred,
    UseEventCallbacksDeferred,
    UseUnregisterCallbackDeferred,
    UseUnregisterCallbacksDeferred } from "./index.js";
import type { PropsWithChildren, ReactNode } from "react";
import type { BrowserWindow } from "electron/main";
import type { ipcRenderer } from "electron/renderer";

export type CallbackErrorReturn<
    ChannelType extends keyof Registrar,
    Registrar
> =
    ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
        ? ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
            ? [ Registrar[ChannelType][ErrorPayloadDeclKey] ] extends [ never ]
                ? Promise<{
                    Error: string;
                }>
                : Promise<{
                    Error:
                    {
                        Message: string;
                        Payload: Registrar[ChannelType][ErrorPayloadDeclKey];
                    }
                }>
            : never
        : never;

export type CallbackSuccessReturn<ChannelType extends keyof Registrar, Registrar> =
    DeclHasResponseType<ChannelType, Registrar> extends true
        ? ResponseDeclKey extends keyof Registrar[ChannelType]
            ? Promise<{
                Data: Response<ChannelType, Registrar>;
            }>
            : Promise<never>
        : Promise<void>;

export type CallbackReturn<ChannelType extends keyof Registrar, Registrar> =
    | CallbackSuccessReturn<ChannelType, Registrar>
    | CallbackErrorReturn<ChannelType, Registrar>;

export type AwaitedCallback<ChannelType extends keyof Registrar, Registrar> =
    Awaited<CallbackReturn<ChannelType, Registrar>>;

export type Callback<ChannelType extends keyof Registrar, Registrar> =
    RequestDeclKey extends keyof Registrar[ChannelType]
        ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
            ? () => CallbackReturn<ChannelType, Registrar>
            : (
                (Request: Request<ChannelType, Registrar>) =>
                CallbackReturn<ChannelType, Registrar>
            )
        : never;

type ChannelsWithRequestHelper<Registrar> =
    {
        [ Key in keyof Registrar ]:
        RequestDeclKey extends keyof Registrar[Key]
            ? EmptyEventParameter extends Registrar[Key][RequestDeclKey]
                ? undefined
                : Key
            : never
    };

/** @Summary Channels whose event declarations specify a request type. */
export type RequestChannel<Registrar> = Extract<Values<ChannelsWithRequestHelper<Registrar>>, string>;

/** @Summary Channels whose event declarations do *not* specify a request type. */
export type NoRequestChannel<Registrar> =
    Extract<
        Exclude<keyof Registrar, ChannelsWithRequestHelper<Registrar>>,
        string
    >;

export type SendEventReturn<
    ChannelType extends RequestChannel<Registrar> | NoRequestChannel<Registrar>,
    WindowType extends BrowserWindow | Array<BrowserWindow>,
    Registrar
> =
    WindowType extends Array<BrowserWindow>
        ? Array<Response<ChannelType, Registrar>>
        : Response<ChannelType, Registrar>;

/** Use this to define your event callbacks as a record. */
export type CallbackRecord<ChannelType extends keyof Registrar, Registrar> =
    {
        [ Key in ChannelType ]: Callback<Key, Registrar>;
    };

export type MainEventFactoryReturn<MainRegistrar, RendererRegistrar> =
    {
        registerCallback: RegisterCallback<RendererRegistrar>;
        registerCallbacks: RegisterCallbacks<RendererRegistrar>;
        send: Send<MainRegistrar>;
        unregisterCallback: UnregisterCallback<RendererRegistrar>;
        unregisterCallbacks: UnregisterCallbacks<RendererRegistrar>;
        unregisterAll: () => void;
    };

/** @Summary The result returned from `UseSendEvent` or `SendEventDeferred`. */
export type RendererResponse<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar
> =
    DeclHasResponseType<ChannelType, RendererRegistrar> extends true
        ? ResponseDeclKey extends keyof RendererRegistrar[ChannelType]
            ? (
                | Readonly<{
                    Data: undefined;
                    Error: undefined;
                    IsPending: true;
                }>
                | Readonly<{
                    Data: Response<ChannelType, RendererRegistrar>;
                    Error: undefined;
                    IsPending: false;
                }>
                | Readonly<{
                    Data: undefined;
                    Error: Error<ChannelType, RendererRegistrar>;
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
                Error: Error<ChannelType, RendererRegistrar>;
                IsPending: false;
            }>
        );

export type UseSendEventReturn<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar
> =
    ResponseDeclKey extends keyof RendererRegistrar[ChannelType]
        ? EmptyEventParameter extends RendererRegistrar[ChannelType][ResponseDeclKey]
            ? (
                RendererResponse<ChannelType, RendererRegistrar> &
                {
                    ResendEvent: (
                        Request?: Request<ChannelType, RendererRegistrar>
                    ) => Promise<void>;
                }
            )
            : (
                RendererResponse<ChannelType, RendererRegistrar> &
                {
                    ResendEvent: () => Promise<void>;
                }
            )
        : never;

export type UseSendEvent<RendererRegistrar> =
    {
        <ChannelType extends RequestChannel<RendererRegistrar>>(
            Channel: ChannelType,
            Request: Request<typeof Channel, RendererRegistrar>,
            Suspend?: boolean
        ): UseSendEventReturn<typeof Channel, RendererRegistrar>;

        <ChannelType extends NoRequestChannel<RendererRegistrar>>(
            Channel: ChannelType
        ): UseSendEventReturn<typeof Channel, RendererRegistrar>;

        <ChannelType extends NoRequestChannel<RendererRegistrar>>(
            Channel: ChannelType,
            Request: undefined,
            Suspend: boolean
        ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
    };

export type SendEventDeferredReturn<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar
> =
    Omit<RendererResponse<ChannelType, RendererRegistrar>, "IsPending">;

export type SendEventDeferred<RendererRegistrar> =
    {
        <ChannelType extends NoRequestChannel<RendererRegistrar>>(
            Channel: ChannelType
        ): Promise<SendEventDeferredReturn<ChannelType, RendererRegistrar>>;

        <ChannelType extends RequestChannel<RendererRegistrar>>(
            Channel: ChannelType,
            Request: Request<ChannelType, RendererRegistrar>
        ): Promise<SendEventDeferredReturn<ChannelType, RendererRegistrar>>;
    };

export type UseSendEventDeferred<RendererRegistrar> = () => Readonly<[
    SendEvent: SendEventDeferred<RendererRegistrar>
]>;

export type EventProvider = ({ children }: PropsWithChildren) => ReactNode;

export type EventContext<MainRegistrar, RendererRegistrar> =
    Partial<{
    /** Send an event when the component mounts. */
        useSendEvent: UseSendEvent<RendererRegistrar>;

        /** The returned callback returns `undefined` if a re-render is triggered before it fulfills. */
        useSendEventDeferred: UseSendEventDeferred<RendererRegistrar>;

        useEventCallback: RegisterCallback<MainRegistrar>;

        useEventCallbackDeferred: UseEventCallbackDeferred<MainRegistrar>;

        useEventCallbacks: RegisterCallbacks<MainRegistrar>;

        useEventCallbacksDeferred: UseEventCallbacksDeferred<MainRegistrar>;

        useUnregisterCallbackDeferred: UseUnregisterCallbackDeferred<MainRegistrar>;

        useUnregisterCallbacksDeferred: UseUnregisterCallbacksDeferred<MainRegistrar>;
    }>;

export type EventContextUnknown = EventContext<Record<string, unknown>, Record<string, unknown>>;

export type IpcRendererFunctions =
    Pick<
        typeof ipcRenderer,
        | "invoke"
        | "on"
        | "off"
        | "once"
        | "send"
    >;

export type CEventProvider =
    {
        RendererFunctions: IpcRendererFunctions;
    };

export type PEventProvider =
    PropsWithChildren &
    {
        value: IpcRendererFunctions;
    };

export type EventHooks<MainRegistrar, RendererRegistrar> =
    Readonly<Required<EventContext<MainRegistrar, RendererRegistrar>>>;

export type ReactiveEventPreloadData =
    {
        electronReactiveEvent: IpcRendererFunctions;
    };

export type SendEventDeferredBase<RendererRegistrar> =
    {
        <ChannelType extends NoRequestChannel<RendererRegistrar>>(
            Channel: ChannelType
        ): ReturnType<SendEventDeferred<RendererRegistrar>>;

        <ChannelType extends RequestChannel<RendererRegistrar>>(
            Channel: ChannelType,
            Request: Request<typeof Channel, RendererRegistrar>
        ): ReturnType<SendEventDeferred<RendererRegistrar>>;
    };
