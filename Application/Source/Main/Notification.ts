/**
 * @file      Notification.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { RegisterInitializationFunction } from "./Initialize/Initialize";
import { app } from "electron";

const InitializeNotifications = async (): Promise<void> =>
{
    app.setAppUserModelId(process.execPath);
};

RegisterInitializationFunction("Notification", InitializeNotifications);
