/* File:      CommandBottomShelf.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { PCommand } from "./Command.Types";
import type { ReactElement } from "react";

export type PCommandBottomShelf =
{
    children:
        | ReactElement<PCommand>
        | [ ReactElement<PCommand>, ReactElement<PCommand> ];
};
