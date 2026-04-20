/**
 * @file      DropdownSettingControl.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { THandler } from "@/Utility";

export type PDropdownSettingControl =
{
    OnChangeValue: THandler<string>;
    Options: Array<string>;
    Value: string;
};
