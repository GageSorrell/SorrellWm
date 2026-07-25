/**
 * Effect service for consuming terminal frames.
 *
 * @module @sorrell/ink-three/FrameSink
 *
 * @file      FrameSink.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { type Frame, ToString } from "./Terminal/Frame.js";
import { FrameCompositionFailed } from "./InkThreeError.js";

/**
 * Service that consumes terminal frames.
 *
 * @category Service
 * @since 1.0.0
 */
export class FrameSink extends Context.Service<FrameSink, {
    readonly WriteFrame: (Frame: Frame) => Effect.Effect<void, FrameCompositionFailed>;
}>()("~sorrell/ink-three/FrameSink") { }

/**
 * Creates a frame sink layer from a synchronous callback.
 *
 * @category Layer
 * @since 1.0.0
 */
export function MakeFrameSinkLayer(WriteFrame: (Frame: Frame) => void)
{
    return Layer.succeed(FrameSink, FrameSink.of({
        WriteFrame: (Frame) => Effect.try({
            catch: (Cause) => new FrameCompositionFailed({
                Cause,
                Message: "Failed to write terminal frame."
            }),
            try: () => WriteFrame(Frame)
        })
    }));
}

/**
 * Creates a string sink layer for text-only consumers.
 *
 * @category Layer
 * @since 1.0.0
 */
export function MakeStringFrameSinkLayer(WriteText: (Text: string) => void)
{
    return MakeFrameSinkLayer((Frame) => WriteText(ToString(Frame)));
}

