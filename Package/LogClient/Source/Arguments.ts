/**
 * Command-line argument parsing for the built-in log client.
 *
 * @module @sorrell/log-client/Arguments
 *
 * @file      Arguments.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as NamedPipe from "@sorrell/log/Node/NamedPipe";

/** Parsed arguments accepted by the built-in terminal client. */
export interface ClientArguments
{
    readonly Help: boolean;
    readonly Port?: number;
}

/** Invalid command-line input. */
export class ClientArgumentError extends Error
{
    public override readonly name = "ClientArgumentError";
}

/** Help text displayed by the built-in executable. */
export const HelpText = `Usage: sorrell-log-client [port]

View structured logs from a local application using @sorrell/log.

Arguments:
  port                 Named-pipe port to connect to.

Options:
  -p, --port <port>    Named-pipe port to connect to.
  -h, --help           Show this help.

When no port is supplied, the first active ${ NamedPipe.NamePrefix }<port>
pipe is selected automatically. Press Escape to exit.`;

/**
 *
 */
function ParsePort(Text: string): number
{
    if (!/^\d+$/.test(Text))
    {
        throw new ClientArgumentError(`Invalid log port: ${ Text }`);
    }

    try
    {
        return NamedPipe.Port(Number(Text));
    }
    catch
    {
        throw new ClientArgumentError(`Invalid log port: ${ Text }`);
    }
}

/**
 * Parse positional, `--port`, and `-p` forms accepted by the executable.
 *
 * @category CLI
 * @since 1.0.0
 */
export function ParseArguments(
    Arguments: ReadonlyArray<string>
): ClientArguments
{
    let Port: number | undefined;
    let Help = false;

    for (let Index = 0; Index < Arguments.length; Index += 1)
    {
        const Argument = Arguments[Index];

        if (Argument === "--help" || Argument === "-h")
        {
            Help = true;
            continue;
        }

        let PortText: string | undefined;
        if (Argument === "--port" || Argument === "-p")
        {
            Index += 1;
            PortText = Arguments[Index];
            if (PortText === undefined)
            {
                throw new ClientArgumentError(`${ Argument } requires a port.`);
            }
        }
        else if (Argument?.startsWith("--port=") === true)
        {
            PortText = Argument.slice("--port=".length);
        }
        else if (Argument?.startsWith("-") === true)
        {
            throw new ClientArgumentError(`Unknown option: ${ Argument }`);
        }
        else
        {
            PortText = Argument;
        }

        if (PortText !== undefined)
        {
            if (Port !== undefined)
            {
                throw new ClientArgumentError("Only one log port may be supplied.");
            }
            Port = ParsePort(PortText);
        }
    }

    return {
        Help,
        ...(Port === undefined ? { } : { Port })
    };
}
