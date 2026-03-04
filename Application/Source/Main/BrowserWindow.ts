/* File:      BrowserWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable-next-line @stylistic/max-len */
/* @TODO Likely get rid of this module; there isn't enough logic regarding `BrowserWindow`s to warrant their own module. */

// import type {
//     FBrowserWindow,
//     FBrowserWindowDictionary,
//     FBrowserWindowHandle,
//     FBrowserWindowManager } from "./BrowserWindow.Types";

// const BrowserWindows: FBrowserWindowDictionary = { };

// const BrowserWindowManager: FBrowserWindowManager =
// {
//     Create: (Arguments): FBrowserWindow | undefined =>
//     {

//         return undefined;
//     },
//     Get: (Handle: FBrowserWindowHandle): FBrowserWindow | undefined =>
//     {
//         return Handle.BrowserWindowHandle in BrowserWindows
//             ? BrowserWindows[Handle.BrowserWindowHandle]
//             : undefined;
//     },
//     GetAll: (): TArray<FBrowserWindow> =>
//     {
//         return Object.values(BrowserWindows);
//     }
// };

// export const GetBrowserWindowManager = (): FBrowserWindowManager =>
// {
//     return BrowserWindowManager;
// };
