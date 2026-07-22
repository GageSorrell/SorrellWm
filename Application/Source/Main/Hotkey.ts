/**
 *
 *
 * @module @sorrell/wm/Main/Hotkey
 *
 * @file      Hotkey.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Effect, HashSet, Layer, PubSub, Stream } from "effect";
import { type Keyboard as NativeKeyboard, VK } from "@sorrell/windows";
import { Keyboard } from "./Keyboard.js";

const TypeIdKey = "~sorrell/wm/Main/Hotkey" as const;

export/** The type identifier shared by all keybind values. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

export/** Identifiers understood by the future hotkey-action matcher. */
const Id = Object.freeze({
    Activate: "Activate",
    Commit: "Commit",
    CycleNext: "CycleNext",
    CyclePrevious: "CyclePrevious",
    SelectDown: "SelectDown",
    SelectLeft: "SelectLeft",
    SelectRight: "SelectRight",
    SelectUp: "SelectUp",
    Toggle: "Toggle"
} as const);

/** One of the application actions that can be associated with a keybind. */
export type Id = typeof Id[keyof typeof Id];

/** The modifier state required by a keybind. */
export interface Modifiers
{
    readonly Alt: boolean;
    readonly Control: boolean;
    readonly Shift: boolean;
    readonly Super: boolean;
}

/** Optional modifier settings accepted when constructing a keybind. */
export type ModifierOptions = Partial<Modifiers>;

/** A conventional keyboard shortcut: modifiers followed by one trigger key. */
export interface Keybind
{
    readonly [ TypeId ]: TypeId;
    readonly Id: Id;
    readonly Key: VK.VK;
    readonly Modifiers: Modifiers;
}

/** A collection of keybinds that should be matched simultaneously. */
export type KeybindSet = HashSet.HashSet<Keybind>;

export/** Construct an immutable keybind. */
const Make = (
    InId: Id,
    Key: VK.VK,
    Modifiers: ModifierOptions = { }
): Keybind => Object.freeze({
    Id: InId,
    Key,
    Modifiers: Object.freeze({
        Alt: Modifiers.Alt ?? false,
        Control: Modifiers.Control ?? false,
        Shift: Modifiers.Shift ?? false,
        Super: Modifiers.Super ?? false
    }),
    [ TypeId ]: TypeId as TypeId
});

export/**
       * Construct a KeybindSet.
       *
       * @category Constructor
       * @since 1.0.0
       */
const KeybindSet = (...Values: ReadonlyArray<Keybind>): KeybindSet =>
    HashSet.fromIterable<Keybind>(Values);

export/** The initial keybinds used by the application. */
const DefaultKeybinds: KeybindSet = KeybindSet(
    Make(Id.Activate, VK.F20)
);

/** A keybind activation produced from the current global keyboard state. */
export interface Match
{
    readonly Keybind: Keybind;
    readonly KeyboardEvent: NativeKeyboard.Event;
    readonly PressedKeys: ReadonlyArray<VK.VK>;
}

const IsAnyPressed = (PressedKeys: HashSet.HashSet<VK.VK>, Keys: HashSet.HashSet<VK.VK>): boolean =>
    HashSet.isEmpty(HashSet.intersection(PressedKeys, Keys));

const GetModifiers = (PressedKeys: HashSet.HashSet<VK.VK>): Modifiers => ({
    Alt: IsAnyPressed(PressedKeys, HashSet.fromIterable([ VK.MENU, VK.LMENU, VK.RMENU ])),
    Control: IsAnyPressed(PressedKeys, HashSet.fromIterable([ VK.CONTROL, VK.LCONTROL, VK.RCONTROL ])),
    Shift: IsAnyPressed(PressedKeys, HashSet.fromIterable([ VK.SHIFT, VK.LSHIFT, VK.RSHIFT ])),
    Super: IsAnyPressed(PressedKeys, HashSet.fromIterable([ VK.LWIN, VK.RWIN ]))
} as const);

export/** Determine whether a keybind matches a trigger and the currently held modifiers. */
const IsMatch = (
    Keybind: Keybind,
    TriggerKey: VK.VK,
    PressedKeys: HashSet.HashSet<VK.VK>
): boolean =>
{
    if (Keybind.Key !== TriggerKey)
    {
        return false;
    }

    const CurrentModifiers = GetModifiers(PressedKeys);

    return Keybind.Modifiers.Alt === CurrentModifiers.Alt
        && Keybind.Modifiers.Control === CurrentModifiers.Control
        && Keybind.Modifiers.Shift === CurrentModifiers.Shift
        && Keybind.Modifiers.Super === CurrentModifiers.Super;
};

interface HotkeyImpl
{
    readonly Matches: Stream.Stream<Match>;
}

/** A stream of keybind activations derived from the native keyboard stream. */
export class Hotkey extends Context.Service<Hotkey, HotkeyImpl>()(TypeIdKey) { }

const ProcessKeyboardEvent = (
    Keybinds: KeybindSet,
    MatchPubSub: PubSub.PubSub<Match>,
    PressedKeys: HashSet.HashSet<VK.VK>,
    KeyboardEvent: NativeKeyboard.Event
): void =>
{
    if (KeyboardEvent.State._tag === "Up")
    {
        PressedKeys = HashSet.remove(PressedKeys, KeyboardEvent.Key);
        return;
    }

    PressedKeys = HashSet.add(PressedKeys, KeyboardEvent.Key);
    const PressedKeysSnapshot = Object.freeze(Array.from(PressedKeys));

    for (const Keybind of Keybinds)
    {
        if (IsMatch(Keybind, KeyboardEvent.Key, PressedKeys))
        {
            PubSub.publishUnsafe(MatchPubSub, Object.freeze({
                Keybind,
                KeyboardEvent,
                PressedKeys: PressedKeysSnapshot
            }));
        }
    }
};

export/**
       * Construct a hotkey service that continuously matches the supplied keybinds.
       *
       * Each consumer of `Matches` receives every activation published after that
       * consumer starts running the stream.
       */
const Live = (Keybinds: KeybindSet) => Layer.effect(
    Hotkey,
    Effect.gen(function*()
    {
        const KeyboardService = yield* Keyboard;
        const KeyboardEvents = yield* KeyboardService.Events();
        const MatchPubSub = yield* Effect.acquireRelease(
            PubSub.unbounded<Match>(),
            PubSub.shutdown
        );
        const PressedKeys = HashSet.empty<VK.VK>();

        yield* KeyboardEvents.pipe(
            Stream.runForEach((KeyboardEvent: NativeKeyboard.Event) => Effect.sync(() =>
            {
                ProcessKeyboardEvent(Keybinds, MatchPubSub, PressedKeys, KeyboardEvent);
            })),
            Effect.forkScoped
        );

        return {
            Matches: Stream.fromPubSub(MatchPubSub)
        } as const;
    })
);
