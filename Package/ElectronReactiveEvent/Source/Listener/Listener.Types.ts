/* File:      Listener.With.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    EventOwner,
    MainOwner,
    PackageKeys,
    RendererOwner } from "../Internal";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron/main";
import type { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { IpcRendererEvent } from "electron/renderer";

export namespace Listener
{
    export namespace With
    {
        /**
         * A {@link Listener} that is subscribable to a
         * {@link Channel.Listener.With.Request | listener channel } whose event
         * declaration has a request type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         */
        export type Request<
            PackageKey extends PackageKeys,
            OwnerType extends EventOwner,
            ChannelType extends Channel.Listener.With.Request<PackageKey, OwnerType>,
            EventType extends IpcEvent | undefined = undefined
        > =
            EventType extends undefined
                ? OwnerType extends RendererOwner
                    ? {
                        (
                            event: IpcMainEvent,
                            request: Decl.Request<PackageKey, ChannelType, RendererOwner>
                        ): void;
                    }
                    : {
                        (
                            event: IpcRendererEvent,
                            request: Decl.Request<PackageKey, ChannelType, MainOwner>
                        ): void;
                    }
                : {
                    (
                        event: EventType,
                        request: Decl.Request<PackageKey, ChannelType, RendererOwner>
                    ): void;
                };

    }
    export namespace Without
    {
        /* eslint-disable @stylistic/max-len */

        /**
        * A {@link Listener} that is subscribable to a {@link Channel | listener channel }
        * whose event declaration has no request type.
        *
        * @typeParam OwnerType - The owner of the event declarations identified by this type.
        * @typeParam EventOverrideType - An optional override for the event type in the function signature.
        */
        export type Request<
            OwnerType extends EventOwner,
            EventOverrideType extends IpcEvent | undefined = undefined
        > =
            EventOverrideType extends undefined
                ? OwnerType extends RendererOwner
                    ? {
                        (event: IpcRendererEvent): void;
                    }
                    : {
                        (event: IpcMainEvent): void;
                    }
                : {
                    (event: EventOverrideType): void;
                };
        /* eslint-enable @stylistic/max-len */
    };
}

/** The possible types for the `Event` parameter of a {@link Listener} callback. */
export type IpcEvent =
    | IpcMainEvent
    | IpcMainInvokeEvent
    | IpcRendererEvent;

/**
 * A callback function that can be registered for sendable events, *i.e.*, the
 * {@link ChannelType} is of type {@link Listener.With.Any}, and is sent via
 * {@link UseSendEvent}, {@link SendEventDeferred}, or {@link Send}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type Listener<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Listener<PackageKey, OwnerType>,
    EventType extends IpcEvent | undefined = undefined
> =
    ChannelType extends Channel.Listener.With.Request<PackageKey, OwnerType>
        ? Listener.With.Request<PackageKey, OwnerType, ChannelType, EventType>
        : ChannelType extends Channel.Listener.Without.Request<PackageKey, OwnerType>
            ? Listener.Without.Request<OwnerType, EventType>
            : never;
