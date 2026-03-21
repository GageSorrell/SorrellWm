/* File:      Move.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FResponseDeclNone, TEventDecl } from "@sorrellwm/event";
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

declare module "./Old/Event.Types"
{
    interface IFrontendEventRegistrar
    {
        MoveFloatingWindow: TEventDecl<
            FTranslation,
            FResponseDeclNone,
            FMoveFloatingWindowErrorCode
        >;
        MoveTiledWindow: TEventDecl<
            FTiledMoveTransaction,
            FTiledMoveResult,
            FMoveFloatingWindowErrorCode
        >;
    }
};
