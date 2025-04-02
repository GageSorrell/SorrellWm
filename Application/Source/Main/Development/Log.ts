/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

/** @TODO */
export const Log = (...Arguments: Array<unknown>): void =>
{
    console.log(...Arguments);
    // process.stdout.write(
    //     chalk.bgMagenta.white(" Backend ") +
    //     " " +
    //     JSON.stringify(Arguments, null, 4)
    // );
};
