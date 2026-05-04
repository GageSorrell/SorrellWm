/**
 * @file      GenerateIpc.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { GenerateIpcMainModule } from "./GenerateIpcMainModule";
import { GenerateIpcRendererModule } from "./GenerateIpcRendererModule";
import { SetCommand } from "./Command";

export async function GenerateIpcCommand(): Promise<void>
{
    SetCommand("generate-ipc");

    await GenerateIpc();
}

export async function GenerateIpc(): Promise<void>
{
    await GenerateIpcMainModule();
    await GenerateIpcRendererModule();
}
