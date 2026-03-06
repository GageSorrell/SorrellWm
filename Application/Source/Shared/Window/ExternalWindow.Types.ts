/* File:      ExternalWindow.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { HWindow } from "@sorrellwm/windows";

export type FExternalWindowPlacement =
    | "Arranged"
    | "Minimized"
    | "Maximized"
    | "Restored";

export type FExternalWindow =
{
    Handle: HWindow;

    /**
     * Is the window currently minimized, but will be maximized when restored?
     * A value of `true` is incompatible with `Placement !== Minimized`.
     */
    IsMinMaxed: boolean;

    Placement: FExternalWindowPlacement;
};
