/* File:      Factory.Renderer.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type Context,
    type ReactNode,
    type RefObject,
    createContext,
    use,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState } from "react";
import type {
    FGetPreload,
    PEventProvider,
    TCallbackRecord,
    TEventContext,
    TEventHooks,
    TRendererEventResponse,
    TSendEventDeferred,
    TSendEventDeferredBase,
    TSendEventDeferredReturnType,
    TUseSendEventDeferred,
    TUseSendEventReturnType } from "./Factory.Types.js";
import type {
    FRendererResponseInternal,
    FResponseInternal,
    TCallback,
    TChannel,
    TChannelsNoRequest,
    TChannelsWithRequest,
    TRequest,
    TUseRegisterCallbackDeferred,
    TUseRegisterCallbacksDeferred,
    TUseUnregisterCallbackDeferred,
    TUseUnregisterCallbacksDeferred } from "./Internal/index.js";
import type { IpcRendererEvent, ipcRenderer } from "electron";
import { GetResponseChannel } from "./Factory.js";

/** @TODO Investigate dependency arrays. */
/* eslint-disable react-hooks/exhaustive-deps */

const ResponsePromiseCache: Map<string, Promise<unknown>> = new Map<string, Promise<unknown>>();

let FactoryContext: unknown | undefined = undefined;

function GetCacheKey<ChannelType extends keyof EventRegistrarType, EventRegistrarType>(
    Channel: ChannelType,
    Request: unknown
): string
{
    return JSON.stringify([ Channel, Request ]);
}

export class FEventProviderError extends Error
{
    public constructor()
    {
        super("EventContext was undefined.  Ensure that your app contains an <EventProvider>.");
        this.name = "EventProviderError";
    }
}

export class FEventHookError extends Error
{
    public constructor(HookName: string)
    {
        super(`The ${ HookName } hook was undefined in the EventContext.`);
        this.name = "EventHookError";
    }
}

/** Call this once, and export its result a module, to use in components. */
export function MakeEventHooks<MainEventRegistrarType, RendererEventRegistrarType>(
): TEventHooks<MainEventRegistrarType, RendererEventRegistrarType>
{
    type FEventContext = TEventContext<MainEventRegistrarType, RendererEventRegistrarType>;

    function WrapHook<HookNameType extends keyof FEventContext>(
        HookName: HookNameType,
        ...ArgumentVector: Array<unknown>
    ): unknown
    {
        const EventContext: FEventContext =
            useContext<FEventContext>(FactoryContext as Context<FEventContext>);

        if (EventContext !== undefined)
        {
            if (EventContext[HookName] !== undefined)
            {
                /* TypeScript is unconvinced that an overload is satisfied *
                 * when passing the optional arguments, so the arguments   *
                 * and return value are both cast here.                    */
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
                return (EventContext[HookName] as Function)(
                    ...(ArgumentVector as Array<unknown>)
                ) as unknown;
            }
            else
            {
                throw new FEventHookError("UseSendEvent");
            }
        }

        throw new FEventProviderError();
    }

    function UseSendEvent<ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<typeof Channel, RendererEventRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<typeof Channel, RendererEventRegistrarType>;
    function UseSendEvent<ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): TUseSendEventReturnType<typeof Channel, RendererEventRegistrarType>;
    function UseSendEvent<ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): TUseSendEventReturnType<typeof Channel, RendererEventRegistrarType>;
    function UseSendEvent<ChannelType extends keyof RendererEventRegistrarType>(
        Channel: ChannelType,
        Request?: TRequest<typeof Channel, RendererEventRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<typeof Channel, RendererEventRegistrarType>
    {
        return WrapHook(
            "UseSendEvent",
            Channel as unknown as TChannelsNoRequest<RendererEventRegistrarType>,
            Request as undefined,
            Suspend as boolean
        ) as unknown as TUseSendEventReturnType<ChannelType, RendererEventRegistrarType>;
    }

    function UseSendEventDeferred(): ReturnType<TUseSendEventDeferred<RendererEventRegistrarType>>
    {
        type FReturnType = ReturnType<TUseSendEventDeferred<RendererEventRegistrarType>>;
        return WrapHook("UseSendEventDeferred") as FReturnType;
    }

    function UseRegisterCallback<ChannelType extends keyof MainEventRegistrarType>(
        Channel: ChannelType,
        Callback: TCallback<ChannelType, MainEventRegistrarType>
    ): void
    {
        WrapHook("UseRegisterCallback", Channel, Callback);
    }

    function UseRegisterCallbacks<ChannelType extends TChannel<MainEventRegistrarType>>(
        Record: TCallbackRecord<ChannelType, MainEventRegistrarType>
    ): void
    {
        WrapHook("UseRegisterCallbacks", Record);
    }

    type FUseRegisterCallbackDeferredReturnType =
        ReturnType<TUseRegisterCallbackDeferred<MainEventRegistrarType>>;
    function UseRegisterCallbackDeferred(): FUseRegisterCallbackDeferredReturnType
    {
        return WrapHook("UseRegisterCallbackDeferred") as FUseRegisterCallbackDeferredReturnType;
    }

    type FUseRegisterCallbacksDeferredReturnType =
        ReturnType<TUseRegisterCallbacksDeferred<MainEventRegistrarType>>;
    function UseRegisterCallbacksDeferred(): FUseRegisterCallbacksDeferredReturnType
    {
        return WrapHook("UseRegisterCallbacksDeferred") as FUseRegisterCallbacksDeferredReturnType;
    }

    type FUseUnregisterCallbacksDeferredReturnType =
        ReturnType<TUseUnregisterCallbacksDeferred<MainEventRegistrarType>>;
    function UseUnregisterCallbacksDeferred(): FUseUnregisterCallbacksDeferredReturnType
    {
        return WrapHook("UseUnregisterCallbacksDeferred") as FUseUnregisterCallbacksDeferredReturnType;
    }

    type FUseUnregisterCallbackDeferredReturnType =
        ReturnType<TUseUnregisterCallbackDeferred<MainEventRegistrarType>>;
    function UseUnregisterCallbackDeferred(): FUseUnregisterCallbackDeferredReturnType
    {
        return WrapHook("UseUnregisterCallbackDeferred") as FUseUnregisterCallbackDeferredReturnType;
    }

    return {
        UseRegisterCallback,
        UseRegisterCallbackDeferred,
        UseRegisterCallbacks,
        UseRegisterCallbacksDeferred,
        UseSendEvent,
        UseSendEventDeferred,
        UseUnregisterCallbackDeferred,
        UseUnregisterCallbacksDeferred
    } as const;
};

export const EventProvider = <MainEventRegistrarType, RendererEventRegistrarType>(
    { children, value }: PEventProvider
): ReactNode =>
{
    const {
        Invoke,
        Off,
        On,
        Once,
        Send
    }  = value;

    function GetOrCreateResponsePromise<ChannelType extends keyof RendererEventRegistrarType>(
        Channel: ChannelType,
        Request: unknown
    ): Promise<FResponseInternal>
    {
        const CacheKey: string = GetCacheKey<ChannelType, RendererEventRegistrarType>(Channel, Request);

        const ExistingPromise: Promise<unknown> | undefined = ResponsePromiseCache.get(CacheKey);

        if (ExistingPromise !== undefined)
        {
            return ExistingPromise as Promise<FResponseInternal>;
        }

        const ResponsePromise: Promise<FResponseInternal> = Invoke(Channel as string, Request);

        ResponsePromiseCache.set(CacheKey, ResponsePromise);

        return ResponsePromise;
    }

    function UseSendEventSuspends<ChannelType extends keyof RendererEventRegistrarType>(
        Channel: ChannelType,
        Request: undefined | TRequest<ChannelType, RendererEventRegistrarType>
    ): FRendererResponseInternal
    {
        const InitialResponse: FResponseInternal = use(
            GetOrCreateResponsePromise<keyof RendererEventRegistrarType>(
                Channel as keyof RendererEventRegistrarType, Request
            )
        );

        const [ Response ] = useState<FResponseInternal>(InitialResponse);

        return {
            ...Response,
            IsPending: false
        };
    }

    function UseSendEventNoSuspend<ChannelType extends Extract<keyof RendererEventRegistrarType, string>>(
        Channel: ChannelType,
        Request: undefined | TRequest<ChannelType, RendererEventRegistrarType>
    ): FRendererResponseInternal
    {
        const EmptyResponse: FRendererResponseInternal = useMemo((): FRendererResponseInternal =>
        {
            return {
                Data: undefined,
                Error: undefined,
                IsPending: true
            };
        }, [ ]);

        const [ Response, SetResponse ] = useState<FRendererResponseInternal>(EmptyResponse);

        useEffect((): (() => void) =>
        {
            let IsIgnored: boolean = false;

            SetResponse(EmptyResponse);

            (async (): Promise<void> =>
            {
                const NextResponse: FResponseInternal = await Invoke(Channel, Request);

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

    function UseSendEvent<ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: TRequest<ChannelType, RendererEventRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<ChannelType, RendererEventRegistrarType>;
    function UseSendEvent<ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType
    ): TUseSendEventReturnType<ChannelType, RendererEventRegistrarType>;
    function UseSendEvent<ChannelType extends TChannelsNoRequest<RendererEventRegistrarType>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): TUseSendEventReturnType<ChannelType, RendererEventRegistrarType>;
    function UseSendEvent<ChannelType extends Extract<keyof RendererEventRegistrarType, string>>(
        Channel: ChannelType,
        Request?: TRequest<ChannelType, RendererEventRegistrarType>,
        Suspend?: boolean
    ): TUseSendEventReturnType<ChannelType, RendererEventRegistrarType>
    {
        const Initial: FRendererResponseInternal = Suspend
            ? UseSendEventSuspends(Channel, Request)
            : UseSendEventNoSuspend(Channel, Request);

        const [ SendEventDeferred ] = UseSendEventDeferred();

        const [ ResendValue, SetResendValue ] = useState<FRendererResponseInternal | undefined>(undefined);

        type FResendEvent = (NewRequest?: typeof Request) => Promise<void>;
        const ResendEvent: FResendEvent = useCallback(async (NewRequest?: typeof Request): Promise<void> =>
        {
            const OutRequest: typeof Request = NewRequest === undefined
                ? Request
                : NewRequest;

            const OutResponse: FRendererResponseInternal = ((OutRequest === undefined)
                ? await SendEventDeferred(
                    Channel as unknown as TChannelsNoRequest<RendererEventRegistrarType>
                )
                : await SendEventDeferred(
                    Channel as unknown as TChannelsWithRequest<RendererEventRegistrarType>,
                    OutRequest as TRequest<TChannelsWithRequest<RendererEventRegistrarType>,
                        RendererEventRegistrarType>
                )) as unknown as FRendererResponseInternal;

            SetResendValue(OutResponse as unknown as FRendererResponseInternal);
        }, [ Request, SendEventDeferred ]);

        if (ResendValue === undefined)
        {
            return {
                ...Initial,
                ResendEvent
            } as unknown as TUseSendEventReturnType<ChannelType, RendererEventRegistrarType>;
        }
        else
        {
            return {
                ...ResendValue,
                ResendEvent
            } as unknown as TUseSendEventReturnType<ChannelType, RendererEventRegistrarType>;
        }
    }

    const CreateAbortError = (): Error =>
    {
        const ErrorInstance: Error = new Error("The component unmounted before the request completed.");
        ErrorInstance.name = "AbortError";
        return ErrorInstance;
    };

    function UseSendEventDeferred(): ReturnType<TUseSendEventDeferred<RendererEventRegistrarType>>
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

        type FSendEventReturnType = ReturnType<TSendEventDeferred<RendererEventRegistrarType>>;
        const SendEvent: TSendEventDeferredBase<RendererEventRegistrarType> = useCallback(
            async <ChannelType extends TChannelsWithRequest<RendererEventRegistrarType>>(
                Channel: ChannelType,
                Request?: TRequest<ChannelType, RendererEventRegistrarType>
            ): FSendEventReturnType =>
            {
                if (!IsMountedReference.current)
                {
                    throw CreateAbortError();
                }

                const Response: FResponseInternal = await Invoke(Channel, Request);

                if (!IsMountedReference.current)
                {
                    throw CreateAbortError();
                }

                return Response as unknown as FSendEventReturnType;
            }, [ Invoke ]);

        return [ SendEvent ] as const;
    }

    type FCallbackPair =
    {
        Original: Parameters<typeof On>[1];
        Wrapper: Parameters<typeof On>[1];
    };

    type FRegisteredCallbackMap = Map<string, Set<FCallbackPair>>;

    const RegisteredCallbacksReference: RefObject<FRegisteredCallbackMap> =
        useRef<FRegisteredCallbackMap>(new Map<string, Set<FCallbackPair>>());

    useEffect((): (() => void) =>
    {
        const Ref: FRegisteredCallbackMap = RegisteredCallbacksReference.current;

        return (): void =>
        {
            for (const [ Channel, CallbackSet ] of Ref.entries())
            {
                for (const { Wrapper } of CallbackSet)
                {
                    Off(Channel, Wrapper);
                }
            }

            Ref.clear();
        };
    }, [ Off ]);

    type FRegisterCallback = <ChannelType extends keyof MainEventRegistrarType>(
        Channel: ChannelType,
        Callback: TCallback<ChannelType, MainEventRegistrarType>
    ) => void;

    const RegisterCallback: FRegisterCallback = useCallback(
        <ChannelType extends keyof MainEventRegistrarType>(
            Channel: ChannelType,
            Callback: TCallback<ChannelType, MainEventRegistrarType>
        ): void =>
        {
            const ChannelCast: string = Channel as string;
            const CallbackCast: Parameters<typeof On>[1] = Callback as Parameters<typeof On>[1];

            let ExistingCallbacks: Set<FCallbackPair> | undefined =
                RegisteredCallbacksReference.current.get(ChannelCast);

            if (ExistingCallbacks === undefined)
            {
                RegisteredCallbacksReference.current.set(ChannelCast, new Set<FCallbackPair>());
                ExistingCallbacks = RegisteredCallbacksReference.current.get(ChannelCast);
            }

            const AlreadyExists: boolean = Array.from(ExistingCallbacks || [ ]).some((
                { Original }: FCallbackPair
            ): boolean =>
            {
                return Original === Callback;
            });

            if (AlreadyExists)
            {
                return;
            }

            const Wrapper: FCallbackPair["Wrapper"] = async (
                _Event: IpcRendererEvent,
                Request: unknown
            ): Promise<void> =>
            {
                type FResponse = Awaited<ReturnType<TCallback<ChannelType, MainEventRegistrarType>>>;
                const Response: FResponse =
                    await Callback(Request as TRequest<ChannelType, MainEventRegistrarType>) as FResponse;

                Send(GetResponseChannel(String(Channel)), Response);
            };

            On(ChannelCast, Wrapper);

            RegisteredCallbacksReference.current.get(ChannelCast)?.add({ Original: CallbackCast, Wrapper });
        }, [ On ]);

    type FRegisterCallbacks = <ChannelType extends keyof MainEventRegistrarType>(
        Record: TCallbackRecord<ChannelType, MainEventRegistrarType>
    ) => void;
    const RegisterCallbacks: FRegisterCallbacks = useCallback(
        <ChannelType extends keyof MainEventRegistrarType>(
            Record: TCallbackRecord<ChannelType, MainEventRegistrarType>
        ): void =>
        {
            const RegisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: TCallback<typeof Channel, MainEventRegistrarType> =
                    InCallback as TCallback<typeof Channel, MainEventRegistrarType>;

                RegisterCallback(Channel, Callback);
            };

            Object.entries(Record).forEach(RegisterEntry);
        }, [ RegisterCallback ]);

    type FUnregisterCallback = <ChannelType extends keyof MainEventRegistrarType>(
        Channel: ChannelType,
        Callback: TCallback<ChannelType, MainEventRegistrarType>
    ) => void;
    const UnregisterCallback: FUnregisterCallback = useCallback(
        <ChannelType extends keyof MainEventRegistrarType>(
            Channel: ChannelType,
            Callback: TCallback<ChannelType, MainEventRegistrarType>
        ): void =>
        {
            const ResponseChannel: string = GetResponseChannel(Channel as string);
            const CallbackCast: Parameters<typeof Off>[1] = Callback as Parameters<typeof Off>[1];

            const ExistingCallbacks: Set<FCallbackPair> | undefined =
                RegisteredCallbacksReference.current.get(ResponseChannel);

            const ShouldExitEarly: boolean = (
                ExistingCallbacks === undefined ||
                Array.from(ExistingCallbacks).some(({ Original }: FCallbackPair): boolean =>
                {
                    return Original === Callback;
                })
            );

            if (ShouldExitEarly)
            {
                return;
            }

            Off(ResponseChannel, CallbackCast);

            const NewCallbacks: Set<FCallbackPair> =
                new Set<FCallbackPair>(Array.from(ExistingCallbacks || [ ])
                    .filter(({ Original }: FCallbackPair): boolean =>
                    {
                        return Original !== CallbackCast;
                    }));

            RegisteredCallbacksReference.current.set(ResponseChannel, NewCallbacks);

            if (NewCallbacks.size === 0)
            {
                RegisteredCallbacksReference.current.delete(ResponseChannel);
            }
        }, [ Off ]);

    type FUnregisterCallbacks = <ChannelType extends keyof MainEventRegistrarType>(
        Record: TCallbackRecord<ChannelType, MainEventRegistrarType>
    ) => void;
    const UnregisterCallbacks: FUnregisterCallbacks = useCallback(
        <ChannelType extends keyof MainEventRegistrarType>(
            Record: TCallbackRecord<ChannelType, MainEventRegistrarType>
        ): void =>
        {
            const UnregisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: TCallback<typeof Channel, MainEventRegistrarType> =
                    InCallback as TCallback<typeof Channel, MainEventRegistrarType>;

                UnregisterCallback(Channel, Callback);
            };

            Object.entries(Record).forEach(UnregisterEntry);
        }, [ UnregisterCallback ]);

    type FUseRegisterCallbackDeferred = TUseRegisterCallbackDeferred<MainEventRegistrarType>;
    const UseRegisterCallbackDeferred: FUseRegisterCallbackDeferred =
        (): ReturnType<FUseRegisterCallbackDeferred> =>
        {
            return [ RegisterCallback ] as const;
        };

    type FUseRegisterCallbacksDeferred = TUseRegisterCallbacksDeferred<MainEventRegistrarType>;
    const UseRegisterCallbacksDeferred: FUseRegisterCallbacksDeferred =
        (): ReturnType<FUseRegisterCallbacksDeferred> =>
        {
            return [ RegisterCallbacks ] as const;
        };

    type FUseUnregisterCallbacksDeferred = TUseUnregisterCallbacksDeferred<MainEventRegistrarType>;
    const UseUnregisterCallbacksDeferred: FUseUnregisterCallbacksDeferred =
        (): ReturnType<FUseUnregisterCallbacksDeferred> =>
        {
            return [ UnregisterCallbacks ] as const;
        };

    type FUseUnregisterCallbackDeferred = TUseUnregisterCallbackDeferred<MainEventRegistrarType>;
    const UseUnregisterCallbackDeferred: FUseUnregisterCallbackDeferred =
        (): ReturnType<FUseUnregisterCallbackDeferred> =>
        {
            return [ UnregisterCallback ] as const;
        };

    const UseRegisterCallback = <ChannelType extends keyof MainEventRegistrarType>(
        Channel: ChannelType,
        Callback: TCallback<ChannelType, MainEventRegistrarType>
    ): void =>
    {
        useEffect((): (() => void) =>
        {
            RegisterCallback(Channel, Callback);
            return (): void =>
            {
                UnregisterCallback(Channel, Callback);
            };
        }, [ RegisterCallback ]);
    };

    const UseRegisterCallbacks = <ChannelType extends keyof MainEventRegistrarType>(
        Record: TCallbackRecord<ChannelType, MainEventRegistrarType>
    ): void =>
    {
        useEffect((): (() => void) =>
        {
            RegisterCallbacks(Record);
            return (): void =>
            {
                UnregisterCallbacks(Record);
            };
        }, [ RegisterCallback ]);
    };

    type FEventContext = TEventContext<MainEventRegistrarType, RendererEventRegistrarType>;
    const OutValue: FEventContext =
    {
        UseRegisterCallback,
        UseRegisterCallbackDeferred,
        UseRegisterCallbacks,
        UseRegisterCallbacksDeferred,
        UseSendEvent,
        UseSendEventDeferred,
        UseUnregisterCallbackDeferred,
        UseUnregisterCallbacksDeferred
    };

    const IsContextValid: boolean = (
        Invoke !== undefined &&
        Off !== undefined &&
        On !== undefined &&
        Once !== undefined &&
        Send !== undefined
    );

    if (!IsContextValid)
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

export const GetPreload = (IpcRenderer: typeof ipcRenderer): FGetPreload =>
{
    const Invoke: typeof IpcRenderer.invoke = (
        Channel: string,
        ...ArgumentVector: Array<unknown>
    ): Promise<unknown> =>
    {
        return IpcRenderer.invoke(Channel, ...ArgumentVector);
    };

    const On: typeof IpcRenderer.on = (
        Channel: string,
        Callback: ((Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>) => void)
    ): typeof IpcRenderer =>
    {
        return IpcRenderer.on(Channel, Callback);
    };

    const Once: typeof IpcRenderer.once = (
        Channel: string,
        Callback: ((Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>) => void)
    ): typeof IpcRenderer =>
    {
        return IpcRenderer.once(Channel, Callback);
    };

    const Off: typeof IpcRenderer.off = (
        Channel: string,
        Callback: ((Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>) => void)
    ): typeof IpcRenderer =>
    {
        return IpcRenderer.off(Channel, Callback);
    };

    const Send: typeof IpcRenderer.send = (
        Channel: string,
        ...ArgumentVector: Array<unknown>
    ): void =>
    {
        IpcRenderer.send(Channel, ...ArgumentVector);
    };

    return {
        EventPreload:
        {
            Invoke,
            Off,
            On,
            Once,
            Send
        }
    };
};

export function IsEventSuccess<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType>(
    { Error, IsPending }: TRendererEventResponse<ChannelType, RendererEventRegistrarType>
): boolean;
export function IsEventSuccess<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType>(
    { Error }: TSendEventDeferredReturnType<ChannelType, RendererEventRegistrarType>
): boolean;
export function IsEventSuccess<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType>(
    Response: (
        | TRendererEventResponse<ChannelType, RendererEventRegistrarType>
        | TSendEventDeferredReturnType<ChannelType, RendererEventRegistrarType>
    )
): boolean
{
    return ("IsPending" in Response)
        ? !Response.IsPending && Response.Error === undefined
        : Response.Error === undefined;
}

export function IsEventFailure<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType>(
    Response: TRendererEventResponse<ChannelType, RendererEventRegistrarType>
): boolean;
export function IsEventFailure<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType>(
    Response: TSendEventDeferredReturnType<ChannelType, RendererEventRegistrarType>
): boolean;
export function IsEventFailure<
    ChannelType extends keyof RendererEventRegistrarType,
    RendererEventRegistrarType>(
    Response: (
        | TRendererEventResponse<ChannelType, RendererEventRegistrarType>
        | TSendEventDeferredReturnType<ChannelType, RendererEventRegistrarType>
    )
): boolean
{
    return !IsEventSuccess(Response);
}
