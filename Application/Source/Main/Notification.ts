/* File:      Notification.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { RegisterInitializationFunction } from "./Initialize/Initialize";
import { app } from "electron";

const InitializeNotifications = async (): Promise<void> =>
{
    app.setAppUserModelId(process.execPath);
};

RegisterInitializationFunction("Notification", InitializeNotifications);
