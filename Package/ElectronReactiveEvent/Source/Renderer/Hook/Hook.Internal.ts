/* File:      Hook.Internal.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type EffectCallback,
    type RefObject,
    use,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState } from "react";
import type {
    EqualityCheck,
    InvokeOptionsOverloadedArgument,
    InvokeResponseInternal } from "./Hook.Internal.Types";
import type {
    InvokeEventDeferred,
    InvokeOptions,
    InvokeResponse,
    OffEventDeferred,
    OnEventDeferred,
    OnceEventDeferred,
    RendererListener,
    SendEventDeferred } from "./Hook.Types";
import type { MainOwner, RendererOwner } from "../../Decl/Decl.Types";
import type {
    Request,
    ResponseIndeterminate,
    ResponseSync } from "../../Listener/index.js";
import type { Channel } from "../../Channel";
import type { EmptyOverloadParameter } from "../../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../../Listener/Listener.Internal";
import type { PackageKeys } from "../../Internal";
import type { ReactiveEventContextInternal } from "../Provider/Provider.Internal.Types";
import { ReactiveEventInternalContext } from "../Provider/Provider.Internal";

const IndeterminateResponse: ResponseIndeterminate =
    {
        data: undefined,
        error: undefined,
        isPending: true
    } as const;

// function UseReactiveEventsInternal(): Readonly<ReactiveEventContextInternal>
// {
//     return useContext<ReactiveEventContextInternal>(ReactiveEventInternalContext);
// };

/**
 * @returns The internal context used to access the
 * {@link https://www.electronjs.org/docs/latest/api/ipc-renderer | IpcRenderer} functions.
 *
 * @group Internal
 */
function UseIpcRenderer(): Readonly<ReactiveEventContextInternal["ipcRenderer"]>
{
    return useContext<ReactiveEventContextInternal>(ReactiveEventInternalContext).ipcRenderer;
};

class ImmutableArgumentChangeError<Type> extends Error
{
    public constructor(PreviousValue: Type, CurrentValue: Type)
    {
        super();
        this.name = "ImmutableArgumentChangeError";
        this.message = "A hook argument changed value between renders, but it should be immutable.  " +
        `The previous value was ${ PreviousValue }, but the current value is ${ CurrentValue }.`;
    }
}

/**
 * Ensure that a given {@link Argument} has not changed between calls.
 *
 * @param Argument - The argument of the calling hook whose immutability is enforced
 * by this hook.
 * @param AreEqual - The function used to determine whether the current value of the
 * {@link Argument} is equivalent to the previous value of the {@link Argument}.
 *
 * @throws An {@link ImmutableArgumentChangeError} iff the value of the {@link Argument}
 * changed, according to the given {@link AreEqual} function.
 *
 * @group Internal
 */
function UseImmutableArgumentCheck<Type>(
    Argument: Type,
    AreEqual: EqualityCheck<Type> | undefined = undefined
): void
{
    const Ref: RefObject<Type> = useRef<Type>(Argument);
    const DefaultAreEqual = (A: Type, B: Type): boolean =>
    {
        return A === B;
    };

    const ThisAreEqual: EqualityCheck<Type> = (AreEqual === undefined)
        ? DefaultAreEqual
        : AreEqual;

    if (!ThisAreEqual(Ref.current, Argument))
    {
        const ThisError: ImmutableArgumentChangeError<Type> =
            new ImmutableArgumentChangeError<Type>(Ref.current, Argument);
        Ref.current = Argument;

        throw ThisError;
    }
}

/**
 * @inheritDoc UseInvokeEvent:NoRequest
 * @group Internal
 */
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
    channel: ChannelType
): InvokeResponse<PackageKey, typeof channel, undefined>;
/**
 * @inheritDoc UseInvokeEvent:NoRequestOptions
 * @group Internal
 */
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>,
    SuspendsType extends boolean>(
    channel: ChannelType,
    options: InvokeOptions<SuspendsType>
): InvokeResponse<PackageKey, typeof channel, typeof options>;
/**
 * @inheritDoc UseInvokeEvent:Request
 * @group Internal
 */
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Request<PackageKey>>(
    channel: ChannelType,
    request: Request<PackageKey, RendererOwner, typeof channel>
): InvokeResponse<PackageKey, typeof channel, undefined>;
/**
 * @inheritDoc UseInvokeEvent:RequestOptions
 * @group Internal
 */
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Request<PackageKey>,
    SuspendsType extends boolean>(
    channel: ChannelType,
    request: Request<PackageKey, RendererOwner, typeof channel>,
    options: InvokeOptions<SuspendsType>
): InvokeResponse<PackageKey, typeof channel, typeof options>;
// eslint-disable-next-line jsdoc/require-param
/**
 * @inheritDoc UseInvokeEvent
 * @group Internal
 */
export function useInvokeEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.Any<PackageKey>,
    SuspendsType extends boolean>(
    channel: ChannelType,
    requestOrOptions:
        | Request<PackageKey, RendererOwner, typeof channel>
        | InvokeOptions<SuspendsType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue,
    options: InvokeOptionsOverloadedArgument<SuspendsType> = EmptyOverloadParameterValue
): InvokeResponseInternal<
    PackageKey,
    typeof channel,
    typeof requestOrOptions,
    typeof options
>
{
    type ThisRequest = Request<PackageKey, RendererOwner, typeof channel>;
    type ThisReturnType =
        InvokeResponseInternal<
            PackageKey,
            typeof channel,
            typeof requestOrOptions,
            typeof options
        >;

    type ThisReturnTypeMaybe =
        | ThisReturnType
        | ResponseIndeterminate;

    type ThisReturnTypeSync = Omit<ThisReturnType, "isPending">;

    type OverloadedArguments =
        {
            Options:
                | InvokeOptions<SuspendsType>
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
                                "suspend" in requestOrOptions
                            )
                        )
                    )
                );

                return IsRequestOrOptionsOptions
                    ? {
                        Options: requestOrOptions as InvokeOptions<SuspendsType>,
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

    UseImmutableArgumentCheck(Options, (
        A: typeof Options,
        B: typeof Options
    ): boolean =>
    {
        if (typeof A === "object" &&
            A !== null &&
            typeof B === "object" &&
            B !== null &&
            "suspend" in A &&
            "suspend" in B
        )
        {
            return A.suspend === B.suspend;
        }
        else
        {
            return true;
        }
    });

    const Suspends: boolean = (
        Options !== EmptyOverloadParameterValue &&
        typeof Options === "object" &&
        Options !== null &&
        "suspend" in Options &&
        (Options.suspend === true)
    );

    const [ Response, SetResponse ] = useState<ThisReturnTypeMaybe>(IndeterminateResponse);

    const { invoke } = UseIpcRenderer();

    const InvokePromise: Promise<ThisReturnTypeSync> = useMemo((): Promise<ThisReturnTypeSync> =>
    {
        if (Request !== EmptyOverloadParameterValue)
        {
            return invoke(channel, Request) as Promise<ThisReturnTypeSync>;
        }
        else
        {
            return invoke(channel) as Promise<ThisReturnTypeSync>;
        }
    }, [ Request, channel, invoke ]);

    if (Suspends)
    {
        const SuspendedInvocation: ThisReturnTypeSync = use(InvokePromise);
        SetResponse(SuspendedInvocation as ThisReturnType);
        // SetResponse((_Old: ThisReturnTypeMaybe): ThisReturnTypeMaybe =>
        // {
        //     return SuspendedInvocation as ThisReturnType;
        // });
    }
    else
    {
        InvokePromise.then((Value: ThisReturnTypeSync): void =>
        {
            SetResponse(Value as ThisReturnType);
        });
    }

    return Response as ThisReturnType;
}

export function useInvokeEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ invokeEventDeferred: InvokeEventDeferred<PackageKey> ]>
{
    const { invoke } = UseIpcRenderer();

    async function invokeEventDeferred<
        ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
        channel: ChannelType
    ): Promise<ResponseSync<PackageKey, typeof channel>>;
    async function invokeEventDeferred<
        ChannelType extends Channel.Handler.Request<PackageKey>>(
        channel: ChannelType,
        request: Request<PackageKey, RendererOwner, typeof channel>
    ): Promise<ResponseSync<PackageKey, typeof channel>>;
    async function invokeEventDeferred<
        ChannelType extends Channel.Handler.Request<PackageKey>>(
        channel: ChannelType,
        request:
            | Request<PackageKey, RendererOwner, typeof channel>
            | EmptyOverloadParameter = EmptyOverloadParameterValue
    ): Promise<ResponseSync<PackageKey, typeof channel>>
    {
        if (request !== EmptyOverloadParameterValue)
        {
            return invoke(channel, request);
        }
        else
        {
            return invoke(channel);
        }
    }

    return [ invokeEventDeferred ] as const;
}

export function useOnEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>
>(
    channel: ChannelType,
    listener: RendererListener<PackageKey, typeof channel>
): Readonly<[ offEventDeferred: (() => void) ]>
{
    const { off, on } = UseIpcRenderer();

    const offEventDeferred: (() => void) = useCallback((): void =>
    {
        off(channel, listener);
    }, [ channel, listener, off ]);

    useEffect((): ReturnType<EffectCallback> =>
    {
        on(channel, listener);

        return offEventDeferred;
    }, [ channel, listener, offEventDeferred, on ]);

    return [ offEventDeferred ] as const;
}

export function useOnEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ onEventDeferred: OnEventDeferred<PackageKey> ]>
{
    const { off, on } = UseIpcRenderer();

    const onEventDeferred: OnEventDeferred<PackageKey> = useCallback(function<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>
    >(
        channel: ChannelType,
        listener: RendererListener<PackageKey, typeof channel>
    ): Readonly<[ offEventDeferred: (() => void) ]>
    {
        on(channel, listener);

        function offEventDeferred(): void
        {
            off(channel, listener);
        }

        return [ offEventDeferred ] as const;
    }, [ off, on ]);

    return [ onEventDeferred ] as const;
}

export function useOffEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>
{
    const { off } = UseIpcRenderer();
    const offEventDeferred: OffEventDeferred<PackageKey> = useCallback(function<
        ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>
    >(
        channel: ChannelType,
        listener: RendererListener<PackageKey, typeof channel>
    ): void
    {
        off(channel, listener);
    }, [ off ]);

    return [ offEventDeferred ] as const;
}

export function useOnceEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>
>(
    channel: ChannelType,
    listener: RendererListener<PackageKey, typeof channel>
): Readonly<[ offEventDeferred: OffEventDeferred<PackageKey> ]>
{
    const { off, once } = UseIpcRenderer();

    const offEventDeferred: (() => void) = useCallback((): void =>
    {
        off(channel, listener);
    }, [ channel, listener, off ]);

    useEffect((): ReturnType<EffectCallback> =>
    {
        once(channel, listener);

        return offEventDeferred;
    }, [ channel, listener, offEventDeferred, once ]);

    return [ offEventDeferred ] as const;
}

export function useOnceEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ onEventDeferred: OnceEventDeferred<PackageKey> ]>
{
    const { off, once } = UseIpcRenderer();

    const onEventDeferred: OnEventDeferred<PackageKey> = useCallback(function<
        PackageKey extends PackageKeys,
        ChannelType extends Channel.Listener.Any<PackageKey, MainOwner>
    >(
        channel: ChannelType,
        listener: RendererListener<PackageKey, typeof channel>
    ): Readonly<[ offEventDeferred: (() => void) ]>
    {
        once(channel, listener);

        function offEventDeferred(): void
        {
            off(channel, listener);
        }

        return [ offEventDeferred ] as const;
    }, [ off, once ]);

    return [ onEventDeferred ] as const;
}

function SendEventInternal<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
    send: ReactiveEventContextInternal["ipcRenderer"]["send"],
    channel: ChannelType,
    request:
        | Request<PackageKey, RendererOwner, typeof channel>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): void
{
    if (request === EmptyOverloadParameterValue)
    {
        return send(channel);
    }
    else
    {
        return send(channel, request);
    }
}

export function useSendEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
    channel: ChannelType
): void;
export function useSendEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
    channel: ChannelType,
    request: Request<PackageKey, RendererOwner, typeof channel>
): void;
export function useSendEvent<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
    channel: ChannelType,
    request:
        | Request<PackageKey, RendererOwner, typeof channel>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): void
{
    const { send } = UseIpcRenderer();

    useEffect((): void =>
    {
        SendEventInternal(send, channel, request);
    }, [ channel, request, send ]);
}

export function useSendEventDeferred<PackageKey extends PackageKeys>(
): Readonly<[ sendEventDeferred: SendEventDeferred<PackageKey> ]>
{
    const { send } = UseIpcRenderer();

    function SendEventDeferredBase<
        ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
        channel: ChannelType
    ): void;
    function SendEventDeferredBase<
        ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
        channel: ChannelType,
        request: Request<PackageKey, RendererOwner, typeof channel>
    ): void;
    function SendEventDeferredBase<
        ChannelType extends Channel.Handler.NoRequest<PackageKey>>(
        channel: ChannelType,
        request:
            | Request<PackageKey, RendererOwner, typeof channel>
            | EmptyOverloadParameter = EmptyOverloadParameterValue
    ): void
    {
        SendEventInternal(send, channel, request);
    }

    const sendEventDeferred: SendEventDeferred<PackageKey> =
        useCallback(SendEventDeferredBase, [ SendEventDeferredBase, send ]);

    return [ sendEventDeferred ] as const;
}
