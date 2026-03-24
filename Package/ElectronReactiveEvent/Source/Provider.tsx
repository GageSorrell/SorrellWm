/* File:      Provider.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IpcRendererEvent } from "electron";
import {
    type Context,
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
    Callback,
    CallbackRecord,
    EventContext,
    EventProviderProps,
    Request,
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
    UseUnregisterCallbacksDeferred } from "./index.js";
import type { ResponseInternal, RendererResponseInternal } from "./Internal/index.js";
import { GetResponseChannel } from "./index.js";

export const FactoryContextRef: { Ref: unknown | undefined; } = { Ref: undefined };

const ResponsePromiseCache: Map<string, Promise<unknown>> = new Map<string, Promise<unknown>>();

function GetCacheKey<ChannelType extends keyof Registrar, Registrar>(
    Channel: ChannelType,
    Request: unknown
): string
{
    return JSON.stringify([ Channel, Request ]);
}

const GetRendererFunctionsFromValue = (
    { failSilently, value }: Omit<EventProviderProps, "children">,
    Out: Partial<IpcRendererFunctions>
): boolean =>
{
    const IsValid = (In: unknown): In is IpcRendererFunctions =>
    {
        return (
            typeof In === "object" &&
            In !== null &&
            "invoke" in In &&
            "off" in In &&
            "on" in In &&
            "once" in In &&
            "send" in In &&
            typeof In.invoke === "function" &&
            typeof In.off === "function" &&
            typeof In.on === "function" &&
            typeof In.once === "function" &&
            typeof In.send === "function"
        );
    };

    if (typeof value !== "string")
    {
        if (IsValid(value))
        {
            Out.invoke = value.invoke;
            Out.off = value.off;
            Out.on = value.on;
            Out.once = value.once;
            Out.send = value.send;
            return true;
        }
        else if (!failSilently)
        {
            throw new Error("\`<ReactiveEventProvider>\` was given an invalid \`value\`.");
        }
        else
        {
            const Identity = <ArgumentVectorType extends Array<unknown>, ReturnValueType>(
                ...ArgumentVector: ArgumentVectorType
            ): ReturnValueType => ArgumentVector as unknown as ReturnValueType;

            Out.invoke = Identity;
            Out.off = Identity;
            Out.on = Identity;
            Out.once = Identity;
            Out.send = Identity;
            return false;
        }
    }

    const PathSplit: Array<string> = value.split(".")
    /* Remove the `window` part of the path. */
    PathSplit.shift();

    let OutObject: unknown = window;
    const AccessProperty = (Property: string, Index: number): void =>
    {
        class ReactiveEventProviderPreloadError extends Error
        {
            public constructor(GetMessageEnd: ((LastValidSubpath: string) => string))
            {
                const LastValidSubpath: string = "window." + PathSplit.slice(0, Index).join(".");
                const ErrorMessageBase: string =
                    `<ReactiveEventProvider> was given the object path ${ value } to access the necessary \`ipcRenderer\` functions, but `;
                super(ErrorMessageBase + GetMessageEnd(LastValidSubpath));
            }

        }
        if (typeof OutObject !== "object")
        {
            throw new ReactiveEventProviderPreloadError((LastValidSubpath: string): string =>
            {
                return `\`${ LastValidSubpath }\` was not an object.`;
            });
        }
        else if (OutObject === null)
        {
            throw new ReactiveEventProviderPreloadError((LastValidSubpath: string): string =>
            {
                return `\`${ LastValidSubpath }\` was \`null\`.`;
            });
        }
        else if (!(Property in OutObject))
        {
            throw new ReactiveEventProviderPreloadError((LastValidSubpath: string): string =>
            {
                return `property \`${ Property }\` was not found in \`${ LastValidSubpath }\`.`;
            });
        }
        else
        {
            OutObject = (OutObject as Record<typeof Property, unknown>)[Property];
        }
    };

    PathSplit.forEach(AccessProperty);

    if (IsValid(OutObject))
    {
        Out.invoke = OutObject.invoke;
        Out.off = OutObject.off;
        Out.on = OutObject.on;
        Out.once = OutObject.once;
        Out.send = OutObject.send;
        return true;
    }
    else if (!failSilently)
    {
        throw new Error(`The object path \`window.${ PathSplit }\` points to a value that exists, but it was not the expected set of ipcRenderer functions.`);
    }

    return false;
};

/**
 * The main provider for `electron-reactive-event`.  You likely want to wrap this with your own
 * provider in which you provide a `value` containing the `ipcRenderer` functions that you exposed
 * via `exposeInMainWorld`.
 */
export const ReactiveEventProvider = <MainRegistrar, RendererRegistrar>(
    { children, failSilently = false, value }: EventProviderProps
): ReactNode =>
{
    const InRendererFunctions: Partial<IpcRendererFunctions> = { };
    const AreRendererFunctionsValid: boolean = GetRendererFunctionsFromValue({ failSilently, value }, InRendererFunctions);

    const {
        invoke,
        off,
        on,
        once,
        send
    }: IpcRendererFunctions = InRendererFunctions as IpcRendererFunctions;

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

    FactoryContextRef.Ref = createContext<ThisEventContext>(OutValue);

    const FactoryContextCast: Context<ThisEventContext> = FactoryContextRef.Ref as Context<ThisEventContext>;

    if (!AreRendererFunctionsValid && failSilently)
    {
        return children;
    }
    else
    {
        return (
            <FactoryContextCast.Provider value={ OutValue }>
                { children }
            </FactoryContextCast.Provider>
        );
    }
};
