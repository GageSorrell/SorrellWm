/* File:      Listener.Unscoped.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EventOwner, RendererOwner } from "../Decl/index.js";
import type { IpcMainEvent, IpcRendererEvent } from "electron";
import type { IpcEvent } from "./Listener.Types.js";

/**
 * The type of the value returned by {@link UseInvokeEvent} when {@link InvokeOptions.suspend}
 * is passed and before a {@link Handler} registered in `main` has returned a {@link Response}.
 */
export type ResponseIndeterminate =
    {
        data: undefined;
        error: undefined;
        isPending: true;
    };

/**
 * A {@link Listener} that is subscribable to a {@link Channel.Listener.NoRequest | listener channel }
 * whose event declaration has no request type.
 *
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 */
export type ListenerNoRequest<
    OwnerType extends EventOwner,
    EventType extends IpcEvent | undefined = undefined
> =
    EventType extends undefined
        ? OwnerType extends RendererOwner
            ? {
                (event: IpcRendererEvent): void;
            }
            : {
                (event: IpcMainEvent): void;
            }
        : {
            (event: EventType): void;
        };
