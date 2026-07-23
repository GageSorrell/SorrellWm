/**
 * Main-process ownership of the overlay's navigation state.
 *
 * @module @sorrell/wm/Main/OverlaySession
 *
 * @file      OverlaySession.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AppSettings from "./AppSettings.js";
import * as OverlayCommandCatalog from "./OverlayCommandCatalog.js";
import { Context, Effect, Layer, Stream, SubscriptionRef } from "effect";
import type { OverlayScreenDto, OverlayScreenId } from "../Shared/OverlayCommand.js";
import { OverlayScreenId as ScreenId } from "../Shared/OverlayCommand.js";

const TypeId = "~sorrell/wm/Main/OverlaySession" as const;

/** Operations exposed by the main-owned overlay navigation session. */
export interface OverlaySessionImpl
{
    /** The current overlay screen. */
    readonly Current: Effect.Effect<OverlayScreenId>;

    /** Every current and future overlay-screen selection. */
    readonly Changes: Stream.Stream<OverlayScreenId>;

    /** Return to the preceding screen when one exists. */
    readonly Back: Effect.Effect<void>;

    /** Navigate to a child overlay screen. */
    readonly Navigate: (Screen: OverlayScreenId) => Effect.Effect<void>;

    /** Return the overlay to its home screen. */
    readonly Reset: Effect.Effect<void>;

    /** Project the current screen and keybind settings for a renderer. */
    readonly Snapshot: Effect.Effect<OverlayScreenDto>;
}

/** Main-process ownership of one overlay activation's navigation stack. */
export class OverlaySession extends
    Context.Service<OverlaySession, OverlaySessionImpl>()(TypeId) { }

const GetCurrent = (Stack: ReadonlyArray<OverlayScreenId>): OverlayScreenId =>
    Stack.at(-1) ?? ScreenId.Home;

export/** Live overlay navigation state scoped to the application runtime. */
const Live = Layer.effect(
    OverlaySession,
    Effect.gen(function*()
    {
        const Settings = yield* AppSettings.AppSettings;
        const Stack = yield* SubscriptionRef.make<ReadonlyArray<OverlayScreenId>>(
            Object.freeze([ ScreenId.Home ])
        );
        const Current = SubscriptionRef.get(Stack).pipe(Effect.map(GetCurrent));

        return {
            Back: SubscriptionRef.update(Stack, (Value: ReadonlyArray<OverlayScreenId>) =>
                Value.length > 1
                    ? Object.freeze(Value.slice(0, -1))
                    : Value
            ),
            Changes: SubscriptionRef.changes(Stack).pipe(Stream.map(GetCurrent)),
            Current,
            Navigate: (Screen: OverlayScreenId) => SubscriptionRef.update(
                Stack,
                (Value: ReadonlyArray<OverlayScreenId>) => GetCurrent(Value) === Screen
                    ? Value
                    : Object.freeze([ ...Value, Screen ])
            ),
            Reset: SubscriptionRef.set(Stack, Object.freeze([ ScreenId.Home ])),
            Snapshot: Effect.gen(function*()
            {
                const CurrentScreen = yield* Current;
                const CurrentSettings = yield* Settings.get;

                return OverlayCommandCatalog.FromKeybindSettings(
                    CurrentScreen,
                    CurrentSettings.Keybinds
                );
            })
        } as const;
    })
);
