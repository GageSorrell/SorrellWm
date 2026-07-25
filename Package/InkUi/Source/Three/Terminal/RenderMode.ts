/**
 * Terminal glyph rendering mode names and defaults.
 *
 * @module @sorrell/ink-three/Terminal/RenderMode
 *
 * @file      RenderMode.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";

/**
 * Supported terminal glyph encoding modes.
 *
 * @category Glyph
 * @since 1.0.0
 */
type _RenderMode = Data.TaggedEnum<{
    readonly Braille: { };
    readonly Fixed: { };
    readonly HalfBlock: { };
    readonly Quadrant: { };
    readonly Shade: { };
}>;

const _RenderMode = Data.taggedEnum<_RenderMode>();

export { _RenderMode as RenderMode };

export namespace Default
{
    export/**
           * Default glyph used by fixed render mode.
           *
           * @since 1.0.0
           */
    const FixedCharacter: string = "█";

    export/**
           * Default density ramp used by shade render mode.
           *
           * @since 1.0.0
           */
    const ShadeRamp: string = " ░▒▓█";

    export/**
           * The default `RenderMode`.
           *
           * @since 1.0.0
           */
    const RenderMode: _RenderMode = _RenderMode.Fixed();
}
