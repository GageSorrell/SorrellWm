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
import { Box, IntPoint } from "@sorrell/math";
import { Effect, Layer, ManagedRuntime, Option, Stream, pipe } from "effect";
import {
    type Event,
    type IpcMainInvokeEvent,
    app,
    ipcMain,
    nativeTheme,
    net,
    protocol,
    screen,
    systemPreferences
} from "electron";
import {
    type FloatingWindowSettingsDto,
    IsFloatingWindowSettingsPatch,
    IsOverlaySettingsPatch,
    type OverlaySettingsDto
} from "../Shared/AppSettings.ts";
import { isAbsolute, join, relative } from "node:path";
import { AppApiChannel } from "../Shared/Api.ts";
import { DevFeatures } from "./Development/index.ts";
import { NodeServices } from "@effect/platform-node";
import type { RendererTheme } from "../Shared/Theme.ts";
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

const ApplicationCoreLive = Layer.mergeAll(
    CommandServicesLive,
    Tiling.Manager.Live,
    TitlebarFlyoutLive
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

ipcMain.removeHandler(AppApiChannel.ThemeGet);
ipcMain.handle(AppApiChannel.ThemeGet, Theme.GetRendererTheme);

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

        const Current = yield* Settings.Get;
        return ToFloatingWindowSettingsDto(Current);
    }));
});

ipcMain.removeHandler(AppApiChannel.OverlayScreenGet);

const ToOverlaySettingsDto = (
    Settings: AppSettings.AppSettings
): OverlaySettingsDto => ({
    FocusPreviewOpacity: Settings.FocusPreviewOpacity
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

        return ToOverlaySettingsDto(yield* Settings.Get);
    }));
});

ipcMain.handle(AppApiChannel.OverlayScreenGet, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Session = yield* Overlay.Session.OverlaySession;
        return yield* Session.Snapshot;
    })
));

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

    return ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Executor = yield* Command.Executor.CommandExecutor;
        const Resolver = yield* Command.Resolver.CommandResolver;
        const ThisCommand = yield* Resolver.ResolveOverlayCommand(Id);

        if (Option.isNone(ThisCommand))
        {
            throw new TypeError("The requested command is not available on the current screen.");
        }

        yield* Executor.Execute(ThisCommand.value);
    }));
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

    return ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Session = yield* Overlay.Session.OverlaySession;
        yield* Session.PreviewFocusTarget(Id);
    }));
});

ipcMain.removeHandler(AppApiChannel.OverlayBack);
ipcMain.handle(AppApiChannel.OverlayBack, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Executor = yield* Command.Executor.CommandExecutor;
        yield* Executor.Execute(Command.Ui.UiCommand().BackOverlayScreen());
    })
));

const PublishRendererTheme = (): void =>
{
    if (!IsApplicationRuntimeStarted || IsApplicationRuntimeDisposing)
    {
        return;
    }

    const CurrentTheme: RendererTheme = Theme.GetRendererTheme();

    void ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const CatchWindowNotFound =
            Effect.catchTag<any, any, any, any, any>("BrowserWindowNotFoundError", () => Effect.void);

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
    }));
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
    yield* Logging.LogTilingState(yield* TilingManager.Snapshot);
    yield* TitlebarFlyout.TitlebarFlyout;
    const BrowserWindows = yield* BrowserWindow.BrowserWindow;
    const Settings = yield* AppSettings.AppSettings;
    const InitialSettings = yield* Settings.Get;
    const CompleteKeybinds = Input.Hotkey.WithDefaultKeybindSettings(InitialSettings.Keybinds);

    if (CompleteKeybinds !== InitialSettings.Keybinds)
    {
        yield* Settings.SetSetting("Keybinds", CompleteKeybinds);
    }

    yield* Command.Executor.CommandExecutor;
    yield* Command.Resolver.CommandResolver;
    yield* Input.Hotkey.Hotkey;
    yield* Input.Keyboard.Keyboard;
    yield* Overlay.Session.OverlaySession;
    yield* MessageLoop.MessageLoop;

    const Specification = yield* BrowserWindow.MainWindowSpec;
    yield* BrowserWindows.Ensure(Specification);
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

app.on("activate", () => void ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        yield* BrowserWindows.Ensure(yield* BrowserWindow.MainWindowSpec);
        yield* BrowserWindows.Show(BrowserWindow.Key.Main);
        yield* BrowserWindows.Focus(BrowserWindow.Key.Main);
    }))
);

app.on("window-all-closed", () =>
{
    if (!IsApplicationRuntimeDisposing && process.platform !== "darwin")
    {
        app.quit();
    }
});
