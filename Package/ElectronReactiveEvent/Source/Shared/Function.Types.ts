/* File:      Function.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Shared } from ".";
import type { Callback, Channel } from "..";
import type { Internal } from "../Internal";
import type { FactoryReturnType } from "../Main";

export type UnregisterCallback<Registrar extends Internal.Registrar.IRegistrarBase> =
    <ChannelType extends Channel.Channel<Registrar>>(
        Channel: ChannelType,
        Callback: Callback.Callback<ChannelType, Registrar>
    ) => void;

export type UnregisterCallbacks<Registrar extends Shared.Registrar.IRendererRegistrarBase> =
    FactoryReturnType<Shared.Registrar.IMainRegistrarBase, Registrar>["registerCallbacks"];
