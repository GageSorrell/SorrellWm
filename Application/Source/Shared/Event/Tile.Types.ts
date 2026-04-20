/**
 * @file      Tile.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FResponseDeclNone, TEventDecl } from "electron-reactive-event";
import type { FAnnotatedPanel } from "../Tree.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";

export type FBringIntoPanelErrorCode = TEventErrorCode<"">;

declare module "./Event.Types"
{
    interface IFrontendEventRegistrar
    {
        BringIntoPanel: TEventDecl<
            FAnnotatedPanel,
            FResponseDeclNone,
            FBringIntoPanelErrorCode
        >;
    }
};
