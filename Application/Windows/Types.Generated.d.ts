/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import type { HWindow, FBox, FHexColor } from "./Core";

export function BlurBackground(): void;
export function UnblurBackground(): void;
export function CaptureImage(): void;
export function GetFocusedWindow(): HWindow;
export function CaptureWindowScreenshot(Handle: HWindow): string;
export function GetWindowLocationAndSize(Handle: HWindow): FBox;
export function GetTitlebarHeight(): number;
export function SetForegroundWindow(Handle: HWindow): FBox;
export function SetForegroundWindow(Handle: HWindow): void;
export function GetWindowByName(Name: string): HWindow;
export function TestFun(): void;
export function GetIsLightMode(): boolean;
export function GetThemeColor(): FHexColor;
export function StartBlurOverlay(Handle: HWindow): void;
