/* File:      SettingSegmentContainer.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ReactNode } from "react";
import type { TPropsWithChildren } from "@/Utility";

export type PSettingSegmentContainer =
    TPropsWithChildren<ReactNode | Array<ReactNode>> &
    {
        Title: string;
    };
