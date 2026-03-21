/* File:      Tile.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FResponseDeclNone, TEventDecl } from "@sorrellwm/event";
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
