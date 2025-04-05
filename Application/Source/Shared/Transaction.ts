/* File:      Transactions.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type FFocusData =
{
    Direction: "Horizontal" | "Vertical";
    CanStepUp: boolean;
    CanStepDown: boolean;
};

/**
 * When a new vertex is created within a panel, how should its size
 * be determined, as well as the size of the current vertices?
 */
export type FInsertSizingMethod =
    | "Bisection"
    | "UniformResize";
