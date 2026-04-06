/* File:      Error.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "./Channel/Channel.Types.js";
import type { EventOwner } from "./Decl.Types.js";
import type { PackageKeys } from "./Internal/index.js";
import type { ReactiveEventError } from "./Internal/Error.Types.js";

/**
 * @Todo
 *
 * (This will be used by the consumer to return errors-as-values).
 *
 * @returns
 */
export function ReactiveEventError<
    PackageKey extends PackageKeys,
    Owner extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, Owner>
>(): ReactiveEventError<PackageKey, Owner, ChannelType>
{
    return { } as ReactiveEventError<PackageKey, Owner, ChannelType>;
}
