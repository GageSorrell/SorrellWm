/* File:      DeclareEvents.Command.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { DeclareEvents } from "./DeclareEvents";
import { SetCommand } from "./Command";

export async function DeclareEventsCommand(Path?: string): Promise<void>
{
    SetCommand("declare-events");
    await DeclareEvents(Path);
}
