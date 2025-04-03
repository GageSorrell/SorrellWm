/* File:      TestWindows.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { BringIntoPanel, Find, IsPanel } from "#/Tree";
import { type BrowserWindow, ipcMain } from "electron";
import type { FPanel, FVertex } from "#/Tree.Types";
import { GetWindowByName, type HWindow } from "Windows";
import { CreateBrowserWindow } from "#/BrowserWindow";

const CreateTestWindow = async (Index: number): Promise<BrowserWindow> =>
{
    const { Window: TestWindow, LoadFrontend } = await CreateBrowserWindow({
        autoHideMenuBar: true,
        show: true,
        title: `Test Window #${ Index + 1 }`
    });

    TestWindow.setMenu(null);

    ipcMain.on("ReadyForRoute", (_Event: Electron.Event): void =>
    {
        TestWindow.webContents.send("Navigate", "TestWindow");
    });

    await LoadFrontend();

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
        TestWindows.push(await CreateTestWindow(Index));
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
