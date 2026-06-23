/**
 * Core types and utilities shared across the other modules under
 * {@link \@sorrell/effect-ink/Field}.
 *
 * @module @sorrell/effect-ink/Field/Field
 */

/**
 * @file      Field.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Prompt from "../Prompt.ts";
import type { Validate } from "./index.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Field";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Field<A, E = never, R = never> extends Prompt.Prompt<A, E, R>
{
    readonly _tag: "Field";
}

export interface State<A>
{

}

export interface Options<A, StateType extends State<A>>
{
    readonly InitialState?: StateType;
    readonly Validator?: Validate.Validator<A>;
}
