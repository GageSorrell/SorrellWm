/* File:      Invoke.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "../Channel";
import type { Decl } from "../Decl";
import type { PackageKeys } from "../Registrar";

export namespace Invoke
{
    type IsPendingPart<IsPendingType extends boolean> =
        Readonly<{
            isPending: IsPendingType;
        }>;

    type MakeIsPending<RecordType extends Record<PropertyKey, unknown>> =
        | (
            Readonly<{
                [ Key in keyof RecordType ]: undefined;
            }> &
            IsPendingPart<true>
        )
        | (
            RecordType &
            IsPendingPart<false>
        );

    /**
     * The options that may be passed to {@link useInvokeEvent}.
     *
     * @typeParam SuspendsType - The type of the {@link suspend} property, which is used to narrow down
     * the correct return type of {@link useInvokeEvent}.
     *
     * @property suspend - Whether {@link useInvokeEvent} should suspend until it receives a response from
     * `main`.  If `true`, then the {@link Result} returned will be of type {@link ResponseSync},
     * *i.e.*, the `isPending` property will be omitted.
     */
    export type Options<SuspendsType extends boolean = boolean> =
        {
            suspend: SuspendsType;
        };

    /**
     * The type returned by {@link useInvokeEvent}.
     *
     * @typeParam PackageKey - The unique string that identifies your package.
     * @typeParam ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     * @typeParam OptionsType - The specific type of {@link InvokeOptions} passed
     * to the {@link useInvokeEvent} call from which this response is produced.
     * The {@link InvokeOptions.suspend | suspend} property determines whether this
     * type will contain an `isPending` property.
     */
    export type Result<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Handler<PackageKey>,
        OptionsType extends Options | undefined = undefined
    > = OptionsType extends Options<infer SuspendsType>
        ? SuspendsType extends true
            ? Result.Sync<PackageKey, ChannelType>
            : Result.Async<PackageKey, ChannelType>
        : Result.Async<PackageKey, ChannelType>;

    export namespace Result
    {
        export namespace Async
        {
            /**
             * The value returned by {@link UseInvokeEvent} when
             * configured to *not* suspend and before `main` has
             * returned a result.
             */
            export type Indeterminate =
                {
                    data: undefined;
                    error: undefined;
                    isPending: true;
                };
        }

        /**
         * A {@link Result} returned by {@link UseInvokeEvent} when {@link Options.suspend}
         * is not `true`, possibly before `main` has sent a value to the `renderer`.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         */
        export type Async<
            PackageKey extends PackageKeys,
            ChannelType extends Channel.Handler<PackageKey>
        > = MakeIsPending<Result.Sync<PackageKey, ChannelType>>;

        /**
         * The type returned to the `renderer` by a {@link Handler} when the
         * {@link InvokeOptions.suspend | suspend} option is passed via {@link InvokeOptions},
         * or when {@link InvokeEventDeferred} is called.
         *
         * @typeParam PackageKey - The unique string that identifies your package.
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         */
        export type Sync<
            PackageKey extends PackageKeys,
            ChannelType extends Channel.Handler<PackageKey>
        > =
            ChannelType extends Channel.Handler.With.Response<PackageKey>
                ? ChannelType extends Channel.Handler.With.Error<PackageKey>
                    ? (
                        | Sync.Success<PackageKey, ChannelType>
                        | Sync.Error<PackageKey, ChannelType>
                    )
                    : Sync.Success<PackageKey, ChannelType>
                : ChannelType extends Channel.Handler.With.Error<PackageKey>
                    ? Sync.Error<PackageKey, ChannelType>
                    : never;

        export namespace Sync
        {
            /**
             * The type returned by {@link UseInvokeEvent} and {@link InvokeEventDeferred}
             * when an event succeeds.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam ChannelType - The channel that uniquely identifies the desired
             * event declaration.
             */
            export type Success<
                PackageKey extends PackageKeys,
                ChannelType extends Channel.Handler<PackageKey>
            > =
                ChannelType extends Channel.Handler.With.Request<PackageKey>
                    ? {
                        data: Decl.Response<PackageKey, ChannelType>;
                        error: undefined;
                    }
                    : ChannelType extends Channel.Handler.Without.Request<PackageKey>
                        ? {
                            data: undefined;
                            error: undefined;
                        }
                        : never;
            /**
             * The type returned by {@link UseInvokeEvent} and {@link InvokeEventDeferred}
             * when an event fails.
             *
             * @typeParam PackageKey - The unique string that identifies your package.
             * @typeParam ChannelType - The channel that uniquely identifies the desired
             * event declaration.
             */
            export type Error<
                PackageKey extends PackageKeys,
                ChannelType extends Channel.Handler.With.Error<PackageKey>
            > = {
                data: undefined;
                error: Decl.Error<PackageKey, ChannelType>;
            };
        }
    }
}
