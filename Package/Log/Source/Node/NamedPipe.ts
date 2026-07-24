/**
 * Windows named-pipe addressing for local log streams.
 *
 * @module @sorrell/log/Node/NamedPipe
 *
 * @file      NamedPipe.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ProtocolVersion } from "../Forward/Protocol.js";

/** Windows namespace containing named pipes. */
export const Directory = "\\\\.\\pipe\\";

/** Prefix shared by every discoverable `@sorrell/log` named pipe. */
export const NamePrefix = `sorrell-log-v${ ProtocolVersion }-`;

/** Lowest accepted named-pipe port. */
export const MinimumPort = 1;

/** Highest accepted named-pipe port. */
export const MaximumPort = 65_535;

/**
 * Determine whether a value is a valid `@sorrell/log` named-pipe port.
 *
 * @since 1.0.0
 */
export function IsPort(Value: unknown): Value is number
{
    return typeof Value === "number"
        && Number.isSafeInteger(Value)
        && Value >= MinimumPort
        && Value <= MaximumPort;
}

/**
 * Validate and return a named-pipe port.
 *
 * @throws {RangeError} When `Value` is outside the supported port range.
 *
 * @since 1.0.0
 */
export function Port(Value: number): number
{
    if (!IsPort(Value))
    {
        throw new RangeError(
            `The log port must be an integer from ${ MinimumPort } through ${ MaximumPort }.`
        );
    }

    return Value;
}

/**
 * Get the discoverable pipe name for a port.
 *
 * @since 1.0.0
 */
export function Name(PortValue: number): string
{
    return `${ NamePrefix }${ Port(PortValue) }`;
}

/**
 * Get the complete Windows named-pipe path for a port.
 *
 * @since 1.0.0
 */
export function Path(PortValue: number): string
{
    return `${ Directory }${ Name(PortValue) }`;
}

/**
 * Parse a port from a discoverable pipe name.
 *
 * @since 1.0.0
 */
export function ParseName(NameValue: string): number | undefined
{
    if (!NameValue.startsWith(NamePrefix))
    {
        return undefined;
    }

    const Value = Number(NameValue.slice(NamePrefix.length));
    return IsPort(Value) ? Value : undefined;
}
