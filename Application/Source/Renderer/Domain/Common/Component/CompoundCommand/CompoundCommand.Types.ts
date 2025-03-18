/* File:      CompoundCommand.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { PCommand } from "../Command";

export type FSubCommand = Omit<PCommand, "Title">;

export type PCompoundCommand =
{
    SubCommands: Array<FSubCommand>;
    Title: string;
};
