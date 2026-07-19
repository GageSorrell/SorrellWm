/**
 * @file      BooleanSettingControl.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { THandler } from "@sorrell/react";

export type PBooleanSettingControl =
{
    Disabled?: boolean;
    Value: boolean;
    OnChangeValue: THandler<boolean>;
};
