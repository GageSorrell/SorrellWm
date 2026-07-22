/**
 *
 *
 * @module @sorrell/wm/Main/WindowsMessageLoop
 *
 * @file      WindowsMessageLoop.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Data, Effect, Layer, pipe } from "effect";
import { MessageLoop, type Thread } from "@sorrell/windows";

interface NativeFailure
{
    readonly Message: string;
}

/** Identifies the native message-loop lifecycle operation that failed. */
export type Op = "Start" | "Stop";

/* eslint-enable @typescript-eslint/naming-convention */

/** A failure reported while managing the dedicated Win32 message loop. */
export class WindowsMessageLoopError extends Data.TaggedError("WindowsMessageLoopError")<{
    readonly Message: string;
    readonly Operation: Op;
}> { }

/** The running dedicated Win32 message loop. */
export class WindowsMessageLoop extends Context.Service<WindowsMessageLoop, {
    readonly ThreadId: Thread.ThreadId;
}>()("@sorrell/wm/Main/WindowsMessageLoop") { }

const Start = pipe(
    Effect.sync(MessageLoop.Start),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError((NativeError: NativeFailure) => new WindowsMessageLoopError({
        Message: NativeError.Message,
        Operation: "Start"
    }))
);

const Stop = pipe(
    Effect.sync(MessageLoop.Stop),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError((NativeError: NativeFailure) => new WindowsMessageLoopError({
        Message: NativeError.Message,
        Operation: "Stop"
    })),
    Effect.ignore({
        log: "Error",
        message: "Could not stop the dedicated Win32 message loop."
    })
);

export/** A scoped layer that starts the native loop and stops it during finalization. */
const Live = Layer.effect(
    WindowsMessageLoop,
    pipe(
        Effect.acquireRelease(Start, () => Stop),
        Effect.map((ThreadId: Thread.ThreadId) => ({ ThreadId }))
    )
);
