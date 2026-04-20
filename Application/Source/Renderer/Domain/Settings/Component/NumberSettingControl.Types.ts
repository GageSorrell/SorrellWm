/**
 * @file      NumberSettingControl.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
