/* File:      Shared.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   Logic used for defining commands.
 */

import type { Command } from "commander";

function UpdateCommand(InCommand: Command): Command
{
    return InCommand
        .showHelpAfterError()
        .helpOption("-h, --help", "Display help information")
        .helpCommand("help [command]", "Display help for command");
}

export async function RunCommand(InCommand: Command): Promise<void>
{
    const ArgumentVector: ReadonlyArray<string> = process.argv.slice(2);
    await UpdateCommand(InCommand).parseAsync(ArgumentVector);
}

