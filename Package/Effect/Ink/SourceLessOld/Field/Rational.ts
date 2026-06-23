/**
 *
 *
 * @module @sorrell/effect-ink/Field/Rational
 */

/**
 * @file      Rational.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../Internal/Number.ts";
import type * as _Rational from "@sorrell/effect-rational";
import type { Prompt } from "../index.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Field/Rational";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Rational extends Prompt.Prompt<_Rational.Rational>
{

}

/**
 *
 * @property {boolean} DiscreteInputs - Whether the numerator and denominator
 * should be interacted with as two separate `bigint`s.
 */
export interface Options extends Internal.OptionsBase<_Rational.Rational>
{
    readonly DiscreteInputs?: boolean;
}

export const Rational = (Options: Options.Rational): Rational =>
{
    return
};

