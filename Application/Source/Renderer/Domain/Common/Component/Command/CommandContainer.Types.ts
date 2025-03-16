/* File:      CommandContainer.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { PCommandBottomShelf } from "./CommandBottomShelf.Types";
import type { PMainCommands } from "./MainCommands.Types";
import type { ReactElement } from "react";

export type PCommandContainer =
{
    children: [ ReactElement<PMainCommands>, ReactElement<PCommandBottomShelf> ];
};
