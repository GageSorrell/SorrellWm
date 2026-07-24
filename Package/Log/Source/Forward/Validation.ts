/**
 *
 *
 * @module @sorrell/log/Forward/Validation
 *
 * @file      Validation.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Category from "../Category.js";
import type {
    GlobalDefinition,
    GlobalLogValue
} from "../Global.js";
import type {
    ApplicationMetadata,
    FiberMetadata,
    LogRecord,
    LogSpan,
    ProcessMetadata
} from "../LogRecord.js";
import type { LogValue } from "../LogValue.js";
import { IsSeverity } from "../Effect/LogRuntime.js";

/** Resource limits applied to untrusted forwarded records. */
export interface ValidationOptions
{
    readonly MaximumDepth?: number;
    readonly MaximumCollectionLength?: number;
    readonly MaximumObjectProperties?: number;
    readonly MaximumRecordBytes?: number;
    readonly MaximumStringLength?: number;
}

const Defaults: Required<ValidationOptions> = {
    MaximumCollectionLength: 1_000,
    MaximumDepth: 16,
    MaximumObjectProperties: 1_000,
    MaximumRecordBytes: 1_000_000,
    MaximumStringLength: 65_536
};

/**
 * @category Validation
 * @since 1.0.0
 */
function IsRecord(Value: unknown): Value is Readonly<Record<string, unknown>>
{
    return typeof Value === "object" && Value !== null && !Array.isArray(Value);
}

/**
 *
 * @category Validation
 * @since 1.0.0
 */
function IsShortString(Value: unknown, Options: Required<ValidationOptions>): Value is string
{
    return typeof Value === "string" && Value.length <= Options.MaximumStringLength;
}

/**
 *
 * @category Validation
 * @since 1.0.0
 */
function IsLogValue(
    Value: unknown,
    Options: Required<ValidationOptions>,
    Depth: number
): Value is LogValue
{
    if (Depth > Options.MaximumDepth)
    {
        return false;
    }

    if (Value === null || typeof Value === "boolean")
    {
        return true;
    }

    if (typeof Value === "number")
    {
        return Number.isFinite(Value);
    }

    if (typeof Value === "string")
    {
        return IsShortString(Value, Options);
    }

    if (!IsRecord(Value) || !IsShortString(Value._tag, Options))
    {
        return false;
    }

    switch (Value._tag)
    {
        case "BigInt":
        case "Date":
            return IsShortString(Value.Value, Options);
        case "Symbol":
            return (Value.Description === undefined || IsShortString(Value.Description, Options))
                && (Value.GlobalKey === undefined || IsShortString(Value.GlobalKey, Options));
        case "Function":
            return Value.Name === undefined || IsShortString(Value.Name, Options);
        case "Redacted":
            return Value.Label === undefined || IsShortString(Value.Label, Options);
        case "CircularReference":
            return IsShortString(Value.Path, Options);
        case "Truncated":
            return IsShortString(Value.Reason, Options)
                && (Value.Omitted === undefined
                    || Number.isSafeInteger(Value.Omitted) && Number(Value.Omitted) >= 0);
        case "Unavailable":
            return IsShortString(Value.Reason, Options)
                && (Value.Type === undefined || IsShortString(Value.Type, Options));
        case "Array":
        case "Set":
            return Array.isArray(Value.Value)
                && Value.Value.length <= Options.MaximumCollectionLength
                && Value.Value.every(
                    (Item: unknown) => IsLogValue(Item, Options, Depth + 1)
                );
        case "Map":
            return Array.isArray(Value.Value)
                && Value.Value.length <= Options.MaximumCollectionLength
                && Value.Value.every((Entry: unknown) =>
                    Array.isArray(Entry)
                    && Entry.length === 2
                    && IsLogValue(Entry[0], Options, Depth + 1)
                    && IsLogValue(Entry[1], Options, Depth + 1));
        case "Object":
        {
            if (!IsRecord(Value.Value)
                || Object.keys(Value.Value).length > Options.MaximumObjectProperties)
            {
                return false;
            }

            return Object.entries(Value.Value).every(([ Key, Item ]) =>
                IsShortString(Key, Options) && IsLogValue(Item, Options, Depth + 1));
        }
        case "Error":
            return IsShortString(Value.Name, Options)
                && IsShortString(Value.Message, Options)
                && (Value.Stack === undefined || IsShortString(Value.Stack, Options))
                && (Value.Cause === undefined || IsLogValue(Value.Cause, Options, Depth + 1))
                && (Value.Properties === undefined
                    || IsRecord(Value.Properties)
                    && Object.keys(Value.Properties).length <= Options.MaximumObjectProperties
                    && Object.values(Value.Properties).every(
                        (Item: unknown) => IsLogValue(Item, Options, Depth + 1)
                    ));
        default:
            return false;
    }
}

/**
 * @category Validation
 * @since 1.0.0
 */
function IsMetadata(
    Value: unknown,
    Options: Required<ValidationOptions>
): Value is ApplicationMetadata | ProcessMetadata | FiberMetadata
{
    return Value === undefined || IsRecord(Value)
        && Object.keys(Value).length <= 16
        && Object.values(Value).every((Item: unknown) =>
            Item === undefined
            || typeof Item === "number" && Number.isFinite(Item)
            || IsShortString(Item, Options));
}

/**
 *
 * @category Validation
 * @since 1.0.0
 */
function IsGlobalDefinition(
    Value: unknown,
    Options: Required<ValidationOptions>
): Value is GlobalDefinition
{
    if (!IsRecord(Value)
        || !IsShortString(Value.Key, Options)
        || Value.Key.length === 0
        || !IsShortString(Value.Name, Options)
        || Value.Name.length === 0
        || (Value.Type !== "Boolean"
            && Value.Type !== "DateTime"
            && Value.Type !== "Integer"
            && Value.Type !== "Number"
            && Value.Type !== "String"
            && Value.Type !== "Value")
        || !IsSeverity(Value.Level)
        || (Value.Category !== undefined
            && Category.TryMake(Value.Category) === undefined)
        || (Value.MinimumValue !== undefined
            && (typeof Value.MinimumValue !== "number"
                || !Number.isFinite(Value.MinimumValue)))
        || (Value.MaximumValue !== undefined
            && (typeof Value.MaximumValue !== "number"
                || !Number.isFinite(Value.MaximumValue)))
        || (Value.MinimumValue !== undefined
            && Value.MaximumValue !== undefined
            && Value.MaximumValue <= Value.MinimumValue)
        || (Value.DisplayTimeSince !== undefined
            && typeof Value.DisplayTimeSince !== "boolean")
        || (Value.Type !== "Integer"
            && Value.Type !== "Number"
            && (Value.MinimumValue !== undefined
                || Value.MaximumValue !== undefined))
        || (Value.Type !== "DateTime"
            && Value.DisplayTimeSince !== undefined))
    {
        return false;
    }

    return Value.Type !== "Integer"
        || (Value.MinimumValue === undefined
            || Number.isSafeInteger(Value.MinimumValue))
        && (Value.MaximumValue === undefined
            || Number.isSafeInteger(Value.MaximumValue));
}

/**
 *
 * @category Validation
 * @since 1.0.0
 */
function IsGlobalLogValue(
    Value: unknown,
    Options: Required<ValidationOptions>
): Value is GlobalLogValue
{
    if (!IsRecord(Value)
        || !IsGlobalDefinition(Value.Definition, Options)
        || !IsShortString(Value.UpdatedAt, Options)
        || Number.isNaN(new Date(Value.UpdatedAt).getTime())
        || !IsLogValue(Value.Value, Options, 0))
    {
        return false;
    }

    switch (Value.Definition.Type)
    {
        case "Boolean":
            return typeof Value.Value === "boolean";
        case "String":
            return typeof Value.Value === "string";
        case "Number":
            return typeof Value.Value === "number"
                && Number.isFinite(Value.Value)
                && (Value.Definition.MinimumValue === undefined
                    || Value.Value >= Value.Definition.MinimumValue)
                && (Value.Definition.MaximumValue === undefined
                    || Value.Value <= Value.Definition.MaximumValue);
        case "Integer":
            return typeof Value.Value === "number"
                && Number.isSafeInteger(Value.Value)
                && (Value.Definition.MinimumValue === undefined
                    || Value.Value >= Value.Definition.MinimumValue)
                && (Value.Definition.MaximumValue === undefined
                    || Value.Value <= Value.Definition.MaximumValue);
        case "DateTime":
            return typeof Value.Value === "string"
                && !Number.isNaN(new Date(Value.Value).getTime());
        case "Value":
            return true;
    }
}

/**
 * Validate and return one untrusted serialized global value.
 *
 * @category Validation
 * @since 1.0.0
 */
export function ValidateGlobalLogValue(
    Input: unknown,
    InputOptions: ValidationOptions = { }
): GlobalLogValue | undefined
{
    const Options = { ...Defaults, ...InputOptions };

    try
    {
        return IsGlobalLogValue(Input, Options)
            ? Input
            : undefined;
    }
    catch
    {
        return undefined;
    }
}

/**
 * Validate and return one untrusted serialized record.
 *
 * @category Validation
 * @since 1.0.0
 */
export function ValidateRecord(
    Input: unknown,
    InputOptions: ValidationOptions = { }
): LogRecord | undefined
{
    const Options = { ...Defaults, ...InputOptions };

    try
    {
        if (JSON.stringify(Input).length > Options.MaximumRecordBytes
            || !IsRecord(Input)
            || Input.SchemaVersion !== 1
            || !Number.isSafeInteger(Input.Sequence)
            || Number(Input.Sequence) < 0
            || !IsShortString(Input.Timestamp, Options)
            || Number.isNaN(new Date(Input.Timestamp).getTime())
            || !IsSeverity(Input.Level)
            || Category.TryMake(Input.Category) === undefined
            || (Input.Source !== "Effect"
                && Input.Source !== "JavaScript"
                && Input.Source !== "React"
                && Input.Source !== "Native"
                && Input.Source !== "Forwarded")
            || !Array.isArray(Input.Message)
            || Input.Message.length > Options.MaximumCollectionLength
            || !Input.Message.every(
                (Value: unknown) => IsLogValue(Value, Options, 0)
            )
            || !IsRecord(Input.Annotations)
            || Object.keys(Input.Annotations).length > Options.MaximumObjectProperties
            || !Object.entries(Input.Annotations).every(([ Key, Value ]) =>
                IsShortString(Key, Options) && IsLogValue(Value, Options, 0))
            || !Array.isArray(Input.Spans)
            || Input.Spans.length > Options.MaximumCollectionLength
            || !Input.Spans.every((Span: unknown): Span is LogSpan =>
                IsRecord(Span)
                && IsShortString(Span.Label, Options)
                && typeof Span.DurationMilliseconds === "number"
                && Number.isFinite(Span.DurationMilliseconds)
                && Span.DurationMilliseconds >= 0)
            || (Input.Cause !== undefined && !IsLogValue(Input.Cause, Options, 0))
            || (Input.Global !== undefined
                && !IsGlobalLogValue(Input.Global, Options))
            || !IsMetadata(Input.Fiber, Options)
            || !IsMetadata(Input.Application, Options)
            || !IsMetadata(Input.Process, Options))
        {
            return undefined;
        }

        return Input as unknown as LogRecord;
    }
    catch
    {
        return undefined;
    }
}
