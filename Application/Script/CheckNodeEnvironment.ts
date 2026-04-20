/**
 * @file      CheckNodeEnvironment.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import chalk from "chalk";

/* eslint-disable no-undef, no-console */

export function CheckNodeEnvironment(ExpectedEnvironment: string)
{
    if (!ExpectedEnvironment)
    {
        throw new Error("\"expectedEnv\" not set");
    }

    if (process.env.NODE_ENV !== ExpectedEnvironment)
    {
        console.log(
            chalk.whiteBright.bgRed.bold(
                `"process.env.NODE_ENV" must be "${ ExpectedEnvironment }" to use this webpack config`
            )
        );
        process.exit(2);
    }
}
