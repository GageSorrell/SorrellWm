/**
 * @file      DeclareEvents.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { DeclareEvents } from "./DeclareEvents";
import { SetCommand } from "./Command";

export async function DeclareEventsCommand(Path?: string): Promise<void>
{
    SetCommand("declare-events");
    await DeclareEvents(Path);
}
