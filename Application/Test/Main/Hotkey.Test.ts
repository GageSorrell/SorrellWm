/**
 *
 *
 * @module @sorrell/wm/Main/HotkeyTest
 *
 * @file      HotkeyTest.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Windows from "@sorrell/windows";
import {
    DefaultKeybindSettings,
    Hotkey,
    type Match as HotkeyMatch,
    Id,
    IsMatch,
    type Keybind,
    KeybindSet,
    type KeybindSet as KeybindSetType,
    Live,
    Make,
    Phase,
    ToSetting
} from "../../Source/Main/Input/Hotkey.ts";
import {
    Deferred,
    Effect,
    Fiber,
    Layer,
    Option,
    Queue,
    Stream,
    SubscriptionRef,
    pipe
} from "effect";
import { describe, expect, it, vi } from "vitest";
import { Keyboard } from "../../Source/Main/Input/Keyboard.ts";

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
        VK: [ 0x41, 0x48, 0x4A, 0x4B, 0x4C, 0x83, 0xA6 ]
    }
}));

describe("Hotkey.IsMatch", () =>
{
    it("binds the Back action to the browser previous key by default", () =>
    {
        expect(DefaultKeybindSettings).toContainEqual({
            Id: Id.Back,
            Key: Windows.VK.BROWSER_BACK,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        });
    });

    it("matches either side of each requested modifier", () =>
    {
        const Keybind = Make(Id.Toggle, Windows.VK.A, {
            Control: true,
            Shift: true
        });
        const PressedKeys = new Set<Windows.VK.VK>([
            Windows.VK.RCONTROL,
            Windows.VK.LSHIFT,
            Windows.VK.A
        ]);

        expect(IsMatch(Keybind, Windows.VK.A, PressedKeys)).toBe(true);
    });

    it("rejects an unrequested modifier", () =>
    {
        const Keybind = Make(Id.Toggle, Windows.VK.A, { Control: true });
        const PressedKeys = new Set<Windows.VK.VK>([
            Windows.VK.LCONTROL,
            Windows.VK.LMENU,
            Windows.VK.A
        ]);

        expect(IsMatch(Keybind, Windows.VK.A, PressedKeys)).toBe(false);
    });

    it("only matches the keybind trigger", () =>
    {
        const Keybind = Make(Id.Toggle, Windows.VK.A);

        expect(IsMatch(
            Keybind,
            Windows.VK.F20,
            new Set([ Windows.VK.F20 ])
        )).toBe(false);
    });
});

describe("Hotkey.Live", () =>
{
    it("uses keybind updates without recreating the keyboard event source", async () =>
    {
        const InitialKeybind = Make(Id.Activate, Windows.VK.F20);
        const UpdatedKeybind = Make(Id.Toggle, Windows.VK.A);

        const MatchedIds = await Effect.runPromise(Effect.scoped(Effect.gen(function*()
        {
            const EventQueue = yield* Queue.unbounded<Windows.Keyboard.Event>();
            const KeybindRef = yield* SubscriptionRef.make(KeybindSet(InitialKeybind));
            const UpdateObserved = yield* Deferred.make<void>();
            let EventSourceSubscriptions: number = 0;
            const Keybinds = pipe(
                SubscriptionRef.changes(KeybindRef),
                Stream.tap((Current: KeybindSetType) => Array.from(Current).some(
                    (Keybind: Keybind) => Keybind.Id === Id.Toggle
                )
                    ? Deferred.succeed(UpdateObserved, undefined)
                    : Effect.void)
            );
            const KeyboardLive = Layer.succeed(Keyboard, {
                Events: () => Effect.sync(() =>
                {
                    EventSourceSubscriptions += 1;
                    return Stream.fromQueue(EventQueue);
                })
            });

            const Program = Effect.gen(function*()
            {
                const Service = yield* Hotkey;
                const NextMatch = () => pipe(
                    Service.Matches,
                    Stream.runHead,
                    Effect.map(Option.getOrThrow),
                    Effect.forkChild
                );
                const FirstMatch = yield* NextMatch();

                yield* Effect.yieldNow;
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.F20));
                const FirstId = (yield* Fiber.join(FirstMatch)).Keybind.Id;

                yield* SubscriptionRef.set(KeybindRef, KeybindSet(UpdatedKeybind));
                yield* Deferred.await(UpdateObserved);

                const SecondMatch = yield* NextMatch();
                yield* Effect.yieldNow;
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.F20));
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.A));
                const SecondId = (yield* Fiber.join(SecondMatch)).Keybind.Id;

                return [ FirstId, SecondId, EventSourceSubscriptions ] as const;
            });

            return yield* pipe(
                Program,
                Effect.provide(Live(Keybinds)),
                Effect.provide(KeyboardLive)
            );
        })));

        expect(MatchedIds).toEqual([ Id.Activate, Id.Toggle, 1 ]);
        expect(ToSetting(UpdatedKeybind)).toEqual({
            Id: Id.Toggle,
            Key: Windows.VK.A,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        });
    });

    it("emits press, repeat, and release for the keybind matched on initial key-down", async () =>
    {
        const ActivationKeybind = Make(Id.Activate, Windows.VK.F20, { Control: true });
        const Matches = await Effect.runPromise(Effect.scoped(Effect.gen(function*()
        {
            const EventQueue = yield* Queue.unbounded<Windows.Keyboard.Event>();
            const KeyboardLive = Layer.succeed(Keyboard, {
                Events: () => Effect.succeed(Stream.fromQueue(EventQueue))
            });
            const Program = Effect.gen(function*()
            {
                const Service = yield* Hotkey;
                const Collected = yield* pipe(
                    Service.Matches,
                    Stream.take(3),
                    Stream.runCollect,
                    Effect.forkChild
                );

                yield* Effect.yieldNow;
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.LCONTROL));
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.F20));
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.F20, "Down", true));
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.LCONTROL, "Up"));
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.F20, "Up"));

                return Array.from(yield* Fiber.join(Collected));
            });

            return yield* pipe(
                Program,
                Effect.provide(Live(KeybindSet(ActivationKeybind))),
                Effect.provide(KeyboardLive)
            );
        })));

        expect(Matches.map((Match: HotkeyMatch) => Match.Phase)).toEqual([
            Phase.Pressed,
            Phase.Repeated,
            Phase.Released
        ]);
        expect(Matches.every((Match: HotkeyMatch) => Match.Keybind === ActivationKeybind))
            .toBe(true);
        expect(Matches[2]?.PressedKeys).not.toContain(Windows.VK.LCONTROL);
    });
});

const KeyboardEvent = (
    Key: Windows.VK.VK,
    State: "Down" | "Up" = "Down",
    IsRepeat: boolean = false
): Windows.Keyboard.Event => ({
    IsRepeat,
    Key,
    State: { _tag: State }
} as Windows.Keyboard.Event);
