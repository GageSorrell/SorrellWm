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
export * as WindowsMessageLoop from "./WindowsMessageLoop.ts";
export * as Theme from "./Theme.ts";
export * as AppSettings from "./AppSettings.ts";
export * as AppSettingsSynchronization from "./AppSettingsSynchronization.ts";
export * as Utility from "./Utility/index.ts";

import * as AppSettingsService from "./AppSettings.ts";
import * as AppSettingsSynchronizationService from "./AppSettingsSynchronization.ts";
import * as BrowserWindowService from "./BrowserWindow.ts";
import * as CommandExecutorService from "./CommandExecutor.ts";
import * as CommandResolverService from "./CommandResolver.ts";
import * as FileSystem from "node:fs";
import * as HotkeyService from "./Hotkey.ts";
import * as KeyboardService from "./Keyboard.ts";
import * as WindowsMessageLoopService from "./WindowsMessageLoop.ts";
import { Effect, Layer, ManagedRuntime, type Option, Stream, pipe } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import { isAbsolute, join, relative } from "node:path";

import { ApplicationIpcChannel } from "../Shared/Api.ts";
import type { Event } from "electron";
import { NodeServices } from "@effect/platform-node";
import electron from "electron";
import { pathToFileURL } from "node:url";

const { app, ipcMain, net, protocol } = electron;
const RendererProtocolScheme: string = "sorrell";
const smokeLogPath: string | undefined = process.env.SORRELL_SMOKE_LOG;
const AppSettingsLive = pipe(
    AppSettingsService.AppSettings.layer,
    Layer.provide(NodeServices.layer)
);
const AppSettingsSynchronizationLive = pipe(
    AppSettingsSynchronizationService.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsLive,
        BrowserWindowService.Live
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
    Layer.provideMerge(NativeServicesLive)
);
const CommandServicesLive = pipe(
    CommandExecutorService.Live,
    Layer.provideMerge(Layer.mergeAll(
        AppSettingsSynchronizationLive,
        CommandResolverLive
    ))
);
const ApplicationServicesLive = CommandServicesLive;
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

ipcMain.handle(ApplicationIpcChannel.Ping, () => "pong");

const StartApplication = Effect.gen(function*()
{
    const BrowserWindows = yield* BrowserWindowService.BrowserWindow;
    const Settings = yield* AppSettingsService.AppSettings;
    yield* CommandExecutorService.CommandExecutor;
    yield* CommandResolverService.CommandResolver;
    yield* HotkeyService.Hotkey;
    yield* KeyboardService.Keyboard;
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

    const CurrentSettings = yield* Settings.get;
    const Specification = BrowserWindowService.GetMainWindowSpec();
    logSmokeStep(`loading renderer from ${ Specification.Url }`);
    yield* BrowserWindows.Ensure(Specification);
    yield* BrowserWindows.Ensure(BrowserWindowService.GetOverlayWindowSpec(
        CurrentSettings.OverlayRoundedCorners
    ));
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
