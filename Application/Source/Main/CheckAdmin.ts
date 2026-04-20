/**
 * @file      CheckAdmin.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { GetIsElevated } from "@sorrellwm/windows";
import { RegisterInitializationFunction } from "./Initialize/Initialize";

RegisterInitializationFunction("CheckAdmin", async (): Promise<void> =>
{
    if (!GetIsElevated())
    {
        // @TODO
        // const { LoadFrontend } = CreateBrowserWindow({

        // });
        // LoadFrontend();
    }
});
