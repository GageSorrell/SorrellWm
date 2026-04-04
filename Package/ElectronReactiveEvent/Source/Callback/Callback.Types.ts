/* File:      Callback.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventOwner, MainOwner, RendererOwner } from "../Decl.Types";
import type {
    FilterByOwner,
    PackageKeys,
    ReactiveEventError,
    Registrar,
    RendererRegistrar,
    RequestKey,
    ResponseKey } from "../Internal";
import type { IpcMainEvent, IpcMainInvokeEvent, IpcRendererEvent } from "electron";
import type { Channel } from "../Channel.Types";

export type EventTypesFromOwner<OwnerType extends EventOwner> =
    OwnerType extends MainOwner
        ? IpcRendererEvent
        : OwnerType extends RendererOwner
            ? (IpcMainEvent | IpcMainInvokeEvent)
            : never;

export type Response<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = ResponseKey extends keyof FilterByOwner<PackageKey, OwnerType>
    ? RendererRegistrar<PackageKey>[ChannelType][ResponseKey] extends EmptyEventParameter
        ? never
        : RendererRegistrar<PackageKey>[ChannelType][ResponseKey]
    : never;

export type Request<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>
    ? RendererRegistrar<PackageKey>[ChannelType][RequestKey] extends EmptyEventParameter
        ? never
        : RendererRegistrar<PackageKey>[ChannelType][RequestKey]
    : never;

export type Callback<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    EventType extends EventTypesFromOwner<OwnerType>,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> =
    RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>[ChannelType]
        ? FilterByOwner<PackageKey, OwnerType>[ChannelType][RequestKey] extends EmptyEventParameter
            ? {
                (Event: EventType): Return.Type<PackageKey, OwnerType, ChannelType>;
            }
            : {
                (
                    Event: EventType,
                    Request: Request<PackageKey, OwnerType, ChannelType>
                ): Return.Type<PackageKey, OwnerType, ChannelType>;
            }
        : never;

/* eslint-disable-next-line @typescript-eslint/no-namespace */
export namespace Return
{
    export type SuccessType<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner,
        ChannelType extends Channel.Any<PackageKey, OwnerType>
    > = Registrar[PackageKey][ChannelType][ResponseType] extends EmptyEventParameter
        ? void
        : Registrar[PackageKey][ChannelType][ResponseType];

    export type ErrorType<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner,
        ChannelType extends Channel.Any<PackageKey, RendererOwner>
    > = ReactiveEventError<PackageKey, OwnerType, ChannelType>;

    export type Type<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner,
        ChannelType extends Channel.Any<PackageKey, RendererOwner>
    > =
        | SuccessType<PackageKey, OwnerType, ChannelType>
        | ErrorType<PackageKey, OwnerType, ChannelType>;
}

export type ResponseData<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = Response<PackageKey, OwnerType, ChannelType>;

export type ResponseError<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = ReactiveEventError<PackageKey, OwnerType, ChannelType>;

export type SendResponseSuccess<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> =
    Readonly<{
        Data: ResponseData<PackageKey, OwnerType, ChannelType>;
        Error: undefined;
    }>;

export type SendResponseFailure<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> =
    Readonly<{
        Data: undefined;
        Error: ResponseError<PackageKey, OwnerType, ChannelType>;
    }>;

export type SendResponse<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> =
    | SendResponseSuccess<PackageKey, OwnerType, ChannelType>
    | SendResponseFailure<PackageKey, OwnerType, ChannelType>;

export type EmptyRequestParameterType = Readonly<{
    EmptyEventParameter: "EmptyRequestParameter"
}>;
