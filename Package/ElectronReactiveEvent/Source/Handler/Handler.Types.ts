/**
 * @file      Handler.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ErrorKey, ResponseKey } from "../Internal";
import type { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { IpcMainInvokeEvent } from "electron/main";
import type { Registrar } from "../Registrar/Registrar.Types";

export namespace With
{
    /**
     * A {@link Handler} that subscribes to an event whose declaration has a request type.
     *
     * @template ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     */
    export type Request<ChannelType extends Channel.Handler.With.Request> =
        {
            (
                event: IpcMainInvokeEvent,
                request: Decl.Request<ChannelType>
            ): Promise<Result<ChannelType>>
        };
}

export namespace Without
{
    /**
     * A {@link Handler} that subscribes to an event whose declaration
     * does *not* have a request type.
     *
     * @template ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     */
    export type Request<ChannelType extends Channel.Handler.Without.Request> =
        {
            (event: IpcMainInvokeEvent): Promise<Result<ChannelType>>;
        };
}

/**
 * A callback function that can be registered for invokable events, *i.e.*, the
 * {@link ChannelType} is of type {@link Channel.Handler}, and is invoked via
 * {@link UseInvokeEvent} or {@link InvokeEventDeferred}.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Handler<ChannelType extends Channel.Handler> =
    ChannelType extends Channel.Handler.With.Request
        ? With.Request<ChannelType>
        : ChannelType extends Channel.Handler.Without.Request
            ? Without.Request<ChannelType>
            : never;

/**
 * The return type of a {@link Handler} when the {@link Handler} succeeds.
 * Values of this type should only come from calling {@link succeed}.  This value
 * gets transformed into {@link InvokeResult} when received by the `renderer`.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Success<ChannelType extends Channel.Handler> =
    [ Registrar[ChannelType][ResponseKey] ] extends [ never ]
        ? {
            data: undefined;
            error: undefined;
        }
        : {
            data: Registrar[ChannelType][ResponseKey];
            error: undefined;
        };

/**
 * The return type of a {@link Handler} when the {@link Handler} fails.
 * Values of this type should only come from calling {@link fail}.  This value
 * gets transformed into {@link InvokeResult} when received by the `renderer`.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Failure<ChannelType extends Channel.Handler.With.Error> =
    {
        data: undefined;
        error: Registrar[ChannelType][ErrorKey];
    };

/**
 * The return type of a {@link Handler}.  Values of this type should
 * only come from calling {@link succeed} or {@link fail}.  This value
 * gets transformed into {@link InvokeResult} when received by the `renderer`.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Result<ChannelType extends Channel.Handler> =
    | Success<ChannelType>
    | Failure<ChannelType>;
