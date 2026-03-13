/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type BrowserWindow, type BrowserWindowConstructorOptions, type Event, app } from "electron";
import { DefaultSettings, type FSettings } from "../../Shared/Settings";
import { Delay, type FRejectFunction, type TResolveFunction } from "Source/Shared";
import type {
    FIpcBackendChannel,
    FIpcEvents,
    TEventCallback,
    TGetResponse,
    TRequest,
    TResponse } from "../../Shared/Event";
import {
    GetPoorResponse,
    SendIpcEvent as InSendIpcEvent,
    PoorEventSuccess,
    RegisterIpcCallbacks
} from "#/Event";
import {
    GetRunOnStartup,
    GetWindowByName,
    type HWindow,
    SetRunOnStartup,
    SetWindowPosition } from "@sorrellwm/windows";
import { type ProgressInfo, type UpdateCheckResult, type UpdateInfo, autoUpdater } from "electron-updater";
import { CreateBrowserWindow } from "#/BrowserWindow";
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
        },
        {
            Callback: async (
                /** For now, there is only one external setting. */
                _InExternalSetting: unknown
            ): ReturnType<TEventCallback<"GetExternalSettingState">> =>
            {
                // const ExternalSetting: FExternalSetting = InExternalSetting as FExternalSetting;
                type FResponse = TGetResponse<FIpcEvents["GetExternalSettingState"]["Response"]>;
                return new Promise<FResponse>(
                    (Resolve: TResolveFunction<FResponse>, _Reject: FRejectFunction): void =>
                    {
                        GetRunOnStartup(process.execPath, (Exists: boolean): void =>
                        {
                            Resolve({
                                Data:
                                {
                                    Setting: Exists
                                },
                                Error: undefined
                            });
                        });
                    }
                );
            },
            Channel: "GetExternalSettingState"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"CheckForUpdates">> =>
            {
                autoUpdater.autoDownload = false;

                const Result: UpdateCheckResult | null = await autoUpdater.checkForUpdates();
                const UpdateInfo: UpdateInfo | null = Result?.updateInfo ?? null;

                if (UpdateInfo === null)
                {
                    return {
                        Data: undefined,
                        Error: ""
                    };
                }

                const IsUpdateAvailable: boolean = UpdateInfo?.version !== autoUpdater.currentVersion.version;
                return {
                    Data:
                    {
                        AvailableVersion: IsUpdateAvailable
                            ? UpdateInfo?.version || ""
                            : undefined
                    },
                    Error: undefined
                };
            },
            Channel: "CheckForUpdates"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"Update">> =>
            {
                autoUpdater.logger =
                {
                    debug: Log.Verbose,
                    error: Log.Error,
                    info: (...In: Array<unknown>): void => Log(...In),
                    warn: Log.Warn
                };

                autoUpdater.autoDownload = true;
                autoUpdater.autoInstallOnAppQuit = false;

                autoUpdater.on("checking-for-update", (): void =>
                {
                    Log("Checking for update...");
                });

                autoUpdater.on("update-available", (UpdateInfo: UpdateInfo): void =>
                {
                    Log(`Update available: ${UpdateInfo.version}`);
                });

                autoUpdater.on("update-not-available", (UpdateInfo: UpdateInfo): void =>
                {
                    Log(`No update available. Current/latest: ${UpdateInfo.version}`);
                });

                autoUpdater.on("error", (ErrorValue: Error): void =>
                {
                    Log.Error("Auto-update error:", ErrorValue);
                });

                autoUpdater.on("download-progress", (ProgressValue: ProgressInfo): void =>
                {
                    Log(
                        `Download speed=${ ProgressValue.bytesPerSecond } ` +
                        `percent=${ ProgressValue.percent } ` +
                        `transferred=${ ProgressValue.transferred } ` +
                        `total=${ ProgressValue.total }`
                    );
                });

                autoUpdater.on("update-downloaded", (UpdateInfo: UpdateInfo): void =>
                {
                    Log(`Update downloaded: ${ UpdateInfo.version }.`);

                    // Call this immediately, or wait until the user clicks "Restart to update".
                    autoUpdater.quitAndInstall();
                });

                return {
                    Data: undefined,
                    Error: undefined
                };
            },
            Channel: "Update"
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

        // await Delay(100);
        // Log("Registering to run on Startup...");
        // Log("Trying Task function...");
        // await Delay(100);
        // SetRunOnStartup(true, process.execPath, (Result: unknown, Other: unknown): void =>
        // {
        //     Log("SetRunResult: ", Result, Other);
        // });
        // Log((await SetRunOnStartup(process.execPath)) ? "Success" : "Failed");
        // const Foo: unknown = await GetTaskExistsAsync();
        // Log("Task function Results: ", Foo);
        // await Delay(100);
        // Log(`Get: ${ GetRunOnStartup(process.execPath) }`);
    }
};

export const OpenSettings = async (): Promise<void> =>
{
    if (SettingsWindow !== undefined)
    {
        SettingsWindow.show();
    }
};

const SaveSettings = async (NewSettings: FSettings): Promise<boolean> =>
{
    try
    {
        await Settings.set("Settings", NewSettings);
        return true;
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    catch (_Error: unknown)
    {
        return false;
    }
};

const OnUpdateSettings = async (NewSettings: FSettings): Promise<boolean> =>
{
    SetRunOnStartup(NewSettings.RunOnStartup, process.execPath, () =>
    {
        // @TODO Error handling.
    });

    return true;
};

export const UpdateSettings = async (InSettings: FSettings): Promise<boolean> =>
{
    const SavedSuccessful: boolean = await SaveSettings(InSettings);
    if (SavedSuccessful)
    {
        return await OnUpdateSettings(InSettings);
    }

    return false;
};

export const GetSettings = async (): Promise<Readonly<FSettings>> =>
{
    const OutSettings: FSettings | null = await Settings.get("Settings") as FSettings | null;
    return OutSettings !== null
        ? OutSettings
        : DefaultSettings;
};

const InitializeSettings = async (): Promise<void> =>
{
    if (!Settings.hasSync("Settings"))
    {
        await Settings.set("Settings", DefaultSettings);
    }
};

RegisterInitializationFunction(CreateSettingsWindow);
RegisterInitializationFunction(InitializeSettings);
