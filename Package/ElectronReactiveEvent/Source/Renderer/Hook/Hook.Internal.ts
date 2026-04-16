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
    ResultInternal } from "./Hook.Internal.Types";
import type {
    InvokeEventDeferred,
    OffEventDeferred,
    OnEventDeferred,
    OnceEventDeferred,
    RendererListener,
    SendEventDeferred } from "./Hook.Types";
import type { MainOwner, RendererOwner } from "../../Internal";
import type { Channel } from "../../Channel";
import type { Decl } from "../../Decl";
import type { EmptyOverloadParameter } from "../../Listener/Listener.Internal.Types";
import { EmptyOverloadParameterValue } from "../../Listener/Listener.Internal";
import type { Invoke } from "../../Invoke/Invoke.Types";
import type { ReactiveEventContextInternal } from "../Provider/Provider.Internal.Types";
import { ReactiveEventInternalContext } from "../Provider/Provider.Internal";

const IndeterminateResponse: Invoke.Result.Async.Indeterminate =
    {
        data: undefined,
        error: undefined,
        isPending: true
    } as const;

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
 * @typeParam Type - The type of the given {@link Argument}.
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
 * Invoke an event when the containing component mounts, whose event declaration
 * does *not* define a request type.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the event that you wish to invoke.
 *
 * @returns The result returned by `main`.
 *
 * @group Internal
 */
export function useInvokeEvent<ChannelType extends Channel.Handler.Without.Request>(
    channel: ChannelType
): Invoke.Result<typeof channel>;
/**
 * Invoke an event when the containing component mounts, whose event declaration
 * does *not* defines a request type.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the event that you wish to invoke.
 * @param options - Specify whether this hook should suspend the containing component
 * until `main` returns a response.
 *
 * @returns The result returned by `main`.
 *
 * @group Internal
 */
export function useInvokeEvent<ChannelType extends Channel.Handler.Without.Request,
    SuspendsType extends boolean>(
    channel: ChannelType,
    options: Invoke.Options<SuspendsType>
): Invoke.Result<typeof channel, typeof options>;
/**
 * Invoke an event when the containing component mounts, whose event declaration
 * defines a request type.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the event that you wish to invoke.
 * @param request - The request of this event.
 *
 * @returns The result returned by `main`.
 *
 * @group Internal
 */
export function useInvokeEvent<ChannelType extends Channel.Handler.With.Request>(
    channel: ChannelType,
    request: Decl.Request<typeof channel>
): Invoke.Result<typeof channel>;
/**
 * Invoke an event when the containing component mounts, whose event declaration
 * defines a request type.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the event that you wish to invoke.
 * @param request - The request of this event.
 * @param options - Specify whether this hook should suspend the containing component
 * until `main` returns a response.
 *
 * @returns The result returned by `main`.
 *
 * @group Internal
 */
export function useInvokeEvent<ChannelType extends Channel.Handler.With.Request,
    SuspendsType extends boolean>(
    channel: ChannelType,
    request: Decl.Request<typeof channel>,
    options: Invoke.Options<SuspendsType>
): Invoke.Result<typeof channel, typeof options>;
/**
 * Invoke an event when the containing component mounts.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 * @typeParam SuspendsType - The type of {@link Invoke.Options.suspend} if an
 * {@link Invoke.Options} object is passed.
 *
 * @param channel - The channel of the event that you wish to invoke.
 * @param requestOrOptions - The first overloaded argument of this event.
 * @param options - The second overloaded argument of this event.
 *
 * @returns The result returned by `main`.
 *
 * @group Internal
 */
export function useInvokeEvent<ChannelType extends Channel.Handler,
    SuspendsType extends boolean>(
    channel: ChannelType,
    requestOrOptions:
        | Decl.Request<typeof channel>
        | Invoke.Options<SuspendsType>
        | EmptyOverloadParameter = EmptyOverloadParameterValue,
    options: InvokeOptionsOverloadedArgument<SuspendsType> = EmptyOverloadParameterValue
): ResultInternal<
    typeof channel,
    typeof requestOrOptions,
    typeof options
>
{
    type ThisRequest = Decl.Request<typeof channel>;
    type ThisReturnType =
        ResultInternal<
            typeof channel,
            typeof requestOrOptions,
            typeof options
        >;

    type ThisReturnTypeMaybe =
        | ThisReturnType
        | Invoke.Result.Async.Indeterminate;

    type ThisReturnTypeSync = Omit<ThisReturnType, "isPending">;

    type OverloadedArguments =
        {
            Options:
                | Invoke.Options<SuspendsType>
                | EmptyOverloadParameter;
            Request:
                | ThisRequest
                | EmptyOverloadParameter;
        };

    // eslint-disable-next-line jsdoc/require-jsdoc
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
                        Options: requestOrOptions as Invoke.Options<SuspendsType>,
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
        SetResponse({
            data: undefined,
            error: undefined,
            ...SuspendedInvocation
        } as ThisReturnType);
    }
    else
    {
        InvokePromise.then((Value: ThisReturnTypeSync): void =>
        {
            (Value as Record<string, unknown>).isPending = false;
            SetResponse(Value as ThisReturnType);
        });
    }

    return Response as ThisReturnType;
}

/**
 * Returns a copy of {@link InvokeEventDeferred}, to invoke events at a desired time.
 *
 *
 * @returns An {@link InvokeEventDeferred} function.
 *
 * @group Internal
 */
export function useInvokeEventDeferred(
): Readonly<[ invokeEventDeferred: InvokeEventDeferred ]>
{
    const { invoke } = UseIpcRenderer();

    async function invokeEventDeferred<
        ChannelType extends Channel.Handler.Without.Request>(
        channel: ChannelType
    ): Promise<Invoke.Result.Sync<typeof channel>>;
    async function invokeEventDeferred<
        ChannelType extends Channel.Handler.With.Request>(
        channel: ChannelType,
        request: Decl.Request<typeof channel>
    ): Promise<Invoke.Result.Sync<typeof channel>>;
    // eslint-disable-next-line jsdoc/require-jsdoc
    async function invokeEventDeferred<
        ChannelType extends Channel.Handler.With.Request>(
        channel: ChannelType,
        request:
            | Decl.Request<typeof channel>
            | EmptyOverloadParameter = EmptyOverloadParameterValue
    ): Promise<Invoke.Result.Sync<typeof channel>>
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

/**
 * Subscribe to events sent by `main` at the time that the containing component mounts.
 * When the component unmounts, the listener is unsubscribed.
 *
 * @typeParam ChannelType - The type of the {@link channel} on which the
 * {@link listener} will listen.
 *
 * @param channel - The channel on which the {@link listener} will listen.
 * @param listener - The callback function that will listen on {@link channel}.
 *
 * @returns A function that will unregister the given {@link listener}.
 *
 * @group Internal
 */
export function useOnEvent<ChannelType extends Channel.Listener<MainOwner>
>(
    channel: ChannelType,
    listener: RendererListener<typeof channel>
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

/**
 * Returns an {@link OnEventDeferred}, to subscribe to `main` events when desired.
 *
 *
 * @returns An {@link OnEventDeferred} function.
 *
 * @group Internal
 */
export function useOnEventDeferred(
): Readonly<[ onEventDeferred: OnEventDeferred ]>
{
    const { off, on } = UseIpcRenderer();

    const onEventDeferred: OnEventDeferred = useCallback(function<
        ChannelType extends Channel.Listener<MainOwner>
    >(
        channel: ChannelType,
        listener: RendererListener<typeof channel>
    ): Readonly<[ offEventDeferred: (() => void) ]>
    {
        on(channel, listener);

        // eslint-disable-next-line jsdoc/require-jsdoc
        function offEventDeferred(): void
        {
            off(channel, listener);
        }

        return [ offEventDeferred ] as const;
    }, [ off, on ]);

    return [ onEventDeferred ] as const;
}

/**
 * Returns an {@link OffEventDeferred}, to unsubscribe to `main` events when desired.
 *
 * @note Both {@link UseOnEvent} and {@link UseOnceEvent} both return callbacks
 * equivalent to this, but only for the event that is subscribed to by calling the
 * respective hook.
 *
 *
 * @returns An {@link OffEventDeferred} function.
 *
 * @group Internal
 */
export function useOffEventDeferred(
): Readonly<[ offEventDeferred: OffEventDeferred ]>
{
    const { off } = UseIpcRenderer();
    const offEventDeferred: OffEventDeferred = useCallback(function<
        ChannelType extends Channel.Listener<MainOwner>
    >(
        channel: ChannelType,
        listener: RendererListener<typeof channel>
    ): void
    {
        off(channel, listener);
    }, [ off ]);

    return [ offEventDeferred ] as const;
}

/**
 * Equivalent to {@link UseOnEvent}, but the listener will be unsubscribed
 * after firing once.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the `main` event to which you wish to subscribe
 * the {@link listener}.
 * @param listener - The {@link RendererListener} that will be subscribed to the given
 * {@link channel}.
 *
 * @returns An {@link OffEventDeferred} to unsubscribe the {@link listener} early.
 *
 * @group Internal
 */
export function useOnceEvent<ChannelType extends Channel.Listener<MainOwner>
>(
    channel: ChannelType,
    listener: RendererListener<typeof channel>
): Readonly<[ offEventDeferred: OffEventDeferred ]>
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

/**
 * Returns an {@link OnceEventDeferred}, to subscribe to `main` events when desired.
 *
 *
 * @returns A {@link OnceEventDeferred} function.
 *
 * @group Internal
 */
export function useOnceEventDeferred(
): Readonly<[ onEventDeferred: OnceEventDeferred ]>
{
    const { off, once } = UseIpcRenderer();

    const onEventDeferred: OnEventDeferred = useCallback(function<
        ChannelType extends Channel.Listener<MainOwner>
    >(
        channel: ChannelType,
        listener: RendererListener<typeof channel>
    ): Readonly<[ offEventDeferred: (() => void) ]>
    {
        once(channel, listener);

        // eslint-disable-next-line jsdoc/require-jsdoc
        function offEventDeferred(): void
        {
            off(channel, listener);
        }

        return [ offEventDeferred ] as const;
    }, [ off, once ]);

    return [ onEventDeferred ] as const;
}

// eslint-disable-next-line jsdoc/require-jsdoc
function SendEventInternal<ChannelType extends Channel.Handler.Without.Request>(
    send: ReactiveEventContextInternal["ipcRenderer"]["send"],
    channel: ChannelType,
    request:
        | Decl.Request<typeof channel>
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

/**
 * Send an event when the containing component mounts, whose event declaration
 * does *not* define a request type.
 *
 * @note {@link | Sendable events} do *not* end with a response returned by
 * `main`.  If you wish to send an event to `main` such that it returns a
 * {@link Invoke.Result | response}, declare the {@link EventDecl | event type}
 * with a `ResponseType !== {@link EmptyEventParameter}`.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the event that you wish to send.
 *
 * @group Internal
 */
export function useSendEvent<ChannelType extends Channel.Handler.Without.Request>(
    channel: ChannelType
): void;
/**
 * Send an event when the containing component mounts, whose event declaration
 * defines a request type.
 *
 * @note {@link | Sendable events} do *not* end with a response returned by
 * `main`.  If you wish to send an event to `main` such that it returns a
 * {@link Invoke.Result | response}, declare the {@link EventDecl | event type}
 * with a `ResponseType !== {@link EmptyEventParameter}`.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the event that you wish to invoke.
 * @param request - The request sent with this event.
 *
 * @group Internal
 */
export function useSendEvent<ChannelType extends Channel.Handler.Without.Request>(
    channel: ChannelType,
    request: Decl.Request<typeof channel, RendererOwner>
): void;
/**
 * Send an event when the containing component mounts.
 *
 * @note {@link | Sendable events} do *not* end with a response returned by
 * `main`.  If you wish to send an event to `main` such that it returns a
 * {@link Invoke.Result | response}, declare the {@link EventDecl | event type}
 * with a `ResponseType !== {@link EmptyEventParameter}`.
 *
 * @typeParam ChannelType - The channel that uniquely identifies the desired
 * event declaration.
 *
 * @param channel - The channel of the event that you wish to invoke.
 * @param request - The overloaded request argument; it is sent to `main` iff it is
 * *not* the default {@link EmptyOverloadParameterValue}.
 *
 * @group Internal
 */
export function useSendEvent<ChannelType extends Channel.Handler.Without.Request>(
    channel: ChannelType,
    request:
        | Decl.Request<typeof channel, RendererOwner>
        | EmptyOverloadParameter = EmptyOverloadParameterValue
): void
{
    const { send } = UseIpcRenderer();

    useEffect((): void =>
    {
        SendEventInternal(send, channel, request);
    }, [ channel, request, send ]);
}

/**
 * Returns a {@link SendEventDeferred} function, to send events when desired.
 *
 *
 * @returns A {@link SendEventDeferred} function.
 *
 * @group Internal
 */
export function useSendEventDeferred(
): Readonly<[ sendEventDeferred: SendEventDeferred ]>
{
    const { send } = UseIpcRenderer();

    function SendEventDeferredBase<
        ChannelType extends Channel.Handler.Without.Request>(
        channel: ChannelType
    ): void;
    function SendEventDeferredBase<
        ChannelType extends Channel.Handler.Without.Request>(
        channel: ChannelType,
        request: Decl.Request<typeof channel, RendererOwner>
    ): void;
    // eslint-disable-next-line jsdoc/require-jsdoc
    function SendEventDeferredBase<
        ChannelType extends Channel.Handler.Without.Request>(
        channel: ChannelType,
        request:
            | Decl.Request<typeof channel, RendererOwner>
            | EmptyOverloadParameter = EmptyOverloadParameterValue
    ): void
    {
        SendEventInternal(send, channel, request);
    }

    const sendEventDeferred: SendEventDeferred =
        useCallback(SendEventDeferredBase, [ SendEventDeferredBase, send ]);

    return [ sendEventDeferred ] as const;
}
