/**
 * Typed renderer errors for Effect workflows.
 *
 * @module @sorrell/ink-ui/Three/InkThreeError
 *
 * @file      InkThreeError.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Data from "effect/Data";

/**
 * Error raised when render options fail schema or domain validation.
 *
 * @category Error
 * @since 1.0.0
 */
export class InvalidRenderOptions extends Data.TaggedError("InvalidRenderOptions")<{
    readonly OptionName: string;
    readonly Value: unknown;
    readonly Message: string;
}> { }

/**
 * Error raised when a viewport cannot be used for terminal rendering.
 *
 * @category Error
 * @since 1.0.0
 */
export class InvalidViewport extends Data.TaggedError("InvalidViewport")<{
    readonly Width: number;
    readonly Height: number;
    readonly Message: string;
}> { }

/**
 * Error raised when terminal capabilities cannot satisfy a requested render mode.
 *
 * @category Error
 * @since 1.0.0
 */
export class UnsupportedTerminal extends Data.TaggedError("UnsupportedTerminalCapability")<{
    readonly Feature: string;
    readonly Message: string;
}> { }

/**
 * Error raised when scene-to-frame rendering fails unexpectedly.
 *
 * @category Error
 * @since 1.0.0
 */
export class SceneRenderFailed extends Data.TaggedError("SceneRenderFailed")<{
    readonly Message: string;
    readonly Cause: unknown;
}> { }

/**
 * Error raised when a frame sink cannot accept a rendered frame.
 *
 * @category Error
 * @since 1.0.0
 */
export class FrameCompositionFailed extends Data.TaggedError("FrameCompositionFailed")<{
    readonly Message: string;
    readonly Cause: unknown;
}> { }

/**
 * Error raised when an animation loop fails unexpectedly.
 *
 * @category Error
 * @since 1.0.0
 */
export class AnimationLoopFailed extends Data.TaggedError("AnimationLoopFailed")<{
    readonly Message?: string;
    readonly Cause: unknown;
}> { }

/**
 * Error raised when an Ink render lifecycle operation fails.
 *
 * @category Error
 * @since 1.0.0
 */
export class InkRenderFailed extends Data.TaggedError("InkRenderFailed")<{
    readonly Message: string;
    readonly Cause: unknown;
}> { }

