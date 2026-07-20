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
import { type DependencyList, type ReactNode } from "react";
export interface RuntimeProviderProps<R = never> {
    readonly Context: Context.Context<R>;
    readonly children: ReactNode;
}
export declare function RuntimeProvider<R = never>(Props: RuntimeProviderProps<R>): ReactNode;
export declare const WithRuntimeProvider: <R>(Children: ReactNode) => Effect.Effect<ReactNode, never, R>;
export declare const useRuntimeContext: <R = never>() => Context.Context<R>;
export declare const useOptionalRuntimeContext: <R = never>() => Context.Context<R> | undefined;
export interface EffectPendingState {
    readonly _tag: "Pending";
}
export interface EffectSuccessState<A, E> {
    readonly _tag: "Success";
    readonly Value: A;
    readonly Exit: Exit.Exit<A, E>;
}
export interface EffectFailureState<A, E> {
    readonly _tag: "Failure";
    readonly Exit: Exit.Exit<A, E>;
}
export type EffectValueState<A, E> = EffectPendingState | EffectSuccessState<A, E> | EffectFailureState<A, E>;
export declare const Pending: EffectPendingState;
export interface FiberIdleState {
    readonly _tag: "Idle";
}
export interface FiberRunningState<A, E> {
    readonly _tag: "Running";
    readonly Fiber: Fiber.Fiber<A, E>;
}
export interface FiberDoneState<A, E> {
    readonly _tag: "Done";
    readonly Fiber: Fiber.Fiber<A, E>;
    readonly Exit: Exit.Exit<A, E>;
}
export type EffectFiberState<A, E> = FiberIdleState | FiberRunningState<A, E> | FiberDoneState<A, E>;
export declare const Idle: FiberIdleState;
export interface EffectCallbackHandle<A, E> {
    readonly Promise: Promise<Exit.Exit<A, E>>;
    readonly Interrupt: () => void;
}
export declare const useRunPromiseExit: <R = never>() => <A, E>(Program: Effect.Effect<A, E, R>, Options?: Effect.RunOptions) => Promise<Exit.Exit<A, E>>;
export declare const useRunFork: <R = never>() => <A, E>(Program: Effect.Effect<A, E, R>, Options?: Effect.RunOptions) => Fiber.Fiber<A, E>;
export declare const useEffectValue: <A, E, R = never>(Program: Effect.Effect<A, E, R>, Dependencies?: DependencyList, Options?: Effect.RunOptions) => EffectValueState<A, E>;
export declare const useEffectExit: <A, E, R = never>(Program: Effect.Effect<A, E, R>, Dependencies?: DependencyList, Options?: Effect.RunOptions) => Exit.Exit<A, E> | undefined;
export declare const useFiber: <A, E, R = never>(Program: Effect.Effect<A, E, R>, Dependencies?: DependencyList, Options?: Effect.RunOptions) => EffectFiberState<A, E>;
export declare const useEffectCallback: <Arguments extends ReadonlyArray<unknown>, A, E, R = never>(MakeProgram: (...Arguments: Arguments) => Effect.Effect<A, E, R>, Dependencies?: DependencyList) => ((...Arguments: Arguments) => EffectCallbackHandle<A, E>);
export declare const useMemoizedEffect: <A, E, R = never>(MakeProgram: () => Effect.Effect<A, E, R>, Dependencies?: DependencyList) => Effect.Effect<A, E, R>;
export declare const isPending: <A, E>(State: EffectValueState<A, E>) => State is EffectPendingState;
export declare const isSuccess: <A, E>(State: EffectValueState<A, E>) => State is EffectSuccessState<A, E>;
export declare const isFailure: <A, E>(State: EffectValueState<A, E>) => State is EffectFailureState<A, E>;
export declare const isFiberIdle: <A, E>(State: EffectFiberState<A, E>) => State is FiberIdleState;
export declare const isFiberRunning: <A, E>(State: EffectFiberState<A, E>) => State is FiberRunningState<A, E>;
export declare const isFiberDone: <A, E>(State: EffectFiberState<A, E>) => State is FiberDoneState<A, E>;
export declare const assertRuntimeContext: <R = never>() => Context.Context<R> | never;
//# sourceMappingURL=React.d.ts.map