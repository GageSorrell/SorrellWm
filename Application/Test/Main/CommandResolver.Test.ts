/**
 *
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
import { describe, expect, it, vi } from "vitest";
import { OverlayScreenId, ResizeMode } from "../../Source/Shared/OverlayCommand.ts";

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
        N: 0x4E,
        RCONTROL: 0xA3,
        RMENU: 0xA5,
        RSHIFT: 0xA1,
        RWIN: 0x5C,
        SHIFT: 0x10,
        T: 0x54,
        TAB: 0x09,
        VK: [ 0x09, 0x41, 0x44, 0x48, 0x4A, 0x4B, 0x4C, 0x4E, 0x54, 0x83, 0xA6 ]
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
    });

    it("keeps tiled Home actions on Home and gives Shift plus SelectUp to Float", () =>
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

        expect(Insert).toMatchObject({
            Id: "Insert",
            _tag: "NoOpOverlayCommand"
        });
        expect(Float).toMatchObject({
            Id: "Float",
            _tag: "NoOpOverlayCommand"
        });
        expect(Focus).toMatchObject({
            Id: "Focus",
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
            .toBe("PerAppSettings");
    });

    it("includes the activation window's application name in the per-app settings path", () =>
    {
        const Resolved = Option.getOrThrow(Resolve(
            Activation(Id.Toggle, Windows.VK.TAB, Phase.Pressed),
            OverlayScreenId.FloatingHome,
            Option.some("Notepad")
        ));

        expect(Option.getOrThrow((Resolved as { Path: Option.Option<string>; }).Path))
            .toBe("PerAppSettings?Name=Notepad");
    });

    it("does not invent commands for actions without command semantics", () =>
    {
        expect(Option.isNone(Resolve(Activation(
            Id.Commit,
            Windows.VK.A,
            Phase.Pressed
        )))).toBe(true);
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
            .toEqual([ "Activate", "Deactivate", "NavigateOverlayScreen", "Deactivate" ]);
    });
});

const HomeSession = Layer.succeed(OverlaySession.OverlaySession, {
    Back: Effect.void,
    Changes: Stream.succeed(OverlayScreenId.FloatingHome),
    ClearActivationWindow: Effect.void,
    ClearFocusPreview: Effect.void,
    Current: Effect.succeed(OverlayScreenId.FloatingHome),
    FineModifierHeld: Effect.succeed(false),
    FocusFailure: Effect.succeed(Option.none()),
    GetActivationApplicationName: Effect.succeed(Option.none()),
    GetActivationWindow: Effect.succeed(Option.none()),
    Navigate: () => Effect.void,
    PreviewFocusTarget: () => Effect.void,
    PrimaryModifierHeld: Effect.succeed(false),
    RecordFocusFailure: () => Effect.void,
    Reset: Effect.void,
    ResizeMode: Effect.succeed(ResizeMode.Grow),
    ResolveFocusTarget: () => Effect.succeed(Option.none()),
    SetActivationWindow: () => Effect.void,
    SetFineModifierHeld: () => Effect.void,
    SetPrimaryModifierHeld: () => Effect.void,
    SetResizeMode: () => Effect.void,
    Snapshot: Effect.succeed({
        CanGoBack: false,
        Commands: [ ],
        Id: OverlayScreenId.FloatingHome
    }),
    TakeActivationWindow: Effect.succeed(Option.none())
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
