/* File:      Factory.Renderer.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type {
    Callback,
    CallbackRecord,
    EventContext,
    EventHooks,
    NoRequestChannel,
    PEventProvider,
    ReactiveEventPreloadData,
    RendererResponse,
    Request,
    RequestChannel,
    SendEventDeferred,
    SendEventDeferredBase,
    SendEventDeferredReturn,
    UseEventCallbackDeferred,
    UseEventCallbacksDeferred,
    UseSendEventDeferred,
    UseSendEventReturn,
    UseUnregisterCallbackDeferred,
    UseUnregisterCallbacksDeferred } from "./index.js";
import type {
    Channel,
    RendererResponseInternal,
    ResponseInternal } from "./Internal/index.js";
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
import type { IpcRendererEvent, ipcRenderer } from "electron";
import { GetResponseChannel } from "./index.js";

/** @TODO Investigate dependency arrays. */
/* eslint-disable react-hooks/exhaustive-deps */

const ResponsePromiseCache: Map<string, Promise<unknown>> = new Map<string, Promise<unknown>>();

let FactoryContext: unknown | undefined = undefined;

function GetCacheKey<ChannelType extends keyof Registrar, Registrar>(
    Channel: ChannelType,
    Request: unknown
): string
{
    return JSON.stringify([ Channel, Request ]);
}

export class EventProviderError extends Error
{
    public constructor()
    {
        super("EventContext was undefined.  Ensure that your app contains an <EventProvider>.");
        this.name = "EventProviderError";
    }
}

export class EventHookError extends Error
{
    public constructor(HookName: string)
    {
        super(`The ${ HookName } hook was undefined in the EventContext.`);
        this.name = "EventHookError";
    }
}

/** Call this once, and export its result a module, to use in components. */
export function MakeEventHooks<MainRegistrar, RendererRegistrar>(
): EventHooks<MainRegistrar, RendererRegistrar>
{
    type ThisEventContext = EventContext<MainRegistrar, RendererRegistrar>;

    function WrapHook<HookNameType extends keyof ThisEventContext>(
        HookName: HookNameType,
        ...ArgumentVector: Array<unknown>
    ): unknown
    {
        const EventContext: ThisEventContext =
            useContext<ThisEventContext>(FactoryContext as Context<ThisEventContext>);

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
                throw new EventHookError("UseSendEvent");
            }
        }

        throw new EventProviderError();
    }

    function useSendEvent<ChannelType extends RequestChannel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: Request<typeof Channel, RendererRegistrar>,
        Suspend?: boolean
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends NoRequestChannel<RendererRegistrar>>(
        Channel: ChannelType
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends NoRequestChannel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>;
    function useSendEvent<ChannelType extends keyof RendererRegistrar>(
        Channel: ChannelType,
        Request?: Request<typeof Channel, RendererRegistrar>,
        Suspend?: boolean
    ): UseSendEventReturn<typeof Channel, RendererRegistrar>
    {
        return WrapHook(
            "useSendEvent",
            Channel as unknown as NoRequestChannel<RendererRegistrar>,
            Request as undefined,
            Suspend as boolean
        ) as unknown as UseSendEventReturn<ChannelType, RendererRegistrar>;
    }

    function useSendEventDeferred(): ReturnType<UseSendEventDeferred<RendererRegistrar>>
    {
        type ThisReturnType = ReturnType<UseSendEventDeferred<RendererRegistrar>>;
        return WrapHook("useSendEventDeferred") as ThisReturnType;
    }

    function useEventCallback<ChannelType extends keyof MainRegistrar>(
        Channel: ChannelType,
        Callback: Callback<ChannelType, MainRegistrar>
    ): void
    {
        WrapHook("useEventCallback", Channel, Callback);
    }

    function useEventCallbacks<ChannelType extends Channel<MainRegistrar>>(
        Record: CallbackRecord<ChannelType, MainRegistrar>
    ): void
    {
        WrapHook("useEventCallbacks", Record);
    }

    type ThisUseCallbackDeferredReturnType =
        ReturnType<UseEventCallbackDeferred<MainRegistrar>>;
    function useEventCallbackDeferred(): ThisUseCallbackDeferredReturnType
    {
        return WrapHook("useEventCallbackDeferred") as ThisUseCallbackDeferredReturnType;
    }

    type ThisUseCallbacksDeferredReturnType =
        ReturnType<UseEventCallbacksDeferred<MainRegistrar>>;
    function useEventCallbacksDeferred(): ThisUseCallbacksDeferredReturnType
    {
        return WrapHook("useEventCallbacksDeferred") as ThisUseCallbacksDeferredReturnType;
    }

    type ThisUseUnregisterCallbacksDeferredReturnType =
        ReturnType<UseUnregisterCallbacksDeferred<MainRegistrar>>;
    function useUnregisterCallbacksDeferred(): ThisUseUnregisterCallbacksDeferredReturnType
    {
        return WrapHook("useUnregisterCallbacksDeferred") as ThisUseUnregisterCallbacksDeferredReturnType;
    }

    type ThisUseUnregisterCallbackDeferredReturnType =
        ReturnType<UseUnregisterCallbackDeferred<MainRegistrar>>;
    function useUnregisterCallbackDeferred(): ThisUseUnregisterCallbackDeferredReturnType
    {
        return WrapHook("useUnregisterCallbackDeferred") as ThisUseUnregisterCallbackDeferredReturnType;
    }

    return {
        useEventCallback,
        useEventCallbackDeferred,
        useEventCallbacks,
        useEventCallbacksDeferred,
        useSendEvent,
        useSendEventDeferred,
        useUnregisterCallbackDeferred,
        useUnregisterCallbacksDeferred
    } as const;
};

export const ReactiveEventProvider = <MainRegistrar, RendererRegistrar>(
    { children, value }: PEventProvider
): ReactNode =>
{
    const {
        invoke,
        off,
        on,
        once,
        send
    }  = value;

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

    type CallbackPair =
        {
            Original: Parameters<typeof on>[1];
            Wrapper: Parameters<typeof on>[1];
        };

    type RegisteredCallbackMap = Map<string, Set<CallbackPair>>;

    const RegisteredCallbacksReference: RefObject<RegisteredCallbackMap> =
        useRef<RegisteredCallbackMap>(new Map<string, Set<CallbackPair>>());

    useEffect((): (() => void) =>
    {
        const Ref: RegisteredCallbackMap = RegisteredCallbacksReference.current;

        return (): void =>
        {
            for (const [ Channel, CallbackSet ] of Ref.entries())
            {
                for (const { Wrapper } of CallbackSet)
                {
                    off(Channel, Wrapper);
                }
            }

            Ref.clear();
        };
    }, [ off ]);

    type RegisterCallback = <ChannelType extends keyof MainRegistrar>(
        Channel: ChannelType,
        Callback: Callback<ChannelType, MainRegistrar>
    ) => void;

    const RegisterCallback: RegisterCallback = useCallback(
        <ChannelType extends keyof MainRegistrar>(
            Channel: ChannelType,
            Callback: Callback<ChannelType, MainRegistrar>
        ): void =>
        {
            const ChannelCast: string = Channel as string;
            const CallbackCast: Parameters<typeof on>[1] = Callback as Parameters<typeof on>[1];

            let ExistingCallbacks: Set<CallbackPair> | undefined =
                RegisteredCallbacksReference.current.get(ChannelCast);

            if (ExistingCallbacks === undefined)
            {
                RegisteredCallbacksReference.current.set(ChannelCast, new Set<CallbackPair>());
                ExistingCallbacks = RegisteredCallbacksReference.current.get(ChannelCast);
            }

            const AlreadyExists: boolean = Array.from(ExistingCallbacks || [ ]).some((
                { Original }: CallbackPair
            ): boolean =>
            {
                return Original === Callback;
            });

            if (AlreadyExists)
            {
                return;
            }

            const Wrapper: CallbackPair["Wrapper"] = async (
                _Event: IpcRendererEvent,
                Request: unknown
            ): Promise<void> =>
            {
                type Response = Awaited<ReturnType<Callback<ChannelType, MainRegistrar>>>;
                const Response: Response =
                    await Callback(Request as Request<ChannelType, MainRegistrar>) as Response;

                send(GetResponseChannel(String(Channel)), Response);
            };

            on(ChannelCast, Wrapper);

            RegisteredCallbacksReference.current.get(ChannelCast)?.add({ Original: CallbackCast, Wrapper });
        }, [ on ]);

    type RegisterCallbacks = <ChannelType extends keyof MainRegistrar>(
        Record: CallbackRecord<ChannelType, MainRegistrar>
    ) => void;
    const RegisterCallbacks: RegisterCallbacks = useCallback(
        <ChannelType extends keyof MainRegistrar>(
            Record: CallbackRecord<ChannelType, MainRegistrar>
        ): void =>
        {
            const RegisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: Callback<typeof Channel, MainRegistrar> =
                    InCallback as Callback<typeof Channel, MainRegistrar>;

                RegisterCallback(Channel, Callback);
            };

            Object.entries(Record).forEach(RegisterEntry);
        }, [ RegisterCallback ]);

    type ThisUnregisterCallback = <ChannelType extends keyof MainRegistrar>(
        Channel: ChannelType,
        Callback: Callback<ChannelType, MainRegistrar>
    ) => void;
    const UnregisterCallback: ThisUnregisterCallback = useCallback(
        <ChannelType extends keyof MainRegistrar>(
            Channel: ChannelType,
            Callback: Callback<ChannelType, MainRegistrar>
        ): void =>
        {
            const ResponseChannel: string = GetResponseChannel(Channel as string);
            const CallbackCast: Parameters<typeof off>[1] = Callback as Parameters<typeof off>[1];

            const ExistingCallbacks: Set<CallbackPair> | undefined =
                RegisteredCallbacksReference.current.get(ResponseChannel);

            const ShouldExitEarly: boolean = (
                ExistingCallbacks === undefined ||
                Array.from(ExistingCallbacks).some(({ Original }: CallbackPair): boolean =>
                {
                    return Original === Callback;
                })
            );

            if (ShouldExitEarly)
            {
                return;
            }

            off(ResponseChannel, CallbackCast);

            const NewCallbacks: Set<CallbackPair> =
                new Set<CallbackPair>(Array.from(ExistingCallbacks || [ ])
                    .filter(({ Original }: CallbackPair): boolean =>
                    {
                        return Original !== CallbackCast;
                    }));

            RegisteredCallbacksReference.current.set(ResponseChannel, NewCallbacks);

            if (NewCallbacks.size === 0)
            {
                RegisteredCallbacksReference.current.delete(ResponseChannel);
            }
        }, [ off ]);

    type ThisUnregisterCallbacks = <ChannelType extends keyof MainRegistrar>(
        Record: CallbackRecord<ChannelType, MainRegistrar>
    ) => void;
    const UnregisterCallbacks: ThisUnregisterCallbacks = useCallback(
        <ChannelType extends keyof MainRegistrar>(
            Record: CallbackRecord<ChannelType, MainRegistrar>
        ): void =>
        {
            const UnregisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
            {
                const Channel: ChannelType = InChannel as ChannelType;
                const Callback: Callback<typeof Channel, MainRegistrar> =
                    InCallback as Callback<typeof Channel, MainRegistrar>;

                UnregisterCallback(Channel, Callback);
            };

            Object.entries(Record).forEach(UnregisterEntry);
        }, [ UnregisterCallback ]);

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

    const useEventCallback = <ChannelType extends keyof MainRegistrar>(
        Channel: ChannelType,
        Callback: Callback<ChannelType, MainRegistrar>
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

    const useEventCallbacks = <ChannelType extends keyof MainRegistrar>(
        Record: CallbackRecord<ChannelType, MainRegistrar>
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

    type ThisEventContext = EventContext<MainRegistrar, RendererRegistrar>;
    const OutValue: ThisEventContext =
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

    FactoryContext = createContext<ThisEventContext>(OutValue);

    const FactoryContextCast: Context<ThisEventContext> = FactoryContext as Context<ThisEventContext>;

    return (
        <FactoryContextCast.Provider value={ OutValue }>
            { children }
        </FactoryContextCast.Provider>
    );
};

export const GetPreload = (IpcRenderer: typeof ipcRenderer): ReactiveEventPreloadData =>
{
    const invoke: typeof IpcRenderer.invoke = (
        Channel: string,
        ...ArgumentVector: Array<unknown>
    ): Promise<unknown> =>
    {
        return IpcRenderer.invoke(Channel, ...ArgumentVector);
    };

    const on: typeof IpcRenderer.on = (
        Channel: string,
        Callback: ((Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>) => void)
    ): typeof IpcRenderer =>
    {
        return IpcRenderer.on(Channel, Callback);
    };

    const once: typeof IpcRenderer.once = (
        Channel: string,
        Callback: ((Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>) => void)
    ): typeof IpcRenderer =>
    {
        return IpcRenderer.once(Channel, Callback);
    };

    const off: typeof IpcRenderer.off = (
        Channel: string,
        Callback: ((Event: IpcRendererEvent, ...ArgumentVector: Array<unknown>) => void)
    ): typeof IpcRenderer =>
    {
        return IpcRenderer.off(Channel, Callback);
    };

    const send: typeof IpcRenderer.send = (
        Channel: string,
        ...ArgumentVector: Array<unknown>
    ): void =>
    {
        IpcRenderer.send(Channel, ...ArgumentVector);
    };

    return {
        electronReactiveEvent:
        {
            invoke,
            off,
            on,
            once,
            send
        }
    };
};

export function IsEventSuccess<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    { Error, IsPending }: RendererResponse<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    { Error }: SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean;
export function IsEventSuccess<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    Response: (
        | RendererResponse<ChannelType, RendererRegistrar>
        | SendEventDeferredReturn<ChannelType, RendererRegistrar>
    )
): boolean
{
    return ("IsPending" in Response)
        ? !Response.IsPending && Response.Error === undefined
        : Response.Error === undefined;
}

export function IsEventFailure<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    Response: RendererResponse<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    Response: SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean;
export function IsEventFailure<
    ChannelType extends keyof RendererRegistrar,
    RendererRegistrar>(
    Response:
        | RendererResponse<ChannelType, RendererRegistrar>
        | SendEventDeferredReturn<ChannelType, RendererRegistrar>
): boolean
{
    return !IsEventSuccess(Response);
}
