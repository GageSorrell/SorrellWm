/* File:      All.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { DeclareEvents } from "./DeclareEvents";
import { GenerateIpcMainModule } from "./GenerateIpcMainModule";
import { GenerateIpcRendererModule } from "./GenerateIpcRendererModule";
import { GenerateScopedTypes } from "./GenerateScopedTypes.Command";
import { SetCommand } from "./Command";

export async function AllCommand(): Promise<void>
{
    SetCommand("all");

    await GenerateScopedTypes();
    await DeclareEvents();
    await GenerateIpcMainModule();
    await GenerateIpcRendererModule();
}
