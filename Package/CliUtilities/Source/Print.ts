/* File:      Print.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   This module contains functions to output messages
 *            to the user with consistent and aesthetic formatting.
 */

import Chalk from "chalk";

export function Code(Message: string): string
{
    return Chalk.reset(Chalk.red(Message));
}

export function Format(Message: string): string
{
    // @TODO
    return Message;
}

