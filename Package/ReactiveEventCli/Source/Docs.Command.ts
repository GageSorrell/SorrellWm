/**
 * @file      Docs.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { SetCommand } from "./Command";
import open from "open";

/** Opens the documentation page for the CLI. */
export async function DocsCommand(): Promise<void>
{
    SetCommand("docs");
    open("https://reactive-event.sorrell.sh/1.0.0/cli/introduction");
}
