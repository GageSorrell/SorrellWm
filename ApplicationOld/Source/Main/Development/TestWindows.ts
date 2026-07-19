/**
 * @file      TestWindows.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { BringIntoPanel, Find, IsPanel } from "#/Tree";
import type { FPanel, FVertex } from "../../Shared";
import { GetNotepadHandles, GetWindowByName, type HWindow, KillNotepadInstances } from "@sorrell/wm-windows";
import { type BrowserWindow } from "electron";
import { Sleep } from "#/Utility";
import { spawn } from "child_process";

const CreateTestWindow = async (_Index: number): Promise<BrowserWindow> =>
{
    return { } as BrowserWindow;
    // const { Window: TestWindow, LoadFrontend } = await FooMyFunction({
    //     autoHideMenuBar: true,
    //     show: true,
    //     title: `Test Window #${ Index + 1 }`
    // });

    // TestWindow.setMenu(null);

    // ipcMain.on("ReadyForRoute", (_Event: Electron.Event): void =>
    // {
    //     TestWindow.webContents.send("Navigate", "TestWindow");
    // });

    // await LoadFrontend();

    // TestWindow.on(
    //     "page-title-updated",
    //     (Event: Electron.Event, _Title: string, _ExplicitSet: boolean): void =>
    //     {
    //         Event.preventDefault();
    //     }
    // );

    // return TestWindow;
};

export const CreateNotepadTestWindows = async (_NumWindows: number): Promise<void> =>
{
    KillNotepadInstances();
    await Sleep(2000);

    for (let Index: number = 0; Index < 4; Index++)
    {
        spawn("C:\\Windows\\System32\\notepad.exe");
    }

    await Sleep(3000);

    const NotepadHandles: TArray<HWindow> = GetNotepadHandles();

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
    const TestWindows: TArray<BrowserWindow> = [ ];
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
            const Handle: HWindow | undefined = GetWindowByName(WindowTitle);
            if (Handle !== undefined)
            {
                BringIntoPanel(RightMonitor, Handle);
            }
        });
    }
};
