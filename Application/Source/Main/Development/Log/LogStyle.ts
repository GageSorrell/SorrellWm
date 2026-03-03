/* File:      LogStyle.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import Chalk from "chalk";

export const Code = (In: string): string =>
{
    return Chalk.hex("#EB4657")(In);
};

export const Bold = (In: string): string =>
{
    return Chalk.bold(In);
};
