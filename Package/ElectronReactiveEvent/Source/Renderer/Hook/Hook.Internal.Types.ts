/* File:      Hook.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/no-namespace */

import type {
    InvokeEventDeferred,
    InvokeOptions,
    InvokeResponse,
    OffEventDeferred,
    OnEventDeferred,
    OnceEventDeferred,
    RendererListener,
    SendEventDeferred } from "./Hook.Types.js";
import type { MainOwner, RendererOwner } from "../../Decl/Decl.Types.js";
import type { Channel } from "../../Channel/index.js";
import type { EmptyOverloadParameter } from "../../Listener/Listener.Internal.Types.js";
import type { PackageKeys } from "../../Internal/index.js";
import type { Request } from "../../Listener/index.js";

// eslint-disable-next-line jsdoc/require-jsdoc
export type InvokeOptionsOverloadedArgument<SuspendsType extends boolean = boolean> =
    | InvokeOptions<SuspendsType>
    | EmptyOverloadParameter
    | undefined;

type OptionsFromOverload<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>,
    RequestOrOptionsType extends
        | Request<PackageKey, RendererOwner, ChannelType>
        | InvokeOptions
        | EmptyOverloadParameter,
    OptionsType extends
        | InvokeOptions
        | EmptyOverloadParameter
> =
    OptionsType extends EmptyOverloadParameter
        ? RequestOrOptionsType extends InvokeOptions<infer SuspendsType>
            ? InvokeOptions<SuspendsType>
            : undefined
        : OptionsType extends InvokeOptions<infer SuspendsType>
            ? InvokeOptions<SuspendsType>
            : undefined;

// eslint-disable-next-line jsdoc/require-jsdoc
export type InvokeResponseInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>,
    RequestOrOptionsType extends
        | Request<PackageKey, RendererOwner, ChannelType>
        | InvokeOptions
        | EmptyOverloadParameter,
    OptionsType extends
        | InvokeOptions
        | EmptyOverloadParameter
> =
    InvokeResponse<
        PackageKey,
        ChannelType,
        OptionsFromOverload<
            PackageKey,
            ChannelType,
            RequestOrOptionsType,
            OptionsType
        >
    >;

/**
 * Invoke an event when the containing component mounts.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseInvokeEvent<PackageKey extends PackageKeys> =
    {
        /**
         * Invoke an event when the containing component mounts.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         *
         * @returns The result returned by `main`.
         */
        <ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
            channel: ChannelType
        ): InvokeResponse<PackageKey, typeof channel, undefined>;

        /**
         * Invoke an event when the containing component mounts.
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
        <ChannelType extends Channel.Handler.NoRequest<PackageKey>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            options: InvokeOptions<SuspendsType>
        ): InvokeResponse<PackageKey, typeof channel, typeof options>;

        /**
         * Invoke an event when the containing component mounts.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The channel of the event that you wish to invoke.
         * @param request - The request of this event.
         *
         * @returns The result returned by `main`.
         */
        <ChannelType extends Channel.Handler.Request<PackageKey>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): InvokeResponse<PackageKey, typeof channel, undefined>;

        /**
         * Invoke an event when the containing component mounts.
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
        <ChannelType extends Channel.Handler.Request<PackageKey>,
            SuspendsType extends boolean>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>,
            options: InvokeOptions<SuspendsType>
        ): InvokeResponse<PackageKey, typeof channel, typeof options>;
    };

export type UseInvokeEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ invokeEventDeferred: InvokeEventDeferred<PackageKey> ]>;
    };

/**
 * @TODO Write description.
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type UseOnEvent<PackageKey extends PackageKeys> =
    {
        /**
         * @TODO Write description.
         * @typeParam ChannelType - The type of the {@link channel} on which the
         * {@link listener} will listen.
         * @param channel - The channel on which the {@link listener} will listen.
         * @param listener - The callback function that will listen on {@link channel}.
         * @returns A function that will unregister the {@link listener}.
         */
        <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

export type UseOnEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ onEventDeferred: OnEventDeferred<PackageKey> ]>;
    };

export type UseOnceEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

export type UseOnceEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ onceEventDeferred: OnceEventDeferred<PackageKey> ]>;
    };

export type UseOffEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>;
    };

export type UseSendEvent<PackageKey extends PackageKeys> =
    {
        <ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
            channel: ChannelType
        ): void;

        <ChannelType extends Channel.Listener.NoRequest<PackageKey, MainOwner>>(
            channel: ChannelType
        ): void;

        <ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>>(
            channel: ChannelType,
            request: Request<PackageKey, RendererOwner, typeof channel>
        ): void;
    };

export type UseSendEventDeferred<PackageKey extends PackageKeys> =
    {
        (): Readonly<[ sendEventDeferred: SendEventDeferred<PackageKey> ]>;
    };

export type EqualityCheck<Type> = (A: Type, B: Type) => boolean;
