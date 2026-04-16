/* File:      Main.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { BrowserWindow, IpcMain, IpcRenderer } from "electron";
import type { EventOwner, MainOwner, PackageKeys, RendererOwner } from "../Internal";
/* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
import { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { EmptyOverloadParameter } from "../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../Listener/Listener.Internal";
import type { Handler } from "../Handler/Handler.Types";
import type { Listener } from "../Listener";

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
export function handle<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler<PackageKey>>(
    channel: ChannelType,
    handler: Handler<PackageKey, typeof channel>
): void
{
    GetIpcMain().handle(channel, handler);
}

/**
 * @inheritdoc RemoveHandler:Signature
 * @group Internal
 */
export function removeHandler<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler<PackageKey>>(
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
    /* eslint-enable @stylistic/max-len */
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler<PackageKey>>(
    channel: ChannelType,
    handler: Handler<PackageKey, typeof channel>
): void
{
    GetIpcMain().handleOnce(channel, handler);
}

/**
 * @inheritdoc Off:Signature
 * @group Internal
 */
export function off<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, typeof channel>
): void
{
    GetIpcMain().off(channel, listener as NativeEventListener<MainOwner>);
}

/**
 * @inheritdoc RemoveAllListeners:Signature
 * @group Internal
 */
export function removeAllListeners<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener<PackageKey, RendererOwner>
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
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the sendable event to which the {@link listener} will be subscribed.
 * @param listener - The {@link MainListener} which will be subscribed to the given {@link channel}.
 *
 * @group Internal
 */
export function on<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, typeof channel>
): void
{
    GetIpcMain().on(channel, listener as NativeEventListener<MainOwner>);
}

/**
 * Subscribe a {@link listener} to an event declaration given by {@link channel},
 * which does *not* return a response to the `renderer`.  The {@link listener}
 * will be unsubscribed after it is called once.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the sendable event to which the {@link listener} will be subscribed.
 * @param listener - The {@link MainListener} which will be subscribed to the given {@link channel}.
 *
 * @group Internal
 */
export function once<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener<PackageKey, RendererOwner>>(
    channel: ChannelType,
    listener: Listener<PackageKey, RendererOwner, typeof channel>
): void
{
    GetIpcMain().once(channel, listener as NativeEventListener<MainOwner>);
}

/* eslint-disable @stylistic/max-len */

/**
 * Send an event to the `renderer`, whose event declaration does *not* define
 * a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindow - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow}
 * to where the event will be sent.
 * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
 * identifies the event declaration.
 *
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Without.Request<PackageKey, MainOwner>>(
    browserWindow: BrowserWindow,
    channel: ChannelType
): void;
/**
 * Send an event to the `renderer`, whose event declaration defines a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
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
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.With.Request<PackageKey, MainOwner>>(
    browserWindow: BrowserWindow,
    channel: ChannelType,
    request: Decl.Request<PackageKey, typeof channel, MainOwner>
): void;
/**
 * Send an event to multiple {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations do *not* define a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
 * to where the event will be sent.
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Without.Request<PackageKey, MainOwner>>(
    browserWindows: Array<BrowserWindow>,
    channel: ChannelType
): void;
/**
 * Send an event to multiple {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations define a request type.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
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
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.With.Request<PackageKey, MainOwner>>(
    browserWindows: Array<BrowserWindow>,
    channel: ChannelType,
    request: Decl.Request<PackageKey, typeof channel, MainOwner>
): void;
/**
 * Send an event to all {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations do *not* define a request type.  This overload implicitly calls
 * {@link https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows | BrowserWindow.getAllWindows() }.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
 * to where the event will be sent.  If `undefined`, then all browser windows will be sent the event.
 * @param channel - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @group Internal
 */
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Without.Request<PackageKey, MainOwner>>(
    browserWindows: undefined,
    channel: ChannelType
): void;
/**
 * Send an event to all {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
 * whose event declarations define a request type.  This overload implicitly calls
 * {@link https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows | BrowserWindow.getAllWindows() }.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
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
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.With.Request<PackageKey, MainOwner>>(
    browserWindows: undefined,
    channel: ChannelType,
    request: Decl.Request<PackageKey, typeof channel, MainOwner>
): void;
/**
 * Send an event to a given
 * {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow or set of BrowserWindows}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
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
export function send<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener<PackageKey, MainOwner>>(
    browserWindows: BrowserWindow | Array<BrowserWindow> | undefined,
    channel: ChannelType,
    request:
        | Decl.Request<PackageKey, typeof channel, MainOwner>
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
