/* File:      Provider.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type Context, createContext } from "react";
import type { ReactiveEventContext } from "./Provider.Types.js";
import type { ReactiveEventContextInternal } from "./Provider.Internal.Types.js";
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

/* The ESLint rule claims that `ReactiveEventInternalContext` does not have a JSDoc comment, when it does. */
/* eslint-disable jsdoc/require-jsdoc */

/**
 * This is the context used by `electron-reactive-event`.
 *
 * @group Internal
 */
export const ReactiveEventInternalContext: Context<ReactiveEventContextInternal> =
    createContext<ReactiveEventContextInternal>(EmptyReactiveEventContextInternal);
