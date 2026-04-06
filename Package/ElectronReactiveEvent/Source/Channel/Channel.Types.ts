/* File:      Channel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventOwner, MainOwner, RendererOwner } from "../Decl.Types.js";
import type { ErrorMessageKey, ErrorPayloadKey, ReactiveEventError } from "../Error/Error.Types.js";
import type {
    ErrorKey,
    FilterByOwner,
    PackageKeys,
    Registrar,
    RequestKey,
    ResponseKey,
    Values } from "../Internal/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

type WithRequestHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] ]:
        RequestKey extends keyof Registrar[PackageKey][ChannelType]
            ? Registrar[PackageKey][ChannelType][RequestKey] extends EmptyEventParameter
                ? undefined
                : ChannelType
            : never
    };

type WithResponseHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] ]:
        ResponseKey extends keyof Registrar[PackageKey][ChannelType]
            ? Registrar[PackageKey][ChannelType][ResponseKey] extends EmptyEventParameter
                ? undefined
                : ChannelType
            : never
    };

type WithErrorHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] ]:
        ErrorKey extends keyof Registrar[PackageKey][ChannelType]
            ? Registrar[PackageKey][ChannelType][ErrorKey] extends EmptyEventParameter
                ? undefined
                : ChannelType
            : never
    };

// type WithErrorMessageHelper<PackageKey extends PackageKeys> =
//     {
//         [ ChannelType in Channel.Invokable.Any<PackageKey> ]:
//         ErrorKey extends keyof Registrar[PackageKey][ChannelType]
//             ? Registrar[PackageKey][ChannelType][ErrorKey] extends EmptyEventParameter
//                 ? undefined
//                 : ErrorMessageKey extends keyof ReactiveEventError<PackageKey, ChannelType>
//                     ? ChannelType
//                     : undefined
//             : never;
//     };

type WithErrorPayloadHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in Channel.Invokable.Any<PackageKey> ]:
        ErrorKey extends keyof Registrar[PackageKey][ChannelType]
            ? Registrar[PackageKey][ChannelType][ErrorKey] extends EmptyEventParameter
                ? undefined
                : ErrorPayloadKey extends keyof ReactiveEventError<PackageKey, ChannelType>
                    ? ReactiveEventError<PackageKey, ChannelType>[ErrorPayloadKey] extends EmptyEventParameter
                        ? undefined
                        : ChannelType
                    : never
            : never;
    };

export namespace Channel
{
    /** Channels whose event declarations define a response type. */
    export type Response<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            NoResponse<PackageKey, Owner>
        >;

    /** Channels whose event declarations do *not* define a response type. */
    export type NoResponse<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            Extract<Values<WithResponseHelper<PackageKey>>, string>
        >;

    export type Error<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            NoError<PackageKey, Owner>
        >;

    export type NoError<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            Extract<Values<WithErrorHelper<PackageKey>>, string>
        >;

    /**
     * Channels whose event declarations specify a request type.
     *
     * @typeParam PackageKey - The name of the package that imports from `electron-reactive-event`.
     * This string type does not need to literally match the `name` property of your `package.json`, but
     * it is recommended to do so.
     */
    export type Request<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Extract<
            Any<PackageKey, Owner>,
            Extract<Values<WithRequestHelper<PackageKey>>, string>
        >;

    /**
     * Channels whose event declarations do *not* specify a request type.
     *
     * @typeParam PackageKey - The name of the package that imports from `electron-reactive-event`.
     * This string type does not need to literally match the `name` property of your `package.json`, but
     * it is recommended to do so.
     */
    export type NoRequest<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            Any<PackageKey, Owner>,
            Extract<Values<WithRequestHelper<PackageKey>>, string>
        >;

    /**
     * A channel is the (`string`) key of an event declaration property in a registrar,
     * namespaced to your package.
     *
     * @typeParam PackageKey - The name of the package that imports from `electron-reactive-event`.
     * This string type does not need to literally match the `name` property of your `package.json`, but
     * it is recommended to do so.
     */
    export type Any<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            keyof FilterByOwner<PackageKey, Owner>,
            number | symbol
        >;

    export namespace Invokable
    {
        export type Any<PackageKey extends PackageKeys> =
            | Channel.Response<PackageKey, RendererOwner>
            | Channel.Error<PackageKey, RendererOwner>;

        export type Request<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Channel.Request<PackageKey, RendererOwner>
            >;

        export type Response<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Channel.Response<PackageKey, RendererOwner>
            >;

        export type NoRequest<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Channel.NoRequest<PackageKey, RendererOwner>
            >;

        /** Channels whose event declarations do *not* define a response type. */
        export type NoResponse<PackageKey extends PackageKeys> =
            Exclude<
                Any<PackageKey>,
                Extract<Values<WithResponseHelper<PackageKey>>, string>
            >;

        export type Error<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Extract<Values<WithErrorHelper<PackageKey>>, string>
            >;

        // export type ErrorMessage<PackageKey extends PackageKeys> =
        //     Extract<
        //         Any<PackageKey>,
        //         Extract<Values<WithErrorMessageHelper<PackageKey>>, string>
        //     >;

        export type ErrorMessage<PackageKey extends PackageKeys> =
            Exclude<
                Any<PackageKey>,
                Values<WithErrorPayloadHelper<PackageKey>>
            >;

        export type ErrorPayload<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Extract<Values<WithErrorPayloadHelper<PackageKey>>, string>
            >;

        export type NoError<PackageKey extends PackageKeys> =
            Exclude<
                Any<PackageKey>,
                Extract<Values<WithErrorHelper<PackageKey>>, string>
            >;
    }

    export namespace Sendable
    {
        export type Any<
            PackageKey extends PackageKeys,
            Owner extends EventOwner
        > =
            Exclude<
                Channel.Any<PackageKey, Owner>,
                Invokable.Any<PackageKey>
            >;

        export type Request<
            PackageKey extends PackageKeys,
            Owner extends EventOwner
        > =
            Extract<
                Any<PackageKey, Owner>,
                Channel.Request<PackageKey, Owner>
            >;

        export type NoRequest<
            PackageKey extends PackageKeys,
            Owner extends EventOwner
        > =
            Extract<
                Any<PackageKey, Owner>,
                Channel.NoRequest<PackageKey, Owner>
            >;
    }
}
