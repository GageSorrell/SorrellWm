/* File:      BrowserWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import {
    app as App,
    BrowserWindow,
    type BrowserWindowConstructorOptions,
    type IpcMainInvokeEvent,
    type NativeImage,
    type WebPreferences,
    ipcMain } from "electron";
import { GetIcon, GetIconPath } from "./Core";
import type { FCreateBrowserWindowReturnType } from "./BrowserWindow.Types";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Development";
import { RegisterInitializationFunction } from "./Core/Initialize";

const Log: FLogger = GetLogger("BrowserWindow");

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
    }
};

/** Factory function for `BrowserWindow`.  Provides some defaults, particularly *wrt* `webPreferences`. */
export const CreateBrowserWindow = async (
    Options: BrowserWindowConstructorOptions
): Promise<FCreateBrowserWindowReturnType> =>
{
    const BaseWebPreferences: WebPreferences =
    {
        // devTools: false,
        nodeIntegration: true,
        preload: App.isPackaged
            ? Path.join(__dirname, "Preload.js")
            : Path.join(__dirname, "../Intermediate/Preload.js")
    };

    const { webPreferences, ...Rest } = Options;

    const icon: NativeImage = GetIcon("Brand", "PNG");
    Log(GetIconPath("Brand", "PNG"));
    Log(`Is Icon Empty: ${ icon.isEmpty() }.`);

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
            Log.Error("LoadFrontend threw the following error", Error);
        }
    };

    return {
        LoadFrontend,
        Window
    };
};

RegisterInitializationFunction(async (): Promise<void> =>
{
    ipcMain.handle("GetId", (Event: IpcMainInvokeEvent): number | undefined =>
    {
        Log("Received GetId call from the renderer.");
        const Window: BrowserWindow | null = BrowserWindow.fromWebContents(Event.sender);
        if (Window === null)
        {
            Log.Error("No BrowserWindow found for sender.");
            return undefined;
        }
        else
        {
            Log(`Received GetId call from the renderer: Id is ${ Window.id }.`);
            return Window.id;
        }
    });
});
