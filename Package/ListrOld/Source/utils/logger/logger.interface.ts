/**
 * @file      logger.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrLogger } from "./logger.js";
import type { ProcessOutputRendererOptions } from "@utils/index.js";
import type { TMaybeArray } from "@sorrell/utilities/misc";

/**
 * Options for the logger
 */
export interface ListrLoggerOptions<Levels extends string> extends
    ProcessOutputRendererOptions,
    ListrLoggerStyleMap<Levels | string>
{
    /**
     * Use icons for the log levels.
     */
    useIcons?: boolean

    /**
     * Apply fields and templates as presets before and after each message.
     */
    fields?: LoggerFieldOptions<true>

    /**
     * Send the designated levels to `process.stderr`.
     */
    toStderr?: Array<Levels | string>
}

/**
 * Inject your custom style map consisting of icons and coloring for the ListrLogger.
 *
 * @see {@link https://listr2.kilic.dev/renderer/logger.html}
 */
export interface ListrLoggerStyleMap<Levels extends string>
{
    /**
     * Coloring of the levels.
     *
     * @see {@link https://listr2.kilic.dev/renderer/logger.html#style}
     */
    color?: Partial<Record<Levels, LoggerFormat>>

    /**
     * Icons of the levels.
     *
     * @see {@link https://listr2.kilic.dev/renderer/logger.html#style}
     */
    icon?: Partial<Record<Levels, string | (() => string)>>
}

export interface LoggerFieldOptions<MultipleOnly extends boolean = false>
{
    /**
     * Prefix fields for the log entry.
     */
    prefix?: MultipleOnly extends false ? TMaybeArray<LoggerField> : Array<LoggerField>;

    /**
     * Suffix fields for the log entry.
     */
    suffix?: MultipleOnly extends false ? TMaybeArray<LoggerField> : Array<LoggerField>;
}

export type LoggerFormat = (message?: string) => string;

export interface LoggerFieldFn<Args extends Array<any> = Array<any>>
{
    /**
     * The value of the given field.
     */
    field: ((...args: Args) => string) | string

    /**
     * Condition to display the given field.
     */
    condition?: ((...args: Args) => boolean) | boolean

    /**
     * Formatting/coloring of the field.
     */
    format?: (...args: Args) => LoggerFormat

    /**
     * Args to pass to other functions whenever this field is triggered.
     */
    args?: Args
}

export type LoggerField<Args extends Array<unknown> = Array<unknown>> =
    | string
    | LoggerFieldFn<Args>;

export interface RendererLoggerOptions<Levels extends string> {
    /**
     * Inject your custom implementation of the ListrLogger.
     *
     * @see {@link https://listr2.kilic.dev/renderer/logger.html}
     */
    Logger?: ListrLogger<Levels>;
}

export interface LoggerFormatOptions
{
    format?: LoggerFormat
}
