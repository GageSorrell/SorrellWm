/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @stylistic/max-len */

import {
    type Context,
    type ReactNode,
    type RefObject,
    createContext,
    use,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState } from "react";
import type {
    PEventProvider,
    TEventCallbackRecord,
    TEventCallbackRecordInternal,
    TEventContext,
    TMainEventFactoryReturnType,
    TSendEventDeferred,
    TUseSendEventDeferred,
    TUseSendEventReturnType } from "./Factory.Types";
import type {
    TCallback,
    TChannel,
    TChannelsNoRequest,
    TChannelsWithRequest,
    TRegisterCallback,
    TRegisterCallbacks,
    TRequest,
    TResponse,
    TUseRegisterCallbackDeferred,
    TUseRegisterCallbacksDeferred } from "./Internal";

export const GetMainFunctions = <MainEventsRegistrarType, RendererEventsRegistrarType>(
): TMainEventFactoryReturnType<MainEventsRegistrarType, RendererEventsRegistrarType> =>
{
    async function SendEvent<ChannelType extends TChannelsWithRequest<MainEventsRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<typeof Channel, MainEventsRegistrarType>
    ): Promise<void>;
    async function SendEvent<ChannelType extends TChannelsNoRequest<MainEventsRegistrarType>>(Channel: ChannelType): Promise<void>;
    async function SendEvent<ChannelType extends TChannelsWithRequest<MainEventsRegistrarType> | TChannelsNoRequest<MainEventsRegistrarType>>(
        Channel: ChannelType,
        Request?: TRequest<typeof Channel, MainEventsRegistrarType>
    ): Promise<void>
    {
        // @TODO
    }

    return {
        RegisterCallback: <ChannelType extends TChannel<RendererEventsRegistrarType>>(
            Channel: ChannelType,
            Callback: TCallback<typeof Channel, RendererEventsRegistrarType>
        ): void =>
        {
            // @TODO
        },
        RegisterCallbacks: <ChannelType extends TChannel<RendererEventsRegistrarType>>(
            Record: TEventCallbackRecord<ChannelType, RendererEventsRegistrarType>
        ): void =>
        {
            // @TODO
        },
        SendEvent,
        UnregisterAll: <ChannelType extends TChannel<RendererEventsRegistrarType>>(
            Channel: ChannelType
        ): void =>
        {

        },
        UnregisterCallback: <ChannelType extends TChannel<RendererEventsRegistrarType>>(
            Channel: ChannelType,
            Callback: TCallback<typeof Channel, RendererEventsRegistrarType>
        ): void =>
        {
            // @TODO
        },
        UnregisterCallbacks: <ChannelType extends TChannel<RendererEventsRegistrarType>>(
            Record: TEventCallbackRecord<ChannelType, RendererEventsRegistrarType>
        ): void =>
        {
            // @TODO
        }
    };
};

const ResponsePromiseCache: Map<string, Promise<unknown>> = new Map<string, Promise<unknown>>();

let FactoryContext: unknown | undefined = undefined;

function GetCacheKey<ChannelType extends keyof EventRegistrarType, EventRegistrarType>(
    Channel: ChannelType,
    Request: unknown
): string
{
    return JSON.stringify([ Channel, Request ]);
}

/** Call this once, and export its result a module, to use in components. */
export const GetEventHooks = <MainEventsRegistrarType, RendererEventsRegistrarType>(
): TEventContext<MainEventsRegistrarType, RendererEventsRegistrarType> =>
{
    type FEventContext = TEventContext<MainEventsRegistrarType, RendererEventsRegistrarType>;
    return useContext<FEventContext>(FactoryContext as Context<FEventContext>);
};

export const EventProvider = <MainEventsRegistrarType, RendererEventsRegistrarType>(
    { children, value }: PEventProvider
): ReactNode =>
{
    const {
        invoke: Invoke,
        off: Off,
        on: On,
        once: Once,
        send: Send
    }  = value;

    function GetOrCreateResponsePromise<ChannelType extends keyof RendererEventsRegistrarType>(
        Channel: ChannelType,
        Request: unknown
    ): Promise<TResponse<ChannelType, RendererEventsRegistrarType>>
    {
        type FResponse = Promise<TResponse<ChannelType, RendererEventsRegistrarType>>;

        const CacheKey: string = GetCacheKey<ChannelType, RendererEventsRegistrarType>(Channel, Request);

        const ExistingPromise: Promise<unknown> | undefined = ResponsePromiseCache.get(CacheKey);

        if (ExistingPromise !== undefined)
        {
            return ExistingPromise as FResponse;
        }

        const ResponsePromise: FResponse = Invoke(Channel as string, Request);

        ResponsePromiseCache.set(CacheKey, ResponsePromise);

        return ResponsePromise;
    }

    function UseSendEventSuspends<ChannelType extends keyof RendererEventsRegistrarType>(
        Channel: ChannelType,
        Request: undefined | TRequest<ChannelType, RendererEventsRegistrarType>
    ): TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>
    {
        const InitialResponse: unknown = use(
            GetOrCreateResponsePromise<keyof RendererEventsRegistrarType>(Channel as keyof RendererEventsRegistrarType, Request)
        );

        const [ Response ] = useState<unknown>(InitialResponse);

        return Response as TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>;
    }

    function UseSendEventNoSuspend<ChannelType extends Extract<keyof RendererEventsRegistrarType, string>>(
        Channel: ChannelType,
        Request: undefined | TRequest<ChannelType, RendererEventsRegistrarType>
    ): TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>
    {
        const [ Response, SetResponse ] = useState<unknown>(undefined);

        useEffect((): (() => void) =>
        {
            let IsIgnored: boolean = false;

            SetResponse(undefined);

            void (async (): Promise<void> =>
            {
                const NextResponse: unknown = await Invoke(Channel, Request);

                if (!IsIgnored)
                {
                    SetResponse(NextResponse);
                }
            })();

            return (): void =>
            {
                IsIgnored = true;
            };
        }, [ Channel, Request ]);

        return Response as TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>;
    }

    function UseSendEvent<ChannelType extends TChannelsWithRequest<RendererEventsRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<ChannelType, RendererEventsRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>;
    function UseSendEvent<ChannelType extends TChannelsNoRequest<RendererEventsRegistrarType>>(
        Channel: ChannelType
    ): TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>;
    function UseSendEvent<ChannelType extends TChannelsNoRequest<RendererEventsRegistrarType>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>;
    function UseSendEvent<ChannelType extends Extract<keyof RendererEventsRegistrarType, string>>(
        Channel: ChannelType,
        Request?: TRequest<ChannelType, RendererEventsRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<ChannelType, RendererEventsRegistrarType>
    {
        if (Suspend)
        {
            return UseSendEventSuspends(Channel, Request);
        }
        else
        {
            return UseSendEventNoSuspend(Channel, Request);
        }
    }

    function UseSendEventDeferred(): ReturnType<TUseSendEventDeferred<RendererEventsRegistrarType>>
    {
        const [ IsPending, SetIsPending ] = useState<boolean>(false);
        const LatestRequestIdRef: RefObject<number> = useRef<number>(0);

        type FSendEventReturnType = ReturnType<TSendEventDeferred<RendererEventsRegistrarType>>;

        async function SendEventDeferredBase<ChannelType extends TChannelsNoRequest<RendererEventsRegistrarType>>(
            Channel: ChannelType
        ): FSendEventReturnType;
        async function SendEventDeferredBase<ChannelType extends TChannelsWithRequest<RendererEventsRegistrarType>>(
            Channel: ChannelType,
            Request: TRequest<ChannelType, RendererEventsRegistrarType>
        ): FSendEventReturnType;
        async function SendEventDeferredBase<ChannelType extends TChannelsWithRequest<RendererEventsRegistrarType>>(
            Channel: ChannelType,
            Request?: TRequest<ChannelType, RendererEventsRegistrarType>
        ): FSendEventReturnType
        {
            const RequestId: number = ++LatestRequestIdRef.current;

            SetIsPending(true);

            let Out: Awaited<FSendEventReturnType> | undefined = undefined;

            try
            {
                const NextResponse: unknown = await Invoke(Channel as string, Request);

                if (RequestId === LatestRequestIdRef.current)
                {
                    Out = NextResponse as Awaited<FSendEventReturnType>;
                }
            }
            catch (CaughtError: unknown)
            {
                if (RequestId === LatestRequestIdRef.current)
                {
                    throw new Error(JSON.stringify(CaughtError));
                }
            }
            finally
            {
                if (RequestId === LatestRequestIdRef.current)
                {
                    SetIsPending(false);
                }

            }

            return Out;
        }

        return [ SendEventDeferredBase, IsPending ] as const;
    }

    type FEventCallbackRecord = TEventCallbackRecordInternal<MainEventsRegistrarType>;
    const [ Callbacks, SetCallbacks ] = useState<FEventCallbackRecord>({ });

    function UseRegisterCallback<ChannelType extends keyof MainEventsRegistrarType>(
        Channel: ChannelType,
        Callback: TCallback<ChannelType, MainEventsRegistrarType>
    ): void
    {
        const IsAlreadyRegistered: boolean = (
            Channel in Callbacks &&
            Callbacks[Channel] !== undefined &&
            Callbacks[Channel].includes(Callback)
        );

        if (!IsAlreadyRegistered)
        {
            SetCallbacks((Old: FEventCallbackRecord): FEventCallbackRecord =>
            {
                const New: FEventCallbackRecord = { ...Old };
                New[Channel] = { ...(New[Channel] || [ ]) };
                New[Channel].push(Callback);
                return New;
            });
        }
    }

    const RegisterCallbackDeferred: TRegisterCallback<MainEventsRegistrarType> =
        useCallback(<ChannelType extends TChannel<MainEventsRegistrarType>>(
            Channel: ChannelType,
            Callback: TCallback<ChannelType, MainEventsRegistrarType>
        ): void =>
        {
            const IsAlreadyRegistered: boolean = (
                Channel in Callbacks &&
                Callbacks[Channel] !== undefined &&
                Callbacks[Channel].includes(Callback)
            );

            if (!IsAlreadyRegistered)
            {
                SetCallbacks((Old: FEventCallbackRecord): FEventCallbackRecord =>
                {
                    const New: FEventCallbackRecord = { ...Old };
                    New[Channel] = { ...(New[Channel] || [ ]) };
                    New[Channel].push(Callback);
                    return New;
                });
            }
        }, [ Callbacks, SetCallbacks ]);

    type FUseRegisterCallbackDeferred = TUseRegisterCallbackDeferred<MainEventsRegistrarType>;
    const UseRegisterCallbackDeferred: FUseRegisterCallbackDeferred = useCallback((): ReturnType<FUseRegisterCallbackDeferred> =>
    {
        return [ RegisterCallbackDeferred ] as const;
    }, [ RegisterCallbackDeferred ]);

    const UseRegisterCallbacks: TRegisterCallbacks<MainEventsRegistrarType> =
        useCallback(<ChannelType extends TChannel<MainEventsRegistrarType>>(
            Record: TEventCallbackRecord<ChannelType, MainEventsRegistrarType>
        ): void =>
        {
            Object.entries(Record).forEach(([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: TCallback<ChannelType, MainEventsRegistrarType> = InCallback as TCallback<ChannelType, MainEventsRegistrarType>;
                const IsAlreadyRegistered: boolean | undefined = (
                    Channel in Callbacks &&
                    Callbacks[Channel] !== undefined &&
                    Callbacks[Channel]?.includes(Callback)
                );

                if (!IsAlreadyRegistered)
                {
                    SetCallbacks((Old: FEventCallbackRecord): FEventCallbackRecord =>
                    {
                        const New: FEventCallbackRecord = { ...Old };
                        New[Channel as ChannelType] = { ...(New[Channel] || [ ]) };
                        New[Channel]?.push(Callback);
                        return New;
                    });
                }
            });
        }, [ Callbacks, SetCallbacks ]);

    type FUseRegisterCallbacksDeferred = TUseRegisterCallbacksDeferred<MainEventsRegistrarType>;
    const UseRegisterCallbacksDeferred: FUseRegisterCallbacksDeferred =
        useCallback((): ReturnType<FUseRegisterCallbacksDeferred> =>
        {
            return [ UseRegisterCallbacks ] as const;
        }, [ UseRegisterCallbacks ]);

    type FEventContext = TEventContext<MainEventsRegistrarType, RendererEventsRegistrarType>;
    const OutValue: FEventContext =
    {
        UseRegisterCallback,
        UseRegisterCallbackDeferred,
        UseRegisterCallbacks,
        UseRegisterCallbacksDeferred,
        UseSendEvent,
        UseSendEventDeferred
    };

    const IsContextValid: boolean = (
        Invoke !== undefined &&
        Off !== undefined &&
        On !== undefined &&
        Once !== undefined &&
        Send !== undefined
    );

    if (IsContextValid)
    {
        throw new Error("At least one of the IpcRendererFunctions is undefined.");
    }

    FactoryContext = createContext<FEventContext>(OutValue);

    const FactoryContextCast: Context<FEventContext> = FactoryContext as Context<FEventContext>;

    return (
        <FactoryContextCast.Provider value={ OutValue }>
            { children }
        </FactoryContextCast.Provider>
    );
};
