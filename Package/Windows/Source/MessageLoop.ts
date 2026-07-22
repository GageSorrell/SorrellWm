/**
 *
 *
 * @module @sorrell/windows/MessageLoop
 *
 * @file      MessageLoop.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Subscription, Thread, WM } from "./index.js";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.js";
import type { IntPoint } from "@sorrell/math";

// /** A JavaScript representation of the Win32 `MSG` structure. */
// export interface MSG
// {
//     /** The target window, or null for a thread message. */
//     readonly WindowHandle: Handle.HWND | null;

//     /** The Win32 message identifier, such as `WM_HOTKEY`. */
//     readonly Message: number;

//     /** The message's pointer-sized unsigned `wParam` value. */
//     readonly WParameter: bigint;

//     /** The message's pointer-sized signed `lParam` value. */
//     readonly LParameter: bigint;

//     /** The time at which the message was posted. */
//     readonly Time: UInt.UInt;

//     /** The cursor position at which the message was posted. */
//     readonly Position: IntPoint.IntPoint;
// }

/** Maps each supported message type to its TypeScript-friendly listener data. */
export interface MessageArgument
{
    readonly [ WM.MOVE ]: IntPoint.IntPoint;
}

/** A listener specialized to a supported Win32 message type. */
export type Listener<Message extends keyof MessageArgument> = (
    Argument: MessageArgument[Message]
) => void;

/** A Win32 message for which a TypeScript-friendly listener is implemented. */
export type SubscribableMessage = keyof MessageArgument;

/**
 * Subscribe a listener to `WM_MOVE` messages.
 *
 * The packed coordinates in the native message's `lParam` are decoded into an
 * {@link IntPoint.IntPoint}, including sign extension for negative positions.
 *
 * @param Message - The `WM_MOVE` message identifier.
 * @param Callback - The listener to invoke with the window's new position.
 * @returns {Attempt.AttemptResult<Subscription.Id>} The registration identifier or native error.
 */
export function Subscribe(
    Message: WM.MOVE,
    Callback: Listener<WM.MOVE>
): Attempt.AttemptResult<Subscription.Id>;
export function Subscribe<Message extends SubscribableMessage>(
    Message: Message,
    Callback: Listener<Message>
): Attempt.AttemptResult<Subscription.Id>
{
    const NativeCallback: Subscription.NativeCallback = (Argument: unknown): void =>
    {
        Callback(Argument as MessageArgument[Message]);
    };

    return Attempt.AsResult(
        Binding.MessageLoop.Subscribe(Message, NativeCallback)
    );
}

/**
 * Remove a message-loop subscription.
 *
 * Pending deliveries for the registration are discarded. A callback already
 * executing on the JavaScript thread is allowed to finish.
 *
 * @param SubscriptionId - The identifier returned by {@link Subscribe}.
 * @returns {Attempt.AttemptResult<void>} Success, or the native error.
 */
export function Unsubscribe(SubscriptionId: Subscription.Id): Attempt.AttemptResult<void>
{
    return Attempt.AsResult(Binding.MessageLoop.Unsubscribe(SubscriptionId));
}

/**
 * Start a Win32 message loop on a dedicated native thread.
 *
 * Only one loop can be active per Electron process.
 *
 * @returns {Attempt.AttemptResult<Thread.ThreadId>} The thread identifier or native error.
 */
export function Start(): Attempt.AttemptResult<Thread.ThreadId>
{
    return Attempt.AsResult(Binding.MessageLoop.Start());
}

/**
 * Post `WM_QUIT` to the dedicated message loop and join its thread.
 *
 * @returns {Attempt.AttemptResult<void>} Success, or the native error.
 */
export function Stop(): Attempt.AttemptResult<void>
{
    return Attempt.AsResult(Binding.MessageLoop.Stop());
}
