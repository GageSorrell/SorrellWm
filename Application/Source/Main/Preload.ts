/* File:    Preload.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

/* eslint-disable */

import { type IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

const ElectronHandler =
{
    ipcRenderer:
    {
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
                else // typeof In extends string | number | null | undefined | boolean;
                {
                    return In;
                }
            };

            try
            {
                ipcRenderer.on(Channel, Listener);
            }
            catch (Error: unknown)
            {
                console.log("Error: ", Error);
            }

            return (): void =>
            {
                try
                {
                    ipcRenderer.removeListener(Channel, Listener);
                }
                catch (Error: unknown)
                {
                    console.log("Error: ", Error);
                }
            };
        },
        Once(Channel: string, Listener: ((...ArgumentVector: Array<unknown>) => void)): void
        {
            ipcRenderer.once(
                Channel,
                (_Event: Electron.Event, ...ArgumentVector: Array<unknown>) => Listener(...ArgumentVector)
            );
        },
        RemoveListener(Channel: string, Listener: ((...ArgumentVector: Array<unknown>) => void)): void
        {
            try
            {
                ipcRenderer.removeListener(Channel, Listener);
            }
            catch (Error: unknown)
            {
                console.log("Error in RemoveListener: ", Error);
            }
        },
        Send(Channel: string, ...ArgumentVector: Array<unknown>)
        {
            try
            {
                ipcRenderer.send(Channel, ...ArgumentVector);
            }
            catch (Error: unknown)
            {
                console.log("Error in Send: ", Error, Channel, ArgumentVector);
            }
        }
    }
};

contextBridge.exposeInMainWorld("electron", ElectronHandler);

export type FElectronHandler = typeof ElectronHandler;
