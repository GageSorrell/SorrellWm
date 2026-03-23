/* File:      Factory.Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type BrowserWindow, type IpcMainInvokeEvent, ipcMain } from "electron";
import type {
    FResponseInternal,
    TCallback,
    TCallbackReturnType,
    TChannel,
    TChannelsNoRequest,
    TChannelsWithRequest,
    TRequest,
    TResponse } from "./Internal/index.js";
import type { TCallbackRecord, TMainEventFactoryReturnType } from "./Factory.Types.js";
import { GetResponseChannel } from "./Factory.js";

export const GetMainFunctions = <MainEventRegistrarType, RendererEventRegistrarType>(
): TMainEventFactoryReturnType<MainEventRegistrarType, RendererEventRegistrarType> =>
{
    type FStoredCallback =
    {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
        Original: Function;
        Wrapper: Parameters<typeof ipcMain.handle>[1];
    };

    const Callbacks: Map<string, Array<FStoredCallback>> = new Map<string, Array<FStoredCallback>>();

    type FSendEventChannelType =
        | TChannelsWithRequest<MainEventRegistrarType>
        | TChannelsNoRequest<MainEventRegistrarType>;

    type TSendEventReturnType<
        ChannelType extends FSendEventChannelType,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    > =
        WindowType extends Array<BrowserWindow>
            ? Array<TResponse<ChannelType, MainEventRegistrarType>>
            : TResponse<ChannelType, MainEventRegistrarType>;

    async function SendEvent<ChannelType extends TChannelsWithRequest<MainEventRegistrarType>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        Request: TRequest<typeof Channel, MainEventRegistrarType>,
        BrowserWindows: WindowType
    ): Promise<TSendEventReturnType<ChannelType, WindowType>>;
    async function SendEvent<ChannelType extends TChannelsNoRequest<MainEventRegistrarType>,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        BrowserWindows: WindowType
    ): Promise<TSendEventReturnType<ChannelType, WindowType>>;
    async function SendEvent<ChannelType extends FSendEventChannelType,
        WindowType extends BrowserWindow | Array<BrowserWindow>
    >(
        Channel: ChannelType,
        RequestBrowserWindows: WindowType | TRequest<typeof Channel, MainEventRegistrarType>,
        InBrowserWindows?: WindowType
    ): Promise<TSendEventReturnType<ChannelType, WindowType>>
    {
        type FRequest = [ TRequest<typeof Channel, MainEventRegistrarType> ] extends [ never ]
            ? undefined
            : TRequest<typeof Channel, MainEventRegistrarType>;

        type FArguments =
        {
            BrowserWindows: Array<BrowserWindow>;
            Request: FRequest;
        };

        const GetOverloadedArguments = (): FArguments =>
        {
            if (InBrowserWindows === undefined)
            {
                const Request: FRequest = undefined as FRequest;
                const BrowserWindows: FArguments["BrowserWindows"] =
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
                    Request: RequestBrowserWindows as FArguments["Request"]
                };
            }
        };

        const { BrowserWindows, Request } = GetOverloadedArguments();

        type FBrowserResponse = TResponse<ChannelType, MainEventRegistrarType>;
        const SendBrowserEvent = async (
            InBrowserWindow: BrowserWindow
        ): Promise<FBrowserResponse> =>
        {
            return new Promise<FBrowserResponse>((
                Resolve: ((Value: FBrowserResponse) => void),
                _Reject: ((_: unknown) => void)
            ): void =>
            {
                const OnResponse = async (Response: unknown): Promise<void> =>
                {
                    Resolve(Response as FBrowserResponse);
                };

                ipcMain.on(GetResponseChannel(Channel), OnResponse);
                InBrowserWindow.webContents.send(Channel, Request);
            });
        };

        const Results: Array<FBrowserResponse> = await Promise.all(BrowserWindows.map(SendBrowserEvent));
        const Out: unknown = Results.length === 1
            ? Results[0]
            : Results;

        return Out as TSendEventReturnType<ChannelType, WindowType>;
    }

    function RegisterCallback<ChannelType extends TChannel<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Callback: TCallback<typeof Channel, RendererEventRegistrarType>
    ): void
    {
        ipcMain.removeHandler(Channel);

        type FWrapperReturnType = Awaited<TCallbackReturnType<ChannelType, RendererEventRegistrarType>>;
        const Wrapper = async (_Event: IpcMainInvokeEvent, Request: unknown): Promise<FResponseInternal> =>
        {
            const Response: FWrapperReturnType =
                await Callback(Request as TRequest<typeof Channel, RendererEventRegistrarType>);
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

    function UnregisterCallback<ChannelType extends TChannel<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): void
    {
        ipcMain.removeHandler(Channel);
    }

    return {
        RegisterCallback,
        RegisterCallbacks: <ChannelType extends TChannel<RendererEventRegistrarType>>(
            Record: TCallbackRecord<ChannelType, RendererEventRegistrarType>
        ): void =>
        {
            if (Callbacks === undefined)
            {
                return;
            }

            Object.entries(Record).forEach(([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: TCallback<ChannelType, RendererEventRegistrarType> =
                    InCallback as TCallback<ChannelType, RendererEventRegistrarType>;

                RegisterCallback(Channel, Callback);
            });
        },
        SendEvent,
        UnregisterAll: (): void =>
        {
            ipcMain.removeAllListeners();
        },
        UnregisterCallback,
        UnregisterCallbacks: <ChannelType extends TChannel<RendererEventRegistrarType>>(
            Record: TCallbackRecord<ChannelType, RendererEventRegistrarType>
        ): void =>
        {
            const UnregisterEntry = ([ InChannel /* , InCallback */ ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                // const Callback: TCallback<typeof Channel, RendererEventRegistrarType> =
                //     InCallback as TCallback<typeof Channel, RendererEventRegistrarType>;

                UnregisterCallback(Channel);
            };

            Object.entries(Record).forEach(UnregisterEntry);
        }
    };
};
