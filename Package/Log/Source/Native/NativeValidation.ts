/**
 *
 *
 * @module @sorrell/log/Native/NativeValidation
 *
 * @file      NativeValidation.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { IsSeverity } from "../Effect/LogRuntime.js";
import * as Category from "../Category.js";
import type {
    NativeFieldValue,
    NativeRecord,
    NativeValidationOptions
} from "./NativeRecord.js";

/**
 *
 */
function IsFieldValue(
    Value: unknown,
    MaximumStringLength: number
): Value is NativeFieldValue
{
    return Value === null
        || typeof Value === "boolean"
        || typeof Value === "bigint"
        || typeof Value === "number" && Number.isFinite(Value)
        || typeof Value === "string" && Value.length <= MaximumStringLength;
}

/** Validate an object received from native addon code. */
export function Validate(
    Input: unknown,
    Options: NativeValidationOptions = { }
): NativeRecord | undefined
{
    const MaximumFields = Options.MaximumFields ?? 100;
    const MaximumStringLength = Options.MaximumStringLength ?? 16_384;

    try
    {
        if (typeof Input !== "object" || Input === null || Array.isArray(Input))
        {
            return undefined;
        }

        const Value = Input as Readonly<Record<string, unknown>>;
        if (!IsSeverity(Value.Level)
            || typeof Value.Category !== "string"
            || Value.Category.length > MaximumStringLength
            || Category.TryMake(Value.Category) === undefined
            || typeof Value.Message !== "string"
            || Value.Message.length > MaximumStringLength
            || typeof Value.Fields !== "object"
            || Value.Fields === null
            || Array.isArray(Value.Fields)
            || (Value.ThreadIdentifier !== undefined
                && (typeof Value.ThreadIdentifier !== "string"
                    || Value.ThreadIdentifier.length > MaximumStringLength)))
        {
            return undefined;
        }

        const Fields = Value.Fields as Readonly<Record<string, unknown>>;
        const Entries = Object.entries(Fields);
        if (Entries.length > MaximumFields
            || Entries.some(([ Key, FieldValue ]) =>
                Key.length > MaximumStringLength
                || !IsFieldValue(FieldValue, MaximumStringLength)))
        {
            return undefined;
        }

        return Value as unknown as NativeRecord;
    }
    catch
    {
        return undefined;
    }
}
