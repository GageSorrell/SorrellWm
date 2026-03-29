/* File:      Main.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback, Channel, Event } from "../index.js";
import type { BrowserWindow } from "electron";
import type { EmptyEventParameter } from "../Decl.Types.js";
import type { Internal } from "../Internal/index.js";
import type { Shared } from "../Shared/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

export namespace Send
{
    export type ReturnType<
        ChannelType extends
            | Extract<Channel.Request<Registrar>
            | Channel.NoRequest<Registrar>, Channel.Channel<Registrar>>,
        WindowType extends BrowserWindow | Array<BrowserWindow>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        WindowType extends Array<BrowserWindow>
            ? Array<Event.Response<ChannelType, Registrar>>
            : Event.Response<ChannelType, Registrar>;

    export type Send<Registrar extends Internal.Registrar.IRegistrarBase> =
        {
            <ChannelType extends Channel.Request<Registrar>,
                WindowType extends BrowserWindow | Array<BrowserWindow>
            >(
                Channel: ChannelType,
                Request: Event.Request<typeof Channel, Registrar>,
                BrowserWindows: WindowType
            ): Promise<Send.ReturnType<ChannelType, WindowType, Registrar>>;

            <ChannelType extends Channel.NoRequest<Registrar>,
                WindowType extends BrowserWindow | Array<BrowserWindow>
            >(
                Channel: ChannelType,
                BrowserWindows: WindowType
            ): Promise<ReturnType<ChannelType, WindowType, Registrar>>;
        };
}

export type FactoryReturnType<
    MainRegistrar extends Shared.Registrar.IMainRegistrarBase,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
> =
    {
        registerCallback: Callback.RegisterFunction.Main<RendererRegistrar>;

        /**
         * Register multiple callbacks for a given set of event declarations.
         * The keys are taken to be the `ChannelType`s, and the respective values are the
         * callbacks that will be registered for their respective `ChannelType`s.
         */
        registerCallbacks: Callback.RegisterFunction.ByRecord<RendererRegistrar>;
        send: Send.Send<MainRegistrar>;
        unregisterCallback: Shared.Function.UnregisterCallback<RendererRegistrar>;
        unregisterCallbacks: Shared.Function.UnregisterCallbacks<RendererRegistrar>;
        unregisterAll: () => void;
    };

export type Response<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Shared.Registrar.IRendererRegistrarBase
> =
    Internal.Event.ResponseDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][Internal.Event.ResponseDeclKey] extends EmptyEventParameter
            ? | {
                Error: Callback.ReturnType.Error<ChannelType, Registrar>;
            }
            | {
                Error: undefined;
            }
            : | {
                Data: Callback.ReturnType.Success<ChannelType, Registrar>;
                Error: undefined;
            }
            | {
                Data: undefined;
                Error: Callback.ReturnType.Error<ChannelType, Registrar>;
            }
        : never;
