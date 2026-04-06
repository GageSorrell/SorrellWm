/* File:      Error.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventErrorRecord, EventErrorTuple } from "../Decl.Types";
import type { ErrorKey, PackageKeys, Registrar } from "../Internal";
import type { Channel } from "../Channel";

type ErrorNormalized<MessageType extends string, PayloadType = EmptyEventParameter> =
    {
        Message: MessageType;
        Payload: PayloadType;
    };

type GetNormalizedError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>
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

export type ErrorMessageKey = "Message";
export type ErrorPayloadKey = "Payload";

export type ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Error<PackageKey>
> = Readonly<GetNormalizedError<PackageKey, ChannelType>>;

export type ReactiveEventErrorMessage<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Error<PackageKey>
> = ReactiveEventError<PackageKeys, ChannelType>["Message"];

export type ReactiveEventErrorPayload<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Error<PackageKey>
> = ReactiveEventError<PackageKeys, ChannelType>["Payload"];
