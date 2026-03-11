/* File:      CheckAdmin.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { GetIsElevated } from "@sorrellwm/windows";
import { RegisterInitializationFunction } from "./Core/Initialize";
// import { CreateBrowserWindow } from "./BrowserWindow";

RegisterInitializationFunction(async (): Promise<void> =>
{
    if (!GetIsElevated())
    {
        // @TODO
        // const { LoadFrontend } = CreateBrowserWindow({

        // });
        // LoadFrontend();
    }
});
