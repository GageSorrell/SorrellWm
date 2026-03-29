/* File:      Factory.Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-function-type */

import type * as Main from "./Main.Types.js";
import { type BrowserWindow, type IpcMainInvokeEvent, ipcMain } from "electron";
import type { Callback, Channel, Event } from "../index.js";
import { GetResponseChannel } from "../Utility.js";
import type { Internal } from "../Internal/index.js";
import type { Shared } from "../Shared/index.js";

export const GetMainReactiveEventFunctions = <
    MainRegistrar extends Shared.Registrar.IMainRegistrarBase,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(
): Main.FactoryReturnType<MainRegistrar, RendererRegistrar> =>
{
    type CallbackWrapper = Parameters<typeof ipcMain.handle>[1];
    type StoredCallback =
        {
            Original: Function;
            Wrapper: CallbackWrapper
        };

    const Callbacks: Map<string, Array<StoredCallback>> = new Map<string, Array<StoredCallback>>();

    type SendEventChannel =
        | Channel.Request<MainRegistrar>
        | Channel.NoRequest<MainRegistrar>;

    type SendEventReturn<
        ChannelType extends SendEventChannel,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    > =
        WindowType extends Array<BrowserWindow>
            ? Array<Event.Response<ChannelType, MainRegistrar>>
            : Event.Response<ChannelType, MainRegistrar>;

    async function SendEvent<ChannelType extends Channel.Request<MainRegistrar>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        Request: Event.Request<typeof Channel, MainRegistrar>,
        BrowserWindows: WindowType
    ): Promise<SendEventReturn<ChannelType, WindowType>>;
    async function SendEvent<ChannelType extends Channel.NoRequest<MainRegistrar>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        BrowserWindows: WindowType
    ): Promise<SendEventReturn<ChannelType, WindowType>>;
    async function SendEvent<ChannelType extends SendEventChannel,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        RequestBrowserWindows: WindowType | Event.Request<typeof Channel, MainRegistrar>,
        InBrowserWindows?: WindowType
    ): Promise<SendEventReturn<ChannelType, WindowType>>
    {
        type ThisRequest = [ Event.Request<typeof Channel, MainRegistrar> ] extends [ never ]
            ? undefined
            : Event.Request<typeof Channel, MainRegistrar>;

        type Arguments =
            {
                BrowserWindows: Array<BrowserWindow>;
                Request: ThisRequest;
            };

        const GetOverloadedArguments = (): Arguments =>
        {
            if (InBrowserWindows === undefined)
            {
                const Request: ThisRequest = undefined as ThisRequest;
                const BrowserWindows: Arguments["BrowserWindows"] =
                    Array.isArray(RequestBrowserWindows)
                        ? RequestBrowserWindows
                        : [ RequestBrowserWindows as BrowserWindow ];
                return {
                    BrowserWindows,
                    Request
                };
            }
            else
            {
                return {
                    BrowserWindows: Array.isArray(InBrowserWindows)
                        ? InBrowserWindows
                        : [ InBrowserWindows ],
                    Request: RequestBrowserWindows as Arguments["Request"]
                };
            }
        };

        const { BrowserWindows, Request } = GetOverloadedArguments();

        type BrowserResponse = Event.Response<ChannelType, MainRegistrar>;
        const SendBrowserEvent = async (
            InBrowserWindow: BrowserWindow
        ): Promise<BrowserResponse> =>
        {
            return new Promise<BrowserResponse>((
                Resolve: ((Value: BrowserResponse) => void),
                _Reject: ((_: unknown) => void)
            ): void =>
            {
                const OnResponse = async (Response: unknown): Promise<void> =>
                {
                    Resolve(Response as BrowserResponse);
                };

                ipcMain.on(GetResponseChannel(Channel), OnResponse);
                InBrowserWindow.webContents.send(Channel, Request);
            });
        };

        const Results: Array<BrowserResponse> = await Promise.all(BrowserWindows.map(SendBrowserEvent));
        const Out: unknown = Results.length === 1
            ? Results[0]
            : Results;

        return Out as SendEventReturn<ChannelType, WindowType>;
    }

    function registerCallback<ChannelType extends Channel.Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Callback: Callback.Main<typeof Channel, RendererRegistrar>
    ): void
    {
        ipcMain.removeHandler(Channel);

        type WrapperReturnType = Main.Response<typeof Channel, RendererRegistrar>;

        const Wrapper = async (Event: IpcMainInvokeEvent, InRequest: unknown): Promise<WrapperReturnType> =>
        {
            type ThisCallbackArgument = Internal.Callback.Argument.Main<typeof Channel, RendererRegistrar>;
            type ThisRequest = Event.Request<typeof Channel, RendererRegistrar>;
            const Request: ThisRequest = InRequest as ThisRequest;
            const CallbackArgument: ThisCallbackArgument =
                {
                    Event,
                    Request
                };

            const CallbackCast: Internal.Callback.Main<typeof Channel, RendererRegistrar> =
                Callback as Internal.Callback.Main<typeof Channel, RendererRegistrar>;

            type ThisResponse = Callback.ReturnType<typeof Channel, RendererRegistrar>;
            type ThisResponseError = Callback.ReturnType.Error<typeof Channel, RendererRegistrar>;
            const Response: ThisResponse =
                await CallbackCast(CallbackArgument) as ThisResponse;

            const IsResponseError = (In: unknown): In is ThisResponseError =>
            {
                return (
                    typeof Response === "object" &&
                    Response !== null &&
                    "Error" in Response &&
                    typeof Response.Error === "object"
                );
            };

            if (IsResponseError(Response))
            {
                return {
                    Data: undefined,
                    Error: (Response as Callback.ReturnType.Error<typeof Channel, RendererRegistrar>)
                } as WrapperReturnType;
            }
            else
            {
                return {
                    Data: Response,
                    Error: undefined
                } as WrapperReturnType;
            }
        };

        ipcMain.handle(Channel, Wrapper);
    }

    function unregisterCallback<ChannelType extends Channel.Channel<RendererRegistrar>>(
        Channel: ChannelType
    ): void
    {
        ipcMain.removeHandler(Channel);
    }

    return {
        registerCallback,
        registerCallbacks: <ChannelType extends Channel.Channel<RendererRegistrar>>(
            Record: Callback.Record<ChannelType, RendererRegistrar>
        ): void =>
        {
            if (Callbacks === undefined)
            {
                return;
            }

            Object.entries(Record).forEach(([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: Callback.Main<typeof Channel, RendererRegistrar> =
                    InCallback as Callback.Main<typeof Channel, RendererRegistrar>;

                registerCallback(Channel, Callback);
            });
        },
        send: SendEvent,
        unregisterAll: (): void =>
        {
            ipcMain.removeAllListeners();
        },
        unregisterCallback: unregisterCallback,
        unregisterCallbacks: <ChannelType extends Channel.Channel<RendererRegistrar>>(
            Record: Callback.Record<ChannelType, RendererRegistrar>
        ): void =>
        {
            const UnregisterEntry = ([ InChannel /* , InCallback */ ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                unregisterCallback(Channel);
            };

            Object.entries(Record).forEach(UnregisterEntry);
        }
    };
};
