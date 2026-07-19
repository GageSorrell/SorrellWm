/**
 * @file      BrowserWindow.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { BrowserWindow } from "electron";

export type FCreateBrowserWindowReturnType =
{
    LoadFrontend: () => Promise<void>;
    Window: BrowserWindow;
};
