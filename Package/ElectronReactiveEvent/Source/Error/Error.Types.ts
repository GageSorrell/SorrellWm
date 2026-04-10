/* File:      Error.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ReactiveEventErrorMessage, ReactiveEventErrorPayload } from "./Error.Internal.Types";
import type { Channel } from "../Channel";
import type { PackageKeys } from "../Internal";
import type { ReactiveEventErrorInternal } from "./Error.Internal";

/**
 * When an error is given to the `renderer` as a result of a `handler` returning an error,
 * this is the type of that `error` property.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ReactiveEventErrorData<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey>
> =
    ChannelType extends Channel.ErrorPayload<PackageKey>
        ? {
            message: ReactiveEventErrorMessage<PackageKey, ChannelType>;
        }
        : {
            message: ReactiveEventErrorMessage<PackageKey, ChannelType>;
            payload: ReactiveEventErrorPayload<PackageKey, ChannelType>;
        };

/**
* An error of an event.  Returning this in your handler is how errors are
* described to the `renderer`.
*
* @typeParam PackageKey - The unique string that identifies your package.
*/
export type ReactiveEventErrorFunction<PackageKey extends PackageKeys> =
    {
        /**
        * An error of an event.  Returning this in your handler is how errors are
        * described to the `renderer`.
        *
        * @typeParam ChannelType - The channel that uniquely identifies the desired
        * event declaration.
        *
        * @param message - The message of this event's error.
        *
        * @returns The internal-facing object that describes the error.
        */
        <ChannelType extends Channel.Error<PackageKey>>(
            message: ReactiveEventErrorMessage<PackageKey, ChannelType>
        ): ReactiveEventErrorInternal<PackageKey, ChannelType>;

        /**
        * An error of an event.  Returning this in your handler is how errors are
        * described to the `renderer`.
        *
        * @typeParam ChannelType - The channel that uniquely identifies the desired
        * event declaration.
        *
        * @param message - The message of this event's error.
        * @param payload - The payload of this event's error.
        *
        * @returns The internal-facing object that describes the error.
        */
        <ChannelType extends Channel.ErrorPayload<PackageKey>>(
            message: ReactiveEventErrorMessage<PackageKey, ChannelType>,
            payload: ReactiveEventErrorPayload<PackageKey, ChannelType>
        ): ReactiveEventErrorInternal<PackageKey, ChannelType>;
    };
