/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * @module
 * General-purpose utility types and functions.
 * This module barrel-exports each scoped export of this package.
 * Use the scoped exports of this package to access only specific
 * utilities (*e.g.*, `async`, `npm`, *etc.*).
 */

export * as Async from "./Async/index.js";
export * as FileSystem from "./FileSystem/index.js";
export * as Functional from "./Functional/index.js";
export * as Npm from "./Npm/index.js";
export * as String from "./String/index.js";
export * as Miscellaneous from "./Miscellaneous/index.js";
