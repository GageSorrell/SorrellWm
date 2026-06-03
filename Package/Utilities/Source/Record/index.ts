/**
 * Utilities for working with {@link Record | Records}.
 *
 * @note This is intended to be a small collection of helpers; consider
 * {@link https://effect-ts.github.io/effect/typeclass/data/Record.ts.html | the Record module in effect}
 * as a "primary" module for tools for working with Records.
 *
 * @module @sorrell/utilities/record
 */

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * from "./Record.ts";
export type { RecordNonNullable as NonNullable } from "./Record.Meta.ts";
export * from "./Record.Types.ts";
