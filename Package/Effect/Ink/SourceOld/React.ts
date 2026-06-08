/**
 * Utilities specific to `react`, for using `ink`.
 *
 * @module @sorrell/effect-ink/React
 */

/**
 * @file      React.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type Context, Effect, Exit, Fiber } from "effect";
import {
    type DependencyList,
    type ReactNode,
    type RefObject,
    createContext,
    createElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
    InkComponentEffectError,
    InkRuntimeProviderMissingError,
    inkRuntimeProviderMissing
} from "./Error.js";

const EmptyDependencies: DependencyList = [ ];

const EffectContext: React.Context<Context.Context<never> | undefined> =
    createContext<Context.Context<never> | undefined>(undefined);

export interface RuntimeProviderProps<R = never>
{
    readonly Context: Context.Context<R>;
    readonly children: ReactNode;
}

export function RuntimeProvider<R = never>(
    Props: RuntimeProviderProps<R>
): ReactNode
{
    return createElement(
        EffectContext.Provider,
        {
            value: Props.Context as Context.Context<never>
        },
        Props.children
    );
}

export const WithRuntimeProvider = <R>(
    Children: ReactNode
): Effect.Effect<ReactNode, never, R> =>
    Effect.context<R>().pipe(
        Effect.map((RuntimeContext: Context.Context<R>) =>
            createElement(
                RuntimeProvider<R>,
                {
                    Context: RuntimeContext,
                    children: Children
                }
            )
        )
    );

export const useRuntimeContext = <R = never>(): Context.Context<R> =>
{
    const RuntimeContext = useContext(EffectContext);

    if (RuntimeContext === undefined)
    {
        throw inkRuntimeProviderMissing();
    }

    return RuntimeContext as Context.Context<R>;
};

export const useOptionalRuntimeContext = <R = never>():
    | Context.Context<R>
    | undefined =>
{
    return useContext(EffectContext) as Context.Context<R> | undefined;
};

export interface EffectPendingState
{
    readonly _tag: "Pending";
}

export interface EffectSuccessState<A, E>
{
    readonly _tag: "Success";
    readonly Value: A;
    readonly Exit: Exit.Exit<A, E>;
}

export interface EffectFailureState<A, E>
{
    readonly _tag: "Failure";
    readonly Exit: Exit.Exit<A, E>;
}

export type EffectValueState<A, E> =
    | EffectPendingState
    | EffectSuccessState<A, E>
    | EffectFailureState<A, E>;

export const Pending: EffectPendingState =
    {
        _tag: "Pending"
    };

export interface FiberIdleState
{
    readonly _tag: "Idle";
}

export interface FiberRunningState<A, E>
{
    readonly _tag: "Running";
    readonly Fiber: Fiber.Fiber<A, E>;
}

export interface FiberDoneState<A, E>
{
    readonly _tag: "Done";
    readonly Fiber: Fiber.Fiber<A, E>;
    readonly Exit: Exit.Exit<A, E>;
}

export type EffectFiberState<A, E> =
    | FiberIdleState
    | FiberRunningState<A, E>
    | FiberDoneState<A, E>;

export const Idle: FiberIdleState =
    {
        _tag: "Idle"
    };

export interface EffectCallbackHandle<A, E>
{
    readonly Promise: Promise<Exit.Exit<A, E>>;
    readonly Interrupt: () => void;
}

export const useRunPromiseExit = <R = never>() =>
{
    const RuntimeContext = useRuntimeContext<R>();

    return useCallback(
        <A, E>(
            Program: Effect.Effect<A, E, R>,
            Options?: Effect.RunOptions
        ): Promise<Exit.Exit<A, E>> =>
            Effect.runPromiseExitWith(RuntimeContext)(Program, Options),
        [ RuntimeContext ]
    );
};

export const useRunFork = <R = never>() =>
{
    const RuntimeContext = useRuntimeContext<R>();

    return useCallback(
        <A, E>(
            Program: Effect.Effect<A, E, R>,
            Options?: Effect.RunOptions
        ): Fiber.Fiber<A, E> =>
            Effect.runForkWith(RuntimeContext)(Program, Options) as Fiber.Fiber<A, E>,
        [ RuntimeContext ]
    );
};

export const useEffectValue = <A, E, R = never>(
    Program: Effect.Effect<A, E, R>,
    Dependencies: DependencyList = EmptyDependencies,
    Options?: Effect.RunOptions
): EffectValueState<A, E> =>
{
    const RuntimeContext = useRuntimeContext<R>();

    const [ State, SetState ] = useState<EffectValueState<A, E>>(Pending);

    const RunIdRef: RefObject<number> = useRef(0);

    useEffect(
        () =>
        {
            const RunId: number = RunIdRef.current + 1;
            RunIdRef.current = RunId;

            const AbortControllerInstance: AbortController = new AbortController();

            SetState(Pending);

            Effect
                .runPromiseExitWith(RuntimeContext)(
                    Program,
                    {
                        ...Options,
                        signal: Options?.signal ?? AbortControllerInstance.signal
                    }
                )
                .then((ProgramExit: Exit.Exit<A, E>) =>
                {
                    if (RunIdRef.current !== RunId)
                    {
                        return;
                    }

                    if (Exit.isSuccess(ProgramExit))
                    {
                        SetState({
                            Exit: ProgramExit,
                            Value: ProgramExit.value,
                            _tag: "Success"
                        });
                    }
                    else
                    {
                        SetState({
                            Exit: ProgramExit,
                            _tag: "Failure"
                        });
                    }
                })
                .catch((Cause: unknown) =>
                {
                    if (RunIdRef.current !== RunId)
                    {
                        return;
                    }

                    SetState({
                        Exit: Exit.fail(
                            new InkComponentEffectError({
                                Cause,
                                Message: "An Effect launched by an Ink React component rejected unexpectedly."
                            }) as E
                        ) as Exit.Exit<A, E>,
                        _tag: "Failure"
                    });
                });

            return () =>
            {
                RunIdRef.current = RunIdRef.current + 1;
                AbortControllerInstance.abort();
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ RuntimeContext, Program, Options, ...Dependencies ]
    );

    return State;
};

export const useEffectExit = <A, E, R = never>(
    Program: Effect.Effect<A, E, R>,
    Dependencies: DependencyList = EmptyDependencies,
    Options?: Effect.RunOptions
): Exit.Exit<A, E> | undefined =>
{
    const State: EffectValueState<A, E> = useEffectValue(
        Program,
        Dependencies,
        Options
    );

    return State._tag === "Pending"
        ? undefined
        : State.Exit;
};

export const useFiber = <A, E, R = never>(
    Program: Effect.Effect<A, E, R>,
    Dependencies: DependencyList = EmptyDependencies,
    Options?: Effect.RunOptions
): EffectFiberState<A, E> =>
{
    const RuntimeContext = useRuntimeContext<R>();

    const [ State, SetState ] = useState<EffectFiberState<A, E>>(Idle);

    const RunIdRef: RefObject<number> = useRef(0);

    useEffect(
        () =>
        {
            const RunId: number = RunIdRef.current + 1;
            RunIdRef.current = RunId;

            const FiberInstance: Fiber.Fiber<A, E> =
                Effect.runForkWith(RuntimeContext)(
                    Program,
                    Options
                ) as Fiber.Fiber<A, E>;

            SetState({
                Fiber: FiberInstance,
                _tag: "Running"
            });

            const RemoveObserver: () => void = FiberInstance.addObserver((ProgramExit: Exit.Exit<A, E>) =>
            {
                if (RunIdRef.current !== RunId)
                {
                    return;
                }

                SetState({
                    Exit: ProgramExit as Exit.Exit<A, E>,
                    Fiber: FiberInstance,
                    _tag: "Done"
                });
            });

            return () =>
            {
                RunIdRef.current = RunIdRef.current + 1;

                RemoveObserver();

                Effect.runFork(
                    Fiber.interrupt(FiberInstance)
                );
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ RuntimeContext, Program, Options, ...Dependencies ]
    );

    return State;
};

export const useEffectCallback = <
    Arguments extends ReadonlyArray<unknown>,
    A,
    E,
    R = never
>(
    MakeProgram: (...Arguments: Arguments) => Effect.Effect<A, E, R>,
    Dependencies: DependencyList = EmptyDependencies
): ((...Arguments: Arguments) => EffectCallbackHandle<A, E>) =>
{
    const RuntimeContext = useRuntimeContext<R>();

    return useCallback(
        (...Arguments: Arguments): EffectCallbackHandle<A, E> =>
        {
            const AbortControllerInstance: AbortController = new AbortController();

            const Promise: Promise<Exit.Exit<A, E>> = Effect.runPromiseExitWith(RuntimeContext)(
                MakeProgram(...Arguments),
                {
                    signal: AbortControllerInstance.signal
                }
            );

            return {
                Interrupt: () =>
                {
                    AbortControllerInstance.abort();
                },
                Promise
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ RuntimeContext, MakeProgram, ...Dependencies ]
    );
};

export const useMemoizedEffect = <A, E, R = never>(
    MakeProgram: () => Effect.Effect<A, E, R>,
    Dependencies: DependencyList = EmptyDependencies
): Effect.Effect<A, E, R> =>
{
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    return useMemo(
        MakeProgram,
        Dependencies
    );
};

export const isPending = <A, E>(
    State: EffectValueState<A, E>
): State is EffectPendingState =>
{
    return State._tag === "Pending";
};

export const isSuccess = <A, E>(
    State: EffectValueState<A, E>
): State is EffectSuccessState<A, E> =>
{
    return State._tag === "Success";
};

export const isFailure = <A, E>(
    State: EffectValueState<A, E>
): State is EffectFailureState<A, E> =>
{
    return State._tag === "Failure";
};

export const isFiberIdle = <A, E>(
    State: EffectFiberState<A, E>
): State is FiberIdleState =>
{
    return State._tag === "Idle";
};

export const isFiberRunning = <A, E>(
    State: EffectFiberState<A, E>
): State is FiberRunningState<A, E> =>
{
    return State._tag === "Running";
};

export const isFiberDone = <A, E>(
    State: EffectFiberState<A, E>
): State is FiberDoneState<A, E> =>
{
    return State._tag === "Done";
};

export const assertRuntimeContext = <R = never>():
    | Context.Context<R>
    | never =>
{
    const RuntimeContext = useOptionalRuntimeContext<R>();

    if (RuntimeContext === undefined)
    {
        throw new InkRuntimeProviderMissingError({
            Message: "No Effect runtime provider was found in the Ink React tree."
        });
    }

    return RuntimeContext;
};
