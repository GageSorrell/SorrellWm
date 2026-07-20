/**
 * The atoms of a prompt that display static information, rather than accepting input from the user.
 *
 * @module @sorrell/effect-ink/Prose
 */

/**
 * @file      Prose.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Prompt from "./Prompt.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Prose";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Prose<A, E = never, R = never> extends Prompt.Prompt<A, E, R>
{
    readonly _tag: "Prose";
}
