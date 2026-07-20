/**
 * @file      Handler.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Failure, Success } from "./Handler.Types";
import type { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";

/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event succeeds, such that the corresponding event declaration
 * does *not* define a response type.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @returns {Success<ChannelType>} An object indicating that the {@link Handler} in which a call
 * to this function was returned completed successfully.
 */
export function succeed<ChannelType extends Channel.Handler.Without.Response
>(): Success<ChannelType>;

/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event succeeds, such that the corresponding event declaration
 * defines a response type.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param In - The response data of your event.  This is mapped to the
 * {@link ResultSuccess.data} property.
 *
 * @returns {Success<ChannelType>} An object indicating that the {@link Handler} in which a call
 * to this function was returned completed successfully.
 */
export function succeed<ChannelType extends Channel.Handler.With.Response
>(
    In: Decl.Response<ChannelType>
): Success<ChannelType>;

/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event succeeds.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param In - *(Optional)* The response data of your event.  No value should be provided
 * iff the event declaration given by the {@link ChannelType} does not define a response type.
 * If the event declaration defines a response type, then this is mapped to the
 * {@link ResultSuccess.data} property.
 *
 * @returns {Success<ChannelType>} An object indicating that the {@link Handler} in which a call
 * to this function was returned completed successfully.
 */
export function succeed<ChannelType extends Channel.Handler
>(
    In:
        | Decl.Response<ChannelType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): Success<ChannelType>
{
    return {
        data: (In === EmptyOverloadParameterValue)
            ? undefined
            : In,
        error: undefined
    } as Success<ChannelType>;
}

/**
 * Return a call to this function in your {@link Handler | handlers}
 * when your event fails.  The corresponding event declaration must
 * define an error type.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param In - The error data of your event.  This is mapped to the
 * {@link ResultError.error} property.
 *
 * @returns An object indicating that the {@link Handler} in which a call
 * to this function was returned failed.
 */
export function fail<ChannelType extends Channel.Handler.With.Error
>(
    In: Decl.Error<ChannelType>
): Failure<ChannelType>
{
    return {
        data: undefined,
        error: In
    } as Failure<ChannelType>;
}
