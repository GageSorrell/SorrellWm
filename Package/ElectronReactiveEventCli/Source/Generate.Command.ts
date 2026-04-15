/* File:      Generate.Command.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { GenerateIpc } from "./GenerateIpc.Command";
import { GenerateScopedTypes } from "./GenerateScopedTypes.Command";
import { SetCommand } from "./Command";

/**
 * Runs all `generate-*` commands.
 */
export async function GenerateCommand(): Promise<void>
{
    SetCommand("generate");
    await GenerateIpc();
    await GenerateScopedTypes();
}
