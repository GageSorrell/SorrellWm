/* File:      Invoke.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "../Channel";
import type { Decl } from "../Decl";

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
     * @typeParam ChannelType - The channel that uniquely identifies the desired
     * event declaration.
     * @typeParam OptionsType - The specific type of {@link InvokeOptions} passed
     * to the {@link useInvokeEvent} call from which this response is produced.
     * The {@link InvokeOptions.suspend | suspend} property determines whether this
     * type will contain an `isPending` property.
     */
    export type Result<
        ChannelType extends Channel.Handler,
        OptionsType extends Options | undefined = undefined
    > = OptionsType extends Options<infer SuspendsType>
        ? SuspendsType extends true
            ? Result.Sync<ChannelType>
            : Result.Async<ChannelType>
        : Result.Async<ChannelType>;

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
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         */
        export type Async<ChannelType extends Channel.Handler> =
            MakeIsPending<Result.Sync<ChannelType>>;

        /**
         * The type returned to the `renderer` by a {@link Handler} when the
         * {@link InvokeOptions.suspend | suspend} option is passed via {@link InvokeOptions},
         * or when {@link InvokeEventDeferred} is called.
         *
         * @typeParam ChannelType - The channel that uniquely identifies the desired
         * event declaration.
         */
        export type Sync<ChannelType extends Channel.Handler> =
            ChannelType extends Channel.Handler.With.Response
                ? ChannelType extends Channel.Handler.With.Error
                    ? (
                        | Sync.Success<ChannelType>
                        | Sync.Error<ChannelType>
                    )
                    : Sync.Success<ChannelType>
                : ChannelType extends Channel.Handler.With.Error
                    ? Sync.Error<ChannelType>
                    : never;

        export namespace Sync
        {
            /**
             * The type returned by {@link UseInvokeEvent} and {@link InvokeEventDeferred}
             * when an event succeeds.
             *
             * @typeParam ChannelType - The channel that uniquely identifies the desired
             * event declaration.
             */
            export type Success<ChannelType extends Channel.Handler> =
                ChannelType extends Channel.Handler.With.Request
                    ? {
                        data: Decl.Response<ChannelType>;
                        error: undefined;
                    }
                    : ChannelType extends Channel.Handler.Without.Request
                        ? {
                            data: undefined;
                            error: undefined;
                        }
                        : never;
            /**
             * The type returned by {@link UseInvokeEvent} and {@link InvokeEventDeferred}
             * when an event fails.
             *
             * @typeParam ChannelType - The channel that uniquely identifies the desired
             * event declaration.
             */
            export type Error<ChannelType extends Channel.Handler.With.Error> =
                {
                    data: undefined;
                    error: Decl.Error<ChannelType>;
                };
        }
    }
}
