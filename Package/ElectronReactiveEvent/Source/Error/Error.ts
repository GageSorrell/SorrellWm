/* File:      Error.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    ReactiveEventErrorDataInternal,
    ReactiveEventErrorMessage,
    ReactiveEventErrorPayload } from "./Error.Internal.Types";
import type { Channel } from "../Channel";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";
import type { EventOwner } from "../Decl/Decl.Types";
import type { PackageKeys } from "../Internal";

/**
 * Describes an error of an event.  This is used by `handle`, and is translated
 * into the response given to the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export class ReactiveEventErrorInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.ErrorMessage<PackageKey>
>
{
    public constructor(Data: ReactiveEventErrorDataInternal<PackageKey, ChannelType>)
    {
        this.Message = Data.Message;
        this.Payload = Data.Payload;
    }

    public Message: ReactiveEventErrorMessage<PackageKey, ChannelType>;
    public Payload:
        | ReactiveEventErrorPayload<PackageKey, ChannelType>
        | EmptyOverloadParameter;
};

/**
 * An error of an event.  Returning this in your handler is how errors are
 * described to the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 * @typeParam OwnerType - The owner of the given event declaration.
 *
 * @param message - The message of this event's error.
 *
 * @returns The internal-facing object that describes the error.
 */
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey, OwnerType>,
    OwnerType extends EventOwner = EventOwner
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
 * @typeParam OwnerType - The owner of the given event declaration.
 *
 * @param message - The message of this event's error.
 * @param payload - The payload of this event's error.
 *
 * @returns The internal-facing object that describes the error.
 */
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.ErrorPayload<PackageKey, OwnerType>,
    OwnerType extends EventOwner = EventOwner>(
    message: ReactiveEventErrorMessage<PackageKey, ChannelType>,
    payload: ReactiveEventErrorPayload<PackageKey, ChannelType>
): ReactiveEventErrorInternal<PackageKey, ChannelType>;
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey, OwnerType>,
    OwnerType extends EventOwner = EventOwner>(
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
