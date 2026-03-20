/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TAreArgumentsSerializable } from "./Internal/Event.Types";

export type FResponseDeclNone = "ResponseDeclNone";
export type FRequestDeclNone = "RequestDeclNone";

export type TEventDecl<
    RequestDeclType,
    ResponseDeclType,
    ErrorMessageDeclType,
    ErrorPayloadDeclType = never
> =
    TAreArgumentsSerializable<
        RequestDeclType,
        ResponseDeclType,
        ErrorMessageDeclType,
        ErrorPayloadDeclType
    > extends true
        ? {
            RequestDeclType: RequestDeclType;
            ResponseDeclType: ResponseDeclType;
            ErrorMessageDeclType: ErrorMessageDeclType;
            ErrorPayloadDeclType: ErrorPayloadDeclType;
        }
        : never;
