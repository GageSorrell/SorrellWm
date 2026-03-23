/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { AreArgumentsSerializable } from "./Internal/index.js";

export type EmptyEventParameter = [ never ];

export type EventDecl<
    RequestDeclType,
    ResponseDeclType,
    ErrorMessageDeclType,
    ErrorPayloadDeclType = EmptyEventParameter
> =
    AreArgumentsSerializable<
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
