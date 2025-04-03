/* File:      BrowserWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import {
    app as App,
    BrowserWindow,
    type BrowserWindowConstructorOptions,
    type WebPreferences } from "electron";
import type {
    FBrowserWindowEventType,
    FBrowserWindowEvents,
    FCreateBrowserWindowReturnType} from "./BrowserWindow.Types";
import { GetIconPath } from "./Core";

export const RegisterBrowserWindowEvents = (Window: BrowserWindow, Events: FBrowserWindowEvents): void =>
{
    Object.keys(Events).forEach((InEventName: string): void =>
    {
        const EventName: FBrowserWindowEventType = InEventName as FBrowserWindowEventType;
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
        const Callback: Function = Events[EventName] as Function;

        /* @ts-expect-error This results from the namespace approach used to define overloads by Electron. */
        Window.on(EventName, Callback);
    });
};

const ResolveHtmlPath = (HtmlFileName: string, Component?: string): string =>
{
    if (process.env.NODE_ENV === "development")
    {
        const Port: string | number = process.env.PORT || 1212;
        const Url: URL = new URL(`http://localhost:${ Port }`);
        Url.pathname = HtmlFileName;
        return Url.href;
    }
    const BasePath: string = `file://${ Path.resolve(__dirname, "../Renderer/", HtmlFileName) }`;
    if (Component !== undefined)
    {
        const ComponentArgument: string = `?Component=${ Component }`;
        return BasePath + ComponentArgument;
    }
    else
    {
        return BasePath;
    };
};

/** Factory function for `BrowserWindow`.  Provides some defaults, particularly *wrt* `webPreferences`. */
export const CreateBrowserWindow = async (
    Options: BrowserWindowConstructorOptions
): Promise<FCreateBrowserWindowReturnType> =>
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

    const icon: string = await GetIconPath("Brand");

    const Window: BrowserWindow = new BrowserWindow({
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

    Window.on(
        "page-title-updated",
        async (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): Promise<void> =>
        {
            Event.preventDefault();
        }
    );

    const LoadFrontend = async (): Promise<void> =>
    {
        try
        {
            await Window.loadURL(ResolveHtmlPath("index.html"));
        }
        catch (Error: unknown)
        {
            console.log("LoadFrontend threw the following error", Error);
        }
    };

    return {
        LoadFrontend,
        Window
    };
};
