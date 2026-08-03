/**
 * Public exports for `@sorrell/log`.
 *
 * @module @sorrell/log/index
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * as Category from "./Category.js";
export * as Filter from "./Filter.js";
export * as Forward from "./Forward/index.js";
export * as ForwardSink from "./Forward/ForwardSink.js";
export * as Global from "./Global.js";
export * as Loggable from "./Loggable.js";
export * as LogValue from "./LogValue.js";
export * as Normalize from "./Normalize.js";
export type { Formatter } from "./Formatter.js";
export * from "./Logger.js";
export {
    LogGlobal,
    MakeGlobal,
    GlobalValueError
} from "./Global.js";
export type {
    BooleanGlobalOptions,
    DateTimeGlobalOptions,
    Global as GlobalValue,
    GlobalDateTime,
    GlobalDefinition,
    GlobalKind,
    GlobalLogValue,
    GlobalOptions,
    IntegerGlobalOptions,
    NumberGlobalOptions,
    StringGlobalOptions,
    ValueGlobalOptions
} from "./Global.js";
export * from "./LogRecord.js";
export { Redacted } from "./Redacted.js";
export * from "./Sink.js";
