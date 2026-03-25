/* File:      Provider.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcRendererEvent } from "electron";
import {
    type Context,
    type PropsWithChildren,
    type ReactNode,
    type RefObject,
    createContext,
    use,
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo } from "react";
import type {
    CallbackRecord,
    EventContext,
    Request,
    IMainRegistrarBase,
    IRendererRegistrarBase,
    IpcRendererFunctions,
    NoRequestChannel,
    RequestChannel,
    SendEventDeferred,
    SendEventDeferredBase,
    UseEventCallbackDeferred,
    UseEventCallbacksDeferred,
    UseSendEventDeferred,
    UseSendEventReturn,
    UseUnregisterCallbackDeferred,
    UseUnregisterCallbacksDeferred,
    ReactiveEventProviderComponent,
    RendererCallback } from "./index.js";
import type {
    Channel,
    ResponseInternal,
    RendererResponseInternal,
    RendererCallbackInternal,
    RendererCallbackArgumentInternal } from "./Internal/index.js";

export const FactoryContextRef: { Ref: unknown | undefined; } = { Ref: undefined };

const ResponsePromiseCache: Map<string, Promise<unknown>> = new Map<string, Promise<unknown>>();

function GetCacheKey<ChannelType extends keyof Registrar, Registrar>(
    Channel: ChannelType,
    Request: unknown
): string
{
    return JSON.stringify([ Channel, Request ]);
}

/**
 * The main provider for `electron-reactive-event`.  You likely want to wrap this with your own
 * provider in which you provide a `value` containing the `ipcRenderer` functions that you exposed
 * via `exposeInMainWorld`.
 */
export const GetReactiveEventProvider = <
    MainRegistrar extends IMainRegistrarBase,
    RendererRegistrar extends IRendererRegistrarBase
>(): ReactiveEventProviderComponent =>
{
    if (!("electronReactiveEvent" in window))
    {
        throw new Error("electronReactiveEvent was not exposed to the renderer.  Check that you are running `preloadElectronReactiveEvent()` in your `preload` script.");
    }
    else if (window.electronReactiveEvent && typeof window.electronReactiveEvent === "object")
    {
        const IsValid: boolean = (
            "invoke" in window.electronReactiveEvent &&
            "off" in window.electronReactiveEvent &&
            "on" in window.electronReactiveEvent &&
            "once" in window.electronReactiveEvent &&
            "send" in window.electronReactiveEvent &&
            typeof "invoke" === "function" &&
            typeof "off" === "function" &&
            typeof "on" === "function" &&
            typeof "once" === "function" &&
            typeof "send" === "function"
        );

        if (!IsValid)
        {
            throw new Error("One or more functions provided by `preloadElectronReactiveEvent()` were not valid.  Check that the functions you provided are valid.");
        }
    }

    const {
        invoke,
        off,
        on,
        once,
        send
    }: IpcRendererFunctions = window.electronReactiveEvent as IpcRendererFunctions;

    type ThisCallbackRecord<ChannelType extends Channel<MainRegistrar>> =
        CallbackRecord<ChannelType, "Renderer", MainRegistrar>;

    function GetOrCreateResponsePromise<ChannelType extends keyof RendererRegistrar>(
        Channel: ChannelType,
        Request: unknown
    ): Promise<ResponseInternal>
    {
        const CacheKey: string = GetCacheKey<ChannelType, RendererRegistrar>(Channel, Request);

        const ExistingPromise: Promise<unknown> | undefined = ResponsePromiseCache.get(CacheKey);

        if (ExistingPromise !== undefined)
        {
            return ExistingPromise as Promise<ResponseInternal>;
        }

        const ResponsePromise: Promise<ResponseInternal> = invoke(Channel as string, Request);

        ResponsePromiseCache.set(CacheKey, ResponsePromise);

        return ResponsePromise;
    }

    function UseSendEventSuspends<ChannelType extends keyof RendererRegistrar>(
        Channel: ChannelType,
        Request: Request<ChannelType, RendererRegistrar> | undefined
    ): RendererResponseInternal
    {
        const InitialResponse: ResponseInternal = use(
            GetOrCreateResponsePromise<keyof RendererRegistrar>(
                Channel as keyof RendererRegistrar, Request
            )
        );

        const [ Response ] = useState<ResponseInternal>(InitialResponse);

        return {
            ...Response,
            IsPending: false
        };
    }

    function UseSendEventNoSuspend<ChannelType extends Extract<keyof RendererRegistrar, string>>(
        Channel: ChannelType,
        Request: undefined | Request<ChannelType, RendererRegistrar>
    ): RendererResponseInternal
    {
        const EmptyResponse: RendererResponseInternal = useMemo((): RendererResponseInternal =>
        {
            return {
                Data: undefined,
                Error: undefined,
                IsPending: true
            };
        }, [ ]);

        const [ Response, SetResponse ] = useState<RendererResponseInternal>(EmptyResponse);

        useEffect((): (() => void) =>
        {
            let IsIgnored: boolean = false;

            SetResponse(EmptyResponse);

            (async (): Promise<void> =>
            {
                const NextResponse: ResponseInternal = await invoke(Channel, Request);

                if (!IsIgnored)
                {
                    SetResponse({
                        ...NextResponse,
                        IsPending: false
                    });
                }
            })();

            return (): void =>
            {
                IsIgnored = true;
            };
        }, [ Channel, EmptyResponse, Request ]);

        return Response;
    }

    function useSendEvent<ChannelType extends RequestChannel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: Request<ChannelType, RendererRegistrar>,
        Suspend?: boolean
    ): UseSendEventReturn<ChannelType, RendererRegistrar>;
    function useSendEvent<ChannelType extends NoRequestChannel<RendererRegistrar>>(
        Channel: ChannelType
    ): UseSendEventReturn<ChannelType, RendererRegistrar>;
    function useSendEvent<ChannelType extends NoRequestChannel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): UseSendEventReturn<ChannelType, RendererRegistrar>;
    function useSendEvent<ChannelType extends Extract<keyof RendererRegistrar, string>>(
        Channel: ChannelType,
        Request?: Request<ChannelType, RendererRegistrar>,
        Suspend?: boolean
    ): UseSendEventReturn<ChannelType, RendererRegistrar>
    {
        const Initial: RendererResponseInternal = Suspend
            ? UseSendEventSuspends(Channel, Request)
            : UseSendEventNoSuspend(Channel, Request);

        const [ SendEventDeferred ] = useSendEventDeferred();

        const [ ResendValue, SetResendValue ] = useState<RendererResponseInternal | undefined>(undefined);

        type ThisResendEvent = (NewRequest?: typeof Request) => Promise<void>;
        const ResendEvent: ThisResendEvent = useCallback(async (NewRequest?: typeof Request): Promise<void> =>
        {
            const OutRequest: typeof Request = NewRequest === undefined
                ? Request
                : NewRequest;

            const OutResponse: RendererResponseInternal = ((OutRequest === undefined)
                ? await SendEventDeferred(
                    Channel as unknown as NoRequestChannel<RendererRegistrar>
                )
                : await SendEventDeferred(
                    Channel as unknown as RequestChannel<RendererRegistrar>,
                    OutRequest as Request<RequestChannel<RendererRegistrar>,
                        RendererRegistrar>
                )) as unknown as RendererResponseInternal;

            SetResendValue(OutResponse as unknown as RendererResponseInternal);
        }, [ Request, SendEventDeferred ]);

        if (ResendValue === undefined)
        {
            return {
                ...Initial,
                ResendEvent
            } as unknown as UseSendEventReturn<ChannelType, RendererRegistrar>;
        }
        else
        {
            return {
                ...ResendValue,
                ResendEvent
            } as unknown as UseSendEventReturn<ChannelType, RendererRegistrar>;
        }
    }

    const CreateAbortError = (): Error =>
    {
        const ErrorInstance: Error = new Error("The component unmounted before the request completed.");
        ErrorInstance.name = "AbortError";
        return ErrorInstance;
    };

    function useSendEventDeferred(): ReturnType<UseSendEventDeferred<RendererRegistrar>>
    {
        const IsMountedReference: RefObject<boolean> = useRef<boolean>(false);

        useEffect((): (() => void) =>
        {
            IsMountedReference.current = true;

            return (): void =>
            {
                IsMountedReference.current = false;
            };
        }, [ ]);

        type SendEventReturnType = ReturnType<SendEventDeferred<RendererRegistrar>>;
        const SendEvent: SendEventDeferredBase<RendererRegistrar> = useCallback(
            async <ChannelType extends RequestChannel<RendererRegistrar>>(
                Channel: ChannelType,
                Request?: Request<typeof Channel, RendererRegistrar>
            ): SendEventReturnType =>
            {
                if (!IsMountedReference.current)
                {
                    throw CreateAbortError() as unknown as SendEventReturnType;
                }

                const Response: ResponseInternal = await invoke(Channel, Request);

                if (!IsMountedReference.current)
                {
                    throw CreateAbortError() as unknown as SendEventReturnType;
                }

                return Response as unknown as SendEventReturnType;
            }, [ invoke ]);

        return [ SendEvent ] as const;
    }

    type CallbackWrapper = Parameters<typeof on>[1];
    type CallbackOriginal<ChannelType extends Channel<MainRegistrar> = Channel<MainRegistrar>> =
        RendererCallbackInternal<ChannelType, MainRegistrar>;

    type CallbackPair =
        {
            Original: CallbackOriginal;
            Wrapper: CallbackWrapper;
        };

    // type RegisteredCallbackMap = Map<string, Set<CallbackPair>>;

    // const RegisteredCallbacksReference: RefObject<RegisteredCallbackMap> =
    //     useRef<RegisteredCallbackMap>(new Map<string, Set<CallbackPair>>());

    // useEffect((): (() => void) =>
    // {
    //     const Ref: RegisteredCallbackMap = RegisteredCallbacksReference.current;

    //     return (): void =>
    //     {
    //         for (const [ Channel, CallbackSet ] of Ref.entries())
    //         {
    //             for (const { Wrapper } of CallbackSet)
    //             {
    //                 off(Channel, Wrapper);
    //             }
    //         }

    //         Ref.clear();
    //     };
    // }, [ off ]);

    type StoredRendererCallbackRecord =
        Partial<{
            [ Key in Channel<MainRegistrar> ]: Array<RendererCallbackInternal<Key, MainRegistrar>>;
        }>;

    const [ EventCallbacks, SetEventCallbacks ] = useState<StoredRendererCallbackRecord>({ });

    const RegisterCallback = <ChannelType extends Channel<MainRegistrar>>(
        Channel: ChannelType,
        Callback: RendererCallback<typeof Channel, MainRegistrar>
    ): void =>
    {
        SetEventCallbacks((Old: StoredRendererCallbackRecord): StoredRendererCallbackRecord =>
        {
            const CallbackCast: RendererCallbackInternal<typeof Channel, MainRegistrar> =
                Callback as RendererCallbackInternal<typeof Channel, MainRegistrar>;

            if (Channel in Old && Array.isArray(Old[Channel]))
            {
                if (Old[Channel].includes(CallbackCast))
                {
                    return Old;
                }
                else
                {
                    const New: StoredRendererCallbackRecord = structuredClone(Old);
                    if (!(Channel in New) || !Array.isArray(New[Channel]))
                    {
                        New[Channel] = [ ];
                    }

                    New[Channel].push(CallbackCast);

                    return New;
                }
            }
            else
            {
                const New: StoredRendererCallbackRecord = structuredClone(Old);
                New[Channel] = [ ];

                New[Channel].push(CallbackCast);

                return New;
            }
        });
    };

            // const ChannelCast: string = Channel as string;
            // const CallbackCast: CallbackOriginal =
            //     Callback as unknown as CallbackOriginal;

            // let ExistingCallbacks: Set<CallbackPair> | undefined =
            //     RegisteredCallbacksReference.current.get(ChannelCast);

            // if (ExistingCallbacks === undefined)
            // {
            //     RegisteredCallbacksReference.current.set(ChannelCast, new Set<CallbackPair>());
            //     ExistingCallbacks = RegisteredCallbacksReference.current.get(ChannelCast);
            // }

            // const AlreadyExists: boolean = Array.from(ExistingCallbacks || [ ]).some((
            //     { Original }: CallbackPair
            // ): boolean =>
            // {
            //     return Original === CallbackCast;
            // });

            // if (AlreadyExists)
            // {
            //     return;
            // }

            // const Wrapper: CallbackPair["Wrapper"] = async (
            //     Event: IpcRendererEvent,
            //     Request: unknown
            // ): Promise<void> =>
            // {
            //     type ThisArgument = RendererCallbackArgumentInternal<ChannelType, MainRegistrar>;
            //     const Argument: ThisArgument =
            //     {
            //         Event,
            //         Request: Request as Request<ChannelType, MainRegistrar>
            //     };

            //     type Response = Awaited<ReturnType<RendererCallback<ChannelType, MainRegistrar>>>;
            //     type ThisCallback = RendererCallbackInternal<typeof Channel, MainRegistrar>;
            //     const CallbackCastWrapper: ThisCallback = Callback as ThisCallback;
            //     const Response: Response =
            //         await CallbackCastWrapper(Argument) as Response;

            //     send(GetResponseChannel(String(Channel)), Response);
            // };

            // on(ChannelCast, Wrapper);

            // RegisteredCallbacksReference.current.get(ChannelCast)?.add({ Original: CallbackCast, Wrapper });
        // }, [ on ]);

    type ThisRegisterCallbacks = <ChannelType extends Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ) => void;

    const RegisterCallbacks: ThisRegisterCallbacks = <ChannelType extends Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ): void =>
    {
        const RegisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
        {
            const Channel: ChannelType = InChannel as ChannelType;
            const Callback: RendererCallback<typeof Channel, MainRegistrar> =
                InCallback as RendererCallback<typeof Channel, MainRegistrar>;

            RegisterCallback(Channel, Callback);
        };

        Object.entries(Record).forEach(RegisterEntry);
    };

    const UnregisterCallback = <ChannelType extends keyof MainRegistrar>(
        Channel: ChannelType,
        Callback: RendererCallback<typeof Channel, MainRegistrar>
    ): void =>
    {
        SetEventCallbacks((Old: StoredRendererCallbackRecord): StoredRendererCallbackRecord =>
        {
            if (Channel in Old && Array.isArray(Old[Channel]))
            {
                const CallbackCast: RendererCallbackInternal<typeof Channel, MainRegistrar> =
                    Callback as RendererCallbackInternal<typeof Channel, MainRegistrar>;

                const Index: number = Old[Channel].indexOf(CallbackCast);

                const New: StoredRendererCallbackRecord = structuredClone(Old);
                if (Channel in New && Array.isArray(New[Channel]))
                {
                    New[Channel].splice(Index, 1);
                    return New;
                }
                else
                {
                    return Old;
                }
            }
            else
            {
                return Old;
            }
        });
    };
            // const ResponseChannel: string = GetResponseChannel(Channel as string);
            // const CallbackCast: CallbackOriginal = Callback as unknown as CallbackOriginal;

            // const ExistingCallbacks: Set<CallbackPair> | undefined =
            //     RegisteredCallbacksReference.current.get(ResponseChannel);

            // const ShouldExitEarly: boolean = (
            //     ExistingCallbacks === undefined ||
            //     Array.from(ExistingCallbacks).some(({ Original }: CallbackPair): boolean =>
            //     {
            //         return Original === CallbackCast;
            //     })
            // );

            // if (ShouldExitEarly)
            // {
            //     return;
            // }

            // off(ResponseChannel, );

            // const NewCallbacks: Set<CallbackPair> =
            //     new Set<CallbackPair>(Array.from(ExistingCallbacks || [ ])
            //         .filter(({ Original }: CallbackPair): boolean =>
            //         {
            //             return Original !== CallbackCast;
            //         }));

            // RegisteredCallbacksReference.current.set(ResponseChannel, NewCallbacks);

            // if (NewCallbacks.size === 0)
            // {
            //     RegisteredCallbacksReference.current.delete(ResponseChannel);
            // }
        // }, [ EventCallbacks ]);
        // }, [ off ]);

    type ThisUnregisterCallbacks = <ChannelType extends Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ) => void;
    const UnregisterCallbacks: ThisUnregisterCallbacks = <ChannelType extends Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ): void =>
    {
        const UnregisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
        {
            const Channel: ChannelType = InChannel as ChannelType;
            const Callback: RendererCallback<typeof Channel, MainRegistrar> =
                InCallback as RendererCallback<typeof Channel, MainRegistrar>;

            UnregisterCallback(Channel, Callback);
        };

        Object.entries(Record).forEach(UnregisterEntry);
    };

    type ThisUseEventCallbackDeferred = UseEventCallbackDeferred<MainRegistrar>;
    const useEventCallbackDeferred: ThisUseEventCallbackDeferred =
        (): ReturnType<UseEventCallbackDeferred<MainRegistrar>> =>
        {
            return [ RegisterCallback ] as const;
        };

    type ThisUseEventCallbacksDeferred = UseEventCallbacksDeferred<MainRegistrar>;
    const useEventCallbacksDeferred: ThisUseEventCallbacksDeferred =
        (): ReturnType<ThisUseEventCallbacksDeferred> =>
        {
            return [ RegisterCallbacks ] as const;
        };

    type ThisUseUnregisterCallbacksDeferred = UseUnregisterCallbacksDeferred<MainRegistrar>;
    const useUnregisterCallbacksDeferred: ThisUseUnregisterCallbacksDeferred =
        (): ReturnType<ThisUseUnregisterCallbacksDeferred> =>
        {
            return [ UnregisterCallbacks ] as const;
        };

    type ThisUseUnregisterCallbackDeferred = UseUnregisterCallbackDeferred<MainRegistrar>;
    const useUnregisterCallbackDeferred: ThisUseUnregisterCallbackDeferred =
        (): ReturnType<ThisUseUnregisterCallbackDeferred> =>
        {
            return [ UnregisterCallback ] as const;
        };

    const UpdateRegisteredCallbacks = (): (() => void) =>
    {
        type OnCallbackPart = Parameters<typeof on>[1];
        type OnCallbackEntry = [ Channel<MainRegistrar>, OnCallbackPart ];
        type Callbacks = Array<OnCallbackEntry>;
        type ThisCallback = RendererCallbackInternal<Channel<MainRegistrar>, MainRegistrar>;
        type ThisCallbackArgument = RendererCallbackArgumentInternal<Channel<MainRegistrar>, MainRegistrar>;
        type ThisCallCallback = ((Callback: ThisCallback) => void);

        const GetCallbackArgument = (Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>): ThisCallbackArgument =>
        {
            return {
                Event,
                Request: ArgumentVector[0] as Request<Channel<MainRegistrar>, MainRegistrar>
            };
        };

        const MakeCallCallback = (Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>): ThisCallCallback =>
        {
            return (Callback: ThisCallback): void =>
            {
                Callback(GetCallbackArgument(Event, ...ArgumentVector));
            };
        };

        const GetCallbackPart = ([ InChannel, InCallbackArray ]: [ string, unknown ]): OnCallbackEntry =>
        {
            const Channel: Channel<MainRegistrar> = InChannel as Channel<MainRegistrar>;
            type ThisCallbackArray = Array<RendererCallbackInternal<Channel<MainRegistrar>, MainRegistrar>>;
            const CallbackArray: ThisCallbackArray = InCallbackArray as ThisCallbackArray;

            const OutCallback: OnCallbackPart = (Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>): void =>
            {
                const CallCallback: ThisCallCallback = MakeCallCallback(Event, ...ArgumentVector);
                CallbackArray.forEach(CallCallback);
            };

            return [ Channel, OutCallback ];
        };

        const CallbackParts: Callbacks = Object.entries(EventCallbacks).map(GetCallbackPart);

        const RegisterArray = ([ Channel, Callback ]: OnCallbackEntry): void =>
        {
            on(Channel, Callback);
        };

        CallbackParts.forEach(RegisterArray);

        return (): void =>
        {
            const UnregisterArray = ([ Channel, Callback ]: OnCallbackEntry): void =>
            {
                off(Channel, Callback);
            };

            CallbackParts.forEach(UnregisterArray);
        };
    };

    useEffect(UpdateRegisteredCallbacks, [ EventCallbacks ]);

    const useEventCallback = <ChannelType extends Channel<MainRegistrar>>(
        Channel: ChannelType,
        Callback: RendererCallback<ChannelType, MainRegistrar>
    ): void =>
    {
        useEffect((): (() => void) =>
        {
            RegisterCallback(Channel, Callback);
            return (): void =>
            {
                UnregisterCallback(Channel, Callback);
            };
        }, [ ]);
    };

    // @TODO Where to pick back up:
    //
    // Create `Development` directory with directory
    // `ElectronReactiveEventTest` which contains an
    // ERB-based app that experiments with using all
    // features of `ElectronReactiveEvent`.

    const useEventCallbacks = <ChannelType extends Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ): void =>
    {
        useEffect((): (() => void) =>
        {
            RegisterCallbacks(Record);
            return (): void =>
            {
                UnregisterCallbacks(Record);
            };
        }, [ ]);
    };

    type ThisEventContext = EventContext<MainRegistrar, RendererRegistrar>;
    const value: ThisEventContext =
        {
            useEventCallback,
            useEventCallbackDeferred,
            useEventCallbacks,
            useEventCallbacksDeferred,
            useSendEvent,
            useSendEventDeferred,
            useUnregisterCallbackDeferred,
            useUnregisterCallbacksDeferred
        };

    const IsContextValid: boolean = (
        invoke !== undefined &&
        off !== undefined &&
        on !== undefined &&
        once !== undefined &&
        send !== undefined
    );

    if (!IsContextValid)
    {
        throw new Error("At least one of the IpcRendererFunctions is undefined.");
    }

    FactoryContextRef.Ref = createContext<ThisEventContext>(value);

    const FactoryContextCast: Context<ThisEventContext> = FactoryContextRef.Ref as Context<ThisEventContext>;

    return ({ children }: PropsWithChildren): ReactNode =>
    {
        return (
            <FactoryContextCast.Provider { ...{ value } }>
                { children }
            </FactoryContextCast.Provider>
        );
    };
};
