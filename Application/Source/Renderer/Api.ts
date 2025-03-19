/* File:    Api.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

type FOn = (Channel: string, Listener: ((...Arguments: Array<unknown>) => void)) => (() => void);
type FOnce = (Channel: string, Listener: (...Arguments: Array<unknown>) => void) => void;
type FSend = (Channel: string, ...Arguments: Array<unknown>) => void;
type FRemoveListener = FOnce;
type FIpcRenderer =
{
    On: FOn;
    Once: FOnce;
    Send: FSend;
    RemoveListener: FRemoveListener;
};

type FLogFunction = (...Arguments: Array<unknown>) => void;
type FLog =
    FLogFunction &
    {
        Warn: FLogFunction;
        Error: FLogFunction;
        Verbose: FLogFunction;
        Normal: FLogFunction;
    };

export const IpcRenderer: FIpcRenderer =
{
    On: window.electron.ipcRenderer.On,
    Once: window.electron.ipcRenderer.Once,
    RemoveListener: window.electron.ipcRenderer.SendMessage,
    Send: window.electron.ipcRenderer.SendMessage
};

const Warn: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    IpcRenderer.Send("Log", "Warn", ...Arguments);
};

const Normal: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    IpcRenderer.Send("Log", "Normal", ...Arguments);
};

const Error: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    IpcRenderer.Send("Log", "Error", ...Arguments);
};

const Verbose: FLogFunction = (...Arguments: Array<unknown>): void =>
{
    IpcRenderer.Send("Log", "Verbose", ...Arguments);
};

const OutLog: FLog = Normal.bind({ }) as FLog;
OutLog.Error = Error;
OutLog.Warn = Warn;
OutLog.Normal = Normal;
OutLog.Verbose = Verbose;

export const Log: FLog = OutLog;
