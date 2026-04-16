/* File:      Handler.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ErrorKey, PackageKeys, Registrar, ResponseKey } from "../Internal";
import type { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { IpcMainInvokeEvent } from "electron/main";

export namespace With
{
    /**
     * A {@link Handler} that subscribes to an event whose declaration has a request type.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     */
    export type Request<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Handler.With.Request<PackageKey>
    > =
        {
            (
                event: IpcMainInvokeEvent,
                request: Decl.Request<PackageKey, ChannelType>
            ): Promise<Result<PackageKey, ChannelType>>
        };
}

export namespace Without
{
    /**
     * A {@link Handler} that subscribes to an event whose declaration does
     * *not* have a request type.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     */
    export type Request<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Handler.Without.Request<PackageKey>
    > =
        {
            (event: IpcMainInvokeEvent): Promise<Result<PackageKey, ChannelType>>;
        };
}

/**
 * A callback function that can be registered for invokable events, *i.e.*, the
 * {@link ChannelType} is of type {@link Channel.Handler}, and is invoked via
 * {@link UseInvokeEvent} or {@link InvokeEventDeferred}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Handler<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler<PackageKey>
> =
    ChannelType extends Channel.Handler.With.Request<PackageKey>
        ? With.Request<PackageKey, ChannelType>
        : ChannelType extends Channel.Handler.Without.Request<PackageKey>
            ? Without.Request<PackageKey, ChannelType>
            : never;

/**
 * The return type of a {@link Handler} when the {@link Handler} succeeds.
 * Values of this type should only come from calling {@link succeed}.  This value
 * gets transformed into {@link InvokeResult} when received by the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Success<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler<PackageKey>
> =
    [ Registrar[PackageKey][ChannelType][ResponseKey] ] extends [ never ]
        ? {
            data: undefined;
            error: undefined;
        }
        : {
            data: Registrar[PackageKey][ChannelType][ResponseKey];
            error: undefined;
        };

/**
 * The return type of a {@link Handler} when the {@link Handler} fails.
 * Values of this type should only come from calling {@link fail}.  This value
 * gets transformed into {@link InvokeResult} when received by the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Failure<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.With.Error<PackageKey>
> =
    {
        data: undefined;
        error: Registrar[PackageKey][ChannelType][ErrorKey];
    };

/**
 * The return type of a {@link Handler}.  Values of this type should
 * only come from calling {@link succeed} or {@link fail}.  This value
 * gets transformed into {@link InvokeResult} when received by the `renderer`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Result<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler<PackageKey>
> =
    | Success<PackageKey, ChannelType>
    | Failure<PackageKey, ChannelType>;
