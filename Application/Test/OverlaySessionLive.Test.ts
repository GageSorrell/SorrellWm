/**
 * @module @sorrell/wm/Test/OverlaySessionLive
 *
 * @file      OverlaySessionLive.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "../Source/Main/AppSettings/AppSettings.ts";
import * as BrowserWindow from "../Source/Main/BrowserWindow.js";
import { Effect, Layer, Option, Result, Stream, pipe } from "effect";
import { type Handle, Window as WindowsWindow } from "@sorrell/windows";
import {
    Live,
    OverlaySession
} from "../Source/Main/Overlay/Session.ts";
import {
    type OverlayCommandDto,
    OverlayScreenId
} from "../Source/Shared/OverlayCommand.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Box } from "@sorrell/math";

vi.mock("@sorrell/windows", async() =>
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
            D: 0x44,
            F20: 0x83,
            H: 0x48,
            N: 0x4E,
            T: 0x54,
            VK: [ 0x44, 0x48, 0x4E, 0x54, 0x83 ]
        },
        Window: {
            ClearWindowDimming: vi.fn(() => EffectModule.Result.succeed(undefined)),
            DimWindowsExcept: vi.fn(() => EffectModule.Result.succeed(undefined)),
            GetIcon: vi.fn(() => EffectModule.Option.none()),
            GetManageableTopLevelWindows: vi.fn(() =>
                EffectModule.Result.succeed([ ])),
            GetWindowRect: vi.fn(() => EffectModule.Option.none()),
            GetWindowText: vi.fn(() => EffectModule.Option.none())
        }
    };
});

const CurrentWindow = 1n as Handle.HWND;
const LeftWindow = 2n as Handle.HWND;
const RightWindow = 3n as Handle.HWND;
const OverlayWindow = 99n as Handle.HWND;

beforeEach(() =>
{
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
    vi.mocked(WindowsWindow.GetIcon).mockImplementation((
        Window: Handle.HWND
    ) => Window === RightWindow ? Option.some("right-icon") : Option.none());
    vi.mocked(WindowsWindow.ClearWindowDimming).mockReturnValue(
        Result.succeed(undefined)
    );
    vi.mocked(WindowsWindow.DimWindowsExcept).mockReturnValue(
        Result.succeed(undefined)
    );
});

describe("OverlaySession.Live Focus targets", () =>
{
    it("publishes target metadata and previews only the current, overlay, and target windows", async() =>
    {
        const Snapshot = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Session = yield* OverlaySession;
                yield* Session.SetActivationWindow(CurrentWindow);
                yield* Session.Navigate(OverlayScreenId.Focus);
                const Current = yield* Session.Snapshot;
                yield* Session.PreviewFocusTarget("FocusMoveRight");
                yield* Session.PreviewFocusTarget(null);
                return Current;
            }),
            Effect.provide(Live),
            Effect.provide(FakeAppSettings),
            Effect.provide(FakeBrowserWindows)
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
});

const CurrentSettings: AppSettings.AppSettings = {
    Keybinds: [ ],
    OverlayBackdropIntensity: 50,
    OverlayRoundedCorners: true,
    RunAtStartup: true,
    ShowTitlebarFlyout: true,
    Theme: "System"
};

const FakeAppSettings = Layer.succeed(AppSettings.AppSettings, {
    changes: Stream.empty,
    get: Effect.succeed(CurrentSettings),
    getSetting: <Key extends keyof AppSettings.AppSettings>(
        KeyValue: Key
    ) => Effect.succeed(CurrentSettings[KeyValue]),
    set: () => Effect.void,
    setSetting: () => Effect.void,
    update: () => Effect.void
});

const FakeBrowserWindows = Layer.succeed(
    BrowserWindow.BrowserWindow,
    {
        GetNativeHandle: () => Effect.succeed(OverlayWindow)
    } as unknown as BrowserWindow.BrowserWindowImpl
);
