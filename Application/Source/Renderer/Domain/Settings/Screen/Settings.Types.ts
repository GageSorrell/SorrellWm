/**
 * @file      Settings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FC } from "react";
import type { FluentIcon } from "@fluentui/react-icons";
import type { TControlled } from "@sorrell/react";
import type { TFunction } from "@sorrell/utilities/functional";

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
        OnClickHamburger: TFunction;
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
