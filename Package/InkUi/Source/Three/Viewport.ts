/**
 * The `Viewport` interface and related utilities.
 *
 * @module @sorrell/ink-ui/Three/Viewport
 *
 * @file      Viewport.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { InvalidRenderOptions, InvalidViewport } from "./InkThreeError.js";

/**
 * Viewport dimensions used by terminal renderers.
 *
 * @category viewport
 * @since 1.0.0
 */
export interface Viewport
{
    readonly Width: number;
    readonly Height: number;
}

export/**
       * Schema for validating terminal viewport dimensions.
       *
       * @category Schema
       * @since 1.0.0
       */
const ViewportSchema: Schema.Schema<Viewport> = Schema.Struct({
    Height: Schema.Number,
    Width: Schema.Number
});

export/**
       * Validates viewport dimensions through Effect.
       *
       * @category viewport
       * @since 1.0.0
       */
const ValidateViewport: {
    (Value: unknown): Effect.Effect<Viewport, InvalidViewport | InvalidRenderOptions, unknown>;
} = Effect.fn("ValidateViewport")(function*(Value: unknown)
{
    const Parsed: Viewport = yield* Schema.decodeUnknownEffect(ViewportSchema)(Value).pipe(
        Effect.mapError(({ message: Message }) => new InvalidRenderOptions({
            Message,
            OptionName: "Viewport",
            Value
        }))
    );

    const InvalidViewportDimension = (Dimension: "height" | "width"): Effect.Effect<never, InvalidViewport> =>
        Effect.fail(new InvalidViewport({
            ...Parsed,
            Message: `Viewport ${ Dimension } must be a positive integer.`
        }));

    const IsWidthValid: boolean = (
        !Number.isFinite(Parsed.Width)
        || Parsed.Width < 1
        || !Number.isInteger(Parsed.Width)
    );

    if (!IsWidthValid)
    {
        return yield* InvalidViewportDimension("width");
    }

    const IsHeightValid: boolean = (
        !Number.isFinite(Parsed.Height)
        || Parsed.Height < 1
        || !Number.isInteger(Parsed.Height)
    );

    if (!IsHeightValid)
    {
        return yield* InvalidViewportDimension("height");
    }

    return Parsed;
});
