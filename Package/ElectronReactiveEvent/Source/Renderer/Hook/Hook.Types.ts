/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Listener, Request, Response, ResponseSync } from "../../Listener/index.js";
import type { MainOwner, RendererOwner } from "../../Decl/Decl.Types";
import type { Channel } from "../../Channel";
import type { IpcRendererEvent } from "electron";
import type { PackageKeys } from "../../Internal";

/**
 * The type of the {@link Listener | listener} function passed to {@link useOnEvent} *et al.*
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type RendererListener<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>
> = Listener<PackageKey, MainOwner, IpcRendererEvent, ChannelType>;

/**
 * The options that may be passed to {@link useInvokeEvent}.
 *
 * @typeParam SuspendsType - The type of the {@link suspend} property, which is used to narrow down
 * the correct return type of {@link useInvokeEvent}.
 *
 * @property suspend - Whether {@link useInvokeEvent} should suspend until it receives a response from
 * `main`.  If `true`, then the {@link InvokeResponse} returned will be of type {@link ResponseSync}, *i.e.*,
 * the `isPending` property will be omitted.
 */
export type InvokeOptions<SuspendsType extends boolean = boolean> =
    {
        suspend: SuspendsType;
    };

/**
 * The type returned by {@link useInvokeEvent}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 * @typeParam OptionsType - The specific type of {@link InvokeOptions} passed
 * to the {@link useInvokeEvent} call from which this response is produced.
 * The {@link InvokeOptions.suspend | suspend} property determines whether this
 * type will contain an `isPending` property.
 */
export type InvokeResponse<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>,
    OptionsType extends InvokeOptions | undefined
> = OptionsType extends InvokeOptions<infer SuspendsType>
    ? SuspendsType extends true
        ? ResponseSync<PackageKey, ChannelType>
        : Response<PackageKey, ChannelType>
    : never;

/**
 * Returns a copy of {@link InvokeEventDeferred}, to invoke events at a desired time.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseInvokeEventDeferred<PackageKey extends PackageKeys> =
    {
        /** @returns An {@link InvokeEventDeferred} function. */
        (): Readonly<[ invokeEventDeferred: InvokeEventDeferred<PackageKey> ]>;
    };

/**
 * Subscribe to events sent by `main` at the time that the containing component mounts.
 * When the component unmounts, the listener is unsubscribed.  An {@link OffEventDeferred}
 * callback is returned if you wish to unsubscribe before the component unmounts.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseOnEvent<PackageKey extends PackageKeys> =
    {
        /**
         * Subscribe to events sent by `main` at the time that the containing component mounts.
         * When the component unmounts, the listener is unsubscribed.
         *
         * @typeParam ChannelType - The type of the {@link channel} on which the
         * {@link listener} will listen.
         *
         * @param channel - The channel on which the {@link listener} will listen.
         * @param listener - The callback function that will listen on {@link channel}.
         *
         * @returns A function that will unregister the {@link listener}.
         */
        <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

/**
 * Returns an {@link OnEventDeferred}, to subscribe to `main` events when desired.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseOnEventDeferred<PackageKey extends PackageKeys> =
    {
        /** @returns An {@link OnEventDeferred} function. */
        (): Readonly<[ onEventDeferred: OnEventDeferred<PackageKey> ]>;
    };

/**
 * Equivalent to {@link UseOnEvent }, but the listener will be unsubscribed
 * after firing once.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseOnceEvent<PackageKey extends PackageKeys> =
    {
        /**
         * Equivalent to {@link UseOnEvent }, but the listener will be unsubscribed
         * after firing once.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the `main` event to which you wish to subscribe
         * the {@link listener}.
         * @param listener - The {@link RendererListener} that will be subscribed to the given
         * {@link channel}.
         *
         * @returns An {@link OffEventDeferred} to unsubscribe the {@link listener} early.
         */
        <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

/**
 * Returns an {@link OnceEventDeferred}, to subscribe to `main` events when desired.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseOnceEventDeferred<PackageKey extends PackageKeys> =
    {
        /** @returns A {@link OnceEventDeferred} function. */
        (): Readonly<[ onceEventDeferred: OnceEventDeferred<PackageKey> ]>;
    };

/**
 * Returns an {@link OffEventDeferred}, to unsubscribe to `main` events when desired.
 *
 * @note Both {@link UseOnEvent} and {@link UseOnceEvent} both return callbacks
 * equivalent to this, but only for the event that is subscribed to by calling the
 * respective hook.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseOffEventDeferred<PackageKey extends PackageKeys> =
    {
        /** @returns An {@link OffEventDeferred} function. */
        (): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

/**
 * Send an event when the containing component mounts.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseSendEvent<PackageKey extends PackageKeys> =
    {
        /**
         * Send an event when the containing component mounts, whose event declaration
         * does *not* define a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to send.
         *
         * @returns The result returned by `main`.
         */
        <ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
            channel: ChannelType
        ): void;

        /**
         * Invoke an event when the containing component mounts, whose event declaration
         * defines a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         * @param options - Specify whether this hook should suspend the containing component
         * until `main` returns a response.
         *
         * @returns The result returned by `main`.
         */
        <ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
            channel: ChannelType
        ): void;

        // <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
        //     channel: ChannelType,
        //     request: Request<PackageKey, RendererOwner, typeof channel>
        // ): void;
    };

/**
 * Returns a {@link SendEventDeferred} function, to send events when desired.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseSendEventDeferred<PackageKey extends PackageKeys> =
    {
        /** @returns A {@link SendEventDeferred} function. */
        (): Readonly<[ sendEventDeferred: SendEventDeferred<PackageKey> ]>;
    };

/**
 * Invoke an event when the containing component mounts.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseInvokeEvent<PackageKey extends PackageKeys> =
    {
        /**
         * Invoke an event when the containing component mounts, whose event declaration
         * does *not* define a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         *
         * @returns The result returned by `main`.
         * {@label NoRequest}
         */
        <ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
            channel: ChannelType
        ): InvokeResponse<PackageKey, typeof channel, undefined>;

        /**
         * Invoke an event when the containing component mounts, whose event declaration
         * does *not* defines a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         * @param options - Specify whether this hook should suspend the containing component
         * until `main` returns a response.
         *
         * @returns The result returned by `main`.
         * {@label NoRequestOptions}
         */
        <ChannelType extends Channel.Handler.NoRequest<PackageKey>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            options: InvokeOptions<SuspendsType>
        ): InvokeResponse<PackageKey, typeof channel, typeof options>;

        /**
         * Invoke an event when the containing component mounts, whose event declaration
         * defines a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         * @param request - The request of this event.
         *
         * @returns The result returned by `main`.
         * {@label Request}
         */
        <ChannelType extends Channel.Handler.Request<PackageKey>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): InvokeResponse<PackageKey, typeof channel, undefined>;

        /**
         * Invoke an event when the containing component mounts, whose event declaration
         * defines a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         * @param request - The request of this event.
         * @param options - Specify whether this hook should suspend the containing component
         * until `main` returns a response.
         *
         * @returns The result returned by `main`.
         * {@label RequestOptions}
         */
        <ChannelType extends Channel.Handler.Request<PackageKey>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>,
            options: InvokeOptions<SuspendsType>
        ): InvokeResponse<PackageKey, typeof channel, typeof options>;
    };

/**
 * The function that allows `renderer` events to be invoked at a time other than
 * {@link https://react.dev/reference/react/useEffect | onMount } of the containing
 * component.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type InvokeEventDeferred<PackageKey extends PackageKeys> =
    {
        /**
         * Invoke a `renderer` event whose event declaration does not define a request type,
         * at a time other than {@link https://react.dev/reference/react/useEffect | onMount }
         * of the containing component.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         *
         * @returns The response from `main`, given as a promise, which resolves to a {@link ResponseSync}.
         */
        <ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
            channel: ChannelType
        ): Promise<ResponseSync<PackageKey, typeof channel>>;

        /**
         * Invoke a `renderer` event whose event declaration defines a request type,
         * at a time other than {@link https://react.dev/reference/react/useEffect | onMount }
         * of the containing component.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         * @param request - The request of this event.
         *
         * @returns The response from `main`, given as a promise, which resolves to a {@link ResponseSync}.
         */
        <ChannelType extends Channel.Handler.Request<PackageKey>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): Promise<ResponseSync<PackageKey, typeof channel>>;
    };
/**
 * The function that allows the `renderer` to subscribe to `main` events with a {@link RendererListener}.
 * This is equivalent to the {@link UseOnEvent | UseOnEvent type}.
 *
 * @see {@link OffEventDeferred} has the opposite function, although this function will return
 * a parameter-less function of the same name, to unsubscribe from the event used by calling
 * this function.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type OnEventDeferred<PackageKey extends PackageKeys> = UseOnEvent<PackageKey>;

/**
 * The function that allows the `renderer` to unsubscribe to `main` events with a {@link RendererListener}.
 * This is equivalent to the {@link UseOnEvent | UseOnEvent type}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type OffEventDeferred<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): void;
    };

/**
 * The function that allows the `renderer` to subscribe to `main` events with a {@link RendererListener}.
 * The given {@link RendererListener} will be unsubscribed after being called once.
 * This is equivalent to the {@link UseOnceEvent | UseOnceEvent type}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type OnceEventDeferred<PackageKey extends PackageKeys> = UseOnceEvent<PackageKey>;

/**
 * Send an event to `main` at a desired time.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type SendEventDeferred<PackageKey extends PackageKeys> = UseSendEvent<PackageKey>;

/**
 * The object returned by {@link getReactiveEventHooks}, which contains all hooks provided
 * by `electron-reactive-event`.  These are scoped to your {@link PackageKey}.
 *
 * It is recommended to call this once in a module of your project, and export them to be used
 * throughout your project.
 */
export type ReactiveEventHooks<PackageKey extends PackageKeys> = Readonly<{
    useInvokeEvent: UseInvokeEvent<PackageKey>;
    useInvokeEventDeferred: UseInvokeEventDeferred<PackageKey>;

    useOnEvent: UseOnEvent<PackageKey>;
    useOnEventDeferred: UseOnEventDeferred<PackageKey>;

    useOnceEvent: UseOnceEvent<PackageKey>;
    useOnceEventDeferred: UseOnceEventDeferred<PackageKey>;

    useOffEventDeferred: UseOffEventDeferred<PackageKey>;

    useSendEvent: UseSendEvent<PackageKey>;
    useSendEventDeferred: UseSendEventDeferred<PackageKey>;
}>;
