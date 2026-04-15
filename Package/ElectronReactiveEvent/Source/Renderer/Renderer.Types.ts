/* File:      Renderer.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PackageKeys, RendererOwner } from "../Registrar";
import type { Channel } from "../Channel";
import type { IpcRenderer } from "electron/renderer";
import type { ListenerRequest } from "../Listener";
import type { RendererListener } from "./Hook";

/* eslint-disable @stylistic/max-len */

/**
 * Type-safe IPC functions for working with events in the `renderer` iff you are *not*
 * using `react` in the `renderer` (otherwise, use {@link ReactiveEventProvider} *et al.*).
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 *
 * @property addListener - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereraddlistenerchannel-listener | IpcRenderer.addListener }
 * @property off - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereroffchannel-listener | IpcRenderer.off }
 * @property on - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereronchannel-listener | IpcRenderer.on }
 * @property once - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereroncechannel-listener | IpcRenderer.once }
 * @property removeListener - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererremovelistenerchannel-listener | IpcRenderer.removeListener }
 * @property removeAllListeners - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererremovealllistenerschannel | IpcRenderer.removeAllListeners }
 * @property send - Type-safe equivalent of {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrenderersend | IpcRenderer.send }
 */
export type ReactiveIpcRendererFunctions<PackageKey extends PackageKeys> =
    Readonly<{
        off: Off<PackageKey>;
        on: On<PackageKey>;
        once: Once<PackageKey>;
        send: Send<PackageKey>;
    }>;

/* eslint-disable @stylistic/max-len */

/**
 * The type-safe form of {@link IpcRenderer.send}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type Send<PackageKey extends PackageKeys> =
    {

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
        <ChannelType extends Channel.Listener.NoRequest<PackageKey, RendererOwner>>(
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
        <ChannelType extends Channel.Listener.Request<PackageKey, RendererOwner>>(
            channel: ChannelType,
            request: ListenerRequest<PackageKey, RendererOwner, typeof channel>
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereronchannel-listener | IpcRenderer.on}.
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
         * @param listener - The {@link RendererListener} which will be subscribed to the given {@link channel}.
         */
        <ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereroncechannel-listener | IpcRenderer.once}.
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
         * @param listener - The {@link RendererListener} which will be subscribed to the given {@link channel}.
         */
        <ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereroffchannel-listener | IpcRenderer.off}.
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
         * @param listener - The {@link RendererListener} which will be unsubscribed from the given
         * {@link channel}.
         *
         * {@label Signature}
         */
        <ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
            channel: ChannelType,
            listener: RendererListener<PackageKey, typeof channel>
        ): void;
    };

/**
 * The type-safe form of
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererremovealllistenerschannel | IpcRenderer.removeAllListeners}.
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
        <ChannelType extends Channel.Listener.Any<PackageKey, RendererOwner>>(
            channel?: ChannelType
        ): void;
    };

/**
 * The {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer} type, but with the type-safe IPC functions
 * given in {@link ReactiveIpcRendererFunctions}.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 */
export type IpcRendererReactive<PackageKey extends PackageKeys> =
    Omit<IpcRenderer, keyof ReactiveIpcRendererFunctions<PackageKey>> &
    ReactiveIpcRendererFunctions<PackageKey>;
