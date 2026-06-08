/**
 * @file      Select.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Choice } from "./Select.Types.ts";

export type IndicatorProps =
    Readonly<{
        isSelected?: boolean;
    }>;

export type ItemProps =
    Omit<Choice, "key"> &
    Readonly<{
        isSelected?: boolean;
    }>;
