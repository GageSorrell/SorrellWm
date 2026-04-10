/* File:      Command.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc, no-console */

import type { Ora } from "ora";
import ora from "ora";

let Command: string = "generate";

export function GetCommand(): string
{
    return Command;
}

export function GetHeader(FileName: string, PrincipalCommand: string): string
{
    return `/**
 * File:   ${ FileName }
 * Author: \`electron-reactive-event-cli\`
 *
 * ********************************************
 *
 * Generated with the ${ GetCommand() } command.
 * Regenerate this file by running,
 *
 *    \`npm exec electron-reactive-event ${ PrincipalCommand }\`
 *
 * in this directory.
 *
 */\n\n/* eslint-disable */\n`;
}

export class TryError extends Error
{
    public constructor(Result: string | undefined, OriginalError?: unknown)
    {
        super();

        this.TheResult = Result;

        if (OriginalError !== undefined && OriginalError instanceof Error)
        {
            this.TheOriginalError = OriginalError;
        }
    }

    public TheResult: string | undefined;

    public TheOriginalError: Error | undefined;
};

export function SetCommand(CommandName: string): void
{
    Command = CommandName;
}

export async function Try(
    Label: string,
    SuccessLabel: ((Result: string) => string),
    Function: (() => Promise<string>)
): Promise<string>;
export async function Try<Type>(
    Label: string,
    SuccessLabel: string,
    Function: (() => Promise<Type>)
): Promise<Type>;
export async function Try<Type>(
    Label: string,
    SuccessLabel: ((Result: string) => string),
    Function: (() => Promise<Type>)
): Promise<Type>;
export async function Try<Type>(
    Label: string,
    SuccessLabel:
        | string
        | ((Result: string) => string),
    Function: (() => Promise<Type>)
): Promise<Type>
{
    const OraSpinner: Ora = ora({
        spinner: "point",
        text: Label
    }).start();

    try
    {
        const Result: Type = await Function();
        if (typeof SuccessLabel === "function")
        {
            if (typeof Result === "string")
            {
                OraSpinner.succeed(SuccessLabel(Result));
            }
            else
            {
                /* eslint-disable-next-line @stylistic/max-len */
                throw new Error("Try was given a SuccessLabel function, but the result type was not a string!");
            }
        }
        else
        {
            OraSpinner.succeed(SuccessLabel);
        }

        return Result;
    }
    catch (Error: unknown)
    {
        OraSpinner.fail();
        if (Error instanceof TryError)
        {
            if (Error.TheResult !== undefined)
            {
                if (Error.TheOriginalError !== undefined)
                {
                    console.error(
                        Error.TheOriginalError,
                        `\n\n🚨 ${ Error.TheResult }  The error is printed above.`
                    );
                }
                else
                {
                    console.error(`\n\n🚨 ${ Error.TheResult }`);
                }
            }
            else
            {
                if (Error.TheOriginalError !== undefined)
                {
                    console.error(
                        Error.TheOriginalError,
                        `\n\n🚨 The ${ GetCommand() } command failed.  The error is printed above.`
                    );
                }
                else
                {
                    console.error(`\n\n🚨 The ${ GetCommand() } command failed.`);
                }
            }
        }
        else
        {
            console.error(Error, `\n\n🚨 The ${ GetCommand() } command failed.  The error is printed above.`);
        }

        process.exit(1);
    }
}
