/* File:      SuspenseCacheMap.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ChannelSuspenseCacheMap, SuspenseCacheMap } from "./SuspenseCacheMap";
import type { MainResponse, RendererRequest } from "./Hook.Types";
import type { PackageKeys } from "../Internal";
import type { RendererChannel } from "./Hook.Internal.Types";
import type { EmptyRequestParameterType, SafeRequest } from "../Callback";

export type InnerChannelSuspenseCacheMap<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>> =
    Map<unknown, Promise<MainResponse<PackageKey, ChannelType>>>;

export type InnerSuspenseCacheMap<
    PackageKey extends PackageKeys,
    OuterChannelType extends RendererChannel<PackageKey> = RendererChannel<PackageKey>> =
    Map<OuterChannelType, ChannelSuspenseCacheMap<PackageKey, OuterChannelType>>

export type InnerGlobalSuspenseCacheMap<PackageKey extends PackageKeys> =
    Map<PackageKey, SuspenseCacheMap<PackageKey, RendererChannel<PackageKey>>>;

export type InvokeAndNormalizeFunction =
    {
        <PackageKey extends PackageKeys, ChannelType extends RendererChannel<PackageKey>>(
            Channel: ChannelType,
            Request: SafeRequest<RendererRequest<PackageKey, ChannelType>>
        ): Promise<MainResponse<PackageKey, ChannelType>>;
    };
