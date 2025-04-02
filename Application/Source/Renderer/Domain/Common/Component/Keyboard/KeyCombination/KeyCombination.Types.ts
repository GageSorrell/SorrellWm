/* File:      KeyCombination.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { FVirtualKey } from "../Keyboard.Types";
import type { TMaybeArray } from "@/Utility";

export type PKeyCombination =
{
    Keys: TMaybeArray<FVirtualKey>;
};
