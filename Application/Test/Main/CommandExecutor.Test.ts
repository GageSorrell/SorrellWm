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

import * as AppSettings from "../../Source/Main/AppSettings/AppSettings.ts";
import * as BrowserWindow from "../../Source/Main/BrowserWindow.ts";
import * as CommandResolver from "../../Source/Main/Command/Resolver.ts";
import * as Hotkey from "../../Source/Main/Input/Hotkey.ts";
import * as OverlaySession from "../../Source/Main/Overlay/Session.ts";
import * as Tiling from "../../Source/Main/Tiling/index.ts";
import * as Ui from "../../Source/Main/Command/Ui.ts";
import * as Wm from "../../Source/Main/Command/Wm.ts";
import { Box, type Box as MathBox } from "@sorrell/math";
import {
    CommandExecutor,
    Live,
    UnsupportedCommandError
} from "../../Source/Main/Command/Executor.ts";
import { Deferred, Effect, Layer, Option, Queue, Result, Stream, pipe } from "effect";
import { type Handle, Window as WindowsWindow } from "@sorrell/windows";
import {
    type OverlayScreenDto,
    OverlayScreenId,
    ResizeMode,
    type ResizeMode as ResizeModeType
} from "../../Source/Shared/OverlayCommand.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
            GetForegroundWindow: vi.fn(() => EffectOption.none()),
            GetWindowRect: vi.fn(() => EffectOption.none()),
            SetForegroundWindow: vi.fn(() => EffectResult.succeed(undefined)),
            SetWindowRect: vi.fn(() => EffectResult.succeed(undefined))
        }
    };
});

const UiCommands = Ui.UiCommand();
const WmCommands = Wm.WmCommand();
const TileExistingWindows = vi.fn();

beforeEach(() =>
{
    vi.clearAllMocks();
    vi.mocked(WindowsWindow.GetForegroundWindow).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.GetWindowRect).mockReturnValue(Option.none());
    vi.mocked(WindowsWindow.SetForegroundWindow).mockReturnValue(Result.succeed(undefined));
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

    it("tiles all existing windows and republishes the resulting Home screen", async () =>
    {
        const Operations = new Array<string>();

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Executor = yield* CommandExecutor;
                yield* Executor.Execute(UiCommands.TileAll());
            }),
            Effect.provide(Live),
            Effect.provide(FakeHotkey()),
            Effect.provide(FakeAppSettings()),
            Effect.provide(FakeBrowserWindow(Operations)),
            Effect.provide(FakeOverlaySession()),
            Effect.provide(FakeTilingManager()),
            Effect.provide(IdleResolver)
        ));

        expect(TileExistingWindows).toHaveBeenCalledOnce();
        expect(Operations).toEqual([
            "Send:Overlay:overlay-screen:changed:FloatingHome"
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
            Tiling.Tree.FocusDirection.Up
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
            "PreserveRatios"
        );
        expect(Resize).toHaveBeenNthCalledWith(
            2,
            ActivationWindow,
            Tiling.Tree.FocusDirection.Left,
            20,
            "AdjacentOnly"
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

        expect(MoveIntoPanel).toHaveBeenCalledWith(ActivationWindow, [ 1 ]);
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
    OverlayBackdropIntensity: number = 50
) =>
{
    const Current: AppSettings.AppSettings = {
        FocusPreviewOpacity: 75,
        Keybinds: [ ],
        MoveFineSpeed: 16,
        MoveStepPrimary: 20,
        MoveStepPrimarySpeedFactor: 4,
        MoveStepSecondary: 50,
        MoveStepSecondarySpeedFactor: 4,
        OverlayBackdropIntensity,
        OverlayRoundedCorners: true,
        PerAppSettings: { },
        RunAtStartup: true,
        ShowTitlebarFlyout: true,
        Theme: "System",
        TileExistingWindowsOnStartup: false,
        TiledResizeBehavior: "PreserveRatios",
        TiledWindowGap: 8
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
    OnClearTiledMovePanelTarget: () => void = () => undefined
) => Layer.suspend(() =>
{
    let Stack: ReadonlyArray<OverlayScreenId> = [ InitialScreen ];
    let ActivationWindow = InitialActivationWindow;
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
        RefreshTiledInsertWindows: Effect.void,
        Reset: Effect.sync((): void =>
        {
            Stack = [ OverlayScreenId.FloatingHome ];
        }),
        ResizeMode: Effect.sync(() => CurrentResizeMode),
        ResolveFocusTarget: () => Effect.succeed(FocusTarget),
        ResolveTiledFocusCommit: Effect.succeed(TiledFocusCommit),
        ResolveTiledFocusTarget: () => Effect.succeed(TiledFocusTarget),
        ResolveTiledMoveAction: () => Effect.succeed(TiledMoveAction),
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
    OnSetBounds: (Bounds: MathBox.Box) => void = () => undefined
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
        IsVisible: (_Key: BrowserWindow.Key) => Effect.succeed(false),
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
