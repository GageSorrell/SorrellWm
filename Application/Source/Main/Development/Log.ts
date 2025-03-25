/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import chalk from "chalk";

/** @TODO */
export const Log = (...Arguments: Array<unknown>): void =>
{
    console.log(
        chalk.bgMagenta.white(" Backend ") +
        " " +
        JSON.stringify(Arguments, null, 4)
    );
};
