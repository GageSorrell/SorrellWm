/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, MainOwner } from "../Decl.Types";
import type { FilterByOwner, PackageKeys, Registrar, RequestKey } from "../Internal";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";
import type { Channel } from "../Channel.Types";
import type { ReactiveEventError } from "../Internal/Error.Types";

/**
 * These are the types that your callbacks should return.
 * @module Callback
 */

type MainRegistrar<PackageKey extends PackageKeys> = FilterByOwner<PackageKey, MainOwner>;

type Request<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, MainOwner>
> = RequestKey extends keyof FilterByOwner<PackageKey, MainOwner>
    ? MainRegistrar<PackageKey>[ChannelType][RequestKey] extends EmptyEventParameter
        ? never
        : MainRegistrar<PackageKey>[ChannelType][RequestKey]
    : never;

export type Callback<
    PackageKey extends PackageKeys,
    EventType extends IpcMainEvent | IpcMainInvokeEvent,
    ChannelType extends Channel.Any<PackageKey, MainOwner>
> =
    RequestKey extends keyof FilterByOwner<PackageKey, MainOwner>
        ? MainRegistrar<PackageKey>[ChannelType][RequestKey] extends EmptyEventParameter
            ? {
                (Channel: ChannelType, Event: EventType): Return.Type<PackageKey, ChannelType>;
            }
            : {
                (
                    Channel: ChannelType,
                    Event: EventType,
                    Request: Request<PackageKey, ChannelType>
                ): Return.Type<PackageKey, ChannelType>;
            }
        : never;

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace Return
{
    export type SuccessType<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Any<PackageKey, MainOwner>
    > = Registrar[PackageKey][ChannelType][ResponseType] extends EmptyEventParameter
        ? void
        : Registrar[PackageKey][ChannelType][ResponseType];

    export type ErrorType<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Any<PackageKey, MainOwner>
    > = ReactiveEventError<PackageKey, MainOwner, ChannelType>;

    export type Type<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Any<PackageKey, MainOwner>
    > =
        | SuccessType<PackageKey, ChannelType>
        | ErrorType<PackageKey, ChannelType>;
}
