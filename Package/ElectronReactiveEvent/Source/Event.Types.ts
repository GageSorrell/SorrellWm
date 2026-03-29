/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

import type { Channel, EmptyEventParameter } from "./index.js";
import type { Internal } from "./Internal/index.js";

/**
 * This is the type that the developer will return in their callbacks.
 * It varies from the type that is sent via IPC.
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
export type Response<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    Internal.Event.ResponseDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][Internal.Event.ResponseDeclKey]
        : never;

/**
 * This is the type that the developer will provide when firing events.
 * It varies from the type that is sent via IPC.
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
export type Request<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    ChannelType extends keyof Registrar
        ? Internal.Event.RequestDeclKey extends keyof Registrar[ChannelType]
            ? EmptyEventParameter extends Registrar[ChannelType][Internal.Event.RequestDeclKey]
                ? never
                : Registrar[ChannelType][Internal.Event.RequestDeclKey]
            : never
        : never;

/**
 * For a given event declaration, this is the error message type.  It always extends `string`.
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
export type ErrorMessage<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    Internal.Event.ErrorMessageDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][Internal.Event.ErrorMessageDeclKey]
        : never;

/**
 * For a given event declaration, this is the error payload type.
 * The error payload type is *not* guaranteed to exist, and is only recommended for conveying
 * complex error states (that is, a robust string union type should be sufficient for most
 * event declarations).
 *
 * @typeParam ChannelType - The desired channel of the given {@link Registrar}.
 * @typeParam Registrar - The registrar interface that holds the desired event declaration.
 */
export type ErrorPayload<ChannelType extends keyof Registrar, Registrar> =
    Internal.Event.ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][Internal.Event.ErrorPayloadDeclKey]
        : never;
