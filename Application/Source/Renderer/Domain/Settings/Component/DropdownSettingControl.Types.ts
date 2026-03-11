/* File:      DropdownSettingControl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { THandler } from "@/Utility";

export type PDropdownSettingControl =
{
    OnChangeValue: THandler<string>;
    Options: Array<string>;
    Value: string;
};
