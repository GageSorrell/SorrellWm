/* File:      Move.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FAxis } from "../Shared.Types";

export type FTranslation =
{
    Direction: FAxis;
    Distance: number;
};
