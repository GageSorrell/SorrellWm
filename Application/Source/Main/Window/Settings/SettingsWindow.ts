/* File:      SettingsWindow.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type BrowserWindow,
    type BrowserWindowConstructorOptions,
    type Event,
    app,
    shell } from "electron";
import {
    type FIpcBackendChannel,
    type FIpcEvents,
    type FLogger,
    type FNavigateRequest,
    type FRejectFunction,
    type FSettings,
    type TEventCallback,
    type TGetResponse,
    type TRequest,
    type TResolveFunction,
    type TResponse } from "../../../Shared";
import {
    GetIsElevated,
    GetRunOnStartup,
    GetWindowByName,
    type HWindow,
    SetWindowPosition } from "@sorrellwm/windows";
import {
    GetPoorResponse,
    SendIpcEvent as InSendIpcEvent,
    PoorEventFailureSimple,
    PoorEventSuccess,
    RegisterCommonIpcCallbacks,
    RegisterIpcCallbacks,
    type TIpcCallback } from "#/Event";
import { type ProgressInfo, type UpdateCheckResult, type UpdateInfo, autoUpdater } from "electron-updater";
import { CreateBrowserWindow } from "../BrowserWindow";
import { Delay } from "../../../Shared";
import { GetDevSettings } from "#/Development/DevSettings";
import { GetLogger } from "#/Development";
import { RegisterInitializationFunction } from "#/Initialize/Initialize";
import { SetShouldActivate } from "#/Window/Overlay";
import { UpdateSettings } from "#/Settings";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("SettingsWindow");

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
        title: "SorrellWM Settings",
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
            Callback: async (InLink: unknown): ReturnType<TEventCallback<"OpenWebPage">> =>
            {
                const Link: string | undefined = typeof InLink === "string"
                    ? InLink
                    : undefined;

                if (Link !== undefined)
                {
                    await shell.openExternal(Link);
                    return PoorEventSuccess();
                }
                else
                {
                    return PoorEventFailureSimple();
                }
            },
            Channel: "OpenWebPage"
        },
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
            Callback: async (): ReturnType<TEventCallback<"RequestRestart">> =>
            {
                app.relaunch();
                app.exit();

                return {
                    Data: undefined,
                    Error: undefined
                };
            },
            Channel: "RequestRestart"
        },
        {
            Callback: async (InNewSettings: unknown): ReturnType<TEventCallback<"UpdateSettings">> =>
            {
                const NewSettings: FSettings = InNewSettings as FSettings;
                const Success: boolean = await UpdateSettings(NewSettings);
                return GetPoorResponse(Success);
            },
            Channel: "UpdateSettings"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"PreventActivation">> =>
            {
                SetShouldActivate(false);
                return PoorEventSuccess();
            },
            Channel: "PreventActivation"
        },
        {
            Callback: async (): ReturnType<TEventCallback<"AllowActivation">> =>
            {
                SetShouldActivate(true);
                return PoorEventSuccess();
            },
            Channel: "AllowActivation"
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
            Callback: async (): ReturnType<TEventCallback<"GetIsElevated">> =>
            {
                const IsElevated: boolean | undefined = GetIsElevated();

                if (IsElevated !== undefined)
                {
                    return {
                        Data:
                        {
                            IsElevated
                        },
                        Error: undefined
                    };
                }
                else
                {
                    return {
                        Data: undefined,
                        Error: ""
                    };
                }
            },
            Channel: "GetIsElevated"
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

    SettingsWindow.on("focus", (): void =>
    {
        SetShouldActivate(false);
    });

    SettingsWindow.on("blur", (): void =>
    {
        SetShouldActivate(true);
    });

    await LoadFrontend();

    HandleShowOnLaunch(ShowOnLaunch);
};

const HandleShowOnLaunch = async (ShowOnLaunch: boolean): Promise<void> =>
{
    if (!ShowOnLaunch || SettingsWindow === undefined)
    {
        return;
    }

    SettingsWindow.webContents.openDevTools();
    OpenSettings();

    await Delay(3000);
    const DevToolsWindow: HWindow | undefined =
        GetWindowByName("Developer Tools - http://localhost:1212/index.html");
    if (DevToolsWindow)
    {
        SetWindowPosition(DevToolsWindow, { Height: 860, Width: 1080, X: -1080, Y: 860 });
    }

    const { Height, Width, X, Y } =
        GetDevSettings().SettingsWindow.ShowOnLaunch.Position;

    await Delay(100);
    SettingsWindow.setPosition(X / 1.25, Y / 1.25, false);
    await Delay(100);
    SettingsWindow.setSize(Width / 1.25, Height / 1.25, false);

};

// const TestGetSetRunOnStartup = async (): Promise<void> =>
// {
//     await Delay(100);
//     Log("Registering to run on Startup...");
//     Log("Trying Task function...");
//     await Delay(100);
//     SetRunOnStartup(true, process.execPath, (Result: unknown, Other: unknown): void =>
//     {
//         Log("SetRunResult: ", Result, Other);
//     });
//     Log((await SetRunOnStartup(process.execPath)) ? "Success" : "Failed");
//     const Foo: unknown = await GetTaskExistsAsync();
//     Log("Task function Results: ", Foo);
//     await Delay(100);
//     Log(`Get: ${ GetRunOnStartup(process.execPath) }`);
// };

export const OpenSettings = async (): Promise<void> =>
{
    if (SettingsWindow !== undefined)
    {
        SettingsWindow.show();
    }
};

RegisterInitializationFunction("SettingsWindow", CreateSettingsWindow, [ "BrowserWindow" ]);
