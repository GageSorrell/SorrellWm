/* File:      Error.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    ReactiveEventErrorDataInternal,
    ReactiveEventErrorMessage,
    ReactiveEventErrorPayload } from "./Error.Internal.Types.js";
import type { Channel } from "../Channel/index.js";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal.js";
import type { PackageKeys } from "../Internal/index.js";
import { ReactiveEventErrorInternal } from "./Error.Internal.js";

/**
 * An error of an event.  Returning this in your handler is how errors are
 * described to the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param message - The message of this event's error.
 *
 * @returns The internal-facing object that describes the error.
 */
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey>
>(
    message: ReactiveEventErrorMessage<PackageKey, ChannelType>
): ReactiveEventErrorInternal<PackageKey, ChannelType>;
/**
 * An error of an event.  Returning this in your handler is how errors are
 * described to the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param message - The message of this event's error.
 * @param payload - The payload of this event's error.
 *
 * @returns The internal-facing object that describes the error.
 */
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.ErrorPayload<PackageKey>>(
    message: ReactiveEventErrorMessage<PackageKey, ChannelType>,
    payload: ReactiveEventErrorPayload<PackageKey, ChannelType>
): ReactiveEventErrorInternal<PackageKey, ChannelType>;
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey>>(
    message: ReactiveEventErrorMessage<PackageKey, ChannelType>,
    payload: ReactiveEventErrorPayload<PackageKey, ChannelType> = EmptyOverloadParameterValue
): ReactiveEventErrorInternal<PackageKey, ChannelType>
{
    type ThisData = ReactiveEventErrorDataInternal<PackageKey, ChannelType>;
    const Data: ThisData =
        {
            Message: message,
            Payload: payload
        } as ThisData;

    return new ReactiveEventErrorInternal<PackageKey, ChannelType>(Data);
}
