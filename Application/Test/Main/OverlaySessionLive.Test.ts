/**
 * Tests the live overlay session with native window and monitor state.
 *
 * @module @sorrell/wm/Test/OverlaySessionLive
 *
 * @file      OverlaySessionLive.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "../../Source/Main/AppSettings/AppSettings.ts";
import * as BrowserWindow from "../../Source/Main/BrowserWindow.ts";
import * as Tiling from "../../Source/Main/Tiling/index.ts";
import { Effect, Layer, Option, Result, Stream, pipe } from "effect";
import {
    type Handle,
    Screen as WindowsScreen,
    Window as WindowsWindow
} from "@sorrell/windows";
import {
    IsOverlayScreenDto,
    type OverlayCommandDto,
    OverlayScreenId,
    type OverlayStackWindowDto
} from "../../Source/Shared/OverlayCommand.ts";
import {
    Live,
    OverlaySession
} from "../../Source/Main/Overlay/Session.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Box } from "@sorrell/math";

vi.mock("@sorrell/windows", async () =>
{
    const EffectModule = await import("effect");

    return {
        Keyboard: {
            Subscribe: (): void => undefined,
            Unsubscribe: (): void => undefined
        },
        MessageLoop: {
            Start: (): void => undefined,
            Stop: (): void => undefined
        },
        Screen: {
            GetMonitors: vi.fn(() => EffectModule.Result.succeed([ ]))
        },
        Theme: {
            GetAccentColor: vi.fn(() => EffectModule.Option.some("#336699"))
        },
        VK: {
            CONTROL: 0x11,
            D: 0x44,
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
            MENU: 0x12,
            N: 0x4E,
            RETURN: 0x0D,
            SHIFT: 0x10,
            T: 0x54,
            TAB: 0x09,
            VK: [
                0x09,
                0x0D,
                0x10,
                0x11,
                0x12,
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
                0x44,
                0x48,
                0x4E,
                0x54,
                0x83
            ]
        },
        Window: {
            ClearWindowDimming: vi.fn(() => EffectModule.Result.succeed(undefined)),
            DimWindowsExcept: vi.fn(() => EffectModule.Result.succeed(undefined)),
            GetApplicationName: vi.fn(() => EffectModule.Option.none()),
            GetIcon: vi.fn(() => EffectModule.Option.none()),
            GetManageableTopLevelWindows: vi.fn(() =>
                EffectModule.Result.succeed([ ])),
            GetWindowRect: vi.fn(() => EffectModule.Option.none()),
            GetWindowText: vi.fn(() => EffectModule.Option.none()),
            IsWindowObscured: vi.fn(() => EffectModule.Result.succeed(false))
        }
    };
});

const CurrentWindow = 1n as Handle.HWND;
const LeftWindow = 2n as Handle.HWND;
const RightWindow = 3n as Handle.HWND;
const OtherWindow = 4n as Handle.HWND;
const MonitorRightWindowA = 5n as Handle.HWND;
const MonitorRightWindowB = 6n as Handle.HWND;
const OverlayWindow = 99n as Handle.HWND;
const EnsureBrowserWindow = vi.fn((Specification: BrowserWindow.Spec) => Effect.succeed({
    ElectronWindowId: 1,
    Key: Specification.Key
}));
const ForceCloseBrowserWindow = vi.fn(() => Effect.void);
const SendToBrowserWindow = vi.fn(() => Effect.void);
const SetBrowserWindowBounds = vi.fn(() => Effect.void);
const ShowBrowserWindowInactive = vi.fn(() => Effect.void);
let TilingSnapshot: Tiling.Tree.State = { Workspaces: [ ] };
let MonitorSnapshot: ReadonlyArray<WindowsScreen.MonitorInfo> = [ ];

beforeEach(() =>
{
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.mocked(WindowsWindow.GetManageableTopLevelWindows).mockReturnValue(
        Result.succeed([ CurrentWindow, LeftWindow, RightWindow ])
    );
    vi.mocked(WindowsWindow.GetWindowRect).mockImplementation((
        Window: Handle.HWND
    ) =>
    {
        switch (Window)
        {
            case CurrentWindow:
                return Option.some(Box.Box(100, 200, 200, 100));
            case LeftWindow:
                return Option.some(Box.Box(100, 0, 200, -100));
            case RightWindow:
                return Option.some(Box.Box(100, 400, 200, 300));
            default:
                return Option.none();
        }
    });
    vi.mocked(WindowsWindow.GetWindowText).mockImplementation((
        Window: Handle.HWND
    ) => Option.some(Window === LeftWindow ? "Left App" : "Right App"));
    vi.mocked(WindowsWindow.GetApplicationName).mockReturnValue(
        Option.some("Visual Studio Code")
    );
    vi.mocked(WindowsWindow.GetIcon).mockImplementation((
        Window: Handle.HWND
    ) => Window === RightWindow ? Option.some("right-icon") : Option.none());
    vi.mocked(WindowsWindow.ClearWindowDimming).mockReturnValue(
        Result.succeed(undefined)
    );
    vi.mocked(WindowsWindow.DimWindowsExcept).mockReturnValue(
        Result.succeed(undefined)
    );
    vi.mocked(WindowsWindow.IsWindowObscured).mockReturnValue(
        Result.succeed(false)
    );
    MonitorSnapshot = [ ];
    vi.mocked(WindowsScreen.GetMonitors).mockImplementation(
        () => Result.succeed(MonitorSnapshot)
    );
    TilingSnapshot = { Workspaces: [ ] };
    vi.spyOn(BrowserWindow, "GetFocusPreviewWindowSpec").mockImplementation((
        Key: BrowserWindow.Key,
        Bounds: Box.Box
    ) => ({
        IgnoreMouseEvents: true,
        Key,
        Options: {
            height: Bounds.Bottom - Bounds.Top,
            width: Bounds.Right - Bounds.Left
        },
        Url: `sorrell://app/index.html?window=${ Key }`
    }));
});

describe("OverlaySession.Live Focus targets", () =>
{
    it("publishes the activation application's secondary command on Home", async () =>
    {
        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.SecondaryCommand).toMatchObject({
            ApplicationName: "Visual Studio Code",
            Id: "OpenPerAppSettings"
        });
        expect(Snapshot.SecondaryCommand).not.toHaveProperty("Target");
        expect(WindowsWindow.GetApplicationName).toHaveBeenCalledWith(CurrentWindow);
    });

    it("omits the application name when it is unavailable", async () =>
    {
        vi.mocked(WindowsWindow.GetApplicationName).mockReturnValue(Option.none());

        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.SecondaryCommand).not.toHaveProperty("ApplicationName");
    });

    it("shows Tile All on floating Home only while every tiled root is empty", async () =>
    {
        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                const Empty = yield* Session.Snapshot;

                TilingSnapshot = {
                    Workspaces: [
                        {
                            Bounds: Box.Box(0, 1920, 1080, 0),
                            Id: "primary",
                            Root: Tiling.Tree.Window({
                                InitialBounds: Box.Box(0, 1920, 1080, 0),
                                Window: OtherWindow
                            })
                        }
                    ]
                };
                const Occupied = yield* Session.Snapshot;
                return { Empty, Occupied };
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(ResultValue.Empty.Commands.at(-1)).toMatchObject({
            HotkeyId: "Commit",
            Id: "TileAll",
            Shortcut: { KeyLabel: "RETURN" }
        });
        expect(ResultValue.Occupied.Commands.some((Command: OverlayCommandDto) =>
            Command.Id === "TileAll")).toBe(false);
    });

    it("selects the tiled Home catalog for a managed activation window", async () =>
    {
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: Box.Box(0, 1920, 1080, 0),
                    Id: Tiling.Tree.WorkspaceId(
                        Box.Box(0, 1920, 1080, 0)
                    ),
                    Root: Tiling.Tree.Window({
                        InitialBounds: Box.Box(100, 200, 200, 100),
                        Window: CurrentWindow
                    })
                }
            ]
        };

        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.Id).toBe(OverlayScreenId.TiledHome);
        expect(Snapshot.Commands.map((Command: OverlayCommandDto) => Command.Id)).toEqual([
            "Focus",
            "Insert",
            "Move",
            "Resize",
            "Float"
        ]);
        expect(Snapshot.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "Resize")).toMatchObject({ Disabled: true });
    });

    it("keeps tiled Resize enabled when the root panel has another window", async () =>
    {
        const WorkArea = Box.Box(0, 1920, 1080, 0);
        const WindowNode = (WindowValue: Handle.HWND): Tiling.Tree.WindowNode =>
            Tiling.Tree.Window({
                InitialBounds: Box.Box(100, 200, 200, 100),
                Window: WindowValue
            });
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: WorkArea,
                    Id: Tiling.Tree.WorkspaceId(WorkArea),
                    Root: Tiling.Tree.Panel(
                        Tiling.Tree.Orientation.Horizontal,
                        [ WindowNode(CurrentWindow), WindowNode(RightWindow) ]
                    )
                }
            ]
        };

        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "Resize")).toMatchObject({ Disabled: false });
    });

    it("treats a sole root window as root-panel focus", async () =>
    {
        const PrimaryWorkArea = Box.Box(0, 1920, 1080, 0);
        const RightWorkArea = Box.Box(0, 3840, 1080, 1920);
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: PrimaryWorkArea,
                    Id: Tiling.Tree.WorkspaceId(PrimaryWorkArea),
                    Root: Tiling.Tree.Window({
                        InitialBounds: PrimaryWorkArea,
                        Window: CurrentWindow
                    })
                },
                {
                    Bounds: RightWorkArea,
                    Id: Tiling.Tree.WorkspaceId(RightWorkArea),
                    Root: Tiling.Tree.Panel(
                        Tiling.Tree.Orientation.Vertical,
                        [
                            Tiling.Tree.Window({
                                InitialBounds: Box.Box(0, 2880, 540, 1920),
                                Window: MonitorRightWindowA
                            }),
                            Tiling.Tree.Window({
                                InitialBounds: Box.Box(540, 2880, 1080, 1920),
                                Window: MonitorRightWindowB
                            })
                        ]
                    )
                }
            ]
        };
        MonitorSnapshot = [
            Monitor(1, "Primary", PrimaryWorkArea),
            Monitor(2, "Projector", RightWorkArea)
        ];

        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.TiledFocus);
                const Initial = yield* Session.Snapshot;
                const Right = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveRight")
                );
                const Primary = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMonitor1")
                );

                return { Initial, Primary, Right };
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(ResultValue.Initial.IsRootPanelFocused).toBe(true);
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveRight")).toMatchObject({
            Disabled: false,
            Target: { Title: "Display 2: Projector" }
        });
        expect(ResultValue.Initial.Commands.filter((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveLeft"
            || Command.Id === "FocusMoveUp"
            || Command.Id === "FocusMoveDown"
        ).every((Command: OverlayCommandDto) => Command.Disabled)).toBe(true);
        expect(ResultValue.Initial.MonitorCommands).toMatchObject([
            { Disabled: false, Id: "FocusMonitor1" },
            { Disabled: false, Id: "FocusMonitor2" }
        ]);
        expect(ResultValue.Primary).toMatchObject({
            Node: { _tag: "Window" },
            Path: [ ],
            WorkspaceId: Tiling.Tree.WorkspaceId(PrimaryWorkArea)
        });
        expect(ResultValue.Right).toMatchObject({
            Node: { _tag: "Panel" },
            Path: [ ],
            WorkspaceId: Tiling.Tree.WorkspaceId(RightWorkArea)
        });
    });

    it("produces a Snapshot the IPC boundary accepts for a floating window", async () =>
    {
        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.Id).toBe(OverlayScreenId.FloatingHome);
        expect(Snapshot.Commands.length).toBeGreaterThan(0);
        expect(IsOverlayScreenDto(Snapshot)).toBe(true);
    });

    it("produces a Snapshot the IPC boundary accepts for a tiled window", async () =>
    {
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: Box.Box(0, 1920, 1080, 0),
                    Id: Tiling.Tree.WorkspaceId(
                        Box.Box(0, 1920, 1080, 0)
                    ),
                    Root: Tiling.Tree.Window({
                        InitialBounds: Box.Box(100, 200, 200, 100),
                        Window: CurrentWindow
                    })
                }
            ]
        };

        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.Id).toBe(OverlayScreenId.TiledHome);
        expect(Snapshot.Commands.length).toBeGreaterThan(0);
        expect(IsOverlayScreenDto(Snapshot)).toBe(true);
    });

    it("lists only floating Insert candidates and cycles the active window", async () =>
    {
        const WorkArea = Box.Box(0, 1920, 1080, 0);
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: WorkArea,
                    Id: Tiling.Tree.WorkspaceId(WorkArea),
                    Root: Tiling.Tree.Window({
                        InitialBounds: Box.Box(100, 200, 200, 100),
                        Window: CurrentWindow
                    })
                }
            ]
        };

        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.TiledInsertDirection);
                yield* Session.Navigate(OverlayScreenId.TiledInsertWindow);
                yield* Session.RefreshTiledInsertWindows;
                const Initial = yield* Session.Snapshot;
                const InitialWindow = yield* Session.SelectedTiledInsertWindow;
                yield* Session.MoveTiledInsertSelection(1);
                const Next = yield* Session.Snapshot;
                const NextWindow = yield* Session.SelectedTiledInsertWindow;

                return { Initial, InitialWindow, Next, NextWindow };
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(ResultValue.Initial.InsertWindows).toEqual([
            {
                Active: true,
                Target: { Icon: undefined, Title: "Left App" }
            },
            {
                Active: false,
                Target: { Icon: "right-icon", Title: "Right App" }
            }
        ]);
        expect(ResultValue.InitialWindow).toEqual(Option.some(LeftWindow));
        expect(ResultValue.Next.InsertWindows).toMatchObject([
            { Active: false },
            { Active: true }
        ]);
        expect(ResultValue.NextWindow).toEqual(Option.some(RightWindow));
    });

    it("tracks tiled panel focus without changing native focus", async () =>
    {
        const HorizontalPanel = Tiling.Tree.Panel(
            Tiling.Tree.Orientation.Horizontal,
            [
                Tiling.Tree.Window({
                    InitialBounds: Box.Box(100, 400, 200, 300),
                    Window: RightWindow
                }),
                Tiling.Tree.Window({
                    InitialBounds: Box.Box(100, 600, 200, 500),
                    Window: OtherWindow
                })
            ]
        );
        const VerticalPanel = Tiling.Tree.Panel(
            Tiling.Tree.Orientation.Vertical,
            [
                Tiling.Tree.Window({
                    InitialBounds: Box.Box(100, 200, 200, 100),
                    Window: CurrentWindow
                }),
                HorizontalPanel
            ]
        );
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: Box.Box(0, 1920, 1080, 0),
                    Id: Tiling.Tree.WorkspaceId(
                        Box.Box(0, 1920, 1080, 0)
                    ),
                    Root: Tiling.Tree.Panel(
                        Tiling.Tree.Orientation.Horizontal,
                        [
                            Tiling.Tree.Window({
                                InitialBounds: Box.Box(100, 0, 200, -100),
                                Window: LeftWindow
                            }),
                            VerticalPanel
                        ]
                    )
                },
                {
                    Bounds: Box.Box(0, 3840, 1080, 1920),
                    Id: Tiling.Tree.WorkspaceId(
                        Box.Box(0, 3840, 1080, 1920)
                    ),
                    Root: Tiling.Tree.Panel(
                        Tiling.Tree.Orientation.Vertical,
                        [
                            Tiling.Tree.Window({
                                InitialBounds: Box.Box(0, 2880, 540, 1920),
                                Window: MonitorRightWindowA
                            }),
                            Tiling.Tree.Window({
                                InitialBounds: Box.Box(540, 2880, 1080, 1920),
                                Window: MonitorRightWindowB
                            })
                        ]
                    )
                }
            ]
        };
        MonitorSnapshot = [
            Monitor(
                1,
                "Primary",
                Box.Box(0, 1920, 1080, 0)
            ),
            Monitor(
                2,
                "Projector",
                Box.Box(1080, 1920, 2160, 0)
            ),
            Monitor(
                3,
                "Desk",
                Box.Box(0, 3840, 1080, 1920)
            ),
            Monitor(
                10,
                "Excluded",
                Box.Box(0, 5760, 1080, 3840)
            )
        ];

        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.TiledFocus);
                const Initial = yield* Session.Snapshot;

                const Down = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveDown")
                );
                yield* Session.SetTiledFocusSelection(Down);
                const PanelSnapshot = yield* Session.Snapshot;
                const Commit = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusCommit
                );
                yield* Session.SetTiledFocusSelection(Commit);
                const Right = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveRight")
                );
                const Last = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveLast")
                );
                yield* Session.SetTiledFocusSelection(Right);
                const First = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveFirst")
                );
                const Parent = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveParent")
                );
                const Root = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveRoot")
                );
                yield* Session.SetTiledFocusSelection(Root);
                const RootSnapshot = yield* Session.Snapshot;
                const RootRight = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveRight")
                );
                const Monitor1 = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMonitor1")
                );
                const Monitor2 = yield* Session.ResolveTiledFocusTarget("FocusMonitor2");
                const Monitor3 = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMonitor3")
                );

                return {
                    Commit,
                    Down,
                    First,
                    Initial,
                    Last,
                    Monitor1,
                    Monitor2,
                    Monitor3,
                    PanelSnapshot,
                    Parent,
                    Right,
                    Root,
                    RootRight,
                    RootSnapshot
                };
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(ResultValue.Initial.Id).toBe(OverlayScreenId.TiledFocus);
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveDown")).toMatchObject({
            Disabled: false,
            Target: { Title: "Horizontal panel" }
        });
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveParent")).toMatchObject({
            Disabled: false,
            Shortcut: {
                KeyLabel: "H",
                Modifiers: { Control: true }
            },
            Target: { Title: "Vertical panel" }
        });
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveFirst")).toMatchObject({
            Disabled: true
        });
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveLast")).toMatchObject({
            Disabled: false,
            Target: { Title: "Horizontal panel" }
        });
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveRoot")).toMatchObject({
            Disabled: false,
            Target: { Title: "Display 1: Primary" }
        });
        expect(ResultValue.Initial.Commands.filter((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveLeft"
            || Command.Id === "FocusMoveRight"
            || Command.Id === "FocusMoveUp"
        ).every((Command: OverlayCommandDto) => Command.Disabled)).toBe(true);
        expect(ResultValue.Down).toMatchObject({
            Node: { _tag: "Panel" },
            Path: [ 1, 1 ]
        });
        expect(ResultValue.PanelSnapshot.Id).toBe(OverlayScreenId.TiledFocus);
        expect(EnsureBrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
            IgnoreMouseEvents: true,
            Key: BrowserWindow.Key.TiledFocusPanelPreview
        }));
        expect(SetBrowserWindowBounds).toHaveBeenCalledWith(
            BrowserWindow.Key.TiledFocusPanelPreview,
            Box.Box(540, 1920, 1080, 960)
        );
        expect(SendToBrowserWindow).toHaveBeenCalledWith(
            BrowserWindow.Key.TiledFocusPanelPreview,
            "focus-preview:changed",
            {
                Color: "#336699",
                ExcludedRegions: [ ],
                Opacity: 38,
                ShowIcon: false
            }
        );
        expect(ShowBrowserWindowInactive).toHaveBeenCalledWith(
            BrowserWindow.Key.TiledFocusPanelPreview
        );
        expect(ShowBrowserWindowInactive).toHaveBeenLastCalledWith(
            BrowserWindow.Key.Overlay
        );
        expect(ResultValue.Commit).toMatchObject({
            Node: { Value: { Window: RightWindow }, _tag: "Window" },
            Path: [ 1, 1, 0 ]
        });
        expect(ResultValue.Right).toMatchObject({
            Node: { Value: { Window: OtherWindow }, _tag: "Window" },
            Path: [ 1, 1, 1 ]
        });
        expect(ResultValue.Last).toMatchObject({
            Node: { Value: { Window: OtherWindow }, _tag: "Window" },
            Path: [ 1, 1, 1 ]
        });
        expect(ResultValue.First).toMatchObject({
            Node: { Value: { Window: RightWindow }, _tag: "Window" },
            Path: [ 1, 1, 0 ]
        });
        expect(ResultValue.Parent).toMatchObject({
            Node: { _tag: "Panel" },
            Path: [ 1, 1 ]
        });
        expect(ResultValue.Root).toMatchObject({
            Node: { _tag: "Panel" },
            Path: [ ]
        });
        expect(ResultValue.RootRight).toMatchObject({
            Node: { Orientation: "Vertical", _tag: "Panel" },
            Path: [ ],
            WorkspaceId: Tiling.Tree.WorkspaceId(
                Box.Box(0, 3840, 1080, 1920)
            )
        });
        expect(ResultValue.Monitor1.WorkspaceId).toBe(Tiling.Tree.WorkspaceId(
            Box.Box(0, 1920, 1080, 0)
        ));
        expect(Option.isNone(ResultValue.Monitor2)).toBe(true);
        expect(ResultValue.Monitor3.WorkspaceId).toBe(Tiling.Tree.WorkspaceId(
            Box.Box(0, 3840, 1080, 1920)
        ));
        expect(ResultValue.RootSnapshot).toMatchObject({
            IsRootPanelFocused: true,
            MonitorCommands: [
                {
                    Disabled: false,
                    Id: "FocusMonitor1",
                    Shortcut: { KeyLabel: "1" },
                    Target: { Title: "Display 1: Primary" }
                },
                {
                    Disabled: true,
                    Id: "FocusMonitor2",
                    Shortcut: { KeyLabel: "2" },
                    Target: { Title: "Display 2: Projector" }
                },
                {
                    Disabled: false,
                    Id: "FocusMonitor3",
                    Shortcut: { KeyLabel: "3" },
                    Target: { Title: "Display 3: Desk" }
                }
            ]
        });
        expect(ResultValue.RootSnapshot.MonitorCommands).toHaveLength(3);
        expect(ResultValue.RootSnapshot.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveRight")).toMatchObject({
            Disabled: false,
            Target: { Title: "Display 3: Desk" }
        });
        expect(WindowsWindow.DimWindowsExcept).not.toHaveBeenCalled();
    });

    it("keeps stack focus on the panel while Up and Down select its windows", async () =>
    {
        vi.mocked(WindowsWindow.GetWindowText).mockImplementation((
            Window: Handle.HWND
        ) => Option.some(
            Window === CurrentWindow
                ? "First App"
                : Window === RightWindow
                    ? "Second App"
                    : "Third App"
        ));
        const WorkArea = Box.Box(0, 1920, 1080, 0);
        TilingSnapshot = {
            Workspaces: [ {
                Bounds: WorkArea,
                Id: Tiling.Tree.WorkspaceId(WorkArea),
                Root: Tiling.Tree.Panel(
                    Tiling.Tree.Orientation.Stack,
                    [
                        Tiling.Tree.Window({
                            InitialBounds: WorkArea,
                            Window: CurrentWindow
                        }),
                        Tiling.Tree.Window({
                            InitialBounds: WorkArea,
                            Window: RightWindow
                        }),
                        Tiling.Tree.Window({
                            InitialBounds: WorkArea,
                            Window: OtherWindow
                        })
                    ]
                )
            } ]
        };

        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.TiledFocus);
                const Stack = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveParent")
                );
                yield* Session.SetTiledFocusSelection(Stack);
                const Initial = yield* Session.Snapshot;
                const Direct = Option.getOrThrow(
                    yield* Session.ResolveTiledStackWindow(2)
                );
                const Down = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveDown")
                );
                yield* Session.SetTiledFocusSelection(Down);
                const Selected = yield* Session.Snapshot;
                const Up = Option.getOrThrow(
                    yield* Session.ResolveTiledFocusTarget("FocusMoveUp")
                );

                return { Direct, Down, Initial, Selected, Stack, Up };
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(ResultValue.Stack).toMatchObject({
            Node: { Orientation: "Stack", _tag: "Panel" },
            Path: [ ],
            StackActiveIndex: 0,
            StackWindows: [ CurrentWindow, RightWindow, OtherWindow ]
        });
        expect(ResultValue.Initial.StackWindows).toEqual([
            { Active: true, Target: { Icon: undefined, Title: "First App" } },
            { Active: false, Target: { Icon: "right-icon", Title: "Second App" } },
            { Active: false, Target: { Icon: undefined, Title: "Third App" } }
        ]);
        expect(ResultValue.Down).toMatchObject({
            Node: { Orientation: "Stack", _tag: "Panel" },
            Path: [ ],
            StackActiveIndex: 1
        });
        expect(ResultValue.Direct).toMatchObject({
            StackActiveIndex: 2,
            StackWindows: [ CurrentWindow, RightWindow, OtherWindow ]
        });
        expect(ResultValue.Selected.StackWindows?.map(
            (WindowValue: OverlayStackWindowDto) => WindowValue.Active
        )).toEqual([ false, true, false ]);
        expect(ResultValue.Up.StackActiveIndex).toBe(0);
    });

    it("resolves tiled moves and highlights an adjacent target panel", async () =>
    {
        const TargetPanel = Tiling.Tree.Panel(
            Tiling.Tree.Orientation.Vertical,
            [
                Tiling.Tree.Window({
                    InitialBounds: Box.Box(0, 100, 100, 0),
                    Window: RightWindow
                }),
                Tiling.Tree.Window({
                    InitialBounds: Box.Box(0, 100, 100, 0),
                    Window: OtherWindow
                })
            ]
        );
        const WindowNode = (WindowValue: Handle.HWND): Tiling.Tree.WindowNode =>
            Tiling.Tree.Window({
                InitialBounds: Box.Box(0, 100, 100, 0),
                Window: WindowValue
            });
        const WorkspaceId = Tiling.Tree.WorkspaceId(
            Box.Box(0, 1920, 1080, 0)
        );
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: Box.Box(0, 1920, 1080, 0),
                    Id: WorkspaceId,
                    Root: Tiling.Tree.Panel(
                        Tiling.Tree.Orientation.Horizontal,
                        [
                            WindowNode(LeftWindow),
                            WindowNode(CurrentWindow),
                            TargetPanel,
                            WindowNode(MonitorRightWindowA)
                        ]
                    )
                }
            ]
        };

        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.TiledMove);
                const Initial = yield* Session.Snapshot;
                const SelectPanel = Option.getOrThrow(
                    yield* Session.ResolveTiledMoveAction("MoveWindowRight")
                );
                if (SelectPanel._tag !== "SelectPanel")
                {
                    throw new Error("Expected a panel-selection action.");
                }

                yield* Session.SetTiledMovePanelTarget(SelectPanel);
                const PanelTargeted = yield* Session.Snapshot;
                const MoveAway = yield* Session.ResolveTiledMoveAction(
                    "MoveWindowLeft"
                );
                const Commit = yield* Session.ResolveTiledMoveAction(
                    "MoveWindowIntoPanel"
                );

                return {
                    Commit,
                    Initial,
                    MoveAway,
                    PanelTargeted,
                    SelectPanel
                };
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(ResultValue.SelectPanel).toMatchObject({
            DirectionId: "MoveWindowRight",
            TargetPanelPath: [ 2 ],
            WorkspaceId,
            _tag: "SelectPanel"
        });
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "MoveWindowRight")).toMatchObject({ Disabled: false });
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "MoveWindowParent")).toMatchObject({ Disabled: true });
        expect(ResultValue.Initial.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "MoveWindowIntoPanel")).toMatchObject({ Disabled: true });
        expect(ResultValue.PanelTargeted.IsTiledMovePanelTargeted).toBe(true);
        expect(ResultValue.PanelTargeted.Commands.filter((Command: OverlayCommandDto) =>
            !Command.Disabled).map((Command: OverlayCommandDto) => Command.Id)).toEqual([
            "MoveWindowLeft",
            "MoveWindowIntoPanel"
        ]);
        expect(ResultValue.MoveAway).toMatchObject({
            value: { TargetIndex: 0, _tag: "MoveToIndex" }
        });
        expect(ResultValue.Commit).toMatchObject({
            value: { TargetPanelPath: [ 2 ], _tag: "MoveIntoPanel" }
        });
        expect(SetBrowserWindowBounds).toHaveBeenCalledWith(
            BrowserWindow.Key.TiledMovePanelPreview,
            Box.Box(0, 1440, 1080, 960)
        );
        expect(SendToBrowserWindow).toHaveBeenCalledWith(
            BrowserWindow.Key.TiledMovePanelPreview,
            "focus-preview:changed",
            {
                Color: "#336699",
                ExcludedRegions: [ ],
                Opacity: 38,
                ShowIcon: false
            }
        );
        expect(ShowBrowserWindowInactive).toHaveBeenLastCalledWith(
            BrowserWindow.Key.Overlay
        );
    });

    it("offers axis, boundary, and parent moves for a nested tiled window", async () =>
    {
        const WindowNode = (WindowValue: Handle.HWND): Tiling.Tree.WindowNode =>
            Tiling.Tree.Window({
                InitialBounds: Box.Box(0, 100, 100, 0),
                Window: WindowValue
            });
        const WorkArea = Box.Box(0, 1920, 1080, 0);
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: WorkArea,
                    Id: Tiling.Tree.WorkspaceId(WorkArea),
                    Root: Tiling.Tree.Panel(
                        Tiling.Tree.Orientation.Horizontal,
                        [
                            WindowNode(LeftWindow),
                            Tiling.Tree.Panel(
                                Tiling.Tree.Orientation.Vertical,
                                [
                                    WindowNode(RightWindow),
                                    WindowNode(CurrentWindow),
                                    WindowNode(OtherWindow)
                                ]
                            ),
                            WindowNode(MonitorRightWindowA)
                        ]
                    )
                }
            ]
        };

        const ResultValue = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.TiledMove);

                return {
                    Down: yield* Session.ResolveTiledMoveAction("MoveWindowDown"),
                    First: yield* Session.ResolveTiledMoveAction("MoveWindowFirst"),
                    Last: yield* Session.ResolveTiledMoveAction("MoveWindowLast"),
                    Left: yield* Session.ResolveTiledMoveAction("MoveWindowLeft"),
                    Parent: yield* Session.ResolveTiledMoveAction("MoveWindowParent"),
                    Snapshot: yield* Session.Snapshot,
                    Up: yield* Session.ResolveTiledMoveAction("MoveWindowUp")
                };
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(ResultValue.Up).toMatchObject({
            value: { TargetIndex: 0, _tag: "MoveToIndex" }
        });
        expect(ResultValue.Down).toMatchObject({
            value: { TargetIndex: 2, _tag: "MoveToIndex" }
        });
        expect(ResultValue.First).toMatchObject({
            value: { TargetIndex: 0, _tag: "MoveToIndex" }
        });
        expect(ResultValue.Last).toMatchObject({
            value: { TargetIndex: 2, _tag: "MoveToIndex" }
        });
        expect(ResultValue.Parent).toMatchObject({
            value: { _tag: "MoveToContainingPanel" }
        });
        expect(Option.isNone(ResultValue.Left)).toBe(true);
        expect(ResultValue.Snapshot.Commands.filter((Command: OverlayCommandDto) =>
            Command.Id === "MoveWindowUp"
            || Command.Id === "MoveWindowDown"
            || Command.Id === "MoveWindowParent"
        ).every((Command: OverlayCommandDto) => !Command.Disabled)).toBe(true);
    });

    it("publishes target metadata and previews only the current, overlay, and target windows", async () =>
    {
        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.FloatingFocus);
                const Current = yield* Session.Snapshot;
                yield* Session.PreviewFocusTarget("FocusMoveRight");
                yield* Session.PreviewFocusTarget(null);
                return Current;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveLeft")).toMatchObject({
            Disabled: false,
            Target: { Title: "Left App" }
        });
        expect(Snapshot.Commands.find((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveRight")).toMatchObject({
            Disabled: false,
            Target: {
                Icon: "right-icon",
                Title: "Right App"
            }
        });
        expect(Snapshot.Commands.filter((Command: OverlayCommandDto) =>
            Command.Id === "FocusMoveUp" || Command.Id === "FocusMoveDown"
        ).every((Command: OverlayCommandDto) => Command.Disabled)).toBe(true);
        expect(WindowsWindow.DimWindowsExcept).toHaveBeenCalledWith([
            CurrentWindow,
            OverlayWindow,
            RightWindow
        ]);
        expect(WindowsWindow.ClearWindowDimming).toHaveBeenCalledOnce();
    });

    it("shows a sampled-color Electron proxy for a fully obscured floating target", async () =>
    {
        vi.mocked(WindowsWindow.IsWindowObscured).mockImplementation((
            Window: Handle.HWND
        ) => Result.succeed(Window === RightWindow));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.FloatingFocus);
                yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(EnsureBrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
            IgnoreMouseEvents: true,
            Key: BrowserWindow.Key.FocusPreviewRight
        }));
        expect(SetBrowserWindowBounds).toHaveBeenCalledWith(
            BrowserWindow.Key.FocusPreviewRight,
            Box.Box(100, 400, 200, 300)
        );
        expect(SendToBrowserWindow).toHaveBeenCalledWith(
            BrowserWindow.Key.FocusPreviewRight,
            "focus-preview:changed",
            {
                ExcludedRegions: [ ],
                Icon: "right-icon",
                Opacity: 75
            }
        );
        expect(ShowBrowserWindowInactive).toHaveBeenCalledWith(
            BrowserWindow.Key.FocusPreviewRight
        );
        expect(ShowBrowserWindowInactive).toHaveBeenLastCalledWith(
            BrowserWindow.Key.Overlay
        );
    });

    it("clips overlaps from later previews belonging to the same application", async () =>
    {
        vi.mocked(WindowsWindow.GetWindowRect).mockImplementation((
            Window: Handle.HWND
        ) =>
        {
            switch (Window)
            {
                case CurrentWindow:
                    return Option.some(Box.Box(100, 200, 200, 100));
                case LeftWindow:
                    return Option.some(Box.Box(0, 200, 300, -200));
                case RightWindow:
                    return Option.some(Box.Box(0, 500, 300, 100));
                default:
                    return Option.none();
            }
        });
        vi.mocked(WindowsWindow.IsWindowObscured).mockReturnValue(Result.succeed(true));

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.FloatingFocus);
                yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(SendToBrowserWindow).toHaveBeenCalledWith(
            BrowserWindow.Key.FocusPreviewLeft,
            "focus-preview:changed",
            expect.objectContaining({ ExcludedRegions: [ ] })
        );
        expect(SendToBrowserWindow).toHaveBeenCalledWith(
            BrowserWindow.Key.FocusPreviewRight,
            "focus-preview:changed",
            expect.objectContaining({
                ExcludedRegions: [
                    { Bottom: 300, Left: 0, Right: 100, Top: 0 }
                ]
            })
        );
    });

    it("does not proxy an obscured target managed by the tiling layout", async () =>
    {
        vi.mocked(WindowsWindow.IsWindowObscured).mockReturnValue(Result.succeed(true));
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: Box.Box(0, 1920, 1080, 0),
                    Id: "display-1",
                    Root: {
                        Value: {
                            InitialBounds: Box.Box(100, 400, 200, 300),
                            Window: RightWindow
                        },
                        _tag: "Window"
                    }
                }
            ]
        };

        await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.FloatingFocus);
                yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(EnsureBrowserWindow).not.toHaveBeenCalledWith(expect.objectContaining({
            Key: BrowserWindow.Key.FocusPreviewRight
        }));
    });
});

describe("OverlaySession.Live DistanceToggle", () =>
{
    it("reflects the primary modifier's held state on the Move screen", async () =>
    {
        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.Navigate(OverlayScreenId.FloatingMove);
                yield* Session.SetPrimaryModifierHeld(true);
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.DistanceToggle).toMatchObject({
            Active: true,
            PrimaryDistance: 20,
            SecondaryDistance: 50
        });
    });

    it("omits the distance toggle outside the Move screen", async () =>
    {
        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                return yield* Session.Snapshot;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Snapshot.DistanceToggle).toBeUndefined();
    });
});

describe("OverlaySession.Live tiled resize behavior", () =>
{
    it("loads the configured behavior and toggles it for the current session", async () =>
    {
        const [ Initial, Toggled ] = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.Navigate(OverlayScreenId.TiledResize);
                const InitialSnapshot = yield* Session.Snapshot;
                yield* Session.ToggleTiledResizeBehavior;
                const ToggledSnapshot = yield* Session.Snapshot;
                return [ InitialSnapshot, ToggledSnapshot ] as const;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Initial.TiledResizeBehavior).toBe("PreserveRatios");
        expect(Toggled.TiledResizeBehavior).toBe("AdjacentOnly");
    });
});

describe("OverlaySession.Live resize recovery", () =>
{
    it("records and clears the failed-shrink warning", async () =>
    {
        const [ Failed, Cleared ] = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.RecordResizeRecoveryFailure;
                const FailedSnapshot = yield* Session.Snapshot;
                yield* Session.ClearResizeRecoveryFailure;
                const ClearedSnapshot = yield* Session.Snapshot;
                return [ FailedSnapshot, ClearedSnapshot ] as const;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows),
            Effect.provide(FakeTilingManager)
        ));

        expect(Failed.ResizeRecoveryFailure).toBe(true);
        expect(Cleared.ResizeRecoveryFailure).toBeUndefined();
    });
});

const CurrentSettings: AppSettings.AppSettings = {
    FocusPreviewOpacity: 75,
    IgnoreActivationKeybindInFullscreen: true,
    Keybinds: [ ],
    MoveFineSpeed: 16,
    MoveStepPrimary: 20,
    MoveStepPrimarySpeedFactor: 4,
    MoveStepSecondary: 50,
    MoveStepSecondarySpeedFactor: 4,
    OverlayBackdropIntensity: 50,
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
    TiledWindowDetachDistance: 128,
    TiledWindowGap: 8,
    UseSimplifiedTrayIcon: false
};

const FakeAppSettings = Layer.succeed(AppSettings.AppSettings, {
    Changes: Stream.empty,
    Get: Effect.succeed(CurrentSettings),
    GetSetting: <Key extends keyof AppSettings.AppSettings>(
        KeyValue: Key
    ) => Effect.succeed(CurrentSettings[KeyValue]),
    Set: () => Effect.void,
    SetSetting: () => Effect.void,
    Update: () => Effect.void
});

const FakeBrowserWindows = Layer.succeed(
    BrowserWindow.BrowserWindow,
    {
        Ensure: EnsureBrowserWindow,
        ForceClose: ForceCloseBrowserWindow,
        GetNativeHandle: (Key: BrowserWindow.Key) => Key === BrowserWindow.Key.Overlay
            ? Effect.succeed(OverlayWindow)
            : Effect.fail(new BrowserWindow.BrowserWindowNotFoundError({ Key })),
        Send: SendToBrowserWindow,
        SetBounds: SetBrowserWindowBounds,
        ShowInactive: ShowBrowserWindowInactive
    } as unknown as BrowserWindow.BrowserWindowImpl
);

const FakeTilingManager = Layer.succeed(
    Tiling.Manager.TilingManager,
    {
        Gap: Effect.succeed(0),
        Snapshot: Effect.sync(() => TilingSnapshot)
    } as unknown as Tiling.Manager.TilingManagerImpl
);

const Monitor = (
    DisplayId: number,
    DeviceName: string,
    WorkArea: Box.Box
): WindowsScreen.MonitorInfo => ({
    DeviceName,
    DisplayId,
    Flags: 0,
    Handle: BigInt(DisplayId) as Handle.HMONITOR,
    IsPrimary: DisplayId === 1,
    Monitor: WorkArea,
    WorkArea
});
