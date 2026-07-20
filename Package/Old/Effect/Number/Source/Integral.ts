/**
 * The base type for {@link \@sorrell/effect-number/Int | Int },
 * {@link \@sorrell/effect-number/UnsignedInt | UnsignedInt }, and
 * {@link \@sorrell/effect-number/Natural | Natural }.
 *
 * @remarks
 * This module is unrelated to the transform from calculus;
 * this module is named after the adjective form of *integer*.
 *
 * @module @sorrell/effect-number/Integral
 */

/**
 * @file      Integral.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Number from "./Number.ts";

export interface Integral<ValueType extends number | bigint> extends Number.Number
{
    readonly Value: ValueType;
}
