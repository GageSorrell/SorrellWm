/* File:      CommandBottomShelf.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FCommand } from "./Command.Types";
import type { ReactElement } from "react";

export type PCommandBottomShelf =
{
    children:
        | ReactElement<FCommand>
        | [ ReactElement<FCommand>, ReactElement<FCommand> ];
};
