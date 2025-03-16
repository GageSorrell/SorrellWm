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

// export const GetThemeColor = async (): Promise<FColor> =>
// {
//     let Cleanup: (() => void) = () => { };
//     const ThemeColor: FColor = await new Promise<FColor>((Resolve, Reject): void =>
//     {
//         window.electron.ipcRenderer.sendMessage("GetThemeColor");
//         window.electron.ipcRenderer.once("GetThemeColor", (ThemeColor: FColor): void =>
//         {
//             Resolve(ThemeColor);
//         });
//         Cleanup = window.electron.ipcRenderer.on("GetThemeColor", (ThemeColor: FColor) =>
//         {
//             Resolve(ThemeColor);
//         });
//     });

//     Cleanup();

//     return ThemeColor;
// };

// export const IsLightMode = async (): Promise<boolean> =>
// {
//     let Cleanup: (() => void) = () => { };
//     const ThemeColor: FColor = await new Promise<boolean>((Resolve, _Reject): void =>
//     {
//         window.electron.ipcRenderer.sendMessage("IsLightMode");
//         window.electron.ipcRenderer.once("IsLightMode", (IsLightMode: boolean): void =>
//         {
//             Resolve(IsLightMode);
//         });
//         Cleanup = window.electron.ipcRenderer.on("IsLightMode", (IsLightMode: boolean) =>
//         {
//             Resolve(IsLightMode);
//         });
//     });

//     Cleanup();

//     return ThemeColor;
// };

// const WrapApiCall = <T>(Channel: string): (() => Promise<T>) =>
// {
//     return async () =>
//     {
//         let Cleanup: (() => void) = () => { };
//         const OutData: T = await new Promise<T>((Resolve, _Reject): void =>
//         {
//             window.electron.ipcRenderer.sendMessage(Channel);
//             window.electron.ipcRenderer.once(Channel, (Data: T): void =>
//             {
//                 Resolve(Data);
//             });
//             Cleanup = window.electron.ipcRenderer.on(Channel, (Data: T) =>
//             {
//                 Resolve(Data);
//             });
//         });

//         Cleanup();

//         return OutData;
//     };
// };

// export const GetIsLightMode = WrapApiCall("GetIsLightMode");

// export const UseLightMode = (): Readonly<[ IsLightMode: boolean | undefined ]> =>
// {
//     const [ IsLightMode ]
//     return [ IsLightMode ] as const;
// };
