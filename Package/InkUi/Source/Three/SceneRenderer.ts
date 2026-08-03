/**
 * Effect service for rendering ThreeJS scenes into terminal frames.
 *
 * @module @sorrell/ink-ui/Three/SceneRenderer
 *
 * @file      SceneRenderer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import type * as THREE from "three";
import * as Viewport from "./Viewport.js";
import { type InvalidRenderOptions, type InvalidViewport, SceneRenderFailed } from "./InkThreeError.js";
import type { Frame } from "./Terminal/Frame.js";
import { Renderer } from "./Terminal/index.js";
import { pipe } from "effect";

/**
 * Input for Effect scene rendering.
 *
 * @category Rendering
 * @since 1.0.0
 */
export interface SceneRenderInput
{
    readonly Scene: THREE.Scene;
    readonly Camera: THREE.Camera;
    readonly Viewport: Viewport.Viewport;
    readonly Options?: Renderer.FixedOptions | undefined;
}

/**
 * Service that renders ThreeJS scenes into terminal frame models.
 *
 * @category Service
 * @since 1.0.0
 */
export class SceneRenderer extends Context.Service<SceneRenderer, {
    readonly RenderFrame:
    (Input: SceneRenderInput) => Effect.Effect<Frame, SceneRenderFailed, unknown>;
    readonly RenderString: (Input: SceneRenderInput) => Effect.Effect<string, SceneRenderFailed, unknown>;
}>()("~sorrell/ink-three/SceneRenderer") { }

export/**
       * Live scene renderer layer backed by the pure renderer.
       *
       * @category Layer
       * @since 1.0.0
       */
const SceneRendererLive: Layer.Layer<SceneRenderer> = Layer.succeed(
    SceneRenderer,
    SceneRenderer.of({
        RenderFrame: (Value: SceneRenderInput) => Effect.gen(function*()
        {
            const TheViewport: Viewport.Viewport = yield* pipe(
                Viewport.ValidateViewport(Value.Viewport),
                Effect.mapError((Cause: InvalidViewport | InvalidRenderOptions) => new SceneRenderFailed({
                    Cause,
                    Message: Cause.Message
                }))
            );

            return yield* Effect.try({
                catch: (Cause: unknown) => new SceneRenderFailed({
                    Cause,
                    Message: "Failed to render the ThreeJS scene to a terminal frame."
                }),
                try: () => Renderer.SceneToFrame(
                    Value.Scene,
                    Value.Camera,
                    {
                        ...Value.Options,
                        ...TheViewport
                    }
                )
            });
        }),
        RenderString: (Input: SceneRenderInput) => Effect.gen(function*()
        {
            const TheViewport: Viewport.Viewport = yield* pipe(Viewport.ValidateViewport(Input.Viewport), Effect.mapError((Cause: InvalidViewport | InvalidRenderOptions) => new SceneRenderFailed({
                    Cause,
                    Message: Cause.Message
                })));

            return yield* Effect.try({
                catch: (Cause: unknown) => new SceneRenderFailed({
                    Cause,
                    Message: "Failed to render the ThreeJS scene to a terminal string."
                }),
                try: () => Renderer.SceneToString(
                    Input.Scene,
                    Input.Camera,
                    {
                        ...Input.Options,
                        ...TheViewport
                    }
                )
            });
        })
    }));

export/**
       * Renders a ThreeJS scene to a terminal frame through the Effect service.
       *
       * @category Rendering
       * @since 1.0.0
       */
const RenderSceneToFrameEffect: {
    (Input: SceneRenderInput): Effect.Effect<Frame, SceneRenderFailed, unknown>;
} = Effect.fn("RenderSceneToFrameEffect")(function*(Input: SceneRenderInput)
{
    const Renderer: Context.Service.Shape<typeof SceneRenderer> = yield* SceneRenderer;

    return yield* Renderer.RenderFrame(Input);
});

export/**
       * Renders a ThreeJS scene to a terminal string through the Effect service.
       *
       * @category Rendering
       * @since 1.0.0
       */
const RenderSceneToStringEffect: {
    (Input: SceneRenderInput): Effect.Effect<string, SceneRenderFailed, unknown>;
} = Effect.fn("RenderSceneToStringEffect")(function*(Input: SceneRenderInput)
{
    const Renderer: Context.Service.Shape<typeof SceneRenderer> = yield* SceneRenderer;

    return yield* Renderer.RenderString(Input);
});

