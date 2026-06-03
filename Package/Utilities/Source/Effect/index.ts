/**
 * Utilities for using `effect`.  In particular, for defining {@link Effect | effect types}.
 *
 * @module @sorrell/utilities/effect
 */

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Effect } from "effect/Effect";

export * from "./Effect.ts";
export * from "./Effect.Types.ts";
export * as Platform from "./Platform/index.ts";
