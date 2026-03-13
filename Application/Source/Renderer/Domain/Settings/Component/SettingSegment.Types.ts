/* File:      Setting.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FluentIcon } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import type { THandler } from "@/Utility";

export type PSettingSegment =
{
    Control: ReactNode;
    Icon?: FluentIcon;
    Subtitle: ReactNode;
    Title: ReactNode;
};

export type PSettingSegmentBody =
    Pick<PSettingSegment, "Title"> &
    Partial<Pick<PSettingSegment, "Subtitle">> &
    {
        OnChangeValue: THandler<boolean>;
        Value: boolean;
    };

type FSegmentType =
    | "Regular"
    | "CompoundHeader"
    | "CompoundBody";

export type FSettingSegmentStyle = FSegmentType;

export type PSettingSegmentHeader =
    Omit<PSettingSegment, "Control"> &
    Partial<Pick<PSettingSegment, "Control">>;

export type PSettingSegmentInternal =
    PSettingSegmentHeader &
    {
        Type: Exclude<FSegmentType, "CompoundBody">;
    };
