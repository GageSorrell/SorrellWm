/* File:      Error.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventErrorRecord, EventErrorTuple } from "../Decl/Decl.Types.js";
import type { PackageKeys, Registrar } from "../Internal/index.js";
import type { Channel } from "../Channel/index.js";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types.js";
import type { ErrorKey } from "../Internal/Decl.Types.js";

type ErrorNormalized<MessageType extends string, PayloadType = EmptyOverloadParameter> =
    PayloadType extends EmptyEventParameter
        ? {
            Message: MessageType;
            Payload: EmptyOverloadParameter;
        }
        : {

            Message: MessageType;
            Payload: PayloadType;
        };

type GetNormalizedError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> = ErrorKey extends keyof Registrar[PackageKey][ChannelType]
    ? Registrar[PackageKey][ChannelType][ErrorKey] extends EmptyEventParameter
        ? never
        : Registrar[PackageKey][ChannelType][ErrorKey] extends string
            ? ErrorNormalized<Registrar[PackageKey][ChannelType][ErrorKey]>
            : Registrar[PackageKey][ChannelType][ErrorKey] extends
            EventErrorTuple<infer MessageType, infer PayloadType>
                ? ErrorNormalized<MessageType, PayloadType>
                : Registrar[PackageKey][ChannelType][ErrorKey] extends
                EventErrorRecord<infer MessageType, infer PayloadType>
                    ? ErrorNormalized<MessageType, PayloadType>
                    : never
    : never;

/** The key of the payload in {@link ErrorNormalized}. */
export type ErrorPayloadKey = "Payload";

/**
 * An error that always has a `Payload` property (it is {@link EmptyOverloadParameter} if empty).
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ReactiveEventErrorDataInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey>
> = Readonly<GetNormalizedError<PackageKey, ChannelType>>;

/**
 * The message of an error type, derived from {@link ReactiveEventErrorDataInternal}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ReactiveEventErrorMessage<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey>
> = ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Message"];

/**
 * The payload of an error type, derived from {@link ReactiveEventErrorDataInternal}.
 * It is {@link EmptyOverloadParameter} if the event declaration has no error payload type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ReactiveEventErrorPayload<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Error<PackageKey>
> = ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Payload"];
