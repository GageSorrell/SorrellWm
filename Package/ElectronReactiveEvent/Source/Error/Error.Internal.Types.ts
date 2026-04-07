/* File:      Error.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventErrorRecord, EventErrorTuple, EventOwner } from "../Decl/Decl.Types";
import type { PackageKeys, Registrar } from "../Internal";
import type { Channel } from "../Channel";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import type { ErrorKey } from "../Decl/Decl.Internal.Types";

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

export type ErrorMessageKey = "Message";
export type ErrorPayloadKey = "Payload";

export type ReactiveEventErrorDataInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey, EventOwner>
> = Readonly<GetNormalizedError<PackageKey, ChannelType>>;

export type ReactiveEventErrorMessage<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey, EventOwner>
> = ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Message"];

export type ReactiveEventErrorPayload<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Error<PackageKey>
> = ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Payload"];
