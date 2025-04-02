/* File:      MainCommands.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { PCommand } from "./Command.Types";
import type { ReactElement } from "react";

export type PMainCommands =
{
    children:
        | ReactElement<PCommand>
        | Array<ReactElement<PCommand>>;
};
