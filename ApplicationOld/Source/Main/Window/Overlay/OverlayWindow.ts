/**
 * @file      OverlayWindow.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell.
 * @license   MIT
 */

import {
    BlurBackground as BlurBackgroundNative,
    type FBox,
    GetDwmWindowRect,
    GetFocusedWindow,
    GetWindowTitle,
    type HWindow,
    UnblurBackground } from "@sorrell/wm-windows";
import { type BrowserWindow, type Rectangle, screen } from "electron";
import { type FDevSettings, GetDevSettings, GetLogger } from "#/Development";
import type { FLogger, FNavigateRequest, FVertex } from "../../../Shared";
import { GetInterimFocusedVertex, IsCell, IsWindowTiled } from "#/Tree/Tree";
import { SendIpcEvent } from "#/Event";

const Log: FLogger = GetLogger("OverlayWindow");

let OverlayWindow: BrowserWindow | undefined = undefined;

export const GetOverlayWindow = (): BrowserWindow => (OverlayWindow as BrowserWindow);

export const InitializeOverlay = (In: BrowserWindow): BrowserWindow =>
{
    OverlayWindow = In;
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
        if (OverlayWindow)
        {
            const OutBoundsRectangle: Rectangle =
            {
                height: OutBounds.Height,
                width: OutBounds.Width,
                x: OutBounds.X,
                y: OutBounds.Y
            };
            const ScaleFactor: number = screen.getDisplayMatching(OutBoundsRectangle).scaleFactor;
            OverlayWindow.setBounds({
                height: OutBounds.Height / ScaleFactor,
                width: OutBounds.Width / ScaleFactor,
                x: OutBounds.X / ScaleFactor,
                y: OutBounds.Y / ScaleFactor
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
    if (OverlayWindow)
    {
        OverlayWindow.setPosition(X, Y, false);
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

    if (GetWindowTitle(GetFocusedWindow()) !== "SorrellWm Main Window" && OverlayWindow)
    {
        ActiveWindow = GetFocusedWindow();

        const IsTiled: boolean = IsWindowTiled(GetFocusedWindow());
        const NavigateRequest: FNavigateRequest =
        {
            Route: "",
            State: { IsTiled }
        };

        // MainWindow?.webContents.closeDevTools();

        SendIpcEvent(OverlayWindow, "Navigate", NavigateRequest);
        BlurBackground(GetDwmWindowRect(ActiveWindow));

        Log(OverlayWindow?.getPosition());
        Log(OverlayWindow?.getSize());
        // StealFocus(GetWindowByName("SorrellWm Main Window"));
    }
};
