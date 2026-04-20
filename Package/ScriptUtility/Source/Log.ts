/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable no-console */

import Chalk from "chalk";

/** Format text to represent code when logged in the terminal. */
export const C = (Code: string): string =>
{
    return Chalk.bgGray.white(Code);
};

export const Log = (...Arguments: TArray<unknown>): void =>
{
    console.log("📄 ", ...Arguments);
};

export const LogError = (...Arguments: TArray<unknown>): void =>
{
    const FormattedArguments: TArray<unknown> = Arguments.map((Argument: unknown): unknown =>
    {
        return typeof Argument === "string"
            ? Chalk.yellow(Argument)
            : Argument;
    });
    console.log("⚠️ ", ...FormattedArguments);
};
