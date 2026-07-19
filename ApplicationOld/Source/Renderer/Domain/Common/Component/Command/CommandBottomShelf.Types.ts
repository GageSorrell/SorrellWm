/**
 * @file      CommandBottomShelf.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { FCommand } from "./Command.Types";
import type { ReactElement } from "react";

export type PCommandBottomShelf =
{
    children:
        | ReactElement<FCommand>
        | [ ReactElement<FCommand>, ReactElement<FCommand> ];
};
