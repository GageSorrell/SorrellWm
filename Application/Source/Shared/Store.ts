/* File:      Store.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FStore } from "./Store.Types";
import { app } from "electron";

export const GetDefaultStore = (): FStore =>
{
    return {
        AppVersion: app.getVersion(),
        TimeLastCheckedUpdate: null
    };
};
