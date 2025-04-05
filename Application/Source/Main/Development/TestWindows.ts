/* File:      TestWindows.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { BringIntoPanel, Find, IsPanel } from "#/Tree";
import { type BrowserWindow, ipcMain } from "electron";
import type { FPanel, FVertex } from "#/Tree.Types";
import { GetNotepadHandles, GetWindowByName, type HWindow, KillNotepadInstances } from "Windows";
import { CreateBrowserWindow } from "#/BrowserWindow";
import { ForAsync, Sleep } from "#/Utility";
import { spawn } from "child_process";

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

export const CreateNotepadTestWindows = async (NumWindows: number): Promise<void> =>
{
    KillNotepadInstances();
    await Sleep(2000);

    for (let Index: number = 0; Index < 4; Index++)
    {
        spawn("C:\\Windows\\System32\\notepad.exe");
    }

    await Sleep(3000);

    const NotepadHandles: Array<HWindow> = GetNotepadHandles();

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
        NotepadHandles.forEach((Handle: HWindow): void =>
        {
            BringIntoPanel(RightMonitor, Handle);
        });
    }
};

export const CreateTestWindows = async (): Promise<void> =>
{
    const TestWindows: Array<BrowserWindow> = [ ];
    for (let Index: number = 0; Index < 3; Index++)
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
