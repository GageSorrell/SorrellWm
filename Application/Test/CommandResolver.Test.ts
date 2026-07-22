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

import * as Windows from "@sorrell/windows";
import {
    CommandResolver,
    Live,
    Resolve,
    type Resolved
} from "../Source/Main/CommandResolver.js";
import { Effect, Layer, Option, Stream, pipe } from "effect";
import {
    Hotkey,
    Id,
    Make,
    type Match,
    Phase,
    type Phase as PhaseType
} from "../Source/Main/Hotkey.js";
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
        CONTROL: 0x11,
        F20: 0x83,
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
        VK: [ 0x41, 0x83 ]
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

    it("does not invent commands for actions without command semantics", () =>
    {
        expect(Option.isNone(Resolve(Activation(
            Id.Commit,
            Windows.VK.A,
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
            Effect.provide(HotkeyLive)
        ));

        expect(Commands.map((Command: Resolved) => Command._tag))
            .toEqual([ "Activate", "Deactivate" ]);
    });
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
