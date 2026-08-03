/**
 * Log forwarding types and operations for protocol.
 *
 * @module @sorrell/log/Forward/Protocol
 *
 * @file      Protocol.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { GlobalLogValue } from "../Global.js";
import type { ApplicationMetadata, LogRecord, ProcessMetadata } from "../LogRecord.js";
import {
    ValidateGlobalLogValue,
    ValidateRecord
} from "./Validation.js";

/** Current local transport protocol major version. */
export const ProtocolVersion = 1 as const;

/** Application-to-viewer handshake. */
export interface HelloMessage
{
    readonly Type: "Hello";
    readonly ProtocolVersion: 1;
    readonly Application: ApplicationMetadata;
    readonly Process?: ProcessMetadata;
}

/** One versioned structured log record. */
export interface LogMessage
{
    readonly Type: "Log";
    readonly Record: LogRecord;
}

/** Bounded-queue loss notification. */
export interface DroppedMessage
{
    readonly Type: "Dropped";
    readonly Count: number;
}

/** Graceful transport shutdown notification. */
export interface GoodbyeMessage
{
    readonly Type: "Goodbye";
}

/** Current retained global values sent when a viewer connects. */
export interface GlobalSnapshotMessage
{
    readonly Type: "GlobalSnapshot";
    readonly Values: ReadonlyArray<GlobalLogValue>;
}

/** Version-one NDJSON wire message. */
export type WireMessage =
    | HelloMessage
    | LogMessage
    | DroppedMessage
    | GlobalSnapshotMessage
    | GoodbyeMessage;

/** Serialize one complete wire message without ANSI output. */
export function Serialize(Message: WireMessage): string
{
    return `${ JSON.stringify(Message) }\n`;
}

/**
 *
 */
function IsRecord(Value: unknown): Value is Readonly<Record<string, unknown>>
{
    return typeof Value === "object" && Value !== null && !Array.isArray(Value);
}

/**
 *
 */
function IsOptionalString(Value: unknown): Value is string | undefined
{
    return Value === undefined || typeof Value === "string";
}

/**
 *
 */
function Application(
    Value: unknown
): ApplicationMetadata | undefined
{
    if (!IsRecord(Value)
        || typeof Value.Name !== "string"
        || Value.Name.length === 0
        || !IsOptionalString(Value.Version)
        || !IsOptionalString(Value.InstanceIdentifier)
        || !IsOptionalString(Value.BuildIdentifier))
    {
        return undefined;
    }

    return {
        ...(Value.BuildIdentifier === undefined
            ? { }
            : { BuildIdentifier: Value.BuildIdentifier }),
        ...(Value.InstanceIdentifier === undefined
            ? { }
            : { InstanceIdentifier: Value.InstanceIdentifier }),
        Name: Value.Name,
        ...(Value.Version === undefined ? { } : { Version: Value.Version })
    };
}

/**
 *
 */
function Process(Value: unknown): ProcessMetadata | undefined
{
    if (!IsRecord(Value)
        || (Value.ProcessIdentifier !== undefined
            && (!Number.isSafeInteger(Value.ProcessIdentifier)
                || (Value.ProcessIdentifier as number) < 0))
        || !IsOptionalString(Value.ProcessType)
        || !IsOptionalString(Value.ThreadIdentifier)
        || !IsOptionalString(Value.Platform)
        || !IsOptionalString(Value.Architecture))
    {
        return undefined;
    }

    return {
        ...(Value.Architecture === undefined
            ? { }
            : { Architecture: Value.Architecture }),
        ...(Value.Platform === undefined ? { } : { Platform: Value.Platform }),
        ...(Value.ProcessIdentifier === undefined
            ? { }
            : { ProcessIdentifier: Value.ProcessIdentifier as number }),
        ...(Value.ProcessType === undefined
            ? { }
            : { ProcessType: Value.ProcessType }),
        ...(Value.ThreadIdentifier === undefined
            ? { }
            : { ThreadIdentifier: Value.ThreadIdentifier })
    };
}

/**
 * Parse and validate one version-one NDJSON wire message.
 *
 * Unknown fields are ignored. Invalid JSON, malformed records, and unsupported
 * protocol versions return `undefined`.
 */
export function Deserialize(Text: string): WireMessage | undefined
{
    let Value: unknown;

    try
    {
        Value = JSON.parse(Text);
    }
    catch
    {
        return undefined;
    }

    if (!IsRecord(Value) || typeof Value.Type !== "string")
    {
        return undefined;
    }

    switch (Value.Type)
    {
        case "Hello":
        {
            const ApplicationValue = Application(Value.Application);
            const ProcessValue = Value.Process === undefined
                ? undefined
                : Process(Value.Process);

            if (Value.ProtocolVersion !== ProtocolVersion
                || ApplicationValue === undefined
                || (Value.Process !== undefined && ProcessValue === undefined))
            {
                return undefined;
            }

            return {
                Application: ApplicationValue,
                ...(ProcessValue === undefined ? { } : { Process: ProcessValue }),
                ProtocolVersion,
                Type: "Hello"
            };
        }
        case "Log":
        {
            const Record = ValidateRecord(Value.Record);
            return Record === undefined
                ? undefined
                : {
                    Record,
                    Type: "Log"
                };
        }
        case "Dropped":
            return Number.isSafeInteger(Value.Count) && (Value.Count as number) > 0
                ? {
                    Count: Value.Count as number,
                    Type: "Dropped"
                }
                : undefined;
        case "GlobalSnapshot":
        {
            if (!Array.isArray(Value.Values) || Value.Values.length > 10_000)
            {
                return undefined;
            }

            const Values = Value.Values.map(
                (GlobalValue: unknown) => ValidateGlobalLogValue(GlobalValue)
            );
            return Values.every(
                (GlobalValue: GlobalLogValue | undefined): GlobalValue is GlobalLogValue =>
                    GlobalValue !== undefined
            )
                ? {
                    Type: "GlobalSnapshot",
                    Values
                }
                : undefined;
        }
        case "Goodbye":
            return { Type: "Goodbye" };
        default:
            return undefined;
    }
}
