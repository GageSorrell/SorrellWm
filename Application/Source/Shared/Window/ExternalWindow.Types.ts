/**
 * @file      ExternalWindow.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { HWindow } from "@sorrell/wm-windows";

export type FExternalWindowPlacement =
    | "Arranged"
    | "Minimized"
    | "Maximized"
    | "Restored";

/**
 * @property {boolean} IsMinMaxed - Is the window currently minimized, but will
 * be maximized when restored?  A value of `true` is incompatible with
 * `Placement !== Minimized`.
 */
export type FExternalWindow =
    {
        Handle: HWindow;

        IsMinMaxed: boolean;

        Placement: FExternalWindowPlacement;
    };
