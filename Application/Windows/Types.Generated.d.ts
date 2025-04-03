/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import type { FBox, HMonitor, HWindow, FHexColor } from "./Core";

export function BlurBackground(Bounds: FBox): void;
export function UnblurBackground(): void;
export function GetScreenshot(Bounds: FBox): string;
export function CaptureScreenSectionToTempPngFile(Bounds: FBox): string;
export function GetMonitors(): Array<FMonitorInfo>;
export function InitializeMonitors(): Array<FMonitorInfo>;
export function GetMonitorFriendlyName(Handle: HMonitor): string | undefined;
export function GetFocusedWindow(): HWindow;
export function CaptureWindowScreenshot(Handle: HWindow): string;
export function GetWindowLocationAndSize(Handle: HWindow): FBox;
export function GetTitlebarHeight(): number;
export function SetForegroundWindow(Handle: HWindow): void;
export function GetWindowByName(Name: string): HWindow;
export function GetIsLightMode(): boolean;
export function GetThemeColor(): FHexColor;
export function CanTile(): boolean;
export function GetTileableWindows(): Array<HWindow>;
export function GetMonitorFromWindow(Handle: HWindow): HMonitor;
export function SetWindowPosition(Handle: HWindow, Box: FBox): void;
export function GetWindowTitle(Handle: HWindow): string;
export function GetApplicationFriendlyName(Handle: HWindow): string | undefined;
export function RestoreAllWindows(): void;
export function StealFocus(Handle: HWindow): void;
export function GetDwmWindowRect(Handle: HWindow): FBox;
