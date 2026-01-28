/* File:      InsertEvent.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { HWindow } from "Windows";

/**
 * When a new vertex is created within a panel, how should its size
 * be determined, as well as the size of the current vertices?
 */
export type FInsertSizingMethod =
    | "Bisection"
    | "UniformResize";

export type FInsertableWindowData =
{
    Handle: HWindow;
    Icon: string;
    Title: string;
};
