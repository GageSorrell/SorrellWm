/* File:      Main.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { BrowserWindow } from "electron/main";
import type {
    NoRequestChannel,
    RegisterCallback,
    RegisterCallbacks,
    Request,
    RequestChannel,
    Response,
    UnregisterCallback,
    UnregisterCallbacks } from "./index.js";

export type SendEventReturn<
    ChannelType extends RequestChannel<Registrar> | NoRequestChannel<Registrar>,
    WindowType extends BrowserWindow | Array<BrowserWindow>,
    Registrar
> =
    WindowType extends Array<BrowserWindow>
        ? Array<Response<ChannelType, Registrar>>
        : Response<ChannelType, Registrar>;

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

export type MainEventFactoryReturn<MainRegistrar, RendererRegistrar> =
    {
        registerCallback: RegisterCallback<RendererRegistrar>;
        registerCallbacks: RegisterCallbacks<RendererRegistrar>;
        send: Send<MainRegistrar>;
        unregisterCallback: UnregisterCallback<RendererRegistrar>;
        unregisterCallbacks: UnregisterCallbacks<RendererRegistrar>;
        unregisterAll: () => void;
    };
