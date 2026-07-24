#!/usr/bin/env node

/**
 * Built-in executable for `@sorrell/log-client`.
 *
 * @module @sorrell/log-client/Cli
 *
 * @file      Cli.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { render } from "ink";
import {
    ClientArgumentError,
    HelpText,
    ParseArguments
} from "./Arguments.js";
import { LogClientApp } from "./Components.js";

try
{
    const Arguments = ParseArguments(process.argv.slice(2));

    if (Arguments.Help)
    {
        process.stdout.write(`${ HelpText }\n`);
    }
    else
    {
        render(
            <LogClientApp
                { ...(Arguments.Port === undefined
                    ? { }
                    : { Port: Arguments.Port }) } />,
            {
                alternateScreen: true,
                exitOnCtrlC: true
            }
        );
    }
}
catch (ErrorValue)
{
    const Message = ErrorValue instanceof ClientArgumentError
        ? ErrorValue.message
        : "The log client could not start.";
    process.stderr.write(`${ Message }\nRun sorrell-log-client --help for usage.\n`);
    process.exitCode = 1;
}
