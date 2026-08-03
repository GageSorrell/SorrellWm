/**
 * Tests keybind matching, lifecycle phases, rebinding, and key suppression.
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
    IsKeybindPressed,
    IsMatch,
    type Keybind,
    KeybindSet,
    type KeybindSet as KeybindSetType,
    type KeybindSetting,
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
        SetSuppressedKeys: (): void => undefined,
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
        RCONTROL: 0xA3,
        RETURN: 0x0D,
        RMENU: 0xA5,
        RSHIFT: 0xA1,
        RWIN: 0x5C,
        SHIFT: 0x10,
        VK: [
            0x0D,
            0x11,
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
            0x83,
            0xA6
        ]
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

    it("binds the resize-mode modifier to Ctrl by default", () =>
    {
        expect(DefaultKeybindSettings).toContainEqual({
            Id: Id.ResizeModifier,
            Key: Windows.VK.CONTROL,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        });
    });

    it("binds the Commit action to Enter by default", () =>
    {
        expect(DefaultKeybindSettings).toContainEqual({
            Id: Id.Commit,
            Key: Windows.VK.RETURN,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        });
    });

    it("binds first and last selection to Home and End", () =>
    {
        expect(DefaultKeybindSettings).toContainEqual({
            Id: Id.SelectFirst,
            Key: Windows.VK.HOME,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        });
        expect(DefaultKeybindSettings).toContainEqual({
            Id: Id.SelectLast,
            Key: Windows.VK.END,
            Modifiers:
            {
                Alt: false,
                Control: false,
                Shift: false,
                Super: false
            }
        });
    });

    it("binds monitor selection to the matching number-row digits", () =>
    {
        expect(DefaultKeybindSettings.filter((Setting: KeybindSetting) =>
            Setting.Id.startsWith("SelectMonitor")
        ).map((Setting: KeybindSetting) => ({
            Id: Setting.Id,
            Key: Setting.Key
        }))).toEqual([
            { Id: Id.SelectMonitor1, Key: Windows.VK.D1 },
            { Id: Id.SelectMonitor2, Key: Windows.VK.D2 },
            { Id: Id.SelectMonitor3, Key: Windows.VK.D3 },
            { Id: Id.SelectMonitor4, Key: Windows.VK.D4 },
            { Id: Id.SelectMonitor5, Key: Windows.VK.D5 },
            { Id: Id.SelectMonitor6, Key: Windows.VK.D6 },
            { Id: Id.SelectMonitor7, Key: Windows.VK.D7 },
            { Id: Id.SelectMonitor8, Key: Windows.VK.D8 },
            { Id: Id.SelectMonitor9, Key: Windows.VK.D9 }
        ]);
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

    it("matches a bare-modifier keybind against either physical variant", () =>
    {
        const Keybind = Make(Id.PrimaryModifier, Windows.VK.SHIFT);

        expect(IsMatch(
            Keybind,
            Windows.VK.LSHIFT,
            new Set([ Windows.VK.LSHIFT ])
        )).toBe(true);
        expect(IsMatch(
            Keybind,
            Windows.VK.RSHIFT,
            new Set([ Windows.VK.RSHIFT ])
        )).toBe(true);
    });

    it("does not disqualify a bare-modifier keybind by its own held state", () =>
    {
        const Keybind = Make(Id.PrimaryModifier, Windows.VK.SHIFT);

        // Without excluding the trigger's own family from the modifier
        // comparison, `PressedKeys` containing LSHIFT would make `Shift`
        // appear as an unrequested held modifier and the match would fail.
        expect(IsMatch(
            Keybind,
            Windows.VK.LSHIFT,
            new Set([ Windows.VK.LSHIFT ])
        )).toBe(true);
    });

    it("does not let a held soft modifier block a keybind that doesn't require it", () =>
    {
        const SelectLeft = Make(Id.SelectLeft, Windows.VK.D);
        const PressedKeys = new Set<Windows.VK.VK>([ Windows.VK.LSHIFT, Windows.VK.D ]);
        const SoftModifierKeys = new Set<Windows.VK.VK>([
            Windows.VK.SHIFT,
            Windows.VK.LSHIFT,
            Windows.VK.RSHIFT
        ]);

        expect(IsMatch(SelectLeft, Windows.VK.D, PressedKeys, SoftModifierKeys)).toBe(true);
        // Without the soft-modifier exemption (the default when none is
        // supplied), a held Shift would incorrectly block this keybind.
        expect(IsMatch(SelectLeft, Windows.VK.D, PressedKeys)).toBe(false);
    });

    it("still requires an explicitly-configured soft modifier to be held", () =>
    {
        const ShiftD = Make(Id.SelectLeft, Windows.VK.D, { Shift: true });
        const SoftModifierKeys = new Set<Windows.VK.VK>([
            Windows.VK.SHIFT,
            Windows.VK.LSHIFT,
            Windows.VK.RSHIFT
        ]);

        expect(IsMatch(
            ShiftD,
            Windows.VK.D,
            new Set([ Windows.VK.LSHIFT, Windows.VK.D ]),
            SoftModifierKeys
        )).toBe(true);
        expect(IsMatch(
            ShiftD,
            Windows.VK.D,
            new Set([ Windows.VK.D ]),
            SoftModifierKeys
        )).toBe(false);
    });
});

describe("Hotkey.IsKeybindPressed", () =>
{
    it("reports held while either shift variant remains pressed", () =>
    {
        const Keybind = Make(Id.PrimaryModifier, Windows.VK.SHIFT);

        expect(IsKeybindPressed(Keybind, [ Windows.VK.LSHIFT ])).toBe(true);
        expect(IsKeybindPressed(Keybind, [ Windows.VK.RSHIFT ])).toBe(true);
        expect(IsKeybindPressed(Keybind, [ ])).toBe(false);
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

    it("still matches an unmodified keybind while the PrimaryModifier is held", async () =>
    {
        const PrimaryModifierKeybind = Make(Id.PrimaryModifier, Windows.VK.SHIFT);
        const SelectLeft = Make(Id.SelectLeft, Windows.VK.D);
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
                    Stream.take(2),
                    Stream.runCollect,
                    Effect.forkChild
                );

                yield* Effect.yieldNow;
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.LSHIFT));
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.D));

                return Array.from(yield* Fiber.join(Collected));
            });

            return yield* pipe(
                Program,
                Effect.provide(Live(KeybindSet(PrimaryModifierKeybind, SelectLeft))),
                Effect.provide(KeyboardLive)
            );
        })));

        expect(Matches.map((Match: HotkeyMatch) => Match.Keybind.Id)).toEqual([
            Id.PrimaryModifier,
            Id.SelectLeft
        ]);
    });

    it("still emits SelectUp while the Ctrl resize modifier is held", async () =>
    {
        const ResizeModifier = Make(Id.ResizeModifier, Windows.VK.CONTROL);
        const SelectUp = Make(Id.SelectUp, Windows.VK.H);
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
                    Stream.take(2),
                    Stream.runCollect,
                    Effect.forkChild
                );

                yield* Effect.yieldNow;
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.LCONTROL));
                yield* Queue.offer(EventQueue, KeyboardEvent(Windows.VK.H));

                return Array.from(yield* Fiber.join(Collected));
            });

            return yield* pipe(
                Program,
                Effect.provide(Live(KeybindSet(ResizeModifier, SelectUp))),
                Effect.provide(KeyboardLive)
            );
        })));

        expect(Matches.map((Match: HotkeyMatch) => Match.Keybind.Id)).toEqual([
            Id.ResizeModifier,
            Id.SelectUp
        ]);
        expect(Matches[1]?.PressedKeys).toContain(Windows.VK.LCONTROL);
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
