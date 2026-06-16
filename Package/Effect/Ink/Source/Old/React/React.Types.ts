/**
 * @file      React.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Context, Exit, Fiber } from "effect";
import type { ReactNode } from "react";

export interface RuntimeProviderProps<R = never>
{
    readonly Context: Context.Context<R>;
    readonly children: ReactNode;
}

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

export interface EffectCallbackHandle<A, E>
{
    readonly Promise: Promise<Exit.Exit<A, E>>;
    readonly Interrupt: () => void;
}

