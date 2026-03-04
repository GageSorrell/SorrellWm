/* File:      CommandContainer.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FCommand } from "./Command.Types";

export type PCommandContainer =
{
    BottomShelfCommands?: TArray<FCommand>;
    Commands: TArray<FCommand>;
};
