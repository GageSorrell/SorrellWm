/**
 * Effect runtime workflows for terminal scene rendering.
 *
 * @module @sorrell/ink-three/RendererRuntime
 *
 * @file      RendererRuntime.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as AnimationDriver from "./AnimationDriver.js";
import type * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as RenderMode from "./Terminal/RenderMode.js";
import type * as Renderer from "./Terminal/Renderer.js";
import type * as THREE from "three";
import type {
    AnimationLoopFailed,
    FrameCompositionFailed,
    InvalidRenderOptions,
    InvalidViewport,
    SceneRenderFailed,
    UnsupportedTerminal
} from "./InkThreeError.js";
import {
    FrameSink,
    MakeFrameSinkLayer
} from "./FrameSink.js";
import {
    GetValidatedTerminalViewport,
    InkThreeTerminal,
    MakeInkThreeTerminalLayer,
    type TerminalCapabilities
} from "./Terminal/InkThreeTerminal.js";
import {
    RenderSceneToFrameEffect,
    type SceneRenderInput,
    type SceneRenderer,
    SceneRendererLive
} from "./SceneRenderer.js";
import type { Frame } from "./Terminal/Frame.js";
import { Function } from "effect";
import type { Viewport } from "./Viewport.js";

/**
 * Options for running a scene render loop.
 *
 * @category Animation
 * @since 1.0.0
 */
export interface Options
{
    readonly Scene: THREE.Scene;
    readonly Camera: THREE.Camera;
    readonly RendererOptions?: Renderer.FixedOptions;
    readonly Animation?: AnimationDriver.Options;
}

export/**
       * Renders one frame using the current terminal viewport service.
       *
       * @category Rendering
       * @since 1.0.0
       */
const RenderCurrentFrame: (
    Scene: THREE.Scene,
    Camera: THREE.Camera,
    Options?: Renderer.FixedOptions
) => Effect.Effect<
    Frame,
    | UnsupportedTerminal
    | InvalidViewport
    | InvalidRenderOptions
    | SceneRenderFailed,
    unknown
> = Effect.fn("RenderCurrentFrame")(function*(
    Scene: THREE.Scene,
    Camera: THREE.Camera,
    Options?: Renderer.FixedOptions
)
{
    const Terminal: Context.Service.Shape<typeof InkThreeTerminal> = yield* InkThreeTerminal;

    const IsRenderMode =
        Function.flip(RenderMode.RenderMode.$is)(Options?.RenderMode ?? RenderMode.Default.RenderMode);

    yield* Terminal.RequireCapabilities({
        TrueColor: Options?.ColorOptions?.Enabled !== false && Options?.Color !== undefined,
        Unicode: (
            IsRenderMode("Braille") ||
            IsRenderMode("Quadrant") ||
            IsRenderMode("HalfBlock")
        )
    });

    const Viewport: Viewport = yield* GetValidatedTerminalViewport();

    return yield* RenderSceneToFrameEffect({
        Camera,
        Options,
        Scene,
        Viewport
    });
});

export/**
       * Runs an interruptible render loop that writes each frame to the configured sink.
       *
       * @category Animation
       * @since 1.0.0
       */
const RunSceneRenderLoop: (Options: Options) => Effect.Effect<
    never,
    | AnimationLoopFailed
    | FrameCompositionFailed
    | InvalidRenderOptions
    | InvalidViewport
    | SceneRenderFailed
    | UnsupportedTerminal,
    unknown
> = Effect.fn("RunSceneRenderLoop")(function*(Options: Options)
{
    const Sink: Context.Service.Shape<typeof FrameSink> = yield* FrameSink;

    return yield* AnimationDriver.RunLoop(Options.Animation ?? { }, Effect.gen(function*()
    {
        const { Scene, Camera, RendererOptions } = Options;
        const Frame: Frame = yield* RenderCurrentFrame(Scene, Camera, RendererOptions);
        yield* Sink.WriteFrame(Frame);
    }));
});

/**
 * Creates the default live layer bundle for Effect runtime rendering.
 *
 * @category Layer
 * @since 1.0.0
 */
export function MakeDefaultRendererLayer(
    GetViewport: () => Viewport,
    WriteFrame: (Frame: Frame) => void,
    TerminalCapabilities?: TerminalCapabilities
): Layer.Layer<RenderLoopService>
{
    return Layer.mergeAll(
        MakeInkThreeTerminalLayer(GetViewport, TerminalCapabilities),
        MakeFrameSinkLayer(WriteFrame),
        SceneRendererLive,
        AnimationDriver.AnimationDriverLive
    );
}

/**
 * Services required by the render loop.
 *
 * @category Utility Type
 * @since 1.0.0
 */
export type RenderLoopService =
    | InkThreeTerminal
    | SceneRenderer
    | FrameSink
    | AnimationDriver.AnimationDriver;

/**
 * Converts explicit viewport data into a service render input.
 *
 * @category Rendering
 * @since 1.0.0
 */
export function MakeSceneRenderInput(
    Scene: THREE.Scene,
    Camera: THREE.Camera,
    Viewport: Viewport,
    Options?: Renderer.FixedOptions
): SceneRenderInput
{
    return {
        Camera,
        Options,
        Scene,
        Viewport
    };
}

