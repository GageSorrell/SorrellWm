/* File:      CommandContainer.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { PCommandBottomShelf } from "./CommandBottomShelf.Types";
import type { PMainCommands } from "./MainCommands.Types";
import type { ReactElement } from "react";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export type PCommandContainer_DEPRECATED =
{
    children: [ ReactElement<PMainCommands>, ReactElement<PCommandBottomShelf> ];
};
