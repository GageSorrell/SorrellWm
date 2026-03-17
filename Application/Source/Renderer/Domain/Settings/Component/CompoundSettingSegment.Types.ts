/* File:      CompoundSettingSegment.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FSimpleCallback } from "../../../../Shared";
import type { PSettingSegment } from "./SettingSegment.Types";
import type { TPropsWithChildrenByProps } from "@/Utility";

export type CCompoundSettingSegment =
{
    IsExpanded: boolean;
    OnChangeExpanded: FSimpleCallback;
};

export type PCompoundSettingSegment = TPropsWithChildrenByProps<PSettingSegment>;
