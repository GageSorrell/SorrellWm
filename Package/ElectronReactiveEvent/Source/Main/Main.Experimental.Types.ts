/* File:      Main.Experimental.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ErrorKey, PackageKeys, Registrar, ResponseKey } from "../Internal";
import type { Channel } from "../Channel";

export type Response<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Response<PackageKey>
> =
    ResponseKey extends keyof Registrar[PackageKey][ChannelType]
        ? Registrar[PackageKey][ChannelType][ResponseKey]
        : never;

export type Error<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Error<PackageKey>
> =
    ErrorKey extends keyof Registrar[PackageKey][ChannelType]
        ? Registrar[PackageKey][ChannelType][ErrorKey]
        : never;

export type Success<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    ResponseKey extends keyof Registrar[PackageKey][ChannelType]
        ? [ Registrar[PackageKey][ChannelType][ResponseKey] ] extends [ never ]
            ? {
                data: undefined;
                error: undefined;
            }
            : {
                data: Registrar[PackageKey][ChannelType][ResponseKey];
                error: undefined;
            }
        : never;

export type Failure<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Error<PackageKey>
> =
    ErrorKey extends keyof Registrar[PackageKey][ChannelType]
        ? {
            data: undefined;
            error: Registrar[PackageKey][ChannelType][ErrorKey];
        }
        : never;

export type Result<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>
> =
    ResponseKey extends keyof Registrar[PackageKey][ChannelType]
        ? ErrorKey extends keyof Registrar[PackageKey][ChannelType]
            ? (
                | Success<PackageKey, ChannelType>
                | Failure<PackageKey, ChannelType>
            )
            : never
        : never;
