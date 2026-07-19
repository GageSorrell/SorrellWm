/**
 * @file      InsertEvent.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { HWindow } from "@sorrell/wm-windows";

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
