/* File:      Error.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ReactiveEventErrorMessage, ReactiveEventErrorPayload } from "./Error.Internal.Types";
import type { Channel } from "../Channel";
import type { EventOwner } from "../Decl/Decl.Types";
import type { PackageKeys } from "../Internal";

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
