/**
 *
 *
 * @module @sorrell/wm/Preload
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    ApplicationIpcChannel,
    type IApplicationApi
} from "../Shared/Api.ts";
import electron from "electron";

const { contextBridge, ipcRenderer } = electron;

const ping = async (): Promise<string> =>
{
    const response: unknown = await ipcRenderer.invoke(ApplicationIpcChannel.Ping);

    if (typeof response !== "string")
    {
        throw new TypeError("The main process returned an invalid ping response.");
    }

    return response;
};

const applicationApi: IApplicationApi = Object.freeze({
    ping,
    platform: process.platform,
    versions:
    {
        chrome: process.versions.chrome ?? "unknown",
        electron: process.versions.electron ?? "unknown",
        node: process.versions.node
    }
});

contextBridge.exposeInMainWorld("sorrell", applicationApi);
