/* File:      Factory.Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-function-type */

import { type BrowserWindow, type IpcMainInvokeEvent, ipcMain } from "electron";
import type {
    Callback,
    CallbackRecord,
    CallbackReturn,
    MainEventFactoryReturn,
    NoRequestChannel,
    Request,
    RequestChannel,
    Response } from "./index.js";
import type { Channel, ResponseInternal } from "./Internal/index.js";
import { GetResponseChannel } from "./index.js";

export const GetMainFunctions = <MainRegistrar, RendererRegistrar>(
): MainEventFactoryReturn<MainRegistrar, RendererRegistrar> =>
{
    type CallbackWrapper = Parameters<typeof ipcMain.handle>[1];
    type StoredCallback =
        {
            Original: Function;
            Wrapper: CallbackWrapper
        };

    const Callbacks: Map<string, Array<StoredCallback>> = new Map<string, Array<StoredCallback>>();

    type SendEventChannel =
        | RequestChannel<MainRegistrar>
        | NoRequestChannel<MainRegistrar>;

    type SendEventReturn<
        ChannelType extends SendEventChannel,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    > =
        WindowType extends Array<BrowserWindow>
            ? Array<Response<ChannelType, MainRegistrar>>
            : Response<ChannelType, MainRegistrar>;

    async function SendEvent<ChannelType extends RequestChannel<MainRegistrar>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        Request: Request<typeof Channel, MainRegistrar>,
        BrowserWindows: WindowType
    ): Promise<SendEventReturn<ChannelType, WindowType>>;
    async function SendEvent<ChannelType extends NoRequestChannel<MainRegistrar>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        BrowserWindows: WindowType
    ): Promise<SendEventReturn<ChannelType, WindowType>>;
    async function SendEvent<ChannelType extends SendEventChannel,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        RequestBrowserWindows: WindowType | Request<typeof Channel, MainRegistrar>,
        InBrowserWindows?: WindowType
    ): Promise<SendEventReturn<ChannelType, WindowType>>
    {
        type ThisRequest = [ Request<typeof Channel, MainRegistrar> ] extends [ never ]
            ? undefined
            : Request<typeof Channel, MainRegistrar>;

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

        type BrowserResponse = Response<ChannelType, MainRegistrar>;
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

    function registerCallback<ChannelType extends Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Callback: Callback<typeof Channel, RendererRegistrar>
    ): void
    {
        ipcMain.removeHandler(Channel);

        type WrapperReturnType = Awaited<CallbackReturn<ChannelType, RendererRegistrar>>;
        const Wrapper = async (_Event: IpcMainInvokeEvent, Request: unknown): Promise<ResponseInternal> =>
        {
            const Response: WrapperReturnType =
                await Callback(Request as Request<typeof Channel, RendererRegistrar>);
            if (Response !== undefined)
            {
                return "Data" in Response
                    ? {
                        Data: Response.Data,
                        Error: "Error" in Response
                            ? Response.Error
                            : undefined
                    }
                    : {
                        Error: "Error" in Response
                            ? Response.Error
                            : undefined
                    };
            }
            else
            {
                // ReturnType was `void`, which corresponds to returning
                // no `Error` (so successful), and also no `Data`.
                return {
                    Data: undefined,
                    Error: undefined
                };
            }
        };

        ipcMain.handle(Channel, Wrapper);
    }

    function unregisterCallback<ChannelType extends Channel<RendererRegistrar>>(
        Channel: ChannelType
    ): void
    {
        ipcMain.removeHandler(Channel);
    }

    return {
        registerCallback,
        registerCallbacks: <ChannelType extends Channel<RendererRegistrar>>(
            Record: CallbackRecord<ChannelType, RendererRegistrar>
        ): void =>
        {
            if (Callbacks === undefined)
            {
                return;
            }

            Object.entries(Record).forEach(([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: Callback<ChannelType, RendererRegistrar> =
                    InCallback as Callback<ChannelType, RendererRegistrar>;

                registerCallback(Channel, Callback);
            });
        },
        send: SendEvent,
        unregisterAll: (): void =>
        {
            ipcMain.removeAllListeners();
        },
        unregisterCallback: unregisterCallback,
        unregisterCallbacks: <ChannelType extends Channel<RendererRegistrar>>(
            Record: CallbackRecord<ChannelType, RendererRegistrar>
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
