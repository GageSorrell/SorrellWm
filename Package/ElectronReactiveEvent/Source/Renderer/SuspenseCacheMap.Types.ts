/* File:      SuspenseCacheMap.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ChannelSuspenseCacheMap, SuspenseCacheMap } from "./SuspenseCacheMap";
import type { MainResponse, RendererRequest } from "./Hook.Types.ts.old";
import type { PackageKeys } from "../Internal";
import type { RendererChannel } from "./Hook.Internal.Types.ts.old";
import type { SafeRequest } from "../Callback";
import type { Channel } from "../Channel";
import type { RendererOwner } from "../Decl.Types";

export type InnerChannelSuspenseCacheMap<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>> =
    Map<unknown, Promise<MainResponse<PackageKey, ChannelType>>>;

export type InnerSuspenseCacheMap<
    PackageKey extends PackageKeys,
    OuterChannelType extends RendererChannel<PackageKey> = RendererChannel<PackageKey>> =
    Map<OuterChannelType, ChannelSuspenseCacheMap<PackageKey, OuterChannelType>>;

export type InnerGlobalSuspenseCacheMap<PackageKey extends PackageKeys> =
    Map<PackageKey, SuspenseCacheMap<PackageKey, RendererChannel<PackageKey>>>;

export type InvokeAndNormalizeFunction =
    {
        <PackageKey extends PackageKeys,
            ChannelType extends Channel.Invokable.Any<PackageKey, RendererOwner>
        >(
            Channel: ChannelType,
            Request: SafeRequest<RendererRequest<PackageKey, ChannelType>>
        ): Promise<MainResponse<PackageKey, ChannelType>>;
    };
