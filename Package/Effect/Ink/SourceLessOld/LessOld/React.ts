/**
 * Utilities for creating `ink` components that represent prompts.
 * This module is only needed if you are creating custom prompts.
 *
 * @module @sorrell/effect-ink/React
 */

/**
 * @file      React.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Impl } from "./Prompt/index.ts";
import type { ReactNode } from "react";
import { flow } from "effect";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type UseStateHook<A, PropsType extends Impl.State<A>, StateType extends object> =
    (Props: PropsType) => StateType;

export type RenderFunction<
    A,
    UseStateHookType extends UseStateHook<A, any, any>,
    NodeType extends ReactNode = ReactNode
> =
    UseStateHookType extends UseStateHook<A, any, infer StateType>
        ? (State: StateType) => NodeType
        : never;

/* eslint-enable @typescript-eslint/no-explicit-any */

export const MakeComponent = <
    const A,
    const PropsType extends Impl.State<A>,
    const StateType extends object,
    const NodeType extends ReactNode = ReactNode
>(
    UseStateHook: UseStateHook<A, PropsType, StateType>,
    RenderFunction: RenderFunction<A, typeof UseStateHook, NodeType>
): ((Props: PropsType) => NodeType) =>
    flow(UseStateHook, RenderFunction);
