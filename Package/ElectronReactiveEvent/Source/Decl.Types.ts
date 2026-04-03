/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { EventErrorAdvancedDeclParameter } from "./Internal/Decl.Types.js";

export type EmptyEventParameter = [ never ];

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

export type MainOwner = "Main";

export type RendererOwner = "Renderer";

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

// /**
//  * @remarks Unless you are event declarations with advanced patterns, you likely do not
//  * want to use this type directly: use {@link EventErrorSimpleDecl} or {@link EventErrorAdvancedDecl} instead.
//  *
//  * @typeParam MessageType - The string union of possible error messages (keys).
//  * @typeParam PayloadType - The type of the payload attached to a {@link ReactiveEventError}, if one is used.
//  */
// export type EventErrorDecl<
//     MessageType extends string = string,
//     PayloadType = EmptyEventParameter
// > =
//     | EventErrorSimpleDecl<MessageType, PayloadType>
//     | EventErrorAdvancedDecl<{ MessageType: MessageType; PayloadType: PayloadType; }, MessageType>;

export type EventErrorDecl<
    MessageType extends string = string,
    PayloadType = unknown
> =
    | MessageType
    | [ MessageType, PayloadType ]
    | {
        Message: MessageType;
        Payload: PayloadType;
    };

export type EventDecl<
    OwnerType extends EventOwner,
    RequestType = EmptyEventParameter,
    ResponseType = EmptyEventParameter,
    ErrorType extends EventErrorDecl = EventErrorDecl,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Options extends EventDeclOptions | EmptyEventParameter = EmptyEventParameter
> =
    {
        OwnerType: OwnerType;
        RequestType: RequestType;
        ResponseType: ResponseType;
        ErrorType: ErrorType;
    };
