/**
 *
 *
 * @module @sorrell/wm/Main/Input/Hotkey
 *
 * @file      Hotkey.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Effect, HashSet, Layer, PubSub, Schema, Stream, pipe } from "effect";
import { Keyboard as NativeKeyboard, VK } from "@sorrell/windows";
import { HotkeyId } from "../../Shared/Hotkey.ts";
import { Keyboard } from "./Keyboard.ts";

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
    Make(Id.Cancel, VK.ESCAPE),
    Make(Id.FineModifier, VK.MENU),
    Make(Id.PrimaryModifier, VK.SHIFT),
    Make(Id.ResizeModifier, VK.CONTROL),
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

const ModifierKeyFamilies: ReadonlyArray<ReadonlyArray<VK.VK>> = [
    [ VK.SHIFT, VK.LSHIFT, VK.RSHIFT ],
    [ VK.CONTROL, VK.LCONTROL, VK.RCONTROL ],
    [ VK.MENU, VK.LMENU, VK.RMENU ],
    [ VK.LWIN, VK.RWIN ]
];

/**
 * The set of physical keys that a keybind's trigger key represents. A bare
 * modifier trigger (e.g. `VK.SHIFT`) matches either its left or right variant,
 * since Windows only ever reports the specific variant as the physical key.
 */
const GetKeyFamily = (Key: VK.VK): ReadonlyArray<VK.VK> =>
    ModifierKeyFamilies.find((Family: ReadonlyArray<VK.VK>) =>
        Family.includes(Key)) ?? [ Key ];

const GetModifiers = (PressedKeys: ReadonlySet<VK.VK>): Modifiers => ({
    Alt: IsAnyPressed(PressedKeys, [ VK.MENU, VK.LMENU, VK.RMENU ]),
    Control: IsAnyPressed(PressedKeys, [ VK.CONTROL, VK.LCONTROL, VK.RCONTROL ]),
    Shift: IsAnyPressed(PressedKeys, [ VK.SHIFT, VK.LSHIFT, VK.RSHIFT ]),
    Super: IsAnyPressed(PressedKeys, [ VK.LWIN, VK.RWIN ])
} as const);

const NoSoftModifierKeys: ReadonlySet<VK.VK> = new Set();

export/** Determine whether a keybind matches a trigger and the currently held modifiers. */
const IsMatch = (
    Keybind: Keybind,
    TriggerKey: VK.VK,
    PressedKeys: ReadonlySet<VK.VK>,
    SoftModifierKeys: ReadonlySet<VK.VK> = NoSoftModifierKeys
): boolean =>
{
    const TriggerFamily = GetKeyFamily(Keybind.Key);

    if (!TriggerFamily.includes(TriggerKey))
    {
        return false;
    }

    // Exclude the trigger key's own family from the modifier comparison, so a
    // bare-modifier keybind (e.g. Shift alone) is not disqualified by its own
    // presence in `PressedKeys`.
    const ModifierKeys = new Set(PressedKeys);
    for (const Key of TriggerFamily)
    {
        ModifierKeys.delete(Key);
    }

    const HeldModifiers = GetModifiers(ModifierKeys);

    // Soft modifiers (the configured PrimaryModifier, e.g. Shift) represent an
    // application-level toggle rather than a traditional chord modifier, so
    // merely holding one must not block a keybind that doesn't itself require
    // it. Keybinds that do require the modifier are unaffected, since they are
    // still checked against the full, unfiltered held-modifier state.
    const ModifierKeysWithoutSoft = new Set(
        Array.from(ModifierKeys).filter((Key: VK.VK) => !SoftModifierKeys.has(Key))
    );
    const HeldModifiersWithoutSoft = GetModifiers(ModifierKeysWithoutSoft);

    const MatchesModifier = (Required: boolean, Held: boolean, HeldWithoutSoft: boolean): boolean =>
        Required ? Held : !HeldWithoutSoft;

    return MatchesModifier(Keybind.Modifiers.Alt, HeldModifiers.Alt, HeldModifiersWithoutSoft.Alt)
        && MatchesModifier(
            Keybind.Modifiers.Control,
            HeldModifiers.Control,
            HeldModifiersWithoutSoft.Control
        )
        && MatchesModifier(Keybind.Modifiers.Shift, HeldModifiers.Shift, HeldModifiersWithoutSoft.Shift)
        && MatchesModifier(Keybind.Modifiers.Super, HeldModifiers.Super, HeldModifiersWithoutSoft.Super);
};

export/** Determine whether any variant of a keybind's trigger key is currently held. */
const IsKeybindPressed = (
    Keybind: Keybind,
    PressedKeys: ReadonlyArray<VK.VK>
): boolean => GetKeyFamily(Keybind.Key).some((Key: VK.VK) => PressedKeys.includes(Key));

// The distance-toggle, fine-step, and resize-mode modifiers represent
// application-level toggles rather than traditional chord modifiers, so
// holding one must not block a keybind that doesn't itself require it.
const SoftModifierIds: ReadonlyArray<Id> = [
    Id.PrimaryModifier,
    Id.FineModifier,
    Id.ResizeModifier
];

/** The physical keys of whichever keybinds are currently bound to a soft modifier. */
const GetSoftModifierKeys = (Keybinds: KeybindSet): ReadonlySet<VK.VK> =>
{
    const Keys = new Set<VK.VK>();

    for (const Keybind of Keybinds)
    {
        if (!SoftModifierIds.includes(Keybind.Id))
        {
            continue;
        }

        for (const Key of GetKeyFamily(Keybind.Key))
        {
            Keys.add(Key);
        }
    }

    return Keys.size === 0 ? NoSoftModifierKeys : Keys;
};

/** Every physical key any configured keybind could trigger on, deduplicated. */
const GetSuppressedKeys = (Keybinds: KeybindSet): ReadonlyArray<VK.VK> =>
{
    const Keys = new Set<VK.VK>();

    for (const Keybind of Keybinds)
    {
        for (const Key of GetKeyFamily(Keybind.Key))
        {
            Keys.add(Key);
        }
    }

    return Array.from(Keys);
};

/**
 * The physical keys that must stay reserved even while the overlay is not
 * showing: only the keybind that summons it. Every other keybind (Cancel,
 * the directional keys, etc.) is meaningless outside the overlay, so
 * reserving it globally would only ever steal keystrokes from other
 * applications for no benefit — Escape in particular is relied on by nearly
 * every other Windows application.
 */
const GetIdleSuppressedKeys = (Keybinds: KeybindSet): ReadonlyArray<VK.VK> =>
{
    const Keys = new Set<VK.VK>();

    for (const Keybind of Keybinds)
    {
        if (Keybind.Id !== Id.Activate)
        {
            continue;
        }

        for (const Key of GetKeyFamily(Keybind.Key))
        {
            Keys.add(Key);
        }
    }

    return Array.from(Keys);
};

interface HotkeyImpl
{
    readonly Matches: Stream.Stream<Match>;

    /**
     * Widen or narrow which configured keybinds are reserved from foreign
     * foreground applications. While inactive (the overlay is not showing),
     * only the Activate keybind stays reserved, so summoning the overlay
     * keeps working from anywhere without also hijacking keys like Escape
     * that other applications need for their own purposes.
     */
    readonly SetOverlayActive: (Active: boolean) => Effect.Effect<void>;
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
    const SoftModifierKeys = GetSoftModifierKeys(Keybinds);
    const KeybindMatches = KeyboardEvent.IsRepeat
        ? ActiveMatches.get(KeyboardEvent.Key) ?? [ ]
        : Array.from(Keybinds).filter((Keybind: Keybind) =>
            IsMatch(Keybind, KeyboardEvent.Key, PressedKeys, SoftModifierKeys));

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
       * A keybind stream must emit its current value when subscribed.  Each later
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

            let LatestKeybinds: KeybindSet = HashSet.empty();
            let IsOverlayActive = false;

            // Reserve either every configured hotkey's physical keys (while the
            // overlay is showing) or only the Activate keybind's (otherwise), so
            // the native hook stops forwarding reserved keys to whatever foreign
            // application currently has OS keyboard focus, without permanently
            // hijacking keys like Escape that other applications rely on.
            const SyncSuppressedKeys = (): void =>
            {
                NativeKeyboard.SetSuppressedKeys(
                    IsOverlayActive
                        ? GetSuppressedKeys(LatestKeybinds)
                        : GetIdleSuppressedKeys(LatestKeybinds)
                );
            };

            yield* pipe(
                Keybinds,
                Stream.switchMap((CurrentKeybinds: KeybindSet) =>
                {
                    LatestKeybinds = CurrentKeybinds;
                    SyncSuppressedKeys();

                    return pipe(
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
                    );
                }),
                Stream.runDrain,
                Effect.forkScoped
            );

            return {
                Matches: Stream.fromPubSub(MatchPubSub),
                SetOverlayActive: (Active: boolean) => Effect.sync(() =>
                {
                    IsOverlayActive = Active;
                    SyncSuppressedKeys();
                })
            } as const;
        })
    );
};
