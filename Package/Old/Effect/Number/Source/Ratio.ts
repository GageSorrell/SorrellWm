/**
 *
 *
 * @module @sorrell/effect-number
 */

/**
 * @file      RationalBase.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Number } from "./Number.ts";

export interface Ratio<PartType> extends Number
{
    readonly Numerator: PartType;
    readonly Denominator: PartType;

    // readonly CanonicalForm: ThisType | undefined;
}
