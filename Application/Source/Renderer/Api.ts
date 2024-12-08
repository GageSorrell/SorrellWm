/* File:    Api.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

type FOn = (Channel: string, InFunction: ((...Arguments: Array<unknown>) => void)) => (() => void);
type FOnce = (Channel: string, InFunction: (...Arguments: Array<unknown>) => void) => void;
type FSend = (Channel: string, ...Arguments: Array<unknown>) => void;

export const On: FOn = window.electron.ipcRenderer.on;
export const Once: FOnce = window.electron.ipcRenderer.once;
export const Send: FSend = window.electron.ipcRenderer.sendMessage;
export const Log = (...Arguments: Array<unknown>): void =>
{
    window.electron.ipcRenderer.sendMessage("Log", ...Arguments);
};

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
