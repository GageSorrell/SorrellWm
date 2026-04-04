/* File:      Hook.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { Callback, SafeRequest } from "../Callback";
import { type EffectCallback, use, useContext, useEffect, useState } from "react";
import type {
    InvokeDeferred,
    MainResponse,
    OffEventDeferred,
    OnEventDeferred,
    OnceEventDeferred,
    PendingInvokeState,
    RendererRequest,
    ResponseErrorProp,
    UseInvokeOptions } from "./Hook.Types";
import { type IpcRendererEvent, ipcRenderer } from "electron/renderer";
import type {
    MainChannel,
    RendererChannel,
    SendEventDeferred,
    SendSyncDeferred } from "./Hook.Internal.Types";
import type { MainOwner, RendererOwner } from "../Decl.Types";
import type { Channel } from "../Channel.Types";
import { EmptyRequestParameter } from "../Callback/Callback";
import { GlobalSuspenseCacheMap } from "./SuspenseCacheMap";
import type { PackageKeys } from "../Internal/Registrar.Types";
import type { ReactiveEventContext } from "./Provider.Types";
import { ReactiveEventInternalContext } from "./Provider.Internal";

const PendingInvokeStateValue: PendingInvokeState = Object.freeze({
    Data: undefined,
    Error: undefined,
    IsPending: true
});

const SuspenseCache: GlobalSuspenseCacheMap = new GlobalSuspenseCacheMap();

async function InvokeAndNormalize<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>
>(
    Channel: ChannelType,
    Request: SafeRequest<RendererRequest<PackageKey, ChannelType>> = EmptyRequestParameter
): Promise<MainResponse<PackageKey, ChannelType>>
{
    try
    {
        const Response: MainResponse<PackageKey, ChannelType> =
            await ipcRenderer.invoke(
                Channel,
                Request
            ) as MainResponse<PackageKey, ChannelType>;

        return Response;
    }
    catch (CaughtError: unknown)
    {
        type ThisErrorProp = ResponseErrorProp<PackageKey, typeof Channel>;
        return {
            Data: undefined,
            Error: CaughtError as ThisErrorProp,
            IsPending: false
        };
    }
}

function GetCachedSuspenseInvokePromise<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Request<PackageKey, RendererOwner>
>(
    PackageKey: PackageKey,
    Channel: ChannelType,
    Request: SafeRequest<RendererRequest<PackageKey, typeof Channel>>
): Promise<MainResponse<PackageKey, ChannelType>>;
function GetCachedSuspenseInvokePromise<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>
>(
    PackageKey: PackageKey,
    Channel: ChannelType,
    Request: SafeRequest<RendererRequest<PackageKey, typeof Channel>> = EmptyRequestParameter
): Promise<MainResponse<PackageKey, ChannelType>>
{
    type ThisResponse = MainResponse<PackageKey, ChannelType>;
    const ResponsePromise: Promise<ThisResponse> =
        SuspenseCache.Get(PackageKey).Get(Channel).Put(Channel, InvokeAndNormalize, Request);

    return ResponsePromise;
}

export function useInvoke<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>
>(
    Channel: ChannelType,
    Options?: UseInvokeOptions | undefined
): MainResponse<PackageKey, ChannelType>;
export function useInvoke<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Request<PackageKey, RendererOwner>
>(
    Channel: ChannelType,
    Request: RendererRequest<PackageKey, ChannelType>,
    Options?: UseInvokeOptions
): MainResponse<PackageKey, ChannelType>;
export function useInvoke<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>>(
    Channel: ChannelType,
    RequestOrOptions?:
        | RendererRequest<PackageKey, ChannelType>
        | UseInvokeOptions,
    MaybeOptions?: UseInvokeOptions
): MainResponse<PackageKey, ChannelType>
{
    type ThisReturnType = MainResponse<PackageKey, ChannelType>;
    const [ State, SetState ] = useState<ThisReturnType>(PendingInvokeStateValue);

    const [ PackageKey ] = UsePackageKey<PackageKey>();

    const IsRequestOrOptionsOptions: boolean = (
        typeof RequestOrOptions === "object" &&
        RequestOrOptions !== null &&
        (
            Object.keys(RequestOrOptions).length === 0 ||
            "suspends" in RequestOrOptions
        )
    );

    const Options: UseInvokeOptions | undefined = ((): UseInvokeOptions | undefined =>
    {
        if (MaybeOptions !== undefined)
        {
            return MaybeOptions;
        }

        if (IsRequestOrOptionsOptions)
        {
            return RequestOrOptions;
        }

        return undefined;
    })();

    const Suspends: boolean = (
        Options !== undefined &&
        (Options?.suspends === true)
    );

    const Request: SafeRequest<RendererRequest<PackageKey, typeof Channel>> =
        IsRequestOrOptionsOptions
            ? EmptyRequestParameter
            : RequestOrOptions as RendererRequest<PackageKey, typeof Channel>;

    useEffect((): ReturnType<EffectCallback> =>
    {
        if (Suspends)
        {
            return;
        }

        let IsCancelled: boolean = false;

        SetState(PendingInvokeStateValue);

        InvokeAndNormalize<PackageKey, typeof Channel>(Channel, Request).then(
            (Response: MainResponse<PackageKey, typeof Channel>): void =>
            {
                if (!IsCancelled)
                {
                    SetState(Response);
                }
            }
        );

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ Channel, Request, Suspends ]);

    if (Suspends)
    {
        return use(GetCachedSuspenseInvokePromise<PackageKey, typeof Channel>(PackageKey, Channel, Request));
    }

    return State;
}

export function useInvokeDeferred<PackageKey extends PackageKeys>(
): Readonly<[ invokeDeferred: InvokeDeferred<PackageKey> ]>
{
    type DeferredReturnType = Awaited<ReturnType<InvokeDeferred<PackageKey>>>;

    async function invokeDeferred<ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
        channel: ChannelType
    ): Promise<DeferredReturnType>;
    async function invokeDeferred<ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
        channel: ChannelType,
        request: RendererRequest<PackageKey, ChannelType>
    ): Promise<DeferredReturnType>;
    async function invokeDeferred<ChannelType extends Channel.Any<PackageKey, RendererOwner>>(
        channel: ChannelType,
        request: SafeRequest<RendererRequest<PackageKey, ChannelType>> = EmptyRequestParameter
    ): Promise<DeferredReturnType>
    {
        const ArgumentVector: Array<unknown> = request === EmptyRequestParameter
            ? [ ]
            : [ request ];

        return await ipcRenderer.invoke(channel, ...ArgumentVector) as DeferredReturnType;
    }

    return [ invokeDeferred ] as const;
}

function UseReactiveEvent(): Readonly<ReactiveEventContext>
{
    return useContext<ReactiveEventContext>(ReactiveEventInternalContext);
}

function UsePackageKey<PackageKey extends PackageKeys>(): Readonly<[ PackageKey ]>
{
    const { PackageKey } = UseReactiveEvent();
    return [ PackageKey as PackageKey ] as const;
}

export function useOnEvent<PackageKey extends PackageKeys, ChannelType extends MainChannel<PackageKey>>(
    channel: ChannelType,
    listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
): void
{
    useEffect((): ReturnType<EffectCallback> =>
    {
        ipcRenderer.on(channel, listener);
        return (): void =>
        {
            ipcRenderer.off(channel, listener);
        };
    }, [ channel, listener ]);
}

export function useOnEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ onEventDeferred: OnEventDeferred<PackageKey> ]>
{
    function onEventDeferred<ChannelType extends MainChannel<PackageKey>>(
        channel: ChannelType,
        listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
    ): void
    {
        ipcRenderer.on(channel, listener);
    };

    return [ onEventDeferred ] as const;
}

export function useOffEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>
{
    function offEventDeferred<ChannelType extends MainChannel<PackageKey>>(
        channel: ChannelType,
        listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
    ): void
    {
        ipcRenderer.off(channel, listener);
    };

    return [ offEventDeferred ] as const;
}

export function useSendEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ sendEventDeferred: SendEventDeferred<PackageKey> ]>
{
    function sendEventDeferred<
        ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
        channel: ChannelType
    ): void;
    function sendEventDeferred<
        ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
        channel: ChannelType,
        request: RendererRequest<PackageKey, ChannelType>
    ): void;
    function sendEventDeferred<
        ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
        channel: ChannelType,
        request: SafeRequest<RendererRequest<PackageKey, ChannelType>> = EmptyRequestParameter
    ): void
    {
        const ArgumentVector: Array<unknown> = request === EmptyRequestParameter
            ? [ ]
            : [ request ];

        ipcRenderer.send(channel, ...ArgumentVector);
    };

    return [ sendEventDeferred ] as const;
}

export function useSendEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
    channel: ChannelType
): void;
export function useSendEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
    channel: ChannelType,
    request: RendererRequest<PackageKey, ChannelType>
): void;
export function useSendEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
    channel: ChannelType,
    request: SafeRequest<RendererRequest<PackageKey, ChannelType>> = EmptyRequestParameter
): void
{
    useEffect((): ReturnType<EffectCallback> =>
    {
        const ArgumentVector: Array<unknown> = request === EmptyRequestParameter
            ? [ ]
            : [ request ];

        ipcRenderer.send(channel, ...ArgumentVector);
    }, [ channel, request ]);
}

export function useOnceEvent<PackageKey extends PackageKeys, ChannelType extends MainChannel<PackageKey>>(
    channel: ChannelType,
    listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
): void
{
    useEffect((): ReturnType<EffectCallback> =>
    {
        ipcRenderer.once(channel, listener);
        return (): void =>
        {
            ipcRenderer.off(channel, listener);
        };
    }, [ channel, listener ]);
}

export function useOnceEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ onceEventDeferred: OnceEventDeferred<PackageKey> ]>
{
    function onceEventDeferred<ChannelType extends MainChannel<PackageKey>>(
        channel: ChannelType,
        listener: Callback<PackageKey, MainOwner, IpcRendererEvent, typeof channel>
    ): void
    {
        ipcRenderer.once(channel, listener);
    };

    return [ onceEventDeferred ] as const;
}

export function useSendSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>
>(
    Channel: ChannelType
): MainResponse<PackageKey, ChannelType>;
export function useSendSync<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Request<PackageKey, RendererOwner>
>(
    Channel: ChannelType,
    Request: RendererRequest<PackageKey, ChannelType>
): MainResponse<PackageKey, ChannelType>;
export function useSendSync<
    PackageKey extends PackageKeys,
    ChannelType extends RendererChannel<PackageKey>>(
    Channel: ChannelType,
    Request: SafeRequest<RendererRequest<PackageKey, ChannelType>> = EmptyRequestParameter
): MainResponse<PackageKey, ChannelType>
{
    type ThisReturnType = MainResponse<PackageKey, ChannelType>;
    const [ State, SetState ] = useState<ThisReturnType>(PendingInvokeStateValue);

    useEffect((): ReturnType<EffectCallback> =>
    {
        let IsCancelled: boolean = false;

        SetState(PendingInvokeStateValue);

        SendSyncAndNormalize<PackageKey, typeof Channel>(Channel, Request).then(
            (Response: MainResponse<PackageKey, typeof Channel>): void =>
            {
                if (!IsCancelled)
                {
                    SetState(Response);
                }
            }
        );

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ Channel, Request ]);

    return State;
}

export function useSendSyncDeferred<PackageKey extends PackageKeys>(
): Readonly<[ sendSyncDeferred: SendSyncDeferred<PackageKey> ]>
{
    type DeferredReturnType = ReturnType<SendSyncDeferred<PackageKey>>;

    function sendSyncDeferred<ChannelType extends Channel.NoRequest<PackageKey, RendererOwner>>(
        channel: ChannelType
    ): DeferredReturnType;
    function sendSyncDeferred<ChannelType extends Channel.Request<PackageKey, RendererOwner>>(
        channel: ChannelType,
        request: RendererRequest<PackageKey, ChannelType>
    ): DeferredReturnType;
    function sendSyncDeferred<ChannelType extends Channel.Any<PackageKey, RendererOwner>>(
        channel: ChannelType,
        request: SafeRequest<RendererRequest<PackageKey, ChannelType>> = EmptyRequestParameter
    ): DeferredReturnType
    {
        const ArgumentVector: Array<unknown> = request === EmptyRequestParameter
            ? [ ]
            : [ request ];

        return ipcRenderer.sendSync(channel, ...ArgumentVector) as DeferredReturnType;
    }

    return [ sendSyncDeferred ] as const;
}
