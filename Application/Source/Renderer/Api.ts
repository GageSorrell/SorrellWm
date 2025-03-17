/* File:    Api.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

type FOn = (Channel: string, InFunction: ((...Arguments: Array<unknown>) => void)) => (() => void);
type FOnce = (Channel: string, InFunction: (...Arguments: Array<unknown>) => void) => void;
type FSend = (Channel: string, ...Arguments: Array<unknown>) => void;
type FLogFunction = (...Arguments: Array<unknown>) => void;
type FLog =
    FLogFunction &
    {
        Warn: FLogFunction;
        Error: FLogFunction;
        Verbose: FLogFunction;
        Normal: FLogFunction;
    };

export const On: FOn = window.electron.ipcRenderer.on;
export const Once: FOnce = window.electron.ipcRenderer.once;
export const Send: FSend = window.electron.ipcRenderer.sendMessage;

const Warn: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    window.electron.ipcRenderer.sendMessage("Log", "Warn", ...Arguments);
};

const Normal: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    window.electron.ipcRenderer.sendMessage("Log", "Normal", ...Arguments);
};

const Error: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    window.electron.ipcRenderer.sendMessage("Log", "Error", ...Arguments);
};

const Verbose: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    window.electron.ipcRenderer.sendMessage("Log", "Verbose", ...Arguments);
};

const OutLog: FLog = Normal.bind({ }) as FLog;
OutLog.Error = Error;
OutLog.Warn = Warn;
OutLog.Normal = Normal;
OutLog.Verbose = Verbose;

export const Log: FLog = OutLog;
