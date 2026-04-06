/* File:      Error.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ReactiveEventError, ReactiveEventErrorMessage, ReactiveEventErrorPayload } from "./Error.Types";
import type { Channel } from "../Channel";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";
import type { PackageKeys } from "../Internal";

export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.ErrorMessage<PackageKey>>(
    message: ReactiveEventErrorMessage<PackageKey, ChannelType>
): ReactiveEventError<PackageKey, ChannelType>;
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.ErrorPayload<PackageKey>>(
    message: ReactiveEventErrorMessage<PackageKey, ChannelType>,
    payload: ReactiveEventErrorPayload<PackageKey, ChannelType>
): ReactiveEventError<PackageKey, ChannelType>;
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Error<PackageKey>>(
    message: ReactiveEventErrorMessage<PackageKey, ChannelType>,
    payload:
        | ReactiveEventErrorPayload<PackageKey, ChannelType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): ReactiveEventError<PackageKey, ChannelType>
{
    return ((payload !== EmptyOverloadParameterValue)
        ? {
            Message: message,
            Payload: payload
        }
        : {
            Message: message
        }) as ReactiveEventError<PackageKey, ChannelType>;
}
