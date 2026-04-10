/* File:      index.Documentation.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * @groupDescription Internal
 * Content used internally by the {@link Hook} module.
 * This module (as well as the {@link Main} module) defines its functions
 * internally, then exports them cast to types that omit the `PackageKey`
 * type parameter.  This way, you do not need to specify the name of your
 * package with every hook call.
 *
 * @module Hook
 * The hooks provided by `electron-reactive-event`.
 */

export * from "./Hook.js";
export type * from "./Hook.Types.js";
export type * from "./Hook.Unscoped.Types.js";
export type * from "./Hook.Internal.js";
export * from "./Hook.Internal.Types.js";
