/* File:      Main.Experimental.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type EmptyOverloadParameter, EmptyOverloadParameterValue } from "../Listener";
import type { Error, Failure, Response, Success } from "./Main.Experimental.Types";
import type { Channel } from "../Channel";
import type { PackageKeys } from "../Internal";

export function succeed<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoResponse<PackageKey>
>(): Success<PackageKey, ChannelType>;
export function succeed<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Response<PackageKey>
>(
    In: Response<PackageKey, ChannelType>
): Success<PackageKey, ChannelType>;
export function succeed<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
>(
    In:
        | Response<PackageKey, ChannelType>
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

export function fail<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Error<PackageKey>
>(
    In: Error<PackageKey, ChannelType>
): Failure<PackageKey, ChannelType>
{
    return {
        data: undefined,
        error: In
    } as Failure<PackageKey, ChannelType>;
}
