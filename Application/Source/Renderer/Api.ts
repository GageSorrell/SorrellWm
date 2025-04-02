/* File:      Api.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

type FLog = (...Arguments: Array<unknown>) => void;

export const Log: FLog = (..._Arguments: Array<unknown>): void =>
{
    /* eslint-disable-next-line @stylistic/max-len */
    // if (window.electron && window.electron.ipcRenderer !== undefined && typeof window.electron.ipcRenderer === "object" && "Send" in window.electron.ipcRenderer)
    // {
    //     window.electron.ipcRenderer.Send("Log", ...Arguments);
    // }
};
