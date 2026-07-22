/**
 *
 *
 * @module @sorrell/windows/Keyboard
 *
 * @file      Keyboard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Subscription, Time, VK } from "./index.js";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.js";
import { Data } from "effect";
import type { UInt } from "@sorrell/math";

/** The transition reported by the low-level keyboard hook. */
export type State = Data.TaggedEnum<{
    readonly Up: { };
    readonly Down: { };
}>;

const { $is, $match } = Data.taggedEnum<State>();

export/** {@inheritDoc State:type} */
const State =
    {
        $is,
        $match,

        Down: { _tag: "Down" as const } as const,
        Up: { _tag: "Up" as const } as const
    } as const;

/** Native event data produced by `KBDLLHOOKSTRUCT`. */
export interface NativeEvent
{
    readonly Vk: VK.VK;
    readonly ScanCode: UInt.UInt;
    readonly Time: Time.Time;
    /** Whether this is an auto-repeated key-down while the key remains held. */
    readonly IsRepeat: boolean;
    readonly IsExtended: boolean;
    readonly IsInjected: boolean;
    readonly IsLowerIntegrityInjected: boolean;
    readonly IsAltPressed: boolean;
}

/** A TypeScript-friendly global keyboard event. */
export interface Event extends NativeEvent
{
    readonly Key: VK.VK;
    readonly State: State;
}

/** A global keyboard-event listener. */
export type Listener = (Event: Event) => void;

interface NativeEventArgument extends NativeEvent
{
    readonly IsKeyDown: boolean;
}

/**
 * Subscribe to all key transitions anywhere on the desktop.
 *
 * @param Callback - The listener to invoke on Electron's JavaScript thread.
 * @returns {Attempt.AttemptResult<Subscription.Id>} The registration identifier or native error.
 */
export function Subscribe(Callback: Listener): Attempt.AttemptResult<Subscription.Id>
{
    const NativeCallback: Subscription.NativeCallback = (Argument: unknown): void =>
    {
        const { IsKeyDown, ...NativeEvent } = Argument as NativeEventArgument;

        Callback(Object.freeze({
            ...NativeEvent,
            Key: NativeEvent.Vk,
            State: IsKeyDown ? State.Down : State.Up
        }));
    };

    return Attempt.AsResult(
        Binding.Keyboard.Subscribe(NativeCallback)
    );
}

/**
 * Remove a global keyboard subscription.
 *
 * @param SubscriptionId - The identifier returned by {@link Subscribe}.
 * @returns {Attempt.AttemptResult<void>} Success, or the native error.
 */
export function Unsubscribe(SubscriptionId: Subscription.Id): Attempt.AttemptResult<void>
{
    return Attempt.AsResult(Binding.Keyboard.Unsubscribe(SubscriptionId));
}
