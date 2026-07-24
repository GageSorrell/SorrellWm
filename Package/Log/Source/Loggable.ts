/**
 *
 *
 * @module @sorrell/log/Loggable
 *
 * @file      Loggable.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LogRedacted, LogValue, LogValueInput } from "./LogValue.js";
import type { NormalizeOptions } from "./Normalize.js";

/** Global protocol symbol used by values that control their logged representation. */
export const TypeId: unique symbol =
    Symbol.for("@sorrell/log/Loggable") as typeof TypeId;

/** Safe services made available to a custom log representation. */
export interface LoggableContext
{
    readonly Depth: number;
    readonly Options: NormalizeOptions;
    readonly Normalize: (Value: unknown) => LogValue;
    readonly Redacted: (Label?: string) => LogRedacted;
}

/** A value that provides its own structured log representation. */
export interface Loggable
{
    readonly [TypeId]: (Context: LoggableContext) => LogValueInput;
}
