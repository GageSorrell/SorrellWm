/**
 * @file      Main.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { BrowserWindow, IpcMain, IpcRenderer } from "electron";
import type { EventOwner, MainOwner, RendererOwner } from "../Registrar/Registrar.Types";
/* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
import { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";
import type { Handler } from "../Handler/Handler.Types";
import type { IpcMainReactive } from "./Main.Types";
import type { Listener } from "../Listener";

export
/**
 * Type-safe form of {@link https://www.electronjs.org/docs/latest/api/ipc-main | ipcMain}.
 *
 * @note This is fully equivalent to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main | ipcMain}
 * at runtime, so it may safely be cast to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main | IpcMain}
 * if needed.
 */
const ipcMain: IpcMainReactive =
    {
        ...((): IpcMain =>
        {
            try
            {
                type ElectronMainModule = { ipcMain: IpcMain; };
                /* eslint-disable-next-line @typescript-eslint/no-require-imports */
                const ElectronMainModule: ElectronMainModule = require("electron/main");
                return ElectronMainModule.ipcMain;
            }
            catch
            {
                return { } as IpcMain;
            }
        })(),

        addListener: on,
        handle,
        handleOnce,
        off,
        on,
        once,
        removeListener: off,
        send
    };

/* eslint-disable @stylistic/max-len */

/**
 * The type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on}
 * or {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereronchannel-listener | IpcRenderer.on}
 * *et al.*
 */
type NativeEventListener<OwnerType extends EventOwner> =
    OwnerType extends MainOwner
        ? Parameters<IpcMain["on"]>[1]
        : OwnerType extends RendererOwner
            ? Parameters<IpcRenderer["on"]>[1]
            : never;

let __IpcMain: IpcMain | undefined = undefined;

/** @returns Electron's `ipcMain` module. */
function GetIpcMain(): IpcMain
{
    try
    {
        if (__IpcMain === undefined)
        {
            /* eslint-disable-next-line @typescript-eslint/no-require-imports */
            __IpcMain = require("electron/main").ipcMain;
        }

        return __IpcMain as IpcMain;
    }
    catch
    {
        /* eslint-disable-next-line @stylistic/max-len */
        throw new Error("Could not import ipcMain from electron/main.  Make sure that electron is installed as a dependency.");
    }
}

/**
 * @inheritdoc Handle:Signature
 * @group Internal
 */
export function handle<ChannelType extends Channel.Handler>(
    channel: ChannelType,
    handler: Handler<typeof channel>
): void
{
    GetIpcMain().handle(channel, handler);
}

/**
 * @inheritdoc RemoveHandler:Signature
 * @group Internal
 */
export function removeHandler<ChannelType extends Channel.Handler>(
    channel: ChannelType
): void
{
    GetIpcMain().removeHandler(channel);
}

/**
 * @inheritdoc HandleOnce:Signature
 * @group Internal
 */
export function handleOnce<
    ChannelType extends Channel.Handler>(
    channel: ChannelType,
    handler: Handler<typeof channel>
): void
{
    GetIpcMain().handleOnce(channel, handler);
}

/**
 * @inheritdoc Off:Signature
 * @group Internal
 */
export function off<ChannelType extends Channel.Listener<RendererOwner>>(
    channel: ChannelType,
    listener: Listener<RendererOwner, typeof channel>
): void
{
    GetIpcMain().off(channel, listener as NativeEventListener<MainOwner>);
}

/**
 * @inheritdoc RemoveAllListeners:Signature
 * @group Internal
 */
export function removeAllListeners<ChannelType extends Channel.Listener<RendererOwner>
>(
    channel?: ChannelType
): void
{
    GetIpcMain().removeAllListeners(channel);
}

/**
 * Subscribe a {@link listener} to an event declaration given by {@link channel},
 * which does *not* return a response to the `renderer`.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the sendable event to which the {@link listener} will be subscribed.
 * @param listener - The {@link MainListener} which will be subscribed to the given {@link channel}.
 */
export function on<ChannelType extends Channel.Listener<RendererOwner>>(
    channel: ChannelType,
    listener: Listener<RendererOwner, typeof channel>
): void
{
    GetIpcMain().on(channel, listener as NativeEventListener<MainOwner>);
}

/**
 * Subscribe a {@link listener} to an event declaration given by {@link channel},
 * which does *not* return a response to the `renderer`.  The {@link listener}
 * will be unsubscribed after it is called once.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the sendable event to which the {@link listener} will be subscribed.
 * @param listener - The {@link MainListener} which will be subscribed to the given {@link channel}.
 *
 * @group Internal
 */
export function once<ChannelType extends Channel.Listener<RendererOwner>>(
    channel: ChannelType,
    listener: Listener<RendererOwner, typeof channel>
): void
{
    GetIpcMain().once(channel, listener as NativeEventListener<MainOwner>);
}

/* eslint-disable @stylistic/max-len */

/**
 * Send an event to the `renderer`, whose event declaration does *not* define
 * a request type.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindow - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow}
 * to where the event will be sent.
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the event declaration.
 *
 * @group Internal
 */
export function send<ChannelType extends Channel.Listener.Without.Request<MainOwner>>(
    browserWindow: BrowserWindow,
    channel: ChannelType
): void;
/**
 * Send an event to the `renderer`, whose event declaration defines a request type.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindow - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow}
 * to where the event will be sent.
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the event declaration.
 * @param request - The request of the given event.
 *
 * @group Internal
 */
export function send<ChannelType extends Channel.Listener.With.Request<MainOwner>>(
    browserWindow: BrowserWindow,
    channel: ChannelType,
    request: Decl.Request<typeof channel, MainOwner>
): void;
/**
 * Send an event to multiple {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations do *not* define a request type.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
 * to where the event will be sent.
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @group Internal
 */
export function send<ChannelType extends Channel.Listener.Without.Request<MainOwner>>(
    browserWindows: Array<BrowserWindow>,
    channel: ChannelType
): void;
/**
 * Send an event to multiple {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations define a request type.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
 * to where the event will be sent.
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 * @param request - The request of the given event.
 *
 * @group Internal
 */
export function send<ChannelType extends Channel.Listener.With.Request<MainOwner>>(
    browserWindows: Array<BrowserWindow>,
    channel: ChannelType,
    request: Decl.Request<typeof channel, MainOwner>
): void;
/**
 * Send an event to all {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations do *not* define a request type.  This overload implicitly calls
 * {@link https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows | BrowserWindow.getAllWindows() }.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
 * to where the event will be sent.  If `undefined`, then all browser windows will be sent the event.
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @group Internal
 */
export function send<ChannelType extends Channel.Listener.Without.Request<MainOwner>>(
    browserWindows: undefined,
    channel: ChannelType
): void;
/**
 * Send an event to all {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations define a request type.  This overload implicitly calls
 * {@link https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows | BrowserWindow.getAllWindows() }.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
 * to where the event will be sent.  If `undefined`, then all browser windows will be sent the event.
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 * @param request - The request of the given event.
 *
 * @group Internal
 */
export function send<ChannelType extends Channel.Listener.With.Request<MainOwner>>(
    browserWindows: undefined,
    channel: ChannelType,
    request: Decl.Request<typeof channel, MainOwner>
): void;
/**
 * Send an event to a given
 * {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow or set of BrowserWindows}.
 *
 * @template ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
 * to where the event will be sent.  If `undefined`, then all browser windows will be sent the event.
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 * @param request - The overloaded request argument; it is {@link EmptyOverloadParameterValue} if
 * the event declaration has no request type.
 *
 * @group Internal
 */
export function send<ChannelType extends Channel.Listener<MainOwner>>(
    browserWindows: BrowserWindow | Array<BrowserWindow> | undefined,
    channel: ChannelType,
    request:
        | Decl.Request<typeof channel, MainOwner>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): void
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    function Send(BrowserWindow: BrowserWindow): void
    {
        if (request !== EmptyOverloadParameterValue)
        {
            BrowserWindow.webContents.send(channel, request);
        }
        else
        {
            BrowserWindow.webContents.send(channel);
        }
    }

    if (Array.isArray(browserWindows))
    {
        browserWindows.forEach(Send);
    }
    else if (browserWindows === undefined)
    {
        try
        {
            /* eslint-disable-next-line */
            const BrowserWindow = require("electron/main").BrowserWindow;
            BrowserWindow.getAllWindows().forEach(Send);
        }
        catch
        {
            /* eslint-disable-next-line @stylistic/max-len */
            throw new Error("Could not import BrowserWindow from electron/main.  Make sure that electron is installed as a dependency.");
        }
    }
    else
    {
        Send(browserWindows);
    }
}
