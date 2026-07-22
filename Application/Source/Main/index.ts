/**
 *
 *
 * @module @sorrell/wm/Main/Index
 *
 * @file      Index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export * as Accelerator from "./Accelerator.ts";
export * as Command from "./Command.ts";
export * as Hotkey from "./Hotkey.ts";
export * as Keyboard from "./Keyboard.ts";
export * as WindowsMessageLoop from "./WindowsMessageLoop.ts";
export * as Theme from "./Theme.ts";
export * as AppSettings from "./AppSettings.ts";

import * as FileSystem from "node:fs";
import * as HotkeyService from "./Hotkey.ts";
import * as KeyboardService from "./Keyboard.ts";
import * as WindowsMessageLoopService from "./WindowsMessageLoop.ts";
import type {
    BrowserWindow as BrowserWindowType,
    Event,
    HandlerDetails,
    RenderProcessGoneDetails
} from "electron";
import { Effect, Layer, ManagedRuntime, type Option } from "effect";
import { type Handle, Window } from "@sorrell/windows";
import { isAbsolute, join, relative } from "node:path";

import { ApplicationIpcChannel } from "../Shared/Api.ts";
import electron from "electron";
import { pathToFileURL } from "node:url";

const { app, BrowserWindow, ipcMain, net, protocol, shell } = electron;
const isSmokeTest: boolean = process.argv.includes("--smoke-test");
const RendererProtocolScheme: string = "sorrell";
const smokeLogPath: string | undefined = process.env.SORRELL_SMOKE_LOG;
const KeyboardLive = KeyboardService.Live.pipe(
    Layer.provideMerge(WindowsMessageLoopService.Live)
);
const NativeServicesLive = HotkeyService.Live(HotkeyService.DefaultKeybinds).pipe(
    Layer.provideMerge(KeyboardLive)
);
const ApplicationRuntime = ManagedRuntime.make(NativeServicesLive);
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

// const smokeTimeout: NodeJS.Timeout | undefined = isSmokeTest
//     ? setTimeout(() =>
//     {
//         logSmokeStep("smoke timeout reached");
//         app.exit(1);
//     }, 15_000)
//     : undefined;

// const finishSmokeTest = async (mainWindow: BrowserWindowType): Promise<void> =>
// {
//     let exitCode: number = 1;

//     try
//     {
//         logSmokeStep("checking the renderer bridge");
//         const response: unknown = await mainWindow.webContents.executeJavaScript(
//             "window.sorrell.ping()",
//             true
//         );

//         exitCode = response === "pong" ? 0 : 1;
//         logSmokeStep(`renderer bridge returned ${ String(response) }`);
//     }
//     catch (error: unknown)
//     {
//         logSmokeStep(`renderer bridge failed: ${ String(error) }`);
//         exitCode = 1;
//     }
//     finally
//     {
//         if (smokeTimeout !== undefined)
//         {
//             clearTimeout(smokeTimeout);
//         }

//         if (exitCode === 0)
//         {
//             logSmokeStep("smoke test passed");
//         }

//         app.exit(exitCode);
//     }
// };

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

const createMainWindow = (): BrowserWindowType =>
{
    logSmokeStep("creating the main window");
    const mainWindow: BrowserWindowType = new BrowserWindow({
        height: 800,
        minHeight: 480,
        minWidth: 640,
        show: false,
        title: "SorrellWm",
        webPreferences:
        {
            contextIsolation: true,
            nodeIntegration: false,
            preload: join(import.meta.dirname, "../Preload/index.cjs"),
            sandbox: true
        },
        width: 1200
    });

    // let rendererLoadError: string | undefined;

    logSmokeStep("main window created");

    mainWindow.webContents.on("did-fail-load", (
        _event: Event,
        errorCode: number,
        errorDescription: string
    ) =>
    {
        // rendererLoadError = `${ errorCode }: ${ errorDescription }`;
        logSmokeStep(`renderer load failed (${ errorCode }): ${ errorDescription }`);
    });

    mainWindow.webContents.on("preload-error", (
        _event: Event,
        preloadPath: string,
        error: Error
    ) =>
    {
        logSmokeStep(`preload failed (${ preloadPath }): ${ String(error) }`);
    });

    mainWindow.webContents.on("render-process-gone", (
        _event: Event,
        details: RenderProcessGoneDetails
    ) =>
    {
        logSmokeStep(`renderer process ended: ${ details.reason }`);
    });

    mainWindow.once("ready-to-show", () =>
    {
        if (!isSmokeTest)
        {
            mainWindow.show();
        }
    });

    // if (isSmokeTest)
    // {
    //     mainWindow.webContents.once("did-finish-load", () =>
    //     {
    //         logSmokeStep("renderer finished loading");

    //         if (rendererLoadError !== undefined)
    //         {
    //             logSmokeStep(`renderer smoke check failed: ${ rendererLoadError }`);
    //             app.exit(1);

    //             return;
    //         }

    //         void finishSmokeTest(mainWindow);
    //     });
    // }

    mainWindow.webContents.setWindowOpenHandler(({ url }: HandlerDetails) =>
    {
        if (url.startsWith("https://"))
        {
            void shell.openExternal(url);
        }

        return { action: "deny" };
    });

    const rendererUrl: string | undefined = process.env.ELECTRON_RENDERER_URL;

    if (!app.isPackaged && rendererUrl !== undefined)
    {
        void mainWindow.loadURL(rendererUrl);
    }
    else
    {
        const rendererUrl: string = `${ RendererProtocolScheme }://app/index.html`;

        logSmokeStep(`loading renderer from ${ rendererUrl }`);
        void mainWindow.loadURL(rendererUrl);
    }

    return mainWindow;
};

ipcMain.handle(ApplicationIpcChannel.Ping, () => "pong");

const StartApplication = Effect.gen(function*()
{
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
        registerRendererProtocol();
        createMainWindow();
    });
});

logSmokeStep("waiting for Electron ready");
void app.whenReady().then(async (): Promise<void> =>
{
    IsApplicationRuntimeStarted = true;

    try
    {
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
    if (BrowserWindow.getAllWindows().length === 0)
    {
        createMainWindow();
    }
});

app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});
