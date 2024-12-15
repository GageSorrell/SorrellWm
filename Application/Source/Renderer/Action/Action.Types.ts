/* File:      Action.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FVirtualKey } from "../Key/Key.Types";

export type PAction =
{
    Name: string;
    KeyCombination: FVirtualKey | Array<FVirtualKey>;
    OnSelect: () => void;
};
