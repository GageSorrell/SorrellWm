/* File:      Transactions.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Define types used in `Event.Types.ts` that
 *            do not otherwise have a good place to go.
 */

import type { FFocusChange } from "../Tree.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";
import type { TIpcFrontendEvent } from "./EventBase.Types";

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
    CanMoveWithinPanel: boolean;
    CanStepUp: boolean;
    CanStepDown: boolean;
    Direction: "Horizontal" | "Vertical";
};

export type FFocusData =
    FFocusDataBase &
    (
        | FWindowFocusData
        | FPanelFocusData
    );

export type FOnChangeFocusErrorCode = TEventErrorCode<"">;

export type FGetFocusDataErrorCode = TEventErrorCode<
    | "CurrentPanelUndefined"
    | "FocusedVertexUndefined"
>;

declare module "./Event.Types"
{
    interface IFrontendEventRegistrar
    {
        GetFocusData: TIpcFrontendEvent<
            undefined,
            FFocusData,
            FGetFocusDataErrorCode
        >;
        OnChangeFocus: TIpcFrontendEvent<
            FFocusChange,
            undefined,
            FOnChangeFocusErrorCode
        >;
    }
}
