/* File:      Channel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventOwner, RendererOwner } from "../Decl/Decl.Types.js";
import type { ErrorKey, RequestKey, ResponseKey } from "../Internal/Decl.Types.js";
import type { ErrorPayloadKey, ReactiveEventErrorDataInternal } from "../Error/Error.Internal.Types.js";
import type {
    FilterByOwner,
    PackageKeys,
    Registrar,
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

type WithErrorPayloadHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in Channel.Handler.Any<PackageKey> ]:
        ErrorKey extends keyof Registrar[PackageKey][ChannelType]
            ? Registrar[PackageKey][ChannelType][ErrorKey] extends EmptyEventParameter
                ? undefined
                : ErrorPayloadKey extends keyof ReactiveEventErrorDataInternal<PackageKey, ChannelType>
                    ? ReactiveEventErrorDataInternal<PackageKey, ChannelType>[ErrorPayloadKey] extends
                    EmptyEventParameter
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

    export type ErrorMessage<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        Exclude<
            Any<PackageKey, OwnerType>,
            Values<WithErrorPayloadHelper<PackageKey>>
        >;

    export type ErrorPayload<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        Extract<
            Any<PackageKey, OwnerType>,
            Extract<Values<WithErrorPayloadHelper<PackageKey>>, string>
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
     * @typeParam PackageKey - The unique string that identifies your package.
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
     * @typeParam PackageKey - The unique string that identifies your package.
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
     * @typeParam PackageKey - The unique string that identifies your package.
     */
    export type Any<
        PackageKey extends PackageKeys,
        Owner extends EventOwner
    > =
        Exclude<
            keyof FilterByOwner<PackageKey, Owner>,
            number | symbol
        >;

    export namespace Handler
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

    export namespace Listener
    {
        export type Any<
            PackageKey extends PackageKeys,
            Owner extends EventOwner
        > =
            Exclude<
                Channel.Any<PackageKey, Owner>,
                Handler.Any<PackageKey>
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
