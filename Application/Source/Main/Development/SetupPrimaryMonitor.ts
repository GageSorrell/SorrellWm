/* File:      SetupPrimaryMonitor.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   If enabled, then move VS Code to the small monitor,
 *            and create a set of dummy windows to use for testing.
 *            This assumes my personal desktop setup (that is, my
 *            monitors).
 */

import { BringIntoPanel, GetForest } from "#/Tree";
import {
    CloseApplication,
    type FMonitorInfo,
    GetMonitorFromWindow,
    GetMonitors,
    GetTileableWindows,
    GetWindowTitle,
    type HWindow,
    MinimizeWindow,
    RestoreWindow,
    SetWindowPosition} from "@sorrellwm/windows";
import {
    type SpawnOptions,
    spawn as SpawnProcess } from "child_process";
import { AreHandlesEqual } from "#/Utility";
import type { FLogger, FPanel } from "../../Shared";
import { GetLogger } from "./Log";
import { app } from "electron";

/** Enable/disable the behavior by setting the value of this variable. */
const ShouldSetUpPrimaryMonitor: boolean = false;

const WillSetUpPrimaryMonitor: boolean = ShouldSetUpPrimaryMonitor && !app.isPackaged;

const Log: FLogger = GetLogger("SetupPrimaryMonitor");

const SetUpPrimaryMonitor = async (): Promise<void> =>
{
    Log("Populating the main monitor with test windows because ShouldSetUpPrimaryMonitor is set to true.");

    const VsCodeWindowNamePart: string = "SorrellWm (Workspace) - Visual Studio Code";
    const VsCodeWindow: HWindow | undefined = GetTileableWindows().find((TileableWindow: HWindow): boolean =>
    {
        return GetWindowTitle(TileableWindow).includes(VsCodeWindowNamePart);
    });

    if (VsCodeWindow === undefined)
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("Could not populate the main monitor with test windows because the VS Code window could not be found.");
        return;
    }

    const MonitorsInfo: TArray<FMonitorInfo> = GetMonitors();
    const SmallMonitorInfo: FMonitorInfo | undefined =
        MonitorsInfo.find((MonitorInfo: FMonitorInfo): boolean =>
        {
            return (
                MonitorInfo.IsPrimary &&
                MonitorInfo.Size.Width === 1920 &&
                MonitorInfo.Size.Height === 1080
            );
        });

    const MainMonitorInfo: FMonitorInfo | undefined =
        MonitorsInfo.find((MonitorInfo: FMonitorInfo): boolean =>
        {
            return (
                MonitorInfo.Size.Width === 3440 &&
                MonitorInfo.Size.Height === 1440
            );
        });

    if (SmallMonitorInfo === undefined || MainMonitorInfo === undefined)
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("Could not populate the main monitor with test windows because the necessary monitors could not be identified.");
        return;
    }

    const MoveVsCodeWindow = (): void =>
    {
        RestoreWindow(VsCodeWindow);
        SetWindowPosition(VsCodeWindow, SmallMonitorInfo.WorkSize);
    };

    const MainMonitorWindows: TArray<HWindow> = GetTileableWindows().filter((Window: HWindow): boolean =>
    {
        return (
            AreHandlesEqual(GetMonitorFromWindow(Window), MainMonitorInfo.Handle) &&
            !AreHandlesEqual(Window, VsCodeWindow)
        );
    });

    const MinimizeMainWindows = (): void =>
    {
        MainMonitorWindows.forEach(MinimizeWindow);
    };

    const RestoreMainWindows = (): void =>
    {
        MainMonitorWindows.forEach(RestoreWindow);
    };

    /* eslint-disable-next-line @stylistic/max-len */
    const PaintExecutablePath: string = "C:\\Program Files\\WindowsApps\\Microsoft.Paint_11.2511.291.0_x64__8wekyb3d8bbwe\\PaintApp\\mspaint.exe";
    const PaintProcessIdentifiers: Set<number> = new Set<number>();

    const LaunchPaint = (): void =>
    {
        const Options: SpawnOptions = {
            detached: true,
            stdio: "ignore",
            windowsHide: false
        };

        const ProcessIdentifier: number | undefined = SpawnProcess(PaintExecutablePath, [ ], Options).pid;
        if (ProcessIdentifier !== undefined)
        {
            PaintProcessIdentifiers.add(ProcessIdentifier);
        }
    };

    const LaunchPaintInstances = (): void =>
    {
        const NumWindows: number = 3;
        Array.from(Array(NumWindows).keys()).forEach(LaunchPaint);

        setTimeout((): void =>
        {
            const IsPaintWindow = (Window: HWindow): boolean => GetWindowTitle(Window).includes("Paint");
            const BringPaintWindowIntoRootPanel = (PaintWindow: HWindow): void =>
            {
                const MainMonitorRootPanel: FPanel | undefined =
                    GetForest().find((Panel: FPanel): boolean =>
                    {
                        if (Panel.MonitorId !== undefined)
                        {
                            return AreHandlesEqual(Panel.MonitorId, MainMonitorInfo.Handle);
                        }

                        return false;
                    });

                if (MainMonitorRootPanel === undefined)
                {
                    // @TODO
                    return;
                }

                BringIntoPanel(MainMonitorRootPanel, PaintWindow);
            };

            GetTileableWindows()
                .filter(IsPaintWindow)
                .forEach(BringPaintWindowIntoRootPanel);
        }, 3000);
    };

    const ClosePaintInstances = (): void =>
    {
        PaintProcessIdentifiers.forEach((ProcessIdentifier: number): void =>
        {
            CloseApplication(ProcessIdentifier);
        });
    };

    const RestoreVsCode = (): void =>
    {
        SetWindowPosition(VsCodeWindow, MainMonitorInfo.WorkSize);
    };

    const OnAppExit = (..._Arguments: TArray<unknown>): void =>
    {
        ClosePaintInstances();
        RestoreVsCode();
        RestoreMainWindows();
    };

    const ProcessEndEventNames: TArray<string> =
    [
        "SIGINT",
        "SIGTERM"
        // "uncaughtException",
        // "unhandledRejection"
    ];

    ProcessEndEventNames.forEach((EventName: string): void =>
    {
        process.on(EventName, OnAppExit);
    });

    MinimizeMainWindows();
    MoveVsCodeWindow();

    LaunchPaintInstances();
};

if (WillSetUpPrimaryMonitor)
{
    SetUpPrimaryMonitor();
}

/** Dummy variable so that something is exported, and therefore this file becomes a module. */
export const SetupPrimaryMonitorDummyVariable: undefined = undefined;
