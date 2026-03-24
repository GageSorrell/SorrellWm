/* File:      Preload.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ipcRenderer } from "electron/renderer";

export type IpcRendererFunctions =
    Pick<
        typeof ipcRenderer,
        | "invoke"
        | "on"
        | "off"
        | "once"
        | "send"
    >;

export type ReactiveEventPreloadData =
    {
        electronReactiveEvent: IpcRendererFunctions;
    };
