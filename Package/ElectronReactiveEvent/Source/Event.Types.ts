/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type {
    Channel,
    ErrorMessageDeclKey,
    ErrorPayloadDeclKey,
    IRegistrarBase,
    IsValid,
    RequestDeclKey,
    ResponseDeclKey } from "./Internal/index.js";
import type { EmptyEventParameter } from "./index.js";

/**
 * This is the type that the developer will return in their callbacks.
 * It varies from the type that is sent via IPC.
 */
export type Response<ChannelType extends Channel<Registrar>, Registrar extends IRegistrarBase> =
    ResponseDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][ResponseDeclKey]
        : never;

/**
 * This is the type that the developer will provide when firing events.
 * It varies from the type that is sent via IPC.
 */
export type Request<ChannelType extends keyof Registrar, Registrar> =
    ChannelType extends keyof Registrar
        ? RequestDeclKey extends keyof Registrar[ChannelType]
            ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
                ? never
                : Registrar[ChannelType][RequestDeclKey]
            : never
        : never;

type ErrorBase<ChannelType extends keyof Registrar, Registrar> =
    ErrorMessageDeclKey extends keyof Registrar[ChannelType]
        ? {
            Message: Registrar[ChannelType][ErrorMessageDeclKey];
        }
        : never;

/** "Simple" <=> no payload type. */
type ErrorSimple<ChannelType extends keyof Registrar, Registrar> =
    ErrorBase<ChannelType, Registrar>;

type ErrorPayload<ChannelType extends keyof Registrar, Registrar> =
    ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
        ? {
            Payload: Registrar[ChannelType][ErrorPayloadDeclKey];
        }
        : never;

/** "Rich" <=> has a payload type. */
type ErrorRich<ChannelType extends keyof Registrar, Registrar> =
    ErrorSimple<ChannelType, Registrar> &
    ErrorPayload<ChannelType, Registrar>;

export type Error<ChannelType extends keyof Registrar, Registrar> =
    ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
        ? IsValid<Registrar[ChannelType][ErrorPayloadDeclKey]> extends true
            ? ErrorRich<ChannelType, Registrar>
            : ErrorSimple<ChannelType, Registrar>
        : never;
