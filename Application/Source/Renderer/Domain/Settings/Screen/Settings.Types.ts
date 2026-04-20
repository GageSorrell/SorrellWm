/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FC } from "react";
import type { FSimpleCallback } from "../../../../Shared";
import type { FluentIcon } from "@fluentui/react-icons";
import type { TControlled } from "@/Utility";

export type FSettingsScreenKey =
    | "General"
    | "Keyboard"
    | "About";

export type FSettingsScreen =
{
    Component: FC;
    Icon: FluentIcon;
};

export type FSettingsScreens = Record<FSettingsScreenKey, FSettingsScreen>;

export type PTitlebar =
{
    OnClickHamburger: FSimpleCallback;
    ShowHamburger: boolean;
};

export type PSettingsNavDrawer =
    PTitlebar &
    TControlled<"SelectedScreen", FSettingsScreenKey> &
    {
        IsNavOpen: boolean;
        NavType: FNavDrawerType;
        Screens: FSettingsScreens;
        ShowHamburger: boolean;
    };

export type FNavDrawerType = "inline" | "overlay";
