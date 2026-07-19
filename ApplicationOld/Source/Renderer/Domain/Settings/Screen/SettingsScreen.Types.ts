/**
 * @file      SettingsScreen.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TPropsWithChildren } from "@sorrell/react";

export type PSettingsScreen =
    TPropsWithChildren &
    {
        Title: string;
    };
