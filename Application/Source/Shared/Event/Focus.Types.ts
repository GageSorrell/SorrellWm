/* File:      Transactions.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Define types used in `Event.Types.ts` that
 *            do not otherwise have a good place to go.
 */

export type FWindowFocusData =
{
    FocusedWindowTitle: string;
};

export type FPanelFocusData =
{
    NumVertices: number;
};

export type FFocusDataBase =
{
    Direction: "Horizontal" | "Vertical";
    CanStepUp: boolean;
    CanStepDown: boolean;
};

export type FFocusData =
    FFocusDataBase &
    (
        | FWindowFocusData
        | FPanelFocusData
    );
