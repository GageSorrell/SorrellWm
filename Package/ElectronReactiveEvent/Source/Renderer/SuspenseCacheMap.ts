/* File:      SuspenseCacheMap.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc, jsdoc/require-param */

import type {
    InnerChannelSuspenseCacheMap,
    InnerGlobalSuspenseCacheMap,
    InnerSuspenseCacheMap,
    InvokeAndNormalizeFunction } from "./SuspenseCacheMap.Types";
import type { MainResponse, RendererRequest } from "./Hook.Types.ts.old";
import { EmptyRequestParameter } from "../Callback/Callback";
import type { EmptyRequestParameterType } from "../Callback";
import type { PackageKeys } from "../Internal/Registrar.Types";
import type { RendererChannel } from "./Hook.Internal.Types.ts.old";

export class ChannelSuspenseCacheMap<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>>
{
    /** Sets the value iff there is not already an entry of the given `Channel` */
    public Put<ChannelType extends RendererChannel<PackageKey>>(
        Channel: ChannelType,
        InvokeAndNormalizeFunction: InvokeAndNormalizeFunction,
        Request:
            | RendererRequest<PackageKey, typeof Channel>
            | EmptyRequestParameterType = EmptyRequestParameter
    ): Promise<MainResponse<PackageKey, ChannelType>>
    {
        type ThisResponse = MainResponse<PackageKey, ChannelType>;
        if (!this.Inner.has(Request))
        {
            const ResponsePromise: Promise<ThisResponse> =
                InvokeAndNormalizeFunction(Channel, Request);

            this.Inner.set(Request, ResponsePromise);

            return ResponsePromise;
        }
        else
        {
            return this.Inner.get(Request) as Promise<ThisResponse>;
        }

    };

    private Inner: InnerChannelSuspenseCacheMap<PackageKey, ChannelType> =
        new Map<unknown, Promise<MainResponse<PackageKey, ChannelType>>>();
}

export class SuspenseCacheMap<
    PackageKey extends PackageKeys,
    OuterChannelType extends RendererChannel<PackageKey> = RendererChannel<PackageKey>>
{
    public Get<ChannelType extends OuterChannelType>(
        Channel: ChannelType
    ): ChannelSuspenseCacheMap<PackageKey, typeof Channel>
    {
        if (!this.Inner.has(Channel))
        {
            this.Inner.set(
                Channel,
                new ChannelSuspenseCacheMap<PackageKey, typeof Channel>()
            );
        }

        type ThisReturnType = ChannelSuspenseCacheMap<PackageKey, typeof Channel>;
        return this.Inner.get(Channel) as ThisReturnType;
    }

    public Has<ChannelType extends OuterChannelType>(Channel: ChannelType): boolean
    {
        return this.Inner.has(Channel);
    }

    private Inner: InnerSuspenseCacheMap<PackageKey, OuterChannelType> =
        new Map<OuterChannelType, ChannelSuspenseCacheMap<PackageKey, OuterChannelType>>();
}

export class GlobalSuspenseCacheMap<PackageKey extends PackageKeys = PackageKeys>
{
    public Get<PackageKeyType extends PackageKey>(
        PackageKey: PackageKeyType
    ): SuspenseCacheMap<PackageKeyType, RendererChannel<PackageKeyType>>
    {
        if (!this.Inner.has(PackageKey))
        {
            this.Inner.set(
                PackageKey,
                new SuspenseCacheMap<PackageKeyType, RendererChannel<PackageKeyType>>()
            );
        }

        type ThisReturnType = SuspenseCacheMap<PackageKeyType, RendererChannel<PackageKeyType>>;
        return this.Inner.get(PackageKey) as ThisReturnType;
    }

    public Has<PackageKeyType extends PackageKey>(PackageKey: PackageKeyType): boolean
    {
        return this.Inner.has(PackageKey);
    }

    public Put<ChannelType extends RendererChannel<PackageKey>>(
        PackageKey: PackageKey,
        Channel: ChannelType,
        InvokeAndNormalizeFunction: InvokeAndNormalizeFunction
    ): void;
    public Put<ChannelType extends RendererChannel<PackageKey>>(
        PackageKey: PackageKey,
        Channel: ChannelType,
        InvokeAndNormalizeFunction: InvokeAndNormalizeFunction,
        Request: RendererRequest<PackageKey, typeof Channel>
    ): void;
    public Put<ChannelType extends RendererChannel<PackageKey>>(
        PackageKey: PackageKey,
        Channel: ChannelType,
        InvokeAndNormalizeFunction: InvokeAndNormalizeFunction,
        Request:
            | RendererRequest<PackageKey, typeof Channel>
            | EmptyRequestParameterType = EmptyRequestParameter
    ): void
    {
        this.Get(PackageKey).Get(Channel).Put(Channel, InvokeAndNormalizeFunction, Request);
    }

    private Inner: InnerGlobalSuspenseCacheMap<PackageKey> =
        new Map<PackageKey, SuspenseCacheMap<PackageKey, RendererChannel<PackageKey>>>();
}
