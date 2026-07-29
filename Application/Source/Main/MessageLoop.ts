/**
 * Manages the Windows API message loop, accessed via `@sorrell/windows`.
 *
 * @module @sorrell/wm/Main/MessageLoop
 *
 * @file      MessageLoop.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Log.ts";
import { Context, Data, Effect, Layer, pipe } from "effect";
import { type Thread, MessageLoop as WindowsMessageLoop  } from "@sorrell/windows";
import type { SimpleError } from "./Utility/Error.ts";

export/** The type identifier of this module. */
const TypeId = "~sorrell/wm/Main/MessageLoop" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/** Identifies the native message-loop lifecycle operation that failed. */
export type Op =
    | "Start"
    | "Stop";

/** A failure reported while managing the dedicated Win32 message loop. */
export class WindowsMessageLoopError extends Data.TaggedError("WindowsMessageLoopError")<
    SimpleError &
    {
        readonly Operation: Op;
    }
> { }

/** The running dedicated Win32 message loop. */
export class MessageLoop extends Context.Service<MessageLoop, {
    readonly ThreadId: Thread.ThreadId;
}>()(TypeId) { }

const MakeLoopError = (Operation: Op) => ({ Message }: SimpleError) =>
    new WindowsMessageLoopError({
        Message,
        Operation
    });

const Start = pipe(
    Effect.sync(WindowsMessageLoop.Start),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(MakeLoopError("Start")),
    Effect.tap((ThreadId: Thread.ThreadId) => Logging.LogInfo(
        "Native.MessageLoop",
        "Started the dedicated Win32 message loop.",
        { ThreadId }
    ))
);

const Stop = pipe(
    Effect.sync(WindowsMessageLoop.Stop),
    Effect.flatMap(Effect.fromResult),
    Effect.mapError(MakeLoopError("Stop")),
    Effect.tap(() => Logging.LogInfo(
        "Native.MessageLoop",
        "Stopped the dedicated Win32 message loop."
    )),
    Effect.ignore({
        log: "Error",
        message: "Could not stop the dedicated Win32 message loop."
    })
);

export/** A scoped layer that starts the native loop and stops it during finalization. */
const Live = Layer.effect(
    MessageLoop,
    pipe(
        Effect.acquireRelease(Start, () => Stop),
        Effect.map((ThreadId: Thread.ThreadId) => ({ ThreadId }))
    )
);
