/* File:      Notification.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { app } from "electron";

const InitializeNotifications = (): void =>
{
    app.setAppUserModelId(process.execPath);
};

InitializeNotifications();
