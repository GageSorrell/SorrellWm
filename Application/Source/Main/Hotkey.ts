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

import { Context, Effect, HashSet, Layer, PubSub, Schema, Stream, pipe } from "effect";
import { type Keyboard as NativeKeyboard, VK } from "@sorrell/windows";
import { HotkeyId } from "../Shared/Hotkey.js";
import { Keyboard } from "./Keyboard.js";

const TypeIdKey = "~sorrell/wm/Main/Hotkey" as const;

export/** The type identifier shared by all keybind values. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

export/** Identifiers understood by the hotkey-action matcher. */
const Id = HotkeyId;

/** One of the application actions that can be associated with a keybind. */
export type Id = HotkeyId;

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

export/** The JSON-compatible schema used to persist keybind modifiers. */
const ModifiersSchema = Schema.Struct({
    Alt: Schema.Boolean,
    Control: Schema.Boolean,
    Shift: Schema.Boolean,
    Super: Schema.Boolean
});

export/** The JSON-compatible schema used to persist a keybind. */
const KeybindSettingSchema = Schema.Struct({
    Id: Schema.Literals(Object.values(Id)),
    Key: Schema.Literals(VK.VK),
    Modifiers: ModifiersSchema
});

/** A validated keybind value as it appears in application settings. */
export type KeybindSetting = typeof KeybindSettingSchema.Type;

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

export/** Construct a runtime keybind from its persisted representation. */
const FromSetting = (Setting: KeybindSetting): Keybind =>
    Make(Setting.Id, Setting.Key, Setting.Modifiers);

export/** Convert a runtime keybind to its persisted representation. */
const ToSetting = (Keybind: Keybind): KeybindSetting => Object.freeze({
    Id: Keybind.Id,
    Key: Keybind.Key,
    Modifiers: Keybind.Modifiers
});

export/**
       * Construct a KeybindSet.
       *
       * @category Constructor
       * @since 1.0.0
       */
const KeybindSet = (...Values: ReadonlyArray<Keybind>): KeybindSet =>
    HashSet.fromIterable<Keybind>(Values);

export/** Construct a KeybindSet from application-settings values. */
const KeybindSetFromSettings = (Values: ReadonlyArray<KeybindSetting>): KeybindSet =>
    KeybindSet(...Values.map(FromSetting));

const DefaultKeybindValues: ReadonlyArray<Keybind> = Object.freeze([
    Make(Id.Activate, VK.F20),
    Make(Id.Back, VK.BROWSER_BACK),
    Make(Id.SelectLeft, VK.D),
    Make(Id.SelectUp, VK.H),
    Make(Id.SelectDown, VK.T),
    Make(Id.SelectRight, VK.N),
    Make(Id.Toggle, VK.TAB)
]);

export/** The initial keybinds used by the application. */
const DefaultKeybinds: KeybindSet = KeybindSet(...DefaultKeybindValues);

export/** {@inheritDoc DefaultKeybinds} */
const DefaultKeybindSettings = Object.freeze(DefaultKeybindValues.map(ToSetting));

export/** Add newly introduced default actions without replacing customized keybinds. */
const WithDefaultKeybindSettings = (
    Values: ReadonlyArray<KeybindSetting>
): ReadonlyArray<KeybindSetting> =>
{
    const ConfiguredIds = new Set(Values.map((Value: KeybindSetting) => Value.Id));
    const MissingDefaults = DefaultKeybindSettings.filter((Value: KeybindSetting) =>
        !ConfiguredIds.has(Value.Id));

    return MissingDefaults.length === 0
        ? Values
        : Object.freeze([ ...Values, ...MissingDefaults ]);
};

export/** The phase of a matched hotkey's physical key lifecycle. */
const Phase = Object.freeze({
    Pressed: "Pressed" as const,
    Released: "Released" as const,
    Repeated: "Repeated" as const
});

/** One phase of a matched hotkey's physical key lifecycle. */
export type Phase = typeof Phase[keyof typeof Phase];

/** A keybind transition produced from the current global keyboard state. */
export interface Match
{
    readonly Keybind: Keybind;
    readonly KeyboardEvent: NativeKeyboard.Event;
    readonly Phase: Phase;
    readonly PressedKeys: ReadonlyArray<VK.VK>;
}

const IsAnyPressed = (PressedKeys: ReadonlySet<VK.VK>, Keys: ReadonlyArray<VK.VK>): boolean =>
    Keys.some((Key: VK.VK) => PressedKeys.has(Key));

const GetModifiers = (PressedKeys: ReadonlySet<VK.VK>): Modifiers => ({
    Alt: IsAnyPressed(PressedKeys, [ VK.MENU, VK.LMENU, VK.RMENU ]),
    Control: IsAnyPressed(PressedKeys, [ VK.CONTROL, VK.LCONTROL, VK.RCONTROL ]),
    Shift: IsAnyPressed(PressedKeys, [ VK.SHIFT, VK.LSHIFT, VK.RSHIFT ]),
    Super: IsAnyPressed(PressedKeys, [ VK.LWIN, VK.RWIN ])
} as const);

export/** Determine whether a keybind matches a trigger and the currently held modifiers. */
const IsMatch = (
    Keybind: Keybind,
    TriggerKey: VK.VK,
    PressedKeys: ReadonlySet<VK.VK>
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
    ActiveMatches: Map<VK.VK, ReadonlyArray<Keybind>>,
    PressedKeys: Set<VK.VK>,
    KeyboardEvent: NativeKeyboard.Event
): void =>
{
    if (KeyboardEvent.State._tag === "Up")
    {
        PressedKeys.delete(KeyboardEvent.Key);
        const KeybindMatches = ActiveMatches.get(KeyboardEvent.Key) ?? [ ];
        ActiveMatches.delete(KeyboardEvent.Key);
        const PressedKeysSnapshot = Object.freeze(Array.from(PressedKeys));

        for (const Keybind of KeybindMatches)
        {
            PubSub.publishUnsafe(MatchPubSub, Object.freeze({
                Keybind,
                KeyboardEvent,
                Phase: Phase.Released,
                PressedKeys: PressedKeysSnapshot
            }));
        }

        return;
    }

    PressedKeys.add(KeyboardEvent.Key);
    const PressedKeysSnapshot = Object.freeze(Array.from(PressedKeys));
    const KeybindMatches = KeyboardEvent.IsRepeat
        ? ActiveMatches.get(KeyboardEvent.Key) ?? [ ]
        : Array.from(Keybinds).filter((Keybind: Keybind) =>
            IsMatch(Keybind, KeyboardEvent.Key, PressedKeys));

    if (!KeyboardEvent.IsRepeat)
    {
        if (KeybindMatches.length === 0)
        {
            ActiveMatches.delete(KeyboardEvent.Key);
        }
        else
        {
            ActiveMatches.set(KeyboardEvent.Key, KeybindMatches);
        }
    }

    for (const Keybind of KeybindMatches)
    {
        PubSub.publishUnsafe(MatchPubSub, Object.freeze({
            Keybind,
            KeyboardEvent,
            Phase: KeyboardEvent.IsRepeat ? Phase.Repeated : Phase.Pressed,
            PressedKeys: PressedKeysSnapshot
        }));
    }
};

export/**
       * Construct a hotkey service that continuously matches the latest supplied keybinds.
       *
       * A keybind stream must emit its current value when subscribed. Each later
       * emission replaces the active keybinds without recreating the keyboard hook.
       * A fixed KeybindSet remains supported for callers that do not need rebinding.
       *
       * Each consumer of `Matches` receives every activation published after that
       * consumer starts running the stream.
       */
const Live = (Source: KeybindSet | Stream.Stream<KeybindSet>) =>
{
    const Keybinds: Stream.Stream<KeybindSet> = Stream.isStream(Source)
        ? Source
        : Stream.succeed(Source);

    return Layer.effect(
        Hotkey,
        Effect.gen(function*()
        {
            const KeyboardService = yield* Keyboard;
            const KeyboardEvents = yield* KeyboardService.Events();
            const MatchPubSub = yield* Effect.acquireRelease(
                PubSub.unbounded<Match>(),
                PubSub.shutdown
            );
            const ActiveMatches = new Map<VK.VK, ReadonlyArray<Keybind>>();
            const PressedKeys = new Set<VK.VK>();

            yield* pipe(
                Keybinds,
                Stream.switchMap((CurrentKeybinds: KeybindSet) => pipe(
                    KeyboardEvents,
                    Stream.map((KeyboardEvent: NativeKeyboard.Event) =>
                    {
                        ProcessKeyboardEvent(
                            CurrentKeybinds,
                            MatchPubSub,
                            ActiveMatches,
                            PressedKeys,
                            KeyboardEvent
                        );
                    })
                )),
                Stream.runDrain,
                Effect.forkScoped
            );

            return {
                Matches: Stream.fromPubSub(MatchPubSub)
            } as const;
        })
    );
};
