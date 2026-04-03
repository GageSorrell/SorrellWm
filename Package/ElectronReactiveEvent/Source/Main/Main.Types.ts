/* File:      Main.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    GetAllowMultipleCallbacksPerChannel,
    MainFunctionsBase,
    MainHandleCallbacksPlural,
    MainHandleCallbacksSingular } from "./Internal.Types";
import type { PackageKeys } from "../Internal";

export type ReactiveMainOptions =
    Partial<{
        /**
         * The default behavior allows at most one callback per channel to be registered
         * at any given point in time.  Specifying this property and setting it to `true`
         * will extend the functions to register callbacks to also accept a `Key: string`
         * argument, which is used for identifying callback functions.
         *
         * @default `false`
         */
        allowMultipleCallbacksPerChannel: boolean;

        /**
         * If set to `true`, then if a callback is attempted to be registered for a given
         * `Channel` and `Key` for which another callback is already registered, then an
         * error will be thrown.
         *
         * In addition to the functions that are already returned for registering callbacks,
         * if this option is set to `true`, then additional `*Safe` functions will also be returned.
         * These `*Safe` functions are no-ops in the case of attempting to register a callback
         * for a `Channel` and `Key` for which a callback is already registered.
         *
         * @note Only affects behavior if {@link allowMultipleCallbacksPerChannel} is specified and set
         * to `true`.
         *
         * @default `false`
         */
        throwOnCollision: boolean;
    }>;

export type ReactiveMainFunctions<
    PackageKey extends PackageKeys,
    Options extends ReactiveMainOptions
> =
    MainFunctionsBase<PackageKey> &
    GetAllowMultipleCallbacksPerChannel<Options> extends true
        ? MainHandleCallbacksPlural<PackageKey>
        : MainHandleCallbacksSingular<PackageKey>;
