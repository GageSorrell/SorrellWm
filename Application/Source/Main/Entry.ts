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

import * as Logging from "./Logging.ts";
import * as OverlayShared from "../Shared/OverlayCommand.ts";
import {
    AppSettings,
    BrowserWindow,
    Command,
    Development,
    Input,
    MessageLoop,
    Overlay,
    Theme,
    Tiling,
    TitlebarFlyout
} from "./index.ts";
import { Effect, Layer, ManagedRuntime, Option, Stream, pipe } from "effect";
import {
    type Event,
    type IpcMainInvokeEvent,
    app,
    ipcMain,
    nativeTheme,
    net,
    protocol,
    systemPreferences
} from "electron";
import { isAbsolute, join, relative } from "node:path";
import { AppApiChannel } from "../Shared/Api.ts";
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
    AppSettings.AppSettings.layer,
    Layer.provide(NodeServices.layer)
);
const OverlaySessionLive = pipe(
    Overlay.Session.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsLive,
        BrowserWindow.Live
    ))
);
const AppSettingsSynchronizationLive = pipe(
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
            Settings.changes,
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
        AppSettingsSynchronizationLive,
        CommandResolverLive
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
const ApplicationRuntime = ManagedRuntime.make(ApplicationServicesLive as any);
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

ipcMain.removeHandler(AppApiChannel.Ping);
ipcMain.handle(AppApiChannel.Ping, () => "pong");

ipcMain.removeHandler(AppApiChannel.ThemeGet);
ipcMain.handle(AppApiChannel.ThemeGet, Theme.GetRendererTheme);

ipcMain.removeHandler(AppApiChannel.OverlayScreenGet);
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
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        yield* Effect.all([
            BrowserWindows.Send(
                BrowserWindow.Key.Main,
                AppApiChannel.ThemeChanged,
                CurrentTheme
            ).pipe(
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
            ),
            BrowserWindows.Send(
                BrowserWindow.Key.Overlay,
                AppApiChannel.ThemeChanged,
                CurrentTheme
            ).pipe(
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
            )
        ], { discard: true });
    }));
};

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
    const InitialSettings = yield* Settings.get;
    const CompleteKeybinds = Input.Hotkey.WithDefaultKeybindSettings(InitialSettings.Keybinds);

    if (CompleteKeybinds !== InitialSettings.Keybinds)
    {
        yield* Settings.setSetting("Keybinds", CompleteKeybinds);
    }

    yield* Command.Executor.CommandExecutor;
    yield* Command.Resolver.CommandResolver;
    yield* Input.Hotkey.Hotkey;
    yield* Input.Keyboard.Keyboard;
    yield* Overlay.Session.OverlaySession;
    yield* MessageLoop.MessageLoop;

    // const CurrentSettings = yield* Settings.get;
    const Specification = yield* BrowserWindow.MainWindowSpec;
    yield* BrowserWindows.Ensure(Specification);
    yield* BrowserWindows.Ensure(yield* BrowserWindow.OverlayWindowSpec);

    if ((yield* Development.DevFeatures).StaticOverlay)
    {
        yield* BrowserWindows.Show("Overlay");
    }

    yield* Effect.logInfo("SorrellWm is ready.");
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

app.on("activate", () =>
{
    void ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindow.BrowserWindow;
        yield* BrowserWindows.Ensure(yield* BrowserWindow.MainWindowSpec);
        yield* BrowserWindows.Show(BrowserWindow.Key.Main);
        yield* BrowserWindows.Focus(BrowserWindow.Key.Main);
    }));
});

app.on("window-all-closed", () =>
{
    if (!IsApplicationRuntimeDisposing && process.platform !== "darwin")
    {
        app.quit();
    }
});
