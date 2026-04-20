/**
 * @file      Hook.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { MainOwner, RendererOwner } from "../../Internal";
import type { Channel } from "../../Channel";
import type { Decl } from "../../Decl";
/* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
import { Invoke } from "../../Invoke/Invoke.Types";
import type { IpcRendererEvent } from "electron/renderer";
import type { Listener } from "../../Listener";

/**
 * The type of the {@link Listener | listener} function passed to {@link useOnEvent} *et al.*
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type RendererListener<ChannelType extends Channel.Listener<MainOwner>> =
    Listener<RendererOwner, ChannelType, IpcRendererEvent>;

/**
 * Returns a copy of {@link InvokeEventDeferred}, to invoke events at a desired time.
 *
 */
export type UseInvokeEventDeferred =
    {
        /** @returns An {@link InvokeEventDeferred} function. */
        (): Readonly<[ invokeEventDeferred: InvokeEventDeferred ]>;
    };

/**
 * Subscribe to events sent by `main` at the time that the containing component mounts.
 * When the component unmounts, the listener is unsubscribed.  An {@link OffEventDeferred}
 * callback is returned if you wish to unsubscribe before the component unmounts.
 *
 */
export type UseOnEvent =
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
         * @returns A function that will unregister the given {@link listener}.
         */
        <ChannelType extends Channel.Listener<MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<typeof channel>
        ): Readonly<[ offEventDeferred: OffEventDeferred ]>;
    };

/**
 * Returns an {@link OnEventDeferred}, to subscribe to `main` events when desired.
 *
 */
export type UseOnEventDeferred =
    {
        /** @returns An {@link OnEventDeferred} function. */
        (): Readonly<[ onEventDeferred: OnEventDeferred ]>;
    };

/**
 * Equivalent to {@link UseOnEvent }, but the listener will be unsubscribed
 * after firing once.
 *
 */
export type UseOnceEvent =
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
        <ChannelType extends Channel.Listener<MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<typeof channel>
        ): Readonly<[ offEventDeferred: OffEventDeferred ]>;
    };

/**
 * Returns an {@link OnceEventDeferred}, to subscribe to `main` events when desired.
 *
 */
export type UseOnceEventDeferred =
    {
        /** @returns A {@link OnceEventDeferred} function. */
        (): Readonly<[ onceEventDeferred: OnceEventDeferred ]>;
    };

/**
 * Returns an {@link OffEventDeferred}, to unsubscribe to `main` events when desired.
 *
 * @note Both {@link UseOnEvent} and {@link UseOnceEvent} both return callbacks
 * equivalent to this, but only for the event that is subscribed to by calling the
 * respective hook.
 *
 */
export type UseOffEventDeferred =
    {
        /** @returns An {@link OffEventDeferred} function. */
        (): Readonly<[ offEventDeferred: OffEventDeferred ]>;
    };

/**
 * Send an event when the containing component mounts.
 *
 * @note {@link | Sendable events} do *not* end with a response returned by
 * `main`.  If you wish to send an event to `main` such that it returns a
 * {@link Invoke.Result | response}, declare the {@link EventDecl | event type}
 * with a `ResponseType !== {@link EmptyEventParameter}`.
 *
 */
export type UseSendEvent =
    {
        /**
         * Send an event when the containing component mounts, whose event declaration
         * does *not* define a request type.
         *
         * @note {@link | Sendable events} do *not* end with a response returned by
         * `main`.  If you wish to send an event to `main` such that it returns a
         * response, declare the {@link EventDecl | event type} with a
         * `ResponseType !== never`.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to send.
         */
        <ChannelType extends Channel.Listener.Without.Request<MainOwner>>(
            channel: ChannelType
        ): void;

        /**
         * Send an event when the containing component mounts, whose event declaration
         * defines a request type.
         *
         * @note {@link | Sendable events} do *not* end with a response returned by
         * `main`.  If you wish to send an event to `main` such that it returns a
         * {@link Invoke.Result | response}, declare the {@link EventDecl | event type}
         * with a `ResponseType !== {@link EmptyEventParameter}`.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         * @param request - The request sent with this event.
         */
        <ChannelType extends Channel.Listener.With.Request<MainOwner>>(
            channel: ChannelType,
            request: Decl.Request<typeof channel, RendererOwner>
        ): void;
    };

/**
 * Returns a {@link SendEventDeferred} function, to send events when desired.
 *
 */
export type UseSendEventDeferred =
    {
        /** @returns A {@link SendEventDeferred} function. */
        (): Readonly<[ sendEventDeferred: SendEventDeferred ]>;
    };

/**
 * Invoke an event when the containing component mounts.
 *
 */
export type UseInvokeEvent =
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
         */
        <ChannelType extends Channel.Handler.Without.Request>(
            channel: ChannelType
        ): Invoke.Result<typeof channel, undefined>;

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
        <ChannelType extends Channel.Handler.Without.Request,
            SuspendsType extends boolean>(
            channel: ChannelType,
            options: Invoke.Options<SuspendsType>
        ): Invoke.Result<typeof channel, typeof options>;

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
         */
        <ChannelType extends Channel.Handler.With.Request>(
            channel: ChannelType,
            request: Decl.Request<typeof channel>
        ): Invoke.Result<typeof channel, undefined>;

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
         */
        <ChannelType extends Channel.Handler.With.Request,
            SuspendsType extends boolean>(
            channel: ChannelType,
            request: Decl.Request<typeof channel>,
            options: Invoke.Options<SuspendsType>
        ): Invoke.Result<typeof channel, typeof options>;
    };

/**
 * The function that allows `renderer` events to be invoked at a time other than
 * {@link https://react.dev/reference/react/useEffect | onMount } of the containing
 * component.
 *
 */
export type InvokeEventDeferred =
    {
        /* eslint-disable @stylistic/max-len */

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
         * @returns The response from `main`, given as a promise, which resolves to a {@link InvokeResultSync}.
         */
        <ChannelType extends Channel.Handler.Without.Request>(
            channel: ChannelType
        ): Promise<Invoke.Result.Sync<typeof channel>>;

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
         * @returns The response from `main`, given as a promise, which resolves to a {@link InvokeResultSync}.
         */
        <ChannelType extends Channel.Handler.With.Request>(
            channel: ChannelType,
            request: Decl.Request<typeof channel>
        ): Promise<Invoke.Result.Sync<typeof channel>>;

        /* eslint-enable @stylistic/max-len */
    };
/**
 * The function that allows the `renderer` to subscribe to `main` events with a {@link RendererListener}.
 * This is equivalent to the {@link UseOnEvent | UseOnEvent type}.
 *
 * @see {@link OffEventDeferred} has the opposite function, although this function will return
 * a parameter-less function of the same name, to unsubscribe from the event used by calling
 * this function.
 *
 */
export type OnEventDeferred = UseOnEvent;

/**
 * The function that allows the `renderer` to unsubscribe to `main` events with a {@link RendererListener}.
 * This is equivalent to the {@link UseOnEvent | UseOnEvent type}.
 *
 */
export type OffEventDeferred =
    {
        <ChannelType extends Channel.Listener<MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<typeof channel>
        ): void;
    };

/**
 * The function that allows the `renderer` to subscribe to `main` events with a {@link RendererListener}.
 * The given {@link RendererListener} will be unsubscribed after being called once.
 * This is equivalent to the {@link UseOnceEvent | UseOnceEvent type}.
 *
 */
export type OnceEventDeferred = UseOnceEvent;

/**
 * Send an event to `main` at a desired time.
 *
 */
export type SendEventDeferred = UseSendEvent;

/**
 * The object returned by {@link getReactiveEventHooks}, which contains all hooks provided
 * by `electron-reactive-event`.  These are scoped to your {@link PackageKey}.
 *
 * It is recommended to call this once in a module of your project, and export them to be used
 * throughout your project.
 *
 *
 * @property useInvokeEvent - The {@link UseInvokeEvent} hook, scoped to your {@link PackageKey}.
 * @property useInvokeEventDeferred - The {@link UseInvokeEventDeferred} hook,
 * scoped to your {@link PackageKey}.
 * @property useOnEvent - The {@link UseOnEvent} hook, scoped to your {@link PackageKey}.
 * @property useOnEventDeferred - The {@link UseOnEventDeferred} hook, scoped to your {@link PackageKey}.
 * @property useOnceEvent - The {@link UseOnceEvent} hook, scoped to your {@link PackageKey}.
 * @property useOnceEventDeferred - The {@link UseOnceEventDeferred} hook, scoped to your {@link PackageKey}.
 * @property useOffEventDeferred - The {@link UseOffEventDeferred} hook, scoped to your {@link PackageKey}.
 * @property useSendEvent - The {@link UseSendEvent} hook, scoped to your {@link PackageKey}.
 * @property useSendEventDeferred - The {@link UseSendEventDeferred} hook,
 * scoped to your {@link PackageKey}.
 */
export type ReactiveEventHooks = Readonly<{
    useInvokeEvent: UseInvokeEvent;
    useInvokeEventDeferred: UseInvokeEventDeferred;

    useOnEvent: UseOnEvent;
    useOnEventDeferred: UseOnEventDeferred;

    useOnceEvent: UseOnceEvent;
    useOnceEventDeferred: UseOnceEventDeferred;

    useOffEventDeferred: UseOffEventDeferred;

    useSendEvent: UseSendEvent;
    useSendEventDeferred: UseSendEventDeferred;
}>;
