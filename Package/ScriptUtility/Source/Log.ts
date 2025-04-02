/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import Chalk from "chalk";

/** Format text to represent code when logged in the terminal. */
export const C = (Code: string): string =>
{
    return Chalk.bgGray.white(Code);
};

export const Log = (...Arguments: Array<unknown>): void =>
{
    console.log("📄 ", ...Arguments);
};

export const LogError = (...Arguments: Array<unknown>): void =>
{
    const FormattedArguments: Array<unknown> = Arguments.map((Argument: unknown): unknown =>
    {
        return typeof Argument === "string"
            ? Chalk.yellow(Argument)
            : Argument;
    });
    console.log("⚠️ ", ...FormattedArguments);
};
