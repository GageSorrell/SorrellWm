/**
 * Tests effectful Electron window creation, reuse, and lifecycle management.
 *
 * @module @sorrell/wm/Test/BrowserWindow
 *
 * @file      BrowserWindow.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    BrowserWindow,
    type Dependencies,
    GetBackdropWindowSpec,
    Key,
    MakeLive,
    type Spec
} from "../../Source/Main/BrowserWindow.ts";
import type {
    BrowserWindowConstructorOptions,
    BrowserWindow as ElectronBrowserWindow,
    HandlerDetails
} from "electron";
import { Effect, Fiber, Result, pipe } from "effect";
import { describe, expect, it } from "vitest";
import { EventEmitter } from "node:events";
import type { Thunk } from "@sorrell/effect/Function";

type OpenHandler = (Details: HandlerDetails) => { readonly action: "deny"; };

interface FakeWebContents
{
    readonly send: (Channel: string, Payload: unknown) => void;
    readonly setWindowOpenHandler: (Handler: OpenHandler) => void;
}

interface FakeWindowOptions
{
    readonly Load?: (Window: FakeWindow) => Promise<void>;
    readonly PreventClose?: boolean;
}

class FakeWindow extends EventEmitter
{
    static NextId: number = 1;

    FocusCount: number = 0;

    HideCount: number = 0;

    ShowCount: number = 0;

    ShowInactiveCount: number = 0;

    IgnoreMouseEvents: boolean = false;

    Visible: boolean = false;

    readonly id: number = FakeWindow.NextId++;

    readonly webContents: FakeWebContents = {
        send: (_Channel: string, _Payload: unknown): void => { },
        setWindowOpenHandler: (Handler: OpenHandler): void =>
        {
            this.OpenHandler = Handler;
        }
    };

    OpenHandler: OpenHandler | undefined;

    private Destroyed: boolean = false;

    constructor(readonly Options: FakeWindowOptions = { })
    {
        super();
    }

    close(): void
    {
        if (this.Options.PreventClose !== true)
        {
            this.destroy();
        }
    }

    destroy(): void
    {
        if (!this.Destroyed)
        {
            this.Destroyed = true;
            this.emit("closed");
        }
    }

    focus(): void
    {
        this.FocusCount += 1;
        this.emit("focus");
    }

    getNativeWindowHandle(): Buffer
    {
        const Handle = Buffer.alloc(8);
        Handle.writeBigUInt64LE(BigInt(this.id));
        return Handle;
    }

    hide(): void
    {
        this.HideCount += 1;
        this.Visible = false;
        this.emit("hide");
    }

    isDestroyed(): boolean
    {
        return this.Destroyed;
    }

    isVisible(): boolean
    {
        return this.Visible;
    }

    async loadURL(_Url: string): Promise<void>
    {
        if (this.Options.Load !== undefined)
        {
            await this.Options.Load(this);
        }
        else
        {
            this.emit("ready-to-show");
        }
    }

    show(): void
    {
        this.ShowCount += 1;
        this.Visible = true;
        this.emit("show");
    }

    showInactive(): void
    {
        this.ShowInactiveCount += 1;
        this.Visible = true;
        this.emit("show");
    }

    setIgnoreMouseEvents(Ignore: boolean): void
    {
        this.IgnoreMouseEvents = Ignore;
    }
}

const MainSpecification = (): Spec => ({
    Key: Key.Main,
    Options:
    {
        height: 800,
        show: true,
        webPreferences:
        {
            contextIsolation: false,
            nodeIntegration: true,
            sandbox: false
        },
        width: 1200
    },
    ShowWhenReady: true,
    Url: "sorrell://app/index.html"
});

const FakeDependencies = (
    Windows: Array<FakeWindow>,
    ConstructorOptions: Array<BrowserWindowConstructorOptions>,
    WindowOptions: FakeWindowOptions = { },
    ExternalUrls: Array<string> = [ ]
): Dependencies => ({
    Construct: (Options: BrowserWindowConstructorOptions): ElectronBrowserWindow =>
    {
        ConstructorOptions.push(Options);
        const Window = new FakeWindow(WindowOptions);
        Windows.push(Window);
        return Window as unknown as ElectronBrowserWindow;
    },
    OpenExternal: (Url: string): void =>
    {
        ExternalUrls.push(Url);
    }
});

describe("BrowserWindow", () =>
{
    it("constructs a transparent, input-transparent transient backdrop", async () =>
    {
        const Windows = new Array<FakeWindow>();
        const ConstructorOptions = new Array<BrowserWindowConstructorOptions>();

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Service = yield* BrowserWindow;

                const Handle = yield* Service.Open(GetBackdropWindowSpec());
                yield* Service.ShowInactive(Key.Backdrop);
                expect(yield* Service.GetNativeHandle(Handle.Key)).toBe(BigInt(Handle.ElectronWindowId));
            }),
            Effect.provide(MakeLive(FakeDependencies(Windows, ConstructorOptions)))
        ));

        expect(ConstructorOptions[0]).toMatchObject({
            alwaysOnTop: true,
            backgroundColor: "#00000000",
            backgroundMaterial: "none",
            focusable: false,
            frame: false,
            transparent: true
        });
        expect(Windows[0]?.IgnoreMouseEvents).toBe(true);
        expect(Windows[0]?.ShowInactiveCount).toBe(1);
    });

    it("opens a concurrent singleton once and destroys it with the service scope", async () =>
    {
        const Windows = new Array<FakeWindow>();
        const ConstructorOptions = new Array<BrowserWindowConstructorOptions>();
        const ExternalUrls = new Array<string>();
        let CompleteLoad: Thunk | undefined;
        const Load = (Window: FakeWindow): Promise<void> => new Promise((Resolve: Thunk) =>
        {
            CompleteLoad = (): void =>
            {
                Window.emit("ready-to-show");
                Resolve();
            };
        });
        const DependenciesValue = FakeDependencies(
            Windows,
            ConstructorOptions,
            { Load },
            ExternalUrls
        );

        const Handles = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Service = yield* BrowserWindow;
                const First = yield* pipe(
                    Service.Ensure(MainSpecification()),
                    Effect.forkChild({ startImmediately: true })
                );

                yield* Effect.yieldNow;

                const Second = yield* pipe(
                    Service.Ensure(MainSpecification()),
                    Effect.forkChild({ startImmediately: true })
                );

                yield* Effect.yieldNow;
                yield* Effect.sync(() => CompleteLoad?.());

                return yield* Effect.all([ Fiber.join(First), Fiber.join(Second) ]);
            }),
            Effect.provide(MakeLive(DependenciesValue))
        ));

        expect(Handles[0]).toEqual(Handles[1]);
        expect(Windows).toHaveLength(1);
        expect(Windows[0]?.ShowCount).toBe(1);
        expect(Windows[0]?.isDestroyed()).toBe(true);
        expect(Windows[0]?.listenerCount("closed")).toBe(0);
        expect(ConstructorOptions[0]?.show).toBe(false);
        expect(ConstructorOptions[0]?.webPreferences).toMatchObject({
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        });

        const HandlerResult = Windows[0]?.OpenHandler?.({
            disposition: "foreground-tab",
            features: "",
            frameName: "",
            referrer: { policy: "default", url: "" },
            url: "https://sorrell.sh"
        });

        expect(HandlerResult).toEqual({ action: "deny" });
        expect(ExternalUrls).toEqual([ "https://sorrell.sh" ]);
    });

    it("keeps a cancelled normal close registered but recreates after a forced close", async () =>
    {
        const Windows = new Array<FakeWindow>();
        const ConstructorOptions = new Array<BrowserWindowConstructorOptions>();

        const WindowIds = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Service = yield* BrowserWindow;
                const First = yield* Service.Ensure(MainSpecification());

                yield* Service.RequestClose(Key.Main);
                const StillOpen = yield* Service.Ensure(MainSpecification());
                yield* Service.ForceClose(Key.Main);
                yield* Effect.yieldNow;
                const Reopened = yield* Service.Ensure(MainSpecification());

                return [
                    First.ElectronWindowId,
                    StillOpen.ElectronWindowId,
                    Reopened.ElectronWindowId
                ] as const;
            }),
            Effect.provide(MakeLive(FakeDependencies(
                Windows,
                ConstructorOptions,
                { PreventClose: true }
            )))
        ));

        expect(WindowIds[0]).toBe(WindowIds[1]);
        expect(WindowIds[2]).not.toBe(WindowIds[0]);
        expect(Windows).toHaveLength(2);
    });

    it("fails readiness and destroys a window whose renderer cannot load", async () =>
    {
        const Windows = new Array<FakeWindow>();
        const ConstructorOptions = new Array<BrowserWindowConstructorOptions>();

        const OpenResult = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Service = yield* BrowserWindow;
                return yield* pipe(Service.Open(MainSpecification()), Effect.result);
            }),
            Effect.provide(MakeLive(FakeDependencies(
                Windows,
                ConstructorOptions,
                { Load: () => Promise.reject(new Error("Renderer load failed.")) }
            )))
        ));

        expect(Result.isFailure(OpenResult)).toBe(true);
        if (Result.isFailure(OpenResult))
        {
            expect(OpenResult.failure._tag).toBe("BrowserWindowLoadError");
        }
        expect(Windows[0]?.isDestroyed()).toBe(true);
    });
});
