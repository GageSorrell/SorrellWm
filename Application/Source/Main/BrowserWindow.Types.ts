/* File:      BrowserWindow.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { BrowserWindow } from "electron";

export type FCreateBrowserWindowReturnType =
{
    LoadFrontend: () => Promise<void>;
    Window: BrowserWindow;
};
