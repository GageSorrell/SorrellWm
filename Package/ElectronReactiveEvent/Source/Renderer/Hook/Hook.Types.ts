/* File:      Hook.Base.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

import type {
    Callback,
    Channel,
    Event } from "../../index.js";
import type { EmptyEventParameter } from "../../Decl.Types.js";
import type { Internal } from "../../Internal/index.js";
import type { Provider } from "../index.js";
import type { Response } from "../Renderer.Types.js";
import type { Shared } from "../../Shared/index.js";

/**
 * Definitions for hooks (and functions returned by hooks) that register or unregister callback functions.
 */
export namespace Register
{
    /** The deferred form of {@link UseEventCallback}. */
    export type UseEventCallbackDeferred<MainRegistrar extends Shared.Registrar.IMainRegistrarBase> =
        () => Readonly<[ Callback.RegisterFunction.Renderer<MainRegistrar> ]>;

    /**
     * The deferred form of {@link UseEventCallbacks}.
     *
     * @returns A function equivalent to {@link Main.FactoryReturnType.registerCallbacks}.
     */
    export type UseEventCallbacksDeferred<MainRegistrar extends Shared.Registrar.IMainRegistrarBase> =
        () => Readonly<[ Callback.RegisterFunction.ByRecord<MainRegistrar> ]>;

    /**
     * Unregister callbacks that were registered via {@link UseEventCallbackDeferred}.
     *
     * @remarks Callbacks that were registered via {@link UseEventCallback} or {@link UseEventCallbacks}
     * are unregistered for you when the containing component unmounts.  That is, you do *not*
     * need to unregister such events with this function (nor with {@link UseUnregisterCallbacksDeferred}).
     *
     * @returns A function equivalent to {@link Main.FactoryReturnType.unregisterCallback}.
     */
    export type UseUnregisterCallbackDeferred<MainRegistrar extends Shared.Registrar.IMainRegistrarBase> =
        () => Readonly<[ UnregisterCallback: Shared.Function.UnregisterCallback<MainRegistrar> ]>;

    /**
     * Unregister callbacks that were registered via {@link UseEventCallbacksDeferred}.
     *
     * @remarks Callbacks that were registered via {@link UseEventCallback} or {@link UseEventCallbacks}
     * are unregistered for you when the containing component unmounts.  That is, you do *not*
     * need to unregister such events with this function (nor with {@link UseUnregisterCallbacksDeferred}).
     *
     * @returns A function equivalent to {@link Main.FactoryReturnType.unregisterCallbacks}.
     */
    export type UseUnregisterCallbacksDeferred<MainRegistrar extends Shared.Registrar.IMainRegistrarBase> =
        () => Readonly<[ UnregisterCallbacks: UnregisterRendererCallbacks<MainRegistrar> ]>;

    /** {@inheritDoc UseUnregisterCallbacksDeferred} */
    export type UnregisterRendererCallbacks<Registrar extends Shared.Registrar.IMainRegistrarBase> =
        Callback.RegisterFunction.ByRecord<Registrar>;
}

/** Definitions for hooks (and functions returned by hooks) that send `renderer` events (to `main`). */
export namespace Send
{
    /** @returns The deferred form of {@link UseSendEvent}. */
    export type UseSendEventDeferred<
        RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
    > =
        () => Readonly<[
            SendEvent: Provider.Send.Deferred.Function.SendEventDeferred<RendererRegistrar>
        ]>;

    /** {@inheritDoc UseUnregisterCallbacksDeferred} */
    export type UseSendEventReturn<
        ChannelType extends Channel.Channel<RendererRegistrar>,
        RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
    > =
        Internal.Event.ResponseDeclKey extends keyof RendererRegistrar[ChannelType]
            ? EmptyEventParameter extends RendererRegistrar[ChannelType][Internal.Event.ResponseDeclKey]
                ? (
                    Response<ChannelType, RendererRegistrar> &
                    {
                        ResendEvent: (
                            Request?: Event.Request<ChannelType, RendererRegistrar>
                        ) => Promise<void>;
                    }
                )
                : (
                    Response<ChannelType, RendererRegistrar> &
                    {
                        ResendEvent: () => Promise<void>;
                    }
                )
            : never;

    /**
     * @TODO Finish writing this comment.
     * @typeParam RendererRegistrar - The [registrar](/articles/glossary.html#registrar) that holds your
     * @returns
     */
    export type UseSendEvent<RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase> =
        {
            <ChannelType extends Channel.Request<RendererRegistrar>>(
                Channel: ChannelType,
                Event: Event.Request<typeof Channel, RendererRegistrar>,
                Suspend?: boolean
            ): UseSendEventReturn<typeof Channel, RendererRegistrar>;

            <ChannelType extends Channel.NoRequest<RendererRegistrar>>(
                Channel: ChannelType
            ): UseSendEventReturn<typeof Channel, RendererRegistrar>;

            <ChannelType extends Channel.NoRequest<RendererRegistrar>>(
                Channel: ChannelType,
                Event: undefined,
                Suspend: boolean
            ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
        };
}
