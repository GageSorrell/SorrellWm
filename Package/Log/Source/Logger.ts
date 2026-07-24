/**
 *
 *
 * @module @sorrell/log/Logger
 *
 * @file      Logger.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { LogLevel } from "effect";
import * as Category from "./Category.js";
import type { CategoryInput } from "./Category.js";
import type { LogInput, LogSource } from "./LogRecord.js";

/** Minimal runtime surface required by non-Effect logging integrations. */
export interface UnsafePublisher
{
    readonly PublishUnsafe: (Input: LogInput) => void;
}

/** Direct log method for code that cannot conveniently return an Effect. */
export type LogMethod = (...Message: ReadonlyArray<unknown>) => void;

/** A synchronous, nonblocking, best-effort logger. */
export interface DirectLogger
{
    readonly Trace: LogMethod;
    readonly Debug: LogMethod;
    readonly Info: LogMethod;
    readonly Warn: LogMethod;
    readonly Error: LogMethod;
    readonly Fatal: LogMethod;
    readonly Child: (ChildCategory: CategoryInput) => DirectLogger;
    readonly WithAnnotations: (
        Annotations: Readonly<Record<string, unknown>>
    ) => DirectLogger;
}

/** Options for constructing a direct logger. */
export interface MakeLoggerOptions
{
    readonly Annotations?: Readonly<Record<string, unknown>>;
    readonly Source?: LogSource;
}

/** Construct a direct logger over a runtime's safe synchronous publication path. */
export function MakeLogger(
    Runtime: UnsafePublisher,
    CategoryInputValue: CategoryInput = "Application",
    Options: MakeLoggerOptions = { }
): DirectLogger
{
    const CategoryValue = Category.Make(CategoryInputValue);
    const Annotations = Options.Annotations ?? { };
    const Source = Options.Source ?? "JavaScript";

    const Method = (Level: LogLevel.Severity): LogMethod =>
        (...Message: ReadonlyArray<unknown>): void =>
        {
            try
            {
                Runtime.PublishUnsafe({
                    Annotations,
                    Category: CategoryValue,
                    Level,
                    Message,
                    Source
                });
            }
            catch
            {
                // Direct logging is deliberately best effort and never throws.
            }
        };

    return Object.freeze({
        Child: (ChildCategory: CategoryInput): DirectLogger =>
            MakeLogger(Runtime, Category.Child(CategoryValue, ChildCategory), {
                Annotations,
                Source
            }),
        Debug: Method("Debug"),
        Error: Method("Error"),
        Fatal: Method("Fatal"),
        Info: Method("Info"),
        Trace: Method("Trace"),
        Warn: Method("Warn"),
        WithAnnotations: (
            ChildAnnotations: Readonly<Record<string, unknown>>
        ): DirectLogger => MakeLogger(Runtime, CategoryValue, {
            Annotations: {
                ...Annotations,
                ...ChildAnnotations
            },
            Source
        })
    });
}
