/**
 * Lightweight categorized Effect log-event constructors.
 *
 * @module @sorrell/wm/Main/Log
 *
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as SorrellLogging from "@sorrell/log/Effect";
import { Effect } from "effect";

/** Structured context attached to an application log event. */
export interface EventAnnotations
{
    readonly [Key: string]: unknown;
}

const Annotate = (
    Category: string,
    Annotations: EventAnnotations
) => <Value, ErrorValue, Requirements>(
    EventValue: Effect.Effect<Value, ErrorValue, Requirements>
): Effect.Effect<Value, ErrorValue, Requirements> => EventValue.pipe(
    Effect.annotateLogs(Annotations),
    SorrellLogging.WithCategory(Category)
);

export/** Emit a categorized debug event. */
const LogDebug = (
    Category: string,
    Message: string,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => Effect.logDebug(Message).pipe(
    Annotate(Category, Annotations)
);

export/** Emit a categorized informational event. */
const LogInfo = (
    Category: string,
    Message: string,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => Effect.logInfo(Message).pipe(
    Annotate(Category, Annotations)
);

export/** Emit a categorized warning event. */
const LogWarning = (
    Category: string,
    Message: string,
    Cause?: unknown,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => (
    Cause === undefined
        ? Effect.logWarning(Message)
        : Effect.logWarning(Message, Cause)
).pipe(Annotate(Category, Annotations));

export/** Emit a categorized error event. */
const LogError = (
    Category: string,
    Message: string,
    Cause?: unknown,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => (
    Cause === undefined
        ? Effect.logError(Message)
        : Effect.logError(Message, Cause)
).pipe(Annotate(Category, Annotations));
