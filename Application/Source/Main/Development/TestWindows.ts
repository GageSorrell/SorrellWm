/* File:      TestWindows.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import * as Path from "path";
import { BrowserWindow, app, ipcMain } from "electron";
import { ResolveHtmlPath } from "#/Core/Utility";
import { BringIntoPanel, Find, GetForest, IsPanel } from "#/Tree";
import type { FPanel, FVertex } from "#/Tree.Types";
import { GetWindowByName, type HWindow } from "Windows";

const CreateTestWindow = (Index: number): BrowserWindow =>
{
    const TestWindow: BrowserWindow = new BrowserWindow({
        autoHideMenuBar: true,
        show: true,
        title: `Test Window #${ Index }`,
        webPreferences:
        {
            devTools: false,
            nodeIntegration: true,
            preload: app.isPackaged
                ? Path.join(__dirname, "Preload.js")
                : Path.join(__dirname, "../Intermediate/Preload.js")
        }
    });

    TestWindow.setMenu(null);

    ipcMain.on("ReadyForRoute", (_Event: Electron.Event): void =>
    {
        TestWindow.webContents.send("Navigate", "TestWindow");
    });

    TestWindow.loadURL(ResolveHtmlPath("index.html"));

    TestWindow.on(
        "page-title-updated",
        (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): void =>
        {
            Event.preventDefault();
        }
    );

    return TestWindow;
};

export const CreateTestWindows = async (): Promise<void> =>
{
    const TestWindows: Array<BrowserWindow> = [ ];
    for (let Index: number = 0; Index < 5; Index++)
    {
        TestWindows.push(CreateTestWindow(Index));
    }

    const RightMonitor: FPanel | undefined = Find((Vertex: FVertex): boolean =>
    {
        if (IsPanel(Vertex))
        {
            return Vertex.Size.X === 2738;
        }
        else
        {
            return false;
        }
    }) as FPanel | undefined;
    if (RightMonitor !== undefined)
    {
        TestWindows.forEach((TestWindow: BrowserWindow): void =>
        {
            const WindowTitle: string = TestWindow.getTitle();
            const Handle: HWindow = GetWindowByName(WindowTitle);
            BringIntoPanel(RightMonitor, Handle);
        });
    }

};
