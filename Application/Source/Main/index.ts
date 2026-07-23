/**
 *
 *
 * @module @sorrell/wm/Main
 *
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * as Accelerator from "./Accelerator.ts";
export * as BrowserWindow from "./BrowserWindow.ts";
export * as Command from "./Command/index.ts";
export * as CommandExecutor from "./CommandExecutor.ts";
export * as CommandResolver from "./CommandResolver.ts";
export * as Hotkey from "./Hotkey.ts";
export * as Keyboard from "./Keyboard.ts";
export * as OverlaySession from "./OverlaySession.ts";
export * as TilingManager from "./TilingManager.ts";
export * as TilingTree from "./TilingTree.ts";
export * as WindowsMessageLoop from "./WindowsMessageLoop.ts";
export * as Theme from "./Theme.ts";
export * as AppSettings from "./AppSettings.ts";
export * as AppSettingsSynchronization from "./AppSettingsSynchronization.ts";
export * from "./DevFeatures.ts";
export * as Utility from "./Utility/index.ts";

import * as AppSettingsService from "./AppSettings.ts";
import * as AppSettingsSynchronizationService from "./AppSettingsSynchronization.ts";
import * as BrowserWindowService from "./BrowserWindow.ts";
import * as CommandExecutorService from "./CommandExecutor.ts";
import * as CommandResolverService from "./CommandResolver.ts";
import * as FileSystem from "node:fs";
import * as HotkeyService from "./Hotkey.ts";
import * as KeyboardService from "./Keyboard.ts";
import * as OverlaySessionService from "./OverlaySession.ts";
import * as ThemeService from "./Theme.ts";
import * as TilingManagerService from "./TilingManager.ts";
import * as Ui from "./Command/Ui.ts";
import * as WindowsMessageLoopService from "./WindowsMessageLoop.ts";
import { Effect, Layer, ManagedRuntime, Option, Stream, pipe } from "effect";
import type { Event, IpcMainInvokeEvent } from "electron";
import { type Handle, Window } from "@sorrell/windows";
import { IsOverlayCommandId, type OverlayCommandId } from "../Shared/OverlayCommand.ts";
import { isAbsolute, join, relative } from "node:path";
import { AppApiChannel } from "../Shared/Api.ts";
import { NodeServices } from "@effect/platform-node";
import type { RendererTheme } from "../Shared/Theme.ts";
import electron from "electron";
import { pathToFileURL } from "node:url";
import { DevFeatures } from "./DevFeatures.ts";

const { app, ipcMain, nativeTheme, net, protocol, systemPreferences } = electron;
const RendererProtocolScheme: string = "sorrell";
const smokeLogPath: string | undefined = process.env.SORRELL_SMOKE_LOG;
const AppSettingsLive = pipe(
    AppSettingsService.AppSettings.layer,
    Layer.provide(NodeServices.layer)
);
const OverlaySessionLive = pipe(
    OverlaySessionService.Live,
    Layer.provideMerge(AppSettingsLive)
);
const AppSettingsSynchronizationLive = pipe(
    AppSettingsSynchronizationService.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsLive,
        BrowserWindowService.Live,
        OverlaySessionLive
    ))
);
const KeyboardLive = pipe(
    KeyboardService.Live,
    Layer.provideMerge(WindowsMessageLoopService.Live)
);
const HotkeyLive = Layer.unwrap(pipe(
    AppSettingsService.AppSettings,
    Effect.map((Settings: AppSettingsService.Service) =>
        HotkeyService.Live(pipe(
            Settings.changes,
            Stream.map((Current: AppSettingsService.AppSettings) =>
                HotkeyService.KeybindSetFromSettings(Current.Keybinds)
            )
        ))
    )
));
const NativeServicesLive = pipe(
    HotkeyLive,
    Layer.provideMerge(Layer.mergeAll(AppSettingsLive, KeyboardLive))
);
const CommandResolverLive = pipe(
    CommandResolverService.Live,
    Layer.provideMerge(Layer.mergeAll(NativeServicesLive, OverlaySessionLive))
);
const CommandServicesLive = pipe(
    CommandExecutorService.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsSynchronizationLive,
        CommandResolverLive
    ))
);
const ApplicationServicesLive = Layer.merge(
    CommandServicesLive,
    TilingManagerService.Live
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

const logSmokeStep = (message: string): void =>
{
    if (smokeLogPath !== undefined)
    {
        FileSystem.appendFileSync(smokeLogPath, `${ new Date().toISOString() } ${ message }\n`);
    }
};

logSmokeStep("main module loaded");

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
ipcMain.handle(AppApiChannel.ThemeGet, ThemeService.GetRendererTheme);

ipcMain.removeHandler(AppApiChannel.OverlayScreenGet);
ipcMain.handle(AppApiChannel.OverlayScreenGet, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Session = yield* OverlaySessionService.OverlaySession;
        return yield* Session.Snapshot;
    })
));

ipcMain.removeHandler(AppApiChannel.OverlayCommandInvoke);
ipcMain.handle(AppApiChannel.OverlayCommandInvoke, (
    _Event: IpcMainInvokeEvent,
    IdValue: unknown
) =>
{
    if (!IsOverlayCommandId(IdValue))
    {
        throw new TypeError("The requested overlay command is invalid.");
    }

    const Id: OverlayCommandId = IdValue;

    return ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const Executor = yield* CommandExecutorService.CommandExecutor;
        const Resolver = yield* CommandResolverService.CommandResolver;
        const Command = yield* Resolver.ResolveOverlayCommand(Id);

        if (Option.isNone(Command))
        {
            throw new TypeError("The requested command is not available on the current screen.");
        }

        yield* Executor.Execute(Command.value);
    }));
});

ipcMain.removeHandler(AppApiChannel.OverlayBack);
ipcMain.handle(AppApiChannel.OverlayBack, () => ApplicationRuntime.runPromise(
    Effect.gen(function*()
    {
        const Executor = yield* CommandExecutorService.CommandExecutor;
        yield* Executor.Execute(Ui.UiCommand().BackOverlayScreen());
    })
));

const PublishRendererTheme = (): void =>
{
    if (!IsApplicationRuntimeStarted || IsApplicationRuntimeDisposing)
    {
        return;
    }

    const CurrentTheme: RendererTheme = ThemeService.GetRendererTheme();

    void ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindowService.BrowserWindow;
        yield* Effect.all([
            BrowserWindows.Send(
                BrowserWindowService.Key.Main,
                AppApiChannel.ThemeChanged,
                CurrentTheme
            ).pipe(
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
            ),
            BrowserWindows.Send(
                BrowserWindowService.Key.Overlay,
                AppApiChannel.ThemeChanged,
                CurrentTheme
            ).pipe(
                Effect.catchTag("BrowserWindowNotFoundError", () => Effect.void)
            )
        ], { discard: true });
    })).catch((error: unknown): void =>
    {
        logSmokeStep(`could not publish the renderer theme: ${ String(error) }`);
    });
};

const StartApplication = Effect.gen(function*()
{
    yield* TilingManagerService.TilingManager;
    const BrowserWindows = yield* BrowserWindowService.BrowserWindow;
    const Settings = yield* AppSettingsService.AppSettings;
    const InitialSettings = yield* Settings.get;
    const CompleteKeybinds = HotkeyService.WithDefaultKeybindSettings(InitialSettings.Keybinds);

    if (CompleteKeybinds !== InitialSettings.Keybinds)
    {
        yield* Settings.setSetting("Keybinds", CompleteKeybinds);
    }

    yield* CommandExecutorService.CommandExecutor;
    yield* CommandResolverService.CommandResolver;
    yield* HotkeyService.Hotkey;
    yield* KeyboardService.Keyboard;
    yield* OverlaySessionService.OverlaySession;
    yield* WindowsMessageLoopService.WindowsMessageLoop;

    yield* Effect.sync(() =>
    {
        logSmokeStep("Electron ready");
        const foregroundWindow: Option.Option<Handle.HWND> = Window.GetForegroundWindow();

        logSmokeStep(foregroundWindow === null
            ? "native Win32 foreground window is unavailable"
            : `native Win32 foreground window is ${ foregroundWindow.toString() }`
        );
    });

    // const CurrentSettings = yield* Settings.get;
    const Specification = BrowserWindowService.GetMainWindowSpec();
    logSmokeStep(`loading renderer from ${ Specification.Url }`);
    yield* BrowserWindows.Ensure(Specification);
    yield* BrowserWindows.Ensure(yield* BrowserWindowService.OverlayWindowSpec);

    if ((yield* DevFeatures).StaticOverlay)
    {
        yield* BrowserWindows.Show("Overlay");
    }
    logSmokeStep("main window created");
});

logSmokeStep("waiting for Electron ready");
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
    catch (error: unknown)
    {
        logSmokeStep(`application startup failed: ${ String(error) }`);
        IsApplicationRuntimeDisposing = true;
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

    void ApplicationRuntime.dispose()
        .catch((error: unknown): void =>
        {
            logSmokeStep(`application shutdown failed: ${ String(error) }`);
        })
        .finally((): void =>
        {
            app.quit();
        });
});

app.on("activate", () =>
{
    void ApplicationRuntime.runPromise(Effect.gen(function*()
    {
        const BrowserWindows = yield* BrowserWindowService.BrowserWindow;
        yield* BrowserWindows.Ensure(BrowserWindowService.GetMainWindowSpec());
        yield* BrowserWindows.Show(BrowserWindowService.Key.Main);
        yield* BrowserWindows.Focus(BrowserWindowService.Key.Main);
    })).catch((error: unknown): void =>
    {
        logSmokeStep(`could not activate the main window: ${ String(error) }`);
    });
});

app.on("window-all-closed", () =>
{
    if (!IsApplicationRuntimeDisposing && process.platform !== "darwin")
    {
        app.quit();
    }
});
