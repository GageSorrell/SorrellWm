/**
 * Effect integration for structured logging with Effect log.
 *
 * @module @sorrell/log/Effect/EffectLog
 *
 * @file      EffectLog.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Cause,
    Context,
    Effect,
    Layer as EffectLayer,
    Logger as EffectLogger,
    type Logger,
    pipe,
    References
} from "effect";
import * as Category from "../Category.js";
import type { CategoryInput } from "../Category.js";
import type { LogInput, LogSpan } from "../LogRecord.js";
import { IsSeverity, LogRuntime, type Service } from "./LogRuntime.js";

/** Reserved annotation key recognized for interoperability with manual annotations. */
export const CategoryAnnotation = "@sorrell/log/category";

const CurrentCategory = Context.Reference<Category.Category | undefined>(
    "@sorrell/log/CurrentCategory",
    { defaultValue: () => undefined }
);

/** Options used when adapting Effect's logger into the common runtime. */
export interface EffectLoggerOptions
{
    readonly DefaultCategory?: CategoryInput;
}

function Messages(Value: unknown): ReadonlyArray<unknown>
{
    return Array.isArray(Value) ? Value : [ Value ];
}

/** Construct an Effect v4 logger that publishes to the common runtime. */
export function MakeEffectLogger(
    Runtime: Service,
    Options: EffectLoggerOptions = { }
): Logger.Logger<unknown, void>
{
    const DefaultCategory = Category.Make(
        Options.DefaultCategory ?? Runtime.DefaultCategory
    );

    return EffectLogger.make((LoggerOptions: Logger.Options<unknown>): void =>
    {
        if (!IsSeverity(LoggerOptions.logLevel))
        {
            return;
        }

        const RawAnnotations = LoggerOptions.fiber.getRef(References.CurrentLogAnnotations);
        const Annotations: Record<string, unknown> = { ...RawAnnotations };
        const ContextCategory = LoggerOptions.fiber.getRef(CurrentCategory);
        const AnnotatedCategory = Annotations[CategoryAnnotation];
        delete Annotations[CategoryAnnotation];

        let CategoryValue = ContextCategory === undefined
            ? DefaultCategory
            : Category.Child(DefaultCategory, ContextCategory);
        if (ContextCategory === undefined && typeof AnnotatedCategory === "string")
        {
            try
            {
                CategoryValue = Category.Child(DefaultCategory, AnnotatedCategory);
            }
            catch
            {
                CategoryValue = DefaultCategory;
            }
        }

        const Now = LoggerOptions.date.getTime();
        const Spans: Array<LogSpan> = LoggerOptions.fiber
            .getRef(References.CurrentLogSpans)
            .map(([ Label, Timestamp ]: readonly [string, number]) => ({
                DurationMilliseconds: Math.max(0, Now - Timestamp),
                Label
            }));
        const Input: LogInput = {
            Annotations,
            Category: CategoryValue,
            ...(LoggerOptions.cause.reasons.length === 0
                ? { }
                : {
                    Cause: {
                        Pretty: Cause.pretty(LoggerOptions.cause),
                        Reasons: LoggerOptions.cause.reasons
                    }
                }),
            Fiber: {
                ...(IsSeverity(LoggerOptions.fiber.currentLogLevel)
                    ? { CurrentLogLevel: LoggerOptions.fiber.currentLogLevel }
                    : { }),
                Identifier: LoggerOptions.fiber.id
            },
            Level: LoggerOptions.logLevel,
            Message: Messages(LoggerOptions.message),
            Source: "Effect",
            Spans,
            Timestamp: LoggerOptions.date
        };

        Runtime.PublishUnsafe(Input);
    });
}

/** Install the adapter for an already-provided LogRuntime service. */
export function EffectLoggerLayer(
    Options: EffectLoggerOptions = { }
): EffectLayer.Layer<never, never, LogRuntime>
{
    return EffectLayer.unwrap(
        Effect.map(
            LogRuntime,
            (Runtime: Service) => EffectLogger.layer([
                MakeEffectLogger(Runtime, Options)
            ])
        )
    );
}

/** Append a hierarchical category for all Effect logs emitted by an effect. */
export function WithCategory(
    ChildCategory: CategoryInput
): <A, E, R>(EffectValue: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
{
    const ChildValue = Category.Make(ChildCategory);

    return <A, E, R>(
        EffectValue: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E, R> => pipe(EffectValue, Effect.updateService(CurrentCategory, (Parent: Category.Category | undefined) =>
            Parent === undefined ? ChildValue : Category.Child(Parent, ChildValue)));
}
