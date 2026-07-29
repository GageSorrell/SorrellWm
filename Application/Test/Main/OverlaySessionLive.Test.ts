/**
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
import { type Handle, Window as WindowsWindow } from "@sorrell/windows";
import {
    Live,
    OverlaySession
} from "../../Source/Main/Overlay/Session.ts";
import {
    type OverlayCommandDto,
    OverlayScreenId
} from "../../Source/Shared/OverlayCommand.ts";
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
        VK: {
            CONTROL: 0x11,
            D: 0x44,
            F20: 0x83,
            H: 0x48,
            MENU: 0x12,
            N: 0x4E,
            SHIFT: 0x10,
            T: 0x54,
            TAB: 0x09,
            VK: [ 0x09, 0x10, 0x11, 0x12, 0x44, 0x48, 0x4E, 0x54, 0x83 ]
        },
        Window: {
            ClearWindowDimming: vi.fn(() => EffectModule.Result.succeed(undefined)),
            DimWindowsExcept: vi.fn(() => EffectModule.Result.succeed(undefined)),
            GetApplicationName: vi.fn(() => EffectModule.Option.none()),
            GetIcon: vi.fn(() => EffectModule.Option.none()),
            GetManageableTopLevelWindows: vi.fn(() =>
                EffectModule.Result.succeed([ ])),
            IsWindowObscured: vi.fn(() => EffectModule.Result.succeed(false)),
            GetWindowRect: vi.fn(() => EffectModule.Option.none()),
            GetWindowText: vi.fn(() => EffectModule.Option.none())
        }
    };
});

const CurrentWindow = 1n as Handle.HWND;
const LeftWindow = 2n as Handle.HWND;
const RightWindow = 3n as Handle.HWND;
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

    it("selects the tiled Home catalog for a managed activation window", async () =>
    {
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: Box.Box(0, 1920, 1080, 0),
                    Id: "display-1",
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

    it("does not proxy an obscured target managed by the tiling layout", async () =>
    {
        vi.mocked(WindowsWindow.IsWindowObscured).mockReturnValue(Result.succeed(true));
        TilingSnapshot = {
            Workspaces: [
                {
                    Bounds: Box.Box(0, 1920, 1080, 0),
                    Id: "display-1",
                    Root: {
                        _tag: "Window",
                        Value: {
                            InitialBounds: Box.Box(100, 400, 200, 300),
                            Window: RightWindow
                        }
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

const CurrentSettings: AppSettings.AppSettings = {
    FocusPreviewOpacity: 75,
    Keybinds: [ ],
    MoveFineSpeed: 16,
    MoveStepPrimary: 20,
    MoveStepPrimarySpeedFactor: 4,
    MoveStepSecondary: 50,
    MoveStepSecondarySpeedFactor: 4,
    OverlayBackdropIntensity: 50,
    OverlayRoundedCorners: true,
    RunAtStartup: true,
    ShowTitlebarFlyout: true,
    Theme: "System"
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
        Snapshot: Effect.sync(() => TilingSnapshot)
    } as unknown as Tiling.Manager.TilingManagerImpl
);
