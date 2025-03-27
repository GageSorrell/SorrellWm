/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

/* eslint-disable */

import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { HWindow, FHexColor } from "@sorrellwm/windows";
import type { FIpcChannel } from "#/Event.Types";

const ElectronHandler =
{
    ipcRenderer:
    {
        On(Channel: FIpcChannel, Listener: ((...Arguments: Array<unknown>) => void))
        {
            const subscription = (_event: IpcRendererEvent, ...args: Array<unknown>) =>
            {
                return Listener(...args);
            };

            ipcRenderer.on(Channel, subscription);

            return () =>
            {
                ipcRenderer.removeListener(Channel, subscription);
            };
        },
        Once(Channel: FIpcChannel, Listener: ((...Arguments: Array<unknown>) => void)): void
        {
            ipcRenderer.once(
                Channel,
                (_Event: Electron.Event, ..._Arguments: Array<unknown>) => Listener(..._Arguments)
            );
        },
        RemoveListener(Channel: FIpcChannel, Listener: ((...Arguments: Array<unknown>) => void)): void
        {
            ipcRenderer.removeListener(Channel, Listener);
        },
        SendMessage(Channel: FIpcChannel, ...Arguments: Array<unknown>)
        {
            ipcRenderer.send(Channel, ...Arguments);
        }
    },
    GetFocusedWindow: async (): Promise<HWindow> => ipcRenderer.invoke("GetFocusedWindow"),
    GetIsLightMode: async (): Promise<boolean> => ipcRenderer.invoke("GetIsLightMode"),
    GetThemeColor: async (): Promise<FHexColor> => ipcRenderer.invoke("GetThemeColor")
};

contextBridge.exposeInMainWorld("electron", ElectronHandler);

export type FElectronHandler = typeof ElectronHandler;


