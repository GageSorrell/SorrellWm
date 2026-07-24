/**
 *
 *
 * @module @sorrell/log/LogRecord
 *
 * @file      LogRecord.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LogLevel } from "effect";
import type { Category } from "./Category.js";
import type {
    GlobalLogValue,
    GlobalValueInput
} from "./Global.js";
import type { LogValue } from "./LogValue.js";

/** The subsystem in which a record originated. */
export type LogSource = "Effect" | "JavaScript" | "React" | "Native" | "Forwarded";

/** Metadata shared by every process in one application instance. */
export interface ApplicationMetadata
{
    readonly Name: string;
    readonly Version?: string;
    readonly InstanceIdentifier?: string;
    readonly BuildIdentifier?: string;
}

/** Metadata describing the process that normalized a record. */
export interface ProcessMetadata
{
    readonly ProcessIdentifier?: number;
    readonly ProcessType?: string;
    readonly ThreadIdentifier?: string;
    readonly Platform?: string;
    readonly Architecture?: string;
}

/** A duration-measuring Effect log span. */
export interface LogSpan
{
    readonly Label: string;
    readonly DurationMilliseconds: number;
}

/** Metadata available from an Effect fiber. */
export interface FiberMetadata
{
    readonly Identifier: number;
    readonly CurrentLogLevel?: LogLevel.Severity;
}

/** Stable, normalized, version-one record delivered to sinks and transports. */
export interface LogRecord
{
    readonly SchemaVersion: 1;
    readonly Sequence: number;
    readonly Timestamp: string;
    readonly Level: LogLevel.Severity;
    readonly Category: Category;
    readonly Source: LogSource;
    readonly Message: ReadonlyArray<LogValue>;
    readonly Global?: GlobalLogValue;
    readonly Annotations: Readonly<Record<string, LogValue>>;
    readonly Spans: ReadonlyArray<LogSpan>;
    readonly Cause?: LogValue;
    readonly Fiber?: FiberMetadata;
    readonly Application?: ApplicationMetadata;
    readonly Process?: ProcessMetadata;
}

/** Unnormalized event accepted by a logging runtime. */
export interface LogInput
{
    readonly Timestamp?: Date | string;
    readonly Level: LogLevel.Severity;
    readonly Category?: Category | string;
    readonly Source: LogSource;
    readonly Message: ReadonlyArray<unknown>;
    readonly Global?: GlobalValueInput | GlobalLogValue;
    readonly Annotations?: Readonly<Record<string, unknown>>;
    readonly Spans?: ReadonlyArray<LogSpan>;
    readonly Cause?: unknown;
    readonly Fiber?: FiberMetadata;
    readonly Application?: ApplicationMetadata;
    readonly Process?: ProcessMetadata;

    /**
     * Indicates that values crossed the versioned validation boundary already.
     * This is reserved for forwarding adapters; ordinary callers must omit it.
     */
    readonly Normalized?: boolean;
}
