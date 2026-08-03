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
import { Effect, type Record, pipe } from "effect";

/** Structured context attached to an application log event. */
export interface EventAnnotations extends Record.ReadonlyRecord<string, unknown> { }

const Annotate = (
    Category: string,
    Annotations: EventAnnotations
) => <A, E, R>(
    EventValue: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> => pipe(
    EventValue,
    Effect.annotateLogs(Annotations),
    SorrellLogging.WithCategory(Category)
);

export/** Emit a categorized debug event. */
const LogDebug = (
    Category: string,
    Message: string,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => pipe(
    Effect.logDebug(Message),
    Annotate(Category, Annotations)
);

export/** Emit a categorized informational event. */
const LogInfo = (
    Category: string,
    Message: string,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => pipe(
    Effect.logInfo(Message),
    Annotate(Category, Annotations)
);

export/** Emit a categorized warning event. */
const LogWarning = (
    Category: string,
    Message: string,
    Cause?: unknown,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => pipe(
    Cause === undefined
        ? Effect.logWarning(Message)
        : Effect.logWarning(Message, Cause),
    Annotate(Category, Annotations)
);

export/** Emit a categorized error event. */
const LogError = (
    Category: string,
    Message: string,
    Cause?: unknown,
    Annotations: EventAnnotations = { }
): Effect.Effect<void> => pipe(
    Cause === undefined
        ? Effect.logError(Message)
        : Effect.logError(Message, Cause),
    Annotate(Category, Annotations)
);
