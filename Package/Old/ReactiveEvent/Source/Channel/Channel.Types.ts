/**
 * @file      Channel.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ErrorKey, RequestKey, ResponseKey } from "../Internal/Decl.Types";
import type { EventOwner, FilterByOwner, Registrar, RendererOwner } from "../Registrar/Registrar.Types";
import type { Values } from "../Internal/Utility.Types";

type WithRequestHelper =
    {
        [ ChannelType in keyof Registrar ]:
        RequestKey extends keyof Registrar[ChannelType]
            ? [ Registrar[ChannelType][RequestKey] ] extends [ never ]
                ? undefined
                : ChannelType
            : never
    };

type WithResponseHelper =
    {
        [ ChannelType in keyof Registrar ]:
        ResponseKey extends keyof Registrar[ChannelType]
            ? [ Registrar[ChannelType][ResponseKey] ] extends [ never ]
                ? undefined
                : ChannelType
            : never
    };

type WithErrorHelper =
    {
        [ ChannelType in keyof Registrar ]:
        ErrorKey extends keyof Registrar[ChannelType]
            ? [ Registrar[ChannelType][ErrorKey] ] extends [ never ]
                ? undefined
                : ChannelType
            : never;
    };

/**
 * Channels are the `string`s that uniquely identify the event declarations of a given package.
 *
 * @template OwnerType - The owner of the event declarations identified by this type.
 */
export type Channel<OwnerType extends EventOwner> =
    Exclude<
        keyof FilterByOwner<OwnerType>,
        number | symbol
    >;

/** Channels are the `string`s that uniquely identify the event declarations of a given package. */
export namespace Channel
{
    export namespace With
    {
        /**
         * Channels whose event declarations define a response type.
         */
        export type Response =
            Exclude<
                Channel<RendererOwner>,
                Without.Response<RendererOwner>
            >;

        /**
         * Channels whose event declarations define an error type.
         */
        export type Error =
            Extract<
                Channel<RendererOwner>,
                Extract<Values<WithErrorHelper>, string>
            >;

        /**
         * Channels whose event declarations specify a request type.
         *
         * @template OwnerType - The owner of the event declarations identified by this type.
         */
        export type Request<OwnerType extends EventOwner> =
            Extract<
                Channel<OwnerType>,
                Extract<Values<WithRequestHelper>, string>
            >;
    }

    export namespace Without
    {
        /**
         * Channels whose event declarations do *not* define a response type.
         *
         * @template OwnerType - The owner of the event declarations identified by this type.
         */
        export type Response<OwnerType extends EventOwner> =
            Exclude<
                Channel<OwnerType>,
                Extract<Values<WithResponseHelper>, string>
            >;

        /**
         * Channel with no error type (*i.e.*, no error message type and no error payload type).
         *
         * @template OwnerType - The owner of the event declarations identified by this type.
         */
        export type Error<OwnerType extends EventOwner> =
            Exclude<
                Channel<OwnerType>,
                Extract<Values<WithErrorHelper>, string>
            >;

        /**
         * Channels whose event declarations do *not* specify a request type.
         *
         * @template OwnerType - The owner of the event declarations identified by this type.
         */
        export type Request<OwnerType extends EventOwner> =
            Exclude<
                Channel<OwnerType>,
                Extract<Values<WithRequestHelper>, string>
            >;
    }

    /**
     * Channels of event declarations that can be used via {@link Main.Send | send},
     * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
     */
    export type Handler =
        | Channel.With.Response
        | Channel.With.Error;

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
             */
            export type Request =
                Extract<
                    Handler,
                    Channel.With.Request<RendererOwner>
                >;

            /**
             * {@link Handler} channels whose event declarations define a response type.
             */
            export type Response =
                Extract<
                    Handler,
                    Channel.With.Response
                >;

            /**
             * {@link Handler} channels whose event declarations define an error type.
             */
            export type Error =
                Exclude<
                    Handler,
                    Handler.Without.Error
                >;
        }

        export namespace Without
        {
            /**
             * {@link Handler} channels whose event declarations do *not* define a request type.
             */
            export type Request =
                Extract<
                    Handler,
                    Channel.Without.Request<RendererOwner>
                >;

            /**
             * {@link Handler} channels whose event declarations do *not* define a response type.
             *
             * @note {@link Handler} events with no response type can still return data to the
             * `renderer` as an error type.
             */
            export type Response =
                Exclude<
                    Handler,
                    Extract<Values<WithResponseHelper>, string>
                >;

            /**
             * {@link Handler} channels whose event declarations do *not* define an error type.
             */
            export type Error =
                Exclude<
                    Handler,
                    Extract<Values<WithErrorHelper>, string>
                >;
        }
    }

    /**
     * Channels of event declarations that can be used via {@link Main.Send | send},
     * {@link Renderer.UseOnEvent | useOnEvent} *et al.*
     *
     * @template OwnerType - The owner of the event declarations identified by this type.
     */
    export type Listener<OwnerType extends EventOwner> =
        | Extract<
            Channel.Without.Response<OwnerType>,
            Channel.Without.Error<OwnerType>
        >
        | Extract<
            Channel.Without.Error<OwnerType>,
            Channel.Without.Response<OwnerType>
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
             * @template OwnerType - The owner of the event declarations identified by this type.
             */
            export type Request<OwnerType extends EventOwner> =
                Extract<
                    Listener<OwnerType>,
                    Channel.With.Request<OwnerType>
                >;
        }

        export namespace Without
        {
            /**
             * {@link Listener} channels whose event declarations do *not* define a request type.
             *
             * @template OwnerType - The owner of the event declarations identified by this type.
             */
            export type Request<OwnerType extends EventOwner> =
                Extract<
                    Listener<OwnerType>,
                    Channel.Without.Request<OwnerType>
                >;
        }
    }
}
