/**
 *
 *
 * @module @sorrell/wm/Test/CommandExecutor
 *
 * @file      CommandExecutor.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "../Source/Main/AppSettings.js";
import * as BrowserWindow from "../Source/Main/BrowserWindow.js";
import * as CommandResolver from "../Source/Main/CommandResolver.js";
import * as OverlaySession from "../Source/Main/OverlaySession.js";
import * as Ui from "../Source/Main/Command/Ui.js";
import * as Wm from "../Source/Main/Command/Wm.js";
import { Box, type Box as MathBox } from "@sorrell/math";
import {
    CommandExecutor,
    Live,
    UnsupportedCommandError
} from "../Source/Main/CommandExecutor.js";
import { Deferred, Effect, Layer, Option, Queue, Result, Stream, pipe } from "effect";
import { type Handle, Window as WindowsWindow } from "@sorrell/windows";
import { type OverlayScreenDto, OverlayScreenId } from "../Source/Shared/OverlayCommand.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sorrell/windows", async() =>
{
    const { Option: EffectOption, Result: EffectResult } = await import("effect");

    return {
        Keyboard:
        {
            Subscribe: (): void => undefined,
            Unsubscribe: (): void => undefined
        },
        MessageLoop:
        {
            Start: (): void => undefined,
            Stop: (): void => undefined
        },
        VK:
        {
            A: 0x41,
            CONTROL: 0x11,
            F20: 0x83,
            H: 0x48,
            J: 0x4A,
            K: 0x4B,
            L: 0x4C,
            LCONTROL: 0xA2,
            LMENU: 0xA4,
            LSHIFT: 0xA0,
            LWIN: 0x5B,
            MENU: 0x12,
            RCONTROL: 0xA3,
            RMENU: 0xA5,
            RSHIFT: 0xA1,
            RWIN: 0x5C,
            SHIFT: 0x10,
            VK: [ 0x41, 0x48, 0x4A, 0x4B, 0x4C, 0x83 ]
        },
        Window:
        {
            GetForegroundWindow: vi.fn(() => EffectOption.none()),
            GetWindowRect: vi.fn(() => EffectOption.none()),
            SetForegroundWindow: vi.fn(() => EffectResult.succeed(undefined))
        }
    };
});

const UiCommands = Ui.UiCommand();
const WmCommands = Wm.WmCommand();

beforeEach(() =>
{
    vi.clearAllMocks();
    vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.SetForegroundWindow).mockReturnValue(Result.succeed(undefined));
});

describe("CommandExecutor.Execute", () =>
{
    it("executes UI visibility commands and rejects unsupported commands", async() =>
    {
        const Operations = new Array<string>();
        const Unsupported = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;

                yield* Executor.Execute(UiCommands.Activate());
                yield* Executor.Execute(UiCommands.NavigateOverlayScreen({
                    ScreenId: OverlayScreenId.Focus
                }));
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({ Id: "FocusMoveLeft" }));
                yield* Executor.Execute(UiCommands.BackOverlayScreen());
                yield* Executor.Execute(UiCommands.Deactivate());

                return yield* pipe(
                    Executor.Execute(WmCommands.Isolate()),
                    Effect.result
                );
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:Home",
            "Send:Overlay:overlay-screen:changed:Focus",
            "Send:Overlay:overlay-screen:changed:Home",
            "Hide:Overlay"
        ]);
        expect(WindowsWindow.SetForegroundWindow).not.toHaveBeenCalled();
        expect(Result.isFailure(Unsupported)).toBe(true);
        if (Result.isFailure(Unsupported))
        {
            expect(Unsupported.failure).toBeInstanceOf(UnsupportedCommandError);
            if (Unsupported.failure._tag === "UnsupportedCommandError")
            {
                expect(Unsupported.failure.Command._tag).toBe("Isolate");
            }
        }
    });

    it("restores foreground focus without displaying a backdrop", async() =>
    {
        const ForegroundWindow = 42n as Handle.HWND;
        const Operations = new Array<string>();
        vi.mocked(WindowsWindow.SetForegroundWindow).mockImplementation((
            WindowHandle: Handle.HWND
        ) =>
        {
            Operations.push(`SetForegroundWindow:${ WindowHandle }`);
            return Result.succeed(undefined);
        });
        vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(Option.some(ForegroundWindow));
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.some(
            Box.Box(0, 1200, 800, 0)
        ));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;

                yield* Executor.Execute(UiCommands.Activate());
                yield* Executor.Execute(UiCommands.Deactivate());
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings(73)),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:Home",
            "SetBounds:Overlay",
            "Show:Overlay",
            "Hide:Overlay",
            "SetForegroundWindow:42"
        ]);
        expect(WindowsWindow.SetForegroundWindow).toHaveBeenCalledWith(ForegroundWindow);
    });
});

describe("CommandExecutor.Live", () =>
{
    it("consumes resolved commands sequentially without an explicit Execute call", async() =>
    {
        const Operations = new Array<string>();
        const Completed = await Effect.runPromise(Effect.gen(function*()
        {
            const Commands = yield* Queue.unbounded<CommandResolver.Resolved>();
            const Hidden = yield* Deferred.make<void>();
            const ResolverLive = Layer.succeed(CommandResolver.CommandResolver, {
                Commands: Stream.fromQueue(Commands),
                Resolve: () => Effect.succeed(Option.none()),
                ResolveOverlayCommand: () => Effect.succeed(Option.none())
            });

            return yield* pipe(
                Effect.gen(function*()
                {
                    yield* CommandExecutor;
                    yield* Queue.offer(Commands, UiCommands.Activate());
                    yield* Queue.offer(Commands, UiCommands.Deactivate());
                    yield* Deferred.await(Hidden);

                    return Operations;
                }),
                Effect.provide(Live),
                Effect.provide(FakeAppSettings()),
                Effect.provide(FakeBrowserWindow(
                    Operations,
                    Deferred.succeed(Hidden, undefined)
                )),
                Effect.provide(FakeOverlaySession),
                Effect.provide(ResolverLive)
            );
        }));

        expect(Completed).toEqual([
            "Send:Overlay:overlay-screen:changed:Home",
            "Hide:Overlay"
        ]);
    });
});

const IdleResolver = Layer.succeed(CommandResolver.CommandResolver, {
    Commands: Stream.never,
    Resolve: () => Effect.succeed(Option.none()),
    ResolveOverlayCommand: () => Effect.succeed(Option.none())
});

const FakeAppSettings = (
    OverlayBackdropIntensity: number = 50
) =>
{
    const Current: AppSettings.AppSettings = {
        Keybinds: [ ],
        OverlayBackdropIntensity,
        OverlayRoundedCorners: true,
        RunAtStartup: true,
        Theme: "System"
    };
    const Service: AppSettings.Service = {
        changes: Stream.empty,
        get: Effect.succeed(Current),
        getSetting: <Key extends keyof AppSettings.AppSettings>(
            KeyValue: Key
        ): Effect.Effect<AppSettings.AppSettings[Key]> => Effect.succeed(Current[KeyValue]),
        set: () => Effect.void,
        setSetting: () => Effect.void,
        update: () => Effect.void
    };

    return Layer.succeed(AppSettings.AppSettings, Service);
};

const FakeOverlaySession = Layer.suspend(() =>
{
    let Stack: ReadonlyArray<OverlayScreenId> = [ OverlayScreenId.Home ];
    const Current = (): OverlayScreenId => Stack.at(-1) ?? OverlayScreenId.Home;

    return Layer.succeed(OverlaySession.OverlaySession, {
        Back: Effect.sync((): void =>
        {
            Stack = Stack.length > 1 ? Stack.slice(0, -1) : Stack;
        }),
        Changes: Stream.empty,
        Current: Effect.sync(Current),
        Navigate: (Screen: OverlayScreenId) => Effect.sync((): void =>
        {
            Stack = [ ...Stack, Screen ];
        }),
        Reset: Effect.sync((): void =>
        {
            Stack = [ OverlayScreenId.Home ];
        }),
        Snapshot: Effect.sync((): OverlayScreenDto => ({
            CanGoBack: Stack.length > 1,
            Commands: [ ],
            Id: Current()
        }))
    });
});

const FakeBrowserWindow = (
    Operations: Array<string>,
    OnHide: Effect.Effect<void> = Effect.void
): Layer.Layer<BrowserWindow.BrowserWindow> =>
{
    const Record = (Operation: string): Effect.Effect<void> => Effect.sync(() =>
    {
        Operations.push(Operation);
    });
    const Service: BrowserWindow.BrowserWindowImpl = {
        Ensure: (Specification: BrowserWindow.Spec) => Effect.succeed({
            ElectronWindowId: 1,
            Key: Specification.Key
        }),
        Events: Stream.empty,
        Focus: (Key: BrowserWindow.Key) => Record(`Focus:${ Key }`),
        ForceClose: (Key: BrowserWindow.Key) => Record(`ForceClose:${ Key }`),
        Hide: (Key: BrowserWindow.Key) => pipe(Record(`Hide:${ Key }`), Effect.andThen(OnHide)),
        Open: (Specification: BrowserWindow.Spec) => pipe(
            Record(`Open:${ Specification.Key }`),
            Effect.as({
                ElectronWindowId: 1,
                Key: Specification.Key
            })
        ),
        RequestClose: (_Key: BrowserWindow.Key) => Effect.void,
        Send: (Key: BrowserWindow.Key, Channel: string, Payload: unknown) =>
            Record(`Send:${ Key }:${ Channel }:${ GetPayloadDescription(Payload) }`),
        SetBounds: (Key: BrowserWindow.Key, _Bounds: MathBox.Box) =>
            Record(`SetBounds:${ Key }`),
        Show: (Key: BrowserWindow.Key) => Record(`Show:${ Key }`),
        ShowInactive: (Key: BrowserWindow.Key) => Record(`ShowInactive:${ Key }`)
    };

    return Layer.succeed(BrowserWindow.BrowserWindow, Service);
};

const GetPayloadDescription = (Payload: unknown): string =>
{
    if (typeof Payload === "object" && Payload !== null && "Intensity" in Payload)
    {
        return String(Payload.Intensity);
    }

    if (typeof Payload === "object" && Payload !== null && "Id" in Payload)
    {
        return String(Payload.Id);
    }

    return String(Payload);
};
