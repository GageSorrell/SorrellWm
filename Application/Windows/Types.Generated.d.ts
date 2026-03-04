/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import type { FBox, HWindow, TArray, HMonitor, FHexColor } from "./Core";

export function BlurBackground(Bounds: FBox, SourceHandle: HWindow): HWindow;
export function UnblurBackground(): void;
export function KillOrphans(): void;
export function GetScreenshot(Bounds: FBox): string;
export function CaptureScreenSectionToTempPngFile(Bounds: FBox): string;
export function WriteTaskbarIconToPng(Window: HWindow): string;
export function GetNotepadHandles(): TArray<HWindow>;
export function KillNotepadInstances(): void;
export function GetMonitors(): TArray<FMonitorInfo>;
export function InitializeMonitors(): TArray<FMonitorInfo>;
export function GetMonitorFriendlyName(Handle: HMonitor): string | undefined;
export function GetFocusedWindow(): HWindow;
export function CaptureWindowScreenshot(Handle: HWindow): string;
export function CloseApplication(Pid: number): void;
export function GetDwmWindowRect(Handle: HWindow): FBox;
export function GetWindowShape(Handle: HWindow): FBox;
export function GetTitlebarHeight(): number;
export function SetForegroundWindow(Handle: HWindow): void;
export function GetWindowByName(Name: string): HWindow;
export function GetIsLightMode(): boolean;
export function GetThemeColor(): FHexColor;
export function CanTile(): boolean;
export function GetTileableWindows(): TArray<HWindow>;
export function GetMonitorFromWindow(Handle: HWindow): HMonitor;
export function SetWindowPosition(Handle: HWindow, Box: FBox): void;
export function GetWindowTitle(Handle: HWindow): string;
export function GetApplicationFriendlyName(Handle: HWindow): string | undefined;
export function MinimizeWindow(Handle: HWindow): void;
export function RestoreAllWindows(): void;
export function RestoreInPlace(void: undefined): HWindow;
export function RestoreWindow(Handle: HWindow): void;
export function StealFocus(Handle: HWindow): void;
