/* File:      GeneratedTypes.d.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/* AUTO-GENERATED FILE. */

/* eslint-disable */

import type { FBlurReturnType, HWindow, FBox, FColor } from "./Core";

export function MyBlur(): FBlurReturnType;
export function TearDown(): void;
export function CaptureImage(): void;
export function GetFocusedWindow(): HWindow;
export function CaptureWindowScreenshot(Handle: HWindow): string;
export function GetWindowLocationAndSize(Handle: HWindow): FBox;
export function GetTitlebarHeight(): number;
export function SetForegroundWindow(Handle: HWindow): void;
export function GetWindowByName(Name: string): HWindow;
export function TestFun(): void;
export function GetIsLightMode(): boolean;
export function GetThemeColor(): FColor;
export function StartBlurOverlay(Handle: HWindow): void;
