/**
 * @file      index.Documentation.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
 * The hooks provided by `reactive-event`.
 */

export * from "./Hook";
export type * from "./Hook.Types";
export type * from "./Hook.Internal";
export * from "./Hook.Internal.Types";
