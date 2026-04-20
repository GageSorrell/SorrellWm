/**
 * @file      Provider.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IpcRenderer } from "electron/renderer";
import type { PropsWithChildren } from "react";

/* eslint-disable @stylistic/max-len */

/**
 * The context used in this package.  It currently only has one property, {@link ipcRenderer}.
 * See the documentation for the {@link ipcRenderer} property to see what is needed to
 * use `electron-reactive-event` in the `renderer`.
 */
export type ReactiveEventContext =
    {
        /**
         * Your app must use the {@link ReactiveEventProvider}, and supply
         * the necessary IPC functions from {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer }
         * (see note) exposed from a
         * {@link https://www.electronjs.org/docs/latest/tutorial/tutorial-preload#what-is-a-preload-script | preload script}.
         *
         * @note It is generally discouraged to expose the raw IPC functions; instead, consider exposing functions
         * that wrap the IPC functions, which do not forward calls that seem unusual.
         *
         * @property invoke - The {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args | invoke } function.
         * @property off - The {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereroffchannel-listener | off } function.
         * @property on - The {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereronchannel-listener | on } function.
         * @property once - The {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendereroncechannel-listener | once } function.
         * @property send - The {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrenderersendchannel-args | send } function.
         */
        ipcRenderer: Pick<IpcRenderer,
            | "invoke"
            | "off"
            | "on"
            | "once"
            | "send">;
    };

/**
 * This wraps your application; it accepts the the necessary IPC functions from
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer }
 * that you must expose (see note) via a
 * {@link https://www.electronjs.org/docs/latest/tutorial/tutorial-preload#what-is-a-preload-script | preload script}.
 *
 * @note It is generally discouraged to expose the raw IPC functions; instead, consider exposing functions
 * that wrap the IPC functions, which do not forward calls that seem unusual.
 *
 * @property value - The object containing the necessary {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer }
 * functions, exposed via a preload script (see {@link /guides/getting-started} for more details).
 */
export type ReactiveEventProviderProps = PropsWithChildren<{ value?: ReactiveEventContext; }>;
