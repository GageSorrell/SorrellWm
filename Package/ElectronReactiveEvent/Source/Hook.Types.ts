/* File:      Hook.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { CallbackRecord, RegisterCallbacks, RendererCallback, RendererRegisterCallback } from "./index.js";
import type { Channel, IRegistrarBase, RegistrarOwner } from "./Internal/index.js";
import type { IMainRegistrarBase } from "./Registrar.Types.js";

export type UseEventCallbackDeferred<MainRegistrar extends IMainRegistrarBase> =
    () => Readonly<[ RendererRegisterCallback<MainRegistrar> ]>;

export type UseEventCallbacksDeferred<MainRegistrar extends IMainRegistrarBase> =
    () => Readonly<[ RegisterCallbacks<"Renderer", MainRegistrar> ]>;

export type UseUnregisterCallbackDeferred<MainRegistrar> =
    () => Readonly<[ UnregisterCallback: UnregisterCallback<MainRegistrar> ]>;

export type UseUnregisterCallbacksDeferred<MainRegistrar extends IMainRegistrarBase> =
    () => Readonly<[ UnregisterCallbacks: UnregisterCallbacks<"Renderer", MainRegistrar> ]>;

export type UnregisterCallback<Registrar> =
    <ChannelType extends Channel<Registrar>>(
        Channel: ChannelType,
        Callback: RendererCallback<ChannelType, Registrar>
    ) => void;

export type UnregisterCallbacks<Owner extends RegistrarOwner, Registrar extends IRegistrarBase> =
    <ChannelType extends Channel<Registrar>>(
        Record: CallbackRecord<ChannelType, Owner, Registrar>
    ) => void;
