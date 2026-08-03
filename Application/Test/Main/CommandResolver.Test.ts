/**
 * Tests conversion of hotkey activations into application commands.
 *
 * @module @sorrell/wm/Test/CommandResolver
 *
 * @file      CommandResolver.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as OverlaySession from "../../Source/Main/Overlay/Session.ts";
import * as Windows from "@sorrell/windows";
import {
    CommandResolver,
    Live,
    Resolve,
    type Resolved
} from "../../Source/Main/Command/Resolver.ts";
import { Effect, Layer, Option, Stream, pipe } from "effect";
import {
    Hotkey,
    Id,
    Make,
    type Match,
    Phase,
    type Phase as PhaseType
} from "../../Source/Main/Input/Hotkey.ts";
import { OverlayScreenId, ResizeMode } from "../../Source/Shared/OverlayCommand.ts";
import { describe, expect, it, vi } from "vitest";

vi.mock("@sorrell/windows", () => ({
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
        BROWSER_BACK: 0xA6,
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
        J: 0x4A,
        K: 0x4B,
        L: 0x4C,
        LCONTROL: 0xA2,
        LMENU: 0xA4,
        LSHIFT: 0xA0,
        LWIN: 0x5B,
        MENU: 0x12,
        N: 0x4E,
        RCONTROL: 0xA3,
        RETURN: 0x0D,
        RMENU: 0xA5,
        RSHIFT: 0xA1,
        RWIN: 0x5C,
        SHIFT: 0x10,
        T: 0x54,
        TAB: 0x09,
        VK: [
            0x09,
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
            0x44,
            0x48,
            0x4A,
            0x4B,
            0x4C,
            0x4E,
            0x54,
            0x83,
            0xA6
        ]
    },
    Window:
    {
        GetManageableTopLevelWindows: (): ReadonlyArray<bigint> => [ ],
        GetWindowRect: (): undefined => undefined,
        GetWindowWorkArea: (): undefined => undefined,
        SetWindowRect: (): undefined => undefined
    }
}));

describe("CommandResolver.Resolve", () =>
{
    it("constructs immutable UI commands for mapped hotkey actions", () =>
    {
        const Activate = Option.getOrThrow(Resolve(Activation(
            Id.Activate,
            Windows.VK.F20,
            Phase.Pressed
        )));
        const Deactivate = Option.getOrThrow(Resolve(Activation(
            Id.Activate,
            Windows.VK.F20,
            Phase.Released
        )));

        expect(Activate).toMatchObject({ Category: "Ui", _tag: "Activate" });
        expect(Deactivate).toMatchObject({ Category: "Ui", _tag: "Deactivate" });
        expect(Object.isFrozen(Activate)).toBe(true);
        expect(Object.isFrozen(Deactivate)).toBe(true);
        expect("KeyboardEvent" in Activate).toBe(false);
    });

    it("maps the vim-direction action keys to the ordered primary commands", () =>
    {
        const Mappings = [
            [ Id.SelectLeft, Windows.VK.D, "Focus" ],
            [ Id.SelectUp, Windows.VK.H, "Tile" ],
            [ Id.SelectDown, Windows.VK.T, "Move" ],
            [ Id.SelectRight, Windows.VK.N, "Resize" ]
        ] as const;

        const Commands = Mappings.map(([ HotkeyId, Key ]: typeof Mappings[number]) =>
            Option.getOrThrow(Resolve(Activation(
                HotkeyId,
                Key,
                Phase.Pressed
            ))));

        expect(Commands[0]).toMatchObject({
            Category: "Ui",
            ScreenId: "FloatingFocus",
            _tag: "NavigateOverlayScreen"
        });
        expect(Commands[1]).toMatchObject({
            Category: "Ui",
            ScreenId: "FloatingTile",
            _tag: "NavigateOverlayScreen"
        });
        expect(Commands[2]).toMatchObject({
            Category: "Ui",
            ScreenId: "FloatingMove",
            _tag: "NavigateOverlayScreen"
        });
        expect(Commands[3]).toMatchObject({
            Category: "Ui",
            ScreenId: "FloatingResize",
            _tag: "NavigateOverlayScreen"
        });
    });

    it("maps the same action keys to the Focus screen's direction commands", () =>
    {
        const Mappings = [
            [ Id.SelectLeft, Windows.VK.D, "FocusMoveLeft" ],
            [ Id.SelectUp, Windows.VK.H, "FocusMoveUp" ],
            [ Id.SelectDown, Windows.VK.T, "FocusMoveDown" ],
            [ Id.SelectRight, Windows.VK.N, "FocusMoveRight" ]
        ] as const;

        expect(Mappings.map((
            [ HotkeyId, Key ]: typeof Mappings[number]
        ) => Option.getOrThrow(Resolve(
            Activation(HotkeyId, Key, Phase.Pressed),
            OverlayScreenId.FloatingFocus
        )))).toMatchObject(Mappings.map((
            [ , , CommandId ]: typeof Mappings[number]
        ) => ({
            Category: "Ui",
            Id: CommandId,
            _tag: "NoOpOverlayCommand"
        })));

        expect(Option.getOrThrow(Resolve(
            Activation(Id.Back, Windows.VK.BROWSER_BACK, Phase.Pressed),
            OverlayScreenId.FloatingFocus
        ))).toMatchObject({ Category: "Ui", _tag: "BackOverlayScreen" });
    });

    it("maps the same action keys to the Move screen's direction commands", () =>
    {
        const Mappings = [
            [ Id.SelectLeft, Windows.VK.D, "MoveWindowLeft" ],
            [ Id.SelectUp, Windows.VK.H, "MoveWindowUp" ],
            [ Id.SelectDown, Windows.VK.T, "MoveWindowDown" ],
            [ Id.SelectRight, Windows.VK.N, "MoveWindowRight" ]
        ] as const;

        expect(Mappings.map((
            [ HotkeyId, Key ]: typeof Mappings[number]
        ) => Option.getOrThrow(Resolve(
            Activation(HotkeyId, Key, Phase.Pressed),
            OverlayScreenId.FloatingMove
        )))).toMatchObject(Mappings.map((
            [ , , CommandId ]: typeof Mappings[number]
        ) => ({
            Category: "Ui",
            Id: CommandId,
            _tag: "NoOpOverlayCommand"
        })));

        expect(Option.getOrThrow(Resolve(
            Activation(Id.Back, Windows.VK.BROWSER_BACK, Phase.Pressed),
            OverlayScreenId.FloatingMove
        ))).toMatchObject({ Category: "Ui", _tag: "BackOverlayScreen" });

        expect(Resolve(
            Activation(Id.Toggle, Windows.VK.TAB, Phase.Pressed),
            OverlayScreenId.FloatingMove
        )).toEqual(Option.none());
    });

    it("maps the same action keys directly to the Resize screen's edges", () =>
    {
        const Mappings = [
            [ Id.SelectLeft, Windows.VK.D, "ResizeWindowLeft" ],
            [ Id.SelectUp, Windows.VK.H, "ResizeWindowUp" ],
            [ Id.SelectDown, Windows.VK.T, "ResizeWindowDown" ],
            [ Id.SelectRight, Windows.VK.N, "ResizeWindowRight" ]
        ] as const;

        expect(Mappings.map((
            [ HotkeyId, Key ]: typeof Mappings[number]
        ) => Option.getOrThrow(Resolve(
            Activation(HotkeyId, Key, Phase.Pressed),
            OverlayScreenId.FloatingResize
        )))).toMatchObject(Mappings.map((
            [ , , CommandId ]: typeof Mappings[number]
        ) => ({
            Category: "Ui",
            Id: CommandId,
            _tag: "NoOpOverlayCommand"
        })));

        expect(Option.getOrThrow(Resolve(
            Activation(Id.Toggle, Windows.VK.TAB, Phase.Pressed),
            OverlayScreenId.TiledResize
        ))).toMatchObject({
            Category: "Ui",
            _tag: "ToggleTiledResizeBehavior"
        });
    });

    it("opens tiled Focus and gives Shift plus SelectUp to Float", () =>
    {
        const Insert = Option.getOrThrow(Resolve(
            Activation(
                Id.SelectUp,
                Windows.VK.H,
                Phase.Pressed
            ),
            OverlayScreenId.TiledHome
        ));
        const Float = Option.getOrThrow(Resolve(
            Activation(
                Id.SelectUp,
                Windows.VK.H,
                Phase.Pressed,
                [ Windows.VK.LSHIFT, Windows.VK.H ]
            ),
            OverlayScreenId.TiledHome
        ));
        const Focus = Option.getOrThrow(Resolve(
            Activation(Id.SelectLeft, Windows.VK.D, Phase.Pressed),
            OverlayScreenId.TiledHome
        ));
        const Move = Option.getOrThrow(Resolve(
            Activation(Id.SelectDown, Windows.VK.T, Phase.Pressed),
            OverlayScreenId.TiledHome
        ));

        expect(Insert).toMatchObject({
            ScreenId: "TiledInsertDirection",
            _tag: "NavigateOverlayScreen"
        });
        expect(Float).toMatchObject({
            Id: "Float",
            _tag: "NoOpOverlayCommand"
        });
        expect(Focus).toMatchObject({
            ScreenId: "TiledFocus",
            _tag: "NavigateOverlayScreen"
        });
        expect(Move).toMatchObject({
            ScreenId: "TiledMove",
            _tag: "NavigateOverlayScreen"
        });
    });

    it("maps both tiled Insert screens, including Ctrl plus Tab capture", () =>
    {
        const ChooseUp = Option.getOrThrow(Resolve(
            Activation(Id.SelectUp, Windows.VK.H, Phase.Pressed),
            OverlayScreenId.TiledInsertDirection
        ));
        const Previous = Option.getOrThrow(Resolve(
            Activation(Id.SelectUp, Windows.VK.H, Phase.Pressed),
            OverlayScreenId.TiledInsertWindow
        ));
        const Commit = Option.getOrThrow(Resolve(
            Activation(Id.Commit, Windows.VK.RETURN, Phase.Pressed),
            OverlayScreenId.TiledInsertWindow
        ));
        const Target = Option.getOrThrow(Resolve(
            Activation(Id.Toggle, Windows.VK.TAB, Phase.Pressed),
            OverlayScreenId.TiledInsertWindow
        ));
        const CaptureNext = Option.getOrThrow(Resolve(
            Activation(
                Id.Toggle,
                Windows.VK.TAB,
                Phase.Pressed,
                [ Windows.VK.LCONTROL, Windows.VK.TAB ]
            ),
            OverlayScreenId.TiledInsertWindow
        ));

        expect([
            ChooseUp,
            Previous,
            Commit,
            Target,
            CaptureNext
        ]).toMatchObject([
            { Id: "ChooseInsertUp", _tag: "NoOpOverlayCommand" },
            { Id: "SelectInsertWindowUp", _tag: "NoOpOverlayCommand" },
            { Id: "CommitInsertWindow", _tag: "NoOpOverlayCommand" },
            { Id: "OpenInsertTarget", _tag: "NoOpOverlayCommand" },
            {
                Id: "OpenInsertTargetForNextWindow",
                _tag: "NoOpOverlayCommand"
            }
        ]);
    });

    it("maps directional, boundary, parent, and Commit keys on tiled Move", () =>
    {
        const MoveRight = Option.getOrThrow(Resolve(
            Activation(Id.SelectRight, Windows.VK.N, Phase.Pressed),
            OverlayScreenId.TiledMove
        ));
        const MoveParent = Option.getOrThrow(Resolve(
            Activation(
                Id.SelectUp,
                Windows.VK.H,
                Phase.Pressed,
                [ Windows.VK.LCONTROL, Windows.VK.H ]
            ),
            OverlayScreenId.TiledMove
        ));
        const MoveFirst = Option.getOrThrow(Resolve(
            Activation(Id.SelectFirst, Windows.VK.HOME, Phase.Pressed),
            OverlayScreenId.TiledMove
        ));
        const MoveLast = Option.getOrThrow(Resolve(
            Activation(Id.SelectLast, Windows.VK.END, Phase.Pressed),
            OverlayScreenId.TiledMove
        ));
        const MoveIntoPanel = Option.getOrThrow(Resolve(
            Activation(Id.Commit, Windows.VK.RETURN, Phase.Pressed),
            OverlayScreenId.TiledMove
        ));

        expect([
            MoveRight,
            MoveParent,
            MoveFirst,
            MoveLast,
            MoveIntoPanel
        ]).toMatchObject([
            { Id: "MoveWindowRight", _tag: "NoOpOverlayCommand" },
            { Id: "MoveWindowParent", _tag: "NoOpOverlayCommand" },
            { Id: "MoveWindowFirst", _tag: "NoOpOverlayCommand" },
            { Id: "MoveWindowLast", _tag: "NoOpOverlayCommand" },
            { Id: "MoveWindowIntoPanel", _tag: "NoOpOverlayCommand" }
        ]);
    });

    it("moves tiled focus to a parent panel with Ctrl plus SelectUp and commits child zero", () =>
    {
        const MoveUp = Option.getOrThrow(Resolve(
            Activation(Id.SelectUp, Windows.VK.H, Phase.Pressed),
            OverlayScreenId.TiledFocus
        ));
        const MoveParent = Option.getOrThrow(Resolve(
            Activation(
                Id.SelectUp,
                Windows.VK.H,
                Phase.Pressed,
                [ Windows.VK.LCONTROL, Windows.VK.H ]
            ),
            OverlayScreenId.TiledFocus
        ));
        const Commit = Option.getOrThrow(Resolve(
            Activation(Id.Commit, Windows.VK.A, Phase.Pressed),
            OverlayScreenId.TiledFocus
        ));

        expect(MoveUp).toMatchObject({
            Id: "FocusMoveUp",
            _tag: "NoOpOverlayCommand"
        });
        expect(MoveParent).toMatchObject({
            Id: "FocusMoveParent",
            _tag: "NoOpOverlayCommand"
        });
        expect(Commit).toMatchObject({
            Category: "Ui",
            _tag: "CommitTiledFocus"
        });
    });

    it("maps Home, End, and Ctrl plus Home to tiled panel focus commands", () =>
    {
        const First = Option.getOrThrow(Resolve(
            Activation(Id.SelectFirst, Windows.VK.HOME, Phase.Pressed),
            OverlayScreenId.TiledFocus
        ));
        const Last = Option.getOrThrow(Resolve(
            Activation(Id.SelectLast, Windows.VK.END, Phase.Pressed),
            OverlayScreenId.TiledFocus
        ));
        const Root = Option.getOrThrow(Resolve(
            Activation(
                Id.SelectFirst,
                Windows.VK.HOME,
                Phase.Pressed,
                [ Windows.VK.LCONTROL, Windows.VK.HOME ]
            ),
            OverlayScreenId.TiledFocus
        ));

        expect(First).toMatchObject({
            Id: "FocusMoveFirst",
            _tag: "NoOpOverlayCommand"
        });
        expect(Last).toMatchObject({
            Id: "FocusMoveLast",
            _tag: "NoOpOverlayCommand"
        });
        expect(Root).toMatchObject({
            Id: "FocusMoveRoot",
            _tag: "NoOpOverlayCommand"
        });

        expect(Option.getOrThrow(Resolve(
            Activation(Id.SelectRight, Windows.VK.N, Phase.Pressed),
            OverlayScreenId.TiledHome
        ))).toMatchObject({
            ScreenId: "TiledResize",
            _tag: "NavigateOverlayScreen"
        });
    });

    it("maps number-row monitor shortcuts to their matching display commands", () =>
    {
        const Monitor3 = Option.getOrThrow(Resolve(
            Activation(Id.SelectMonitor3, Windows.VK.D3, Phase.Pressed),
            OverlayScreenId.TiledFocus
        ));

        expect(Monitor3).toMatchObject({
            Id: "FocusMonitor3",
            _tag: "NoOpOverlayCommand"
        });
    });

    it("maps the Toggle key to opening the per-app settings section", () =>
    {
        const Resolved = Option.getOrThrow(Resolve(
            Activation(Id.Toggle, Windows.VK.TAB, Phase.Pressed)
        ));

        expect(Resolved).toMatchObject({ Category: "Ui", _tag: "OpenSettings" });
        expect(Option.getOrThrow((Resolved as { Path: Option.Option<string>; }).Path))
            .toBe("PerAppSettings?Source=Overlay");
    });

    it("includes the activation window's application name in the per-app settings path", () =>
    {
        const Resolved = Option.getOrThrow(Resolve(
            Activation(Id.Toggle, Windows.VK.TAB, Phase.Pressed),
            OverlayScreenId.FloatingHome,
            Option.some("Notepad")
        ));

        expect(Option.getOrThrow((Resolved as { Path: Option.Option<string>; }).Path))
            .toBe("PerAppSettings?Name=Notepad&Source=Overlay");
    });

    it("includes the activation window's executable path in the per-app settings path", () =>
    {
        const Resolved = Option.getOrThrow(Resolve(
            Activation(Id.Toggle, Windows.VK.TAB, Phase.Pressed),
            OverlayScreenId.FloatingHome,
            Option.some("Notepad"),
            Option.some(String.raw`C:\Windows\notepad.exe`)
        ));

        expect(Option.getOrThrow((Resolved as { Path: Option.Option<string>; }).Path))
            .toBe(
                "PerAppSettings?Name=Notepad&ExecutablePath=C%3A%5CWindows%5Cnotepad.exe"
                + "&Source=Overlay"
            );
    });

    it("does not invent commands for actions without command semantics", () =>
    {
        expect(Option.getOrThrow(Resolve(Activation(
            Id.Commit,
            Windows.VK.A,
            Phase.Pressed
        )))).toMatchObject({ _tag: "TileAll" });
        expect(Option.isNone(Resolve(Activation(
            Id.Back,
            Windows.VK.BROWSER_BACK,
            Phase.Pressed
        )))).toBe(true);
        expect(Option.isNone(Resolve(Activation(
            Id.Activate,
            Windows.VK.F20,
            Phase.Repeated
        )))).toBe(true);
    });

    it("resolves the primary modifier's held state from either shift key", () =>
    {
        const Pressed = Option.getOrThrow(Resolve({
            Keybind: Make(Id.PrimaryModifier, Windows.VK.SHIFT),
            KeyboardEvent: { } as Windows.Keyboard.Event,
            Phase: Phase.Pressed,
            PressedKeys: [ Windows.VK.LSHIFT ]
        }));
        const Released = Option.getOrThrow(Resolve({
            Keybind: Make(Id.PrimaryModifier, Windows.VK.SHIFT),
            KeyboardEvent: { } as Windows.Keyboard.Event,
            Phase: Phase.Released,
            PressedKeys: [ ]
        }));

        expect(Pressed).toMatchObject({ Held: true, _tag: "SetPrimaryModifierHeld" });
        expect(Released).toMatchObject({ Held: false, _tag: "SetPrimaryModifierHeld" });
    });

    it("shrinks while Ctrl is held and returns to growing when it is released", () =>
    {
        const Pressed = Option.getOrThrow(Resolve({
            Keybind: Make(Id.ResizeModifier, Windows.VK.CONTROL),
            KeyboardEvent: { } as Windows.Keyboard.Event,
            Phase: Phase.Pressed,
            PressedKeys: [ Windows.VK.LCONTROL ]
        }));
        const Released = Option.getOrThrow(Resolve({
            Keybind: Make(Id.ResizeModifier, Windows.VK.CONTROL),
            KeyboardEvent: { } as Windows.Keyboard.Event,
            Phase: Phase.Released,
            PressedKeys: [ ]
        }));

        expect(Pressed).toMatchObject({ Mode: ResizeMode.Shrink, _tag: "SetResizeMode" });
        expect(Released).toMatchObject({ Mode: ResizeMode.Grow, _tag: "SetResizeMode" });
    });
});

describe("CommandResolver.Live", () =>
{
    it("emits mapped commands in activation order and filters unresolved actions", async () =>
    {
        const HotkeyLive = Layer.succeed(Hotkey, {
            Matches: Stream.fromIterable([
                Activation(Id.Activate, Windows.VK.F20, Phase.Pressed),
                Activation(Id.Activate, Windows.VK.F20, Phase.Repeated),
                Activation(Id.Activate, Windows.VK.F20, Phase.Released),
                Activation(Id.Commit, Windows.VK.A, Phase.Pressed),
                Activation(Id.SelectLeft, Windows.VK.D, Phase.Pressed),
                Activation(Id.Cancel, Windows.VK.A, Phase.Pressed)
            ]),
            SetOverlayActive: (): Effect.Effect<void> => Effect.void
        });
        const Commands = await Effect.runPromise(pipe(
            Effect.gen(function*()
            {
                const Resolver = yield* CommandResolver;
                return Array.from(yield* Stream.runCollect(Resolver.Commands));
            }),
            Effect.provide(Live),
            Effect.provide(HomeSession),
            Effect.provide(HotkeyLive)
        ));

        expect(Commands.map((Command: Resolved) => Command._tag))
            .toEqual([
                "Activate",
                "Deactivate",
                "TileAll",
                "NavigateOverlayScreen",
                "Deactivate"
            ]);
    });
});

const HomeSession = Layer.succeed(OverlaySession.OverlaySession, {
    Back: Effect.void,
    Changes: Stream.succeed(OverlayScreenId.FloatingHome),
    ClearActivationWindow: Effect.void,
    ClearFocusPreview: Effect.void,
    ClearResizeRecoveryFailure: Effect.void,
    ClearTiledInsert: Effect.void,
    ClearTiledMovePanelTarget: Effect.void,
    Current: Effect.succeed(OverlayScreenId.FloatingHome),
    FineModifierHeld: Effect.succeed(false),
    FocusFailure: Effect.succeed(Option.none()),
    GetActivationApplicationExecutablePath: Effect.succeed(Option.none()),
    GetActivationApplicationName: Effect.succeed(Option.none()),
    GetActivationWindow: Effect.succeed(Option.none()),
    MoveTiledInsertSelection: () => Effect.void,
    Navigate: () => Effect.void,
    PreviewFocusTarget: () => Effect.void,
    PrimaryModifierHeld: Effect.succeed(false),
    RecordFocusFailure: () => Effect.void,
    RecordRaisedFloatingWindowZOrder: () => Effect.void,
    RecordResizeRecoveryFailure: Effect.void,
    RefreshTiledInsertWindows: Effect.void,
    Reset: Effect.void,
    ResizeMode: Effect.succeed(ResizeMode.Grow),
    ResolveFocusTarget: () => Effect.succeed(Option.none()),
    ResolveTiledFocusCommit: Effect.succeed(Option.none()),
    ResolveTiledFocusTarget: () => Effect.succeed(Option.none()),
    ResolveTiledMoveAction: () => Effect.succeed(Option.none()),
    ResolveTiledStackWindow: () => Effect.succeed(Option.none()),
    SelectedTiledInsertWindow: Effect.succeed(Option.none()),
    SetActivationWindow: () => Effect.void,
    SetFineModifierHeld: () => Effect.void,
    SetPrimaryModifierHeld: () => Effect.void,
    SetResizeMode: () => Effect.void,
    SetTiledFocusSelection: () => Effect.void,
    SetTiledInsertCaptureNext: () => Effect.void,
    SetTiledInsertDragActive: () => Effect.void,
    SetTiledInsertTarget: () => Effect.void,
    SetTiledMovePanelTarget: () => Effect.void,
    Snapshot: Effect.succeed({
        CanGoBack: false,
        Commands: [ ],
        Id: OverlayScreenId.FloatingHome
    }),
    TakeActivationWindow: Effect.succeed(Option.none()),
    TakeRaisedFloatingWindowZOrder: Effect.succeed(Option.none()),
    TiledInsertCaptureNext: Effect.succeed(false),
    TiledInsertDragActive: Effect.succeed(false),
    TiledInsertTarget: Effect.succeed(Option.none()),
    TiledResizeBehavior: Effect.succeed("PreserveRatios" as const),
    ToggleTiledResizeBehavior: Effect.void
});

const Activation = (
    InId: Id,
    Key: Windows.VK.VK,
    InPhase: PhaseType,
    PressedKeys: ReadonlyArray<Windows.VK.VK> = [ Key ]
): Match => ({
    Keybind: Make(InId, Key),
    KeyboardEvent:
    {
        IsRepeat: InPhase === Phase.Repeated,
        Key,
        State: { _tag: InPhase === Phase.Released ? "Up" : "Down" }
    } as Windows.Keyboard.Event,
    Phase: InPhase,
    PressedKeys
});
