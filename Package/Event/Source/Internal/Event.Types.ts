/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIsSerializable } from "./Serializable.Types.ts";
import type { TIsValid } from "./Utility.Types.ts";

export type TAreArgumentsSerializable<
    RequestDeclType,
    ResponseDeclType,
    ErrorMessageDeclType,
    ErrorPayloadDeclType = never
> =
    TIsValid<ErrorPayloadDeclType> extends true
        ? (
            | TIsSerializable<RequestDeclType>
            | TIsSerializable<ResponseDeclType>
            | TIsSerializable<ErrorMessageDeclType>
            | TIsSerializable<ErrorPayloadDeclType>
        )
        : (
            | TIsSerializable<RequestDeclType>
            | TIsSerializable<ResponseDeclType>
            | TIsSerializable<ErrorMessageDeclType>
        );

export type FRequestDeclTypeKey = "RequestDeclType";
export type FResponseDeclTypeKey = "ResponseDeclType";
export type FErrorMessageDeclTypeKey = "ErrorMessageDeclType";
export type FErrorPayloadDeclTypeKey = "ErrorPayloadDeclType";

export type TIsEventDecl<Type> =
    FRequestDeclTypeKey extends keyof Type
        ? FResponseDeclTypeKey extends keyof Type
            ? FErrorMessageDeclTypeKey extends keyof Type
                ? FErrorPayloadDeclTypeKey extends keyof Type
                    ? TAreArgumentsSerializable<
                        Type[FRequestDeclTypeKey],
                        Type[FResponseDeclTypeKey],
                        Type[FErrorMessageDeclTypeKey],
                        Type[FErrorPayloadDeclTypeKey]
                    > extends true
                        ? true
                        : false
                    : false
                : false
            : false
        : false;
