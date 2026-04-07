/* File:      Provider.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PackageKeys } from "../../Internal";
import type { PropsWithChildren } from "react";
import type { ipcRenderer } from "electron/renderer";

export type ReactiveEventContext =
    {
        ipcRendererFunctions: Pick<typeof ipcRenderer,
            | "invoke"
            | "send"
            | "sendSync"
            | "off"
            | "on"
            | "once">;
        packageKey: PackageKeys;
    };

export type ReactiveEventProviderProps = PropsWithChildren<{ value: ReactiveEventContext; }>;
