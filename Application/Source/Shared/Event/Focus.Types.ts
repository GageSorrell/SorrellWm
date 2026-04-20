/**
 * @file      Transactions.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 * Comment:   Define types used in `Event.Types.ts` that
 *            do not otherwise have a good place to go.
 */

import type { FRequestDeclNone, TEventDecl } from "electron-reactive-event";
import type { FBox } from "@sorrellwm/windows";
import type { FFocusChange } from "../Tree.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";

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
    RealSize: FBox;
};

export type FFocusData =
    FFocusDataBase &
    (
        | FWindowFocusData
        | FPanelFocusData
    );

export type FOnChangeFocusErrorCode =
    | FGetFocusDataErrorCode
    | TEventErrorCode<"">;

export type FGetFocusDataErrorCode = TEventErrorCode<
    | "CurrentPanelUndefined"
    | "FocusedVertexUndefined"
>;

declare module "./Event.Types"
{
    interface IFrontendEventRegistrar
    {
        GetFocusData: TEventDecl<
            FRequestDeclNone,
            FFocusData,
            FGetFocusDataErrorCode
        >;
        OnChangeFocus: TEventDecl<
            FFocusChange,
            FFocusData,
            FOnChangeFocusErrorCode
        >;
    }
}
