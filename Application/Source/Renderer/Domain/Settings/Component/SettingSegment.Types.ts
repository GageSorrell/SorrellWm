/**
 * @file      Setting.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FSimpleCallback } from "../../../../Shared";
import type { FluentIcon } from "@fluentui/react-icons";
import type { ReactNode } from "react";
import type { THandler } from "@/Utility";

export type PSettingSegment =
{
    Control: ReactNode;

    Disabled?: boolean;
    DisabledMessage?: ReactNode;
    DisabledActionLabel?: string;
    DisabledAction?: FSimpleCallback;

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

export type FSettingSegmentStyle =
    | "Disabled"
    | FSegmentType;

export type PSettingSegmentHeader =
    Omit<PSettingSegment, "Control"> &
    Partial<Pick<PSettingSegment, "Control">>;

export type PSettingSegmentInternal =
    PSettingSegmentHeader &
    {
        Type: Exclude<FSegmentType, "CompoundBody">;
    };
