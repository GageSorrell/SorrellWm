/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable jsdoc/require-jsdoc */

import type { EventErrorAdvancedDeclParameter } from "./Decl.Internal.Types.js";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const EmptyEventParameterValue: unique symbol = Symbol("EmptyEventParameterValue");

export type EmptyEventParameter = typeof EmptyEventParameterValue;

type EventDeclOptions =
    {
        /** An optional override for the `ChannelType` that will correspond to this declaration. */
        NameOverride?: string;
    };

// /**
//  * @note `MessageType` cannot *be* `string`, it must *extend* string.
//  *
//  * Allows for defining error types where there is an optional payload.
//  * Any combination of messages and payloads are permitted using this type.
//  *
//  * To define an error type as a discriminated union, use {@link EventErrorAdvancedDecl}.
//  */
// export type EventErrorSimpleDecl<
//     MessageType extends string = string,
//     PayloadType = EmptyEventParameter
// > =
//     {
//         MessageType: MessageType;
//         PayloadType: PayloadType;
//     };

/* eslint-disable @typescript-eslint/no-unused-vars */
const MainOwnerValue: unique symbol = Symbol("MainOwnerValue");
const RendererOwnerValue: unique symbol = Symbol("RendererOwnerValue");
/* eslint-enable @typescript-eslint/no-unused-vars */

export type MainOwner = typeof MainOwnerValue;
export type RendererOwner = typeof RendererOwnerValue;

export type EventOwner =
    | MainOwner
    | RendererOwner;

/**
 * Define an error type as a discriminated union of `MessageType`, `PayloadType` combinations.
 */
export type EventErrorAdvancedDecl<
    Parameter extends EventErrorAdvancedDeclParameter<MessageType, PayloadType>,
    MessageType extends string = string,
    PayloadType = unknown
> = Parameter;

export type EventErrorUnknownAdvancedDecl =
    {
        Message: string;
        Payload: unknown;
    };

export type EventErrorTuple<
    MessageType extends string = string,
    PayloadType = unknown
> = [ MessageType, PayloadType ];

export type EventErrorRecord<
    MessageType extends string = string,
    PayloadType = unknown
> =
    {
        Message: MessageType;
        Payload: PayloadType;
    };

export type EventErrorDecl<
    MessageType extends string = string,
    PayloadType = unknown
> =
    | MessageType
    | EventErrorTuple<MessageType, PayloadType>
    | EventErrorRecord<MessageType, PayloadType>;

export type EventDecl<
    OwnerType extends EventOwner,
    RequestType = EmptyEventParameter,
    ResponseType = EmptyEventParameter,
    ErrorType extends EventErrorDecl | EmptyEventParameter = EmptyEventParameter,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Options extends EventDeclOptions | EmptyEventParameter = EmptyEventParameter
> =
    {
        OwnerType: OwnerType;
        RequestType: RequestType;
        ResponseType: ResponseType;
        ErrorType: ErrorType;
    };
