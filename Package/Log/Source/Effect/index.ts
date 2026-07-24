/**
 *
 *
 * @module @sorrell/log/Effect/index
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Layer as EffectLayer,
    type Layer as LayerType,
    LogLevel,
    References
} from "effect";
import {
    EffectLoggerLayer,
    type EffectLoggerOptions
} from "./EffectLog.js";
import type {
    LogRuntime
} from "./LogRuntime.js";
import {
    type LogRuntimeOptions,
    RuntimeLayer
} from "./LogRuntime.js";

export * from "./EffectLog.js";
export * from "./LogRuntime.js";

/** Options for a scoped runtime layer that also replaces Effect's active loggers. */
export type LayerOptions = LogRuntimeOptions & EffectLoggerOptions;

/**
 * Construct a scoped runtime and install its Effect logger.
 *
 * Effect v4 beta.99 uses `Logger.layer` for installation and public
 * `References.CurrentLogAnnotations` / `CurrentLogSpans` for event context.
 */
export function Layer(
    Options: LayerOptions
): LayerType.Layer<LogRuntime>
{
    const Thresholds = [
        Options.MinimumLevel ?? "All",
        ...Object.values(Options.CategoryMinimumLevels ?? { })
    ];
    const EffectMinimumLevel = Thresholds.reduce((Least, Current) =>
        LogLevel.getOrdinal(Current) < LogLevel.getOrdinal(Least)
            ? Current
            : Least);
    const AdapterLayer = EffectLayer.mergeAll(
        EffectLoggerLayer(
            Options.DefaultCategory === undefined
                ? { }
                : { DefaultCategory: Options.DefaultCategory }
        ),
        EffectLayer.succeed(References.MinimumLogLevel, EffectMinimumLevel)
    );

    return AdapterLayer.pipe(
        EffectLayer.provideMerge(RuntimeLayer(Options))
    );
}
