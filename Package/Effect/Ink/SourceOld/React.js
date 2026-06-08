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
import { Effect, Exit, Fiber } from "effect";
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { InkComponentEffectError, InkRuntimeProviderMissingError, inkRuntimeProviderMissing } from "./Error.js";
const EmptyDependencies = [];
const EffectContext = createContext(undefined);
export function RuntimeProvider(Props) {
    return createElement(EffectContext.Provider, {
        value: Props.Context
    }, Props.children);
}
export const WithRuntimeProvider = (Children) => Effect.context().pipe(Effect.map((RuntimeContext) => createElement((RuntimeProvider), {
    Context: RuntimeContext,
    children: Children
})));
export const useRuntimeContext = () => {
    const RuntimeContext = useContext(EffectContext);
    if (RuntimeContext === undefined) {
        throw inkRuntimeProviderMissing();
    }
    return RuntimeContext;
};
export const useOptionalRuntimeContext = () => {
    return useContext(EffectContext);
};
export const Pending = {
    _tag: "Pending"
};
export const Idle = {
    _tag: "Idle"
};
export const useRunPromiseExit = () => {
    const RuntimeContext = useRuntimeContext();
    return useCallback((Program, Options) => Effect.runPromiseExitWith(RuntimeContext)(Program, Options), [RuntimeContext]);
};
export const useRunFork = () => {
    const RuntimeContext = useRuntimeContext();
    return useCallback((Program, Options) => Effect.runForkWith(RuntimeContext)(Program, Options), [RuntimeContext]);
};
export const useEffectValue = (Program, Dependencies = EmptyDependencies, Options) => {
    const RuntimeContext = useRuntimeContext();
    const [State, SetState] = useState(Pending);
    const RunIdRef = useRef(0);
    useEffect(() => {
        const RunId = RunIdRef.current + 1;
        RunIdRef.current = RunId;
        const AbortControllerInstance = new AbortController();
        SetState(Pending);
        Effect
            .runPromiseExitWith(RuntimeContext)(Program, {
            ...Options,
            signal: Options?.signal ?? AbortControllerInstance.signal
        })
            .then((ProgramExit) => {
            if (RunIdRef.current !== RunId) {
                return;
            }
            if (Exit.isSuccess(ProgramExit)) {
                SetState({
                    Exit: ProgramExit,
                    Value: ProgramExit.value,
                    _tag: "Success"
                });
            }
            else {
                SetState({
                    Exit: ProgramExit,
                    _tag: "Failure"
                });
            }
        })
            .catch((Cause) => {
            if (RunIdRef.current !== RunId) {
                return;
            }
            SetState({
                Exit: Exit.fail(new InkComponentEffectError({
                    Cause,
                    Message: "An Effect launched by an Ink React component rejected unexpectedly."
                })),
                _tag: "Failure"
            });
        });
        return () => {
            RunIdRef.current = RunIdRef.current + 1;
            AbortControllerInstance.abort();
        };
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [RuntimeContext, Program, Options, ...Dependencies]);
    return State;
};
export const useEffectExit = (Program, Dependencies = EmptyDependencies, Options) => {
    const State = useEffectValue(Program, Dependencies, Options);
    return State._tag === "Pending"
        ? undefined
        : State.Exit;
};
export const useFiber = (Program, Dependencies = EmptyDependencies, Options) => {
    const RuntimeContext = useRuntimeContext();
    const [State, SetState] = useState(Idle);
    const RunIdRef = useRef(0);
    useEffect(() => {
        const RunId = RunIdRef.current + 1;
        RunIdRef.current = RunId;
        const FiberInstance = Effect.runForkWith(RuntimeContext)(Program, Options);
        SetState({
            Fiber: FiberInstance,
            _tag: "Running"
        });
        const RemoveObserver = FiberInstance.addObserver((ProgramExit) => {
            if (RunIdRef.current !== RunId) {
                return;
            }
            SetState({
                Exit: ProgramExit,
                Fiber: FiberInstance,
                _tag: "Done"
            });
        });
        return () => {
            RunIdRef.current = RunIdRef.current + 1;
            RemoveObserver();
            Effect.runFork(Fiber.interrupt(FiberInstance));
        };
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [RuntimeContext, Program, Options, ...Dependencies]);
    return State;
};
export const useEffectCallback = (MakeProgram, Dependencies = EmptyDependencies) => {
    const RuntimeContext = useRuntimeContext();
    return useCallback((...Arguments) => {
        const AbortControllerInstance = new AbortController();
        const Promise = Effect.runPromiseExitWith(RuntimeContext)(MakeProgram(...Arguments), {
            signal: AbortControllerInstance.signal
        });
        return {
            Interrupt: () => {
                AbortControllerInstance.abort();
            },
            Promise
        };
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [RuntimeContext, MakeProgram, ...Dependencies]);
};
export const useMemoizedEffect = (MakeProgram, Dependencies = EmptyDependencies) => {
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    return useMemo(MakeProgram, Dependencies);
};
export const isPending = (State) => {
    return State._tag === "Pending";
};
export const isSuccess = (State) => {
    return State._tag === "Success";
};
export const isFailure = (State) => {
    return State._tag === "Failure";
};
export const isFiberIdle = (State) => {
    return State._tag === "Idle";
};
export const isFiberRunning = (State) => {
    return State._tag === "Running";
};
export const isFiberDone = (State) => {
    return State._tag === "Done";
};
export const assertRuntimeContext = () => {
    const RuntimeContext = useOptionalRuntimeContext();
    if (RuntimeContext === undefined) {
        throw new InkRuntimeProviderMissingError({
            Message: "No Effect runtime provider was found in the Ink React tree."
        });
    }
    return RuntimeContext;
};
//# sourceMappingURL=React.js.map