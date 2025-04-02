/* File:      BrowserWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import {
    app as App,
    BrowserWindow,
    nativeTheme,
    type BrowserWindowConstructorOptions,
    type WebPreferences } from "electron";
import type {
    FBrowserWindowEventCallback,
    FBrowserWindowEventType,
    FBrowserWindowEvents } from "./BrowserWindow.Types";
import { GetPaths } from "./Core/Paths";

export const RegisterBrowserWindowEvents = (Window: BrowserWindow, Events: FBrowserWindowEvents): void =>
{
    Object.keys(Events).forEach((InEventName: string): void =>
    {
        const EventName: FBrowserWindowEventType = InEventName as FBrowserWindowEventType;
        const Callback: FBrowserWindowEventCallback = Events[EventName] as FBrowserWindowEventCallback;

        /* @ts-expect-error This results from the namespace approach used to define overloads by Electron. */
        Window.on(EventName, Callback);
    });
};

/** Factory function for `BrowserWindow`.  Provides some defaults, particularly *wrt* `webPreferences`. */
export const CreateBrowserWindow = (Options: BrowserWindowConstructorOptions): BrowserWindow =>
{
    const BaseWebPreferences: WebPreferences =
    {
        devTools: false,
        nodeIntegration: true,
        preload: App.isPackaged
            ? Path.join(__dirname, "Preload.js")
            : Path.join(__dirname, "../Intermediate/Preload.js")
    };

    const { webPreferences, ...Rest } = Options;

    const icon: string = Path.join(
        GetPaths().Resource,
        "Icon",
        nativeTheme.shouldUseDarkColors
            ? "BrandDark.svg"
            : "BrandLight.svg"
    );

    return new BrowserWindow({
        height: 900,
        icon,
        show: true,
        webPreferences:
        {
            ...webPreferences,
            ...BaseWebPreferences
        },
        width: 900,
        ...Rest
    });
};
