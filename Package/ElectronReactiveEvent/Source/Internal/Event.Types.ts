/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { EmptyEventParameter } from "../index.js";
import type { IsSerializable } from "./index.js";

export type AreArgumentsSerializable<
    RequestDeclType,
    ResponseDeclType,
    ErrorMessageDeclType,
    ErrorPayloadDeclType = EmptyEventParameter
> =
    ErrorPayloadDeclType extends [ never ]
        ? (
            | IsSerializable<RequestDeclType>
            | IsSerializable<ResponseDeclType>
            | IsSerializable<ErrorMessageDeclType>
        )
        : (
            | IsSerializable<RequestDeclType>
            | IsSerializable<ResponseDeclType>
            | IsSerializable<ErrorMessageDeclType>
            | IsSerializable<ErrorPayloadDeclType>
        );

export type RequestDeclKey = "RequestDeclType";
export type ResponseDeclKey = "ResponseDeclType";
export type ErrorMessageDeclKey = "ErrorMessageDeclType";
export type ErrorPayloadDeclKey = "ErrorPayloadDeclType";

export type IsEventDecl<Type> =
    RequestDeclKey extends keyof Type
        ? ResponseDeclKey extends keyof Type
            ? ErrorMessageDeclKey extends keyof Type
                ? ErrorPayloadDeclKey extends keyof Type
                    ? AreArgumentsSerializable<
                        Type[RequestDeclKey],
                        Type[ResponseDeclKey],
                        Type[ErrorMessageDeclKey],
                        Type[ErrorPayloadDeclKey]
                    > extends true
                        ? true
                        : false
                    : false
                : false
            : false
        : false;
