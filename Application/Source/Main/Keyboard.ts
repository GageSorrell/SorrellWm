/**
 *
 *
 * @module @sorrell/wm/Main/Keyboard
 *
 * @file      Keyboard.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Data, Effect, Layer, Queue, type Scope, Stream, pipe } from "effect";
import { Keyboard as NativeKeyboard, type Subscription } from "@sorrell/windows";
import { WindowsMessageLoop } from "./WindowsMessageLoop.js";

export const TypeId = "~sorrell/wm/Main/Keyboard" as const;

interface NativeFailure
{
    readonly Message: string;
}

/** A failure reported while creating a global keyboard subscription. */
export class KeyboardSubscriptionError extends
    Data.TaggedError("KeyboardSubscriptionError")<NativeFailure> { }

export interface KeyboardImpl
{
    readonly Events: () => Effect.Effect<
        Stream.Stream<NativeKeyboard.Event>,
        KeyboardSubscriptionError,
        Scope.Scope
    >;
}

/**
 * Effect-managed access to the native global keyboard hook.
 *
 * Each event stream owns exactly one native subscription. The subscription is
 * removed automatically when the Effect scope consuming the stream closes.
 */
export class Keyboard extends Context.Service<Keyboard, KeyboardImpl>()(TypeId) { }

const Events = (): Effect.Effect<
    Stream.Stream<NativeKeyboard.Event>,
    KeyboardSubscriptionError,
    Scope.Scope
> => Effect.gen(function*()
{
    const EventQueue = yield* Queue.unbounded<NativeKeyboard.Event>();

    yield* Effect.acquireRelease(
        pipe(
            Effect.sync(() => NativeKeyboard.Subscribe(
                (Event: NativeKeyboard.Event): void =>
                {
                    Queue.offerUnsafe(EventQueue, Event);
                }
            )),
            Effect.flatMap(Effect.fromResult),
            Effect.mapError((NativeError: NativeFailure) => new KeyboardSubscriptionError(NativeError))
        ),
        (Id: Subscription.Id) => Effect.gen(function*()
        {
            yield* pipe(
                Effect.sync(() => NativeKeyboard.Unsubscribe(Id)),
                Effect.flatMap(Effect.fromResult),
                Effect.ignore({
                    log: "Error",
                    message: "Could not remove a native global keyboard subscription"
                })
            );
            yield* Queue.shutdown(EventQueue);
        })
    );

    return Stream.fromQueue(EventQueue);
});

export/** Live global-keyboard access, requiring the dedicated message loop. */
const Live = Layer.effect(
    Keyboard,
    Effect.gen(function*()
    {
        yield* WindowsMessageLoop;

        return { Events } as const;
    })
);
