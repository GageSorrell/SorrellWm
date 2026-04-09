/* File:      Main.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcMain, IpcMainEvent } from "electron";
import type { Channel } from "../Channel";
import type { Listener } from "../Listener/index.js";
import type { PackageKeys } from "../Internal";
import type { RendererOwner } from "../Decl";

/**
 * The type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener | IpcMain.handle}
 * *et al.*
 */
export type NativeHandlerListener = Parameters<IpcMain["handle"]>[1];

/**
 * The type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on}
 * *et al.*
 */
export type NativeEventListener = Parameters<IpcMain["on"]>[1];

/**
 * The type-safe type of the listener passed to {@link IpcMainReactive.on} *et al.*
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on}
 * *et al.*
 */
export type MainListener<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>
> = Listener<PackageKey, RendererOwner, IpcMainEvent, ChannelType>;
