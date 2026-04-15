/* File:      Channel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ErrorKey, RequestKey, ResponseKey } from "../Internal/Decl.Types";
import type {
    EventOwner,
    FilterByOwner,
    PackageKeys,
    Registrar,
    RendererOwner,
    Values } from "../Internal";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

type WithRequestHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] ]:
        RequestKey extends keyof Registrar[PackageKey][ChannelType]
            ? [ Registrar[PackageKey][ChannelType][RequestKey] ] extends [ never ]
                ? undefined
                : ChannelType
            : never
    };

type WithResponseHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] ]:
        ResponseKey extends keyof Registrar[PackageKey][ChannelType]
            ? [ Registrar[PackageKey][ChannelType][ResponseKey] ] extends [ never ]
                ? undefined
                : ChannelType
            : never
    };

type WithErrorHelper<PackageKey extends PackageKeys> =
    {
        [ ChannelType in keyof Registrar[PackageKey] ]:
        ErrorKey extends keyof Registrar[PackageKey][ChannelType]
            ? [ Registrar[PackageKey][ChannelType][ErrorKey] ] extends [ never ]
                ? undefined
                : ChannelType
            : never;
    };

/** Channels are the `string`s that uniquely identify the event declarations of a given package. */
export namespace Channel
{
    /**
     * Channels whose event declarations define a response type.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type Response<PackageKey extends PackageKeys> =
        Exclude<
            Any<PackageKey, RendererOwner>,
            NoResponse<PackageKey, RendererOwner>
        >;

    /**
     * Channels whose event declarations do *not* define a response type.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type NoResponse<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        Exclude<
            Any<PackageKey, OwnerType>,
            Extract<Values<WithResponseHelper<PackageKey>>, string>
        >;

    /**
     * Channels whose event declarations define an error type.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type Error<PackageKey extends PackageKeys> =
        Extract<
            Any<PackageKey, RendererOwner>,
            Extract<Values<WithErrorHelper<PackageKey>>, string>
        >;

    /**
     * Channel with no error type (*i.e.*, no error message type and no error payload type).
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type NoError<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        Exclude<
            Any<PackageKey, OwnerType>,
            Extract<Values<WithErrorHelper<PackageKey>>, string>
        >;

    /**
     * Channels whose event declarations specify a request type.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type Request<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        Extract<
            Any<PackageKey, OwnerType>,
            Extract<Values<WithRequestHelper<PackageKey>>, string>
        >;

    /**
     * Channels whose event declarations do *not* specify a request type.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type NoRequest<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        Exclude<
            Any<PackageKey, OwnerType>,
            Extract<Values<WithRequestHelper<PackageKey>>, string>
        >;

    /**
     * Channels are the `string`s that uniquely identify the event declarations of a given package.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type Any<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        Exclude<
            keyof FilterByOwner<PackageKey, OwnerType>,
            number | symbol
        >;

    /**
     * Channels of event declarations that can be used via {@link Renderer.UseInvokeEvent | useInvokeEvent},
     * {@link Main.Handle | handle} *et al.*
     */
    export namespace Handler
    {
        /**
         * Channels of event declarations that can be used via {@link Main.Send | send},
         * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Any<PackageKey extends PackageKeys> =
            | Channel.Response<PackageKey>
            | Channel.Error<PackageKey>;

        /**
         * {@link Handler} channels whose event declarations define a request type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Request<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Channel.Request<PackageKey, RendererOwner>
            >;

        /**
         * {@link Handler} channels whose event declarations define a response type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Response<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Channel.Response<PackageKey>
            >;

        /**
         * {@link Handler} channels whose event declarations do *not* define a request type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type NoRequest<PackageKey extends PackageKeys> =
            Extract<
                Any<PackageKey>,
                Channel.NoRequest<PackageKey, RendererOwner>
            >;

        /**
         * {@link Handler} channels whose event declarations do *not* define a response type.
         *
         * @note {@link Handler} events with no response type can still return data to the
         * `renderer` as an error type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type NoResponse<PackageKey extends PackageKeys> =
            Exclude<
                Any<PackageKey>,
                Extract<Values<WithResponseHelper<PackageKey>>, string>
            >;

        /**
         * {@link Handler} channels whose event declarations define an error type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Error<PackageKey extends PackageKeys> =
            Exclude<
                Any<PackageKey>,
                NoError<PackageKey>
            >;

        /**
         * {@link Handler} channels whose event declarations do *not* define an error type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type NoError<PackageKey extends PackageKeys> =
            Exclude<
                Any<PackageKey>,
                Extract<Values<WithErrorHelper<PackageKey>>, string>
            >;
    }

    /**
     * Channels of event declarations that can be used via {@link Main.Send | send},
     * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
     */
    export namespace Listener
    {
        /**
         * Channels of event declarations that can be used via {@link Main.Send | send},
         * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Any<
            PackageKey extends PackageKeys,
            OwnerType extends EventOwner
        > =
            | Extract<
                Channel.NoResponse<PackageKey, OwnerType>,
                Channel.NoError<PackageKey, OwnerType>
            >
            | Extract<
                Channel.NoError<PackageKey, OwnerType>,
                Channel.NoResponse<PackageKey, OwnerType>
            >;

        /**
         * {@link Listener} channels whose event declarations define a request type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Request<
            PackageKey extends PackageKeys,
            OwnerType extends EventOwner
        > =
            Extract<
                Any<PackageKey, OwnerType>,
                Channel.Request<PackageKey, OwnerType>
            >;

        /**
         * {@link Listener} channels whose event declarations do *not* define a request type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type NoRequest<
            PackageKey extends PackageKeys,
            OwnerType extends EventOwner
        > =
            Extract<
                Any<PackageKey, OwnerType>,
                Channel.NoRequest<PackageKey, OwnerType>
            >;
    }
}
