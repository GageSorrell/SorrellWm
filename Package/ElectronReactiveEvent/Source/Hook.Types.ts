/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback, CallbackRecord, RegisterCallback, RegisterCallbacks } from "./index.js";
import type { Channel } from "./Internal/index.js";

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
