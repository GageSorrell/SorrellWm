/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback, Channel, EmptyEventParameter, Event } from "../index.js";
import type { Internal } from "../Internal/index.js";
import type { Shared } from "../Shared/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

/**
 * The values used to construct a {@link "!ReturnType:type"}.
 *
 * @remarks It is important to understand the distinction between the return types
 * of (1) the callbacks that you give to `electron-reactive-event` (via a `register` function),
 * and (2) the `send` functions that return *transformed* output of your callbacks.
 *
 * This module defines the types that your callbacks can return.
 */
export namespace ReturnType
{
    /**
     * The type of the `Error` property
     *
     * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
     * @typeParam Registrar - The registrar interface that holds the desired event declaration.
     */
    export type Error<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        Internal.Event.ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
            ? Registrar[ChannelType][Internal.Event.ErrorPayloadDeclKey] extends EmptyEventParameter
                ? ErrorSimple<ChannelType, Registrar>
                // ? ErrorSimple<ChannelType, Registrar>
                : ErrorRich<ChannelType, Registrar>
            : never;

    export type Success<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        Internal.Event.ResponseDeclKey extends keyof Registrar[ChannelType]
            ? Registrar[ChannelType][Internal.Event.ResponseDeclKey] extends EmptyEventParameter
                ? void
                : Event.Response<ChannelType, Registrar>
            : never;
}

/**
    * This is the type that a `Callback` function must return.
    *
    * This type is different from what is returned by `Send` and `useSend`.
    * Namely, the distinction is that your callbacks only need to return
    * exactly one of,
    *
    *     * the response data
    *     * the response error
    *     * nothing at all (`void`).
    *
    * The last case should occur precisely when your event completes successfully,
    * and its event declaration has no response type (*i.e.*, `EmptyEventParameter`).
    *
    * `electron-reactive-event` takes the values returned by your callbacks,
    * and coverts them into the uniform shape for the receiver.
    */
export type ReturnType<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    Registrar extends Shared.Registrar.IMainRegistrarBase
        ? AwaitedReturnType<ChannelType, Registrar>
        : Registrar extends Shared.Registrar.IRendererRegistrarBase
            ? Promise<AwaitedReturnType<ChannelType, Registrar>>
            : never;

export type AwaitedReturnType<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    | ReturnType.Success<ChannelType, Registrar>
    | ReturnType.Error<ChannelType, Registrar>;

/** Arguments for callback functions provided to `electron-reactive-event`. */
export namespace Argument
{
    /**
     * The argument for a callback provided in the `renderer` (*i.e.*, it responds to an event from `main`).
     *
     * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
     * @typeParam Registrar - The registrar interface that holds the desired event declaration.
     */
    export type Renderer<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        Internal.Event.RequestDeclKey extends keyof Registrar[ChannelType]
            ? EmptyEventParameter extends Registrar[ChannelType][Internal.Event.RequestDeclKey]
                ? Shared.Callback.Argument.Base<Registrar>
                : (
                    Shared.Callback.Argument.Base<Registrar> &
                    Shared.Callback.Argument.RequestPart<ChannelType, Registrar>
                )
            : Shared.Callback.Argument.Base<Registrar>;

    /**
     * The argument for a callback provided in `main` (*i.e.*, it responds to an event from `renderer`).
     *
     * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
     * @typeParam Registrar - The registrar interface that holds the desired event declaration.
     */
    export type Main<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        Internal.Event.RequestDeclKey extends keyof Registrar[ChannelType]
            ? EmptyEventParameter extends Registrar[ChannelType][Internal.Event.RequestDeclKey]
                ? Shared.Callback.Argument.Base.Main
                : (
                    Shared.Callback.Argument.Base.Main &
                    Shared.Callback.Argument.RequestPart<ChannelType, Registrar>
                )
            : Shared.Callback.Argument.Base.Main;
}

/**
 * `MainCallback`s live under `main`, *i.e.*, they receive `renderer` events.
 */
export type Main<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Shared.Registrar.IRendererRegistrarBase
> =
    (Argument: Argument.Main<ChannelType, Registrar>)
    => ReturnType<ChannelType, Registrar>;

/** `RendererCallback`s live under the `renderer`, *i.e.*, they receive `main` events. */
export type Renderer<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Shared.Registrar.IMainRegistrarBase
> =
    (Argument: Argument.Renderer<ChannelType, Registrar>)
    => ReturnType<ChannelType, Registrar>;

/**
 * A record of callbacks, such that the keys are `Channel`s, and the values
 * are callbacks for event declarations given by their respective keys
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
export type EventRecord<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    {
        [ Key in ChannelType ]: Registrar extends Shared.Registrar.IMainRegistrarBase
            ? Renderer<Key, Registrar>
            : Registrar extends Shared.Registrar.IRendererRegistrarBase
                ? Main<Key, Registrar>
                : never;
    };

/** Functions that are responsible for registering callbacks. */
export namespace RegisterFunction
{

    /**
     * Register a given `renderer` callback function for a given channel.
     *
     * @typeParam Registrar - The registrar interface that holds the desired event declaration.
     * @param Channel - The channel of the event declaration corresponding to the given `Callback`.
     * @param Callback - The callback function that will be called when an event of channel `Channel`
     * is received from `main`.
     */
    export type Renderer<Registrar extends Shared.Registrar.IMainRegistrarBase> =
        <ChannelType extends Channel.Channel<Registrar>>(
            Channel: ChannelType,
            Callback: Callback.Renderer<ChannelType, Registrar>
        ) => void;
}

/**
 * A function that is given to `electron-reactive-event` via one of the `register`
 * functions or hooks.
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
export type Callback<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    Registrar extends Shared.Registrar.IRendererRegistrarBase
        ? Main<ChannelType, Registrar>
        : Registrar extends Shared.Registrar.IMainRegistrarBase
            ? Renderer<ChannelType, Registrar>
            : never;

/**
 * For a given event declaration, if the declaration does *not* define an error payload type,
 * then this is type of the `Error` property that is returned by `electron-reactive-event`
 * when an event is sent (*i.e.*, the return value of {@link send}, {@link useSend}, and
 * {@link useSendDeferred}).
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
type ErrorSimple<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    {
        Message: Event.ErrorMessage<ChannelType, Registrar>;
    };

/**
 * For a given event declaration, if the declaration defines an error payload type, then this
 * is the type of the `Error` property that is returned by `electron-reactive-event` when an
 * event is sent (*i.e.*, the return value of {@link send}, {@link useSend}, and
 * {@link useSendDeferred}).
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
type ErrorRich<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    ErrorSimple<ChannelType, Registrar> &
    {
        Payload: Event.ErrorPayload<ChannelType, Registrar>;
    };
