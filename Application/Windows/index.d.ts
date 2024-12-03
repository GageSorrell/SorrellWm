/* File:    index.d.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

// export type FRect = {
//     Bottom: number;
//     Left: number,
//     Right: number,
//     Top: number,
// };

// export type FMonitor =
// {
//     IsPrimary: boolean;
//     Name: string;
//     Rectangle: FRect;
//     WorkArea: FRect;
// };

// export function GetMonitorFromRect(Handle: HWindow): FRect;
// export function GetMonitorFromWindow(Handle: HWindow): HMonitor;
// export function RestoreWindow(Handle: HWindow): void;
// export function GetWindowClassInfo(Handle: HWindow): bigint;
// export function GetDwmMargins(Handle: HWindow): FRect;
// export function InitializeWindowProcedure(CallbackOne, CallbackTwo, CallbackThree): void;
// export function GetForegroundWindow(): HWindow;
// export function DisableStyling(Handle: HWindow): boolean;
// export function GetMonitorRefreshRate(Handle: HMonitor): number;
// export function GetMonitorHandles(): Array<HMonitor>;
// export function GetMonitorInfo(Handle: HMonitor): FMonitor;
// export function GetWindowRect(Handle: HWindow): FRect;
// export function GetWindowHandles(): Array<HWindow>;
// export function GetWindowText(Handle: HWindow): string;
// export function IsIconic(Handle: HWindow): boolean;
// export function IsWindowVisible(Handle: HWindow): boolean;
// export function GetStyles(Handle: HWindow): bigint;
// export function SetupFocusHook(Callback: (Handle: HWindow) => void): void;
// export function RemoveFocusHook(): void;
// export function SetWindowPos(
//     Handle: HWindow,
//     X: number,
//     Y: number,
//     Width: number,
//     Height: number
// ): boolean;

export function GetMe(): void;

/** @TODO Temporary; replace with separate type for each callback. */
export type FMessageLoopCallback = (Argument: unknown) => void;

/** @TODO The signatures of the arguments are probably wrong. */
export function InitializeMessageLoop(EmptyCallback: (() => void)): void;

export type HWindow =
{
    Handle: string;
};

export type FVector2D =
{
    X: number;
    Y: number;
};

export type FBox =
    FVector2D &
    {
        Width: number;
        Height: number;
    };

export type FColor = `#${ string }`;

export function GetFocusedWindow(): HWindow;
export function CaptureWindowScreenshot(Handle: HWindow): string;
export function InitializeIpc(Callback: ((Channel: string, Message: unknown) => void)): void;
export function InitializeHooks(): void;
export function GetWindowLocationAndSize(Handle: HWindow): FBox;
export function InitializeWinEvents(): void;
export function CoverWindow(Handle: HWindow): void;
export function GetIsLightMode(): boolean;
export function Test(): void;
export function TestTwo(): void;
export function TestFun(): void;
export function GetTitlebarHeight(): number;
export function GetThemeColor(): FColor;
