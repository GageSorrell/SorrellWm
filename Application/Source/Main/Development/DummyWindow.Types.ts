/**
 * @file      DummyWindow.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FResponseDeclNone, TEventDecl } from "electron-reactive-event";
import type { TIpcFrontendEvent } from "Source/Shared";

declare module "../../Shared/Event/Event.Types.ts"
{
    interface IFrontendEventRegistrar
    {
        GetIsDummyWindow: TEventDecl<
            FResponseDeclNone,
            boolean,
            "UnspecifiedError"
        >;
    }
}
