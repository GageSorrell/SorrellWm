/* File:      BrowserWindow.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable-next-line @stylistic/max-len */
/* @TODO Likely get rid of this module; there isn't enough logic regarding `BrowserWindow`s to warrant their own module. */

import type { FSimpleCallback } from "../Shared/Utility";
import type { FVector2D } from "@sorrellwm/windows";

export type FBrowserWindow = Readonly<{
    GetHandle: () => FBrowserWindowHandle;

    Hide: FSimpleCallback;
    Show: FSimpleCallback;

    GetSize: () => FVector2D;
    SetSize: (NewSize: FVector2D) => void;
}>;

/** Used internally by the `BrowserWindow` module to store `FBrowserWindow`s. */
export type FBrowserWindowDictionary = Record<string, FBrowserWindow>;

export type FBrowserWindowHandle =
{
    BrowserWindowHandle: string;
};

export type FBrowserWindowCreateArguments =
{
    Position: FVector2D;
    ShowImmediately: boolean;
    Size: FVector2D;
};

export type FBrowserWindowManager =
{
    Create: () => FBrowserWindow | undefined;
    GetAll: () => TArray<FBrowserWindow>;
    Get: (Handle: FBrowserWindowHandle) => (FBrowserWindow | undefined);
};
