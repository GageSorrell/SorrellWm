/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

/* eslint-disable */

import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { GetFocusedWindow, SetForegroundWindow, GetIsLightMode, GetThemeColor, HWindow,FBox,FHexColor } from "@sorrellwm/windows";


const ElectronHandler =
{
    ipcRenderer:
    {
        on(Channel: string, InFunction: ((...Arguments: Array<unknown>) => void))
        {
            const subscription = (_event: IpcRendererEvent, ...args: Array<unknown>) =>
            {
                return InFunction(...args);
            };

            ipcRenderer.on(Channel, subscription);

            return () =>
            {
                ipcRenderer.removeListener(Channel, subscription);
            };
        },
        once(Channel: string, InFunction: ((...Arguments: Array<unknown>) => void))
        {
            ipcRenderer.once(
                Channel,
                (_Event: Electron.Event, ..._Arguments: Array<unknown>) => InFunction(..._Arguments)
            );
        },
        sendMessage(Channel: string, ...Arguments: Array<unknown>)
        {
            ipcRenderer.send(Channel, ...Arguments);
        }
    },
    GetFocusedWindow: async (): Promise<HWindow> => ipcRenderer.invoke("GetFocusedWindow"),
SetForegroundWindow: async (Handle: HWindow): Promise<FBox> => ipcRenderer.invoke("SetForegroundWindow", Handle),
GetIsLightMode: async (): Promise<boolean> => ipcRenderer.invoke("GetIsLightMode"),
GetThemeColor: async (): Promise<FHexColor> => ipcRenderer.invoke("GetThemeColor")
};

contextBridge.exposeInMainWorld("electron", ElectronHandler);

export type FElectronHandler = typeof ElectronHandler;


