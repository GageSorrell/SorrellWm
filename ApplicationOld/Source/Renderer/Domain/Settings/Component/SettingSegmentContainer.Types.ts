/**
 * @file      SettingSegmentContainer.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";
import type { TPropsWithChildren } from "@sorrell/react";

export type PSettingSegmentContainer =
    TPropsWithChildren<ReactNode | Array<ReactNode>> &
    {
        Title: string;
    };
