/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

/* eslint-disable-next-line @typescript-eslint/typedef */
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
    }
};

contextBridge.exposeInMainWorld("electron", ElectronHandler);

export type FElectronHandler = typeof ElectronHandler;
