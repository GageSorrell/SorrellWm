/**
 * @file      CompoundSettingSegment.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
