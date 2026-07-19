/**
 * @file      DevSettings.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FLogSettings, FPanelDirection } from "../../Shared";
import type { FBox } from "@sorrell/wm-windows";

export type FDummyPanel =
{
    /**
     * For the root panel, this is the index of the monitor in which this panel should live.
     * Otherwise, it is the index of this panel in its parent panel.
     */
    Index: number;
    Direction: FPanelDirection;
    NumChildren: number;
    Panels?: Array<FDummyPanel>;
};

export type FDummyFloatingWindow =
    Pick<FDummyPanel, "Index"> &
    {
        NumWindows: number;
    };

export type FDummyConfiguration =
    FDummyPanel &
    {
        Direction: FPanelDirection;
        FloatingWindows?: Array<FDummyFloatingWindow>;
    };

export type FDummyConfigurationSchema =
{
    Configurations: Array<FDummyConfiguration>;
};

export type FDummyConfigurationPath = `./Dummy.${ string }.json`;

export type FDevSettings = Readonly<{
    Log: FLogSettings;
    SettingsWindow:
    {
        ShowOnLaunch:
        {
            Enabled: boolean;
            Position: FBox;
        };
    };
    StaticMode:
    {
        Enabled: boolean;
        WindowShape: FBox;
    };
    /** Spawn windows of various sizes at launch. */
    CreateDummyWindows:
    {
        Enabled: boolean;

        /**
         * Path to the JSON file of the configuration that should be used,
         * relative to the `Application` directory.
         */
        ConfigurationPath: FDummyConfigurationPath;
    };
}>;
