/* File:      Navigate.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FResponseDeclNone, TEventDecl } from "electron-reactive-event";
import type { TEventErrorCode } from "./ErrorCodes.Types";

export type FNavigateRequest =
{
    Route: string;
    State?: Record<PropertyKey, unknown>;
};

export type FNavigateErrorCode = TEventErrorCode<"">;

declare module "./Event.Types"
{
    interface IBackendEventRegistrar
    {
        Navigate: TEventDecl<
            FNavigateRequest,
            FResponseDeclNone,
            FNavigateErrorCode
        >;

    }
};
