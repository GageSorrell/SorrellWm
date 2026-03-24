/* File:      Provider.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import type {
    EmptyEventParameter,
    NoRequestChannel,
    RegisterCallback,
    RegisterCallbacks,
    RendererResponse,
    Request,
    RequestChannel,
    UseEventCallbackDeferred,
    UseEventCallbacksDeferred,
    UseUnregisterCallbackDeferred,
    UseUnregisterCallbacksDeferred } from "./index.js";
import type { IpcRendererFunctions } from "./Preload.Types.js";
import type { ResponseDeclKey } from "./Internal/index.js";

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

export type EventProviderProps =
    PropsWithChildren &
    (
        | {
            /**
            * If the ipcRenderer functions are not exposed yet and `failSilently === true`,
            * then the provider will just return the `children` passed to it.  This is intended
            * for preload scripts that call `exposeInMainWorld` from an asynchronous function.
            *
            * Otherwise, if `failSilently === false` or `failSilently === undefined`, an error
            * will be thrown if the ipcRenderer functions are not found.
            */
            failSilently?: true;

            /**
             * Specify the ipcRenderer functions for `<ReactiveEventProvider>` as either
             * (1) an object containing the functions (exposed via `preload`), or (2) a
             * string that represents the path to the object containing the exposed functions.
             * Depending upon your `preload` setup, option (2) would likely resemble
             * `"window.electron.electronReactiveEvent"`.
             */
            value:
                | `window.${ string }`
                | IpcRendererFunctions
                | undefined;
        }
        | {
            /**
            * If the ipcRenderer functions are not exposed yet and `failSilently === true`,
            * then the provider will just return the `children` passed to it.  This is intended
            * for preload scripts that call `exposeInMainWorld` from an asynchronous function.
            *
            * Otherwise, if `failSilently === false` or `failSilently === undefined`, an error
            * will be thrown if the ipcRenderer functions are not found.
            */
            failSilently?: false;

            /**
             * Specify the ipcRenderer functions for `<ReactiveEventProvider>` as either
             * (1) an object containing the functions (exposed via `preload`), or (2) a
             * string that represents the path to the object containing the exposed functions.
             * Depending upon your `preload` setup, option (2) would likely resemble
             * `"window.electron.electronReactiveEvent"`.
             */
            value:
                | `window.${ string }`
                | IpcRendererFunctions;
        }
    );

export type EventHooks<MainRegistrar, RendererRegistrar> =
    Readonly<Required<EventContext<MainRegistrar, RendererRegistrar>>>;

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
