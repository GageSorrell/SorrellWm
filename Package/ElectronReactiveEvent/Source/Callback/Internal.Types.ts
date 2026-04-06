/* File:      Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventOwner } from "../Decl.Types.js";
import type { FilterByOwner, PackageKeys, RendererRegistrar, RequestKey } from "../Internal/index.js";
import type { Channel } from "../Channel/Channel.Types.js";

export type RequestOverloadSafe<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = RequestKey extends keyof FilterByOwner<PackageKey, OwnerType>
    ? RendererRegistrar<PackageKey>[ChannelType][RequestKey] extends EmptyEventParameter
        ? undefined
        : RendererRegistrar<PackageKey>[ChannelType][RequestKey]
    : never;
