/* File:      Setting.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FluentIcon } from "@fluentui/react-icons";
import type { ReactNode } from "react";

export type PSettingSegment =
{
    Control: ReactNode;
    Icon?: FluentIcon;
    Subtitle: ReactNode;
    Title: ReactNode;
};

type FSegmentType =
    | "Regular"
    | "CompoundHeader"
    | "CompoundBody";

export type FSettingSegmentStyle = FSegmentType;

export type PSettingSegmentBase =
    PSettingSegment &
    {
        Type: FSegmentType;
    };
