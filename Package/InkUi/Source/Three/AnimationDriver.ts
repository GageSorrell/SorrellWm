/**
 * Effect service for interruptible render animation loops.
 *
 * @module @sorrell/ink-ui/Three/AnimationDriver
 *
 * @file      AnimationDriver.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import { AnimationLoopFailed, InvalidRenderOptions } from "./InkThreeError.js";
import { pipe } from "effect";

export/** The identifier for this module. */
const TypeId = "~sorrell/ink-three/AnimationDriver" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 * Options for configuring an Effect-driven animation loop.
 *
 * @category Animation
 * @since 1.0.0
 */
export interface Options
{
    readonly Fps?: number | undefined;
}

export/**
       * Schema for validating animation loop options.
       *
       * @category Schema
       * @since 1.0.0
       */
const OptionsSchema: Schema.Schema<Options> = Schema.Struct({
    Fps: Schema.optional(Schema.Number)
});

export/**
       * Validates animation options through Effect.
       *
       * @category Animation
       * @since 1.0.0
       */
const ValidateOptions: {
    (Input: unknown): Effect.Effect<Required<Options>, InvalidRenderOptions, unknown>;
} =
    Effect.fn("ValidateOptions")(function*(Value: unknown)
    {
        const Parsed: Options = yield* pipe(
            Value,
            Schema.decodeUnknownEffect(OptionsSchema),
            Effect.mapError(({ message: Message }: Schema.SchemaError) => new InvalidRenderOptions({
                Message,
                OptionName: "AnimationDriver!Options",
                Value
            }))
        );
        const Fps: number = Parsed.Fps ?? 30;

        if (!Number.isFinite(Fps) || Fps <= 0)
        {
            return yield* Effect.fail(new InvalidRenderOptions({
                Message: "Fps must be greater than zero.",
                OptionName: "Fps",
                Value: Fps
            }));
        }

        return { Fps };
    });

/**
 * A tick in an animation loop.
 *
 * @category Animation
 * @since 1.0.0
 */
export type AnimationLoop<E = never> =
    Effect.Effect<never, E | InvalidRenderOptions | AnimationLoopFailed, unknown>;

/**
 * Service that schedules interruptible animation loops.
 *
 * @category Service
 * @since 1.0.0
 */
export class AnimationDriver extends Context.Service<AnimationDriver, {
    readonly RunLoop: <E, R>(Options: Options, Tick: Effect.Effect<void, E, R>) => AnimationLoop<E>;
}>()(TypeId) { }

export/**
       * Live animation driver backed by Effect sleep and interruption.
       *
       * @category Layer
       * @since 1.0.0
       */
const AnimationDriverLive: Layer.Layer<AnimationDriver> = Layer.succeed(
    AnimationDriver,
    AnimationDriver.of({
        RunLoop: <E, R>(Options: Options, Tick: Effect.Effect<void, E, R>) => pipe(Effect.gen(function*()
        {
            const ParsedOptions: Required<Options> = yield* ValidateOptions(Options);
            const IntervalMilliseconds: number =
                Math.max(1, Math.round(1000 / ParsedOptions.Fps!));

            while (true)
            {
                yield* Tick;
                yield* Effect.sleep(`${ IntervalMilliseconds } millis`);
            }
        }),
        Effect.mapError((Cause: E | InvalidRenderOptions) =>
        {
            if (Cause instanceof InvalidRenderOptions)
            {
                return Cause;
            }

            return new AnimationLoopFailed({ Cause });
        })
        )
    }));

export/**
       * Runs an animation loop through the configured driver.
       *
       * @category Animation
       * @since 1.0.0
       */
const RunLoop: {
    <E, R>(Options: Options, Tick: Effect.Effect<void, E, R>): AnimationLoop<E>;
} = Effect.fn("RunLoop")(function*<E, R>(Options: Options, Tick: Effect.Effect<void, E, R>)
{
    const Driver: Context.Service.Shape<typeof AnimationDriver> = yield* AnimationDriver;
    return yield* Driver.RunLoop(Options, Tick);
});

