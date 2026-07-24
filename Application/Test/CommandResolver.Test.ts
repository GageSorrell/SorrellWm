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

import * as OverlaySession from "../Source/Main/Overlay/Session.ts";
import * as Windows from "@sorrell/windows";
import {
    CommandResolver,
    Live,
    Resolve,
    type Resolved
} from "../Source/Main/Command/Resolver.ts";
import { Effect, Layer, Option, Stream, pipe } from "effect";
import {
    Hotkey,
    Id,
    Make,
    type Match,
    Phase,
    type Phase as PhaseType
} from "../Source/Main/Input/Hotkey.ts";
import { describe, expect, it, vi } from "vitest";
import { OverlayScreenId } from "../Source/Shared/OverlayCommand.js";

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
        VK: [ 0x41, 0x44, 0x48, 0x4A, 0x4B, 0x4C, 0x4E, 0x54, 0x83, 0xA6 ]
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
            [ Id.SelectUp, Windows.VK.H, "Insert" ],
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
            ScreenId: "Focus",
            _tag: "NavigateOverlayScreen"
        });
        expect(Commands.slice(1)).toMatchObject(Mappings.slice(1).map((
            [ , , Id ]: typeof Mappings[number]
        ) => ({
            Category: "Ui",
            Id,
            _tag: "NoOpOverlayCommand"
        })));
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
            OverlayScreenId.Focus
        )))).toMatchObject(Mappings.map((
            [ , , CommandId ]: typeof Mappings[number]
        ) => ({
            Category: "Ui",
            Id: CommandId,
            _tag: "NoOpOverlayCommand"
        })));

        expect(Option.getOrThrow(Resolve(
            Activation(Id.Back, Windows.VK.BROWSER_BACK, Phase.Pressed),
            OverlayScreenId.Focus
        ))).toMatchObject({ Category: "Ui", _tag: "BackOverlayScreen" });
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
});

describe("CommandResolver.Live", () =>
{
    it("emits mapped commands in activation order and filters unresolved actions", async() =>
    {
        const HotkeyLive = Layer.succeed(Hotkey, {
            Matches: Stream.fromIterable([
                Activation(Id.Activate, Windows.VK.F20, Phase.Pressed),
                Activation(Id.Activate, Windows.VK.F20, Phase.Repeated),
                Activation(Id.Activate, Windows.VK.F20, Phase.Released),
                Activation(Id.Commit, Windows.VK.A, Phase.Pressed),
                Activation(Id.SelectLeft, Windows.VK.D, Phase.Pressed),
                Activation(Id.Cancel, Windows.VK.A, Phase.Pressed)
            ])
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
    Changes: Stream.succeed(OverlayScreenId.Home),
    ClearActivationWindow: Effect.void,
    ClearFocusPreview: Effect.void,
    Current: Effect.succeed(OverlayScreenId.Home),
    Navigate: () => Effect.void,
    PreviewFocusTarget: () => Effect.void,
    Reset: Effect.void,
    ResolveFocusTarget: () => Effect.succeed(Option.none()),
    SetActivationWindow: () => Effect.void,
    Snapshot: Effect.succeed({ CanGoBack: false, Commands: [ ], Id: OverlayScreenId.Home }),
    TakeActivationWindow: Effect.succeed(Option.none())
});

const Activation = (InId: Id, Key: Windows.VK.VK, InPhase: PhaseType): Match => ({
    Keybind: Make(InId, Key),
    KeyboardEvent:
    {
        IsRepeat: InPhase === Phase.Repeated,
        Key,
        State: { _tag: InPhase === Phase.Released ? "Up" : "Down" }
    } as Windows.Keyboard.Event,
    Phase: InPhase,
    PressedKeys: [ Key ]
});
