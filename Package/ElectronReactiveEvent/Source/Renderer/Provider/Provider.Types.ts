/* File:      Provider.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren } from "react";
import type { ipcRenderer } from "electron/renderer";

export type ReactiveEventContext =
    {
        ipcRenderer: Pick<typeof ipcRenderer,
            | "invoke"
            | "send"
            | "sendSync"
            | "off"
            | "on"
            | "once">;
    };

export type ReactiveEventProviderProps = PropsWithChildren<{ value: ReactiveEventContext; }>;
