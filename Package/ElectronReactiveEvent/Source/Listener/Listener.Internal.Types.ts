/* File:      Listener.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PackageKeys, Registrar, RequestKey } from "../Internal";
import type { Channel } from "../Channel";
import type { EmptyOverloadParameterValue } from "./Listener.Internal";
import type { EventOwner } from "../Decl.Types";
import type { EventArray, EventArraySafe } from ".";

export type EmptyOverloadParameter = typeof EmptyOverloadParameterValue;

export type EventRecordAny<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelTypeOuter extends Channel.Any<PackageKey, OwnerType>
> =
    {
        [ ChannelType in ChannelTypeOuter ]:
        ChannelType extends Channel.NoRequest<PackageKey, OwnerType>
            ? EmptyOverloadParameter
            : Registrar[PackageKey][ChannelType][RequestKey];
    };

export type EventCollectionInternal<
    PackageKey extends PackageKeys,
    OwnerType extends EventOwner,
    ChannelType extends Channel.Any<PackageKey, OwnerType>
> = EventRecordAny<PackageKey, OwnerType, ChannelType>;
