/* File:      Main.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback, Channel, Event } from "../index.js";
import { type BrowserWindow } from "electron";
import type { EmptyEventParameter } from "../Decl.Types.js";
import type { Internal } from "../Internal/index.js";
import type { Shared } from "../Shared/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

export namespace Send
{
    /**
     * The type returned by the `renderer` from the {@link Send.Send} function.
     *
     * If an array is passed to the `send` function, then the request will be
     * sent to all windows, and an array of the results will be returned,
     * such that the order of the responses match the order of the respective
     * windows in the array.
     *
     * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
     * @typeParam WindowType - Either
     * {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow},
     *  or an array of `BrowserWindow`s.
     * @typeParam Registrar - The registrar interface that holds the desired event declaration.
     */
    export type ReturnType<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    > =
        WindowType extends Array<BrowserWindow>
            ? Array<Event.Response<ChannelType, Registrar>>
            : Event.Response<ChannelType, Registrar>;

}

/**
 * The type returned by {@link getMainIpc}.
 *
 * @remarks This (and the {@link getMainIpc} function) exist as a convenience to pass along
 * your registrar types.  By wrapping the IPC functions with this factory function, your registrar
 * types do not need to be passed with each function call.
 *
 * @typeParam MainRegistrar - The `main` registrar type.
 * @typeParam RendererRegistrar - The `renderer` registrar type.
 */
export type FactoryReturnType<
    MainRegistrar extends Shared.Registrar.IMainRegistrarBase,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
> =
    {
        /**
         * Register a given `main` callback function for a given channel.
         *
         * @typeParam ChannelType - The desired channel of the given `RendererRegistrar`.
         * @param Channel - The channel of the event declaration corresponding to the given `Callback`.
         * @param Callback - The callback function that will be called when an event of channel `Channel`
         * is received from the `renderer`.
         */
        registerCallback<ChannelType extends Channel.Channel<RendererRegistrar>>(
            Channel: ChannelType,
            Callback: Callback.Main<ChannelType, RendererRegistrar>
        ): void;

        /**
         * Register multiple callbacks for a given set of event declarations.
         * The keys are taken to be the `ChannelType`s, and the respective values are the
         * callbacks that will be registered for their respective `ChannelType`s.
         *
         * @note This is one of the few functions in which `ChannelType` is expected to be
         * a *union* of multiple string literals.
         *
         * @typeParam ChannelType - The desired channels of the given `RendererRegistrar`.
         * @param Record - The record mapping of channel
         */
        registerCallbacks<ChannelType extends Channel.Channel<RendererRegistrar>>(
            Record: Callback.EventRecord<ChannelType, RendererRegistrar>
        ): void;

        /**
         * Send an event to the `renderer`.  Signatures vary based on whether the given
         * event declaration has a `RequestType`.
         */
        send:
        {
            /**
             * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
             * @param Channel - The channel of the event.
             * @param Request - The request data sent.
             * @param BrowserWindows - The
             * {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow(s)}
             * that will receive the given request.
             * @returns The response(s) of the given
             * {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow(s)},
             * in the order in which the `BrowserWindow`s were given.
             */
            <ChannelType extends Channel.Channel<MainRegistrar>,
                WindowType extends BrowserWindow | Array<BrowserWindow>
            >(
                Channel: ChannelType,
                Request: Event.Request<typeof Channel, MainRegistrar>,
                BrowserWindows: WindowType
            ): Promise<Send.ReturnType<ChannelType, MainRegistrar, WindowType>>;

            /**
             * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
             * @param Channel - The channel of the event.
             * @param BrowserWindows - The
             * {@link https://www.electronjs.org/docs/latest/api/browser-window | `BrowserWindow(s)`}
             * that will receive the given request.
             * @returns The response(s) of the given
             * {@link https://www.electronjs.org/docs/latest/api/browser-window | `BrowserWindow(s)`},
             * in the order in which the `BrowserWindow`s were given.
             */
            <ChannelType extends Channel.NoRequest<MainRegistrar>,
                WindowType extends BrowserWindow | Array<BrowserWindow>
            >(
                Channel: ChannelType,
                BrowserWindows: WindowType
            ): Promise<Send.ReturnType<ChannelType, MainRegistrar, WindowType>>;
        };

        /**
         * Unregisters a given callback for all `BrowserWindow`s for which the callback was registered.
         * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
         * @param Channel - The channel of the event.
         * @param Callback - The callback to be unregistered.
         * @returns The response(s) of the given
         * {@link https://www.electronjs.org/docs/latest/api/browser-window | `BrowserWindow(s)`},
         * in the order in which the `BrowserWindow`s were given.
         */
        unregisterCallback<ChannelType extends Channel.Channel<RendererRegistrar>>(
            Channel: ChannelType,
            Callback: Callback.Callback<typeof Channel, RendererRegistrar>
        ): void;

        /**
         * Unregister multiple callbacks for a given set of event declarations.
         * The keys are taken to be the `ChannelType`s, and the respective values are the
         * callbacks that will be registered for their respective `ChannelType`s.
         *
         * @note This is one of the few functions in which `ChannelType` is expected to be
         * a *union* of multiple string literals.
         *
         * @typeParam ChannelType - The desired channels of the given `RendererRegistrar`.
         * @param Record - The record mapping of channel
         */
        unregisterCallbacks<ChannelType extends Channel.Channel<RendererRegistrar>>(
            Record: Callback.EventRecord<ChannelType, RendererRegistrar>
        ): void;

        /** Unregister all callbacks. */
        unregisterAll: () => void;
    };

/**
 * The type received by `main` callbacks.
 *
 * This corresponds&mdash;but is not identical to&mdash;the request types of
 * events sent by the `renderer`.
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
export type Response<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Shared.Registrar.IRendererRegistrarBase
> =
    Internal.Event.ResponseDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][Internal.Event.ResponseDeclKey] extends EmptyEventParameter
            ? | {
                Error: Callback.ReturnType.Error<ChannelType, Registrar>;
            }
            | {
                Error: undefined;
            }
            : | {
                Data: Callback.ReturnType.Success<ChannelType, Registrar>;
                Error: undefined;
            }
            | {
                Data: undefined;
                Error: Callback.ReturnType.Error<ChannelType, Registrar>;
            }
        : never;
