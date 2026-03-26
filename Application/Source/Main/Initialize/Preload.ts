/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

/* eslint-disable */

import { contextBridge, ipcRenderer } from "electron";
import type { FIpcFrontendChannel, TEventCallback } from "../../Shared";
// import { GetPreload } from "electron-reactive-event";

const ElectronHandler =
{
    // ...GetPreload(ipcRenderer),
    ipcRenderer:
    {
        GetId(): Promise<unknown>
        {
            return ipcRenderer.invoke("GetId");
        },
        Invoke<ChannelType extends FIpcFrontendChannel>(Channel: ChannelType, Payload: unknown): ReturnType<TEventCallback<ChannelType>>
        {
            return ipcRenderer.invoke(Channel, Payload);
        },
        On(Channel: string, Listener: ((...Arguments: Array<unknown>) => void))
        {
            type FRecord = Record<PropertyKey, unknown>;
            const Clone = (In: unknown): unknown =>
            {
                const IsRecord = (In: unknown): In is FRecord =>
                {
                    return typeof In === "object" && In !== null && !Array.isArray(In);
                };

                if (IsRecord(In))
                {
                    const OutRecord: FRecord = { };
                    Object.keys(In).forEach((Key: PropertyKey): void =>
                    {
                        OutRecord[Key] = Clone(In[Key]);
                    });
                    return OutRecord;
                }
                else if (Array.isArray(In))
                {
                    return In.map(Clone);
                }
                else if (typeof In === "symbol")
                {
                    return In.toString();
                }
                else if (typeof In === "function")
                {
                    return "[ Function ]";
                }
                else // In extends string | number | null | undefined | boolean;
                {
                    return In;
                }
            };

            ipcRenderer.on(Channel, Listener);

            return (): void =>
            {
                ipcRenderer.removeListener(Channel, Listener);
            };
        },
        Once(Channel: string, Listener: ((...ArgumentVector: Array<unknown>) => void)): void
        {
            ipcRenderer.removeAllListeners()
            ipcRenderer.once(
                Channel,
                (_Event: Electron.Event, ...ArgumentVector: Array<unknown>) => Listener(...ArgumentVector)
            );
        },
        RemoveListener(Channel: string, Listener: ((...ArgumentVector: Array<unknown>) => void)): void
        {
            ipcRenderer.removeListener(Channel, Listener);
        },
        Send(Channel: string, ...ArgumentVector: Array<unknown>)
        {
            ipcRenderer.send(Channel, ...ArgumentVector);
        }
    }
};

contextBridge.exposeInMainWorld("electron", ElectronHandler);

export type FElectronHandler = typeof ElectronHandler;

