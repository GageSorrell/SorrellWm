/**
 * Native logging integration for native record.
 *
 * @module @sorrell/log/Native/NativeRecord
 *
 * @file      NativeRecord.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LogLevel } from "effect";

/** Primitive field values accepted from the initial native bridge schema. */
export type NativeFieldValue = null | boolean | number | bigint | string;

/** JavaScript representation produced by the shipped C++ bridge. */
export interface NativeRecord
{
    readonly Level: LogLevel.Severity;
    readonly Category: string;
    readonly Message: string;
    readonly Fields: Readonly<Record<string, NativeFieldValue>>;
    readonly ThreadIdentifier?: string;
}

/** Limits applied before a native record enters the common runtime. */
export interface NativeValidationOptions
{
    readonly MaximumFields?: number;
    readonly MaximumStringLength?: number;
}
