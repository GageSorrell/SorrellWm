/* File:      Provider.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type ReactNode } from "react";
import { ReactiveEventInternalContext } from "./Provider.Internal.js";
import type { ReactiveEventProviderProps } from "./Provider.Types.js";

/**
 * This is what provides the `electron-reactive-event` hooks with the
 * necessary IPC functions from
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer }.
 * This must wrap your application where `electron-reactive-event` is used.
 *
 * @see {@link /guides/getting-started} for more details.
 *
 * @param Props - The children and necessary IPC functions.
 * @param Props.children - The portion of your application which uses `electron-reactive-event`.
 * @param Props.value - The IPC functions needed by `electron-reactive-event`.
 *
 * @returns Your application, equipped with the functionality needed to use `electron-reactive-event`.
 */
export function ReactiveEventProvider(
    { children, value }: ReactiveEventProviderProps
): ReactNode
{
    return (
        <ReactiveEventInternalContext.Provider { ...{ value } }>
            { children }
        </ReactiveEventInternalContext.Provider>
    );
}
