/**
 * @file      CommonEvents.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FLogger, FSettings, FStore } from "../../Shared";
import { GetIsLightMode, GetThemeColor } from "@sorrell/wm-windows";
import { GetStore, SetStore } from "#/Store";
import { PoorEventSuccess, RegisterIpcCallbacks } from ".";
import type { BrowserWindow } from "electron";
import { GetLogger } from "#/Development";
import { GetSettings } from "#/Settings";
import type { TIpcCallback } from "./Event.Types";

// @TODO Temporary.
type TEventCallback<Type> = (...Arguments: Array<unknown>) => Promise<any>;

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
            },
            {
                Callback: async (): ReturnType<TEventCallback<"GetSettings">> =>
                {
                    const Settings: FSettings = await GetSettings();
                    return {
                        Data: Settings,
                        Error: undefined
                    };
                },
                Channel: "GetSettings"
            },
            {
                Callback: async (): ReturnType<TEventCallback<"GetSetting">> =>
                {
                    return {
                        Data: { Setting: 0 },
                        Error: undefined
                    };
                },
                Channel: "GetSetting"
            },
            {
                Callback: async (): ReturnType<TEventCallback<"GetStore">> =>
                {
                    const Data: FStore = await GetStore();
                    return {
                        Data,
                        Error: undefined
                    };
                },
                Channel: "GetStore"
            },
            {
                Callback: async (InStore: unknown): ReturnType<TEventCallback<"SetStore">> =>
                {
                    const NewStore: FStore = InStore as FStore;
                    SetStore(NewStore);
                    return PoorEventSuccess();
                },
                Channel: "SetStore"
            }
        ];

    RegisterIpcCallbacks(Window, CommonIpcCallbacks);
};
