/* File:      NumberSettingControl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { THandler } from "@/Utility";

export type PNumberSettingControl =
{
    IsValueAllowed?: (NewValue: number) => boolean;
    MaxValue?: number;
    MinValue?: number;
    OnChangeValue: THandler<number>;
    Value: number;
};
