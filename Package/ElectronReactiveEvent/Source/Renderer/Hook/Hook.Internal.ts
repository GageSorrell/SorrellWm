/* File:      Hook.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { type EffectCallback, use, useCallback, useContext, useEffect } from "react";
import type {
    EmptyOverloadParameter,
    EventCollectionInternal,
    EventRecordAny } from "../../Listener/Listener.Internal.Types";
import type {
    EventArray,
    EventCollection,
    EventRecordStrict,
    Request,
    ResponseSync,
    SendableListener } from "../../Listener/index.js";
import type {
    InvokeEventDeferred,
    InvokeResponse,
    InvokeResponseInternal,
    InvokeResponses,
    InvokeResponsesInternal,
    MainEventListenerRecord,
    MainEventListenerRecordEntry,
    OffEventDeferred,
    OffEventsDeferred,
    OnEventDeferred,
    OnceEventDeferred,
    RequestSerializer,
    ResponseIndeterminate,
    UseInvokeEventOptions } from "./Hook.Internal.Types";
import type { MainOwner, RendererOwner } from "../../Decl.Types";
import type { PromiseCache, ReactiveEventContextInternal } from "../Provider.Internal.Types";
import type { Channel } from "../../Channel";
import { EmptyOverloadParameterValue } from "../../Listener/Listener.Internal";
import type { PackageKeys, RecordEntry } from "../../Internal";
import { ReactiveEventInternalContext } from "../Provider.Internal";
import { ipcRenderer } from "electron/renderer";
import { channel } from "node:diagnostics_channel";

const IndeterminateResponse: ResponseIndeterminate =
    {
        data: undefined,
        error: undefined,
        isPending: true
    } as const;

function UseReactiveEventInternal(): ReactiveEventContextInternal
{
    return useContext<ReactiveEventContextInternal>(ReactiveEventInternalContext);
}

export function UsePromiseCache(): Readonly<[ ReactiveEventContextInternal["PutCachedPromise"] ]>
{
    const { PutCachedPromise } = UseReactiveEventInternal();
    return [ PutCachedPromise ] as const;
}

function DefaultSerializer<RequestType = unknown>(
    Request: RequestType
): string
{
    return JSON.stringify(Request);
}

// export function useInvokeEvent<
//     PackageKey extends PackageKeys,
//     ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
//     channel: ChannelType
// ): InvokeResponse<PackageKey, typeof channel, undefined>;
// export function useInvokeEvent<
//     PackageKey extends PackageKeys,
//     ChannelType extends Channel.Invokable.NoRequest<PackageKey>,
//     SuspendsType extends boolean>(
//     channel: ChannelType,
//     options: UseInvokeEventOptions<SuspendsType>
// ): InvokeResponse<PackageKey, typeof channel, typeof options>;
// export function useInvokeEvent<
//     PackageKey extends PackageKeys,
//     ChannelType extends Channel.Invokable.Request<PackageKey>>(
//     channel: ChannelType,
//     request: Request<PackageKey, RendererOwner, typeof channel>
// ): InvokeResponse<PackageKey, typeof channel, undefined>;
// export function useInvokeEvent<
//     PackageKey extends PackageKeys,
//     ChannelType extends Channel.Invokable.Request<PackageKey>,
//     SuspendsType extends boolean>(
//     channel: ChannelType,
//     request: Request<PackageKey, RendererOwner, typeof channel>,
//     options: UseInvokeEventOptions<SuspendsType>
// ): InvokeResponse<PackageKey, typeof channel, typeof options>;
// export function useInvokeEvent<
//     PackageKey extends PackageKeys,
//     ChannelType extends Channel.Invokable.Any<PackageKey>,
//     SuspendsType extends boolean>(
//     channel: ChannelType,
//     requestOrOptions:
//         | Request<PackageKey, RendererOwner, typeof channel>
//         | UseInvokeEventOptions<SuspendsType>
//         | EmptyOverloadParameter = EmptyOverloadParameterValue,
//     options:
//         | UseInvokeEventOptions<SuspendsType>
//         | EmptyOverloadParameter = EmptyOverloadParameterValue
// ): InvokeResponseInternal<PackageKey, typeof channel, typeof options>
// {

export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
    channel: ChannelType
): InvokeResponse<PackageKey, typeof channel, undefined>;
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.NoRequest<PackageKey>,
    SuspendsType extends boolean>(
    channel: ChannelType,
    options: UseInvokeEventOptions<SuspendsType>
): InvokeResponse<PackageKey, typeof channel, typeof options>;
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Request<PackageKey>>(
    channel: ChannelType,
    request: Request<PackageKey, RendererOwner, typeof channel>
): InvokeResponse<PackageKey, typeof channel, undefined>;
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Request<PackageKey>,
    SuspendsType extends boolean>(
    channel: ChannelType,
    request: Request<PackageKey, RendererOwner, typeof channel>,
    options: UseInvokeEventOptions<SuspendsType>
): InvokeResponse<PackageKey, typeof channel, typeof options>;
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>,
    SuspendsType extends boolean>(
    channel: ChannelType,
    requestOrOptions:
        | Request<PackageKey, RendererOwner, typeof channel>
        | UseInvokeEventOptions<SuspendsType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue,
    options:
        | UseInvokeEventOptions<SuspendsType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): InvokeResponseInternal<PackageKey, typeof channel, typeof options>
{
    type ThisRequest = Request<PackageKey, RendererOwner, typeof channel>;
    type OverloadedArguments =
        {
            Options:
                | UseInvokeEventOptions
                | EmptyOverloadParameter;
            Request:
                | ThisRequest
                | EmptyOverloadParameter;
        };

    function HandleOverloadedArguments(): OverloadedArguments
    {
        if (options === EmptyOverloadParameterValue)
        {
            if (requestOrOptions !== EmptyOverloadParameterValue &&
                typeof requestOrOptions === "object" &&
                requestOrOptions !== null
            )
            {
                const NumKeys: number = Object.keys(requestOrOptions).length;
                const IsRequestOrOptionsOptions: boolean = (
                    (
                        NumKeys === 0 ||
                        (
                            NumKeys === 1 &&
                            (
                                "suspend" in requestOrOptions ||
                                "equalityCheck" in requestOrOptions
                            )
                        ) ||
                        (
                            NumKeys === 2 &&
                            (
                                "suspend" in requestOrOptions &&
                                "equalityCheck" in requestOrOptions
                            )
                        )
                    )
                );

                return IsRequestOrOptionsOptions
                    ? {
                        Options: requestOrOptions as UseInvokeEventOptions,
                        Request: EmptyOverloadParameterValue
                    }
                    : {
                        Options: EmptyOverloadParameterValue,
                        Request: requestOrOptions as ThisRequest
                    };
            }
            else
            {
                return {
                    Options: EmptyOverloadParameterValue,
                    Request: EmptyOverloadParameterValue
                };
            }
        }
        else
        {
            return requestOrOptions === EmptyOverloadParameterValue
                ? {
                    Options: EmptyOverloadParameterValue,
                    Request: EmptyOverloadParameterValue
                }
                : {
                    Options: EmptyOverloadParameterValue,
                    Request: requestOrOptions as ThisRequest
                };
        }
    }

    const { Options, Request } = HandleOverloadedArguments();

    const Suspends: boolean = (
        Options !== EmptyOverloadParameterValue &&
        typeof Options === "object" &&
        Options !== null &&
        "suspend" in Options &&
        (Options.suspend === true)
    );

    type ThisEventRecord = EventRecordAny<PackageKey, MainOwner, typeof channel>;

    const EventRecord: ThisEventRecord =
        {
            [channel]: Request as Request<PackageKey, MainOwner, typeof channel>
        };
    // const { data: RecordData, error: RecordError, isPending } =
    //     useInvokeEventsInternal<PackageKey, typeof channel>(EventRecord, Options);

    type ThisInternalResponse = InvokeResponsesInternal<PackageKey, ChannelType, typeof Options>;
    const InternalResult: ThisInternalResponse =
        useInvokeEventsInternal<PackageKey, typeof channel, typeof Suspends>(EventRecord, Options);

    type ThisReturnType = InvokeResponseInternal<PackageKey, typeof channel, typeof options>;
    return (Suspends
        ? {
            data: InternalResult.data?.[channel],
            error: InternalResult.error?.[channel],
            isPending: InternalResult.isPending
        } as ThisReturnType
        : {
            data: InternalResult.data?.[channel],
            error: InternalResult.error?.[channel]
        }) as ThisReturnType;
}

export function useInvokeEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
    events: EventArray<PackageKey, MainOwner, ChannelType>
): InvokeResponses<PackageKey, ChannelType>;
export function useInvokeEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Request<PackageKey>>(
    events: EventRecordStrict<PackageKey, MainOwner, ChannelType>
): InvokeResponses<PackageKey, ChannelType>;
export function useInvokeEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>>(
    events: EventCollection<PackageKey, MainOwner, ChannelType>
): InvokeResponses<PackageKey, ChannelType>;
export function useInvokeEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
    events: EventArray<PackageKey, MainOwner, ChannelType>,
    options: UseInvokeEventOptions
): InvokeResponses<PackageKey, ChannelType, typeof options>;
export function useInvokeEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Request<PackageKey>>(
    events: EventRecordStrict<PackageKey, MainOwner, ChannelType>,
    options: UseInvokeEventOptions
): InvokeResponses<PackageKey, ChannelType, typeof options>;
export function useInvokeEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>>(
    events: EventCollection<PackageKey, MainOwner, ChannelType>,
    options: UseInvokeEventOptions
): InvokeResponses<PackageKey, ChannelType, typeof options>;
export function useInvokeEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>>(
    events: EventCollection<PackageKey, MainOwner, ChannelType>,
    options:
        | UseInvokeEventOptions
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): InvokeResponsesInternal<PackageKey, ChannelType, typeof options>
{
    type ThisRequest = Request<PackageKey, RendererOwner, typeof channel>;
    type OverloadedArguments =
        {
            Options:
                | UseInvokeEventOptions
                | EmptyOverloadParameter;
            Request:
                | ThisRequest
                | EmptyOverloadParameter;
        };

    function HandleOverloadedArguments(): OverloadedArguments
    {
        if (options === EmptyOverloadParameterValue)
        {
            if (requestOrOptions !== EmptyOverloadParameterValue &&
                typeof requestOrOptions === "object" &&
                requestOrOptions !== null
            )
            {
                const NumKeys: number = Object.keys(requestOrOptions).length;
                const IsRequestOrOptionsOptions: boolean = (
                    (
                        NumKeys === 0 ||
                        (
                            NumKeys === 1 &&
                            (
                                "suspend" in requestOrOptions ||
                                "equalityCheck" in requestOrOptions
                            )
                        ) ||
                        (
                            NumKeys === 2 &&
                            (
                                "suspend" in requestOrOptions &&
                                "equalityCheck" in requestOrOptions
                            )
                        )
                    )
                );

                return IsRequestOrOptionsOptions
                    ? {
                        Options: requestOrOptions as UseInvokeEventOptions,
                        Request: EmptyOverloadParameterValue
                    }
                    : {
                        Options: EmptyOverloadParameterValue,
                        Request: requestOrOptions as ThisRequest
                    };
            }
            else
            {
                return {
                    Options: EmptyOverloadParameterValue,
                    Request: EmptyOverloadParameterValue
                };
            }
        }
        else
        {
            return requestOrOptions === EmptyOverloadParameterValue
                ? {
                    Options: EmptyOverloadParameterValue,
                    Request: EmptyOverloadParameterValue
                }
                : {
                    Options: EmptyOverloadParameterValue,
                    Request: requestOrOptions as ThisRequest
                };
        }
    }

    const { Options, Request } = HandleOverloadedArguments();
    // return useInvokeEventsInternal(/* @TODO */);
}
function useInvokeEventsInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Invokable.Any<PackageKey>,
    SuspendsType extends boolean
>(
    Events: EventCollectionInternal<PackageKey, MainOwner, ChannelType>,
    Options:
        | UseInvokeEventOptions<SuspendsType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): InvokeResponsesInternal<PackageKey, ChannelType, typeof Options>
{
    // type ThisResponse = InvokeResponseInternal<PackageKey, typeof channel, typeof Options>;

    const RequestSerializer: RequestSerializer =
        (Options !== EmptyOverloadParameterValue && "requestSerializer" in Options)
            ? Options.requestSerializer
            : DefaultSerializer;

    const [ PutCachedPromise ] = UsePromiseCache();

    const Suspends: boolean = (
        Options !== EmptyOverloadParameterValue &&
        typeof Options === "object" &&
        Options !== null &&
        "suspend" in Options &&
        (Options.suspend === true)
    );

    function InvokeEvents(): Promise<unknown>
    {
        const Entries: Array<RecordEntry<typeof Events>> =
            Object.entries(Events) as Array<RecordEntry<typeof Events>>;
        type EntryResponse<EntryType extends RecordEntry<typeof Events>> =
            EntryType extends [ infer KeyType, unknown ]
                ? KeyType extends keyof typeof Events
                    ? ResponseSync<
                        PackageKey,
                        Extract<
                            KeyType,
                            Channel.Invokable.Any<PackageKey>
                        >
                    >
                    : never
                : never;

        function InvokeEntry(Channel: string, Request: unknown): Promise<unknown>
        {
            if (Request !== EmptyOverloadParameterValue)
            {
                return ipcRenderer.invoke(Channel, Request);
            }
            else
            {
                return ipcRenderer.invoke(Channel);
            }
        }

        const InvokePromises: Promise<unknown> =

        // @TODO Where to pick back up, 2:17p 4/6:
        //
        // Get rid of plural hooks, but do implement them for `main`.


        Entry: RecordEntry<typeof Events>): Promise<EntryResponse<typeof Entry>>
        {
            PutCachedPromise(Entry[0], Entry[1], InvokeEntry);
        }

        const InvokePromises: Array<Promise<EntryResponse<RecordEntry<typeof Events>>>> =
            Entries.map(InvokeEntry);

        return Promise.all(InvokePromises);
    }


    type ThisResponseSyncFulfilled = Exclude<
        ResponseSync<PackageKey, typeof channel>,
        ResponseIndeterminate
    >;

    function IpcInvoke(): Promise<ThisResponseSyncFulfilled>
    {
        if (Request === EmptyOverloadParameterValue)
        {
            return ipcRenderer.invoke(channel, Request) as Promise<ThisResponseSyncFulfilled>;
        }
        else
        {
            return ipcRenderer.invoke(channel) as Promise<ThisResponseSyncFulfilled>;
        }
    }

    const ThisCachedKey: string = GetCachedKey();
    const ShouldInvoke: boolean = ThisCachedKey === CachedKeyRef.current;

    function SetResponseFromFulfilled(New: ThisResponseSyncFulfilled): void
    {
        SetResponse((_Old: ThisResponse): ThisResponse =>
        {
            return {
                ...New,
                isPending: false
            };
        });
    }

    if (ShouldInvoke)
    {
        CachedKeyRef.current = ThisCachedKey;

        if (Suspends)
        {
            const ResponseFulfilled: ThisResponseSyncFulfilled =
                use(IpcInvoke()) as ThisResponseSyncFulfilled;
            SetResponseFromFulfilled(ResponseFulfilled);
        }
        else
        {
            IpcInvoke().then(SetResponseFromFulfilled);
        }
    }

    return Response;
}

export function useInvokeEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ invokeEventDeferred: InvokeEventDeferred<PackageKey> ]>
{
    async function invokeEventDeferred<
        ChannelType extends Channel.Invokable.NoRequest<PackageKey>>(
        channel: ChannelType
    ): Promise<ResponseSync<PackageKey, typeof channel>>;
    async function invokeEventDeferred<
        ChannelType extends Channel.Invokable.Request<PackageKey>>(
        channel: ChannelType,
        request: Request<PackageKey, RendererOwner, typeof channel>
    ): Promise<ResponseSync<PackageKey, typeof channel>>;
    async function invokeEventDeferred<
        ChannelType extends Channel.Invokable.Request<PackageKey>>(
        channel: ChannelType,
        request:
            | Request<PackageKey, RendererOwner, typeof channel>
            | EmptyOverloadParameter = EmptyOverloadParameterValue
    ): Promise<ResponseSync<PackageKey, typeof channel>>
    {
        if (request !== EmptyOverloadParameterValue)
        {
            return ipcRenderer.invoke(channel, request);
        }
        else
        {
            return ipcRenderer.invoke(channel);
        }
    }

    return [ invokeEventDeferred ] as const;
}

export function useOnEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
>(
    channel: ChannelType,
    listener: SendableListener<PackageKey, MainOwner, typeof channel>
): Readonly<[ offEventDeferred: (() => void) ]>
{
    const offEventDeferred: (() => void) = useCallback((): void =>
    {
        ipcRenderer.off(channel, listener);
    }, [ channel, listener ]);

    useEffect((): ReturnType<EffectCallback> =>
    {
        ipcRenderer.on(channel, listener);

        return offEventDeferred;
    }, [ channel, listener, offEventDeferred ]);

    return [ offEventDeferred ] as const;
}

export function useOnEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ onEventDeferred: OnEventDeferred<PackageKey> ]>
{
    function onEventDeferred<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
    >(
        channel: ChannelType,
        listener: SendableListener<PackageKey, MainOwner, typeof channel>
    ): Readonly<[ offEventDeferred: (() => void) ]>
    {
        ipcRenderer.on(channel, listener);

        function offEventDeferred(): void
        {
            ipcRenderer.off(channel, listener);
        }

        return [ offEventDeferred ] as const;
    }

    return [ onEventDeferred ] as const;
}

export function useOffEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>
{
    function offEventDeferred<
        ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
    >(
        channel: ChannelType,
        listener: SendableListener<PackageKey, MainOwner, typeof channel>
    ): void
    {
        ipcRenderer.off(channel, listener);
    }

    return [ offEventDeferred ] as const;
}

export function useOnceEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
>(
    channel: ChannelType,
    listener: SendableListener<PackageKey, MainOwner, typeof channel>
): Readonly<[ offEventDeferred: (() => void) ]>
{
    const offEventDeferred: (() => void) = useCallback((): void =>
    {
        ipcRenderer.off(channel, listener);
    }, [ channel, listener ]);

    useEffect((): ReturnType<EffectCallback> =>
    {
        ipcRenderer.once(channel, listener);

        return offEventDeferred;
    }, [ channel, listener, offEventDeferred ]);

    return [ offEventDeferred ] as const;
}

export function useOnceEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ onEventDeferred: OnceEventDeferred<PackageKey> ]>
{
    function onEventDeferred<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
    >(
        channel: ChannelType,
        listener: SendableListener<PackageKey, MainOwner, typeof channel>
    ): Readonly<[ offEventDeferred: (() => void) ]>
    {
        ipcRenderer.once(channel, listener);

        function offEventDeferred(): void
        {
            ipcRenderer.off(channel, listener);
        }

        return [ offEventDeferred ] as const;
    }

    return [ onEventDeferred ] as const;
}

function RegisterEventRecordEntry<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
>([ Channel, Listener ]: [ ChannelType, SendableListener<PackageKey, MainOwner, ChannelType> ]): void
{
    ipcRenderer.on(Channel, Listener);
}

function UnregisterEventRecordEntry<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
>([ Channel, Listener ]: [ ChannelType, SendableListener<PackageKey, MainOwner, ChannelType> ]): void
{
    ipcRenderer.off(Channel, Listener);
}

export function useOnEvents<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Sendable.Any<PackageKey, MainOwner>
>(
    events: MainEventListenerRecord<PackageKey, ChannelType>
): Readonly<[ offEventsDeferred: (() => void) ]>
{
    type ThisRecordEntry = MainEventListenerRecordEntry<
        PackageKey,
        ChannelType,
        SendableListener<PackageKey, MainOwner, ChannelType>
    >;

    const offEventsDeferred: (() => void) = useCallback((): void =>
    {
        const RecordEntries: Array<ThisRecordEntry> = Object.entries(events) as Array<ThisRecordEntry>;
        RecordEntries.forEach(UnregisterEventRecordEntry);
    }, [ events ]);

    useEffect((): ReturnType<EffectCallback> =>
    {
        const RecordEntries: Array<ThisRecordEntry> = Object.entries(events) as Array<ThisRecordEntry>;
        RecordEntries.forEach(RegisterEventRecordEntry);

        return offEventsDeferred;
    }, [ events, offEventsDeferred ]);

    return [ offEventsDeferred ] as const;
}

export function useOffEventsDeferred<PackageKey extends PackageKeys>(
): Readonly<[ offEventsDeferred: OffEventsDeferred<PackageKey> ]>
{
    return [ ] as const;
}
