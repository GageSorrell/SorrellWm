/* File:      Provider.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback, Channel, Event } from "../../index.js";
import type { PropsWithChildren, ReactNode } from "react";
import type { FactoryReturnType } from "../../Main/Main.Types.js";
import type { Hook } from "../index.js";
import type { Response } from "../Renderer.Types.js";
import type { Shared } from "../../Shared/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

type RealReturnType<Type extends (...ArgumentVector: Array<unknown>) => unknown> = ReturnType<Type>;

/**
 * The context used by the {@link ReactiveEventProviderComponent}.
 * This type is analogous to {@link FactoryReturnType}.
 *
 * @todo Consider moving this to the `Internal` namespace.
 */
export type EventContext<
    MainRegistrar extends Shared.Registrar.IMainRegistrarBase,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
> =
    Partial<{
    /** Send an event when the component mounts. */
        useSendEvent: Hook.Send.UseSendEvent<RendererRegistrar>;

        /** The returned callback returns `undefined` if a re-render is triggered before it fulfills. */
        useSendEventDeferred: Hook.Send.UseSendEventDeferred<RendererRegistrar>;

        useEventCallback: Callback.RegisterFunction.Renderer<MainRegistrar>;

        useEventCallbackDeferred: Hook.Register.UseEventCallbackDeferred<MainRegistrar>;

        useEventCallbacks: FactoryReturnType<MainRegistrar, RendererRegistrar>["registerCallbacks"];

        useEventCallbacksDeferred: Hook.Register.UseEventCallbacksDeferred<MainRegistrar>;

        useUnregisterCallbackDeferred: Hook.Register.UseUnregisterCallbackDeferred<MainRegistrar>;

        useUnregisterCallbacksDeferred: Hook.Register.UseUnregisterCallbacksDeferred<MainRegistrar>;
    }>;

// type EventContextUnknown_DEPRECATED =
//     EventContext<Shared.Registrar.IMainRegistrarBase, Shared.Registrar.IRendererRegistrarBase>;

/**
 * The hooks returned by the provider.
 * @private
 *
 * @typeParam MainRegistrar - The `main` registrar type.
 * @typeParam RendererRegistrar - The `renderer` registrar type.
 */
export type EventHooks<
    MainRegistrar extends Shared.Registrar.IMainRegistrarBase,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
> =
    Readonly<Required<EventContext<MainRegistrar, RendererRegistrar>>>;

export type ReactiveEventProviderComponent = ({ children }: PropsWithChildren) => ReactNode;

export namespace Send
{
    export namespace Deferred
    {
        export type ReturnType<
            ChannelType extends Channel.Channel<RendererRegistrar>,
            RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
        > =
            Omit<Response<ChannelType, RendererRegistrar>, "IsPending">;

        export namespace Function
        {
            export type SendEventDeferredBase<
                RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
            > =
                {
                    <ChannelType extends Channel.NoRequest<RendererRegistrar>>(
                        Channel: ChannelType
                    ): RealReturnType<SendEventDeferred<RendererRegistrar>>;

                    <ChannelType extends Channel.Request<RendererRegistrar>>(
                        Channel: ChannelType,
                        Event: Event.Request<typeof Channel, RendererRegistrar>
                    ): RealReturnType<SendEventDeferred<RendererRegistrar>>;
                };

            /** {@inheritDoc Hook.Send.UseSendEventDeferred} */
            export type SendEventDeferred<
                RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
            > =
                {
                    <ChannelType extends Channel.NoRequest<RendererRegistrar>>(
                        Channel: ChannelType
                    ): Promise<Send.Deferred.ReturnType<ChannelType, RendererRegistrar>>;

                    <ChannelType extends Channel.Request<RendererRegistrar>>(
                        Channel: ChannelType,
                        Event: Event.Request<ChannelType, RendererRegistrar>
                    ): Promise<Send.Deferred.ReturnType<ChannelType, RendererRegistrar>>;
                };
        }
    }
}
