/**
 * Typed descriptors and Effect operations for tracked global values.
 *
 * @module @sorrell/log/Global
 *
 * @file      Global.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Data,
    DateTime,
    Effect,
    type LogLevel
} from "effect";
import * as Category from "./Category.js";
import type { CategoryInput } from "./Category.js";
import { LogRuntime } from "./Effect/LogRuntime.js";
import type { LogValue } from "./LogValue.js";

/** Runtime identifier carried by every global descriptor. */
export const TypeId: unique symbol = Symbol.for("@sorrell/log/Global");

/** Supported presentation and validation kinds for global values. */
export type GlobalKind =
    | "Boolean"
    | "DateTime"
    | "Integer"
    | "Number"
    | "String"
    | "Value";

/** Serializable metadata that identifies and presents a global value. */
export interface GlobalDefinition
{
    readonly Key: string;
    readonly Name: string;
    readonly Type: GlobalKind;
    readonly Category?: string;
    readonly Level: LogLevel.Severity;
    readonly MinimumValue?: number;
    readonly MaximumValue?: number;
    readonly DisplayTimeSince?: boolean;
}

/** Structured global update attached to an unnormalized log input. */
export interface GlobalValueInput
{
    readonly Definition: GlobalDefinition;
    readonly Value: unknown;
}

/** Normalized, JSON-safe global value stored in a `LogRecord`. */
export interface GlobalLogValue
{
    readonly Definition: GlobalDefinition;
    readonly UpdatedAt: string;
    readonly Value: LogValue;
}

/** Date values accepted by a DateTime global descriptor. */
export type GlobalDateTime = Date | DateTime.DateTime;

interface GlobalOptionsBase
{
    readonly Name?: string;
    readonly Category?: CategoryInput;
    readonly Level?: LogLevel.Severity;
}

/** Options for a general normalized global value. */
export interface ValueGlobalOptions extends GlobalOptionsBase
{
    readonly Type?: "Value";
}

/** Options for a string global value. */
export interface StringGlobalOptions extends GlobalOptionsBase
{
    readonly Type: "String";
}

/** Options for a boolean global value. */
export interface BooleanGlobalOptions extends GlobalOptionsBase
{
    readonly Type: "Boolean";
}

/** Options for a finite numeric global value. */
export interface NumberGlobalOptions extends GlobalOptionsBase
{
    readonly Type: "Number";
    readonly MinimumValue?: number;
    readonly MaximumValue?: number;
}

/** Options for a safe-integer global value. */
export interface IntegerGlobalOptions extends GlobalOptionsBase
{
    readonly Type: "Integer";
    readonly MinimumValue?: number;
    readonly MaximumValue?: number;
}

/** Options for an Effect or JavaScript DateTime global value. */
export interface DateTimeGlobalOptions extends GlobalOptionsBase
{
    readonly Type: "DateTime";
    readonly DisplayTimeSince?: boolean;
}

/** Options accepted by `MakeGlobal`. */
export type GlobalOptions =
    | ValueGlobalOptions
    | StringGlobalOptions
    | BooleanGlobalOptions
    | NumberGlobalOptions
    | IntegerGlobalOptions
    | DateTimeGlobalOptions;

/** A branded, Schema-like description of one globally tracked value. */
export interface Global<in out Key extends string, in out Value>
{
    readonly [TypeId]: {
        readonly Key: Key;
        readonly Value: Value;
    };
    readonly Definition: GlobalDefinition;
    readonly Key: Key;
    readonly Name: string;
    readonly Type: GlobalKind;
}

/** A type or value mismatch reported by `LogGlobal`. */
export class GlobalValueError extends Data.TaggedError("GlobalValueError")<{
    readonly Cause?: unknown;
    readonly Key: string;
    readonly Message: string;
}> { }

function ShortText(Value: string, Name: string): string
{
    if (Value.length === 0 || Value.length > 256 || /[\u0000-\u001f]/u.test(Value))
    {
        throw new RangeError(`${ Name } must contain 1–256 printable characters.`);
    }

    return Value;
}

function Bound(Value: number | undefined, Name: string): number | undefined
{
    if (Value !== undefined && !Number.isFinite(Value))
    {
        throw new RangeError(`${ Name } must be finite when supplied.`);
    }

    return Value;
}

function Definition(
    Key: string,
    Options: GlobalOptions
): GlobalDefinition
{
    const Type = Options.Type ?? "Value";
    const MinimumValue = Type === "Integer" || Type === "Number"
        ? Bound(
            "MinimumValue" in Options ? Options.MinimumValue : undefined,
            "MinimumValue"
        )
        : undefined;
    const MaximumValue = Type === "Integer" || Type === "Number"
        ? Bound(
            "MaximumValue" in Options ? Options.MaximumValue : undefined,
            "MaximumValue"
        )
        : undefined;

    if (MinimumValue !== undefined
        && MaximumValue !== undefined
        && MaximumValue <= MinimumValue)
    {
        throw new RangeError("MaximumValue must be greater than MinimumValue.");
    }

    if (Type === "Integer"
        && (MinimumValue !== undefined && !Number.isSafeInteger(MinimumValue)
            || MaximumValue !== undefined && !Number.isSafeInteger(MaximumValue)))
    {
        throw new RangeError("Integer global bounds must be safe integers.");
    }

    return Object.freeze({
        ...(Options.Category === undefined
            ? { }
            : { Category: Category.Make(Options.Category) }),
        ...(Type === "DateTime"
            && "DisplayTimeSince" in Options
            && Options.DisplayTimeSince === true
            ? { DisplayTimeSince: true }
            : { }),
        Key: ShortText(Key, "The global key"),
        Level: Options.Level ?? "Info",
        ...(MaximumValue === undefined ? { } : { MaximumValue }),
        ...(MinimumValue === undefined ? { } : { MinimumValue }),
        Name: ShortText(Options.Name ?? Key, "The global name"),
        Type
    });
}

/**
 * Create a Schema-like descriptor for a general normalized global value.
 *
 * @category Global values
 * @since 1.0.0
 */
export function MakeGlobal<Key extends string, Value = unknown>(
    Key: Key,
    Options?: ValueGlobalOptions
): Global<Key, Value>;

/**
 * Create a Schema-like descriptor for a string global value.
 *
 * @category Global values
 * @since 1.0.0
 */
export function MakeGlobal<Key extends string>(
    Key: Key,
    Options: StringGlobalOptions
): Global<Key, string>;

/**
 * Create a Schema-like descriptor for a boolean global value.
 *
 * @category Global values
 * @since 1.0.0
 */
export function MakeGlobal<Key extends string>(
    Key: Key,
    Options: BooleanGlobalOptions
): Global<Key, boolean>;

/**
 * Create a Schema-like descriptor for a finite number global value.
 *
 * @category Global values
 * @since 1.0.0
 */
export function MakeGlobal<Key extends string>(
    Key: Key,
    Options: NumberGlobalOptions
): Global<Key, number>;

/**
 * Create a Schema-like descriptor for a safe-integer global value.
 *
 * @category Global values
 * @since 1.0.0
 */
export function MakeGlobal<Key extends string>(
    Key: Key,
    Options: IntegerGlobalOptions
): Global<Key, number>;

/**
 * Create a Schema-like descriptor for an Effect or JavaScript DateTime value.
 *
 * @category Global values
 * @since 1.0.0
 */
export function MakeGlobal<Key extends string>(
    Key: Key,
    Options: DateTimeGlobalOptions
): Global<Key, GlobalDateTime>;

export function MakeGlobal<Key extends string, Value = unknown>(
    Key: Key,
    Options: GlobalOptions = { }
): Global<Key, Value>
{
    const DefinitionValue = Definition(Key, Options);

    return Object.freeze({
        [TypeId]: {
            Key,
            Value: undefined as Value
        },
        Definition: DefinitionValue,
        Key,
        Name: DefinitionValue.Name,
        Type: DefinitionValue.Type
    });
}

function Encode<Key extends string, Value>(
    GlobalValue: Global<Key, Value>,
    ValueInput: Value
): unknown
{
    if (typeof GlobalValue !== "object"
        || GlobalValue === null
        || !(TypeId in GlobalValue))
    {
        throw new TypeError("LogGlobal requires a value created by MakeGlobal.");
    }

    switch (GlobalValue.Type)
    {
        case "Boolean":
            if (typeof ValueInput !== "boolean")
            {
                throw new TypeError("A Boolean global requires a boolean value.");
            }
            return ValueInput;
        case "String":
            if (typeof ValueInput !== "string")
            {
                throw new TypeError("A String global requires a string value.");
            }
            return ValueInput;
        case "Number":
            if (typeof ValueInput !== "number" || !Number.isFinite(ValueInput))
            {
                throw new TypeError("A Number global requires a finite number.");
            }
            if (GlobalValue.Definition.MinimumValue !== undefined
                && ValueInput < GlobalValue.Definition.MinimumValue
                || GlobalValue.Definition.MaximumValue !== undefined
                && ValueInput > GlobalValue.Definition.MaximumValue)
            {
                throw new RangeError("The Number global value is outside its configured range.");
            }
            return ValueInput;
        case "Integer":
            if (typeof ValueInput !== "number" || !Number.isSafeInteger(ValueInput))
            {
                throw new TypeError("An Integer global requires a safe integer.");
            }
            if (GlobalValue.Definition.MinimumValue !== undefined
                && ValueInput < GlobalValue.Definition.MinimumValue
                || GlobalValue.Definition.MaximumValue !== undefined
                && ValueInput > GlobalValue.Definition.MaximumValue)
            {
                throw new RangeError("The Integer global value is outside its configured range.");
            }
            return ValueInput;
        case "DateTime":
            if (ValueInput instanceof Date)
            {
                if (Number.isNaN(ValueInput.getTime()))
                {
                    throw new TypeError("A DateTime global requires a valid Date.");
                }
                return ValueInput.toISOString();
            }
            if (DateTime.isDateTime(ValueInput))
            {
                return DateTime.formatIso(ValueInput);
            }
            throw new TypeError(
                "A DateTime global requires an Effect DateTime or JavaScript Date."
            );
        case "Value":
            return ValueInput;
    }
}

/**
 * Emit an Effect log that updates a globally tracked value.
 *
 * The supplied descriptor determines the accepted value type and the metadata
 * retained for live clients. The operation publishes through the active
 * `LogRuntime`.
 *
 * @category Global values
 * @since 1.0.0
 */
export function LogGlobal<Key extends string, Value>(
    GlobalValue: Global<Key, Value>,
    ValueInput: Value
): Effect.Effect<void, GlobalValueError, LogRuntime>
{
    return Effect.flatMap(
        Effect.try({
            catch: (Cause: unknown) => new GlobalValueError({
                Cause,
                Key: typeof GlobalValue?.Key === "string"
                    ? GlobalValue.Key
                    : "<invalid>",
                Message: Cause instanceof Error
                    ? Cause.message
                    : "The global value could not be encoded."
            }),
            try: () => Encode(GlobalValue, ValueInput)
        }),
        (Encoded: unknown) => Effect.flatMap(
            LogRuntime,
            (Runtime) => Runtime.Publish({
                ...(GlobalValue.Definition.Category === undefined
                    ? { }
                    : { Category: GlobalValue.Definition.Category }),
                Global: {
                    Definition: GlobalValue.Definition,
                    Value: Encoded
                },
                Level: GlobalValue.Definition.Level,
                Message: [ `${ GlobalValue.Name } =`, Encoded ],
                Source: "Effect"
            })
        )
    );
}
