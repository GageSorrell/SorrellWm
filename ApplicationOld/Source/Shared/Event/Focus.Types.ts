/**
 * @file      Transactions.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 * Comment:   Define types used in `Event.Types.ts` that
 *            do not otherwise have a good place to go.
 */

import type { EventDecl, RendererOwner } from "reactive-event";
import type { FBox } from "@sorrell/wm-windows";
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

declare module "reactive-event/registrar"
{
    interface Registrar
    {
        GetFocusData: EventDecl<
            RendererOwner,
            never,
            FFocusData,
            FGetFocusDataErrorCode
        >;
        OnChangeFocus: EventDecl<
            RendererOwner,
            FFocusChange,
            FFocusData,
            FOnChangeFocusErrorCode
        >;
    }
}
