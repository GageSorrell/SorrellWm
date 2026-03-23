/* File:      Function.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type {
    Callback,
    CallbackRecord,
    NoRequestChannel,
    Request,
    RequestChannel,
    SendEventReturn } from "./index.js";
import type { BrowserWindow } from "electron/main";
import type { Channel } from "./Internal/index.js";

export type Send<Registrar> =
    {
        <ChannelType extends RequestChannel<Registrar>,
            WindowType extends BrowserWindow | Array<BrowserWindow>
        >(
            Channel: ChannelType,
            Request: Request<typeof Channel, Registrar>,
            BrowserWindows: WindowType
        ): Promise<SendEventReturn<ChannelType, WindowType, Registrar>>;

        <ChannelType extends NoRequestChannel<Registrar>,
            WindowType extends BrowserWindow | Array<BrowserWindow>
        >(
            Channel: ChannelType,
            BrowserWindows: WindowType
        ): Promise<SendEventReturn<ChannelType, WindowType, Registrar>>;
    };

export type RegisterCallback<Registrar> = <ChannelType extends Channel<Registrar>>(
    Channel: ChannelType,
    Callback: Callback<ChannelType, Registrar>
) => void;

export type RegisterCallbacks<Registrar> = <ChannelType extends Channel<Registrar>>(
    Record: CallbackRecord<ChannelType, Registrar>
) => void;

export type UseEventCallbackDeferred<Registrar> =
    () => Readonly<[ RegisterCallback<Registrar> ]>;

export type UseEventCallbacksDeferred<Registrar> =
    () => Readonly<[ RegisterCallbacks<Registrar> ]>;

export type UseUnregisterCallbackDeferred<MainRegistrar> =
    () => Readonly<[ UnregisterCallback: UnregisterCallback<MainRegistrar> ]>;

export type UseUnregisterCallbacksDeferred<MainRegistrar> =
    () => Readonly<[ UnregisterCallbacks: UnregisterCallbacks<MainRegistrar> ]>;

export type UnregisterCallback<Registrar> =
    <ChannelType extends Channel<Registrar>>(
        Channel: ChannelType,
        Callback: Callback<ChannelType, Registrar>
    ) => void;

export type UnregisterCallbacks<Registrar> =
    <ChannelType extends Channel<Registrar>>(
        Record: CallbackRecord<ChannelType, Registrar>
    ) => void;
