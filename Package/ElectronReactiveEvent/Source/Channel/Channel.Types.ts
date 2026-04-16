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

/**
 * Channels are the `string`s that uniquely identify the event declarations of a given package.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam OwnerType - The owner of the event declarations identified by this type.
 */
export type Channel<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner
> =
    Exclude<
        keyof FilterByOwner<PackageKey, OwnerType>,
        number | symbol
    >;

/** Channels are the `string`s that uniquely identify the event declarations of a given package. */
export namespace Channel
{
    export namespace With
    {
        /**
        * Channels whose event declarations define a response type.
        *
        * @typeParam PackageKey - The unique string that identifies your package.
        * @typeParam OwnerType - The owner of the event declarations identified by this type.
        */
        export type Response<PackageKey extends PackageKeys> =
            Exclude<
                Channel<PackageKey, RendererOwner>,
                Without.Response<PackageKey, RendererOwner>
            >;

        /**
         * Channels whose event declarations define an error type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Error<PackageKey extends PackageKeys> =
            Extract<
                Channel<PackageKey, RendererOwner>,
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
                Channel<PackageKey, OwnerType>,
                Extract<Values<WithRequestHelper<PackageKey>>, string>
            >;
    }

    export namespace Without
    {
        /**
         * Channels whose event declarations do *not* define a response type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Response<
            PackageKey extends PackageKeys,
            OwnerType extends EventOwner
        > =
            Exclude<
                Channel<PackageKey, OwnerType>,
                Extract<Values<WithResponseHelper<PackageKey>>, string>
            >;

        /**
         * Channel with no error type (*i.e.*, no error message type and no error payload type).
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Error<
            PackageKey extends PackageKeys,
            OwnerType extends EventOwner
        > =
            Exclude<
                Channel<PackageKey, OwnerType>,
                Extract<Values<WithErrorHelper<PackageKey>>, string>
            >;

        /**
         * Channels whose event declarations do *not* specify a request type.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam OwnerType - The owner of the event declarations identified by this type.
         */
        export type Request<
            PackageKey extends PackageKeys,
            OwnerType extends EventOwner
        > =
            Exclude<
                Channel<PackageKey, OwnerType>,
                Extract<Values<WithRequestHelper<PackageKey>>, string>
            >;
    }

    /**
     * Channels of event declarations that can be used via {@link Main.Send | send},
     * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type Handler<PackageKey extends PackageKeys> =
        | Channel.With.Response<PackageKey>
        | Channel.With.Error<PackageKey>;

    /**
     * Channels of event declarations that can be used via {@link Renderer.UseInvokeEvent | useInvokeEvent},
     * {@link Main.Handle | handle} *et al.*
     */
    export namespace Handler
    {
        export namespace With
        {
            /**
             * {@link Handler} channels whose event declarations define a request type.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam OwnerType - The owner of the event declarations identified by this type.
             */
            export type Request<PackageKey extends PackageKeys> =
                Extract<
                    Handler<PackageKey>,
                    Channel.With.Request<PackageKey, RendererOwner>
                >;

            /**
             * {@link Handler} channels whose event declarations define a response type.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam OwnerType - The owner of the event declarations identified by this type.
             */
            export type Response<PackageKey extends PackageKeys> =
                Extract<
                    Handler<PackageKey>,
                    Channel.With.Response<PackageKey>
                >;

            /**
             * {@link Handler} channels whose event declarations define an error type.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam OwnerType - The owner of the event declarations identified by this type.
             */
            export type Error<PackageKey extends PackageKeys> =
                Exclude<
                    Handler<PackageKey>,
                    Handler.Without.Error<PackageKey>
                >;
        }

        export namespace Without
        {
            /**
             * {@link Handler} channels whose event declarations do *not* define a request type.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam OwnerType - The owner of the event declarations identified by this type.
             */
            export type Request<PackageKey extends PackageKeys> =
                Extract<
                    Handler<PackageKey>,
                    Channel.Without.Request<PackageKey, RendererOwner>
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
            export type Response<PackageKey extends PackageKeys> =
                Exclude<
                    Handler<PackageKey>,
                    Extract<Values<WithResponseHelper<PackageKey>>, string>
                >;

            /**
             * {@link Handler} channels whose event declarations do *not* define an error type.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam OwnerType - The owner of the event declarations identified by this type.
             */
            export type Error<PackageKey extends PackageKeys> =
                Exclude<
                    Handler<PackageKey>,
                    Extract<Values<WithErrorHelper<PackageKey>>, string>
                >;
        }
    }

    /**
     * Channels of event declarations that can be used via {@link Main.Send | send},
     * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam OwnerType - The owner of the event declarations identified by this type.
     */
    export type Listener<
        PackageKey extends PackageKeys,
        OwnerType extends EventOwner
    > =
        | Extract<
            Channel.Without.Response<PackageKey, OwnerType>,
            Channel.Without.Error<PackageKey, OwnerType>
        >
        | Extract<
            Channel.Without.Error<PackageKey, OwnerType>,
            Channel.Without.Response<PackageKey, OwnerType>
        >;

    /**
     * Channels of event declarations that can be used via {@link Main.Send | send},
     * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
     */
    export namespace Listener
    {
        export namespace With
        {
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
                    Listener<PackageKey, OwnerType>,
                    Channel.With.Request<PackageKey, OwnerType>
                >;
        }

        export namespace Without
        {
            /**
             * {@link Listener} channels whose event declarations do *not* define a request type.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam OwnerType - The owner of the event declarations identified by this type.
             */
            export type Request<
                PackageKey extends PackageKeys,
                OwnerType extends EventOwner
            > =
                Extract<
                    Listener<PackageKey, OwnerType>,
                    Channel.Without.Request<PackageKey, OwnerType>
                >;
        }
    }
}
