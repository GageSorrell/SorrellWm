/* File:      Handler.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Failure, Success } from "./Handler.Types";
import type { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";
import type { PackageKeys } from "../Internal";

/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event succeeds, such that the corresponding event declaration
 * does *not* define a response type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @returns An object indicating that the {@link Handler} in which a call
 * to this function was returned completed successfully.
 */
export function succeed<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Without.Response<PackageKey>
>(): Success<PackageKey, ChannelType>;
/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event succeeds, such that the corresponding event declaration
 * defines a response type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param In - The response data of your event.  This is mapped to the
 * {@link ResultSuccess.data} property.
 *
 * @returns An object indicating that the {@link Handler} in which a call
 * to this function was returned completed successfully.
 */
export function succeed<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.With.Response<PackageKey>
>(
    In: Decl.Response<PackageKey, ChannelType>
): Success<PackageKey, ChannelType>;
/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event succeeds.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param In - *(Optional)* The response data of your event.  No value should be provided
 * iff the event declaration given by the {@link ChannelType} does not define a response type.
 * If the event declaration defines a response type, then this is mapped to the
 * {@link ResultSuccess.data} property.
 *
 * @returns An object indicating that the {@link Handler} in which a call
 * to this function was returned completed successfully.
 */
export function succeed<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler<PackageKey>
>(
    In:
        | Decl.Response<PackageKey, ChannelType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): Success<PackageKey, ChannelType>
{
    return {
        data: (In === EmptyOverloadParameterValue)
            ? undefined
            : In,
        error: undefined
    } as Success<PackageKey, ChannelType>;
}

/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event fails.  The corresponding event declaration must
 * define an error type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param In - The error data of your event.  This is mapped to the
 * {@link ResultError.error} property.
 *
 * @returns An object indicating that the {@link Handler} in which a call
 * to this function was returned failed.
 */
export function fail<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.With.Error<PackageKey>
>(
    In: Decl.Error<PackageKey, ChannelType>
): Failure<PackageKey, ChannelType>
{
    return {
        data: undefined,
        error: In
    } as Failure<PackageKey, ChannelType>;
}
