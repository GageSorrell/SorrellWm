/* File:      Move.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FAxis } from "../../Shared/Shared.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";
import type { TIpcFrontendEvent } from "./EventBase.Types";
import type { FFocusDataBase } from "./Focus.Types";

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

declare module "./Event.Types"
{
    interface IFrontendEventRegistrar
    {
        MoveFloatingWindow: TIpcFrontendEvent<
            FTranslation,
            undefined,
            FMoveFloatingWindowErrorCode
        >;
        MoveTiledWindow: TIpcFrontendEvent<
            FTiledMoveTransaction,
            FTiledMoveResult,
            FMoveFloatingWindowErrorCode
        >;
    }
};
