/**
 * @file      Generate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
