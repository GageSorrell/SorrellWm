// export const NAME_NONE = "NAME_NONE";

// export type HWindow = { "_": string; };

// export type HMonitor = { "__": string; };

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

/** @TODO The signatures of the arguments are probably wrong. */
export function InitializeMessageLoop(
    ErrorCallback: (() => void),
    OkCallback: (() => void),
    ProgressCallback: ((Argument: unknown) => void)
): void;
