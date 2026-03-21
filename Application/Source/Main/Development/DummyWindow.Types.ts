/* File:      DummyWindow.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FResponseDeclNone, TEventDecl } from "@sorrellwm/event";
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
