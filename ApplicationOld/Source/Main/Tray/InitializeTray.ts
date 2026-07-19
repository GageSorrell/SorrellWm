/**
 * @file      Tray.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { app as App, Menu } from "electron";
import { FTray } from "./Tray.Types";
import { GetIconPath } from "../Miscellaneous";
import { InitializeTrayValue } from "./Tray";
import { OpenSettings } from "#/Window/Settings";
import { RegisterInitializationFunction } from "#/Initialize/Initialize";

const InitializeTray = async (): Promise<void> =>
{
    const Tray: FTray = InitializeTrayValue(new FTray(await GetIconPath("Brand", "PNG")));

    const ContextMenu: Menu = Menu.buildFromTemplate([
        {
            click: OpenSettings,
            label: "Settings",
            type: "normal"
        },
        {
            /**
             * @TODO Replace this with launching a window to confirm;
             * make the appearance of this confirmation window optional
             * via a setting.
             */
            click: () => App.exit(),
            label: "Exit",
            type: "normal"
        }
    ]);

    Tray.setToolTip("SorrellWm v0.0.1\nUp to date");
    Tray.setContextMenu(ContextMenu);
    Tray.addListener("click", OpenSettings);
};

RegisterInitializationFunction("Tray", InitializeTray);
