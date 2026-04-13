/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EventDeclHandler, EventDeclListener } from "../Internal/index.js";

/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const EmptyEventParameterValue: unique symbol = Symbol("EmptyEventParameterValue");

/**
 * Use this type as a type parameter in {@link EventDecl} when you do not wish
 * to have a given type for that declaration (*i.e.*, request, response, or error).
 */
export type EmptyEventParameter = typeof EmptyEventParameterValue;

/* eslint-disable @typescript-eslint/no-unused-vars */
const MainOwnerValue: unique symbol = Symbol("MainOwnerValue");
const RendererOwnerValue: unique symbol = Symbol("RendererOwnerValue");
/* eslint-enable @typescript-eslint/no-unused-vars */

/** This type is used to represent events that are sent by `main`. */
export type MainOwner = typeof MainOwnerValue;

/** This type is used to represent events that are sent by the `renderer`. */
export type RendererOwner = typeof RendererOwnerValue;

/** An *owner* of a given event type is from whom events of that event type are sent. */
export type EventOwner =
    | MainOwner
    | RendererOwner;

/**
 * A pairing of a message type and payload type.
 * Use this with {@link EventErrorAdvancedDecl} to define
 * a discriminated union of possible error types.
 *
 * @typeParam MessageType - The message type of the error.
 * @typeParam PayloadType - The payload type of the error.
 */
export type EventErrorAdvancedDeclParameter<
    MessageType extends string = string,
    PayloadType = unknown
> =
    {
        MessageType: MessageType;
        PayloadType: PayloadType;
    };

/**
 * Define an error type as a discriminated union of `MessageType`, `PayloadType` combinations.
 *
 * @typeParam MessageType - The message type of the error.
 * @typeParam PayloadType - The payload type of the error.
 */
export type EventErrorAdvancedDecl<
    Parameter extends EventErrorAdvancedDeclParameter<MessageType, PayloadType>,
    MessageType extends string = string,
    PayloadType = unknown
> = Parameter;

/**
 * Define an error type as a message type and payload type.
 * This is equivalent to using {@link EventErrorRecord}, just as a
 * tuple-type.  Any type assignable to {@link PayloadType} will
 * be usable with any type assignable to {@link MessageType}.
 *
 * @typeParam MessageType - The message type of the error.
 * @typeParam PayloadType - The payload type of the error.
 */
export type EventErrorTuple<
    MessageType extends string = string,
    PayloadType = unknown
> = [ MessageType, PayloadType ];

/**
 * Define an error type as a message type and payload type.
 * This is equivalent to using {@link EventErrorTuple}, just as a
 * record-type.  Any type assignable to {@link PayloadType} will
 * be usable with any type assignable to {@link MessageType}.
 *
 * @typeParam MessageType - The message type of the error.
 * @typeParam PayloadType - The payload type of the error.
 */
export type EventErrorRecord<
    MessageType extends string = string,
    PayloadType = unknown
> =
    {
        Message: MessageType;
        Payload: PayloadType;
    };

/**
 * Define an error type as just a message type, or as message and payload
 * types, either as a tuple-type or record-type.
 *
 * @typeParam MessageType - The message type of the error.
 * @typeParam PayloadType - The payload type of the error.
 */
export type EventErrorDecl<
    MessageType extends string = string,
    PayloadType = unknown
> =
    | MessageType
    | EventErrorTuple<MessageType, PayloadType>
    | EventErrorRecord<MessageType, PayloadType>;

/* eslint-disable @stylistic/max-len */

/**
 * All events in `electron-reactive-event` are modeled with this type.
 *
 * @note One important distinction is that event declarations with a {@link ResponseType}
 * can only have `OwnerType === {@link RendererOwner}`.  This is a consequence of only
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args | ipcRenderer.invoke}
 * being able to send events *and* receive a response from the receiver (*i.e.*, from `main`).
 * Event declarations, depending upon whether `{@link ResponseType} === {@link EmptyEventParameter}`,
 * evaluate to one of the two internal types {@link EventDeclHandler} or {@link EventDeclListener}.
 *
 * @typeParam OwnerType - From whom an event of this type is sent.
 * @typeParam RequestType - The type of the request object that is sent when an event occurs.
 * @typeParam ResponseType - The type of the response object that is sent when an event succeeds.
 * @typeParam ErrorType - The type of the response object that is sent when an event fails.
 */
export type EventDecl<
    OwnerType extends EventOwner,
    RequestType = EmptyEventParameter,
    ResponseType = EmptyEventParameter,
    ErrorType extends EventErrorDecl | EmptyEventParameter = EmptyEventParameter
> =
    OwnerType extends MainOwner
        ? ResponseType extends EmptyEventParameter
            ? ErrorType extends EmptyEventParameter
                ? EventDeclListener<MainOwner, RequestType>
                : never
            : never
        : OwnerType extends RendererOwner
            ? ResponseType extends EmptyEventParameter
                ? ErrorType extends EmptyEventParameter
                    ? EventDeclListener<RendererOwner, RequestType>
                    : EventDeclHandler<RequestType, ResponseType, ErrorType>
                : EventDeclHandler<RequestType, ResponseType, ErrorType>
            : never;
