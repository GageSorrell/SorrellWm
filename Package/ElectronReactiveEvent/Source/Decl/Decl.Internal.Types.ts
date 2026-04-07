/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EventOwner } from "./Decl.Types";

export type RequestKey = "RequestType";
export type ResponseKey = "ResponseType";
export type ErrorKey = "ErrorType";
export type OwnerKey = "OwnerType";

export type ErrorMessageKey = "Message";
export type ErrorPayloadKey = "Payload";

export type KeyofOwner<Owner extends EventOwner> = Extract<keyof Owner, string>;

export type EventErrorAdvancedDeclParameter<
    MessageType extends string = string,
    PayloadType = unknown
> =
    {
        MessageType: MessageType;
        PayloadType: PayloadType;
    };
