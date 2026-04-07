/* File:      Provider.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type Context, createContext } from "react";
import type { ReactiveEventContext } from "./Provider.Types";
import type { ReactiveEventContextInternal } from "./Provider.Internal.Types";
import { ipcRenderer } from "electron";

const EmptyReactiveEventContext: ReactiveEventContext =
    {
        ipcRenderer:
        {
            invoke: ipcRenderer.invoke,
            off: ipcRenderer.off,
            on: ipcRenderer.on,
            once: ipcRenderer.once,
            send: ipcRenderer.send,
            sendSync: ipcRenderer.sendSync
        }
    };

const EmptyReactiveEventContextInternal: ReactiveEventContextInternal =
    {
        ...EmptyReactiveEventContext
    };

export const ReactiveEventInternalContext: Context<ReactiveEventContextInternal> =
    createContext<ReactiveEventContextInternal>(EmptyReactiveEventContextInternal);
