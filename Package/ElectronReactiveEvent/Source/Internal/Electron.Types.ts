/**
 * @file      Electron.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as ElectronType from "electron";

export type Electron = typeof ElectronType;

export type ElectronModuleCache =
    {
        [ Module in keyof typeof Electron ]?: (typeof Electron)[Module];
    };

export type ElectronModule = keyof ElectronModuleCache;
