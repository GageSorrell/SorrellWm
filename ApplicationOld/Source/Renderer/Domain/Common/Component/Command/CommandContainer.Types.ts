/**
 * @file      CommandContainer.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FCommand } from "./Command.Types";

export type PCommandContainer =
{
    BottomShelfCommands?: TArray<FCommand>;
    Commands: TArray<FCommand>;
};
