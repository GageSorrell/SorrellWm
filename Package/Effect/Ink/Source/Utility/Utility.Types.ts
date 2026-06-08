/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Effect } from "effect";

export type MaybeEffect<A, E = never, R = never> =
    | A
    | Effect.Effect<A, E, R>;
