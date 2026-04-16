/* File:      Main.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { BrowserWindow, IpcMain } from "electron/main";
import type { MainOwner, PackageKeys, RendererOwner } from "../Internal";
import type { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { Handler } from "../Handler/Handler.Types";
import type { Listener } from "../Listener";

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener | IpcMain.handle}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type Handle<PackageKey extends PackageKeys> =
    {
        /**
         * Subscribe a {@link handler} to an event declaration given by {@link channel},
         * which returns a response to the `renderer`.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The {@link Channel.Handler.Any | invokable channel} that uniquely
         * identifies the invokable event to which the {@link handler} will be subscribed.
         * @param handler - The callback which will be subscribed to the given {@link channel}.
         *
         * {@label Signature}
         */
        <ChannelType extends Channel.Handler<PackageKey>>(
            channel: ChannelType,
            handler: Handler<PackageKey, typeof channel>
        ): void;
    };

/**
 * The type-safe form of {@link IpcMain.send}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type Send<PackageKey extends PackageKeys> =
    {
        /* eslint-disable @stylistic/max-len */

        /**
         * Send an event to the `renderer`, whose event declaration does *not* define
         * a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param browserWindow - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow}
         * to where the event will be sent.
         * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
         * identifies the event declaration.
         */
        <ChannelType extends Channel.Listener.Without.Request<PackageKey, MainOwner>>(
            browserWindow: BrowserWindow,
            channel: ChannelType
        ): void;

        /**
         * Send an event to the `renderer`, whose event declaration defines a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param browserWindow - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindow}
         * to where the event will be sent.
         * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
         * identifies the event declaration.
         * @param request - The request of the given event.
         */
        <ChannelType extends Channel.Listener.With.Request<PackageKey, MainOwner>>(
            browserWindow: BrowserWindow,
            channel: ChannelType,
            request: Decl.Request<PackageKey, typeof channel, MainOwner>
        ): void;

        /**
         * Send an event to multiple {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
         * whose event declarations do *not* define a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
         * to where the event will be sent.
         * @param channel - The channel that uniquely identifies the desired
         * event declaration.
         */
        <ChannelType extends Channel.Listener.Without.Request<PackageKey, MainOwner>>(
            browserWindows: Array<BrowserWindow>,
            channel: ChannelType
        ): void;

        /**
         * Send an event to multiple {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
         * whose event declarations define a request type.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
         * to where the event will be sent.
         * @param channel - The channel that uniquely identifies the desired
         * event declaration.
         * @param request - The request of the given event.
         */
        <ChannelType extends Channel.Listener.With.Request<PackageKey, MainOwner>>(
            browserWindows: Array<BrowserWindow>,
            channel: ChannelType,
            request: Decl.Request<PackageKey, typeof channel, MainOwner>
        ): void;

        /**
         * Send an event to all {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
         * whose event declarations do *not* define a request type.  This overload implicitly calls
         * {@link https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows | BrowserWindow.getAllWindows() }.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
         * to where the event will be sent.  If `undefined`, then all browser windows will be sent the event.
         * @param channel - The channel that uniquely identifies the desired
         * event declaration.
         */
        <ChannelType extends Channel.Listener.Without.Request<PackageKey, MainOwner>>(
            browserWindows: undefined,
            channel: ChannelType
        ): void;

        /**
         * Send an event to all {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows},
         * whose event declarations define a request type.  This overload implicitly calls
         * {@link https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows | BrowserWindow.getAllWindows() }.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param browserWindows - The {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}
         * to where the event will be sent.  If `undefined`, then all browser windows will be sent the event.
         * @param channel - The channel that uniquely identifies the desired
         * event declaration.
         * @param request - The request of the given event.
         */
        <ChannelType extends Channel.Listener.With.Request<PackageKey, MainOwner>>(
            browserWindows: undefined,
            channel: ChannelType,
            request: Decl.Request<PackageKey, typeof channel, MainOwner>
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type On<PackageKey extends PackageKeys> =
    {
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
         */
        <ChannelType extends Channel.Listener<PackageKey, RendererOwner>>(
            channel: ChannelType,
            listener: MainListener<PackageKey, typeof channel>
        ): void;
    };

/**
 * The type-safe type of the listener passed to
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on}
 * *et al.*
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired event declaration.
 */
export type MainListener<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener<PackageKey, RendererOwner>
> = Listener<PackageKey, RendererOwner, ChannelType>;

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoncechannel-listener | IpcMain.once}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type Once<PackageKey extends PackageKeys> =
    {
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
         */
        <ChannelType extends Channel.Listener<PackageKey, RendererOwner>>(
            channel: ChannelType,
            listener: MainListener<PackageKey, typeof channel>
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoffchannel-listener | IpcMain.off}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type Off<PackageKey extends PackageKeys> =
    {
        /**
         * Unsubscribe a {@link listener} from an event declaration given by {@link channel}.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired event declaration.
         *
         * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely
         * identifies the sendable event to which the {@link listener} will be subscribed.
         * @param listener - The {@link MainListener} which will be unsubscribed from the given
         * {@link channel}.
         *
         * {@label Signature}
         */
        <ChannelType extends Channel.Listener<PackageKey, RendererOwner>>(
            channel: ChannelType,
            listener: MainListener<PackageKey, typeof channel>
        ): void;
    };

/* eslint-disable @stylistic/max-len */

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandleoncechannel-listener | IpcMain.handleOnce}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type HandleOnce<PackageKey extends PackageKeys> =
    {
        /**
         * Subscribe a {@link listener} to an event declaration given by {@link channel}.
         * The {@link listener} will be unsubscribed after being invoked once.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         *
         * @param channel - The {@link Channel.Handler.Any | invokable channel} that uniquely
         * identifies the invokable event to which the {@link listener} will be subscribed.
         * @param listener - The {@link Handler} which will be subscribed to the given {@link channel}.
         *
         * {@label Signature}
         */
        <ChannelType extends Channel.Handler<PackageKey>>(
            channel: ChannelType,
            listener: Handler<PackageKey, typeof channel>
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovealllistenerschannel | IpcMain.removeAllListeners}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type RemoveAllListeners<PackageKey extends PackageKeys> =
    {
        /**
         * Remove all listeners of the given {@link channel}.
         * If no {@link channel} is specified, then *all* listeners of all channels
         * will be unsubscribed.
         *
         * @param channel - The {@link Channel.Listener.Any | sendable channel} that uniquely identifies
         * the event declaration from which all currently-subscribed listeners will be unsubscribed.
         *
         * {@label Signature}
         */
        <ChannelType extends Channel.Listener<PackageKey, RendererOwner>>(
            channel?: ChannelType
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovehandlerchannel | IpcMain.removeHandler}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type RemoveHandler<PackageKey extends PackageKeys> =
    {
        /**
         * Remove the handler (listener) of the given {@link channel}, if one exists.
         *
         * @param channel - The {@link Channel.Handler.Any | invokable channel} that uniquely identifies
         * the event declaration from which the handler will be unsubscribed, if one exists.
         *
         * {@label Signature}
         */
        <ChannelType extends Channel.Handler<PackageKey>>(
            channel: ChannelType
        ): void;
    };

/**
 * Type-safe IPC functions for working with events in `main`.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 *
 * @property addListener - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainaddlistenerchannel-listener | IpcMain.addListener }
 * @property handle - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener | IpcMain.handle }
 * @property handleOnce - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandleoncechannel-listener | IpcMain.handleOnce }
 * @property off - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoffchannel-listener | IpcMain.off }
 * @property on - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener | IpcMain.on }
 * @property once - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoncechannel-listener | IpcMain.once }
 * @property removeHandler - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovehandlerchannel | IpcMain.removeHandler }
 * @property removeListener - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovelistenerchannel-listener | IpcMain.removeListener }
 * @property removeAllListeners - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovealllistenerschannel | IpcMain.removeAllListeners }
 * @property send - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/web-contents#contentssendchannel-args | webContents.send } for one or many {@link https://www.electronjs.org/docs/latest/api/browser-window | BrowserWindows}.
 */
export type ReactiveIpcMainFunctions<PackageKey extends PackageKeys> =
    Readonly<{
        addListener: On<PackageKey>;
        handle: Handle<PackageKey>;
        handleOnce: HandleOnce<PackageKey>;
        off: Off<PackageKey>;
        on: On<PackageKey>;
        once: Once<PackageKey>;
        removeHandler: RemoveHandler<PackageKey>;
        removeListener: Off<PackageKey>;
        removeAllListeners: RemoveAllListeners<PackageKey>;
        send: Send<PackageKey>;
    }>;

/**
 * The {@link https://www.electronjs.org/docs/latest/api/ipc-main | IpcMain} type, but with the type-safe IPC functions
 * given in {@link ReactiveIpcMainFunctions}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type IpcMainReactive<PackageKey extends PackageKeys> =
    Omit<IpcMain, keyof ReactiveIpcMainFunctions<PackageKey>> &
    ReactiveIpcMainFunctions<PackageKey>;
