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

import * as FileSystem from "node:fs";
import type {
    BrowserWindow as BrowserWindowType,
    Event,
    HandlerDetails,
    RenderProcessGoneDetails
} from "electron";
import { Window, type Handle } from "@sorrell/windows";
import { isAbsolute, join, relative } from "node:path";

import { ApplicationIpcChannel } from "../Shared/Api.ts";
import electron from "electron";
import { pathToFileURL } from "node:url";
import type { Option } from "effect";

const { app, BrowserWindow, ipcMain, net, protocol, shell } = electron;
const isSmokeTest: boolean = process.argv.includes("--smoke-test");
const RendererProtocolScheme: string = "sorrell";
const smokeLogPath: string | undefined = process.env.SORRELL_SMOKE_LOG;

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

const smokeTimeout: NodeJS.Timeout | undefined = isSmokeTest
    ? setTimeout(() =>
    {
        logSmokeStep("smoke timeout reached");
        app.exit(1);
    }, 15_000)
    : undefined;

const finishSmokeTest = async (mainWindow: BrowserWindowType): Promise<void> =>
{
    let exitCode: number = 1;

    try
    {
        logSmokeStep("checking the renderer bridge");
        const response: unknown = await mainWindow.webContents.executeJavaScript(
            "window.sorrell.ping()",
            true
        );

        exitCode = response === "pong" ? 0 : 1;
        logSmokeStep(`renderer bridge returned ${ String(response) }`);
    }
    catch (error: unknown)
    {
        logSmokeStep(`renderer bridge failed: ${ String(error) }`);
        exitCode = 1;
    }
    finally
    {
        if (smokeTimeout !== undefined)
        {
            clearTimeout(smokeTimeout);
        }

        if (exitCode === 0)
        {
            logSmokeStep("smoke test passed");
        }

        app.exit(exitCode);
    }
};

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
    let rendererLoadError: string | undefined;

    logSmokeStep("main window created");

    mainWindow.webContents.on("did-fail-load", (
        _event: Event,
        errorCode: number,
        errorDescription: string
    ) =>
    {
        rendererLoadError = `${ errorCode }: ${ errorDescription }`;
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

    if (isSmokeTest)
    {
        mainWindow.webContents.once("did-finish-load", () =>
        {
            logSmokeStep("renderer finished loading");

            if (rendererLoadError !== undefined)
            {
                logSmokeStep(`renderer smoke check failed: ${ rendererLoadError }`);
                app.exit(1);

                return;
            }

            void finishSmokeTest(mainWindow);
        });
    }

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

logSmokeStep("waiting for Electron ready");
void app.whenReady().then((): void =>
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
