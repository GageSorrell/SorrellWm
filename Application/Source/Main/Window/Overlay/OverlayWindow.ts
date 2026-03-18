/* File:      OverlayWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell.
 * License:   MIT
 */

import {
    BlurBackground as BlurBackgroundNative,
    type FBox,
    GetDwmWindowRect,
    GetFocusedWindow,
    GetWindowTitle,
    type HWindow,
    UnblurBackground } from "@sorrellwm/windows";
import { type BrowserWindow, screen } from "electron";
import { type FDevSettings, GetDevSettings, GetLogger } from "#/Development";
import type { FLogger, FNavigateRequest, FVertex } from "../../../Shared";
import { GetInterimFocusedVertex, IsCell, IsWindowTiled } from "#/Tree/Tree";
import { SendIpcEvent } from "#/Event";

const Log: FLogger = GetLogger("OverlayWindow");

let MainWindow: BrowserWindow | undefined = undefined;

export const GetMainWindow = (): BrowserWindow => (MainWindow as BrowserWindow);

export const InitializeMainWindow = (In: BrowserWindow): BrowserWindow =>
{
    MainWindow = In;
    return In;
};

export const BlurBackground = (Bounds: FBox): void =>
{
    const InterimFocusedVertex: FVertex | undefined = GetInterimFocusedVertex();
    const SourceHandle: HWindow | undefined =
        InterimFocusedVertex !== undefined && IsCell(InterimFocusedVertex)
            ? InterimFocusedVertex.Handle
            : GetActiveWindow();

    if (SourceHandle !== undefined)
    {
        const DevSettings: FDevSettings = GetDevSettings();
        const OutBounds: FBox = DevSettings.StaticMode.Enabled
            ? DevSettings.StaticMode.WindowShape
            : Bounds;

        Log("OutBounds", OutBounds);
        BlurBackgroundNative(OutBounds, SourceHandle);
        if (MainWindow)
        {
            const Foo: number = screen.getDisplayMatching(MainWindow.getBounds()).scaleFactor;
            MainWindow.setBounds({
                height: OutBounds.Height / Foo,
                width: OutBounds.Width / Foo,
                x: OutBounds.X,
                y: OutBounds.Y
            });

            // MainWindow.setPosition(OutBounds.X, OutBounds.Y);
            // MainWindow.setSize(OutBounds.Width, OutBounds.Height, false);
        }
        // MainWindow?.setBounds({
        //     height: OutBounds.Height / 1.25,
        //     width: OutBounds.Width / 1.25,
        //     x: OutBounds.X,
        //     y: OutBounds.Y
        // }, false);
    }
    else
    {
        /* eslint-disable-next-line @stylistic/max-len */
        Log.Error("BlurBackgroundNative cannot be called because there is no InterimFocusedVertex or ActiveWindow.");
    }
};

/** Hide the main window. */
export const Deactivate = (): void =>
{
    const { x: X, y: Y } = GetLeastInvisiblePosition();
    if (MainWindow)
    {
        MainWindow.setPosition(X, Y, false);
        UnblurBackground();
    }
};

export const GetLeastInvisiblePosition = (): { x: number; y: number } =>
{
    const Displays: TArray<Electron.Display> = screen.getAllDisplays();

    type FMonitorBounds = { left: number; right: number; top: number; bottom: number };
    const MonitorBounds: TArray<FMonitorBounds> = Displays.map((display: Electron.Display): FMonitorBounds =>
    {
        return {
            bottom: display.bounds.y + display.bounds.height,
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y
        };
    });

    MonitorBounds.sort((A: FMonitorBounds, B: FMonitorBounds) => A.left - B.left || A.top - B.top);

    const MaxRight: number = Math.max(...MonitorBounds.map((bounds: FMonitorBounds) => bounds.right));
    const MaxBottom: number = Math.max(...MonitorBounds.map((bounds: FMonitorBounds) => bounds.bottom));

    const InvisibleX: number = (MaxRight + 1) * 2;
    const InvisibleY: number = (MaxBottom + 1) * 2;

    return {
        x: InvisibleX,
        y: InvisibleY
    };
};

/** The window(s) that SorrellWm is being drawn over. */
let ActiveWindow: HWindow | undefined = undefined;

export const GetActiveWindow = (): HWindow | undefined =>
{
    return ActiveWindow;
};

export const SetActiveWindow = (In: HWindow | undefined): void =>
{
    ActiveWindow = In;
};

/**
 * Allows other parts of the application to tell the main window
 * that it should not activate, even when the activation key is used.
 */
let ShouldActivate: boolean = true;

export const SetShouldActivate = (In: boolean): void =>
{
    ShouldActivate = In;
};

/** Show the main window. */
export const Activate = (): void =>
{
    if (!ShouldActivate)
    {
        return;
    }

    if (GetWindowTitle(GetFocusedWindow()) !== "SorrellWm Main Window" && MainWindow)
    {
        ActiveWindow = GetFocusedWindow();

        const IsTiled: boolean = IsWindowTiled(GetFocusedWindow());
        const NavigateRequest: FNavigateRequest =
        {
            Route: "",
            State: { IsTiled }
        };

        // MainWindow?.webContents.closeDevTools();

        SendIpcEvent(MainWindow, "Navigate", NavigateRequest);
        BlurBackground(GetDwmWindowRect(ActiveWindow));

        Log(MainWindow?.getPosition());
        Log(MainWindow?.getSize());
        // StealFocus(GetWindowByName("SorrellWm Main Window"));
    }
};
