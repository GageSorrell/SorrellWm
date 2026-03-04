/* File:      FloatingWindow.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FExternalWindowPlacement } from "./ExternalWindow.Types";

export type FFloatingWindowPlacement = Omit<FExternalWindowPlacement, "Arranged">;

export type FFloatingWindow =
{
    Placement: FFloatingWindowPlacement;
};
