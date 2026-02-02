/* File:      Panel.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FAnnotatedPanel } from "#/Tree/Tree.Types";

export type PPanel =
    FAnnotatedPanel &
    {
        IsSelected: boolean;
    };
