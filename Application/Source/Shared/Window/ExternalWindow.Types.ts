/**
 * @file      ExternalWindow.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
