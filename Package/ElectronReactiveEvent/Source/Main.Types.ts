/* File:      Main.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { BrowserWindow } from "electron";
import type {
    NoRequestChannel,
    MainRegisterCallback,
    RegisterCallbacks,
    Request,
    RequestChannel,
    Response,
    UnregisterCallback,
    UnregisterCallbacks } from "./index.js";
import type { IMainRegistrarBase, IRendererRegistrarBase } from "./Registrar.Types.js";
import type { Channel, IRegistrarBase } from "./Internal/Registrar.Types.js";

export type SendEventReturn<
    ChannelType extends Extract<RequestChannel<Registrar> | NoRequestChannel<Registrar>, Channel<Registrar>>,
    WindowType extends BrowserWindow | Array<BrowserWindow>,
    Registrar extends IRegistrarBase
> =
    WindowType extends Array<BrowserWindow>
        ? Array<Response<ChannelType, Registrar>>
        : Response<ChannelType, Registrar>;

export type Send<Registrar extends IRegistrarBase> =
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

export type MainEventFactoryReturn<MainRegistrar extends IMainRegistrarBase, RendererRegistrar extends IRendererRegistrarBase> =
    {
        registerCallback: MainRegisterCallback<RendererRegistrar>;
        registerCallbacks: RegisterCallbacks<"Main", RendererRegistrar>;
        send: Send<MainRegistrar>;
        unregisterCallback: UnregisterCallback<RendererRegistrar>;
        unregisterCallbacks: UnregisterCallbacks<"Main", RendererRegistrar>;
        unregisterAll: () => void;
    };
