/**
 * @file      Move.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventDecl } from "reactive-event";
import type { FAxis } from "../../Shared/Shared.Types";
import type { FFocusDataBase } from "./Focus.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";

export type FTranslation =
    {
        Direction: FAxis;
        Distance: number;
    };

export type FPanelStep =
    | "Up"
    | "Down"
    | "Next"
    | "Previous";

export type FTiledMoveData = Omit<FFocusDataBase, "CanMoveWithinPanel">;

export type FTiledMoveTransaction =
    {
        Step: FPanelStep;
    };

export type FTiledMoveResult =
    {
        IsOnPanel: boolean;
    };

export type FMoveFloatingWindowErrorCode = TEventErrorCode<"">;

declare module "reactive-event/registrar"
{
    interface Registrar
    {
        MoveFloatingWindow: EventDecl<
            RendererOwner,
FTranslation,
            never,
            FMoveFloatingWindowErrorCode
        >;
        MoveTiledWindow: EventDecl<
            RendererOwner,
FTiledMoveTransaction,
            FTiledMoveResult,
            FMoveFloatingWindowErrorCode
        >;
    }
};
