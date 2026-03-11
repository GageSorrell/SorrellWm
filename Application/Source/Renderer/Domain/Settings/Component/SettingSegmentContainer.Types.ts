/* File:      SettingSegmentContainer.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PSettingSegment } from "./SettingSegment.Types";
import type { ReactElement } from "react";
import type { TPropsWithChildren } from "@/Utility";

export type PSettingSegmentContainer =
    TPropsWithChildren<Array<ReactElement<PSettingSegment>>> &
    {
        Title: string;
    };
