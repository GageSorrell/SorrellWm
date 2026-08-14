/**
 * Windows API operations for simulating mouse input.
 *
 * @module @sorrell/windows/Mouse
 *
 * @file      Mouse.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, Option, Result } from "effect";
import { GetCursorPosition } from "./Window.js";
import { IntPoint } from "@sorrell/math";
import { Attempt } from "./Internal/index.js";
import { Binding } from "./Binding.js";
import * as VK from "./Vk.js";

/** The mouse-button virtual-key codes accepted by {@link MouseButtonDown}/{@link MouseButtonUp}. */
export type MouseButton =
    | VK.LBUTTON
    | VK.MBUTTON
    | VK.RBUTTON
    | VK.XBUTTON1
    | VK.XBUTTON2;

const MissingMouseApi = <A>(Name: string): Attempt.Attempt<A> =>
    Result.fail(new Attempt.NativeError({
        Message: `The loaded native addon does not export Mouse.${ Name }.`
    }));

export/** Move the system cursor to an absolute virtual-screen position. */
const SetCursorPosition = (Point: IntPoint.IntPoint): Attempt.Attempt<void> =>
    typeof Binding.Mouse?.SetCursorPosition === "function"
        ? Attempt.AsResult(Binding.Mouse.SetCursorPosition(Point.X, Point.Y))
        : MissingMouseApi("SetCursorPosition");

export/** Simulate pressing and holding a mouse button. */
const MouseButtonDown = (Button: MouseButton): Attempt.Attempt<void> =>
    typeof Binding.Mouse?.MouseButtonDown === "function"
        ? Attempt.AsResult(Binding.Mouse.MouseButtonDown(Button))
        : MissingMouseApi("MouseButtonDown");

export/** Simulate releasing a mouse button. */
const MouseButtonUp = (Button: MouseButton): Attempt.Attempt<void> =>
    typeof Binding.Mouse?.MouseButtonUp === "function"
        ? Attempt.AsResult(Binding.Mouse.MouseButtonUp(Button))
        : MissingMouseApi("MouseButtonUp");

/**
 * How often, in milliseconds, {@link MoveTo} repositions the cursor while animating
 * toward its target. Fast enough that native mouse-move consumers (e.g. this
 * package's own `GetMovingWindow`/`IsLeftMouseButtonDown` polling, or a
 * `WM_MOUSEMOVE` hook) observe genuine incremental motion rather than a teleport.
 */
const MoveTickIntervalMilliseconds = 8;

export/** Linearly interpolate between two points; `T` is clamped to `[0, 1]`. */
const LerpPoint = (
    From: IntPoint.IntPoint,
    To: IntPoint.IntPoint,
    T: number
): IntPoint.IntPoint =>
{
    const Clamped = Math.min(1, Math.max(0, T));
    return IntPoint.IntPoint(
        From.X + ((To.X - From.X) * Clamped),
        From.Y + ((To.Y - From.Y) * Clamped)
    );
};

export/**
       * Move the cursor smoothly from its current position to `Target` over
       * `DurationMilliseconds`, repositioning it roughly every
       * {@link MoveTickIntervalMilliseconds}.
       *
       * Unlike every other function in this module, this isn't a thin native
       * wrapper: it's a TS-level animation loop built from {@link SetCursorPosition},
       * kept here (rather than in native code) so its timing stays interruptible
       * and easy to reason about. Per-tick failures are ignored (best-effort) so a
       * single missed frame doesn't abort the whole motion.
       */
const MoveTo = (
    Target: IntPoint.IntPoint,
    DurationMilliseconds: number
): Effect.Effect<void> => Effect.gen(function*()
{
    const Start = Option.getOrElse(GetCursorPosition(), () => Target);

    if (DurationMilliseconds <= 0)
    {
        yield* Effect.sync(() => SetCursorPosition(Target));
        return;
    }

    const StartTime = yield* Effect.sync(() => performance.now());

    while (true)
    {
        const Elapsed = (yield* Effect.sync(() => performance.now())) - StartTime;
        const T = Elapsed / DurationMilliseconds;

        yield* Effect.sync(() => SetCursorPosition(LerpPoint(Start, Target, T)));

        if (T >= 1)
        {
            return;
        }

        yield* Effect.sleep(`${ MoveTickIntervalMilliseconds } millis`);
    }
});

export/** Simulate a click: press a mouse button, then release it shortly after. */
const Click = (Button: MouseButton = VK.LBUTTON): Effect.Effect<void> => Effect.gen(function*()
{
    yield* Effect.sync(() => MouseButtonDown(Button));
    yield* Effect.sleep("30 millis");
    yield* Effect.sync(() => MouseButtonUp(Button));
});

export/**
       * Simulate a click-and-drag gesture: move to `From`, press and hold `Button`,
       * move smoothly to `To` over `DurationMilliseconds`, then release.
       *
       * This is the only way to exercise native drag-detection behavior (e.g. this
       * app's own tiled-window-detach and drag-to-insert polling) exactly as a real
       * user interaction would, since that behavior watches genuine cursor/button
       * state rather than any command.
       */
const Drag = (
    From: IntPoint.IntPoint,
    To: IntPoint.IntPoint,
    DurationMilliseconds: number,
    Button: MouseButton = VK.LBUTTON
): Effect.Effect<void> => Effect.gen(function*()
{
    yield* Effect.sync(() => SetCursorPosition(From));
    yield* Effect.sleep("30 millis");
    yield* Effect.sync(() => MouseButtonDown(Button));
    yield* Effect.sleep("30 millis");
    yield* MoveTo(To, DurationMilliseconds);
    yield* Effect.sleep("30 millis");
    yield* Effect.sync(() => MouseButtonUp(Button));
});
