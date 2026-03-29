/* File:      Decl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * @TODO Write this comment, noting that it is one of the few modules
 * that isn't wrapped in a namespace.
 *
 * @module
 */

import type { Internal } from "./Internal/index.js";
import type { Shared } from "./Shared/index.js";

/**
 * Use this type in [event declarations](/articles/glossary.html#event-declarations)
 * to specify that a type parameter is unused.  This can be used for any type parameter
 * in {@link EventDecl} but the {@link EventDecl.ErrorMessageDeclType} parameter (which `extends string`).
 */
export type EmptyEventParameter = [ never ];

/**
 * Define event declarations with this type.
 * This is the type that you will likely use the most.
 *
 * @typeParam OwnerType -
 * @typeParam RequestDeclType -
 * @typeParam ResponseDeclType -
 * @typeParam ErrorMessageDeclType -
 * @typeParam ErrorPayloadDeclType -
 */
export type EventDecl<
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    OwnerType extends Shared.Registrar.Owner,
    RequestDeclType,
    ResponseDeclType,
    ErrorMessageDeclType extends string = string,
    ErrorPayloadDeclType = EmptyEventParameter
> =
    Internal.Event.AreArgumentsSerializable<
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
