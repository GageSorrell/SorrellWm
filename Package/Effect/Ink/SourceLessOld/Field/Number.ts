/**
 * The {@link \@sorrell/effect-ink/Field | Field} that accepts a `number`.
 *
 * @see {@link \@sorrell/effect-ink/Field/Rational} for modeling rational numbers.
 * @see {@link \@sorrell/effect-ink/Field/BigInt} for modeling `bigint`s.
 * @see {@link \@sorrell/effect-ink/Field/BigDecimal} for modeling {@link BigDecimal}.
 *
 * @module @sorrell/effect-ink/Field/Number
 */

/**
 * @file      Number.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Field from "./Field.ts";
import type * as Internal from "../Internal/Number.ts";
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { BigDecimal } from "effect/BigDecimal";
import type { Prompt } from "../index.ts";

export const TypeIdKey: string = "@sorrell/effect-ink/Field/Number";

export const TypeId: unique symbol = Symbol.for(TypeIdKey);
export type TypeId = typeof TypeId;

export interface Number extends Prompt.Prompt<number>
{

}

export interface Options extends Internal.DecimalOptionsBase<number> { }

export const Number = (Options: Options.Number): Number =>
{
    return
};

// export function BigDecimal(Options: Options.BigDecimal): BigDecimal
// {
//     return
// }
