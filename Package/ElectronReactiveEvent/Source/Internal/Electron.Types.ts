/* File:      Electron.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type * as ElectronType from "electron";

export type Electron = typeof ElectronType;

export type ElectronModuleCache =
    {
        [ Module in keyof typeof Electron ]?: (typeof Electron)[Module];
    };

export type ElectronModule = keyof ElectronModuleCache;
