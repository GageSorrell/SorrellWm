/* File:      Docs.Command.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { SetCommand } from "./Command";
import open from "open";

/** Opens the documentation page for the CLI. */
export async function DocsCommand(): Promise<void>
{
    SetCommand("docs");
    open("https://electron-reactive-event.sorrell.sh/1.0.0/cli/introduction");
}
