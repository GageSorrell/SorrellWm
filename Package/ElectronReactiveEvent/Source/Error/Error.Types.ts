/* File:      Error.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ReactiveEventErrorMessage, ReactiveEventErrorPayload } from "./Error.Internal.Types";
import type { Channel } from "../Channel";
import type { EventOwner } from "../Decl/Decl.Types";
import type { PackageKeys } from "../Internal";

/**
 * When an error is given to the `renderer` as a result of a `handler` returning an error,
 * this is the type of that `error` property.
 *
 * @typeParam PackageKey - The unique string that identifies your package.
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 */
export type ReactiveEventErrorData<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Error<PackageKey, EventOwner>
> =
    ChannelType extends Channel.ErrorPayload<PackageKey, EventOwner>
        ? {
            message: ReactiveEventErrorMessage<PackageKey, ChannelType>;
        }
        : {
            message: ReactiveEventErrorMessage<PackageKey, ChannelType>;
            payload: ReactiveEventErrorPayload<PackageKey, ChannelType>;
        };
