/* File:      BooleanSettingControl.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { THandler } from "@/Utility";

export type PBooleanSettingControl =
{
    Value: boolean;
    OnChangeValue: THandler<boolean>;
};
