/**
 *
 *
 * @module @sorrell/ink-ui/Mouse/Click
 *
 * @file      Click.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";
import type { IntPoint } from "@sorrell/math";

/** The recognized click gestures. */
export type Click = Data.TaggedEnum<{
    readonly Single: { };
    readonly Double: {
        readonly Duration: number;
        readonly Drift: IntPoint.IntPoint;
    };
}>;

export/** Constructors and matchers for click gestures. */
const Click = Data.taggedEnum<Click>();
