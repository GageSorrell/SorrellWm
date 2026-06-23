/**
 *
 *
 * @module @sorrell/effect-ink/Field/BigDecimal
 */

/**
 * @file      BigDecimal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../Internal/Number.ts";
import type * as _BigDecimal from "effect/BigDecimal";
import type { Prompt } from "../index.ts";
import type { Field } from "./index.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Field/BigDecimal";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface BigDecimal extends Field<_BigDecimal.BigDecimal>
{

}

export interface Options extends Internal.DecimalOptionsBase<_BigDecimal.BigDecimal> { }

export const BigDecimal = (Options: Options): BigDecimal =>
{

};
