/**
 * @file      Store.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FStore } from "./Store.Types";
// import { app } from "electron";

export const GetDefaultStore = (): FStore =>
{
    return {
        // AppVersion: app.getVersion(),
        AppVersion: "@TODO",
        TimeLastCheckedUpdate: null
    };
};
