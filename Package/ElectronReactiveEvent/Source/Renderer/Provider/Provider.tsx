/* File:      Provider.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type * as Renderer from "../Renderer.Types.js";
import type { Callback, Channel, Event } from "../../index.js";
import {
    type Context,
    type PropsWithChildren,
    type ReactNode,
    type RefObject,
    createContext,
    use,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState } from "react";
import type { EventContext, ReactiveEventProviderComponent, Send } from "./Provider.Types.js";
import type { Hook, Preload } from "../index.js";
import type { Internal } from "../../Internal/index.js";
import type { IpcRendererEvent } from "electron";
import type { Shared } from "../../Shared/index.js";

/* eslint-disable @typescript-eslint/naming-convention */

export const FactoryContextRef: { Ref: unknown | undefined; } = { Ref: undefined };

const ResponsePromiseCache: Map<string, Promise<unknown>> = new Map<string, Promise<unknown>>();

function GetCacheKey<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
>(
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
    MainRegistrar extends Shared.Registrar.IMainRegistrarBase,
    RendererRegistrar extends Shared.Registrar.IRendererRegistrarBase
>(): ReactiveEventProviderComponent =>
{
    if (!("electronReactiveEvent" in window))
    {
        /* eslint-disable-next-line @stylistic/max-len */
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
            /* eslint-disable-next-line @stylistic/max-len */
            throw new Error("One or more functions provided by `preloadElectronReactiveEvent()` were not valid.  Check that the functions you provided are valid.");
        }
    }

    const {
        invoke,
        off,
        on,
        once,
        send
    }: Preload.IpcRendererFunctions = window.electronReactiveEvent as Preload.IpcRendererFunctions;

    type ThisCallbackRecord<ChannelType extends Channel.Channel<MainRegistrar>> =
        Callback.Record<ChannelType, MainRegistrar>;

    function GetOrCreateResponsePromise<ChannelType extends Channel.Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: unknown
    ): Promise<Internal.Factory.Response.Renderer>
    {
        const CacheKey: string = GetCacheKey<ChannelType, RendererRegistrar>(Channel, Request);

        const ExistingPromise: Promise<unknown> | undefined = ResponsePromiseCache.get(CacheKey);

        if (ExistingPromise !== undefined)
        {
            return ExistingPromise as Promise<Internal.Factory.Response.Renderer>;
        }

        const ResponsePromise: Promise<Internal.Factory.Response.Renderer> =
            invoke(Channel as string, Request);

        ResponsePromiseCache.set(CacheKey, ResponsePromise);

        return ResponsePromise;
    }

    function UseSendEventSuspends<ChannelType extends Channel.Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: Event.Request<ChannelType, RendererRegistrar> | undefined
    ): Renderer.Response<ChannelType, RendererRegistrar>
    {
        const InitialResponse: Internal.Factory.Response.Renderer = use(
            GetOrCreateResponsePromise<Channel.Channel<RendererRegistrar>>(
                Channel as Channel.Channel<RendererRegistrar>, Request
            )
        );

        const [ Response ] = useState<Internal.Factory.Response.Renderer>(InitialResponse);

        return {
            ...(Response as Renderer.Response<ChannelType, RendererRegistrar>),
            IsPending: false
        };
    }

    function UseSendEventNoSuspend<ChannelType extends Channel.Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Request: undefined | Event.Request<ChannelType, RendererRegistrar>
    ): Renderer.Response<ChannelType, RendererRegistrar>
    {
        const EmptyResponse: Internal.Factory.Response.Renderer =
            useMemo((): Internal.Factory.Response.Renderer =>
            {
                return {
                    Data: undefined,
                    Error: undefined,
                    IsPending: true
                };
            }, [ ]);

        const [ Response, SetResponse ] = useState<Internal.Factory.Response.Renderer>(EmptyResponse);

        useEffect((): (() => void) =>
        {
            let IsIgnored: boolean = false;

            SetResponse(EmptyResponse);

            (async (): Promise<void> =>
            {
                const NextResponse: Internal.Factory.Response.Renderer = await invoke(Channel, Request);

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

        return Response as Renderer.Response<ChannelType, RendererRegistrar>;
    }

    function useSendEvent<ChannelType extends Channel.Request<RendererRegistrar>>(
        Channel: ChannelType,
        Request: Event.Request<ChannelType, RendererRegistrar>,
        Suspend?: boolean
    ): Hook.Send.UseSendEventReturn<ChannelType, RendererRegistrar>;
    function useSendEvent<ChannelType extends Channel.NoRequest<RendererRegistrar>>(
        Channel: ChannelType
    ): Hook.Send.UseSendEventReturn<ChannelType, RendererRegistrar>;
    function useSendEvent<ChannelType extends Channel.NoRequest<RendererRegistrar>>(
        Channel: ChannelType,
        Request: undefined,
        Suspend: boolean
    ): Hook.Send.UseSendEventReturn<ChannelType, RendererRegistrar>;
    function useSendEvent<ChannelType extends Channel.Channel<RendererRegistrar>>(
        Channel: ChannelType,
        Request?: Event.Request<ChannelType, RendererRegistrar>,
        Suspend?: boolean
    ): Hook.Send.UseSendEventReturn<ChannelType, RendererRegistrar>
    {
        const Initial: Internal.Factory.Response.Renderer = Suspend
            ? UseSendEventSuspends(Channel, Request)
            : UseSendEventNoSuspend(Channel, Request);

        const [ SendEventDeferred ] = useSendEventDeferred();

        const [ ResendValue, SetResendValue ] =
            useState<Internal.Factory.Response.Renderer | undefined>(undefined);

        type ThisResendEvent = (NewRequest?: typeof Request) => Promise<void>;
        const ResendEvent: ThisResendEvent = useCallback(async (NewRequest?: typeof Request): Promise<void> =>
        {
            const OutRequest: typeof Request = NewRequest === undefined
                ? Request
                : NewRequest;

            const OutResponse: Internal.Factory.Response.Renderer = ((OutRequest === undefined)
                ? await SendEventDeferred(
                    Channel as unknown as Channel.NoRequest<RendererRegistrar>
                )
                : await SendEventDeferred(
                    Channel as unknown as Channel.Request<RendererRegistrar>,
                    OutRequest as Event.Request<Channel.Request<RendererRegistrar>,
                        RendererRegistrar>
                )) as unknown as Internal.Factory.Response.Renderer;

            SetResendValue(OutResponse as unknown as Internal.Factory.Response.Renderer);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        }, [ Request, SendEventDeferred ]);

        if (ResendValue === undefined)
        {
            return {
                ...Initial,
                ResendEvent
            } as unknown as Hook.Send.UseSendEventReturn<ChannelType, RendererRegistrar>;
        }
        else
        {
            return {
                ...ResendValue,
                ResendEvent
            } as unknown as Hook.Send.UseSendEventReturn<ChannelType, RendererRegistrar>;
        }
    }

    const CreateAbortError = (): Error =>
    {
        const ErrorInstance: Error = new Error("The component unmounted before the request completed.");
        ErrorInstance.name = "AbortError";
        return ErrorInstance;
    };

    function useSendEventDeferred(): ReturnType<Hook.Send.UseSendEventDeferred<RendererRegistrar>>
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

        type SendEventReturnType = ReturnType<Send.Deferred.Function.SendEventDeferred<RendererRegistrar>>;
        const SendEvent: Send.Deferred.Function.SendEventDeferredBase<RendererRegistrar> = useCallback(
            async <ChannelType extends Channel.Request<RendererRegistrar>>(
                Channel: ChannelType,
                Request?: Event.Request<typeof Channel, RendererRegistrar>
            ): SendEventReturnType =>
            {
                if (!IsMountedReference.current)
                {
                    throw CreateAbortError() as unknown as SendEventReturnType;
                }

                const Response: Internal.Factory.Response.Renderer = await invoke(Channel, Request);

                if (!IsMountedReference.current)
                {
                    throw CreateAbortError() as unknown as SendEventReturnType;
                }

                return Response as unknown as SendEventReturnType;
            /* eslint-disable-next-line react-hooks/exhaustive-deps */
            }, [ invoke ]);

        return [ SendEvent ] as const;
    }

    // type CallbackWrapper = Parameters<typeof on>[1];
    // type CallbackOriginal<ChannelType extends Channel<MainRegistrar> = Channel<MainRegistrar>> =
    //     RendererCallbackInternal<ChannelType, MainRegistrar>;

    // type CallbackPair =
    //     {
    //         Original: CallbackOriginal;
    //         Wrapper: CallbackWrapper;
    //     };

    type StoredRendererCallbackRecord =
        Partial<{
            [ Key in Channel.Channel<MainRegistrar> ]: Array<Internal.Callback.Renderer<Key, MainRegistrar>>;
        }>;

    const [ EventCallbacks, SetEventCallbacks ] = useState<StoredRendererCallbackRecord>({ });

    const RegisterCallback = <ChannelType extends Channel.Channel<MainRegistrar>>(
        Channel: ChannelType,
        Callback: Callback.Renderer<typeof Channel, MainRegistrar>
    ): void =>
    {
        SetEventCallbacks((Old: StoredRendererCallbackRecord): StoredRendererCallbackRecord =>
        {
            const CallbackCast: Internal.Callback.Renderer<typeof Channel, MainRegistrar> =
                Callback as Internal.Callback.Renderer<typeof Channel, MainRegistrar>;

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

    type ThisRegisterCallbacks = <ChannelType extends Channel.Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ) => void;

    const RegisterCallbacks: ThisRegisterCallbacks = <ChannelType extends Channel.Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ): void =>
    {
        const RegisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
        {
            const Channel: ChannelType = InChannel as ChannelType;
            const Callback: Callback.Renderer<typeof Channel, MainRegistrar> =
                InCallback as Callback.Renderer<typeof Channel, MainRegistrar>;

            RegisterCallback(Channel, Callback);
        };

        Object.entries(Record).forEach(RegisterEntry);
    };

    const UnregisterCallback = <ChannelType extends Channel.Channel<MainRegistrar>>(
        Channel: ChannelType,
        Callback: Callback.Renderer<typeof Channel, MainRegistrar>
    ): void =>
    {
        SetEventCallbacks((Old: StoredRendererCallbackRecord): StoredRendererCallbackRecord =>
        {
            if (Channel in Old && Array.isArray(Old[Channel]))
            {
                const CallbackCast: Internal.Callback.Renderer<typeof Channel, MainRegistrar> =
                    Callback as Internal.Callback.Renderer<typeof Channel, MainRegistrar>;

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

    type ThisUnregisterCallbacks = <ChannelType extends Channel.Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ) => void;
    const UnregisterCallbacks: ThisUnregisterCallbacks = <ChannelType extends Channel.Channel<MainRegistrar>>(
        Record: ThisCallbackRecord<ChannelType>
    ): void =>
    {
        const UnregisterEntry = ([ InChannel, InCallback ]: [ string, unknown ]): void =>
        {
            const Channel: ChannelType = InChannel as ChannelType;
            const Callback: Callback.Renderer<typeof Channel, MainRegistrar> =
                InCallback as Callback.Renderer<typeof Channel, MainRegistrar>;

            UnregisterCallback(Channel, Callback);
        };

        Object.entries(Record).forEach(UnregisterEntry);
    };

    type ThisUseEventCallbackDeferred = Hook.Register.UseEventCallbackDeferred<MainRegistrar>;
    const useEventCallbackDeferred: ThisUseEventCallbackDeferred =
        (): ReturnType<Hook.Register.UseEventCallbackDeferred<MainRegistrar>> =>
        {
            return [ RegisterCallback ] as const;
        };

    type ThisUseEventCallbacksDeferred = Hook.Register.UseEventCallbacksDeferred<MainRegistrar>;
    const useEventCallbacksDeferred: ThisUseEventCallbacksDeferred =
        (): ReturnType<ThisUseEventCallbacksDeferred> =>
        {
            return [ RegisterCallbacks ] as const;
        };

    type ThisUseUnregisterCallbacksDeferred = Hook.Register.UseUnregisterCallbacksDeferred<MainRegistrar>;
    const useUnregisterCallbacksDeferred: ThisUseUnregisterCallbacksDeferred =
        (): ReturnType<ThisUseUnregisterCallbacksDeferred> =>
        {
            return [ UnregisterCallbacks ] as const;
        };

    type ThisUseUnregisterCallbackDeferred = Hook.Register.UseUnregisterCallbackDeferred<MainRegistrar>;
    const useUnregisterCallbackDeferred: ThisUseUnregisterCallbackDeferred =
        (): ReturnType<ThisUseUnregisterCallbackDeferred> =>
        {
            return [ UnregisterCallback ] as const;
        };

    const UpdateRegisteredCallbacks = (): (() => void) =>
    {
        type OnCallbackPart = Parameters<typeof on>[1];
        type OnCallbackEntry = [ Channel.Channel<MainRegistrar>, OnCallbackPart ];
        type Callbacks = Array<OnCallbackEntry>;
        type ThisCallback = Internal.Callback.Renderer<Channel.Channel<MainRegistrar>, MainRegistrar>;
        type ThisCallbackArgument =
            Internal.Callback.Argument.Renderer<Channel.Channel<MainRegistrar>, MainRegistrar>;
        type ThisCallCallback = ((Callback: ThisCallback) => void);

        const GetCallbackArgument = (
            Event: IpcRendererEvent,
            ...ArgumentVector: Array<unknown>
        ): ThisCallbackArgument =>
        {
            return {
                Event,
                Request: ArgumentVector[0] as Event.Request<Channel.Channel<MainRegistrar>, MainRegistrar>
            };
        };

        const MakeCallCallback = (
            Event: IpcRendererEvent,
            ...ArgumentVector: Array<unknown>
        ): ThisCallCallback =>
        {
            return (Callback: ThisCallback): void =>
            {
                Callback(GetCallbackArgument(Event, ...ArgumentVector));
            };
        };

        const GetCallbackPart = ([ InChannel, InCallbackArray ]: [ string, unknown ]): OnCallbackEntry =>
        {
            const Channel: Channel.Channel<MainRegistrar> = InChannel as Channel.Channel<MainRegistrar>;
            type ThisCallbackArray =
                Array<Internal.Callback.Renderer<Channel.Channel<MainRegistrar>, MainRegistrar>>;
            const CallbackArray: ThisCallbackArray = InCallbackArray as ThisCallbackArray;

            const OutCallback: OnCallbackPart = (
                Event: IpcRendererEvent,
                ...ArgumentVector: Array<unknown>
            ): void =>
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

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(UpdateRegisteredCallbacks, [ EventCallbacks ]);

    const useEventCallback = <ChannelType extends Channel.Channel<MainRegistrar>>(
        Channel: ChannelType,
        Callback: Callback.Renderer<ChannelType, MainRegistrar>
    ): void =>
    {
        useEffect((): (() => void) =>
        {
            RegisterCallback(Channel, Callback);
            return (): void =>
            {
                UnregisterCallback(Channel, Callback);
            };
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        }, [ ]);
    };

    const useEventCallbacks = <ChannelType extends Channel.Channel<MainRegistrar>>(
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
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
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
