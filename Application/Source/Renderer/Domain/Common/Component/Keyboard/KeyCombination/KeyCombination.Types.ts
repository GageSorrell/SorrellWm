/**
 * @file      KeyCombination.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { FVirtualKey } from "../../../../../../Shared/Keyboard.Types";
import type { TMaybeArray } from "../../../../../../Shared/Utility";

export type PKeyCombination =
{
    Keys: TMaybeArray<FVirtualKey>;
};
