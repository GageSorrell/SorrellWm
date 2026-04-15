/**
 * File:   ./src/Main.Generated.ts
 * Author: `electron-reactive-event-cli`
 *
 * ********************************************
 *
 * Generated with the generate command.
 * Regenerate this file by running,
 *
 *    `npm exec electron-reactive-event declare-events`
 *
 * in this directory.
 *
 */

/* eslint-disable */
import type { PackageKey } from "./Reactive.Generated.ts";
import { type IpcMainReactive, getReactiveIpcMain } from "electron-reactive-event/scoped";

export const ipcMain: IpcMainReactive<PackageKey> = getReactiveIpcMain<PackageKey>();
