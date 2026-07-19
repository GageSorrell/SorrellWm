/**
 * @file      Panel.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { FAnnotatedPanel } from "../../../../../Shared/Tree.Types";

export type PPanel =
    FAnnotatedPanel &
    {
        IsSelected: boolean;
    };
