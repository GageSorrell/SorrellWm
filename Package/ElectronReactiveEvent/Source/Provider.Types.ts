/* File:      Provider.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import type {
    EmptyEventParameter,
    NoRequestChannel,
    MainRegisterCallback,
    RegisterCallbacks,
    RendererResponse,
    Request,
    RequestChannel,
    UseEventCallbackDeferred,
    UseEventCallbacksDeferred,
    UseUnregisterCallbackDeferred,
    UseUnregisterCallbacksDeferred,
    RendererRegisterCallback} from "./index.js";
import type { IRegistrarBase, ResponseDeclKey } from "./Internal/index.js";
import type { IMainRegistrarBase, IRendererRegistrarBase } from "./Registrar.Types.js";

export type EventProvider = ({ children }: PropsWithChildren) => ReactNode;

export type EventContext<
    MainRegistrar extends IMainRegistrarBase,
    RendererRegistrar extends IRendererRegistrarBase
> =
    Partial<{
    /** Send an event when the component mounts. */
        useSendEvent: UseSendEvent<RendererRegistrar>;

        /** The returned callback returns `undefined` if a re-render is triggered before it fulfills. */
        useSendEventDeferred: UseSendEventDeferred<RendererRegistrar>;

        useEventCallback: RendererRegisterCallback<MainRegistrar>;

        useEventCallbackDeferred: UseEventCallbackDeferred<MainRegistrar>;

        useEventCallbacks: RegisterCallbacks<"Renderer", MainRegistrar>;

        useEventCallbacksDeferred: UseEventCallbacksDeferred<MainRegistrar>;

        useUnregisterCallbackDeferred: UseUnregisterCallbackDeferred<MainRegistrar>;

        useUnregisterCallbacksDeferred: UseUnregisterCallbacksDeferred<MainRegistrar>;
    }>;

export type EventContextUnknown = EventContext<IMainRegistrarBase, IRendererRegistrarBase>;

export type EventHooks<MainRegistrar extends IMainRegistrarBase, RendererRegistrar extends IRendererRegistrarBase> =
    Readonly<Required<EventContext<MainRegistrar, RendererRegistrar>>>;

export type ReactiveEventProviderComponent = ({ children }: PropsWithChildren) => ReactNode;

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
