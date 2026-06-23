/**
 * Utilities for handling the state of `react` components that represent the atoms of prompts.
 *
 * @module @sorrell/effect-ink/React/State
 */

import type { Props } from "./Hook";

/**
 * @file      State.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * The base type that the state (*i.e.*, the object returned by the hook that transforms
 * the props into usable state) of a `react` component `extends`.
 */
export type State = object;

/**
 * The type of the hook that transforms the {@link PropsType | props} of a `react` component
 * into its usable {@link StateType | state}.
 *
 * @template PropsType - The type of the props of the given `react` component.
 * @template StateType - The type of the state of the given `react` component.
 */
export type UseHook<
    PropsType extends Props,
    StateType extends State
> = (Props: PropsType) => StateType;

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The type of `any` {@link UseHook}. */
export type AnyUseHook = UseHook<any, any>;

export type PropsFromHook<UseStateHookType> =
    UseStateHookType extends UseHook<infer PropsType, any>
        ? PropsType
        : never;

/* eslint-enable @typescript-eslint/no-explicit-any */
