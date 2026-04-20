/* File:      Init.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Command } from "@effect/cli";
import type { FInitRequirements } from "./Init/Init.Types.js";

async function Main(): Promise<void>
{

}

export const Init: Command.Command<"init", FInitRequirements, never, never> =
