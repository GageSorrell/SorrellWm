/**
 * @file      Navigate.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventDecl, RendererOwner } from "reactive-event";
import type { TEventErrorCode } from "./ErrorCodes.Types";

export type FNavigateRequest =
    {
        Route: string;
        State?: Record<PropertyKey, unknown>;
    };

export type FNavigateErrorCode = TEventErrorCode<"">;

declare module "reactive-event/registrar"
{
    interface Registrar
    {
        Navigate: EventDecl<
            RendererOwner,
            FNavigateRequest,
            never,
            FNavigateErrorCode
        >;

    }
};
