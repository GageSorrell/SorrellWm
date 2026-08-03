/**
 * The entrypoint of the backend.
 *
 * @module @sorrell/wm/Main/Entry
 *
 * @file      Entry.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings/index.ts";
import * as BoxUtility from "./Utility/Math/Box.ts";
import * as BrowserWindow from "./BrowserWindow.ts";
import * as Command from "./Command/index.ts";
import * as Input from "./Input/index.ts";
import * as Logging from "./Logging.ts";
import * as MessageLoop from "./MessageLoop.ts";
import * as Overlay from "./Overlay/index.ts";
import * as OverlayShared from "../Shared/OverlayCommand.ts";
import * as Theme from "./Theme.ts";
import * as Tiling from "./Tiling/index.ts";
import * as TitlebarFlyout from "./TitlebarFlyout.ts";
import * as Tray from "./Tray.ts";
import * as Update from "./Update.ts";
import { Box, IntPoint } from "@sorrell/math";
import { Effect, Layer, ManagedRuntime, Option, Result, Schema, Stream, pipe } from "effect";
import {
    BrowserWindow as ElectronBrowserWindow,
    type Event,
    type IpcMainEvent,
    type IpcMainInvokeEvent,
    type MessageBoxOptions,
    type OpenDialogOptions,
    app,
    dialog,
    ipcMain,
    nativeTheme,
    net,
    protocol,
    screen,
    shell,
    systemPreferences
} from "electron";
import {
    type FloatingWindowSettingsDto,
    type GeneralSettingsDto,
    IsFloatingWindowSettingsPatch,
    IsGeneralSettingsPatch,
    IsOverlaySettingsPatch,
    IsPerAppSettingPatch,
    type OverlaySettingsDto,
    type PerAppSettingDto,
    type PerAppSettingsApplicationDto,
    type PerAppSettingsEntryDto
} from "../Shared/AppSettings.ts";
import {
    type RendererLogEntry,
    RendererLogEntry as RendererLogEntrySchema
} from "../Shared/Logging.ts";
import { basename, extname, isAbsolute, join, relative } from "node:path";
import { AppApiChannel } from "../Shared/Api.ts";
import { DevFeatures } from "./Development/index.ts";
import type { InsertTargetPresentation } from "../Shared/InsertTarget.ts";
import { NodeServices } from "@effect/platform-node";
import type { RendererTheme } from "../Shared/Theme.ts";
import type { UpdateDownloadResultDto } from "../Shared/Update.ts";
import { Window } from "@sorrell/windows";
import { pathToFileURL } from "node:url";

const RendererProtocolScheme: string = "sorrell";

const LogConfiguration = Logging.MakeConfiguration({
    Application: {
        Name: "SorrellWm",
        Version: app.getVersion()
    },
    MinimumLevel: app.isPackaged ? "Info" : "Debug",
    Port: 6969
});

const AppSettingsLive = pipe(
    AppSettings.AppSettings.Layer,
    Layer.provide(NodeServices.layer)
);

const OverlaySessionLive = pipe(
    Overlay.Session.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsLive,
        BrowserWindow.Live,
        Tiling.Manager.Live
    ))
);

const AppSettingsSyncLive = pipe(
    AppSettings.Sync.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsLive,
        BrowserWindow.Live,
        OverlaySessionLive
    ))
);

const KeyboardLive = pipe(
    Input.Keyboard.Live,
    Layer.provideMerge(MessageLoop.Live)
);

const HotkeyLive = Layer.unwrap(pipe(
    AppSettings.AppSettings,
    Effect.map((Settings: AppSettings.Service) =>
        Input.Hotkey.Live(pipe(
            Settings.Changes,
            Stream.map((Current: AppSettings.AppSettings) =>
                Input.Hotkey.KeybindSetFromSettings(Current.Keybinds)
            )
        ))
    )
));

const NativeServicesLive = pipe(
    HotkeyLive,
    Layer.provideMerge(Layer.mergeAll(AppSettingsLive, KeyboardLive))
);
const CommandResolverLive = pipe(
    Command.Resolver.Live,
    Layer.provideMerge(Layer.mergeAll(NativeServicesLive, OverlaySessionLive))
);
const CommandServicesLive = pipe(
    Command.Executor.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsSyncLive,
        CommandResolverLive,
        Tiling.Manager.Live
    ))
);
const TitlebarFlyoutLive = pipe(
    TitlebarFlyout.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsLive,
        BrowserWindow.Live,
        OverlaySessionLive
    ))
);
const TrayLive = pipe(
    Tray.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsLive,
        CommandServicesLive
    ))
);

const ApplicationCoreLive = Layer.mergeAll(
    CommandServicesLive,
    Tiling.Manager.Live,
    TitlebarFlyoutLive,
    TrayLive
);
const ApplicationServicesLive = pipe(
    Layer.mergeAll(
        ApplicationCoreLive,
        pipe(
            Logging.TelemetryLive,
            Layer.provide(ApplicationCoreLive)
        )
    ),
    Layer.provideMerge(LogConfiguration.Layer)
);
const ApplicationRuntime = ManagedRuntime.make(ApplicationServicesLive);
let IsApplicationRuntimeStarted: boolean = false;
let IsApplicationRuntimeDisposing: boolean = false;

const ReportRejectedOperation = async <Value>(
    Category: string,
    Operation: string,
    Action: () => Promise<Value>
): Promise<Value> =>
{
    try
    {
        return await Action();
    }
    catch (Cause: unknown)
    {
        await ApplicationRuntime.runPromise(Logging.LogError(
            Category,
            `${ Operation } failed.`,
            Cause,
            { Operation }
        )).catch(() => undefined);
        throw Cause;
    }
};

protocol.registerSchemesAsPrivileged([
    {
        privileges:
        {
            secure: true,
            standard: true,
            supportFetchAPI: true
        },
        scheme: RendererProtocolScheme
    }
]);

const registerRendererProtocol = (): void =>
{
    const rendererRoot: string = join(app.getAppPath(), "Build/Renderer");

    protocol.handle(RendererProtocolScheme, (request: Request): Promise<Response> =>
    {
        const requestUrl: URL = new URL(request.url);
        const requestedPath: string = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "")
            || "index.html";
        const rendererPath: string = join(rendererRoot, requestedPath);
        const pathFromRendererRoot: string = relative(rendererRoot, rendererPath);

        if (pathFromRendererRoot.startsWith("..") || isAbsolute(pathFromRendererRoot))
        {
            return Promise.resolve(new Response("Not found", { status: 404 }));
        }

        return net.fetch(pathToFileURL(rendererPath).toString());
    });
};

const GetRendererWindowName = (EventValue: IpcMainEvent): string =>
{
    try
    {
        return new URL(EventValue.sender.getURL()).searchParams.get("window") ?? "Unknown";
    }
    catch
    {
        return "Unknown";
    }
};

const WriteRendererLog = (
    Entry: RendererLogEntry,
    RendererWindow: string
): Effect.Effect<void> =>
{
    const Category = `Renderer.${ Entry.Category }`;
    const Annotations = {
        RendererWindow,
        ...(Entry.Details === undefined ? { } : { Details: Entry.Details })
    };

    switch (Entry.Level)
    {
        case "Debug":
            return Logging.LogDebug(Category, Entry.Message, Annotations);
        case "Error":
            return Logging.LogError(Category, Entry.Message, undefined, Annotations);
        case "Info":
            return Logging.LogInfo(Category, Entry.Message, Annotations);
        case "Warning":
            return Logging.LogWarning(Category, Entry.Message, undefined, Annotations);
    }
};

ipcMain.removeAllListeners(AppApiChannel.RendererLogWrite);
ipcMain.on(AppApiChannel.RendererLogWrite, (
    EventValue: IpcMainEvent,
    Value: unknown
): void =>
{
    const RendererWindow = GetRendererWindowName(EventValue);

    void ApplicationRuntime.runPromise(
        Schema.decodeUnknownEffect(RendererLogEntrySchema)(Value).pipe(
            Effect.flatMap((Entry: RendererLogEntry) =>
                WriteRendererLog(Entry, RendererWindow)),
            Effect.catch((Cause: unknown) => Logging.LogWarning(
                "Renderer",
                "Rejected an invalid renderer log event.",
                Cause,
                { RendererWindow }
            ))
        )
    ).catch(() => undefined);
});

ipcMain.removeHandler(AppApiChannel.ThemeGet);
ipcMain.handle(AppApiChannel.ThemeGet, Theme.GetRendererTheme);

ipcMain.removeHandler(AppApiChannel.UpdateStatusGet);
ipcMain.handle(
    AppApiChannel.UpdateStatusGet,
    () => Update.GetUpdateStatus(Update.LiveDependencies)
);

ipcMain.removeHandler(AppApiChannel.UpdateDownloadAndInstall);
ipcMain.handle(AppApiChannel.UpdateDownloadAndInstall, async (
    EventValue: IpcMainInvokeEvent
): Promise<UpdateDownloadResultDto> =>
{
    try
    {
        await Update.DownloadAndInstallUpdate(Update.LiveDependencies);
        app.quit();
        return { Success: true };
    }
    catch (Cause: unknown)
    {
        await ApplicationRuntime.runPromise(Logging.LogError(
            "Update",
            "Could not download or launch the update installer.",
            Cause
        )).catch(() => undefined);

        const Status = await Update.GetUpdateStatus(Update.LiveDependencies);
        const Parent = ElectronBrowserWindow.fromWebContents(EventValue.sender);
        const DialogOptions: MessageBoxOptions = {
            buttons: Status.ReleaseUrl === null
                ? [ "Close" ]
                : [ "Open Release Page", "Close" ],
            cancelId: Status.ReleaseUrl === null ? 0 : 1,
            defaultId: Status.ReleaseUrl === null ? 0 : 1,
            detail: Cause instanceof Error ? Cause.message : "An unknown error occurred.",
            message: "SorrellWm could not download or launch the update installer.",
            title: "Update Failed",
            type: "error"
        };
        const Result = Parent === null
            ? await dialog.showMessageBox(DialogOptions)
            : await dialog.showMessageBox(Parent, DialogOptions);

        if (Status.ReleaseUrl !== null && Result.response === 0)
        {
            await shell.openExternal(Status.ReleaseUrl);
        }

        return { Success: false };
    }
});

const ToFloatingWindowSettingsDto = (
    Settings: AppSettings.AppSettings
): FloatingWindowSettingsDto => ({
    MoveFineSpeed: Settings.MoveFineSpeed,
    MoveStepPrimary: Settings.MoveStepPrimary,
    MoveStepPrimarySpeedFactor: Settings.MoveStepPrimarySpeedFactor,
    MoveStepSecondary: Settings.MoveStepSecondary,
    MoveStepSecondarySpeedFactor: Settings.MoveStepSecondarySpeedFactor
});

ipcMain.removeHandler(AppApiChannel.FloatingWindowSettingsGet);
ipcMain.handle(AppApiChannel.FloatingWindowSettingsGet, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        const Current = yield* Settings.Get;
        return ToFloatingWindowSettingsDto(Current);
    })
));

ipcMain.removeHandler(AppApiChannel.FloatingWindowSettingsSet);
ipcMain.handle(AppApiChannel.FloatingWindowSettingsSet, (
    _Event: IpcMainInvokeEvent,
    PatchValue: unknown
) =>
{
    if (!IsFloatingWindowSettingsPatch(PatchValue))
    {
        throw new TypeError("The requested floating-window settings patch is invalid.");
    }

    return ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;

        if (PatchValue.MoveFineSpeed !== undefined)
        {
            yield* Settings.SetSetting("MoveFineSpeed", PatchValue.MoveFineSpeed);
        }

        if (PatchValue.MoveStepPrimary !== undefined)
        {
            yield* Settings.SetSetting("MoveStepPrimary", PatchValue.MoveStepPrimary);
        }

        if (PatchValue.MoveStepPrimarySpeedFactor !== undefined)
        {
            yield* Settings.SetSetting(
                "MoveStepPrimarySpeedFactor",
                PatchValue.MoveStepPrimarySpeedFactor
            );
        }

        if (PatchValue.MoveStepSecondary !== undefined)
        {
            yield* Settings.SetSetting("MoveStepSecondary", PatchValue.MoveStepSecondary);
        }

        if (PatchValue.MoveStepSecondarySpeedFactor !== undefined)
        {
            yield* Settings.SetSetting(
                "MoveStepSecondarySpeedFactor",
                PatchValue.MoveStepSecondarySpeedFactor
            );
        }

        yield* Logging.LogInfo("Settings", "Floating-window settings updated.", {
            Settings: Object.keys(PatchValue)
        });
        const Current = yield* Settings.Get;
        return ToFloatingWindowSettingsDto(Current);
    }));
});

const ToGeneralSettingsDto = (
    Settings: AppSettings.AppSettings
): GeneralSettingsDto => ({
    IgnoreActivationKeybindInFullscreen:
        Settings.IgnoreActivationKeybindInFullscreen,
    ResizeRecoveryStrategy: Settings.ResizeRecoveryStrategy,
    TileExistingWindowsOnStartup: Settings.TileExistingWindowsOnStartup,
    TiledResizeBehavior: Settings.TiledResizeBehavior,
    TiledWindowDetachDistance: Settings.TiledWindowDetachDistance,
    TiledWindowGap: Settings.TiledWindowGap
});

ipcMain.removeHandler(AppApiChannel.GeneralSettingsGet);
ipcMain.handle(AppApiChannel.GeneralSettingsGet, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        return ToGeneralSettingsDto(yield* Settings.Get);
    })
));

ipcMain.removeHandler(AppApiChannel.GeneralSettingsSet);
ipcMain.handle(AppApiChannel.GeneralSettingsSet, (
    _Event: IpcMainInvokeEvent,
    PatchValue: unknown
) =>
{
    if (!IsGeneralSettingsPatch(PatchValue))
    {
        throw new TypeError("The requested general-settings patch is invalid.");
    }

    return ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        const TilingManager = yield* Tiling.Manager.TilingManager;

        if (PatchValue.IgnoreActivationKeybindInFullscreen !== undefined)
        {
            yield* Settings.SetSetting(
                "IgnoreActivationKeybindInFullscreen",
                PatchValue.IgnoreActivationKeybindInFullscreen
            );
        }

        if (PatchValue.TileExistingWindowsOnStartup !== undefined)
        {
            yield* Settings.SetSetting(
                "TileExistingWindowsOnStartup",
                PatchValue.TileExistingWindowsOnStartup
            );
        }

        if (PatchValue.ResizeRecoveryStrategy !== undefined)
        {
            yield* Settings.SetSetting(
                "ResizeRecoveryStrategy",
                PatchValue.ResizeRecoveryStrategy
            );
        }

        if (PatchValue.TiledWindowGap !== undefined)
        {
            yield* Settings.SetSetting("TiledWindowGap", PatchValue.TiledWindowGap);
            yield* TilingManager.SetGap(PatchValue.TiledWindowGap);
        }

        if (PatchValue.TiledWindowDetachDistance !== undefined)
        {
            yield* Settings.SetSetting(
                "TiledWindowDetachDistance",
                PatchValue.TiledWindowDetachDistance
            );
        }

        if (PatchValue.TiledResizeBehavior !== undefined)
        {
            yield* Settings.SetSetting(
                "TiledResizeBehavior",
                PatchValue.TiledResizeBehavior
            );
        }

        yield* Logging.LogInfo("Settings", "General settings updated.", {
            Settings: Object.keys(PatchValue)
        });
        return ToGeneralSettingsDto(yield* Settings.Get);
    }));
});

ipcMain.removeHandler(AppApiChannel.SettingsOpen);
ipcMain.handle(AppApiChannel.SettingsOpen, (
    _Event: IpcMainInvokeEvent,
    PathValue: unknown
) =>
{
    if (typeof PathValue !== "string")
    {
        throw new TypeError("The requested settings path is invalid.");
    }

    return ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Executor = yield* Command.Executor.CommandExecutor;
        yield* Executor.Execute(Command.Ui.UiCommand().OpenSettings({
            Path: Option.some(PathValue)
        }));
    }));
});

ipcMain.removeHandler(AppApiChannel.OverlayScreenGet);

const ToOverlaySettingsDto = (
    Settings: AppSettings.AppSettings
): OverlaySettingsDto => ({
    FocusPreviewOpacity: Settings.FocusPreviewOpacity,
    ShowStackPanelMinimizeFlyout: Settings.ShowStackPanelMinimizeFlyout
});

ipcMain.removeHandler(AppApiChannel.OverlaySettingsGet);
ipcMain.handle(AppApiChannel.OverlaySettingsGet, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        return ToOverlaySettingsDto(yield* Settings.Get);
    })
));

ipcMain.removeHandler(AppApiChannel.OverlaySettingsSet);
ipcMain.handle(AppApiChannel.OverlaySettingsSet, (
    _Event: IpcMainInvokeEvent,
    PatchValue: unknown
) =>
{
    if (!IsOverlaySettingsPatch(PatchValue))
    {
        throw new TypeError("The requested overlay-settings patch is invalid.");
    }

    return ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;

        if (PatchValue.FocusPreviewOpacity !== undefined)
        {
            yield* Settings.SetSetting(
                "FocusPreviewOpacity",
                PatchValue.FocusPreviewOpacity
            );
        }

        if (PatchValue.ShowStackPanelMinimizeFlyout !== undefined)
        {
            yield* Settings.SetSetting(
                "ShowStackPanelMinimizeFlyout",
                PatchValue.ShowStackPanelMinimizeFlyout
            );
        }

        yield* Logging.LogInfo("Settings", "Overlay settings updated.", {
            Settings: Object.keys(PatchValue)
        });
        return ToOverlaySettingsDto(yield* Settings.Get);
    }));
});

const GetExecutableFriendlyName = (ExecutablePath: string): string => Option.getOrElse(
    Window.GetApplicationNameFromPath(ExecutablePath),
    () => basename(ExecutablePath, extname(ExecutablePath))
);

const GetExecutableIcon = async (
    ExecutablePath: string
): Promise<string | undefined> =>
{
    try
    {
        const Icon = await app.getFileIcon(ExecutablePath, { size: "large" });
        const Png = Icon.toPNG();
        return Png.length === 0 ? undefined : Png.toString("base64");
    }
    catch
    {
        await ApplicationRuntime.runPromise(Logging.LogDebug(
            "Settings",
            "Could not retrieve an application icon for per-application settings."
        )).catch(() => undefined);
        return undefined;
    }
};

const ToPerAppSettingsApplicationDto = async (
    ExecutablePath: string
): Promise<PerAppSettingsApplicationDto> =>
{
    const Icon = await GetExecutableIcon(ExecutablePath);

    return {
        ExecutablePath,
        FriendlyName: GetExecutableFriendlyName(ExecutablePath),
        ...(Icon === undefined ? { } : { Icon })
    };
};

const ToPerAppSettingsEntryDto = async (
    ExecutablePath: string,
    Settings: PerAppSettingDto
): Promise<PerAppSettingsEntryDto> => ({
    ...await ToPerAppSettingsApplicationDto(ExecutablePath),
    IgnoreModal: Settings.IgnoreModal,
    NewWindowBehavior: Settings.NewWindowBehavior
});

const GetPerAppSettingsEntries = async (): Promise<
    ReadonlyArray<PerAppSettingsEntryDto>
> =>
{
    const Current = await ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        return (yield* Settings.Get).PerAppSettings;
    }));

    const Entries = await Promise.all(Object.entries(Current).map(([
        ExecutablePath,
        Settings
    ]: [ string, PerAppSettingDto ]) =>
        ToPerAppSettingsEntryDto(ExecutablePath, Settings)));

    return Entries.sort((
        Left: PerAppSettingsEntryDto,
        Right: PerAppSettingsEntryDto
    ) => Left.FriendlyName.localeCompare(Right.FriendlyName));
};

ipcMain.removeHandler(AppApiChannel.PerAppSettingsGet);
ipcMain.handle(AppApiChannel.PerAppSettingsGet, GetPerAppSettingsEntries);

const NormalizeExecutablePath = (ExecutablePath: string): string =>
    ExecutablePath.trim().toLowerCase();

ipcMain.removeHandler(AppApiChannel.PerAppSettingsRecentGet);
ipcMain.handle(AppApiChannel.PerAppSettingsRecentGet, async (): Promise<
    ReadonlyArray<PerAppSettingsApplicationDto>
> =>
{
    const Current = await ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        return (yield* Settings.Get).PerAppSettings;
    }));
    const ConfiguredPaths = new Set(
        Object.keys(Current).map(NormalizeExecutablePath)
    );
    const Windows = Window.GetManageableTopLevelWindows();

    if (Result.isFailure(Windows))
    {
        return [ ];
    }

    const SeenPaths = new Set<string>();
    const RecentPaths: Array<string> = [ ];

    for (const WindowHandle of Windows.success)
    {
        const ExecutablePath = Window.GetExecutablePath(WindowHandle);
        if (Option.isNone(ExecutablePath))
        {
            continue;
        }

        const NormalizedPath = NormalizeExecutablePath(ExecutablePath.value);
        if (
            ConfiguredPaths.has(NormalizedPath)
            || SeenPaths.has(NormalizedPath)
        )
        {
            continue;
        }

        SeenPaths.add(NormalizedPath);
        RecentPaths.push(ExecutablePath.value);

        if (RecentPaths.length === 5)
        {
            break;
        }
    }

    return Promise.all(RecentPaths.map(ToPerAppSettingsApplicationDto));
});

ipcMain.removeHandler(AppApiChannel.PerAppSettingsAdd);
ipcMain.handle(AppApiChannel.PerAppSettingsAdd, async (
    EventValue: IpcMainInvokeEvent,
    RequestedExecutablePathValue: unknown
): Promise<PerAppSettingsEntryDto | null> =>
{
    if (
        RequestedExecutablePathValue !== undefined
        && (
            typeof RequestedExecutablePathValue !== "string"
            || !isAbsolute(RequestedExecutablePathValue)
            || extname(RequestedExecutablePathValue).toLowerCase() !== ".exe"
        )
    )
    {
        throw new TypeError("The requested application executable path is invalid.");
    }

    let ExecutablePath: string | undefined =
        typeof RequestedExecutablePathValue === "string"
            ? RequestedExecutablePathValue
            : undefined;

    if (ExecutablePath === undefined)
    {
        const Options: OpenDialogOptions = {
            filters: [
                {
                    extensions: [ "exe" ],
                    name: "Applications"
                }
            ],
            properties: [ "openFile" ],
            title: "Add Application"
        };
        const Parent = ElectronBrowserWindow.fromWebContents(EventValue.sender);
        const Selection = Parent === null
            ? await dialog.showOpenDialog(Options)
            : await dialog.showOpenDialog(Parent, Options);
        ExecutablePath = Selection.filePaths[0];

        if (Selection.canceled || ExecutablePath === undefined)
        {
            return null;
        }
    }

    const PerExecutableSettings = await ApplicationRuntime.runPromise(
        Effect.gen(function*()
        {
            const Settings = yield* AppSettings.AppSettings;
            const Current = yield* Settings.Get;
            const Existing = Current.PerAppSettings[ExecutablePath];

            if (Existing !== undefined)
            {
                yield* Logging.LogDebug(
                    "Settings",
                    "Per-application settings already existed for the selected application."
                );
                return Existing;
            }

            const Defaults = yield* Schema.decodeUnknownEffect(
                AppSettings.PerAppSettings
            )({ });
            yield* Settings.SetSetting("PerAppSettings", {
                ...Current.PerAppSettings,
                [ ExecutablePath ]: Defaults
            });
            yield* Logging.LogInfo(
                "Settings",
                "Added per-application settings for a selected application."
            );
            return Defaults;
        })
    );

    return ToPerAppSettingsEntryDto(ExecutablePath, PerExecutableSettings);
});

ipcMain.removeHandler(AppApiChannel.PerAppSettingsSet);
ipcMain.handle(AppApiChannel.PerAppSettingsSet, async (
    _Event: IpcMainInvokeEvent,
    ExecutablePathValue: unknown,
    PatchValue: unknown
): Promise<PerAppSettingsEntryDto> =>
{
    if (
        typeof ExecutablePathValue !== "string"
        || ExecutablePathValue.trim().length === 0
        || !IsPerAppSettingPatch(PatchValue)
    )
    {
        throw new TypeError("The requested per-application settings patch is invalid.");
    }

    const ExecutablePath = ExecutablePathValue;
    const Updated = await ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        const Current = yield* Settings.Get;
        const Existing = Current.PerAppSettings[ExecutablePath];

        if (Existing === undefined)
        {
            throw new TypeError("The executable has no per-application settings.");
        }

        const Next: AppSettings.PerAppSettings = {
            ...Existing,
            ...PatchValue
        };
        yield* Settings.SetSetting("PerAppSettings", {
            ...Current.PerAppSettings,
            [ ExecutablePath ]: Next
        });
        yield* Logging.LogInfo("Settings", "Per-application settings updated.", {
            Settings: Object.keys(PatchValue)
        });
        return Next;
    }));

    return ToPerAppSettingsEntryDto(ExecutablePath, Updated);
});

ipcMain.handle(AppApiChannel.OverlayScreenGet, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Session = yield* Overlay.Session.OverlaySession;
        return yield* Session.Snapshot;
    })
));

ipcMain.removeHandler(AppApiChannel.InsertTargetGet);
ipcMain.handle(AppApiChannel.InsertTargetGet, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Session = yield* Overlay.Session.OverlaySession;
        return {
            CaptureNextWindow: yield* Session.TiledInsertCaptureNext,
            DragActive: yield* Session.TiledInsertDragActive
        } satisfies InsertTargetPresentation;
    })
));

ipcMain.removeHandler(AppApiChannel.InsertTargetCancel);
ipcMain.handle(AppApiChannel.InsertTargetCancel, () => ReportRejectedOperation(
    "IPC",
    "Tiled Insert cancellation",
    () => ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Executor = yield* Command.Executor.CommandExecutor;
        yield* Executor.Execute(Command.Ui.UiCommand().CancelTiledInsert());
    }))
));

ipcMain.removeHandler(AppApiChannel.InsertTargetChooseWindow);
ipcMain.handle(AppApiChannel.InsertTargetChooseWindow, () => ReportRejectedOperation(
    "IPC",
    "Tiled Insert window-list return",
    () => ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Executor = yield* Command.Executor.CommandExecutor;
        yield* Executor.Execute(Command.Ui.UiCommand().ReturnToTiledInsertList());
    }))
));

ipcMain.removeHandler(AppApiChannel.InsertTargetSetCaptureNext);
ipcMain.handle(AppApiChannel.InsertTargetSetCaptureNext, (
    _Event: IpcMainInvokeEvent,
    Enabled: unknown
) =>
{
    if (typeof Enabled !== "boolean")
    {
        throw new TypeError("The Insert target capture setting must be a boolean.");
    }

    return ReportRejectedOperation(
        "IPC",
        "Tiled Insert next-window capture",
        () => ApplicationRuntime.runPromise(Effect.gen(function*()
        {
            const Executor = yield* Command.Executor.CommandExecutor;
            yield* Executor.Execute(
                Command.Ui.UiCommand().SetTiledInsertCaptureNext({ Enabled })
            );
        }))
    );
});

ipcMain.removeHandler(AppApiChannel.OverlayCommandInvoke);
ipcMain.handle(AppApiChannel.OverlayCommandInvoke, (
    _Event: IpcMainInvokeEvent,
    IdValue: unknown
) =>
{
    if (!OverlayShared.IsOverlayCommandId(IdValue))
    {
        throw new TypeError("The requested overlay command is invalid.");
    }

    const Id: OverlayShared.OverlayCommandId = IdValue;

    return ReportRejectedOperation("IPC", "Overlay command invocation", () =>
        ApplicationRuntime.runPromise(Effect.gen(function*()
        {
            const Executor = yield* Command.Executor.CommandExecutor;
            const Resolver = yield* Command.Resolver.CommandResolver;
            const ThisCommand = yield* Resolver.ResolveOverlayCommand(Id);

            if (Option.isNone(ThisCommand))
            {
                throw new TypeError("The requested command is not available on the current screen.");
            }

            yield* Executor.Execute(ThisCommand.value);
            yield* Logging.LogDebug("Command", "IPC application command completed.", {
                Category: ThisCommand.value.Category,
                Command: ThisCommand.value._tag
            });
        })));
});

ipcMain.removeHandler(AppApiChannel.OverlayFocusPreview);
ipcMain.handle(AppApiChannel.OverlayFocusPreview, (
    _Event: IpcMainInvokeEvent,
    IdValue: unknown
) =>
{
    if (IdValue !== null && !OverlayShared.IsOverlayCommandId(IdValue))
    {
        throw new TypeError("The requested Focus preview command is invalid.");
    }

    const Id: OverlayShared.OverlayCommandId | null = IdValue;

    return ReportRejectedOperation("IPC", "Overlay Focus preview", () =>
        ApplicationRuntime.runPromise(Effect.gen(function*()
        {
            const Session = yield* Overlay.Session.OverlaySession;
            yield* Session.PreviewFocusTarget(Id);
        })));
});

ipcMain.removeHandler(AppApiChannel.OverlayStackWindowSelect);
ipcMain.handle(AppApiChannel.OverlayStackWindowSelect, (
    _Event: IpcMainInvokeEvent,
    Index: unknown
) =>
{
    if (typeof Index !== "number" || !Number.isSafeInteger(Index) || Index < 0)
    {
        throw new TypeError("The requested stack-window index is invalid.");
    }

    return ReportRejectedOperation("IPC", "Overlay stack-window selection", () =>
        ApplicationRuntime.runPromise(Effect.gen(function*()
        {
            const Executor = yield* Command.Executor.CommandExecutor;
            yield* Executor.Execute(
                Command.Ui.UiCommand().SelectTiledStackWindow({
                    Index
                })
            );
        })));
});

ipcMain.removeHandler(AppApiChannel.OverlayBack);
ipcMain.handle(AppApiChannel.OverlayBack, () => ReportRejectedOperation(
    "IPC",
    "Overlay back navigation",
    () => ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Executor = yield* Command.Executor.CommandExecutor;
        yield* Executor.Execute(Command.Ui.UiCommand().BackOverlayScreen());
    }))
));

const PublishRendererTheme = (): void =>
{
    if (!IsApplicationRuntimeStarted || IsApplicationRuntimeDisposing)
    {
        return;
    }

    const CurrentTheme: RendererTheme = Theme.GetRendererTheme();

    void ReportRejectedOperation("Theme", "Renderer theme publication", () =>
        ApplicationRuntime.runPromise(Effect.gen(function*()
        {
            const CatchWindowNotFound =
                Effect.catchTag<any, any, any, any, any>(
                    "BrowserWindowNotFoundError",
                    () => Effect.void
                );

            const BrowserWindows = yield* BrowserWindow.BrowserWindow;

            yield* Effect.all([
                pipe(
                    BrowserWindows.Send(
                        BrowserWindow.Key.Main,
                        AppApiChannel.ThemeChanged,
                        CurrentTheme
                    ),
                    CatchWindowNotFound
                ),
                pipe(
                    BrowserWindows.Send(
                        BrowserWindow.Key.Overlay,
                        AppApiChannel.ThemeChanged,
                        CurrentTheme
                    ),
                    CatchWindowNotFound
                )
            ], { discard: true });
            yield* Logging.LogDebug("Theme", "Published the renderer theme.");
        }))
    );
};

const HandleOnStartDevFeatures = (
    BrowserWindows: BrowserWindow.BrowserWindowImpl
) => Effect.gen(function* ()
{
    if ((yield* DevFeatures).OpenSettingsOnStart)
    {
        const Specification = yield* BrowserWindow.SettingsWindowSpec;
        yield* BrowserWindows.Ensure(Specification);

        const PrimaryDisplayArea = screen.getPrimaryDisplay().workArea;
        const PrimaryDisplayBounds = Box.Box(
            IntPoint.IntPoint(PrimaryDisplayArea.x, PrimaryDisplayArea.y),
            IntPoint.IntPoint(
                PrimaryDisplayArea.x + PrimaryDisplayArea.width,
                PrimaryDisplayArea.y + PrimaryDisplayArea.height
            )
        );
        const WindowSize = IntPoint.IntPoint(
            Specification.Options.width ?? 0,
            Specification.Options.height ?? 0
        );

        yield* BrowserWindows.SetBounds(
            BrowserWindow.Key.Settings,
            BoxUtility.Center(WindowSize, PrimaryDisplayBounds)
        );
        yield* BrowserWindows.Show(BrowserWindow.Key.Settings);
        yield* BrowserWindows.Focus(BrowserWindow.Key.Settings);
    }
});

const StartApplication = Effect.gen(function*()
{
    yield* Effect.logInfo("Starting SorrellWm.", {
        LogClientPort: LogConfiguration.Port
    });
    yield* Logging.LogGlobal(
        Logging.ApplicationStartedAt,
        new Date()
    );
    const TilingManager = yield* Tiling.Manager.TilingManager;
    yield* TitlebarFlyout.TitlebarFlyout;
    yield* Tray.Tray;
    const BrowserWindows = yield* BrowserWindow.BrowserWindow;
    const Settings = yield* AppSettings.AppSettings;
    const InitialSettings = yield* Settings.Get;
    const CompleteKeybinds = Input.Hotkey.WithDefaultKeybindSettings(InitialSettings.Keybinds);
    const DevelopmentFeatures = yield* DevFeatures;

    yield* TilingManager.SetGap(InitialSettings.TiledWindowGap);

    if (
        InitialSettings.TileExistingWindowsOnStartup
        || DevelopmentFeatures.TileOnStart
    )
    {
        yield* TilingManager.TileExistingWindows.pipe(
            Effect.catch((ErrorValue: Tiling.Manager.TilingManagerError) =>
                Effect.logWarning(
                    "Could not tile existing windows; tiling will start with an empty state.",
                    ErrorValue
                )
            )
        );
    }

    yield* Logging.LogTilingState(yield* TilingManager.Snapshot);

    if (CompleteKeybinds !== InitialSettings.Keybinds)
    {
        yield* Settings.SetSetting("Keybinds", CompleteKeybinds);
        yield* Logging.LogInfo(
            "Settings",
            "Restored missing default keybind settings.",
            { KeybindCount: CompleteKeybinds.length }
        );
    }

    yield* Command.Executor.CommandExecutor;
    yield* Command.Resolver.CommandResolver;
    yield* Input.Hotkey.Hotkey;
    yield* Input.Keyboard.Keyboard;
    yield* Overlay.Session.OverlaySession;
    yield* MessageLoop.MessageLoop;

    yield* BrowserWindows.Ensure(yield* BrowserWindow.OverlayWindowSpec);

    if ((yield* DevFeatures).StaticOverlay)
    {
        yield* BrowserWindows.Show("Overlay");
    }

    yield* Effect.logInfo("SorrellWm is ready.");

    yield* HandleOnStartDevFeatures(BrowserWindows);
});

void app.whenReady().then(async (): Promise<void> =>
{
    IsApplicationRuntimeStarted = true;

    try
    {
        registerRendererProtocol();
        await ApplicationRuntime.runPromise(StartApplication);
        nativeTheme.on("updated", PublishRendererTheme);
        systemPreferences.on("accent-color-changed", PublishRendererTheme);
    }
    catch (Cause: unknown)
    {
        /* eslint-disable-next-line no-console */
        console.error(Cause);
        IsApplicationRuntimeDisposing = true;
        await ApplicationRuntime.runPromise(
            Effect.logError("SorrellWm failed to start.", Cause)
        ).catch(() => undefined);
        await ApplicationRuntime.dispose();
        app.exit(1);
    }
});

app.on("before-quit", (event: Event): void =>
{
    if (!IsApplicationRuntimeStarted || IsApplicationRuntimeDisposing)
    {
        return;
    }

    event.preventDefault();
    IsApplicationRuntimeDisposing = true;
    nativeTheme.removeListener("updated", PublishRendererTheme);
    systemPreferences.removeListener("accent-color-changed", PublishRendererTheme);

    void ApplicationRuntime.runPromise(
        Effect.logInfo("Stopping SorrellWm.")
    ).catch(() => undefined).finally(() =>
        ApplicationRuntime.dispose().finally(app.quit)
    );
});

app.on("activate", () => void ReportRejectedOperation(
    "Lifecycle",
    "Application activation",
    () => ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        yield* BrowserWindows.Ensure(yield* BrowserWindow.MainWindowSpec);
        yield* BrowserWindows.Show(BrowserWindow.Key.Main);
        yield* BrowserWindows.Focus(BrowserWindow.Key.Main);
        yield* Logging.LogDebug("Lifecycle", "Handled application activation.");
    }))
));

app.on("window-all-closed", () =>
{
    if (!IsApplicationRuntimeDisposing && process.platform !== "darwin")
    {
        app.quit();
    }
});
