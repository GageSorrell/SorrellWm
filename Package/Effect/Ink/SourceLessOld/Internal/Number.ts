/**
 *
 *
 * @module @sorrell/effect-ink/Internal/Number
 */

/**
 * @file      Number.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { BigDecimal } from "effect/BigDecimal";
import type { Field } from "../index.ts";

/**
 * @property {boolean} Wrap - If {@link Min} and {@link Max} have been set, then
 * this determines whether incrementing and decrementing past the {@link Min} or {@link Max}
 * will cause the value to be set to the other value of the two.
 *
 * @property {boolean} IncrementOnly - Whether values can be entered by entering digits directly.
 * A value of `true` is incompatible with {@link AllowIncrement} set to `false`.
 *
 * @property {boolean} AllowIncrement - Whether incrementing *and decrementing* are allowed.
 */
export interface OptionsBase<NumberType> extends Field.Options<NumberType>
{
    readonly Min?: NumberType;
    readonly Max?: NumberType;

    readonly Wrap?: boolean;

    readonly IncrementOnly?: boolean;
    readonly AllowIncrement?: boolean;

    readonly GetIncrement?:
        | ((CurrentValue?: NumberType) => NumberType)
        | (() => NumberType);

    readonly GetDecrement?:
        | ((CurrentValue?: NumberType) => NumberType)
        | (() => NumberType);
}

/**
 *
 * @property {boolean} AllowExponential - Whether exponential notation (using either `"e"`
 * or `"E"`) is allowed.
 */
export interface DecimalOptionsBase<NumberType extends number | BigDecimal>
    extends OptionsBase<NumberType>
{
    readonly AllowExponential?: boolean;
}
