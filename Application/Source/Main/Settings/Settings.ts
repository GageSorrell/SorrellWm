/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type BrowserWindow, type BrowserWindowConstructorOptions, type Event } from "electron";
import { DefaultSettings, type FSettings } from "../../Shared/Settings";
import type { FIpcBackendChannel, TEventCallback, TRequest, TResponse } from "../../Shared/Event";
import {
    GetPoorResponse,
    SendIpcEvent as InSendIpcEvent,
    PoorEventSuccess,
    RegisterIpcCallbacks
} from "#/Event";
import { GetWindowByName, type HWindow, SetWindowPosition } from "@sorrellwm/windows";
import { CreateBrowserWindow } from "#/BrowserWindow";
import { Delay } from "Source/Shared";
import type { FLogger } from "../../Shared/Log.Types";
import type { FNavigateRequest } from "../../Shared/Event/Navigate.Types";
import { GetDevSettings } from "#/DevSettings";
import { GetLogger } from "../Development";
import { RegisterCommonIpcCallbacks } from "#/CommonEvents";
import { RegisterInitializationFunction } from "#/Core/Initialize";
import Settings from "electron-settings";
import type { TIpcCallback } from "#/Event.Types";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Settings");

let SettingsWindow: BrowserWindow | undefined = undefined;

const SendIpcEvent = <Type extends FIpcBackendChannel>(
    Channel: Type,
    Request: TRequest<Type>
): Promise<TResponse<Type> | undefined> =>
{
    if (SettingsWindow !== undefined)
    {
        return InSendIpcEvent(SettingsWindow, Channel, Request);
    }
    else
    {
        return Promise.resolve(undefined);
    }
};

const CreateSettingsWindow = async (): Promise<void> =>
{
    const ShowOnLaunch: boolean = GetDevSettings().SettingsWindow.ShowOnLaunch.Enabled;

    const WindowOptions: BrowserWindowConstructorOptions =
    {
        autoHideMenuBar: true,
        backgroundMaterial: "mica",
        frame: true,
        height: 900,
        maximizable: true,
        resizable: true,
        show: false,
        skipTaskbar: false,
        title: "SorrellWm Settings",
        titleBarOverlay:
        {
            color: "#00000000"
        },
        titleBarStyle: "hidden",
        webPreferences:
        {
            devTools: ShowOnLaunch
        },
        width: 1200
    };

    const { Window, LoadFrontend } = await CreateBrowserWindow(WindowOptions);

    SettingsWindow = Window;
    SettingsWindow.setMenu(null);

    SettingsWindow.on("close", (Event: Event): void =>
    {
        Event.preventDefault();
        SettingsWindow?.hide();
    });

    const IpcCallbacks: Array<TIpcCallback> =
    [
        {
            Callback: async (): ReturnType<TEventCallback<"ReadyForRoute">> =>
            {
                const NavigateRequest: FNavigateRequest =
                {
                    Route: "/Settings"
                };

                await SendIpcEvent("Navigate", NavigateRequest);
                return PoorEventSuccess();
            },
            Channel: "ReadyForRoute"
        },
        {
            Callback: async (InNewSettings: unknown): ReturnType<TEventCallback<"UpdateSettings">> =>
            {
                const NewSettings: FSettings = InNewSettings as FSettings;
                const Success: boolean = await UpdateSettings(NewSettings);
                return GetPoorResponse(Success);
                /** @TODO Notify if electron-settings fails to save. */
            },
            Channel: "UpdateSettings"
        }
    ];

    RegisterCommonIpcCallbacks(SettingsWindow);
    RegisterIpcCallbacks(SettingsWindow, IpcCallbacks);

    await LoadFrontend();
    if (ShowOnLaunch)
    {
        SettingsWindow.webContents.openDevTools();
        OpenSettings();

        await Delay(3000);
        const DevToolsWindow: HWindow | undefined =
            GetWindowByName("Developer Tools - http://localhost:1212/index.html");
        if (DevToolsWindow)
        {
            SetWindowPosition(DevToolsWindow, { Height: 900, Width: 1080, X: -1080, Y: 960 });
        }

        const { Height, Width, X, Y } =
            GetDevSettings().SettingsWindow.ShowOnLaunch.Position;

        await Delay(100);
        SettingsWindow.setPosition(X / 1.25, Y / 1.25, false);
        await Delay(100);
        SettingsWindow.setSize(Width / 1.25, Height / 1.25, false);
    }
};

export const OpenSettings = async (): Promise<void> =>
{
    if (SettingsWindow !== undefined)
    {
        SettingsWindow.show();
    }
};

export const UpdateSettings = async (InSettings: FSettings): Promise<boolean> =>
{
    try
    {
        await Settings.set("Settings", InSettings);
        return true;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    catch (_Error: unknown)
    {
        return false;
    }
};

export const GetSettings = async (): Promise<Readonly<FSettings>> =>
{
    const OutSettings: FSettings | null = await Settings.get("Settings") as FSettings | null;
    return OutSettings !== null
        ? OutSettings
        : DefaultSettings;
};

RegisterInitializationFunction(CreateSettingsWindow);
