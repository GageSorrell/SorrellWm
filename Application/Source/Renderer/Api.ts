/* File:      Api.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

type FLog = (...Arguments: Array<unknown>) => void;

export const Log: FLog = (...Arguments: Array<unknown>): void =>
{
    if (window.electron.ipcRenderer)
    {
        window.electron.ipcRenderer.Send("Log", ...Arguments);
    }
};
