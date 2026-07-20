/**
 * The base interface for all number types provided by this package.
 *
 * @module @sorrell/effect-number/Number
 */

/**
 * @file      Number.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Equal } from "effect/Equal";
import type { Inspectable } from "effect/Inspectable";
import type { Pipeable } from "effect/Pipeable";

export interface Number extends Equal, Pipeable, Inspectable { };
