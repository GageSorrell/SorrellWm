/**
 * Utilities for `react` components that represent the atoms of prompts.
 *
 * @module @sorrell/effect-ink/React/Component
 */

/**
 * @file      Component.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Hook, State } from "./index.ts";
import type { ReactNode } from "react";
import { flow } from "effect/Function";

export type RenderFunction<StateType extends State.State> = (State: StateType) => ReactNode;

/* eslint-disable @typescript-eslint/no-explicit-any */

export type AnyRenderFunction = RenderFunction<any>;

/* eslint-enable @typescript-eslint/no-explicit-any */

export type ComponentFromHook<
    UseStateHookType extends State.AnyUseHook
> = (Props: State.PropsFromHook<UseStateHookType>) => ReactNode;

export type Component<PropsType extends Hook.Props> = (Props: PropsType) => ReactNode;

export const MakeComponent = <
    UseStateHookType extends State.AnyUseHook,
    RenderFunctionType extends AnyRenderFunction
>(
    UseStateHook: UseStateHookType,
    RenderFunction: RenderFunctionType
): (Props: State.PropsFromHook<typeof UseStateHook>) => ReactNode =>
    flow(UseStateHook, RenderFunction);
