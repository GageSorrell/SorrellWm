/**
 * General-purpose, MCP-agnostic mouse-input automation types.
 *
 * @module @sorrell/wm-api/Mouse
 *
 * @file      Mouse.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Schema } from "effect";

export/** A point in virtual-screen coordinates. */
const IntPointSchema = Schema.Struct({
    X: Schema.Int,
    Y: Schema.Int
});

/** A point in virtual-screen coordinates. */
export type IntPoint = typeof IntPointSchema.Type;

export/**
       * A mouse button, as a portable string enum. Consumers map this to
       * `@sorrell/windows`'s `VK.LBUTTON`/etc. virtual-key codes at their boundary.
       */
const MouseButtons = Object.freeze([ "Left", "Middle", "Right", "X1", "X2" ] as const);

export/** A mouse button, as a portable string enum. */
const MouseButtonSchema = Schema.Literals(MouseButtons);

/** A mouse button, as a portable string enum. */
export type MouseButton = typeof MouseButtonSchema.Type;
