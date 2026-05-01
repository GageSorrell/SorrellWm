/**
 * @file      Tile.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventDecl, RendererOwner } from "electron-reactive-event";
import type { FAnnotatedPanel } from "../Tree.Types";
import type { TEventErrorCode } from "./ErrorCodes.Types";

export type FBringIntoPanelErrorCode = TEventErrorCode<"">;

declare module "electron-reactive-event/registrar"
{
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    interface Registrar
    {
        BringIntoPanel: EventDecl<
            RendererOwner,
            FAnnotatedPanel,
            never,
            FBringIntoPanelErrorCode
        >;
    }
};
