/**
 * Tests command execution and supervision of the command stream.
 *
 * @module @sorrell/wm/Test/CommandExecutor
 *
 * @file      CommandExecutor.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "../../Source/Main/AppSettings/AppSettings.ts";
import * as BrowserWindow from "../../Source/Main/BrowserWindow.ts";
import * as CommandResolver from "../../Source/Main/Command/Resolver.ts";
import * as Hotkey from "../../Source/Main/Input/Hotkey.ts";
import * as OverlaySession from "../../Source/Main/Overlay/Session.ts";
import * as Tiling from "../../Source/Main/Tiling/index.ts";
import * as Ui from "../../Source/Main/Command/Ui.ts";
import * as Wm from "../../Source/Main/Command/Wm.ts";
import { Box, IntPoint, type Box as MathBox } from "@sorrell/math";
import {
    CommandExecutor,
    Live,
    UnsupportedCommandError
} from "../../Source/Main/Command/Executor.ts";
import { Deferred, Effect, Layer, Option, Queue, Result, Stream, pipe } from "effect";
import {
    type Handle,
    Screen as WindowsScreen,
    Window as WindowsWindow
} from "@sorrell/windows";
import {
    type OverlayScreenDto,
    OverlayScreenId,
    ResizeMode,
    type ResizeMode as ResizeModeType
} from "../../Source/Shared/OverlayCommand.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen as ElectronScreen } from "electron";
import type { Thunk } from "@sorrell/utility/Function";

vi.mock("electron", () =>
{
    const Electron = {
        BrowserWindow: class { },
        app: { isPackaged: true },
        screen: {
            getDisplayMatching: vi.fn(() => ({ scaleFactor: 1 })),
            screenToDipRect: (
                _Window: null,
                Rectangle: Electron.Rectangle
            ): Electron.Rectangle => Rectangle
        },
        shell: { openExternal: (): void => undefined }
    };

    return {
        ...Electron,
        default: Electron
    };
});

vi.mock("@sorrell/windows", async () =>
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
        Screen:
        {
            GetMonitors: vi.fn(() => EffectResult.succeed([ ]))
        },
        VK:
        {
            A: 0x41,
            CONTROL: 0x11,
            D1: 0x31,
            D2: 0x32,
            D3: 0x33,
            D4: 0x34,
            D5: 0x35,
            D6: 0x36,
            D7: 0x37,
            D8: 0x38,
            D9: 0x39,
            END: 0x23,
            F20: 0x83,
            H: 0x48,
            HOME: 0x24,
            J: 0x4A,
            K: 0x4B,
            L: 0x4C,
            LCONTROL: 0xA2,
            LMENU: 0xA4,
            LSHIFT: 0xA0,
            LWIN: 0x5B,
            MENU: 0x12,
            RCONTROL: 0xA3,
            RETURN: 0x0D,
            RMENU: 0xA5,
            RSHIFT: 0xA1,
            RWIN: 0x5C,
            SHIFT: 0x10,
            VK: [
                0x0D,
                0x23,
                0x24,
                0x31,
                0x32,
                0x33,
                0x34,
                0x35,
                0x36,
                0x37,
                0x38,
                0x39,
                0x41,
                0x48,
                0x4A,
                0x4B,
                0x4C,
                0x83
            ]
        },
        Window:
        {
            GetCursorPosition: vi.fn(() => EffectOption.none()),
            GetForegroundWindow: vi.fn(() => EffectOption.none()),
            GetManageableTopLevelWindows: vi.fn(() =>
                EffectResult.succeed([ ])),
            GetMovingWindow: vi.fn(() => EffectOption.none()),
            GetWindowRect: vi.fn(() => EffectOption.none()),
            SetForegroundWindow: vi.fn(() => EffectResult.succeed(undefined)),
            SetWindowRect: vi.fn(() => EffectResult.succeed(undefined)),
            SetWindowZOrderAfter: vi.fn(() => EffectResult.succeed(undefined))
        }
    };
});

const UiCommands = Ui.UiCommand();
const WmCommands = Wm.WmCommand();
const TileExistingWindows = vi.fn();

beforeEach(() =>
{
    vi.clearAllMocks();
    vi.mocked(WindowsWindow.GetCursorPosition).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(
        Result.succeed([ ])
    );
    vi.mocked(WindowsWindow.GetMovingWindow).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.none());
    vi.mocked(ElectronScreen.getDisplayMatching).mockReturnValue(
        { scaleFactor: 1 } as Electron.Display
    );
    vi.mocked(WindowsWindow.SetForegroundWindow).mockReturnValue(Result.succeed(undefined));
    vi.mocked(WindowsWindow.SetWindowZOrderAfter).mockReturnValue(Result.succeed(undefined));
    vi.mocked(WindowsScreen.GetMonitors).mockReturnValue(Result.succeed([ ]));
});

describe("CommandExecutor.Execute", () =>
{
    it("executes UI visibility commands and rejects unsupported commands", async () =>
    {
        const Operations = new Array<string>();
        const Unsupported = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;

                yield* Executor.Execute(UiCommands.Activate());
                yield* Executor.Execute(UiCommands.NavigateOverlayScreen({
                    ScreenId: OverlayScreenId.FloatingFocus
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
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:FloatingHome",
            "Send:Overlay:overlay-screen:changed:FloatingFocus",
            "Send:Overlay:overlay-screen:changed:FloatingHome",
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

    it("tiles all existing windows and re-centers the overlay over its activation window", async () =>
    {
        const ActivationWindow = 1n as Handle.HWND;
        const Operations = new Array<string>();
        const OverlayBounds = new Array<MathBox.Box>();

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.TileAll());
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(
                Operations,
                Effect.void,
                (Bounds: MathBox.Box) => OverlayBounds.push(Bounds)
            )),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(ActivationWindow)
            )),
            Effect.provide(FakeTilingManager([ ActivationWindow ])),
            Effect.provide(IdleResolver)
        ));

        expect(TileExistingWindows).toHaveBeenCalledOnce();
        expect(Operations).toEqual([
            "SetBounds:Overlay",
            "Send:Overlay:overlay-screen:changed:FloatingHome"
        ]);
        expect(OverlayBounds).toEqual([
            Box.Box(28, 1360, 1052, 560)
        ]);
    });

    it("previews a tiled Insert direction and moves the picker over the target half", async () =>
    {
        const Operations = new Array<string>();
        const PreviewBounds = Box.Box(0, 960, 540, 0);
        const PreviewInsert = vi.fn(() => Effect.succeed(PreviewBounds));
        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                const Session = yield* OverlaySession.OverlaySession;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ChooseInsertUp"
                }));

                return {
                    Current: yield* Session.Current,
                    Target: yield* Session.TiledInsertTarget
                };
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(1n as Handle.HWND),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledInsertDirection
            )),
            Effect.provide(FakeTilingManager(
                [ 1n as Handle.HWND ],
                { PreviewInsert }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(PreviewInsert).toHaveBeenCalledWith(
            1n,
            Tiling.Tree.FocusDirection.Up,
            { Threshold: 128, _tag: "Continue" }
        );
        expect(ResultValue.Current).toBe(OverlayScreenId.TiledInsertWindow);
        expect(ResultValue.Target).toEqual(Option.some({
            Bounds: PreviewBounds,
            Direction: Tiling.Tree.FocusDirection.Up,
            TargetWindow: 1n
        }));
        expect(Operations).toEqual([
            "SetBounds:Overlay",
            "Send:Overlay:overlay-screen:changed:TiledInsertWindow"
        ]);
    });

    it("tiles a floating window released inside the temporary Insert target", async () =>
    {
        const TiledWindow = 1n as Handle.HWND;
        const FloatingWindow = 2n as Handle.HWND;
        const Operations = new Array<string>();
        const Insert = vi.fn(() => Effect.void);
        vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(
            Result.succeed([ FloatingWindow ])
        );
        // Call-count-windowed rather than `mockReturnValueOnce`, since the tiled-window
        // drag detach poll loop also calls `GetMovingWindow` concurrently every tick and
        // would otherwise race this test's poller for a single one-shot return value.
        let MovingWindowCallCount = 0;
        vi.mocked(WindowsWindow.GetMovingWindow).mockImplementation(() =>
        {
            MovingWindowCallCount += 1;
            return MovingWindowCallCount <= 4
                ? Option.some(FloatingWindow)
                : Option.none();
        });
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(Box.Box(100, 500, 400, 100))
        );
        vi.mocked(WindowsWindow.GetCursorPosition).mockReturnValue(
            Option.some(IntPoint.IntPoint(400, 300))
        );

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ChooseInsertRight"
                }));
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "OpenInsertTarget"
                }));
                // Generous margin: the release transition needs at least two real poll
                // ticks, and a second concurrent poll loop (tiled-window drag detach)
                // now shares the same 50ms cadence and can slow ticks under CPU load.
                yield* Effect.sleep("500 millis");
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(
                Operations,
                Effect.void,
                () => undefined,
                true
            )),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(TiledWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledInsertDirection
            )),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                {
                    Insert,
                    PreviewInsert: () => Effect.succeed(
                        Box.Box(0, 960, 1080, 0)
                    )
                }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(Insert).toHaveBeenCalledWith(
            FloatingWindow,
            TiledWindow,
            Tiling.Tree.FocusDirection.Right,
            { Threshold: 128, _tag: "Continue" }
        );
        expect(Operations).toContain("ForceClose:InsertTarget");
        expect(WindowsWindow.SetForegroundWindow)
            .toHaveBeenCalledWith(FloatingWindow);
    });

    it("captures the next eligible window when the Insert target opens with Ctrl Tab", async () =>
    {
        const TiledWindow = 1n as Handle.HWND;
        const ExistingFloatingWindow = 2n as Handle.HWND;
        const NewWindow = 3n as Handle.HWND;
        const Insert = vi.fn(() => Effect.void);
        vi.mocked(WindowsWindow.GetManageableTopLevelWindows)
            .mockReturnValueOnce(Result.succeed([ ExistingFloatingWindow ]))
            .mockReturnValueOnce(Result.succeed([ ExistingFloatingWindow ]))
            .mockReturnValue(Result.succeed([
                ExistingFloatingWindow,
                NewWindow
            ]));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ChooseInsertDown"
                }));
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "OpenInsertTargetForNextWindow"
                }));
                yield* Effect.sleep("180 millis");
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(
                [ ],
                Effect.void,
                () => undefined,
                true
            )),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(TiledWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledInsertDirection
            )),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                {
                    Insert,
                    PreviewInsert: () => Effect.succeed(
                        Box.Box(540, 1920, 1080, 0)
                    )
                }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(Insert).toHaveBeenCalledWith(
            NewWindow,
            TiledWindow,
            Tiling.Tree.FocusDirection.Down,
            { Threshold: 128, _tag: "Continue" }
        );
    });

    it("opens the temporary Insert target window sized to the previewed placement, " +
        "even when the window key is being reused from a prior flow", async () =>
    {
        const TiledWindow = 1n as Handle.HWND;
        const PreviewBounds = Box.Box(100, 700, 500, 100);
        const SetBoundsCalls = new Array<{
            Bounds: MathBox.Box;
            Key: BrowserWindow.Key;
        }>();
        const ReusedService: BrowserWindow.BrowserWindowImpl = {
            // Simulates `Ensure` reusing an already-open window: it deliberately
            // ignores the requested spec's bounds, the way the real implementation
            // does when a window with this key is still registered as open.
            Ensure: (Specification: BrowserWindow.Spec) => Effect.succeed({
                ElectronWindowId: 1,
                Key: Specification.Key
            }),
            Events: Stream.empty,
            Focus: () => Effect.void,
            ForceClose: () => Effect.void,
            GetNativeHandle: () => Effect.succeed(99n as Handle.HWND),
            Hide: () => Effect.void,
            IsVisible: () => Effect.succeed(true),
            Open: (Specification: BrowserWindow.Spec) => Effect.succeed({
                ElectronWindowId: 1,
                Key: Specification.Key
            }),
            RequestClose: () => Effect.void,
            Send: () => Effect.void,
            SetBounds: (Key: BrowserWindow.Key, Bounds: MathBox.Box) => Effect.sync(() =>
            {
                SetBoundsCalls.push({ Bounds, Key });
            }),
            Show: () => Effect.void,
            ShowInactive: () => Effect.void
        };

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ChooseInsertRight"
                }));
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "OpenInsertTarget"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(Layer.succeed(BrowserWindow.BrowserWindow, ReusedService)),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(TiledWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledInsertDirection
            )),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                { PreviewInsert: () => Effect.succeed(PreviewBounds) }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(SetBoundsCalls).toContainEqual({
            Bounds: PreviewBounds,
            Key: BrowserWindow.Key.InsertTarget
        });
    });

    it("keeps the tiled window at its previewed size when the activation key is " +
        "released after the temporary Insert target opens", async () =>
    {
        const TiledWindow = 1n as Handle.HWND;
        const WorkArea = Box.Box(0, 1000, 600, 0);
        let CurrentBounds = WorkArea;
        const Applied = new Array<{ Bounds: MathBox.Box; Window: Handle.HWND; }>();
        const TilingManagerLive = Tiling.Manager.MakeLive({
            Enumerate: () => Result.succeed([ ]),
            GetWindowRect: () => Option.some(CurrentBounds),
            GetWindowWorkArea: () => Option.some(WorkArea),
            SetWindowRect: (WindowValue: Handle.HWND, Bounds: MathBox.Box) =>
            {
                Applied.push({ Bounds, Window: WindowValue });
                CurrentBounds = Bounds;
                return Result.succeed(undefined);
            }
        });

        const TargetAfterDeactivate = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                const Session = yield* OverlaySession.OverlaySession;
                const Manager = yield* Tiling.Manager.TilingManager;

                yield* Manager.Tile(TiledWindow);
                Applied.length = 0;

                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ChooseInsertRight"
                }));
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "OpenInsertTarget"
                }));
                yield* Executor.Execute(UiCommands.Deactivate());

                return yield* Session.TiledInsertTarget;
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow([ ], Effect.void, () => undefined, true)),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(TiledWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledInsertDirection
            )),
            Effect.provide(TilingManagerLive),
            Effect.provide(IdleResolver)
        ));

        expect(Applied.at(-1)).toEqual({
            Bounds: Box.Box(0, 500, 600, 0),
            Window: TiledWindow
        });
        expect(Option.isSome(TargetAfterDeactivate)).toBe(true);
    });

    it("still cancels a tiled Insert preview when deactivated before the " +
        "temporary target opens", async () =>
    {
        const TiledWindow = 1n as Handle.HWND;
        const Reconcile = vi.fn(() => Effect.void);

        const TargetAfterDeactivate = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                const Session = yield* OverlaySession.OverlaySession;

                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ChooseInsertRight"
                }));
                yield* Executor.Execute(UiCommands.Deactivate());

                return yield* Session.TiledInsertTarget;
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow([ ])),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(TiledWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledInsertDirection
            )),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                { Reconcile: Effect.suspend(Reconcile) }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(Reconcile).toHaveBeenCalledOnce();
        expect(Option.isNone(TargetAfterDeactivate)).toBe(true);
    });

    it("restores foreground focus without displaying a backdrop", async () =>
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
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings(73)),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:FloatingHome",
            "SetBounds:Overlay",
            "Show:Overlay",
            "Hide:Overlay",
            "SetForegroundWindow:42"
        ]);
        expect(WindowsWindow.SetForegroundWindow).toHaveBeenCalledWith(ForegroundWindow);
    });

    it(
        "restores a floating window's prior z-order once focus moves to a different window",
        async () =>
        {
            const WindowC = 3n as Handle.HWND;
            const WindowB = 2n as Handle.HWND;
            const WindowD = 4n as Handle.HWND;
            vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(
                Result.succeed([ WindowC, WindowB, WindowD ])
            );

            await Effect.runPromise(pipe(
                Effect.gen(function*()
                {
                    const Executor = yield* CommandExecutor;

                    yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                        Id: "FocusMoveRight"
                    }));
                    yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                        Id: "FocusMoveLeft"
                    }));
                }),
                Effect.provide(Live),
                Effect.provide(FakeHotkey()),
                Effect.provide(FakeAppSettings()),
                Effect.provide(FakeBrowserWindow([ ])),
                Effect.provide(FakeOverlaySession(
                    Option.none(),
                    Option.none(),
                    Option.none(),
                    Option.none(),
                    OverlayScreenId.FloatingHome,
                    () => undefined,
                    Option.none(),
                    () => undefined,
                    () => undefined,
                    [ Option.some(WindowB), Option.some(WindowD) ]
                )),
                Effect.provide(FakeTilingManager()),
                Effect.provide(IdleResolver)
            ));

            expect(WindowsWindow.SetForegroundWindow).toHaveBeenNthCalledWith(1, WindowB);
            expect(WindowsWindow.SetForegroundWindow).toHaveBeenNthCalledWith(2, WindowD);
            expect(WindowsWindow.SetWindowZOrderAfter).toHaveBeenCalledExactlyOnceWith(
                WindowB,
                WindowC
            );
        }
    );

    it(
        "does not restore z-order when Focus returns to the window already raised",
        async () =>
        {
            const WindowC = 3n as Handle.HWND;
            const WindowB = 2n as Handle.HWND;
            vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(
                Result.succeed([ WindowC, WindowB ])
            );

            await Effect.runPromise(pipe(
                Effect.gen(function*()
                {
                    const Executor = yield* CommandExecutor;

                    yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                        Id: "FocusMoveRight"
                    }));
                    yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                        Id: "FocusMoveLeft"
                    }));
                }),
                Effect.provide(Live),
                Effect.provide(FakeHotkey()),
                Effect.provide(FakeAppSettings()),
                Effect.provide(FakeBrowserWindow([ ])),
                Effect.provide(FakeOverlaySession(
                    Option.none(),
                    Option.none(),
                    Option.none(),
                    Option.none(),
                    OverlayScreenId.FloatingHome,
                    () => undefined,
                    Option.none(),
                    () => undefined,
                    () => undefined,
                    [ Option.some(WindowB), Option.some(WindowB) ]
                )),
                Effect.provide(FakeTilingManager()),
                Effect.provide(IdleResolver)
            ));

            expect(WindowsWindow.SetWindowZOrderAfter).not.toHaveBeenCalled();
        }
    );

    it(
        "restores a raised floating window's z-order when the overlay is deactivated",
        async () =>
        {
            const ForegroundWindow = 42n as Handle.HWND;
            const WindowC = 3n as Handle.HWND;
            const WindowB = 2n as Handle.HWND;
            vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(
                Option.some(ForegroundWindow)
            );
            vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.some(
                Box.Box(0, 1200, 800, 0)
            ));
            vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(
                Result.succeed([ WindowC, WindowB ])
            );

            await Effect.runPromise(pipe(
                Effect.gen(function*()
                {
                    const Executor = yield* CommandExecutor;

                    yield* Executor.Execute(UiCommands.Activate());
                    yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                        Id: "FocusMoveRight"
                    }));
                    yield* Executor.Execute(UiCommands.Deactivate());
                }),
                Effect.provide(Live),
                Effect.provide(FakeHotkey()),
                Effect.provide(FakeAppSettings(73)),
                Effect.provide(FakeBrowserWindow([ ])),
                Effect.provide(FakeOverlaySession(
                    Option.none(),
                    Option.none(),
                    Option.none(),
                    Option.none(),
                    OverlayScreenId.FloatingHome,
                    () => undefined,
                    Option.none(),
                    () => undefined,
                    () => undefined,
                    [ Option.some(WindowB) ]
                )),
                Effect.provide(FakeTilingManager()),
                Effect.provide(IdleResolver)
            ));

            expect(WindowsWindow.SetWindowZOrderAfter).toHaveBeenCalledExactlyOnceWith(
                WindowB,
                WindowC
            );
        }
    );

    it("ignores overlay activation while the foreground window is fullscreen", async () =>
    {
        const ForegroundWindow = 42n as Handle.HWND;
        const MonitorBounds = Box.Box(0, 1920, 1080, 0);
        const Operations = new Array<string>();
        vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(
            Option.some(ForegroundWindow)
        );
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(MonitorBounds)
        );
        vi.mocked(WindowsScreen.GetMonitors).mockReturnValue(Result.succeed([
            {
                DeviceName: "Primary",
                DisplayId: 1,
                Flags: 1,
                Handle: 1n as Handle.HMONITOR,
                IsPrimary: true,
                Monitor: MonitorBounds,
                WorkArea: Box.Box(0, 1920, 1040, 0)
            }
        ]));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.Activate());
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([ ]);
    });

    it("allows overlay activation in fullscreen when the setting is disabled", async () =>
    {
        const ForegroundWindow = 42n as Handle.HWND;
        const MonitorBounds = Box.Box(0, 1920, 1080, 0);
        const Operations = new Array<string>();
        vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(
            Option.some(ForegroundWindow)
        );
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(MonitorBounds)
        );
        vi.mocked(WindowsScreen.GetMonitors).mockReturnValue(Result.succeed([
            {
                DeviceName: "Primary",
                DisplayId: 1,
                Flags: 1,
                Handle: 1n as Handle.HMONITOR,
                IsPrimary: true,
                Monitor: MonitorBounds,
                WorkArea: Box.Box(0, 1920, 1040, 0)
            }
        ]));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.Activate());
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings(50, false)),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:FloatingHome",
            "SetBounds:Overlay",
            "Show:Overlay"
        ]);
    });

    it("focuses the directional target and repaints the still-open overlay over it", async () =>
    {
        const TargetWindow = 84n as Handle.HWND;
        const Operations = new Array<string>();
        vi.mocked(WindowsWindow.SetForegroundWindow).mockImplementation((
            WindowHandle: Handle.HWND
        ) =>
        {
            Operations.push(`SetForegroundWindow:${ WindowHandle }`);
            return Result.succeed(undefined);
        });
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.some(
            Box.Box(0, 1200, 800, 0)
        ));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "FocusMoveRight"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession(Option.some(TargetWindow))),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "SetForegroundWindow:84",
            "SetBounds:Overlay",
            "Send:Overlay:overlay-screen:changed:FloatingHome"
        ]);
    });

    it("selects a tiled panel without changing native window focus", async () =>
    {
        const Operations = new Array<string>();
        const OverlayBounds = new Array<MathBox.Box>();
        const Selected = new Array<OverlaySession.TiledFocusSelection>();
        const Panel = Tiling.Tree.Panel(
            Tiling.Tree.Orientation.Horizontal,
            [
                Tiling.Tree.Window({
                    InitialBounds: Box.Box(0, 100, 100, 0),
                    Window: 1n as Handle.HWND
                }),
                Tiling.Tree.Window({
                    InitialBounds: Box.Box(0, 200, 100, 100),
                    Window: 2n as Handle.HWND
                })
            ]
        );
        const Selection: OverlaySession.TiledFocusSelection = {
            Node: Panel,
            Path: [ ],
            WorkspaceId: "Fake"
        };

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "FocusMoveParent"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(
                Operations,
                Effect.void,
                (Bounds: MathBox.Box) => OverlayBounds.push(Bounds)
            )),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.none(),
                Option.some(Selection),
                Option.none(),
                OverlayScreenId.TiledFocus,
                (Value: OverlaySession.TiledFocusSelection) => Selected.push(Value)
            )),
            Effect.provide(FakeTilingManager([
                1n as Handle.HWND,
                2n as Handle.HWND
            ])),
            Effect.provide(IdleResolver)
        ));

        expect(Selected).toEqual([ Selection ]);
        expect(WindowsWindow.SetForegroundWindow).not.toHaveBeenCalled();
        expect(Operations).toEqual([
            "SetBounds:Overlay",
            "Send:Overlay:overlay-screen:changed:TiledFocus"
        ]);
        expect(OverlayBounds.map(Box.Tupled)).toEqual([
            [ 28, 1360, 1052, 560 ]
        ]);
    });

    it("moves a floating activation window by 20px and repaints the overlay over it", async () =>
    {
        const ActivationWindow = 84n as Handle.HWND;
        const Operations = new Array<string>();
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.some(
            Box.Box(0, 1200, 800, 0)
        ));
        vi.mocked(WindowsWindow.SetWindowRect).mockImplementation((
            WindowHandle: Handle.HWND,
            Bounds: MathBox.Box
        ) =>
        {
            Operations.push(
                `SetWindowRect:${ WindowHandle }:${ Bounds.Top },${ Bounds.Right },` +
                `${ Bounds.Bottom },${ Bounds.Left }`
            );
            return Result.succeed(undefined);
        });

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "MoveWindowRight"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession(Option.none(), Option.some(ActivationWindow))),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "SetWindowRect:84:0,1220,800,20",
            "SetBounds:Overlay",
            "Send:Overlay:overlay-screen:changed:FloatingHome"
        ]);
        // The overlay must be centered on the bounds we just moved the window to,
        // not on a second, racy `GetWindowRect` re-query (`SetWindowRect` posts the
        // move asynchronously, so a re-query can return stale pre-move bounds).
        expect(WindowsWindow.GetWindowRect).toHaveBeenCalledTimes(1);
    });

    it("moves a floating activation window by 50px while the primary modifier is held", async () =>
    {
        const ActivationWindow = 84n as Handle.HWND;
        const Operations = new Array<string>();
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.some(
            Box.Box(0, 1200, 800, 0)
        ));
        vi.mocked(WindowsWindow.SetWindowRect).mockImplementation((
            WindowHandle: Handle.HWND,
            Bounds: MathBox.Box
        ) =>
        {
            Operations.push(
                `SetWindowRect:${ WindowHandle }:${ Bounds.Top },${ Bounds.Right },` +
                `${ Bounds.Bottom },${ Bounds.Left }`
            );
            return Result.succeed(undefined);
        });

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.SetPrimaryModifierHeld({ Held: true }));
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "MoveWindowRight"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession(Option.none(), Option.some(ActivationWindow))),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:FloatingHome",
            "SetWindowRect:84:0,1250,800,50",
            "SetBounds:Overlay",
            "Send:Overlay:overlay-screen:changed:FloatingHome"
        ]);
    });

    it("does not move a tiled activation window", async () =>
    {
        const ActivationWindow = 84n as Handle.HWND;
        const Operations = new Array<string>();
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.some(
            Box.Box(0, 1200, 800, 0)
        ));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "MoveWindowRight"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession(Option.none(), Option.some(ActivationWindow))),
            Effect.provide(FakeTilingManager([ ActivationWindow ])),
            Effect.provide(IdleResolver)
        ));

        expect(Operations).toEqual([ ]);
        expect(WindowsWindow.SetWindowRect).not.toHaveBeenCalled();
    });

    it("resizes tiled windows with the active redistribution behavior", async () =>
    {
        const ActivationWindow = 84n as Handle.HWND;
        const Resize = vi.fn(() => Effect.void);

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ResizeWindowRight"
                }));
                yield* Executor.Execute(UiCommands.ToggleTiledResizeBehavior());
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "ResizeWindowLeft"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow([ ])),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(ActivationWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledResize
            )),
            Effect.provide(FakeTilingManager(
                [ ActivationWindow ],
                { Resize }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(Resize).toHaveBeenNthCalledWith(
            1,
            ActivationWindow,
            Tiling.Tree.FocusDirection.Right,
            20,
            "PreserveRatios",
            { Threshold: 128, _tag: "Continue" }
        );
        expect(Resize).toHaveBeenNthCalledWith(
            2,
            ActivationWindow,
            Tiling.Tree.FocusDirection.Left,
            20,
            "AdjacentOnly",
            { Threshold: 128, _tag: "Continue" }
        );
    });

    it("targets a sibling panel without moving or recentering the tiled window", async () =>
    {
        const ActivationWindow = 84n as Handle.HWND;
        const Operations = new Array<string>();
        const Selected = new Array<OverlaySession.TiledMovePanelTarget>();
        const Action: OverlaySession.TiledMovePanelTarget = {
            DirectionId: "MoveWindowRight",
            TargetPanelPath: [ 1 ],
            WorkspaceId: "Fake",
            _tag: "SelectPanel"
        };

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "MoveWindowRight"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(ActivationWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledMove,
                () => undefined,
                Option.some(Action),
                (Target: OverlaySession.TiledMovePanelTarget) => Selected.push(Target)
            )),
            Effect.provide(FakeTilingManager([
                ActivationWindow,
                85n as Handle.HWND
            ])),
            Effect.provide(IdleResolver)
        ));

        expect(Selected).toEqual([ Action ]);
        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:TiledMove"
        ]);
    });

    it("commits a tiled window into the targeted panel and recenters the overlay", async () =>
    {
        const ActivationWindow = 84n as Handle.HWND;
        const Operations = new Array<string>();
        const MoveIntoPanel = vi.fn(() => Effect.void);
        const ClearTarget = vi.fn();

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.NoOpOverlayCommand({
                    Id: "MoveWindowIntoPanel"
                }));
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession(
                Option.none(),
                Option.some(ActivationWindow),
                Option.none(),
                Option.none(),
                OverlayScreenId.TiledMove,
                () => undefined,
                Option.some({
                    TargetPanelPath: [ 1 ],
                    _tag: "MoveIntoPanel"
                }),
                () => undefined,
                ClearTarget
            )),
            Effect.provide(FakeTilingManager(
                [ ActivationWindow, 85n as Handle.HWND ],
                { MoveIntoPanel }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(MoveIntoPanel).toHaveBeenCalledWith(
            ActivationWindow,
            [ 1 ],
            { Threshold: 128, _tag: "Continue" }
        );
        expect(ClearTarget).toHaveBeenCalledOnce();
        expect(Operations).toEqual([
            "SetBounds:Overlay",
            "Send:Overlay:overlay-screen:changed:TiledMove"
        ]);
    });
});

describe("CommandExecutor.Live", () =>
{
    it("consumes resolved commands sequentially without an explicit Execute call", async () =>
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
                Effect.provide(FakeHotkey()),
                Effect.provide(FakeAppSettings()),
                Effect.provide(FakeBrowserWindow(
                    Operations,
                    Deferred.succeed(Hidden, undefined)
                )),
                Effect.provide(FakeOverlaySession()),
                Effect.provide(FakeTilingManager()),
                Effect.provide(ResolverLive)
            );
        }));

        expect(Completed).toEqual([
            "Send:Overlay:overlay-screen:changed:FloatingHome",
            "Hide:Overlay"
        ]);
    });

    it("keeps the visible overlay centered while its activation window is dragged", async () =>
    {
        const ActivationWindow = 42n as Handle.HWND;
        const InitialBounds = Box.Box(100, 1100, 700, 100);
        const MovedBounds = Box.Box(300, 1500, 900, 500);
        const ReleasedBounds = Box.Box(320, 1520, 920, 520);
        const OverlayBounds = new Array<MathBox.Box>();
        vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(
            Option.some(ActivationWindow)
        );
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(InitialBounds)
        );

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.Activate());

                vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
                    Option.some(MovedBounds)
                );
                vi.mocked(WindowsWindow.GetMovingWindow).mockReturnValue(
                    Option.some(ActivationWindow)
                );
                yield* Effect.sleep("120 millis");

                vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
                    Option.some(ReleasedBounds)
                );
                vi.mocked(WindowsWindow.GetMovingWindow).mockReturnValue(
                    Option.none()
                );
                yield* Effect.sleep("120 millis");
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(
                [ ],
                Effect.void,
                (Bounds: MathBox.Box) => OverlayBounds.push(Bounds),
                true
            )),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(OverlayBounds).toContainEqual(
            Box.Box(100, 1000, 700, 200)
        );
        expect(OverlayBounds.at(-1)).toEqual(
            Box.Box(320, 1420, 920, 620)
        );
    });
});

describe("CommandExecutor.Live tiled-window drag detach", () =>
{
    const TiledWindow = 1n as Handle.HWND;

    it("snaps a dragged tiled window back to its tiled bounds when released " +
        "under the detach-distance threshold", async () =>
    {
        const Reconcile = vi.fn(() => Effect.void);
        const Float = vi.fn(() => Effect.void);

        vi.mocked(WindowsWindow.GetMovingWindow)
            .mockReturnValueOnce(Option.some(TiledWindow))
            .mockReturnValue(Option.none());
        // Released 20px right and 20px down (distance ≈ 28.3), same size ⇒ a move, not a resize.
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(Box.Box(20, 1940, 1100, 20))
        );

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                yield* CommandExecutor;
                yield* Effect.sleep("500 millis");
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings(50, true, 128)),
            Effect.provide(FakeBrowserWindow([ ])),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                { Float, Reconcile: Effect.suspend(Reconcile) }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(Reconcile).toHaveBeenCalled();
        expect(Float).not.toHaveBeenCalled();
    });

    it("detaches a dragged tiled window into a floating window when released " +
        "at or beyond the detach-distance threshold", async () =>
    {
        const Reconcile = vi.fn(() => Effect.void);
        const Float = vi.fn(() => Effect.void);

        vi.mocked(WindowsWindow.GetMovingWindow)
            .mockReturnValueOnce(Option.some(TiledWindow))
            .mockReturnValue(Option.none());
        // Released exactly 128px right, same size ⇒ equal to the default threshold.
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(Box.Box(0, 2048, 1080, 128))
        );

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                yield* CommandExecutor;
                yield* Effect.sleep("500 millis");
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings(50, true, 128)),
            Effect.provide(FakeBrowserWindow([ ])),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                { Float, Reconcile: Effect.suspend(Reconcile) }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(Float).toHaveBeenCalledWith(TiledWindow);
        expect(Reconcile).not.toHaveBeenCalled();
    });

    it("scales the detach-distance threshold by the dragged window's display scale factor", async () =>
    {
        const Reconcile = vi.fn(() => Effect.void);
        const Float = vi.fn(() => Effect.void);

        vi.mocked(WindowsWindow.GetMovingWindow)
            .mockReturnValueOnce(Option.some(TiledWindow))
            .mockReturnValue(Option.none());
        // Released 150px right, same size: below the 200%-scaled 200px threshold, but
        // above the unscaled 100px setting value, so scaling must be what saves it.
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(Box.Box(0, 2070, 1080, 150))
        );
        vi.mocked(ElectronScreen.getDisplayMatching).mockReturnValue(
            { scaleFactor: 2 } as Electron.Display
        );

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                yield* CommandExecutor;
                yield* Effect.sleep("500 millis");
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings(50, true, 100)),
            Effect.provide(FakeBrowserWindow([ ])),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                { Float, Reconcile: Effect.suspend(Reconcile) }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(ElectronScreen.getDisplayMatching).toHaveBeenCalledWith({
            height: 1080,
            width: 1920,
            x: 150,
            y: 0
        });
        expect(Reconcile).toHaveBeenCalled();
        expect(Float).not.toHaveBeenCalled();
    });

    it("leaves a tiled window alone when it was resized rather than moved", async () =>
    {
        const Reconcile = vi.fn(() => Effect.void);
        const Float = vi.fn(() => Effect.void);

        vi.mocked(WindowsWindow.GetMovingWindow)
            .mockReturnValueOnce(Option.some(TiledWindow))
            .mockReturnValue(Option.none());
        // Same top-left, larger size ⇒ a resize, which this feature must not react to.
        vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(
            Option.some(Box.Box(0, 2200, 1200, 0))
        );

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                yield* CommandExecutor;
                yield* Effect.sleep("500 millis");
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings(50, true, 128)),
            Effect.provide(FakeBrowserWindow([ ])),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager(
                [ TiledWindow ],
                { Float, Reconcile: Effect.suspend(Reconcile) }
            )),
            Effect.provide(IdleResolver)
        ));

        expect(Reconcile).not.toHaveBeenCalled();
        expect(Float).not.toHaveBeenCalled();
    });
});

const IdleResolver = Layer.succeed(CommandResolver.CommandResolver, {
    Commands: Stream.never,
    Resolve: () => Effect.succeed(Option.none()),
    ResolveOverlayCommand: () => Effect.succeed(Option.none())
});

const FakeHotkey = (): Layer.Layer<Hotkey.Hotkey> => Layer.succeed(Hotkey.Hotkey, {
    Matches: Stream.never,
    SetOverlayActive: (): Effect.Effect<void> => Effect.void
});

const FakeTilingManager = (
    TiledWindows: ReadonlyArray<Handle.HWND> = [],
    Overrides: Partial<Tiling.Manager.TilingManagerImpl> = { }
): Layer.Layer<Tiling.Manager.TilingManager> =>
{
    const Root = TiledWindows.reduce<Tiling.Tree.Node | null>(
        (CurrentRoot: Tiling.Tree.Node | null, WindowValue: Handle.HWND) =>
            Tiling.Tree.InsertWindow(
                CurrentRoot,
                { InitialBounds: Box.Box(0, 100, 100, 0), Window: WindowValue },
                Tiling.Tree.Orientation.Horizontal
            ),
        null
    );
    const Snapshot: Tiling.Tree.State = {
        Workspaces: Root === null ? [ ] : [ { Bounds: Box.Box(0, 1920, 1080, 0), Id: "Fake", Root } ]
    };
    const Service: Tiling.Manager.TilingManagerImpl = {
        BringStackWindowToFront: () => Effect.void,
        Changes: Stream.empty,
        Float: () => Effect.void,
        Insert: () => Effect.void,
        Move: () => Effect.void,
        MoveIntoPanel: () => Effect.void,
        MoveToContainingPanel: () => Effect.void,
        MoveToIndex: () => Effect.void,
        PreviewInsert: () => Effect.succeed(Box.Box(0, 960, 1080, 0)),
        Reconcile: Effect.void,
        Refresh: Effect.void,
        Resize: () => Effect.void,
        SetPanelOrientation: () => Effect.void,
        SetPanelRatio: () => Effect.void,
        Snapshot: Effect.succeed(Snapshot),
        Tile: () => Effect.void,
        TileExistingWindows: Effect.sync(TileExistingWindows),
        ...Overrides,
        Gap: Overrides.Gap ?? Effect.succeed(0),
        SetGap: Overrides.SetGap ?? (() => Effect.void)
    };

    return Layer.succeed(Tiling.Manager.TilingManager, Service);
};

const FakeAppSettings = (
    OverlayBackdropIntensity: number = 50,
    IgnoreActivationKeybindInFullscreen: boolean = true,
    TiledWindowDetachDistance: number = 128
) =>
{
    const Current: AppSettings.AppSettings = {
        FocusPreviewOpacity: 75,
        IgnoreActivationKeybindInFullscreen,
        Keybinds: [ ],
        MoveFineSpeed: 16,
        MoveStepPrimary: 20,
        MoveStepPrimarySpeedFactor: 4,
        MoveStepSecondary: 50,
        MoveStepSecondarySpeedFactor: 4,
        OverlayBackdropIntensity,
        OverlayRoundedCorners: true,
        PerAppSettings: { },
        ResizeRecoveryStrategy:
        {
            Threshold: 128,
            _tag: "Continue"
        },
        RunAtStartup: true,
        ShowStackPanelMinimizeFlyout: true,
        ShowTitlebarFlyout: true,
        Theme: "System",
        TileExistingWindowsOnStartup: false,
        TiledResizeBehavior: "PreserveRatios",
        TiledWindowDetachDistance,
        TiledWindowGap: 8,
        UseSimplifiedTrayIcon: false
    };
    const Service: AppSettings.Service = {
        Changes: Stream.empty,
        Get: Effect.succeed(Current),
        GetSetting: <Key extends keyof AppSettings.AppSettings>(
            KeyValue: Key
        ): Effect.Effect<AppSettings.AppSettings[Key]> => Effect.succeed(Current[KeyValue]),
        Set: () => Effect.void,
        SetSetting: () => Effect.void,
        Update: () => Effect.void
    };

    return Layer.succeed(AppSettings.AppSettings, Service);
};

const FakeOverlaySession = (
    FocusTarget: Option.Option<Handle.HWND> = Option.none(),
    InitialActivationWindow: Option.Option<Handle.HWND> = Option.none(),
    TiledFocusTarget: Option.Option<OverlaySession.TiledFocusSelection> = Option.none(),
    TiledFocusCommit: Option.Option<OverlaySession.TiledFocusSelection> = Option.none(),
    InitialScreen: OverlayScreenId = OverlayScreenId.FloatingHome,
    OnSetTiledFocusSelection: (
        Selection: OverlaySession.TiledFocusSelection
    ) => void = () => undefined,
    TiledMoveAction: Option.Option<OverlaySession.TiledMoveAction> = Option.none(),
    OnSetTiledMovePanelTarget: (
        Target: OverlaySession.TiledMovePanelTarget
    ) => void = () => undefined,
    OnClearTiledMovePanelTarget: Thunk = () => undefined,
    // Successive Focus targets returned across repeated ResolveFocusTarget calls
    // (e.g. multiple direction picks in one Focus session). Falls back to
    // `FocusTarget` once exhausted, or when omitted entirely.
    ResolveFocusTargetSequence?: ReadonlyArray<Option.Option<Handle.HWND>>
) => Layer.suspend(() =>
{
    let Stack: ReadonlyArray<OverlayScreenId> = [ InitialScreen ];
    let ResolveFocusTargetCallCount = 0;
    let ActivationWindow = InitialActivationWindow;
    let RaisedFloatingWindowZOrder: Option.Option<
        OverlaySession.RaisedFloatingWindowZOrder
    > = Option.none();
    let PrimaryModifierHeld = false;
    let FineModifierHeld = false;
    let CurrentResizeMode: ResizeModeType = ResizeMode.Grow;
    let CurrentTiledResizeBehavior: "AdjacentOnly" | "PreserveRatios" =
        "PreserveRatios";
    let CurrentFocusFailure: Option.Option<OverlaySession.FocusFailure> = Option.none();
    let CurrentTiledInsertCaptureNext = false;
    let CurrentTiledInsertDragActive = false;
    let CurrentTiledInsertTarget =
        Option.none<OverlaySession.TiledInsertTarget>();
    const Current = (): OverlayScreenId => Stack.at(-1) ?? OverlayScreenId.FloatingHome;

    return Layer.succeed(OverlaySession.OverlaySession, {
        Back: Effect.sync((): void =>
        {
            Stack = Stack.length > 1 ? Stack.slice(0, -1) : Stack;
        }),
        Changes: Stream.empty,
        ClearActivationWindow: Effect.sync((): void =>
        {
            ActivationWindow = Option.none();
        }),
        ClearFocusPreview: Effect.void,
        ClearResizeRecoveryFailure: Effect.void,
        ClearTiledInsert: Effect.sync((): void =>
        {
            CurrentTiledInsertCaptureNext = false;
            CurrentTiledInsertDragActive = false;
            CurrentTiledInsertTarget = Option.none();
        }),
        ClearTiledMovePanelTarget: Effect.sync(OnClearTiledMovePanelTarget),
        Current: Effect.sync(Current),
        FineModifierHeld: Effect.sync(() => FineModifierHeld),
        FocusFailure: Effect.sync(() => CurrentFocusFailure),
        GetActivationApplicationExecutablePath: Effect.succeed(Option.none<string>()),
        GetActivationApplicationName: Effect.succeed(Option.none<string>()),
        GetActivationWindow: Effect.sync(() => ActivationWindow),
        MoveTiledInsertSelection: () => Effect.void,
        Navigate: (Screen: OverlayScreenId) => Effect.sync((): void =>
        {
            Stack = [ ...Stack, Screen ];
        }),
        PreviewFocusTarget: () => Effect.void,
        PrimaryModifierHeld: Effect.sync(() => PrimaryModifierHeld),
        RecordFocusFailure: (Failure: OverlaySession.FocusFailure) => Effect.sync((): void =>
        {
            CurrentFocusFailure = Option.some(Failure);
        }),
        RecordRaisedFloatingWindowZOrder: (
            Value: OverlaySession.RaisedFloatingWindowZOrder
        ) => Effect.sync((): void =>
        {
            RaisedFloatingWindowZOrder = Option.some(Value);
        }),
        RecordResizeRecoveryFailure: Effect.void,
        RefreshTiledInsertWindows: Effect.void,
        Reset: Effect.sync((): void =>
        {
            Stack = [ OverlayScreenId.FloatingHome ];
        }),
        ResizeMode: Effect.sync(() => CurrentResizeMode),
        ResolveFocusTarget: () => Effect.sync(() =>
        {
            if (ResolveFocusTargetSequence === undefined)
            {
                return FocusTarget;
            }

            const Index = Math.min(
                ResolveFocusTargetCallCount,
                ResolveFocusTargetSequence.length - 1
            );
            ResolveFocusTargetCallCount += 1;
            return ResolveFocusTargetSequence[Index] ?? FocusTarget;
        }),
        ResolveTiledFocusCommit: Effect.succeed(TiledFocusCommit),
        ResolveTiledFocusTarget: () => Effect.succeed(TiledFocusTarget),
        ResolveTiledMoveAction: () => Effect.succeed(TiledMoveAction),
        ResolveTiledStackWindow: () => Effect.succeed(Option.none()),
        SelectedTiledInsertWindow: Effect.succeed(Option.none()),
        SetActivationWindow: (WindowHandle: Handle.HWND) => Effect.sync((): void =>
        {
            ActivationWindow = Option.some(WindowHandle);
        }),
        SetFineModifierHeld: (Held: boolean) => Effect.sync((): void =>
        {
            FineModifierHeld = Held;
        }),
        SetPrimaryModifierHeld: (Held: boolean) => Effect.sync((): void =>
        {
            PrimaryModifierHeld = Held;
        }),
        SetResizeMode: (Mode: ResizeModeType) => Effect.sync((): void =>
        {
            CurrentResizeMode = Mode;
        }),
        SetTiledFocusSelection: (
            Selection: OverlaySession.TiledFocusSelection
        ) => Effect.sync(() => OnSetTiledFocusSelection(Selection)),
        SetTiledInsertCaptureNext: (Enabled: boolean) => Effect.sync((): void =>
        {
            CurrentTiledInsertCaptureNext = Enabled;
        }),
        SetTiledInsertDragActive: (Active: boolean) => Effect.sync((): void =>
        {
            CurrentTiledInsertDragActive = Active;
        }),
        SetTiledInsertTarget: (
            Target: OverlaySession.TiledInsertTarget
        ) => Effect.sync((): void =>
        {
            CurrentTiledInsertTarget = Option.some(Target);
        }),
        SetTiledMovePanelTarget: (
            Target: OverlaySession.TiledMovePanelTarget
        ) => Effect.sync(() => OnSetTiledMovePanelTarget(Target)),
        Snapshot: Effect.sync((): OverlayScreenDto => ({
            CanGoBack: Stack.length > 1,
            Commands: [ ],
            Id: Current()
        })),
        TakeActivationWindow: Effect.sync(() =>
        {
            const CurrentActivationWindow = ActivationWindow;
            ActivationWindow = Option.none();
            return CurrentActivationWindow;
        }),
        TakeRaisedFloatingWindowZOrder: Effect.sync(() =>
        {
            const Current = RaisedFloatingWindowZOrder;
            RaisedFloatingWindowZOrder = Option.none();
            return Current;
        }),
        TiledInsertCaptureNext: Effect.sync(() => CurrentTiledInsertCaptureNext),
        TiledInsertDragActive: Effect.sync(() => CurrentTiledInsertDragActive),
        TiledInsertTarget: Effect.sync(() => CurrentTiledInsertTarget),
        TiledResizeBehavior: Effect.sync(() => CurrentTiledResizeBehavior),
        ToggleTiledResizeBehavior: Effect.sync((): void =>
        {
            CurrentTiledResizeBehavior =
                CurrentTiledResizeBehavior === "PreserveRatios"
                    ? "AdjacentOnly"
                    : "PreserveRatios";
        })
    });
});

const FakeBrowserWindow = (
    Operations: Array<string>,
    OnHide: Effect.Effect<void> = Effect.void,
    OnSetBounds: (Bounds: MathBox.Box) => void = () => undefined,
    IsVisible: boolean = false
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
        GetNativeHandle: () => Effect.succeed(99n as Handle.HWND),
        Hide: (Key: BrowserWindow.Key) => pipe(Record(`Hide:${ Key }`), Effect.andThen(OnHide)),
        IsVisible: (_Key: BrowserWindow.Key) => Effect.succeed(IsVisible),
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
        SetBounds: (Key: BrowserWindow.Key, Bounds: MathBox.Box) => Effect.sync(() =>
        {
            Operations.push(`SetBounds:${ Key }`);
            OnSetBounds(Bounds);
        }),
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
