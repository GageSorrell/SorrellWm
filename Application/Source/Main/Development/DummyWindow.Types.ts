/**
 * @file      DummyWindow.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EventDecl, RendererOwner } from "electron-reactive-event";

declare module "electron-reactive-event/registrar"
{
    interface Registrar
    {
        GetIsDummyWindow: EventDecl<
            RendererOwner,
            never,
            boolean,
            "UnspecifiedError"
        >;
    }
}
