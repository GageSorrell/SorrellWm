/**
 * Tasks are the atoms of a prompt that communicate the state of actions performed by your
 * program in response to user input.  They are similar to {@link \@sorrell/effect-ink/Prose}
 * in the sense that they *display* information, rather than *asking* for information.
 *
 * @module @sorrell/effect-ink/Task
 */

/**
 * @file      Task.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Prompt from "./Prompt.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Task";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Task<A, E = never, R = never> extends Prompt.Prompt<A, E, R>
{
    readonly _tag: "Task";
}
