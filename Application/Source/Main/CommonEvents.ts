/* File:      CommonEvents.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { GetIsLightMode, GetThemeColor } from "@sorrellwm/windows";
import { PoorEventSuccess, RegisterIpcCallbacks } from "./Event";
import type { BrowserWindow } from "electron";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "./Development";
import type { TEventCallback } from "../Shared/Event";
import type { TIpcCallback } from "./Event.Types";

const Log: FLogger = GetLogger("CommonEvents");

export const RegisterCommonIpcCallbacks = (Window: BrowserWindow): void =>
{
    const CommonIpcCallbacks: Array<TIpcCallback> =
    [
        {
            Callback: async (): ReturnType<TEventCallback<"GetThemeColor">> =>
            {
                Log(`GetThemeColor was received by Main with Id == ${ Window.id }.`);
                return {
                    Data:
                    {
                        ThemeColor: GetThemeColor()
                    },
                    Error: undefined
                };
            },
            Channel: "GetThemeColor"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"NotifyReady">> =>
            {
                return PoorEventSuccess();
            },
            Channel: "NotifyReady"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"GetIsLightMode">> =>
            {
                return {
                    Data:
                    {
                        IsLightMode: GetIsLightMode()
                    },
                    Error: undefined
                };
            },
            Channel: "GetIsLightMode"
        }
    ];

    RegisterIpcCallbacks(Window, CommonIpcCallbacks);
};
